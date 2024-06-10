import IByteBuffer from '../IByteBuffer';
import MidZoomRequest from '../midjourney/MidZoomRequest';

class MidZoomAsk {
    requestSid: number = 0;
    request: MidZoomRequest | null = null;

    static PROTOCOL_ID: number = 307;

    protocolId(): number {
        return MidZoomAsk.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: MidZoomAsk | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.request, 276);
        buffer.writeLong(packet.requestSid);
    }

    static read(buffer: IByteBuffer): MidZoomAsk | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MidZoomAsk();
        const result0 = buffer.readPacket(276);
        packet.request = result0;
        const result1 = buffer.readLong();
        packet.requestSid = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MidZoomAsk;