const express = require("express");
const {
  register,
  login,
  googleLogin,
  refreshToken,
  profile,
  profileById,
} = require("../controllers/AuthControllers");

const router = express.Router();
const validationResultMiddleware = require("../middleware/validatioResultMiddleware");
const userValidator = require("../validators/userValidator");
const jwtValidateMiddleware = require("../middleware/JwtValidateMiddleware");
const paginationMiddleware = require("../middleware/paginationMiddleware");
const uploadMulti = require("../storage/fileUploadMulti");
const uploadSingle = require("../storage/fileUploadSingle");

const {
  createProduct,
  createBulkProduct,
  deleteBulkProduct,
  listProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductControllers");

//auth

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshToken);
router.get("/permission-by-id/:id", profileById);
router.use(jwtValidateMiddleware);

router.get("/permission", profile);
router.post("/product/create", createProduct);
router.post("/product/create-bulk", createBulkProduct);
router.post("/product/delete-bulk", deleteBulkProduct);
router.get("/product/list", listProduct);
router.get("/product/:id/detail", detailProduct);
router.put("/product/:id/update", updateProduct);
router.delete("/product/:id/delete", deleteProduct);

//upload

router.post("/upload/single", uploadSingle, (req, res) => {
  return res.json({
    status: "Success",
    msg: "Upload Success",
    data: {
      file: req.file,
      filename: req.file.filename,
      fileUrl: `${req.protocol}://${req.get("host")}/${req.file.filename}`,
    },
  });
});

router.post("/upload/multi", uploadMulti, (req, res) => {
  const files = req.files;

  const data = files?.map((item) => {
    return {
      file: item.file,
      filename: item.filename,
      fileUrl: `${req.protocol}://${req.get("host")}/${item.filename}`,
    };
  });

  res.send({
    status: "Success",
    msg: "Upload Success",
    data: data,

    // fileUrl : `${req.protocol}://${req.get("host")}/${req.file.filename}`
  });
});
// router.post("/kelas/create", createKelas)
// router.post("/kelas/create-bulk", createKelasBulk)
// router.put("/kelas/update/:id", updateKelas)
// router.get("/kelas/detail/:id", detailKelas)
// router.get("/kelas/list", paginationMiddleware, listKelas)

module.exports = router;
