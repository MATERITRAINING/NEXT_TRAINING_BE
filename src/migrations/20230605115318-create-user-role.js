'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roleMenuId: {
        type: Sequelize.INTEGER,
        type: Sequelize.INTEGER,
        onDelete:'CASCADE',
        references : {
          model : 'roleMenus',
          key : 'id',
          as : 'roleMenuId'
        }
      
      },
      userId: {
        type: Sequelize.INTEGER,
        type: Sequelize.INTEGER,
        onDelete:'CASCADE',
        references : {
          model : 'users',
          key : 'id',
          as : 'userId'
        }
      
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userRoles');
  }
};