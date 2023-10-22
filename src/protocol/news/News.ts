import NewsStock from './NewsStock';
import NewsIndustry from './NewsIndustry';


class News {

    id: number = 0;
    level: string = '';
    title: string = '';
    content: string = '';
    ctime: string = '';
    stocks: Array<NewsStock> = [];
    industries: Array<NewsIndustry> = [];
    subjects: Array<string> = [];

    static PROTOCOL_ID: number = 200;

    protocolId(): number {
        return News.PROTOCOL_ID;
    }

    static write(buffer: any, packet: News | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.content);
        buffer.writeString(packet.ctime);
        buffer.writeLong(packet.id);
        buffer.writePacketList(packet.industries, 202);
        buffer.writeString(packet.level);
        buffer.writePacketList(packet.stocks, 201);
        buffer.writeStringList(packet.subjects);
        buffer.writeString(packet.title);
    }

    static read(buffer: any): News | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new News();
        const result0 = buffer.readString();
        packet.content = result0;
        const result1 = buffer.readString();
        packet.ctime = result1;
        const result2 = buffer.readLong();
        packet.id = result2;
        const list3 = buffer.readPacketList(202);
        packet.industries = list3;
        const result4 = buffer.readString();
        packet.level = result4;
        const list5 = buffer.readPacketList(201);
        packet.stocks = list5;
        const list6 = buffer.readStringList();
        packet.subjects = list6;
        const result7 = buffer.readString();
        packet.title = result7;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default News;
