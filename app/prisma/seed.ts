import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const org = await prisma.organization.upsert({
    where: { id: "org-1" },
    update: {},
    create: {
      id: "org-1",
      name: "Acme Corp",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.organizationSettings.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      id: randomUUID(),
      organizationId: org.id,
      timezone: "Europe/Paris",
      weekStartDay: 1,
      requireGeo: true,
      requireDeviceLock: false,
      minimumClockSeconds: 3600,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: "alice@acme.com" },
    update: {},
    create: {
      id: randomUUID(),
      username: "alice",
      email: "alice@acme.com",
      password: "password123",
      role: "ADMIN",
      organizationId: org.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@acme.com" },
    update: {},
    create: {
      id: randomUUID(),
      username: "bob",
      email: "bob@acme.com",
      password: "password123",
      role: "EMPLOYEE",
      organizationId: org.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.userPreferences.upsert({
    where: { userId: alice.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: alice.id,
      language: "fr",
      darkMode: false,
      notifications: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.userPreferences.upsert({
    where: { userId: bob.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: bob.id,
      language: "en",
      darkMode: true,
      notifications: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const shiftAlice = await prisma.shift.upsert({
    where: { id: "shift-1" },
    update: {},
    create: {
      id: "shift-1",
      userId: alice.id,
      organizationId: org.id,
      startTime: new Date("2025-10-18T08:00:00Z"),
      endTime: new Date("2025-10-18T16:00:00Z"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const shiftBob = await prisma.shift.upsert({
    where: { id: "shift-2" },
    update: {},
    create: {
      id: "shift-2",
      userId: bob.id,
      organizationId: org.id,
      startTime: new Date("2025-10-18T08:15:00Z"),
      endTime: new Date("2025-10-18T16:15:00Z"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.clockIn.createMany({
    data: [
      {
        id: randomUUID(),
        shiftId: shiftAlice.id,
        clockInAt: new Date("2025-10-18T08:00:00Z"),
        clockOutAt: new Date("2025-10-18T16:00:00Z"),
        method: "GPS",
        latitude: 48.8566,
        longitude: 2.3522,
        ipAddress: "192.168.1.1",
        geoCountry: "FR",
        geoCity: "Paris",
        device: "iPhone 14",
      },
      {
        id: randomUUID(),
        shiftId: shiftBob.id,
        clockInAt: new Date("2025-10-18T08:15:00Z"),
        clockOutAt: new Date("2025-10-18T16:15:00Z"),
        method: "QR",
        latitude: 48.8566,
        longitude: 2.3522,
        ipAddress: "192.168.1.2",
        geoCountry: "FR",
        geoCity: "Paris",
        device: "Android Pixel 8",
      },
    ],
  });

  const projectAlpha = await prisma.project.upsert({
    where: { id: "project-1" },
    update: {},
    create: {
      id: "project-1",
      name: "Project Alpha",
      description: "Main development project",
      organizationId: org.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const timeEntryAlice = await prisma.timeEntry.create({
    data: {
      id: randomUUID(),
      userId: alice.id,
      projectId: projectAlpha.id,
      organizationId: org.id,
      startTime: new Date("2025-10-18T09:00:00Z"),
      endTime: new Date("2025-10-18T12:00:00Z"),
      duration: 3 * 60 * 60,
      description: "Morning work on Project Alpha",
      adhoc: false,
    },
  });

  const timeEntryBob = await prisma.timeEntry.create({
    data: {
      id: randomUUID(),
      userId: bob.id,
      projectId: projectAlpha.id,
      organizationId: org.id,
      startTime: new Date("2025-10-18T09:30:00Z"),
      endTime: new Date("2025-10-18T12:30:00Z"),
      duration: 3 * 60 * 60,
      description: "Morning work on Project Alpha",
      adhoc: false,
    },
  });

  const timesheetAlice = await prisma.timesheet.create({
    data: {
      id: randomUUID(),
      organizationId: org.id,
      userId: alice.id,
      periodStart: new Date("2025-10-18T00:00:00Z"),
      periodEnd: new Date("2025-10-18T23:59:59Z"),
      totalSeconds: 3 * 60 * 60,
      approved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await prisma.timesheetItem.create({
    data: {
      id: randomUUID(),
      timesheetId: timesheetAlice.id,
      timeEntryId: timeEntryAlice.id,
      seconds: 3 * 60 * 60,
      createdAt: new Date(),
    },
  });
  const timesheetBob = await prisma.timesheet.create({
    data: {
      id: randomUUID(),
      organizationId: org.id,
      userId: bob.id,
      periodStart: new Date("2025-10-18T00:00:00Z"),
      periodEnd: new Date("2025-10-18T23:59:59Z"),
      totalSeconds: 3 * 60 * 60,
      approved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const payrollRun = await prisma.payrollRun.create({
    data: {
      id: randomUUID(),
      organizationId: org.id,
      periodStart: new Date("2025-10-01T00:00:00Z"),
      periodEnd: new Date("2025-10-31T23:59:59Z"),
      status: "PENDING",
      createdAt: new Date(),
    },
  });
  await prisma.payrollItem.createMany({
    data: [
      {
        id: randomUUID(),
        payrollRunId: payrollRun.id,
        timesheetId: timesheetAlice.id,
        userId: alice.id,
        grossAmount: 3000,
        netAmount: 2400,
        taxAmount: 600,
        currency: "EUR",
      },
      {
        id: randomUUID(),
        payrollRunId: payrollRun.id,
        timesheetId: timesheetBob.id,
        userId: bob.id,
        grossAmount: 2500,
        netAmount: 2000,
        taxAmount: 500,
        currency: "EUR",
      },
    ],
  });

  console.log("Database seeding complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
