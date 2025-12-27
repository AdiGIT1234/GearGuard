const express = require("express");
const router = express.Router();
const controller = require("../controllers/request.controller");

router.get("/", controller.getRequests);
router.post("/", controller.createRequest);
router.patch("/:id/status", controller.updateRequestStatus);
router.get("/calendar/preventive", controller.getPreventiveCalendar);

module.exports = router;
