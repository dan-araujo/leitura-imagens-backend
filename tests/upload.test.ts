import request from 'supertest';
import { app, server } from '../src/index';
import { executeQuery } from '../src/database/db';

const imageParam = 'https://static.paodeacucar.com/img/uploads/1/959/12743959.jpeg';
const customerCodeParam = '123';
const measureDateTimeParam = '2024-09-01 12:00:00';
const measureTypeParam = 'WATER';

let mockSelectResponse: { measure_uuid: string }[] = [];

jest.mock('mysql2', () => ({
    createConnection: jest.fn().mockReturnValue({
        connect: jest.fn(),
        end: jest.fn(),
        query: jest.fn().mockImplementation((query, values, callback) => {
            console.log('Query executada:', query);
            if (query.includes('SELECT * FROM measures')) {
                callback(null, mockSelectResponse);
            } else if (query.includes('INSERT INTO measures')) {
                callback(null, { affectedRows: 1 });
            } else {
                callback(null, []);
            }
        }),
    }),
}));


beforeAll(async () => {
    if (!server.listening) {
        await new Promise<void>((resolve) => server.listen(resolve));
    }

    await executeQuery('DELETE FROM measures');
});

afterAll(async () => {
    await new Promise<void>((resolve) => {
        server.close(() => {
            resolve();
        });
    });
});

describe('POST /upload', () => {
    it('deve retornar 400 se os dados enviados forem inválidos', async () => {
        const response = await request(app)
            .post('/measures/upload')
            .send({
                image: '',
                customer_code: '',
                measure_datetime: '',
                measure_type: ''
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
        expect(response.body.error_description).toEqual({
            customer_code: ["O campo customer_code deve ser digitado."],
            image: ["O campo image deve ser uma url de imagem válida"],
            measure_datetime: ["O campo measure_datetime deve estar no formato YYYY-MM-DD HH:mm:ss"],
            measure_type: ["O campo measure_type deve ser WATER ou GAS"]
        });
    });

    it('deve retornar 400 se o formato de data da medição for errado', async () => {
        const response = await request(app)
            .post('/measures/upload')
            .send({
                image: imageParam,
                customer_code: customerCodeParam,
                measure_datetime: 'invalid-date',
                measure_type: measureTypeParam
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
        expect(response.body.error_description).toEqual({
            measure_datetime: ["O campo measure_datetime deve estar no formato YYYY-MM-DD HH:mm:ss"]
        });
    });

    it('deve retornar 400 se o tipo de medida for inválido', async () => {
        const response = await request(app)
            .post('/measures/upload')
            .send({
                image: imageParam,
                customer_code: customerCodeParam,
                measure_datetime: measureDateTimeParam,
                measure_type: 'INVALID'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error_code', 'INVALID_DATA');
        expect(response.body.error_description).toEqual({
            measure_type: ["O campo measure_type deve ser WATER ou GAS"]
        });
    });

    it('deve retornar 200 se o upload da imagem for bem-sucedido', async () => {
        const response = await request(app)
            .post('/measures/upload')
            .send({
                image: imageParam,
                customer_code: customerCodeParam,
                measure_datetime: measureDateTimeParam,
                measure_type: measureTypeParam
            });

        expect(response.status).toBe(200);
    });

    it('deve retornar 409 se a leitura do mês já foi realizada', async () => {
        mockSelectResponse = [{ measure_uuid: 'existing-uuid' }];
        const response = await request(app)
            .post('/measures/upload')
            .send({
                image: imageParam,
                customer_code: customerCodeParam,
                measure_datetime: measureDateTimeParam,
                measure_type: measureTypeParam
            });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error_code', 'DOUBLE_REPORT');
        expect(response.body).toHaveProperty('error_description', 'Leitura do mês já realizada');
    });
});
