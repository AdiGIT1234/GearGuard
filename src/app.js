const express = require("express");
const cors = require("cors");

const equipmentRoutes = require("./routes/equipment.routes");
const teamRoutes = require("./routes/team.routes");
const requestRoutes = require("./routes/request.routes");
const kanbanRoutes = require("./routes/kanban.routes");
const calendarRoutes = require("./routes/calendar.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/equipment", equipmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/kanban", kanbanRoutes);
app.use("/api/calendar", calendarRoutes);

app.get("/", (req, res) => {
  res.send("✅ GearGuard API is running");
});

module.exports = app;
