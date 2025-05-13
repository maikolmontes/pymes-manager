const { User } = require('../models');

// Registrar nuevo usuario
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, document, phone, address, user_type } = req.body;

        if (!name || !email || !password || !document || !phone || !address || !user_type) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar si el documento ya existe
        const existingUser = await User.findOne({ where: { document } });
        if (existingUser) {
            return res.status(409).json({ message: 'Ya existe un usuario con este número de documento' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            document,
            phone,
            address,
            user_type,
            created_at: new Date(),
        });

        console.log('✅ Usuario registrado:', newUser.toJSON());
        res.status(201).json(newUser);
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todos los usuarios (opcional)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
