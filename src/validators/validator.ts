import { DateTime } from 'luxon';

export function validateMeasureData(data: any): { valid: boolean, errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    let valid = true;

    if (!data.customer_code || typeof data.customer_code !== 'string') {
        valid = false;
        errors.customer_code = ['O campo customer_code deve ser digitado.'];
    }

    if (!data.measure_datetime || !DateTime.fromFormat(data.measure_datetime, 'yyyy-MM-dd HH:mm:ss').isValid) {
        valid = false;
        errors.measure_datetime = ['O campo measure_datetime deve estar no formato YYYY-MM-DD HH:mm:ss']
    }

    if (!data.measure_type || !['WATER', 'GAS'].includes(data.measure_type?.toUpperCase())) {
        valid = false;
        errors.measure_type = ['O campo measure_type deve ser WATER ou GAS'];
    }

    const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!data.image || typeof data.image !== 'string' || !base64Regex.test(data.image)) {
        valid = false;
        errors.image = ['O campo image deve ser uma string em base64 válida.']
    }

    return { valid, errors };
}