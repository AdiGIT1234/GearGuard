const express = require("express");
const cors = require("cors");

const equipmentRoutes = require("./routes/equipment.routes");
const teamRoutes = require("./routes/team.routes");
const requestRoutes = require("./routes/request.routes");
const kanbanRoutes = require("./routes/kanban.routes");
const calendarRoutes = require("./routes/calendar.routes");

const app = express();

// CORS Configuration - MUST be before other middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/equipment", equipmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/kanban", kanbanRoutes);
app.use("/api/calendar", calendarRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok",
    message: "✅ GearGuard API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

module.exports = app;