import IByteBuffer from '../IByteBuffer';


class NewsIndustry {

    name: string = '';
    code: number = 0;
    rise: string = '';

    static PROTOCOL_ID: number = 202;

    protocolId(): number {
        return NewsIndustry.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: NewsIndustry | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.code);
        buffer.writeString(packet.name);
        buffer.writeString(packet.rise);
    }

    static read(buffer: IByteBuffer): NewsIndustry | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new NewsIndustry();
        const result0 = buffer.readInt();
        packet.code = result0;
        const result1 = buffer.readString();
        packet.name = result1;
        const result2 = buffer.readString();
        packet.rise = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default NewsIndustry;
