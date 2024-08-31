import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateImageDescription(base64Image: string, mimeType: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = 'Descreva a imagem fornecida em português';

        console.log('Consultando a API Gemini...');

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: mimeType } }
        ]);

        const response = await result.response;
        const text = await response.text();
        console.log('Descrição da imagem: ', text);
        return text;
    } catch (error) {
        console.error('Erro ao consultar a API Gemini: ', error);
        console.error('Detalhes do erro da API Gemini: ', JSON.stringify(error, null, 2));
        throw new Error('Erro ao consultar a API Gemini.');
    }
}
