import express, { Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { AppDataSource } from './data-source';
import routes from './routes';

// LOAD ENVIRONMENT VARIABLES
const { PORT = 8080 } = process.env;

// CREATE EXPRESS APP
const app: Application = express();

// MIDDLEWARES
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    AppDataSource.initialize();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed', error);
  }
});
