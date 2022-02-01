const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('restaurant', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        neighborhood_info: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cuisine: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        photo: {
            type: DataTypes.STRING,
        },
        personas_max: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    }, {
        createdAt: false,
        updatedAt: false,
    })
}
