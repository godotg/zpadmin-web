import IByteBuffer from '../IByteBuffer';


class BrokerRegisterAnswer {

    

    static PROTOCOL_ID: number = 301;

    protocolId(): number {
        return BrokerRegisterAnswer.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: BrokerRegisterAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): BrokerRegisterAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new BrokerRegisterAnswer();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default BrokerRegisterAnswer;
