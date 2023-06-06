'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class roleMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // roleMenu.belongsTo(models.roles, {
      //   as: "roleName",
      //   foreignKey: "roleId"
      // });
      // roleMenu.belongsTo(models.accessMenu, {
      //   as: "accessName",
      //   foreignKey: "accessMenuId"
      // });
    }
  }
  roleMenu.init({
    roleId: DataTypes.INTEGER,
    accessMenuId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'roleMenu',
  });
  return roleMenu;
};