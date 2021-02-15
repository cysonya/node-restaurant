const express = require("express");
const { body, check, validationResult } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");
const storeController = require("../controllers/storeController");
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");

// Do work here
router.get("/", catchErrors(storeController.getStores));
router.get("/stores", catchErrors(storeController.getStores));
router.get("/add", authController.isLoggedIn, storeController.addStore);
router.post(
  "/add",
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post(
  "/add/:id",
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
router.get("/stores/:id/edit", catchErrors(storeController.editStore));
router.get("/store/:slug", catchErrors(storeController.getStoreBySlug));

router.get("/tags", catchErrors(storeController.getStoresByTag));
router.get("/tags/:tag", catchErrors(storeController.getStoresByTag));

router.get("/login", userController.loginForm);
router.post("/login", authController.login);

router.get("/register", userController.registerForm);
router.post(
  "/register",
  [
    check("email", "Email is not valid").isEmail(),
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password is required").not().isEmpty(),
    body("password-confirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match");
      }
      return true;
    }),
  ],
  userController.validateRegister,
  userController.register,
  authController.login
);
router.get("/logout", authController.logout);

router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account", catchErrors(userController.updateAccount));

module.exports = router;
