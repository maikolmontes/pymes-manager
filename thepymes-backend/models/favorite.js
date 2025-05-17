'use strict';

module.exports = (sequelize, DataTypes) => {
    const Favorite = sequelize.define('Favorite', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        business_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'favorites',
        timestamps: false,
        underscored: true,
    });

    return Favorite;
};
