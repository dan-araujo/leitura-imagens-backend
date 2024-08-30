import { Router } from 'express';
import { uploadMeasure } from '../services/uploadService';
import { validateMeasureData } from '../validators/validator';

const router = Router();

router.post('/upload', async (req, res) => {
    const { valid, errors } = validateMeasureData(req.body);

    if (!valid) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: errors
        });
    }

    try {

        const measure = await uploadMeasure(req.body);
        res.status(200).json({
            measure_uuid: measure.measure_uuid,
            image_url: measure.image,
            measure_value: measure.measure_value
        });

    } catch (error: unknown) {
        console.error('Erro ao processar o upload: ', error);
        if (error instanceof Error) {
            if (error.message.includes('DOUBLE_REPORT')) {
                res.status(409).json({
                    error_code: 'DOUBLE_REPORT',
                    error_description: 'Leitura do mês já realizada'
                });
            } else {
                res.status(400).json({
                    error_code: 'INVALID_DATA',
                    error_description: error.message
                });
            }
        } else {
            res.status(500).json({
                error_code: 'UNKNOWN_ERROR',
                error_description: "Ocorreu um erro desconhecido."
            });
        }
    }
});

export const uploadRouter = router;