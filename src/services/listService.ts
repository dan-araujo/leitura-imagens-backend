import { executeQuery } from '../database/db';

export async function listMeasures(customer_code: string, measure_type?: string) {
    let query
        = `SELECT measure_uuid, measure_datetime, measure_type, has_confirmed, image
     FROM measures WHERE customer_code = ?`;
    const params: (string | boolean)[] = [customer_code];

    if (measure_type) {
        const upperMeasureType = measure_type.toUpperCase();
        if (upperMeasureType !== 'WATER' && upperMeasureType !== 'GAS') {
            throw new Error('INVALID_TYPE');
        }
        query += ` AND measure_type = ?`;
        params.push(measure_type.toUpperCase());
    }

    const results = await executeQuery(query, params);

    return results;
}