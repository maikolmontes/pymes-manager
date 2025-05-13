const { Business } = require('../models');

exports.createBusiness = async (req, res) => {
    try {
        const { name, category, latitude, longitude, description } = req.body;

        if (!name || !category || !latitude || !longitude) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const image_url = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/imagenesnegocios/${req.file.filename}`
            : null;

        const newBusiness = await Business.create({
            name,
            category,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description,
            image_url,
            created_at: new Date(),
        });

        console.log('✅ Negocio creado:', newBusiness.toJSON());
        res.status(201).json(newBusiness);
    } catch (error) {
        console.error('❌ Error al crear negocio:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getAllBusinesses = async (req, res) => {
    try {
        const businesses = await Business.findAll();
        res.json(businesses);
    } catch (error) {
        console.error('Error al obtener negocios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
