import express, { Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes';
import errorHandler from './middlewares/errors.middleware';
import { AppDataSource } from './data-source';

// LOAD ENVIRONMENT VARIABLES
const { PORT = 8080 } = process.env;

// CREATE EXPRESS APP
const app: Application = express();

// MIDDLEWARES
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/api', routes);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => {
    console.error('Database connection failed', error);
  });

export default app;
