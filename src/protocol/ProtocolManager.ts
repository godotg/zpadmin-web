import SignalAttachment from './attachment/SignalAttachment';
import SignalOnlyAttachment from './attachment/SignalOnlyAttachment';
import GatewayAttachment from './attachment/GatewayAttachment';
import UdpAttachment from './attachment/UdpAttachment';
import HttpAttachment from './attachment/HttpAttachment';
import NoAnswerAttachment from './attachment/NoAnswerAttachment';
import AuthUidToGatewayCheck from './model/AuthUidToGatewayCheck';
import AuthUidToGatewayConfirm from './model/AuthUidToGatewayConfirm';
import AuthUidAsk from './model/AuthUidAsk';
import GatewaySessionInactiveAsk from './model/GatewaySessionInactiveAsk';
import GatewaySynchronizeSidAsk from './model/GatewaySynchronizeSidAsk';
import Message from './common/Message';
import Error from './common/Error';
import Heartbeat from './common/Heartbeat';
import Ping from './common/Ping';
import Pong from './common/Pong';
import PairIntLong from './common/PairIntLong';
import PairLong from './common/PairLong';
import PairString from './common/PairString';
import PairLS from './common/PairLS';
import TripleLong from './common/TripleLong';
import TripleString from './common/TripleString';
import TripleLSS from './common/TripleLSS';
import News from './news/News';
import NewsStock from './news/NewsStock';
import NewsIndustry from './news/NewsIndustry';
import NewsRequest from './news/NewsRequest';
import NewsResponse from './news/NewsResponse';
import NewsOneRequest from './news/NewsOneRequest';
import NewsOneResponse from './news/NewsOneResponse';
import GaiNian from './gn/GaiNian';
import GnRequest from './gn/GnRequest';
import GnResponse from './gn/GnResponse';
import ChatgptMessageRequest from './chatgpt/ChatgptMessageRequest';
import ChatgptMessageNotice from './chatgpt/ChatgptMessageNotice';
import ChatgptForceStopRequest from './chatgpt/ChatgptForceStopRequest';
import ChatMessage from './chat/ChatMessage';
import GroupChatNotice from './chat/GroupChatNotice';
import GroupChatRequest from './chat/GroupChatRequest';
import GroupHistoryMessageRequest from './chat/GroupHistoryMessageRequest';
import GroupHistoryMessageResponse from './chat/GroupHistoryMessageResponse';
import LoginRequest from './auth/LoginRequest';
import LoginResponse from './auth/LoginResponse';

const protocols = new Map<number, any>();

// initProtocol
protocols.set(0, SignalAttachment);
protocols.set(1, SignalOnlyAttachment);
protocols.set(2, GatewayAttachment);
protocols.set(3, UdpAttachment);
protocols.set(4, HttpAttachment);
protocols.set(5, NoAnswerAttachment);
protocols.set(20, AuthUidToGatewayCheck);
protocols.set(21, AuthUidToGatewayConfirm);
protocols.set(22, AuthUidAsk);
protocols.set(23, GatewaySessionInactiveAsk);
protocols.set(24, GatewaySynchronizeSidAsk);
protocols.set(100, Message);
protocols.set(101, Error);
protocols.set(102, Heartbeat);
protocols.set(103, Ping);
protocols.set(104, Pong);
protocols.set(110, PairIntLong);
protocols.set(111, PairLong);
protocols.set(112, PairString);
protocols.set(113, PairLS);
protocols.set(114, TripleLong);
protocols.set(115, TripleString);
protocols.set(116, TripleLSS);
protocols.set(200, News);
protocols.set(201, NewsStock);
protocols.set(202, NewsIndustry);
protocols.set(203, NewsRequest);
protocols.set(204, NewsResponse);
protocols.set(205, NewsOneRequest);
protocols.set(206, NewsOneResponse);
protocols.set(220, GaiNian);
protocols.set(221, GnRequest);
protocols.set(222, GnResponse);
protocols.set(230, ChatgptMessageRequest);
protocols.set(231, ChatgptMessageNotice);
protocols.set(232, ChatgptForceStopRequest);
protocols.set(240, ChatMessage);
protocols.set(241, GroupChatNotice);
protocols.set(242, GroupChatRequest);
protocols.set(243, GroupHistoryMessageRequest);
protocols.set(244, GroupHistoryMessageResponse);
protocols.set(250, LoginRequest);
protocols.set(251, LoginResponse);

class ProtocolManager {
    static getProtocol(protocolId: number): any {
        const protocol = protocols.get(protocolId);
        if (protocol === null) {
            throw '[protocolId:' + protocolId + ']协议不存在';
        }
        return protocol;
    }

    static write(buffer: any, packet: any): void {
        const protocolId = packet.protocolId();
        buffer.writeShort(protocolId);
        const protocol = ProtocolManager.getProtocol(protocolId);
        protocol.write(buffer, packet);
    }

    static read(buffer: any): any {
        const protocolId = buffer.readShort();
        const protocol = ProtocolManager.getProtocol(protocolId);
        const packet = protocol.read(buffer);
        return packet;
    }
}

export default ProtocolManager;
