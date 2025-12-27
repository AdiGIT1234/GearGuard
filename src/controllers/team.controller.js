const prisma = require("../config/prisma");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await prisma.maintenanceTeam.findMany({
      include: {
        members: {
          include: { user: true }
        }
      }
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const team = await prisma.maintenanceTeam.create({
      data: req.body
    });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to create team" });
  }
};
