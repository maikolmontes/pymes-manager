const { Favorite, Business } = require('../models');

// Agregar a favoritos
exports.addFavorite = async (req, res) => {
    try {
        const { user_id, business_id } = req.body;

        if (!user_id || !business_id) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const exists = await Favorite.findOne({ where: { user_id, business_id } });
        if (exists) {
            return res.status(409).json({ message: 'Este negocio ya está en favoritos' });
        }

        const favorite = await Favorite.create({ user_id, business_id });
        res.status(201).json(favorite);
    } catch (error) {
        console.error('Error al agregar favorito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener favoritos de un usuario
// controllers/favorite.controller.js

exports.getFavoritesByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const favorites = await Favorite.findAll({
            where: { user_id },
            include: [{ model: Business }],
        });

        // 🛠️ Devolver el ID del favorito y el business_id
        const result = favorites.map(fav => ({
            id: fav.id,
            business_id: fav.business_id,
            ...fav.Business?.dataValues,
        }));

        res.json(result);
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Eliminar favorito
exports.deleteFavorite = async (req, res) => {
    try {
        const { user_id, business_id } = req.body;

        await Favorite.destroy({ where: { user_id, business_id } });
        res.json({ message: 'Eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
