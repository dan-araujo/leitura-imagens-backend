import request from 'supertest';
import { app } from '../../src/index';
import { confirmMeasure } from '../../src/services/confirmService';
import { executeQuery } from '../../src/database/db';
import '../testEnvironmentSetup';

const mockConfirmedValue = 123;

jest.mock('../../src/database/db', () => ({
    executeQuery: jest.fn()
}));

jest.mock('../../src/services/confirmService', () => ({
    confirmMeasure: jest.fn()
}));

describe('PATCH /confirm', () => {
    it('deve retornar 400 se o uuid da medida ou o seu valor confirmado não for um número', async () => {
        const response = await request(app)
            .patch('/measures/confirm')
            .send({
                measure_uuid: mockConfirmedValue,
                confirmed_value: 'not-a-number'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
        expect(response.body.error_description).toEqual('Os dados fornecidos no corpo da requisição são inválidos.');
    });

    it('deve retornar 404 se a leitura informada não existir', async () => {
        (confirmMeasure as jest.Mock).mockResolvedValue('MEASURE_NOT_FOUND');

        const response = await request(app)
            .patch('/measures/confirm')
            .send({
                measure_uuid: 'non_existent_uuid',
                confirmed_value: mockConfirmedValue
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error_code', 'MEASURE_NOT_FOUND');
        expect(response.body.error_description).toEqual('Leitura não encontrada');
    });

    it('deve retornar 409 se o código de leitura já foi confirmada', async () => {
        (confirmMeasure as jest.Mock).mockResolvedValue('CONFIRMATION_DUPLICATE');

        const response = await request(app)
            .patch('/measures/confirm')
            .send({
                measure_uuid: 'already_confirmed_uuid',
                confirmed_value: mockConfirmedValue
            });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error_code', 'CONFIRMATION_DUPLICATE');
        expect(response.body.error_description).toEqual('Leitura já confirmada');
    });

    it('deve retornar 200 se a leitura for confirmada com sucesso e salvar o novo valor no banco de dados', async () => {
        (confirmMeasure as jest.Mock).mockImplementation(async (uuid: string, value: number) => {

            await executeQuery(
                'UPDATE measures SET has_confirmed = true, confirmed_value = ? WHERE measure_uuid = ?',
            );
            return 'SUCCESS';
        });

        const uuid = 'valid_uuid';
        const confirmedValue = mockConfirmedValue;

        const response = await request(app)
            .patch('/measures/confirm')
            .send({
                measure_uuid: uuid,
                confirmed_value: confirmedValue
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);

        (executeQuery as jest.Mock).mockResolvedValue([{ confirmed_value: confirmedValue }]);

        const result = await executeQuery(
            'SELECT confirmed_value FROM measures WHERE measure_uuid = ?',
            [uuid]
        );

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].confirmed_value).toBe(confirmedValue);
    });
});