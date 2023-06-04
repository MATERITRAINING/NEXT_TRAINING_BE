const checkQuery = require("../utils/queryString");

const ProductModel = require("../models").product;
const { Op } = require("sequelize");
async function createBulkProduct(req, res) {
  try {
    const { payload } = req.body;

    let berhasil = 0;
    let gagal = 0;
    await Promise.all(
      payload.map(async (item) => {
        try {
          await ProductModel.create({
            name: item.name,
            description: item.description,
            userId: req.id,
            category: item.category,
            openDate: item.openDate,
            cost: item.cost,
          });
          berhasil += 1;
        } catch {
          gagal += 1;
        }
      })
    );

    return res.json({
      status: "success",
      msg: `Berhasil membuat ${berhasil} dan gagal menghapus ${gagal}`,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}
async function createProduct(req, res) {
  try {
    const { name, category, description, openDate, cost } = req.body;

    await ProductModel.create({
      name,
      description,
      userId: req.id,
      category,
      openDate,
      cost,
    });

    return res.json({
      status: "success",
      msg: "Product berhasil ditambahkan",
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function detailProduct(req, res) {
  try {
    const { id } = req.params;

    const data = await ProductModel.findOne({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        status: "Fail",
        mgs: "Data Tidak Ditemukan",
      });
    }

    return res.json({
      status: "success",
      msg: "Product berhasil ditemukan",
      data: data,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, category, description, openDate, image, cost } = req.body;

    const data = await ProductModel.findOne({
      where: {
        id: id,
      },
    });

    if (!data) {
      return res.status(404).json({
        status: "Fail",
        mgs: "Data Tidak Ditemukan",
      });
    }

    await ProductModel.update(
      { name, category, description, openDate, image, cost },
      {
        where: {
          id,
        },
      }
    );

    return res.json({
      status: "success",
      msg: "Product berhasil diupdate",
      data: data,
    });
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const remove = await ProductModel.destroy({
      where: {
        id: id,
      },
    });

    if (remove === 0) {
      return res.status(422).json({
        status: "failed",
        msg: "Product Tidak Ditemukan",
      });
    } else {
      return res.json({
        status: "success",
        msg: "Product berhasil dihapus",
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function deleteBulkProduct(req, res) {
  try {
    const { payload } = req.body;
    let berhasil = 0;
    let gagal = 0;
    await Promise.all(
      payload.map(async (id) => {
        try {
          const remove = await ProductModel.destroy({
            where: {
              id: id,
            },
          });

          if (remove === 0) {
            gagal += 1;
          } else {
            berhasil += 1;
          }
        } catch {
          gagal += 1;
        }
      })
    );

    return res.json({
      status: "success",
      msg: `Berhasil menghapus ${berhasil} dan gagal menghapus ${gagal}`,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function listProduct(req, res) {
  let {
    page,
    pageSize,
    offset,
    q,
    name,
    description,
    openDateFrom,
    openDateTo,
    orderBy = 'id',
    sortBy = 'desc'


  } = req.query;
  try {
    const Products = await ProductModel.findAndCountAll({
      where: {
        ...(checkQuery(q) && {
          [Op.or]: [
            {
              name: {
                [Op.substring]: q,
              },
            },
            {
              category: {
                [Op.substring]: q,
              },
            },
            {
              cost: {
                [Op.substring]: q,
              },
            },
            {
              description: {
                [Op.substring]: q,
              },
            },
          ],
        }),
        ...(checkQuery(name) && {
          name: {
            [Op.substring]: name,
          },
        }),
        ...(checkQuery(description) && {
          description: {
            [Op.substring]: description,
          },
        }),
        ...(checkQuery(openDateFrom) && {
          openDate: {
            [Op.between]: [openDateFrom, openDateTo],
          },
        }),
      },
      limit: pageSize,
      offset: offset,
      order : [[orderBy, sortBy]]
    });

    return res.json({
      status: "success",
      data: Products.rows,
      pagination: {
        page,
        pageSize,
        total: Products.count,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

//

module.exports = {
  createProduct,
  listProduct,
  createBulkProduct,
  deleteBulkProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
};
