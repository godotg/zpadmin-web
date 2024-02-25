import IByteBuffer from '../IByteBuffer';


class MidSelectRequest {

    category: string = '';
    index: number = 0;
    nonce: string = '';
    midjourneyId: number = 0;

    static PROTOCOL_ID: number = 274;

    protocolId(): number {
        return MidSelectRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidSelectRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.category);
        buffer.writeInt(packet.index);
        buffer.writeLong(packet.midjourneyId);
        buffer.writeString(packet.nonce);
    }

    static read(buffer: IByteBuffer): MidSelectRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidSelectRequest();
        const result0 = buffer.readString();
        packet.category = result0;
        const result1 = buffer.readInt();
        packet.index = result1;
        const result2 = buffer.readLong();
        packet.midjourneyId = result2;
        const result3 = buffer.readString();
        packet.nonce = result3;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidSelectRequest;
