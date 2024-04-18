"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstname: {
        type: Sequelize.STRING,
      },
      lastname: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      // role_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   referencies: {
      //     table: 'roles',
      //     field: 'id',
      //   }
      // },
      // company_id: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   referencies: {
      //     table: 'companies',
      //     field: 'id',
      //   }
      // },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, _) {
    await queryInterface.dropTable("users");
  },
};
