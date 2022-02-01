const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
              email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
              },
              password: {
                type: DataTypes.STRING,
                allowNull: false,
                
            },

            favorite:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            },
            // myArrayField: { 
            //     type: DataTypes.STRING, 
            //     get: function() {
            //         return JSON.parse(this.getDataValue('myArrayField'));
            //     }, 
            //     set: function(val) {
            //         return this.setDataValue('myArrayField', JSON.stringify(val));
            //     }
            // }
              
            },
            { timestamps: false }
          );
        }; 