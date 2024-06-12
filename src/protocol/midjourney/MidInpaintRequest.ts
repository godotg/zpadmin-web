import IByteBuffer from '../IByteBuffer';

class MidInpaintRequest {
    nonce: string = '';
    midjourneyId: number = 0;

    static PROTOCOL_ID: number = 277;

    protocolId(): number {
        return MidInpaintRequest.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidInpaintRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.midjourneyId);
        buffer.writeString(packet.nonce);
    }

    static read(buffer: IByteBuffer): MidInpaintRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidInpaintRequest();
        const result0 = buffer.readLong();
        packet.midjourneyId = result0;
        const result1 = buffer.readString();
        packet.nonce = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidInpaintRequest;