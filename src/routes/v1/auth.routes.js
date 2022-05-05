const router = require("express").Router();
const controller = require("../../controllers/v1/auth.controller");
const authCheck = require("../../middlewares/v1/auth.check");

router.post("/login", controller.login)
router.post("/logout", authCheck, controller.logout)

module.exports = router;