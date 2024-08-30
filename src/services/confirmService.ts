import { executeQuery } from "../database/db";

export async function measureExists(measure_uuid: string): Promise<boolean> {
    const resultsMeasure = await executeQuery(
        `SELECT COUNT(*) AS count FROM measures WHERE measure_uuid = ?`,
        [measure_uuid]
    );
    return resultsMeasure[0].count > 0;
}

export async function confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<string> {
    const exists = await measureExists(measure_uuid);
    if (!exists) {
        return 'MEASURE_NOT_FOUND';
    }

    if (!measure_uuid || typeof measure_uuid !== 'string' || isNaN(confirmed_value)) {
        throw new Error('INVALID_DATA');
    }

    const [existingMeasures] = await executeQuery(
        `SELECT * FROM measures WHERE measure_uuid = ?`,
        [measure_uuid]
    );

    if (existingMeasures[0].has_confirmed) {
        throw new Error('CONFIRMATION_DUPLICATE');
    }

    await executeQuery(
        `UPDATE measures SET measure_value = ?, has_confirmed = true WHERE measure_uuid = ?`,
        [confirmed_value, measure_uuid]
    );

    return 'SUCCESS';
}


