import { PrismaClient, Role, VerificationStatus, Urgency, RequestStatus, PledgeStatus, OrganizationIdType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function seedDatabase() {
  console.log("🌱 Starting Heimdall database population script...\n");

  // 1. Clean existing database records
  console.log("🧹 Clearing old database entries...");
  await prisma.pledgedItem.deleteMany({});
  await prisma.pledge.deleteMany({});
  await prisma.requestedItem.deleteMany({});
  await prisma.shelterRequest.deleteMany({});
  await prisma.user.updateMany({ data: { shelterId: null } });
  await prisma.shelter.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.globalItem.deleteMany({});
  await prisma.category.deleteMany({});
  console.log("✔ Database cleared.\n");

  const defaultPasswordHash = await bcrypt.hash("Password123!", SALT_ROUNDS);

  // 2. Create Super Admin User
  console.log("👤 Creating Super Admin User...");
  const superAdmin = await prisma.user.create({
    data: {
      name: "Heimdall System Admin",
      email: "admin@heimdall.org",
      passwordHash: defaultPasswordHash,
      role: Role.SUPER_ADMIN,
      phone: "+1 (555) 000-9999",
      profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });
  console.log(`✔ Super Admin created: ${superAdmin.email}`);

  // 3. Create Categories
  console.log("\n📦 Creating Global Categories...");
  const categoryData = [
    {
      name: "Food & Emergency Nutrition",
      icon: "Utensils",
      description: "Non-perishable canned goods, potable water, baby formula, and emergency meal rations.",
    },
    {
      name: "Medical & Healthcare",
      icon: "HeartPulse",
      description: "First-aid kits, over-the-counter medication, sterile bandages, and basic diagnostic kits.",
    },
    {
      name: "Clothing & Footwear",
      icon: "Shirt",
      description: "Weatherproof jackets, thermal underwear, socks, boots, and seasonal apparel.",
    },
    {
      name: "Shelter & Bedding",
      icon: "Home",
      description: "Sleeping bags, thermal blankets, pop-up tents, cots, and emergency tarps.",
    },
    {
      name: "Education & Children",
      icon: "BookOpen",
      description: "School stationery, backpacks, children's storybooks, and early development toys.",
    },
    {
      name: "Hygiene & Sanitation",
      icon: "Droplet",
      description: "Soaps, shampoo, toothbrushes, feminine hygiene products, and disinfectant wipes.",
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.name] = created;
  }
  console.log(`✔ Created ${Object.keys(categories).length} categories.`);

  // 4. Create Global Items
  console.log("\n🏷️ Creating Global Items Pool...");
  const globalItemsData = [
    {
      title: "Canned Soups & Vegetables (12-Pack)",
      description: "Assorted nutritious canned vegetables and protein soups.",
      defaultUnit: "packs",
      categoryId: categories["Food & Emergency Nutrition"].id,
    },
    {
      title: "Clean Drinking Water Bottles (5 Gallon)",
      description: "Purified sealed 5-gallon water jugs for emergency supply.",
      defaultUnit: "gallons",
      categoryId: categories["Food & Emergency Nutrition"].id,
    },
    {
      title: "Infant Powder Formula (800g)",
      description: "Fortified baby milk powder formula for infants 0-12 months.",
      defaultUnit: "cans",
      categoryId: categories["Food & Emergency Nutrition"].id,
    },
    {
      title: "Emergency First Aid Trauma Kit",
      description: "Comprehensive first aid kit with bandages, antiseptic, and trauma shears.",
      defaultUnit: "kits",
      categoryId: categories["Medical & Healthcare"].id,
    },
    {
      title: "OTC Pain Relief & Fever Tablets",
      description: "Standard ibuprofen and acetaminophen bottles (100 count).",
      defaultUnit: "bottles",
      categoryId: categories["Medical & Healthcare"].id,
    },
    {
      title: "All-Weather Heavy Winter Jackets",
      description: "Insulated waterproof winter coats in adult medium and large sizes.",
      defaultUnit: "jackets",
      categoryId: categories["Clothing & Footwear"].id,
    },
    {
      title: "Thermal Socks & Wool Glove Sets",
      description: "High-grade thermal socks and warm wool gloves.",
      defaultUnit: "pairs",
      categoryId: categories["Clothing & Footwear"].id,
    },
    {
      title: "Fleece Thermal Emergency Blankets",
      description: "Heavyweight fleece blankets for winter shelter warmth.",
      defaultUnit: "blankets",
      categoryId: categories["Shelter & Bedding"].id,
    },
    {
      title: "Sub-Zero All-Weather Sleeping Bags",
      description: "Compact insulated sleeping bags rated for cold temperatures.",
      defaultUnit: "bags",
      categoryId: categories["Shelter & Bedding"].id,
    },
    {
      title: "Student Backpacks with Stationery Sets",
      description: "Sturdy backpacks packed with notebooks, pens, and school supplies.",
      defaultUnit: "sets",
      categoryId: categories["Education & Children"].id,
    },
    {
      title: "Antibacterial Soap & Hygiene Kits",
      description: "Personal hygiene care packages containing soap, shampoo, and toothpaste.",
      defaultUnit: "kits",
      categoryId: categories["Hygiene & Sanitation"].id,
    },
  ];

  const globalItems: Record<string, any> = {};
  for (const item of globalItemsData) {
    const created = await prisma.globalItem.create({ data: item });
    globalItems[item.title] = created;
  }
  console.log(`✔ Created ${Object.keys(globalItems).length} global items.`);

  // 5. Create Donors
  console.log("\n🤝 Creating Donor Accounts...");
  const donorUsersData = [
    {
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "+1 (555) 234-5678",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      pledgesCompleted: 3,
      pledgesExpired: 0,
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+1 (555) 345-6789",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      pledgesCompleted: 5,
      pledgesExpired: 1,
    },
    {
      name: "Michael Chen",
      email: "m.chen@example.com",
      phone: "+1 (555) 456-7890",
      profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      pledgesCompleted: 2,
      pledgesExpired: 0,
    },
    {
      name: "Jordan Taylor",
      email: "jordan.taylor@example.com",
      phone: "+1 (555) 567-8901",
      profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
      pledgesCompleted: 1,
      pledgesExpired: 0,
    },
  ];

  const donors: any[] = [];
  for (const donorData of donorUsersData) {
    const donor = await prisma.user.create({
      data: {
        ...donorData,
        passwordHash: defaultPasswordHash,
        role: Role.DONOR,
      },
    });
    donors.push(donor);
  }
  console.log(`✔ Created ${donors.length} donor users.`);

  // 6. Create Shelters and Shelter Admin Users
  console.log("\n🏰 Creating Shelters & Shelter Admins...");

  const shelterConfigs = [
    {
      name: "St. Vincent Community Haven",
      country: "USA",
      organizationIdType: OrganizationIdType.EIN,
      organizationId: "94-3281940",
      verificationStatus: VerificationStatus.VERIFIED,
      description: "Providing warm shelter, hot meals, and emergency aid to families in San Francisco.",
      street: "1050 Mission Street",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      latitude: 37.7812,
      longitude: -122.4089,
      dropOffHours: "Mon-Fri 8:00 AM - 6:00 PM, Sat 9:00 AM - 1:00 PM",
      contactEmail: "contact@stvincenthaven.org",
      phone: "+1 (415) 555-0144",
      website: "https://www.stvincenthaven.org",
      adminName: "Sarah Connor",
      adminEmail: "sarah.admin@stvincenthaven.org",
    },
    {
      name: "Hope City Youth & Family Shelter",
      country: "USA",
      organizationIdType: OrganizationIdType.EIN,
      organizationId: "47-9201948",
      verificationStatus: VerificationStatus.VERIFIED,
      description: "Dedicated to housing and empowering homeless youth and single parents in Central Texas.",
      street: "800 Congress Ave",
      city: "Austin",
      state: "TX",
      zip: "78701",
      latitude: 30.269,
      longitude: -97.742,
      dropOffHours: "Daily 9:00 AM - 5:00 PM",
      contactEmail: "info@hopecityshelter.org",
      phone: "+1 (512) 555-0188",
      website: "https://www.hopecityshelter.org",
      adminName: "Marcus Vance",
      adminEmail: "marcus@hopecityshelter.org",
    },
    {
      name: "Seattle Urban Relief Center",
      country: "USA",
      organizationIdType: OrganizationIdType.EIN,
      organizationId: "91-0482019",
      verificationStatus: VerificationStatus.VERIFIED,
      description: "Winter warming station and year-round emergency relief center for vulnerable unhoused individuals.",
      street: "1200 3rd Ave",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      latitude: 47.608,
      longitude: -122.335,
      dropOffHours: "Mon-Sat 10:00 AM - 4:00 PM",
      contactEmail: "relief@seattlerelief.org",
      phone: "+1 (206) 555-0123",
      website: "https://www.seattlerelief.org",
      adminName: "Elena Rostova",
      adminEmail: "elena@seattlerelief.org",
    },
    {
      name: "Pratham Child Welfare Foundation",
      country: "India",
      organizationIdType: OrganizationIdType.NGO_DARPAN,
      organizationId: "DL/2021/029384",
      verificationStatus: VerificationStatus.PENDING,
      description: "Supporting underprivileged children with nutrition, healthcare, and educational kits in New Delhi.",
      street: "42 Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      zip: "110001",
      latitude: 28.6315,
      longitude: 77.2167,
      dropOffHours: "Mon-Fri 10:00 AM - 5:00 PM",
      contactEmail: "admin@prathamchild.org",
      phone: "+91 11 5555 0199",
      website: "https://www.prathamchild.org",
      adminName: "Rajesh Kumar",
      adminEmail: "rajesh@prathamchild.org",
    },
    {
      name: "Brooklyn Night Shelter Alliance",
      country: "USA",
      organizationIdType: OrganizationIdType.EIN,
      organizationId: "11-3920194",
      verificationStatus: VerificationStatus.REJECTED,
      rejectionReason: "Official Tax EIN registration document failed verification checks.",
      description: "Overnight shelter network serving the greater Brooklyn borough.",
      street: "350 Atlantic Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11201",
      latitude: 40.689,
      longitude: -73.989,
      dropOffHours: "Mon-Sun 7:00 PM - 10:00 PM",
      contactEmail: "support@brooklynnightshelter.org",
      phone: "+1 (718) 555-0177",
      website: "https://www.brooklynnightshelter.org",
      adminName: "Diana Prince",
      adminEmail: "diana@brooklynnightshelter.org",
    },
  ];

  const createdShelters: any[] = [];
  for (const cfg of shelterConfigs) {
    const { adminName, adminEmail, ...shelterData } = cfg;

    const shelter = await prisma.shelter.create({
      data: shelterData,
    });

    const adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash: defaultPasswordHash,
        role: Role.SHELTER_ADMIN,
        shelterId: shelter.id,
        phone: "+1 (555) 111-2222",
      },
    });

    createdShelters.push({ shelter, adminUser });
  }
  console.log(`✔ Created ${createdShelters.length} shelters and shelter admins.`);

  // 7. Create Shelter Requests and Requested Items
  console.log("\n📋 Creating Shelter Supply Requests & Requested Items...");
  const sfShelter = createdShelters[0].shelter;
  const atxShelter = createdShelters[1].shelter;
  const seaShelter = createdShelters[2].shelter;

  // Request 1: SF Emergency Winter Food & Warmth Drive
  const req1 = await prisma.shelterRequest.create({
    data: {
      shelterId: sfShelter.id,
      title: "Urgent Winter Food & Warmth Drive",
      description: "Critical shortage of canned foods, thermal blankets, and baby formula for winter emergency intake.",
      urgency: Urgency.CRITICAL,
      status: RequestStatus.ACTIVE,
      categoryIds: [
        categories["Food & Emergency Nutrition"].id,
        categories["Shelter & Bedding"].id,
      ],
    },
  });

  const reqItem1_1 = await prisma.requestedItem.create({
    data: {
      requestId: req1.id,
      globalItemId: globalItems["Canned Soups & Vegetables (12-Pack)"].id,
      quantityNeeded: 50,
      quantityReserved: 15,
      quantityDelivered: 10,
      unit: "packs",
      notes: "High demand for vegetarian and low-sodium soups.",
    },
  });

  const reqItem1_2 = await prisma.requestedItem.create({
    data: {
      requestId: req1.id,
      globalItemId: globalItems["Fleece Thermal Emergency Blankets"].id,
      quantityNeeded: 30,
      quantityReserved: 10,
      quantityDelivered: 5,
      unit: "blankets",
      notes: "Clean, new thermal blankets required.",
    },
  });

  // Request 2: Austin Family Hygiene & First Aid Campaign
  const req2 = await prisma.shelterRequest.create({
    data: {
      shelterId: atxShelter.id,
      title: "Family Hygiene & Healthcare Support Drive",
      description: "Gathering hygiene kits, first aid trauma supplies, and pain relief bottles for incoming families.",
      urgency: Urgency.HIGH,
      status: RequestStatus.ACTIVE,
      categoryIds: [
        categories["Medical & Healthcare"].id,
        categories["Hygiene & Sanitation"].id,
      ],
    },
  });

  const reqItem2_1 = await prisma.requestedItem.create({
    data: {
      requestId: req2.id,
      globalItemId: globalItems["Emergency First Aid Trauma Kit"].id,
      quantityNeeded: 20,
      quantityReserved: 5,
      quantityDelivered: 5,
      unit: "kits",
      notes: "Must include sterile gauze and disinfectants.",
    },
  });

  const reqItem2_2 = await prisma.requestedItem.create({
    data: {
      requestId: req2.id,
      globalItemId: globalItems["Antibacterial Soap & Hygiene Kits"].id,
      quantityNeeded: 40,
      quantityReserved: 20,
      quantityDelivered: 10,
      unit: "kits",
      notes: "Family-sized hygiene kits preferred.",
    },
  });

  // Request 3: Seattle Cold Weather Overnight Relief (Fulfilled)
  const req3 = await prisma.shelterRequest.create({
    data: {
      shelterId: seaShelter.id,
      title: "Sub-Zero Cold Snap Emergency Response",
      description: "Winter clothing drive for cold weather warming shelters.",
      urgency: Urgency.MEDIUM,
      status: RequestStatus.FULFILLED,
      categoryIds: [
        categories["Clothing & Footwear"].id,
        categories["Shelter & Bedding"].id,
      ],
    },
  });

  const reqItem3_1 = await prisma.requestedItem.create({
    data: {
      requestId: req3.id,
      globalItemId: globalItems["All-Weather Heavy Winter Jackets"].id,
      quantityNeeded: 25,
      quantityReserved: 0,
      quantityDelivered: 25,
      unit: "jackets",
    },
  });

  console.log("✔ Shelter requests and item wishlists created.");

  // 8. Create Pledges and Pledged Items
  console.log("\n🎁 Creating Pledged Drop-off Vouchers...");

  // Pledge 1: Donor Alex -> SF Shelter (RESERVED state)
  const pledge1 = await prisma.pledge.create({
    data: {
      pledgeCode: "PLG-SF-8921",
      donorId: donors[0].id,
      shelterId: sfShelter.id,
      scheduledDropOffDate: new Date(Date.now() + 86400000 * 3), // 3 days in future
      expiresAt: new Date(Date.now() + 86400000 * 7),
      status: PledgeStatus.RESERVED,
    },
  });

  await prisma.pledgedItem.create({
    data: {
      pledgeId: pledge1.id,
      requestedItemId: reqItem1_1.id,
      quantityPledged: 10,
    },
  });

  // Pledge 2: Donor Priya -> Austin Shelter (VERIFIED_FULFILLED state with photo & thank you)
  const pledge2 = await prisma.pledge.create({
    data: {
      pledgeCode: "PLG-ATX-4019",
      donorId: donors[1].id,
      shelterId: atxShelter.id,
      scheduledDropOffDate: new Date(Date.now() - 86400000 * 2),
      expiresAt: new Date(Date.now() + 86400000 * 5),
      fulfilledAt: new Date(Date.now() - 86400000 * 1),
      status: PledgeStatus.VERIFIED_FULFILLED,
      impactPhotoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop&q=80",
      shelterThankYouNote: "Thank you so much Priya! Your generous delivery of hygiene kits helped 10 families today.",
    },
  });

  await prisma.pledgedItem.create({
    data: {
      pledgeId: pledge2.id,
      requestedItemId: reqItem2_2.id,
      quantityPledged: 10,
    },
  });

  console.log("✔ Sample donor pledges created.");

  console.log("\n=======================================================");
  console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=======================================================");
  console.log("Summary of Seeded Credentials for Testing:");
  console.log("  • Super Admin:   admin@heimdall.org / Password123!");
  console.log("  • Shelter Admin: sarah.admin@stvincenthaven.org / Password123!");
  console.log("  • Shelter Admin: marcus@hopecityshelter.org / Password123!");
  console.log("  • Donor User:    alex.rivera@example.com / Password123!");
  console.log("  • Donor User:    priya.sharma@example.com / Password123!");
  console.log("=======================================================\n");
}

seedDatabase()
  .catch((err) => {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
