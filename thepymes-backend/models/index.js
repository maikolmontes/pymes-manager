const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const dbConfig = require('../config/db.config.js'); // Aquí usamos tu archivo personalizado

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

// Verifica la conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a la base de datos PostgreSQL');
  })
  .catch(err => {
    console.error('❌ No se pudo conectar a la base de datos:', err);
  });

const db = {};
const basename = path.basename(__filename);

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

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
