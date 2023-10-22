

class ImageDownloadResponse {

    realUrl: string = '';

    static PROTOCOL_ID: number = 346;

    protocolId(): number {
        return ImageDownloadResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: ImageDownloadResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.realUrl);
    }

    static read(buffer: any): ImageDownloadResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new ImageDownloadResponse();
        const result0 = buffer.readString();
        packet.realUrl = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default ImageDownloadResponse;
