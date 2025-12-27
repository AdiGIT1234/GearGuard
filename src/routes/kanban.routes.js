const express = require("express");
const router = express.Router();
const controller = require("../controllers/kanban.controller");

router.get("/", controller.getKanbanCards);
router.patch("/:id/move", controller.moveCard);
router.get("/overdue", controller.getOverdueCards);

module.exports = router;
