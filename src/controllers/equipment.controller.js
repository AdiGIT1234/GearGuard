const prisma = require("../config/prisma");

exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        maintenanceTeam: true,
        department: true
      }
    });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
};

exports.createEquipment = async (req, res) => {
  try {
    const equipment = await prisma.equipment.create({
      data: req.body
    });
    res.status(201).json(equipment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create equipment" });
  }
};
