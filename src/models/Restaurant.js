const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Restaurant",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      cuisine: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      neighborhood_info: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      personas_max: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    { timestamp: false }
  );
};
