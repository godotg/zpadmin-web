import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class EastMoneyRank {
    code: number = 0;
    name: string = '';
}

export class EastMoneyRankRegistration implements IProtocolRegistration<EastMoneyRank> {
    protocolId(): number {
        return 225;
    }

    write(buffer: IByteBuffer, packet: EastMoneyRank | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.code);
        buffer.writeString(packet.name);
    }

    read(buffer: IByteBuffer): EastMoneyRank | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new EastMoneyRank();
        const result0 = buffer.readInt();
        packet.code = result0;
        const result1 = buffer.readString();
        packet.name = result1;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default EastMoneyRank;