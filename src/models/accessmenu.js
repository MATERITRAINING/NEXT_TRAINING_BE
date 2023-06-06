'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accessMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  accessMenu.init({
    menuId: DataTypes.INTEGER,
    accessName: DataTypes.STRING,
    created: DataTypes.BOOLEAN,
    updated: DataTypes.BOOLEAN,
    list: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    detail: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'accessMenu',
  });
  return accessMenu;
};