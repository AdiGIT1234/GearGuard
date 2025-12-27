const prisma = require("../config/prisma");

exports.getCalendarEvents = async (req, res) => {
  try {
    const events = await prisma.maintenanceRequest.findMany({
      where: {
        requestType: "PREVENTIVE",
        scheduledDate: { not: null }
      },
      include: {
        equipment: true,
        maintenanceTeam: true
      },
      orderBy: {
        scheduledDate: "asc"
      }
    });

    const formatted = events.map(e => ({
      id: e.id,
      title: e.subject,
      date: e.scheduledDate,
      equipment: e.equipment.name,
      team: e.maintenanceTeam.name
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};
