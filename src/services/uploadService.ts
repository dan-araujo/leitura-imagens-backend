import { Measure } from '../models/measure';
import { generateImageDescription } from './api/gemini';
import { executeQuery } from '../database/db';
import * as uuid from 'uuid';

export async function uploadMeasure(measureData: any): Promise<Measure> {
    const { image, customer_code, measure_datetime, measure_type } = measureData;

    console.log('Dados recebidos:', measureData);

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

        console.log('Executando a query de verificação de medidas existentes...');
        const existingMeasures = await executeQuery(
            `SELECT * FROM measures WHERE customer_code = ? AND measure_type = ? AND
            MONTH(measure_datetime) = MONTH(?) AND YEAR(measure_datetime) = YEAR(?)`,
            [customer_code, measure_type, measure_datetime, measure_datetime]
        );
        console.log('Medidas existentes verificadas:', existingMeasures);

        if (existingMeasures.length > 0) {
            throw new Error('DOUBLE_REPORT');
        }

        console.log('Gerando descrição da imagem...');
        const description = await generateImageDescription(image);
        console.log('Descrição da imagem gerada:', description);

        const measure_value = extractMeasureValue(description);
        if (measure_value === null) {
            throw new Error(`Nenhum valor numérico encontrado na descrição: ${description}`);
        }

        const measure_uuid = generateUUID();

        console.log('Inserindo nova medida no banco de dados...');
        await executeQuery(
            `INSERT INTO measures (measure_uuid, customer_code, measure_datetime, measure_type,
        measure_value, image, has_confirmed) VALUES (?, ?, ?, ?, ?, ?, false)`,
            [measure_uuid, customer_code, measure_datetime, measure_type,
                measure_value, image, false]
        );
        console.log('Nova medida inserida com sucesso.');

        return new Measure(
            measure_uuid,
            customer_code,
            measure_datetime,
            measure_type,
            description,
            image,
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


