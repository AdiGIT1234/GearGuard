const prisma = require("../config/prisma");

exports.getRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const requests = await prisma.maintenanceRequest.findMany({
      where: status ? { status } : {},
      include: {
        equipment: true,
        maintenanceTeam: true,
        assignedTechnician: true
      }
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const request = await prisma.maintenanceRequest.create({
      data: req.body
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to create request" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.maintenanceRequest.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

exports.getPreventiveCalendar = async (req, res) => {
  try {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        requestType: "PREVENTIVE"
      },
      include: {
        equipment: true
      }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
};
