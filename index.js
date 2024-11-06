import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import setupMiddleware from './middleware/setupMiddleware.js';
import staticRoutes from './routes/staticRoutes.js';
import dynamicRoutes from './routes/dynamicRoutes.js';
import Player from './config/playerSchema.js';
import './config/database.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

setupMiddleware(app);

app.set('view engine', 'ejs');

app.use('/', staticRoutes);
app.use('/', dynamicRoutes);

// Start the server
app.listen(process.env.PORT || 8000, () =>
    console.log('App available on http://localhost:8000')
);