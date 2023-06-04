const { check } = require("express-validator");
const UserModel = require("../models").user;

const createUserValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("Nama Wajib Di isi"),
  check("email")
    .isEmail()
    .withMessage("Gunakan Format Email")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail sudah digunakan");
        }
      });
    }),
];

const updateUserValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("Nama Wajib Di isi"),
];
const updatePassword = [
  check("newPassword")
    .isLength({
      min: 8,
    })
    .withMessage("Password Minimal 8 karakter"),
];

module.exports = { createUserValidator, updateUserValidator, updatePassword };
