import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class MarketRequest {
    num: number = 0;
}

export class MarketRequestRegistration implements IProtocolRegistration<MarketRequest> {
    protocolId(): number {
        return 213;
    }

    write(buffer: IByteBuffer, packet: MarketRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeInt(packet.num);
    }

    read(buffer: IByteBuffer): MarketRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new MarketRequest();
        const result0 = buffer.readInt();
        packet.num = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default MarketRequest;