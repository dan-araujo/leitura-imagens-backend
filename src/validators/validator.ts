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

   if(!data.image || typeof data.image !== 'string' || !isBase64(data.image) && !isValidUrl(data.image)) {
    valid = false;
    errors.image = ['O campo image deve ser uma url de imagem válida'];
   }

    return { valid, errors };
}

function isBase64(base64Txt: string): boolean {
    const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return base64Regex.test(base64Txt);
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}