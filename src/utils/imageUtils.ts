import axios from "axios";
import { Buffer } from "buffer";

export function getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp'
    };
    return mimeTypes[extension.toLocaleLowerCase()] || 'application/octotet-stream';
}

export async function imageUrlToBase64(url: string): Promise<{ base64: string, mimeType: string }> {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const extension = url.substring(url.lastIndexOf('.'));
        const mimeType = getMimeType(extension);
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        return { base64: base64Image, mimeType };
    } catch (error) {
        console.error('Erro ao converter a imagem para base64: ', error);
        throw error;
    }
}
