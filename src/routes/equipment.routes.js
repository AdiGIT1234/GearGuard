const express = require("express");
const router = express.Router();
const controller = require("../controllers/equipment.controller");

router.get("/", controller.getAllEquipment);
router.post("/", controller.createEquipment);

module.exports = router;
