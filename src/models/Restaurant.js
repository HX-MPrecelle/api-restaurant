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
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      neighborhood_info: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuisine: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      personas_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo: {
        type: DataTypes.STRING,
      },
    },
    { timestamp: false }
  );
};
