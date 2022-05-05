const router = require("express").Router();
const controller = require("../../controllers/v1/user.controller");
const authCheck = require("../../middlewares/v1/auth.check");
const uploader = require("../../utils/v1/upload/user");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);

router.post(
  "/",
  uploader.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  controller.add
);
router.put(
  "/:id",
  uploader.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  authCheck,
  controller.update
);
router.delete("/:id", authCheck, controller.delete);

module.exports = router;
