import { Router } from 'express';
import { confirmMeasure } from '../services/confirmService';

const router = Router();

router.patch('/confirm', async (req, res) => {
    const { measure_uuid, confirmed_value } = req.body;

    if (typeof measure_uuid !== 'string' || typeof confirmed_value !== 'number') {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os dados fornecidos no corpo da requisição são inválidos.'
        });
    }

    try {
        const result = await confirmMeasure(measure_uuid, confirmed_value);
        if (result === 'MEASURE_NOT_FOUND') {
            res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura não encontrada'
            });
        } else if (result === 'CONFIRMATION_DUPLICATE') {
            res.status(409).json({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura já confirmada'
            });
        } else if (result === 'SUCCESS') {
            res.status(200).json({
                success: true
            });
        }
    } catch (error: unknown) {
        console.error('Erro ao confirmar a leitura: ', error);
        res.status(500).json({
            error_code: 'UNKNOWN_ERROR',
            error_description: 'Ocorreu um erro desconhecido.'
        });
    }
});

export const confirmRouter = router;
