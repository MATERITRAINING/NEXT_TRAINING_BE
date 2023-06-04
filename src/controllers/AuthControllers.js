const UserModel = require("../models").users;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailHandle = require("../mail");
const crypto = require("crypto");
const dayjs = require("dayjs");
require("dotenv").config();

async function profile(req, res) {
  try {
    const user = await UserModel.findOne({
      where: {
        id: req.id,
      },
    });

    res.json({
      status: "Success",
      msg: "Profile ditemukan",
      user: user,
      permission: [
        {
          module: "Artikel",
          role: ["create, read, delete, update"],
        },
      ],
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function register(req, res) {
  try {
    const payload = req.body;
    const { name, email, picture, password, role } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      name,
      email,
      picture,
      role,
      password: hashPassword,
    });

    res.json({
      status: "Success",
      msg: "Register Berhasil",
    });
  } catch (err) {
    console.log("ee", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function googleLogin(req, res) {
  try {
    const payload = req.body;
    const { email } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email Tidak ditemukan, Silahkan Register",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await UserModel.update(
      {
        refreshToken: refreshToken,
      },
      {
        where: {
          id: user?.id,
        },
      }
    );

    res.json({
      status: "Success",
      msg: "Login Berhasil",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken: token, id } = req.body;

    console.log(token, id);

    const user = await UserModel.findOne({
      where: {
        refreshToken: token,
        id: id,
      },
    });

    if (user === null) {
      return res.status(422).json({
        msg: "Unauthorized",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          status: "fail",
          err: err,
        });
      }
    });

    const accessToken = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await UserModel.update(
      {
        refreshToken: refreshToken,
      },
      {
        where: {
          id: user?.id,
        },
      }
    );

    res.json({
      status: "Success",
      msg: "Login Berhasil",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    });
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { email, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email Tidak ditemukan, Silahkan Register",
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan Password Tidak Cocok",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan Password Tidak Cocok",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await UserModel.update(
      {
        refreshToken: refreshToken,
      },
      {
        where: {
          id: user?.id,
        },
      }
    );

    res.json({
      status: "Success",
      msg: "Login Berhasil",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    });
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

module.exports = {
  register,
  googleLogin,
  login,
  refreshToken,
  profile,
};
