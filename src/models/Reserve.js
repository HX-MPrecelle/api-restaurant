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
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pax: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamp: false }
  );
};
