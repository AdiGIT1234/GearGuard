import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  console.log("🌱 Seeding database...");

  // -----------------------------
  // 1. Departments
  // -----------------------------
  const production = await prisma.department.create({
    data: { name: "Production", description: "Manufacturing & production floor" }
  });

  const itDept = await prisma.department.create({
    data: { name: "IT", description: "IT infrastructure & support" }
  });

  // -----------------------------
  // 2. Users (Admin + Technicians)
  // -----------------------------
  const admin = await prisma.user.create({
    data: {
      fullName: "Admin User",
      email: "admin@gearguard.com",
      role: "ADMIN"
    }
  });

  const mechTech = await prisma.user.create({
    data: {
      fullName: "Ajay Mehta",
      email: "ajay@gearguard.com",
      role: "TECHNICIAN"
    }
  });

  const itTech = await prisma.user.create({
    data: {
      fullName: "Neha Sharma",
      email: "neha@gearguard.com",
      role: "TECHNICIAN"
    }
  });

  // -----------------------------
  // 3. Maintenance Teams
  // -----------------------------
  const mechanics = await prisma.maintenanceTeam.create({
    data: {
      name: "Mechanics",
      specialization: "Mechanical Repairs"
    }
  });

  const itSupport = await prisma.maintenanceTeam.create({
    data: {
      name: "IT Support",
      specialization: "Hardware & Network"
    }
  });

  // -----------------------------
  // 4. Team Members
  // -----------------------------
  await prisma.teamMember.create({
    data: {
      teamId: mechanics.id,
      userId: mechTech.id
    }
  });

  await prisma.teamMember.create({
    data: {
      teamId: itSupport.id,
      userId: itTech.id
    }
  });

  // -----------------------------
  // 5. Equipment
  // -----------------------------
  const cncMachine = await prisma.equipment.create({
    data: {
      name: "CNC Lathe Machine",
      serialNumber: "CNC-1001",
      category: "MACHINE",
      departmentId: production.id,
      maintenanceTeamId: mechanics.id,
      location: "Plant A - Bay 3",
      purchaseDate: new Date("2022-01-10"),
      warrantyExpiry: new Date("2025-01-10")
    }
  });

  const officeLaptop = await prisma.equipment.create({
    data: {
      name: "Office Laptop - Dell",
      serialNumber: "LAP-IT-2001",
      category: "COMPUTER",
      departmentId: itDept.id,
      maintenanceTeamId: itSupport.id,
      assignedEmployeeId: itTech.id,
      location: "IT Office",
      purchaseDate: new Date("2023-03-15"),
      warrantyExpiry: new Date("2026-03-15")
    }
  });

  // -----------------------------
  // 6. Maintenance Requests
  // -----------------------------
  await prisma.maintenanceRequest.create({
    data: {
      subject: "Oil leakage near spindle",
      requestType: "CORRECTIVE",
      priority: "HIGH",
      equipmentId: cncMachine.id,
      maintenanceTeamId: mechanics.id,
      assignedTechnicianId: mechTech.id,
      status: "IN_PROGRESS",
      startTime: new Date(),
      remarks: "Leak observed during operation"
    }
  });

  await prisma.maintenanceRequest.create({
    data: {
      subject: "Monthly system health check",
      requestType: "PREVENTIVE",
      priority: "MEDIUM",
      equipmentId: officeLaptop.id,
      maintenanceTeamId: itSupport.id,
      assignedTechnicianId: itTech.id,
      scheduledDate: new Date("2025-01-05"),
      status: "NEW"
    }
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
