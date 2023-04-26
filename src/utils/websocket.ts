import ByteBuffer from '@/protocol/buffer/ByteBuffer';
import SignalOnlyAttachment from '@/protocol/attachment/SignalOnlyAttachment';
import ProtocolManager from '@/protocol/ProtocolManager.js';
import Error from '@/protocol/common/Error.js';
import Message from '@/protocol/common/Message.js';
import Ping from '@/protocol/common/Ping';
import Pong from '@/protocol/common/Pong';
import {useSnackbarStore} from "@/stores/snackbarStore";

const snackbarStore = useSnackbarStore();


const wsUrl: string = import.meta.env.VITE_API_BASE_URL;
let pingTime: number = 0;
let ws: WebSocket = connect("init websocket");
let uuid: number = 0;

const signalAttachmentMap: Map<number, EncodedPacketInfo> = new Map<number, EncodedPacketInfo>();

// 每30秒发送一次心跳包
setInterval(() => reconnect(), 10 * 1000);

setInterval(() => send(new Ping()), 30 * 1000);

// 如果服务器长时间没有回应，则重新连接
function reconnect() {
  if (new Date().getTime() - pingTime < 60 * 1000) {
    return;
  }
  snackbarStore.showInfoMessage("正在连接服务器");
  ws = connect("timeout and reconnect");
}

// readyState的状态码定义
// 0 (CONNECTING)，正在链接中
// 1 (OPEN)，已经链接并且可以通讯
// 2 (CLOSING)，连接正在关闭
// 3 (CLOSED)，连接已关闭或者没有链接成功
function connect(desc): WebSocket {
  console.log('start connect websocket: ' + desc);

  const webSocket = new WebSocket(wsUrl);

  webSocket.binaryType = 'arraybuffer';

  webSocket.onopen = function () {
    console.log('websocket open success');

    // websocket连接成功过后，先发送ping同步服务器时间，再发送登录请求
    send(new Ping());

    snackbarStore.showSuccessMessage("连接服务器成功");
    pingTime = new Date().getTime();
  };


  webSocket.onmessage = function (event) {
    const data = event.data;

    const buffer = new ByteBuffer();
    buffer.writeBytes(data);
    buffer.setReadOffset(4);
    const packet = ProtocolManager.read(buffer);
    let attachment: any = null;
    if (buffer.isReadable() && buffer.readBoolean()) {
      console.log(new Date(), "Websocket收到异步response:", packet);
      attachment = ProtocolManager.read(buffer);
      const encodedPacketInfo = signalAttachmentMap.get(attachment.signalId);
      if (encodedPacketInfo == undefined) {
        throw "可能消息超时找不到对应的SignalAttachment:" + attachment;
      }
      encodedPacketInfo.promiseResolve(packet);
      return;
    }
    console.log(new Date(), "Websocket收到同步response:", packet);
    if (packet.protocolId() == Pong.PROTOCOL_ID) {
      if (Number.isInteger(packet.time)) {
        pingTime = packet.time;
      } else {
        pingTime = Number.parseInt(packet.time);
      }
    } else if (packet.protocolId() == Message.PROTOCOL_ID) {
      if (packet.code == 1) {
        snackbarStore.showSuccessMessage(packet.message);
      } else if (packet.code == 2) {
        // do noting
      } else {
        snackbarStore.showErrorMessage(packet.message);
      }
    } else if (packet.protocolId() == Error.PROTOCOL_ID) {
      snackbarStore.showErrorMessage(packet.messerrorMessageage);
    } else {
      ProtocolManager.getProtocol(packet.protocolId()).receiver(packet);
    }
  };

  webSocket.onerror = function (event) {
    pingTime = 0;
    console.log('websocket error');
    console.log(event);
  };

  webSocket.onclose = function (event) {
    pingTime = 0;
    console.log('websocket close');
    console.log(event);
  };
  return webSocket;
}

export function isWebsocketReady(): boolean {
  return ws.readyState == 1;
}

export function send(packet: any, attachment: any = null) {
  switch (ws.readyState) {
    case 0:
      console.log("0, ws connecting server");
      snackbarStore.showWarningMessage("正在连接服务器");
      break;
    case 1:
      const buffer = new ByteBuffer();
      buffer.setWriteOffset(4);
      ProtocolManager.write(buffer, packet);
      if (attachment == null) {
        buffer.writeBoolean(false);
        console.log(new Date(), "Websocket发送同步request:", packet)
      } else {
        buffer.writeBoolean(true);
        ProtocolManager.write(buffer, attachment)
        console.log(new Date(), "Websocket发送异步request:", packet)
      }
      const writeOffset = buffer.writeOffset;
      buffer.setWriteOffset(0);
      buffer.writeRawInt(writeOffset - 4);
      buffer.setWriteOffset(writeOffset);
      ws.send(buffer.buffer);
      break;
    case 2:
      pingTime = 0;
      console.log("2, ws is closing, trying to reconnect");
      break;
    case 3:
      pingTime = 0;
      console.log("3, ws is closing, trying to reconnect");
      break;
    default:
      console.log("4, server error");
      snackbarStore.showErrorMessage("server error");
  }
}

class EncodedPacketInfo {
  promiseResolve: any;
  promiseReject: any;
  attachment: SignalOnlyAttachment;
}

export async function asyncAsk(packet: any): Promise<any> {
  const currentTime = new Date().getTime();
  const attachment: SignalOnlyAttachment = new SignalOnlyAttachment();
  uuid++;
  const signalId = uuid;
  attachment.timestamp = currentTime;
  attachment.signalId = signalId;
  const encodedPacketInfo = new EncodedPacketInfo();
  encodedPacketInfo.attachment = attachment;
  const promise = new Promise((resolve, reject) => {
    encodedPacketInfo.promiseResolve = resolve;
    encodedPacketInfo.promiseReject = reject;
  });
  // 遍历删除旧的attachment
  for (const key of signalAttachmentMap.keys()) {
    const value = signalAttachmentMap.get(key);
    if ((value != null) && (currentTime - value.attachment.timestamp > 60000)) {
      signalAttachmentMap.delete(key);
    }
  }
  signalAttachmentMap.set(signalId, encodedPacketInfo);
  send(packet, attachment);
  return promise;
}
