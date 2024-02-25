import IByteBuffer from '../IByteBuffer';


class UdpAttachment {

    host: string = '';
    port: number = 0;

    static PROTOCOL_ID: number = 3;

    protocolId(): number {
        return UdpAttachment.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: UdpAttachment | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.host);
        buffer.writeInt(packet.port);
    }

    static read(buffer: IByteBuffer): UdpAttachment | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new UdpAttachment();
        const result0 = buffer.readString();
        packet.host = result0;
        const result1 = buffer.readInt();
        packet.port = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default UdpAttachment;
