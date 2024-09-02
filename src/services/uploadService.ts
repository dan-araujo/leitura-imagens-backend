import { Measure } from '../models/measure';
import { generateImageDescription } from './api/gemini';
import { executeQuery } from '../database/db';
import * as uuid from 'uuid';
import { imageUrlToBase64, getMimeType } from '../utils/imageUtils';
import { extname } from 'path';

export async function uploadMeasure(measureData: any): Promise<Measure> {
    const { image, customer_code, measure_datetime, measure_type } = measureData;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
        throw new Error('Dados inválidos: Todos os campos são obrigatórios.');
    }

    if (!Date.parse(measure_datetime)) {
        throw new Error('O formato do measure_datetime é inválido. (YYYY-MM-DD HH:MM:SS)');
    }

    if (!["WATER", "GAS"].includes(measure_type.toUpperCase())) {
        throw new Error('Tipo de medida inválido: deve ser WATER ou GAS');
    }

    try {
        let base64Image: string;
        let mimeType: string;

        if (image.startsWith('http://') || image.startsWith('https://')) {
            const imageData = await imageUrlToBase64(image);
            base64Image = imageData.base64;
            mimeType = imageData.mimeType;
        } else {
            const extension = extname(image);
            mimeType = getMimeType(extension);
            base64Image = image;
        }

        const existingMeasures = await executeQuery(
            `SELECT * FROM measures WHERE customer_code = ? AND measure_type = ? AND
            MONTH(measure_datetime) = MONTH(?) AND YEAR(measure_datetime) = YEAR(?)`,
            [customer_code, measure_type, measure_datetime, measure_datetime]
        );

        if (existingMeasures.length > 0) {
            console.log('Leitura existente encontrada. Lançando erro DOUBLE_REPORT.');
            throw new Error('DOUBLE_REPORT');
        }

        const description = await generateImageDescription(base64Image, mimeType);
        console.log('Descrição da imagem gerada:', description);

        const measure_value = extractMeasureValue(description);
        if (measure_value === null) {
            throw new Error(`Nenhum valor numérico encontrado na descrição: ${description}`);
        }

        const measure_uuid = generateUUID();

        await executeQuery(
            `INSERT INTO measures (measure_uuid, customer_code, measure_datetime, measure_type,
        measure_value, image, has_confirmed) VALUES (?, ?, ?, ?, ?, ?, false)`,
            [measure_uuid, customer_code, measure_datetime, measure_type,
                measure_value, base64Image, false]
        );

        return new Measure(
            measure_uuid,
            customer_code,
            measure_datetime,
            measure_type,
            description,
            base64Image,
            measure_value!
        );
    } catch (error: any) {
        if (error.message.includes('DOUBLE_REPORT')) {
            throw new Error('DOUBLE_REPORT');
        } else {
            throw new Error(`${error.message}`);
        }
    }
}

function extractMeasureValue(description: string): number | null {
    const regex = /\d+(\.\d+)?/;
    const match = description.match(regex);
    if (match) {
        return parseFloat(match[0]);
    } else {
        console.warn('Os dados fornecidos no corpo da requisição são inválidos: ', description);
        return null;
    }
}

function generateUUID(): string {
    return uuid.v4();
}
