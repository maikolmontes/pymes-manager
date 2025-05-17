// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import favoriteRoutes from './routes/favorite.routes.js';

//routes
import businessRoutes from './routes/business.routes.js';
import userRoutes from './routes/user.routes.js';

import pkg from './models/index.js';
const db = pkg;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imágenes de forma pública
app.use('/uploads/imagenesnegocios', express.static(path.join(__dirname, 'uploads/imagenesnegocios')));

// Ruta base
app.get('/', (req, res) => {
    res.send('API The PYMES Manager funcionando 🚀');
});

// Rutas
app.use('/api/businesses', businessRoutes);
app.use('/api/users', userRoutes);// ← cuando tengamos la ruta de usuarios activa, descoméntala
app.use('/api/favorites', favoriteRoutes);

// 🔄 Sincronizar base de datos antes de arrancar el servidor
db.sequelize.sync({ alter: true }) // usa alter:true para que actualice columnas si cambian
    .then(() => {
        console.log('🟢 Base de datos sincronizada correctamente');

        // 🔥 Iniciar servidor solo si sincroniza bien
        app.listen(PORT, () => {
            console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error al sincronizar base de datos:', err);
    });
