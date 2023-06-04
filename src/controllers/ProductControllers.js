const checkQuery = require("../utils/queryString");

const ProductModel = require("../models").product;
const { Op } = require("sequelize");
async function createBulkProduct(req, res) {
  try {
    const { payload } = req.body;

    await ProductModel.createBulk(payload);

    return res.json({
      msg: "Product berhasil ditambahkan",
      status: "success",
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
  let { page, pageSize, offset, q, name, description } = req.query;
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
        ...(
          checkQuery(name) && {
            name: {
              [Op.substring]: name,
            },
          }
        ),
        ...(
          checkQuery(description) && {
            description: {
              [Op.substring]: description,
            },
          }
        ),
      },
      limit: pageSize,
      offset: offset,
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
};