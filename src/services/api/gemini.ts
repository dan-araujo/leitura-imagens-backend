import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateImageDescription(base64Image: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = 'Descreva a imagem fornecida';

    try {
        console.log('Consultando a API Gemini...');

        // Enviar diretamente a imagem base64 para a API.
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: 'image/jpg' } }
        ]);

        const response = await result.response;
        const text = await response.text();
        console.log('Descrição da imagem: ', text);
        return text;
    } catch (error) {
        console.error('Erro ao consultar a API Gemini: ', error);
        throw new Error('Erro ao consultar a API Gemini.');
    }
}
