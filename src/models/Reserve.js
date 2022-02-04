const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Reserve",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hour: {
        type: DataTypes.ENUM("ALMUERZO", "CENA"),
        allowNull: false,
      },
      personas_cant: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamp: false }
  );
};
