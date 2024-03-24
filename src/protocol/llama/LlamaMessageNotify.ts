import IByteBuffer from '../IByteBuffer';
import ChatgptMessageNotice from '../chatgpt/ChatgptMessageNotice';


class LlamaMessageNotify {

    noticeSid: number = 0;
    notice: ChatgptMessageNotice | null = null;

    static PROTOCOL_ID: number = 403;

    protocolId(): number {
        return LlamaMessageNotify.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: LlamaMessageNotify | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.notice, 231);
        buffer.writeLong(packet.noticeSid);
    }

    static read(buffer: IByteBuffer): LlamaMessageNotify | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LlamaMessageNotify();
        const result0 = buffer.readPacket(231);
        packet.notice = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LlamaMessageNotify;