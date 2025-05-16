// routes/business.routes.js
import express from 'express';
import upload from '../middlewares/upload.js';
import { createBusiness, getAllBusinesses, getBusinessesByUser } from '../controllers/business.controller.js';




const router = express.Router();

// Ruta para registrar un negocio CON imagen
router.post('/', upload.single('image'), createBusiness);

router.get('/my/:user_id', getBusinessesByUser); // 👈 para obtener negocios por usuario
// Ruta para obtener todos los negocios
router.get('/', getAllBusinesses);

export default router;
