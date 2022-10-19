const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser, createProduct);
///////router.route("/product/:id").put(updateProduct)//E! --> How the updateProduct function would get the id ???
/////router.route("/product/:id").put(updateProduct).delete(deleteProduct)//E! --> How the updateProduct function would get the id ???
router.route("/product/:id")
.put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)
.get(getProductDetails)//E! --> How the updateProduct function would get the id ???

module.exports = router;