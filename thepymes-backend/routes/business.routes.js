import express from 'express';
import upload from '../middlewares/upload.js';
import {
  createBusiness,
  getAllBusinesses,
  getBusinessesByUser,
  updateBusiness,   // 👈 nuevo
  deleteBusiness    // 👈 nuevo
} from '../controllers/business.controller.js';

const router = express.Router();

// Crear un negocio con imagen
router.post('/', upload.single('image'), createBusiness);

// Obtener todos los negocios
router.get('/', getAllBusinesses);

// Obtener negocios por usuario
router.get('/my/:user_id', getBusinessesByUser);

// Actualizar negocio (con imagen opcional)
router.put('/:id', upload.single('image'), updateBusiness);

// Eliminar negocio
router.delete('/:id', deleteBusiness);

export default router;
