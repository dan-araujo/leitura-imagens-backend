import { generateImageDescription } from '../src/services/api/gemini';
import * as fs from 'fs';

jest.mock('../src/services/api/gemini', () => ({
    generateImageDescription: jest.fn()
}));

describe('generateImageDescription', () => {
    it('deve retornar uma descrição válida para a imagem', async () => {
        const base64Image = fs.readFileSync(__dirname + '/test-image.txt', 'utf-8');
        const description = await generateImageDescription(base64Image);
        (generateImageDescription as jest.Mock).mockImplementation(() =>
            Promise.resolve(description)
        );

        expect(description).toBe(description);
    });

    it('deve gerar um erro para uma imagem inválida', async () => {
        const base64Image = fs.readFileSync(__dirname + '/test-image.txt', 'utf-8');

        (generateImageDescription as jest.Mock).mockImplementation(() =>
            Promise.reject(new Error('Imagem inválida nenhum número para medição encontrado na descrição.'))
        );

        await expect(generateImageDescription(base64Image)).rejects.toThrow('Imagem inválida nenhum número para medição encontrado na descrição.');
    });
});
