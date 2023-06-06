const UserModel = require("../models").users;
const UserRoleModel = require("../models").userRole;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailHandle = require("../mail");
const crypto = require("crypto");
const dayjs = require("dayjs");
require("dotenv").config();
const models = require("../models");
const { QueryTypes } = require("sequelize");
const {sequelize} = require("../models");


async function profile(req, res) {
  const id = req.id;
  try {
    const permission = await sequelize.query(
      "SELECT users.id,users.name,users.email,userRoles.roleName AS role,userRoles.accessName,userRoles.created,userRoles.updated,userRoles.list,userRoles.deleted,userRoles.detail,userRoles.menuName FROM users JOIN(SELECT userRoles.roleMenuId,userRoles.userId,roleMenus.accessName,roleMenus.created,roleMenus.updated,roleMenus.list,roleMenus.deleted,roleMenus.detail,roleMenus.menuName,roleMenus.roleName FROM userRoles JOIN(SELECT roleMenus.id,roleMenus.roleId,roleMenus.accessMenuId,roles.roleName,accessMenus.accessName,accessMenus.created,accessMenus.updated,accessMenus.list,accessMenus.deleted,accessMenus.detail,accessMenus.menuId,accessMenus.menuName FROM roleMenus JOIN roles ON(roleMenus.roleId=roles.id)JOIN(SELECT accessMenus.id,accessMenus.accessName,accessMenus.created,accessMenus.updated,accessMenus.list,accessMenus.deleted,accessMenus.detail,accessMenus.menuId,menus.menuName FROM accessMenus JOIN menus ON(accessMenus.menuId=menus.id))AS accessMenus ON(roleMenus.accessMenuId=accessMenus.id))AS roleMenus ON(userRoles.roleMenuId=roleMenus.id))AS userRoles ON(users.id=userRoles.userId)WHERE users.id=:id",
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );


    if(permission.length === 0) {
     return  res.json({
        status: "Success",
        msg: "Permission Found",
       user: {
       
       },
        permissions : null
      });
    }

    const permissions = {
      role : [],
      menu : [],
      access : []

    }
    permission.map((item)=> {
      

      
      if([...permissions.role].includes(item.role) === false) {
        permissions.role = [...permissions.role, item.role]
      }

      if([...permissions.menu].includes(item.menuName) === false) {
        permissions.menu = [...permissions.menu, item.menuName]
      }

      permissions.access.push({
        accessName :item.accessName,
        permission : {
          created : item.created,
          updated: item.updated,
          list:item.list,
          deleted : item.deleted,
          detail:item.detail
        }
      })

      
    })

   return  res.json({
      status: "Success",
      msg: "Permission Found",
     user: {
      id : permission[0].id,
      name : permission[0].name,
      email : permission[0].email
     },
      permissions : permissions
    });
  } catch (err) {
    console.log("er", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}


async function profileById(req, res) {
  const id  = req.params.id;
  try {
    const permission = await sequelize.query(
      "SELECT users.id,users.name,users.email,userRoles.roleName AS role,userRoles.accessName,userRoles.created,userRoles.updated,userRoles.list,userRoles.deleted,userRoles.detail,userRoles.menuName FROM users JOIN(SELECT userRoles.roleMenuId,userRoles.userId,roleMenus.accessName,roleMenus.created,roleMenus.updated,roleMenus.list,roleMenus.deleted,roleMenus.detail,roleMenus.menuName,roleMenus.roleName FROM userRoles JOIN(SELECT roleMenus.id,roleMenus.roleId,roleMenus.accessMenuId,roles.roleName,accessMenus.accessName,accessMenus.created,accessMenus.updated,accessMenus.list,accessMenus.deleted,accessMenus.detail,accessMenus.menuId,accessMenus.menuName FROM roleMenus JOIN roles ON(roleMenus.roleId=roles.id)JOIN(SELECT accessMenus.id,accessMenus.accessName,accessMenus.created,accessMenus.updated,accessMenus.list,accessMenus.deleted,accessMenus.detail,accessMenus.menuId,menus.menuName FROM accessMenus JOIN menus ON(accessMenus.menuId=menus.id))AS accessMenus ON(roleMenus.accessMenuId=accessMenus.id))AS roleMenus ON(userRoles.roleMenuId=roleMenus.id))AS userRoles ON(users.id=userRoles.userId)WHERE users.id=:id",
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
        raw: true,
      }
    );


    if(permission.length === 0) {
     return  res.json({
        status: "Success",
        msg: "Permission Found",
       user: {
       
       },
        permissions : null
      });
    }

    const permissions = {
      role : [],
      menu : [],
      access : []

    }
    permission.map((item)=> {
      

      
      if([...permissions.role].includes(item.role) === false) {
        permissions.role = [...permissions.role, item.role]
      }

      if([...permissions.menu].includes(item.menuName) === false) {
        permissions.menu = [...permissions.menu, item.menuName]
      }

      permissions.access.push({
        accessName :item.accessName,
        permission : {
          created : item.created,
          updated: item.updated,
          list:item.list,
          deleted : item.deleted,
          detail:item.detail
        }
      })

      
    })

   return  res.json({
      status: "Success",
      msg: "Permission Found",
     user: {
      id : permission[0].id,
      name : permission[0].name,
      email : permission[0].email
     },
      permissions : permissions
    });
  } catch (err) {
    console.log("er", err);
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
  profileById
};
