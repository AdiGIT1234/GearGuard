const prisma = require("../config/prisma");

exports.getKanbanCards = async (req, res) => {
  try {
    const { status } = req.query;

    const cards = await prisma.maintenanceRequest.findMany({
      where: status ? { status } : {},
      include: {
        equipment: true,
        maintenanceTeam: true,
        assignedTechnician: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Kanban cards" });
  }
};

exports.moveCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to move Kanban card" });
  }
};

exports.getOverdueCards = async (req, res) => {
  try {
    const today = new Date();

    const overdue = await prisma.maintenanceRequest.findMany({
      where: {
        scheduledDate: { lt: today },
        status: { not: "REPAIRED" }
      },
      include: {
        equipment: true,
        maintenanceTeam: true
      }
    });

    res.json(overdue);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overdue requests" });
  }
};
