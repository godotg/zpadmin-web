import News from './News';


class NewsOneResponse {

    news: News | null = null;

    static PROTOCOL_ID: number = 206;

    protocolId(): number {
        return NewsOneResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: NewsOneResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.news, 200);
    }

    static read(buffer: any): NewsOneResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new NewsOneResponse();
        const result0 = buffer.readPacket(200);
        packet.news = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default NewsOneResponse;
