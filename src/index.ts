import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { uploadRouter } from './routes/upload';
import { confirmRouter } from './routes/confirm';
import { listRouter } from './routes/list';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/measures', uploadRouter);
app.use('/measures', confirmRouter);
app.use('/measures', listRouter);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
