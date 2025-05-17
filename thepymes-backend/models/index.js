const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const dbConfig = require('../config/db.config.js');

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    port: dbConfig.development.port,
    dialect: dbConfig.development.dialect,
    logging: false,
  }
);

// Verificar conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a la base de datos PostgreSQL');
  })
  .catch(err => {
    console.error('❌ No se pudo conectar a la base de datos:', err);
  });

const db = {};
const basename = path.basename(__filename);

// Cargar todos los modelos
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Establecer relaciones manuales
db.User = db['User'];
db.Business = db['Business'];
db.Favorite = db['Favorite']; // 👈 Asegúrate de tener el archivo favorite.js creado

// Relaciones para favoritos
db.User.hasMany(db.Favorite, { foreignKey: 'user_id' });
db.Favorite.belongsTo(db.User, { foreignKey: 'user_id' });

db.Business.hasMany(db.Favorite, { foreignKey: 'business_id' });
db.Favorite.belongsTo(db.Business, { foreignKey: 'business_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
