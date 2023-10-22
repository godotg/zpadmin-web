

class SdHistoryRequest {

    nonce: number = 0;

    static PROTOCOL_ID: number = 342;

    protocolId(): number {
        return SdHistoryRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdHistoryRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.nonce);
    }

    static read(buffer: any): SdHistoryRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SdHistoryRequest();
        const result0 = buffer.readLong();
        packet.nonce = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SdHistoryRequest;
