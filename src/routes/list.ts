import { Router } from 'express';
import { listMeasures } from '../services/listService';

const router = Router();

router.get('/:customer_code/list', async (req, res) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query

    try {
        if (measure_type && typeof measure_type === 'string') {
            const upperMeasureType = measure_type.toUpperCase();
            if (upperMeasureType !== 'WATER' && upperMeasureType !== 'GAS') {
                return res.status(400).json({
                    error_code: 'INVALID_TYPE',
                    error_description: 'Tipo de medição não permitido.'
                });
            }
        }

        const measures = await listMeasures(customer_code, measure_type as string);

        if (measures.length === 0) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada.'
            });
        }


        return res.status(200).json({
            customer_code,
            measures
        });
    } catch (error: unknown) {
        console.error('Erro ao listar as leituras: ', error);

        if (error instanceof Error && error.message === 'INVALID_TYPE') {
            return res.status(400).json({
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitido.'
            });
        }

        return res.status(500).json({
            error_code: 'UNKNOWN_ERROR',
            error_description: 'Ocorreu um erro desconhecido.'
        });
    }
});

export const listRouter = router;