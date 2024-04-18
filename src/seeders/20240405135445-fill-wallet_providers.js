"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const om = {
      name: "Orange Money",
      code: "om",
      icon: "images/om.png",
    };

    const wv = {
      name: "Wave",
      code: "wv",
      icon: "images/wave.png",
    };

    await queryInterface.bulkInsert("wallet_providers", [om, wv]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("wallet_providers", null);
  },
};
