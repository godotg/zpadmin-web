

class GatewaySessionInactiveAsk {

    gatewayHostAndPort: string = '';
    sid: number = 0;
    uid: number = 0;

    static PROTOCOL_ID: number = 23;

    protocolId(): number {
        return GatewaySessionInactiveAsk.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GatewaySessionInactiveAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.gatewayHostAndPort);
        buffer.writeLong(packet.sid);
        buffer.writeLong(packet.uid);
    }

    static read(buffer: any): GatewaySessionInactiveAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new GatewaySessionInactiveAsk();
        const result0 = buffer.readString();
        packet.gatewayHostAndPort = result0;
        const result1 = buffer.readLong();
        packet.sid = result1;
        const result2 = buffer.readLong();
        packet.uid = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default GatewaySessionInactiveAsk;
