import express from 'express';
import {
    addFavorite,
    getFavoritesByUser,
    deleteFavorite,
} from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/', addFavorite); // Añadir a favoritos
router.get('/:user_id', getFavoritesByUser); // Obtener todos los favoritos de un usuario
router.delete('/', deleteFavorite); // Eliminar un favorito

export default router;
