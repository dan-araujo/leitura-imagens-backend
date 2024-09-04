import request from 'supertest';
import { app } from '../../src/index';
import { executeQuery } from '../../src/database/db';
import '../testEnvironmentSetup';

jest.mock('../../src/database/db', () => ({
    executeQuery: jest.fn()
}));

describe('GET /measures/:customer_code/list', () => {

    it('deve retornar 200 e listar as medições do cliente', async () => {
        (executeQuery as jest.Mock).mockResolvedValue([
            {
                measure_uuid: 'uuid-1234',
                measure_datetime: '2024-02-03 12:20:30',
                measure_type: 'WATER',
                has_confirmed: true,
                image_url: 'https://static.paodeacucar.com/img/uploads/1/959/12743959.jpeg'
            },
            {
                measure_uuid: 'uuid-5678',
                measure_datetime: '2024-02-04 12:25:32',
                measure_type: 'GAS',
                has_confirmed: false,
                image_url: 'https://conceicaogaseagua.com.br/wp-content/uploads/2023/10/gas-p13-768x731.png'
            }
        ]);

        const response = await request(app).get('/measures/12345/list').query(
            { measure_type: 'WATER' }
        );

        expect(response.status).toBe(200);
        expect(response.body.customer_code).toBe('12345');
        expect(response.body.measures).toHaveLength(2);
    });

    it('deve retornar 400 se o tipo de medida for inválido', async () => {
        const response = await request(app).get('/measures/12345/list?measure_type=INVALID');

        expect(response.status).toBe(400);
        expect(response.body.error_code).toBe('INVALID_TYPE');
    });

    it('deve retornar 404 se não houver medições para o cliente', async () => {
        (executeQuery as jest.Mock).mockResolvedValue([]);

        const response = await request(app).get('/measures/12345/list');

        expect(response.status).toBe(404);
        expect(response.body.error_code).toBe('MEASURE_NOT_FOUND');
    })
});