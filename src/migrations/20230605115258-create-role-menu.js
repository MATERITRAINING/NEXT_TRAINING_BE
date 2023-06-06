"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roleMenus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      roleId: {
        type: Sequelize.STRING,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "roles",
          key: "id",
          as: "roleId",
        },
      },
      accessMenuId: {
        type: Sequelize.INTEGER,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "accessMenus",
          key: "id",
          as: "accessMenuId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("roleMenus");
  },
};
