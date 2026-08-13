import fs from "fs";
import path from "path";
import { Role, PledgeStatus, VerificationStatus, RequestStatus, OrganizationIdType } from "@prisma/client";

// Set Node Env to test to prevent automatic app.listen inside app.ts
(process.env as any).NODE_ENV = "test";

import app from "../src/server/app";
import { prisma } from "../src/lib/prisma";

const LOG_FILE = path.join(__dirname, "test_run.log");
if (fs.existsSync(LOG_FILE)) {
  fs.unlinkSync(LOG_FILE);
}

function log(message: string, type: "INFO" | "SUCCESS" | "INTENDED_ERROR" | "FAIL" = "INFO") {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);

  switch (type) {
    case "SUCCESS":
      console.log(`\x1b[32m✔ [SUCCESS] ${message}\x1b[0m`);
      break;
    case "INTENDED_ERROR":
      console.log(`\x1b[36mℹ [INTENDED ERR] ${message}\x1b[0m`);
      break;
    case "FAIL":
      console.error(`\x1b[31m✘ [FAIL] ${message}\x1b[0m`);
      break;
    case "INFO":
    default:
      console.log(`\x1b[33m[INFO] ${message}\x1b[0m`);
      break;
  }
}

// Cookie state tracker
let activeCookies: Record<string, string> = {};

function extractCookies(headers: Headers): Record<string, string> {
  let cookieStrings: string[] = [];
  if (typeof headers.getSetCookie === "function") {
    cookieStrings = headers.getSetCookie();
  } else {
    const raw = headers.get("set-cookie");
    if (raw) {
      cookieStrings = raw.split(/,\s*/);
    }
  }

  const cookies: Record<string, string> = {};
  for (const str of cookieStrings) {
    const parts = str.split(";")[0];
    const index = parts.indexOf("=");
    if (index !== -1) {
      const key = parts.substring(0, index).trim();
      const val = parts.substring(index + 1).trim();
      cookies[key] = val;
    }
  }
  return cookies;
}

async function apiRequest(method: string, urlPath: string, body?: any, useAuth = true) {
  const headers: Record<string, string> = {};
  if (body) {
    headers["Content-Type"] = "application/json";
  }
  if (useAuth && Object.keys(activeCookies).length > 0) {
    headers["Cookie"] = Object.entries(activeCookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  const url = `http://localhost:5001${urlPath}`;
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const newCookies = extractCookies(response.headers);
  activeCookies = { ...activeCookies, ...newCookies };

  const responseText = await response.text();
  let data: any = null;
  try {
    data = JSON.parse(responseText);
  } catch {
    data = responseText;
  }

  return { status: response.status, data };
}

function switchUser(cookies: Record<string, string>) {
  activeCookies = { ...cookies };
}

function clearCookies() {
  activeCookies = {};
}

async function runTests() {
  log("Starting Heimdall integration and security verification tests...");

  // Start test server
  const server = app.listen(5001, () => {
    log("Test server successfully listening on http://localhost:5001");
  });

  let testFailed = false;

  try {
    // 1. Purge all records using a temporary Super Admin
    log("Registering temporary Super Admin to clean up target database tables...");
    const cleanEmail = `temp.cleaner.${Date.now()}@example.com`;
    const regTemp = await apiRequest("POST", "/api/auth/register-super-admin", {
      name: "Temp Cleaner",
      email: cleanEmail,
      password: "Password123!",
    });

    if (regTemp.status !== 201) {
      throw new Error(`Failed to register temp cleaner: ${JSON.stringify(regTemp.data)}`);
    }

    log("Purging database records...");
    await apiRequest("DELETE", "/api/pledged-items");
    await apiRequest("DELETE", "/api/pledges");
    await apiRequest("DELETE", "/api/requested-items");
    await apiRequest("DELETE", "/api/shelter-requests");
    await apiRequest("DELETE", "/api/shelters");
    await apiRequest("DELETE", "/api/global-items");
    await apiRequest("DELETE", "/api/categories");
    await apiRequest("DELETE", "/api/users"); 

    log("Database successfully cleaned up.", "SUCCESS");

    clearCookies();

    // =========================================================================
    // PHASE 1: FULL CRUD TESTING FOR EVERY MODEL
    // =========================================================================
    log("\n--- PHASE 1: Full CRUD Testing for Every Model ---");

    // Register primary Super Admin for setup & admin operations
    const adminEmail = `super.admin.${Date.now()}@example.com`;
    log(`Registering Super Admin: ${adminEmail}`);
    const regAdmin = await apiRequest("POST", "/api/auth/register-super-admin", {
      name: "Super Admin",
      email: adminEmail,
      password: "Password123!",
    });
    if (regAdmin.status !== 201) throw new Error("Failed to register Super Admin");
    const adminCookies = { ...activeCookies };
    log("Super Admin registered.", "SUCCESS");

    // Register a persistent Donor A for CRUD and Scenario testing
    clearCookies();
    const donorAEmail = `donor.a.${Date.now()}@example.com`;
    log(`Registering Donor A: ${donorAEmail}`);
    const regDonorA = await apiRequest("POST", "/api/auth/register", {
      name: "Donor A",
      email: donorAEmail,
      password: "Password123!",
    });
    if (regDonorA.status !== 201) throw new Error("Failed to register Donor A");
    const donorACookies = { ...activeCookies };
    const donorAId = regDonorA.data.data.id;
    log(`Donor A registered. ID: ${donorAId}`, "SUCCESS");

    // 1. User Model CRUD
    log("\n[User Model CRUD]");
    // Create: Register another donor
    clearCookies();
    const tempUserEmail = `temp.user.${Date.now()}@example.com`;
    const regTempUser = await apiRequest("POST", "/api/auth/register", {
      name: "Temp User",
      email: tempUserEmail,
      password: "Password123!",
    });
    if (regTempUser.status !== 201) throw new Error("Failed to create temporary user");
    const tempUserCookies = { ...activeCookies };
    const tempUserId = regTempUser.data.data.id;
    log(`Temporary user created. ID: ${tempUserId}`, "SUCCESS");

    // Read: Get User details by ID (Self)
    switchUser(tempUserCookies);
    const getUserSelf = await apiRequest("GET", `/api/users/${tempUserId}`);
    if (getUserSelf.status !== 200 || getUserSelf.data.data.email !== tempUserEmail) {
      throw new Error(`Failed to read self user profile: ${JSON.stringify(getUserSelf.data)}`);
    }
    log("Read user details by ID (Self) succeeded.", "SUCCESS");

    // Update: Update user profile details
    const updateUserSelf = await apiRequest("PATCH", `/api/users/${tempUserId}`, {
      name: "Temp User Updated",
      phone: "1234567890"
    });
    if (updateUserSelf.status !== 200 || updateUserSelf.data.data.name !== "Temp User Updated") {
      throw new Error(`Failed to update user profile: ${JSON.stringify(updateUserSelf.data)}`);
    }
    log("Update user profile succeeded.", "SUCCESS");

    // Delete: Delete temporary user
    const deleteUser = await apiRequest("DELETE", `/api/users/${tempUserId}`);
    if (deleteUser.status !== 200) {
      throw new Error(`Failed to delete temporary user: ${JSON.stringify(deleteUser.data)}`);
    }
    log("Delete user by ID succeeded.", "SUCCESS");

    // Verify user deletion (Cannot login anymore)
    clearCookies();
    const loginDeleted = await apiRequest("POST", "/api/auth/login", {
      email: tempUserEmail,
      password: "Password123!"
    });
    if (loginDeleted.status !== 404 && loginDeleted.status !== 401) {
      throw new Error(`Deleted user was still able to login or returned unexpected status: ${loginDeleted.status}`);
    }
    log("Verified deleted user cannot login.", "SUCCESS");


    // 2. Category Model CRUD
    log("\n[Category Model CRUD]");
    switchUser(adminCookies);
    // Create Category
    const createCat = await apiRequest("POST", "/api/categories", {
      name: "Temp Category",
      icon: "temp-icon",
      description: "Temporary category description"
    });
    if (createCat.status !== 201) throw new Error(`Category creation failed: ${JSON.stringify(createCat.data)}`);
    const tempCatId = createCat.data.data.id;
    log(`Category created. ID: ${tempCatId}`, "SUCCESS");

    // Read: Get all categories
    const getCats = await apiRequest("GET", "/api/categories");
    if (getCats.status !== 200 || !Array.isArray(getCats.data.data) || getCats.data.data.length < 1) {
      throw new Error("Failed to read all categories");
    }
    log("Read all categories succeeded.", "SUCCESS");

    // Read: Get category by ID
    const getCatById = await apiRequest("GET", `/api/categories/${tempCatId}`);
    if (getCatById.status !== 200 || getCatById.data.data.name !== "Temp Category") {
      throw new Error("Failed to read category by ID");
    }
    log("Read category by ID succeeded.", "SUCCESS");

    // Read: Get category by Name
    const getCatByName = await apiRequest("GET", `/api/categories/name/Temp Category`);
    if (getCatByName.status !== 200 || getCatByName.data.data.id !== tempCatId) {
      throw new Error("Failed to read category by Name");
    }
    log("Read category by Name succeeded.", "SUCCESS");

    // Update Category
    const updateCat = await apiRequest("PATCH", `/api/categories/${tempCatId}`, {
      description: "Updated description"
    });
    if (updateCat.status !== 200 || updateCat.data.data.description !== "Updated description") {
      throw new Error("Failed to update category");
    }
    log("Update category succeeded.", "SUCCESS");

    // Delete Category
    const deleteCat = await apiRequest("DELETE", `/api/categories/${tempCatId}`);
    if (deleteCat.status !== 200) throw new Error("Failed to delete category");
    log("Delete category succeeded.", "SUCCESS");


    // 3. GlobalItem Model CRUD
    log("\n[GlobalItem Model CRUD]");
    switchUser(adminCookies);
    // Let's create a permanent category first to link items to
    const createPermCat = await apiRequest("POST", "/api/categories", {
      name: "Temporary Linked Cat",
      icon: "link-icon"
    });
    const permCatId = createPermCat.data.data.id;

    // Create Global Item
    const createGI = await apiRequest("POST", "/api/global-items", {
      title: "Temp Global Item",
      description: "GI description",
      defaultUnit: "units",
      categoryId: permCatId
    });
    if (createGI.status !== 201) throw new Error(`GlobalItem creation failed: ${JSON.stringify(createGI.data)}`);
    const tempGIId = createGI.data.data.id;
    log(`GlobalItem created. ID: ${tempGIId}`, "SUCCESS");

    // Read: Get all global items
    const getGIs = await apiRequest("GET", "/api/global-items");
    if (getGIs.status !== 200 || !Array.isArray(getGIs.data.data)) {
      throw new Error("Failed to read all global items");
    }
    log("Read all global items succeeded.", "SUCCESS");

    // Read: Get global item by ID
    const getGIById = await apiRequest("GET", `/api/global-items/${tempGIId}`);
    if (getGIById.status !== 200 || getGIById.data.data.title !== "Temp Global Item") {
      throw new Error("Failed to read global item by ID");
    }
    log("Read global item by ID succeeded.", "SUCCESS");

    // Update Global Item
    const updateGI = await apiRequest("PATCH", `/api/global-items/${tempGIId}`, {
      description: "Updated GI description"
    });
    if (updateGI.status !== 200 || updateGI.data.data.description !== "Updated GI description") {
      throw new Error("Failed to update global item");
    }
    log("Update global item succeeded.", "SUCCESS");

    // Delete Global Item
    const deleteGI = await apiRequest("DELETE", `/api/global-items/${tempGIId}`);
    if (deleteGI.status !== 200) throw new Error("Failed to delete global item");
    log("Delete global item succeeded.", "SUCCESS");

    // Clean up category
    await apiRequest("DELETE", `/api/categories/${permCatId}`);


    // 4. Shelter Model CRUD
    log("\n[Shelter Model CRUD]");
    // Create: Register Shelter as Donor A (will automatically promote user to SHELTER_ADMIN role)
    switchUser(donorACookies);
    const regShelter = await apiRequest("POST", "/api/shelters", {
      name: "Donor A Shelter",
      country: "USA",
      organizationIdType: "EIN",
      organizationId: "135562725", // bypass EIN format
      street: "100 Shelter Lane",
      city: "Austin",
      state: "TX",
      zip: "78701",
      longitude: -97.7431,
      latitude: 30.2672,
      dropOffHours: "9 AM - 5 PM Daily",
      contactEmail: "donor.a.shelter@example.com",
    });

    if (regShelter.status !== 201) {
      throw new Error(`Failed to create shelter: ${JSON.stringify(regShelter.data)}`);
    }
    const donorAAdminCookies = { ...activeCookies };
    const shelterAId = regShelter.data.data.id;
    log(`Shelter created & user promoted to SHELTER_ADMIN. Shelter ID: ${shelterAId}`, "SUCCESS");

    // Wait a brief moment for the background verification process
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Read: Get all shelters
    const getShelters = await apiRequest("GET", "/api/shelters");
    if (getShelters.status !== 200 || !Array.isArray(getShelters.data.data)) {
      throw new Error("Failed to read all shelters");
    }
    log("Read all shelters succeeded.", "SUCCESS");

    // Read: Get shelter by ID
    const getShelterById = await apiRequest("GET", `/api/shelters/${shelterAId}`);
    if (getShelterById.status !== 200 || getShelterById.data.data.verificationStatus !== "VERIFIED") {
      throw new Error(`Failed to read shelter or verification status not verified: ${JSON.stringify(getShelterById.data)}`);
    }
    log(`Read shelter by ID succeeded. Status is VERIFIED.`, "SUCCESS");

    // Read: Get shelter by organizationId
    const getShelterByOrg = await apiRequest("GET", `/api/shelters/organization/135562725`);
    if (getShelterByOrg.status !== 200 || getShelterByOrg.data.data.id !== shelterAId) {
      throw new Error("Failed to read shelter by organization ID");
    }
    log("Read shelter by organization ID succeeded.", "SUCCESS");

    // Update Shelter
    switchUser(donorAAdminCookies);
    const updateShelter = await apiRequest("PATCH", `/api/shelters/${shelterAId}`, {
      description: "Updated Shelter A description"
    });
    if (updateShelter.status !== 200 || updateShelter.data.data.description !== "Updated Shelter A description") {
      throw new Error(`Failed to update shelter: ${JSON.stringify(updateShelter.data)}`);
    }
    log("Update shelter details succeeded.", "SUCCESS");


    // 5. ShelterRequest & RequestedItem Model CRUD
    log("\n[ShelterRequest & RequestedItem Model CRUD]");
    switchUser(adminCookies);
    // Create categories & global items to add to request
    const setupCat = await apiRequest("POST", "/api/categories", {
      name: "Temporary Request Cat",
      icon: "req-icon"
    });
    const setupCatId = setupCat.data.data.id;
    const setupGI = await apiRequest("POST", "/api/global-items", {
      title: "Temporary Request Item",
      categoryId: setupCatId
    });
    const setupGIId = setupGI.data.data.id;

    // Create ShelterRequest
    switchUser(donorAAdminCookies);
    const createReq = await apiRequest("POST", "/api/shelter-requests", {
      shelterId: shelterAId,
      title: "Temp Request Title",
      description: "Temp request desc",
      urgency: "LOW",
      categoryIds: [setupCatId],
      items: [
        {
          globalItemId: setupGIId,
          quantityNeeded: 10,
          unit: "boxes"
        }
      ]
    });
    if (createReq.status !== 201) throw new Error(`Failed to create request: ${JSON.stringify(createReq.data)}`);
    const tempRequestId = createReq.data.data.id;
    const tempReqItemId = createReq.data.data.items[0].id;
    log(`ShelterRequest created. ID: ${tempRequestId}. RequestedItem ID: ${tempReqItemId}`, "SUCCESS");

    // Read: Get all shelter requests
    const getReqs = await apiRequest("GET", "/api/shelter-requests");
    if (getReqs.status !== 200 || !Array.isArray(getReqs.data.data)) {
      throw new Error("Failed to read all requests");
    }
    log("Read all shelter requests succeeded.", "SUCCESS");

    // Read: Get shelter request by ID
    const getReqById = await apiRequest("GET", `/api/shelter-requests/${tempRequestId}`);
    if (getReqById.status !== 200 || getReqById.data.data.title !== "Temp Request Title") {
      throw new Error("Failed to read request by ID");
    }
    log("Read request by ID succeeded.", "SUCCESS");

    // Update ShelterRequest
    const updateReq = await apiRequest("PATCH", `/api/shelter-requests/${tempRequestId}`, {
      title: "Updated Request Title"
    });
    if (updateReq.status !== 200 || updateReq.data.data.title !== "Updated Request Title") {
      throw new Error("Failed to update request");
    }
    log("Update request succeeded.", "SUCCESS");

    // RequestedItem CRUD - Read Requested Item details
    const getRI = await apiRequest("GET", `/api/requested-items/${tempReqItemId}`);
    if (getRI.status !== 200 || getRI.data.data.quantityNeeded !== 10) {
      throw new Error("Failed to read requested item details");
    }
    log("Read requested item details succeeded.", "SUCCESS");

    // RequestedItem CRUD - Create a second requested item in request
    switchUser(adminCookies);
    const setupGI2Res = await apiRequest("POST", "/api/global-items", {
      title: "Temporary Second Item",
      categoryId: setupCatId
    });
    const setupGI2Id = setupGI2Res.data.data.id;

    switchUser(donorAAdminCookies);
    const addReqItem = await apiRequest("POST", "/api/requested-items", {
      requestId: tempRequestId,
      globalItemId: setupGI2Id,
      quantityNeeded: 5,
      unit: "packs"
    });
    if (addReqItem.status !== 201) throw new Error("Failed to add requested item");
    const tempReqItem2Id = addReqItem.data.data.id;
    log(`Created requested item. ID: ${tempReqItem2Id}`, "SUCCESS");

    // RequestedItem CRUD - Update Requested Item
    const updateRI = await apiRequest("PATCH", `/api/requested-items/${tempReqItem2Id}`, {
      quantityNeeded: 15
    });
    if (updateRI.status !== 200 || updateRI.data.data.quantityNeeded !== 15) {
      throw new Error("Failed to update requested item");
    }
    log("Update requested item quantity succeeded.", "SUCCESS");

    // RequestedItem CRUD - Delete Requested Item
    const deleteRI = await apiRequest("DELETE", `/api/requested-items/${tempReqItem2Id}`);
    if (deleteRI.status !== 200) throw new Error("Failed to delete requested item");
    log("Delete requested item succeeded.", "SUCCESS");

    // Clean up request, categories, and global items
    const deleteReq = await apiRequest("DELETE", `/api/shelter-requests/${tempRequestId}`);
    if (deleteReq.status !== 200) throw new Error("Failed to delete request");
    log("Delete shelter request succeeded.", "SUCCESS");

    switchUser(adminCookies);
    await apiRequest("DELETE", `/api/global-items/${setupGIId}`);
    await apiRequest("DELETE", `/api/global-items/${setupGI2Id}`);
    await apiRequest("DELETE", `/api/categories/${setupCatId}`);


    // 6. Pledge & PledgedItem Model CRUD
    log("\n[Pledge & PledgedItem Model CRUD]");
    // Setup temporary request and items for pledge tests
    switchUser(adminCookies);
    const pCat = await apiRequest("POST", "/api/categories", { name: "Pledge Cat", icon: "plg" });
    const pCatId = pCat.data.data.id;
    const pGI = await apiRequest("POST", "/api/global-items", { title: "Pledge Item", categoryId: pCatId });
    const pGIId = pGI.data.data.id;

    switchUser(donorAAdminCookies);
    const pReq = await apiRequest("POST", "/api/shelter-requests", {
      shelterId: shelterAId,
      title: "Pledge Request",
      urgency: "MEDIUM",
      categoryIds: [pCatId],
      items: [{ globalItemId: pGIId, quantityNeeded: 20 }]
    });
    const pReqId = pReq.data.data.id;
    const pReqItemId = pReq.data.data.items[0].id;

    // Create: Create Pledge (Donor A acting as donor now)
    clearCookies();
    const donorTmpEmail = `donor.tmp.${Date.now()}@example.com`;
    const regDonorTmp = await apiRequest("POST", "/api/auth/register", {
      name: "Donor Tmp",
      email: donorTmpEmail,
      password: "Password123!"
    });
    const donorTmpCookies = { ...activeCookies };
    const donorTmpId = regDonorTmp.data.data.id;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const makePledge = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: pReqItemId, quantityPledged: 10 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (makePledge.status !== 201) throw new Error(`Pledge creation failed: ${JSON.stringify(makePledge.data)}`);
    const pledgeId = makePledge.data.data.id;
    const pledgeCode = makePledge.data.data.pledgeCode;
    const pledgedItemId = makePledge.data.data.items[0].id;
    log(`Pledge created. ID: ${pledgeId}. Code: ${pledgeCode}. PledgedItem ID: ${pledgedItemId}`, "SUCCESS");

    // Read: Get my pledges
    const getMyPledges = await apiRequest("GET", "/api/pledges/my");
    if (getMyPledges.status !== 200 || getMyPledges.data.data.length !== 1) {
      throw new Error("Failed to read user's own pledges");
    }
    log("Read donor's own pledges succeeded.", "SUCCESS");

    // Read: Get shelter pledges
    switchUser(donorAAdminCookies);
    const getShelterPledges = await apiRequest("GET", `/api/pledges/shelter/${shelterAId}`);
    if (getShelterPledges.status !== 200 || getShelterPledges.data.data.length < 1) {
      throw new Error("Failed to read shelter's pledges");
    }
    log("Read shelter pledges succeeded.", "SUCCESS");

    // Read: Get pledge by ID
    switchUser(donorTmpCookies);
    const getPledgeById = await apiRequest("GET", `/api/pledges/${pledgeId}`);
    if (getPledgeById.status !== 200 || getPledgeById.data.data.pledgeCode !== pledgeCode) {
      throw new Error("Failed to read pledge by ID");
    }
    log("Read pledge by ID succeeded.", "SUCCESS");

    // Read: Get pledge by Code
    const getPledgeByCode = await apiRequest("GET", `/api/pledges/code/${pledgeCode}`);
    if (getPledgeByCode.status !== 200 || getPledgeByCode.data.data.id !== pledgeId) {
      throw new Error("Failed to read pledge by Code");
    }
    log("Read pledge by Code succeeded.", "SUCCESS");

    // PledgedItem CRUD - Get pledged item by ID
    const getPI = await apiRequest("GET", `/api/pledged-items/${pledgedItemId}`);
    if (getPI.status !== 200 || getPI.data.data.quantityPledged !== 10) {
      throw new Error("Failed to read pledged item details");
    }
    log("Read pledged item details succeeded.", "SUCCESS");

    // PledgedItem CRUD - Update quantity pledged
    const updatePI = await apiRequest("PATCH", `/api/pledged-items/${pledgedItemId}`, {
      quantityPledged: 15
    });
    if (updatePI.status !== 200 || updatePI.data.data.quantityPledged !== 15) {
      throw new Error("Failed to update pledged item quantity");
    }
    log("Update pledged item quantity succeeded.", "SUCCESS");

    // PledgedItem CRUD - Delete pledged item (should auto-cancel parent pledge)
    const deletePI = await apiRequest("DELETE", `/api/pledged-items/${pledgedItemId}`);
    if (deletePI.status !== 200) throw new Error("Failed to delete pledged item");
    log("Delete pledged item succeeded.", "SUCCESS");

    // Read pledge status and verify it is CANCELLED
    const checkPledgeStatus = await apiRequest("GET", `/api/pledges/${pledgeId}`);
    if (checkPledgeStatus.data.data.status !== PledgeStatus.CANCELLED) {
      throw new Error(`Expected pledge to be cancelled after deleting all its items. Status: ${checkPledgeStatus.data.data.status}`);
    }
    log("Verified parent pledge auto-cancelled successfully on last item deletion.", "SUCCESS");

    // Clean up pledge temporary models
    switchUser(adminCookies);
    // Purge pledges first to clear foreign key / relation constraints on User and Shelter models
    await apiRequest("DELETE", "/api/pledges");
    await apiRequest("DELETE", `/api/shelter-requests/${pReqId}`);
    await apiRequest("DELETE", `/api/global-items/${pGIId}`);
    await apiRequest("DELETE", `/api/categories/${pCatId}`);
    await apiRequest("DELETE", `/api/users/${donorTmpId}`);
    await apiRequest("DELETE", `/api/shelters/${shelterAId}`);
    await apiRequest("DELETE", `/api/users/${donorAId}`);

    log("\nPhase 1 CRUD verification completed successfully!", "SUCCESS");


    // =========================================================================
    // PHASE 2: COMPREHENSIVE WEBSITE EXPERIENCE TEST SCENARIO
    // =========================================================================
    log("\n--- PHASE 2: Full Website Experience Test Scenario ---");

    // STEP 0: Super Admin Setup Categories & GlobalItems
    switchUser(adminCookies);
    log("[Step 0] Super Admin creating Categories 'Medical Supplies' & 'Winter Clothing'...");
    const medCat = await apiRequest("POST", "/api/categories", { name: "Medical Supplies", icon: "shield-alert" });
    const winCat = await apiRequest("POST", "/api/categories", { name: "Winter Clothing", icon: "snowflake" });
    const medCatId = medCat.data.data.id;
    const winCatId = winCat.data.data.id;

    log("[Step 0] Super Admin creating Global Items 'Bandages', 'Antiseptic Wipes' & 'Thermal Blankets'...");
    const bandagesGI = await apiRequest("POST", "/api/global-items", { title: "Bandages", defaultUnit: "boxes", categoryId: medCatId });
    const wipesGI = await apiRequest("POST", "/api/global-items", { title: "Antiseptic Wipes", defaultUnit: "packs", categoryId: medCatId });
    const blanketsGI = await apiRequest("POST", "/api/global-items", { title: "Thermal Blankets", defaultUnit: "pieces", categoryId: winCatId });
    
    const bandagesId = bandagesGI.data.data.id;
    const wipesId = wipesGI.data.data.id;
    const blanketsId = blanketsGI.data.data.id;
    log("Global catalog initialized.", "SUCCESS");

    // STEP 1: User A visits and logs in as a DONOR
    clearCookies();
    const userAEmail = `user.a.${Date.now()}@example.com`;
    log(`[Step 1] Registering and logging in User A: ${userAEmail}`);
    const regUserA = await apiRequest("POST", "/api/auth/register", {
      name: "User A",
      email: userAEmail,
      password: "Password123!"
    });
    const userACookies = { ...activeCookies };
    const userAUserId = regUserA.data.data.id;
    log(`User A registered. ID: ${userAUserId}`, "SUCCESS");

    // STEP 2: User A creates a shelter (Automatically promoted to SHELTER_ADMIN)
    switchUser(userACookies);
    log("[Step 2] User A creating Shelter 'Safe Haven Shelter' (EIN bypass)...");
    const createShelterA = await apiRequest("POST", "/api/shelters", {
      name: "Safe Haven Shelter",
      country: "USA",
      organizationIdType: "EIN",
      organizationId: "135562725", // verified bypass EIN
      street: "123 Safe Haven Road",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      longitude: -122.4194,
      latitude: 37.7749,
      dropOffHours: "8 AM - 8 PM Daily",
      contactEmail: "contact@safehaven.org"
    });
    if (createShelterA.status !== 201) throw new Error("Failed to register Safe Haven Shelter");
    const shelterA = createShelterA.data.data;
    const userAAdminCookies = { ...activeCookies };
    log(`Shelter A registered. Verification Status: ${shelterA.verificationStatus}`, "SUCCESS");

    // Wait a moment for background verification to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify shelter is now verified
    const getShelterCheck = await apiRequest("GET", `/api/shelters/${shelterA.id}`);
    if (getShelterCheck.data.data.verificationStatus !== "VERIFIED") {
      throw new Error(`Shelter A verification status is ${getShelterCheck.data.data.verificationStatus}, expected VERIFIED`);
    }
    log("Verified Shelter A successfully transitioned to VERIFIED.", "SUCCESS");

    // User A puts in a shelter Request picking global items
    log("[Step 2] Shelter Admin A creating ShelterRequest for Bandages and Thermal Blankets...");
    const createRequestA = await apiRequest("POST", "/api/shelter-requests", {
      shelterId: shelterA.id,
      title: "Emergency Winter & Medical Supplies",
      urgency: "HIGH",
      categoryIds: [medCatId, winCatId],
      items: [
        { globalItemId: bandagesId, quantityNeeded: 20, unit: "boxes" },
        { globalItemId: blanketsId, quantityNeeded: 10, unit: "pieces" }
      ]
    });
    if (createRequestA.status !== 201) throw new Error(`Shelter Request creation failed: ${JSON.stringify(createRequestA.data)}`);
    const shelterRequestA = createRequestA.data.data;
    const reqBandagesItem = shelterRequestA.items.find((i: any) => i.globalItemId === bandagesId);
    const reqBlanketsItem = shelterRequestA.items.find((i: any) => i.globalItemId === blanketsId);
    log(`Shelter Request created. ID: ${shelterRequestA.id}. Items: Bandages (${reqBandagesItem.id}), Blankets (${reqBlanketsItem.id})`, "SUCCESS");

    // STEP 3: User B visits and logs in as a DONOR
    clearCookies();
    const userBEmail = `user.b.${Date.now()}@example.com`;
    log(`[Step 3] Registering and logging in User B: ${userBEmail}`);
    const regUserB = await apiRequest("POST", "/api/auth/register", {
      name: "User B",
      email: userBEmail,
      password: "Password123!"
    });
    const userBCookies = { ...activeCookies };
    const userBUserId = regUserB.data.data.id;
    log(`User B registered. ID: ${userBUserId}`, "SUCCESS");

    // STEP 4: User B sees the ShelterRequest and Creates a Pledge
    switchUser(userBCookies);
    log("[Step 4] User B creating Pledge B1 for 15 Bandages and 8 Thermal Blankets...");
    const createPledgeB1 = await apiRequest("POST", "/api/pledges", {
      items: [
        { requestedItemId: reqBandagesItem.id, quantityPledged: 15 },
        { requestedItemId: reqBlanketsItem.id, quantityPledged: 8 }
      ],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (createPledgeB1.status !== 201) throw new Error(`Pledge B1 creation failed: ${JSON.stringify(createPledgeB1.data)}`);
    const pledgeB1 = createPledgeB1.data.data;
    const plgB1Bandages = pledgeB1.items.find((i: any) => i.requestedItemId === reqBandagesItem.id);
    const plgB1Blankets = pledgeB1.items.find((i: any) => i.requestedItemId === reqBlanketsItem.id);
    log(`Pledge B1 created successfully. Code: ${pledgeB1.pledgeCode}`, "SUCCESS");

    // Verify quantityReserved is updated
    log("Verifying inventory updates (quantityReserved) for Pledge B1...");
    const checkRI_B1_Bandages = await apiRequest("GET", `/api/requested-items/${reqBandagesItem.id}`);
    const checkRI_B1_Blankets = await apiRequest("GET", `/api/requested-items/${reqBlanketsItem.id}`);
    log(`Bandages - Reserved: ${checkRI_B1_Bandages.data.data.quantityReserved}/20`, "SUCCESS");
    log(`Blankets - Reserved: ${checkRI_B1_Blankets.data.data.quantityReserved}/10`, "SUCCESS");
    if (checkRI_B1_Bandages.data.data.quantityReserved !== 15 || checkRI_B1_Blankets.data.data.quantityReserved !== 8) {
      throw new Error("Pledge B1 quantityReserved validation failed.");
    }

    // STEP 5: User B partially fulfills the pledge (donates some of the items, not all)
    // To represent this, User B updates their pledge quantities to what they actually drop off
    log("[Step 5] User B updating Pledge B1 item quantities (10 Bandages, 5 Thermal Blankets)...");
    const updatePledgeB1_Bandages = await apiRequest("PATCH", `/api/pledged-items/${plgB1Bandages.id}`, { quantityPledged: 10 });
    const updatePledgeB1_Blankets = await apiRequest("PATCH", `/api/pledged-items/${plgB1Blankets.id}`, { quantityPledged: 5 });
    if (updatePledgeB1_Bandages.status !== 200 || updatePledgeB1_Blankets.status !== 200) {
      throw new Error("Failed to update pledge quantities for partial drop-off");
    }
    log("Pledge B1 quantities updated successfully.", "SUCCESS");

    // Verify reservation has adjusted down
    const checkRI_B1_Bandages_Post = await apiRequest("GET", `/api/requested-items/${reqBandagesItem.id}`);
    if (checkRI_B1_Bandages_Post.data.data.quantityReserved !== 10) {
      throw new Error(`Expected reserved bandages to decrease to 10, got ${checkRI_B1_Bandages_Post.data.data.quantityReserved}`);
    }

    // Shelter Admin A scans/verifies drop off
    switchUser(userAAdminCookies);
    log("[Step 5] Shelter Admin A verifying and delivering Pledge B1...");
    const fulfillPledgeB1 = await apiRequest("POST", "/api/pledges/verify", {
      pledgeCode: pledgeB1.pledgeCode,
      impactPhotoUrl: "https://example.com/donor_b1_impact.jpg",
      shelterThankYouNote: "Thank you for the first batch, User B!"
    });
    if (fulfillPledgeB1.status !== 200) throw new Error(`Fulfillment of Pledge B1 failed: ${JSON.stringify(fulfillPledgeB1.data)}`);
    log("Pledge B1 verified and marked as DELIVERED.", "SUCCESS");

    // Verify quantityReserved resets to 0 and quantityDelivered increments to 10 and 5
    const checkRI_B1_Delivered_Bandages = await apiRequest("GET", `/api/requested-items/${reqBandagesItem.id}`);
    const checkRI_B1_Delivered_Blankets = await apiRequest("GET", `/api/requested-items/${reqBlanketsItem.id}`);
    log(`Bandages delivered: ${checkRI_B1_Delivered_Bandages.data.data.quantityDelivered}, reserved: ${checkRI_B1_Delivered_Bandages.data.data.quantityReserved}`, "SUCCESS");
    log(`Blankets delivered: ${checkRI_B1_Delivered_Blankets.data.data.quantityDelivered}, reserved: ${checkRI_B1_Delivered_Blankets.data.data.quantityReserved}`, "SUCCESS");
    if (
      checkRI_B1_Delivered_Bandages.data.data.quantityDelivered !== 10 ||
      checkRI_B1_Delivered_Bandages.data.data.quantityReserved !== 0 ||
      checkRI_B1_Delivered_Blankets.data.data.quantityDelivered !== 5 ||
      checkRI_B1_Delivered_Blankets.data.data.quantityReserved !== 0
    ) {
      throw new Error("Delivered / Reserved quantities mismatch post Pledge B1 verification.");
    }

    // Verify User B trust metric pledgesCompleted incremented
    switchUser(adminCookies);
    const checkUserB = await apiRequest("GET", `/api/users/${userBUserId}`);
    log(`User B trust metrics - pledgesCompleted: ${checkUserB.data.data.pledgesCompleted}`, "SUCCESS");
    if (checkUserB.data.data.pledgesCompleted !== 1) {
      throw new Error("User B trust metric did not update.");
    }

    // STEP 7: User C visits and logs in as a DONOR
    clearCookies();
    const userCEmail = `user.c.${Date.now()}@example.com`;
    log(`[Step 7] Registering and logging in User C: ${userCEmail}`);
    const regUserC = await apiRequest("POST", "/api/auth/register", {
      name: "User C",
      email: userCEmail,
      password: "Password123!"
    });
    const userCCookies = { ...activeCookies };
    const userCUserId = regUserC.data.data.id;
    log(`User C registered. ID: ${userCUserId}`, "SUCCESS");

    // STEP 8: User C Sees the Incomplete ShelterRequest and Creates a Pledge
    // (Needs remaining: 10 Bandages, 5 Thermal Blankets).
    // Let's say User C pledges 6 Bandages and 3 Thermal Blankets.
    switchUser(userCCookies);
    log("[Step 8] User C creating Pledge C1 for 6 Bandages and 3 Thermal Blankets...");
    const createPledgeC1 = await apiRequest("POST", "/api/pledges", {
      items: [
        { requestedItemId: reqBandagesItem.id, quantityPledged: 6 },
        { requestedItemId: reqBlanketsItem.id, quantityPledged: 3 }
      ],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (createPledgeC1.status !== 201) throw new Error(`Pledge C1 creation failed: ${JSON.stringify(createPledgeC1.data)}`);
    const pledgeC1 = createPledgeC1.data.data;
    log(`Pledge C1 created. Code: ${pledgeC1.pledgeCode}`, "SUCCESS");

    // Shelter Admin A fulfills User C's pledge
    switchUser(userAAdminCookies);
    log("[Step 8] Shelter Admin A verifying and delivering Pledge C1...");
    const fulfillPledgeC1 = await apiRequest("POST", "/api/pledges/verify", {
      pledgeCode: pledgeC1.pledgeCode,
      impactPhotoUrl: "https://example.com/donor_c1_impact.jpg",
      shelterThankYouNote: "Thank you for these, User C!"
    });
    if (fulfillPledgeC1.status !== 200) throw new Error("Fulfillment of Pledge C1 failed");
    log("Pledge C1 delivered successfully.", "SUCCESS");

    // Check delivered items: Bandages delivered is now 16 (10 + 6). Blankets delivered is now 8 (5 + 3).
    const checkRI_C1_Delivered_Bandages = await apiRequest("GET", `/api/requested-items/${reqBandagesItem.id}`);
    const checkRI_C1_Delivered_Blankets = await apiRequest("GET", `/api/requested-items/${reqBlanketsItem.id}`);
    log(`Total Delivered Bandages: ${checkRI_C1_Delivered_Bandages.data.data.quantityDelivered}/20`, "SUCCESS");
    log(`Total Delivered Blankets: ${checkRI_C1_Delivered_Blankets.data.data.quantityDelivered}/10`, "SUCCESS");
    if (checkRI_C1_Delivered_Bandages.data.data.quantityDelivered !== 16 || checkRI_C1_Delivered_Blankets.data.data.quantityDelivered !== 8) {
      throw new Error("Delivered totals after Pledge C1 fail validation.");
    }

    // STEP 9: User B fulfills the pledge (donates the remaining items)
    // The request still needs: 4 Bandages (20 - 16) and 2 Blankets (10 - 8).
    // User B creates a new pledge for these remaining quantities, and drops them off.
    switchUser(userBCookies);
    log("[Step 9] User B creating Pledge B2 for the remaining 4 Bandages and 2 Thermal Blankets...");
    const createPledgeB2 = await apiRequest("POST", "/api/pledges", {
      items: [
        { requestedItemId: reqBandagesItem.id, quantityPledged: 4 },
        { requestedItemId: reqBlanketsItem.id, quantityPledged: 2 }
      ],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (createPledgeB2.status !== 201) throw new Error("Pledge B2 creation failed");
    const pledgeB2 = createPledgeB2.data.data;
    log(`Pledge B2 created. Code: ${pledgeB2.pledgeCode}`, "SUCCESS");

    // Shelter Admin A verifies and fulfills Pledge B2
    switchUser(userAAdminCookies);
    log("[Step 9] Shelter Admin A verifying and delivering Pledge B2...");
    const fulfillPledgeB2 = await apiRequest("POST", "/api/pledges/verify", {
      pledgeCode: pledgeB2.pledgeCode,
      impactPhotoUrl: "https://example.com/donor_b2_impact.jpg",
      shelterThankYouNote: "Awesome! The request is now fully fulfilled. Thank you User B!"
    });
    if (fulfillPledgeB2.status !== 200) throw new Error("Fulfillment of Pledge B2 failed");
    log("Pledge B2 delivered successfully.", "SUCCESS");

    // Verify quantities are 20 and 10, and Request Status is FULFILLED
    const finalRequestCheck = await apiRequest("GET", `/api/shelter-requests/${shelterRequestA.id}`);
    log(`Final Request Status: ${finalRequestCheck.data.data.status}`, "SUCCESS");
    if (finalRequestCheck.data.data.status !== "FULFILLED") {
      throw new Error(`Expected request status to be FULFILLED, got ${finalRequestCheck.data.data.status}`);
    }

    const checkFinal_Bandages = await apiRequest("GET", `/api/requested-items/${reqBandagesItem.id}`);
    const checkFinal_Blankets = await apiRequest("GET", `/api/requested-items/${reqBlanketsItem.id}`);
    log(`Final Bandages - Delivered: ${checkFinal_Bandages.data.data.quantityDelivered}/20`, "SUCCESS");
    log(`Final Blankets - Delivered: ${checkFinal_Blankets.data.data.quantityDelivered}/10`, "SUCCESS");
    if (checkFinal_Bandages.data.data.quantityDelivered !== 20 || checkFinal_Blankets.data.data.quantityDelivered !== 10) {
      throw new Error("Final quantities do not match expected fulfilled capacities.");
    }

    log("\nPhase 2 website experience lifecycle scenario completed successfully!", "SUCCESS");


    // =========================================================================
    // PHASE 3: DEEP EDGE CASE AND SECURITY VALIDATIONS
    // =========================================================================
    log("\n--- PHASE 3: Deep Edge Case and Security Validations ---");

    // Set up a new verified Shelter (India NGO Darpan bypass) and active request
    switchUser(userBCookies); // Promote User B to admin of a secondary shelter
    log("Registering secondary Shelter B under India NGO Darpan bypass...");
    const createShelterB = await apiRequest("POST", "/api/shelters", {
      name: "Indian Hope Foundation",
      country: "India",
      organizationIdType: "NGO_DARPAN",
      organizationId: "MH/2023/1234567", // Valid Darpan format bypass
      street: "45 MG Road",
      city: "Mumbai",
      state: "MH",
      zip: "400001",
      longitude: 72.8777,
      latitude: 19.0760,
      dropOffHours: "10 AM - 6 PM Daily",
      contactEmail: "mumbai@indiahope.org"
    });
    if (createShelterB.status !== 201) throw new Error("Failed to register India Shelter B");
    const shelterB = createShelterB.data.data;
    const userBAdminCookies = { ...activeCookies };
    log("Shelter B registered successfully.", "SUCCESS");

    // Wait a brief moment for the background verification execution
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify Shelter B is verified
    const getShelterBCheck = await apiRequest("GET", `/api/shelters/${shelterB.id}`);
    if (getShelterBCheck.data.data.verificationStatus !== "VERIFIED") {
      throw new Error(`Shelter B verification status is ${getShelterBCheck.data.data.verificationStatus}, expected VERIFIED`);
    }

    // Shelter B creates Request B
    switchUser(userBAdminCookies);
    const createRequestB = await apiRequest("POST", "/api/shelter-requests", {
      shelterId: shelterB.id,
      title: "Mumbai Monsoon Aid",
      urgency: "CRITICAL",
      categoryIds: [medCatId],
      items: [
        { globalItemId: wipesId, quantityNeeded: 5, unit: "packs" }
      ]
    });
    const requestB = createRequestB.data.data;
    const reqWipesItem = requestB.items[0];

    // Edge Case 1: Capacity Violation
    // Attempting to pledge 6 wipes when only 5 are needed. (Expected: 400 Bad Request)
    switchUser(userCCookies);
    log("Edge Case 1: Pledging more than needed (Pledging 6, capacity 5) (Expected: 400)...");
    const badPledgeCapacity = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: reqWipesItem.id, quantityPledged: 6 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (badPledgeCapacity.status === 400) {
      log("Successfully blocked over-capacity pledge.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Over-capacity pledge allowed! Status: ${badPledgeCapacity.status}`);
    }

    // Edge Case 2: Double Fulfillment
    // Pledge 3 wipes, then fulfill them. Try to fulfill them again.
    log("Edge Case 2: Double Fulfillment validation...");
    log("User C pledges 3 wipes...");
    const pledgeC2 = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: reqWipesItem.id, quantityPledged: 3 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (pledgeC2.status !== 201) throw new Error("Pledge creation failed");
    const pC2Code = pledgeC2.data.data.pledgeCode;

    switchUser(userBAdminCookies);
    log("Shelter B Admin fulfills pledge first time (Expected: 200 OK)...");
    const fulfillC2First = await apiRequest("POST", "/api/pledges/verify", {
      pledgeCode: pC2Code,
      shelterThankYouNote: "First thanks"
    });
    if (fulfillC2First.status !== 200) throw new Error("First fulfillment failed");
    log("First fulfillment succeeded.", "SUCCESS");

    log("Shelter B Admin attempts to fulfill same pledge second time (Expected: 400 Bad Request)...");
    const fulfillC2Second = await apiRequest("POST", "/api/pledges/verify", {
      pledgeCode: pC2Code,
      shelterThankYouNote: "Second thanks"
    });
    if (fulfillC2Second.status === 400) {
      log("Successfully blocked duplicate fulfillment attempt.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Double fulfillment allowed! Status: ${fulfillC2Second.status}`);
    }

    // Edge Case 3: Pledge Expiration & Trust Metrics
    // User C pledges remaining 2 wipes.
    switchUser(userCCookies);
    log("Edge Case 3: Pledge Expiration testing...");
    log("User C pledges 2 wipes...");
    const pledgeC3 = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: reqWipesItem.id, quantityPledged: 2 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (pledgeC3.status !== 201) throw new Error("Pledge creation failed");
    const pC3Id = pledgeC3.data.data.id;

    // Verify quantityReserved is 2
    const checkRIWipes_PreExp = await apiRequest("GET", `/api/requested-items/${reqWipesItem.id}`);
    if (checkRIWipes_PreExp.data.data.quantityReserved !== 2) {
      throw new Error(`Reserved wipes expected 2, got ${checkRIWipes_PreExp.data.data.quantityReserved}`);
    }

    // Force pledge expiration in database by modifying `expiresAt`
    log("Artificially expiring Pledge in database...");
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2);
    await prisma.pledge.update({
      where: { id: pC3Id },
      data: { expiresAt: pastDate }
    });

    // Run expiration job
    switchUser(adminCookies);
    log("Triggering check and expiration of expired reservations...");
    const triggerExp = await apiRequest("POST", "/api/pledges/trigger-expiry");
    if (triggerExp.status !== 200) throw new Error("Expiry trigger failed");
    log("Expiry trigger job completed.", "SUCCESS");

    // Verify reservation was released (quantityReserved = 0)
    const checkRIWipes_PostExp = await apiRequest("GET", `/api/requested-items/${reqWipesItem.id}`);
    log(`Wipes Reserved post-expiry: ${checkRIWipes_PostExp.data.data.quantityReserved} (Expected: 0)`, "SUCCESS");
    if (checkRIWipes_PostExp.data.data.quantityReserved !== 0) {
      throw new Error("Pledge reservation did not release after expiration.");
    }

    // Verify User C pledgesExpired trust metric incremented
    const checkUserC = await apiRequest("GET", `/api/users/${userCUserId}`);
    log(`User C trust metrics - pledgesExpired: ${checkUserC.data.data.pledgesExpired} (Expected: 1)`, "SUCCESS");
    if (checkUserC.data.data.pledgesExpired !== 1) {
      throw new Error("User C pledgesExpired score did not increment.");
    }


    // Edge Case 4: Ghost Pledge Cancellation
    // User C pledges 2 wipes again.
    switchUser(userCCookies);
    log("Edge Case 4: Ghost Pledge Cancellation testing...");
    const pledgeC4 = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: reqWipesItem.id, quantityPledged: 2 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    const pC4Id = pledgeC4.data.data.id;
    const pC4ItemId = pledgeC4.data.data.items[0].id;

    // Delete the only pledged item in the pledge
    log("Deleting pledged item to verify auto-cancellation...");
    const deletePI_C4 = await apiRequest("DELETE", `/api/pledged-items/${pC4ItemId}`);
    if (deletePI_C4.status !== 200) throw new Error("Failed to delete pledged item");

    // Verify parent pledge becomes CANCELLED and reserves are released
    const checkPledgeC4 = await apiRequest("GET", `/api/pledges/${pC4Id}`);
    log(`Pledge C4 status: ${checkPledgeC4.data.data.status} (Expected: CANCELLED)`, "SUCCESS");
    if (checkPledgeC4.data.data.status !== PledgeStatus.CANCELLED) {
      throw new Error("Pledge was not auto-cancelled on deleting all items.");
    }


    // Edge Case 5: RBAC & IDOR Blocks
    log("\n[RBAC & IDOR Security Checks]");
    // User C (DONOR) trying to list all users (Super Admin only)
    switchUser(userCCookies);
    log("User C (DONOR) attempts GET /api/users (Expected: 403)...");
    const rbacGetUsers = await apiRequest("GET", "/api/users");
    if (rbacGetUsers.status === 403) {
      log("Blocked DONOR from listing users.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: DONOR listed users! Status: ${rbacGetUsers.status}`);
    }

    // User C (DONOR) trying to update User B's profile (Self/Admin only)
    log("User C (DONOR) attempts to modify User B profile (Expected: 403)...");
    const idorUpdateUser = await apiRequest("PATCH", `/api/users/${userBUserId}`, { name: "Hacked!" });
    if (idorUpdateUser.status === 403) {
      log("Blocked IDOR profile modification.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: User profile IDOR bypass allowed! Status: ${idorUpdateUser.status}`);
    }

    // User C (DONOR) trying to delete Category (Admin only)
    log("User C (DONOR) attempts to delete Category (Expected: 403)...");
    const rbacDeleteCat = await apiRequest("DELETE", `/api/categories/${medCatId}`);
    if (rbacDeleteCat.status === 403) {
      log("Blocked DONOR from deleting category.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: DONOR deleted category! Status: ${rbacDeleteCat.status}`);
    }

    // User C (DONOR) trying to read Pledge B1 (needs to be donor of the pledge, shelter admin of receiving shelter, or admin)
    log("User C (DONOR) attempts to view Pledge B1 details (Expected: 403)...");
    const idorReadPledge = await apiRequest("GET", `/api/pledges/${pledgeB1.id}`);
    if (idorReadPledge.status === 403) {
      log("Blocked IDOR reading of another user's pledge details.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: IDOR read of another user's pledge allowed! Status: ${idorReadPledge.status}`);
    }

    // Shelter Admin A trying to update Shelter B request details
    switchUser(userAAdminCookies);
    log("Shelter Admin A attempts to modify Shelter B Request (Expected: 403)...");
    const idorUpdateRequest = await apiRequest("PATCH", `/api/shelter-requests/${requestB.id}`, { title: "Hacked Request" });
    if (idorUpdateRequest.status === 403) {
      log("Blocked Shelter Admin A from modifying Shelter B's request.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Cross-shelter request update allowed! Status: ${idorUpdateRequest.status}`);
    }


    // Edge Case 6: Block Request for Unverified Shelter
    clearCookies();
    const userDEmail = `user.d.${Date.now()}@example.com`;
    const regUserD = await apiRequest("POST", "/api/auth/register", {
      name: "User D",
      email: userDEmail,
      password: "Password123!"
    });
    const userDCookies = { ...activeCookies };
    
    // Register unverified shelter (uses random EIN which ProPublica won't verify, or is mock rejection)
    switchUser(userDCookies);
    log("Registering Shelter C with mock rejection EIN '999999999'...");
    const createShelterC = await apiRequest("POST", "/api/shelters", {
      name: "Rejected Shelter C",
      country: "USA",
      organizationIdType: "EIN",
      organizationId: "999999999", // mock rejection EIN
      street: "12 Main St",
      city: "San Jose",
      state: "CA",
      zip: "95112",
      longitude: -121.8863,
      latitude: 37.3382,
      dropOffHours: "9 AM - 5 PM Daily",
      contactEmail: "rejected@shelterc.org"
    });
    const shelterCId = createShelterC.data.data.id;
    const userCAdminCookies = { ...activeCookies };

    // Wait a brief moment for the background verification execution
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify status is REJECTED
    const getShelterCCheck = await apiRequest("GET", `/api/shelters/${shelterCId}`);
    log(`Shelter C Verification Status: ${getShelterCCheck.data.data.verificationStatus} (Expected: REJECTED)`, "SUCCESS");
    if (getShelterCCheck.data.data.verificationStatus !== "REJECTED") {
      throw new Error(`Expected shelter C verification to be REJECTED, got ${getShelterCCheck.data.data.verificationStatus}`);
    }

    // Try to create shelter request for Shelter C (Expected: 403 Forbidden)
    log("Attempting to create shelter request for unverified/rejected shelter (Expected: 403)...");
    const badRequestC = await apiRequest("POST", "/api/shelter-requests", {
      shelterId: shelterCId,
      title: "Supplies for Rejected Shelter",
      items: [{ globalItemId: wipesId, quantityNeeded: 10 }]
    });
    if (badRequestC.status === 403) {
      log("Successfully blocked unverified/rejected shelter request creation.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Allowed request creation for unverified/rejected shelter! Status: ${badRequestC.status}`);
    }


    // Edge Case 7: Unique Constraints Violation
    log("\n[Unique Constraint Blocks]");
    // Register duplicate email
    clearCookies();
    log("Registering duplicate user email (Expected: 409 or 400)...");
    const dupUser = await apiRequest("POST", "/api/auth/register", {
      name: "Duplicate User",
      email: userAEmail,
      password: "Password123!"
    });
    if (dupUser.status === 409 || dupUser.status === 400) {
      log("Blocked duplicate user registration email.", "INTENDED_ERROR");
    } else {
      throw new Error(`Duplicate email registration bypass. Status: ${dupUser.status}`);
    }

    // Register duplicate shelter organizationId
    switchUser(userDCookies);
    log("Registering duplicate shelter organization ID (Expected: 409 or 400)...");
    const dupShelter = await apiRequest("POST", "/api/shelters", {
      name: "Duplicate Shelter Name",
      country: "USA",
      organizationIdType: "EIN",
      organizationId: "135562725", // Already registered for Shelter A
      street: "123 Main St",
      city: "Austin",
      state: "TX",
      zip: "78701",
      longitude: -97.7431,
      latitude: 30.2672,
      dropOffHours: "9 AM - 5 PM Daily",
      contactEmail: "dup.shelter@example.com"
    });
    if (dupShelter.status === 409 || dupShelter.status === 400) {
      log("Blocked duplicate organizationId shelter registration.", "INTENDED_ERROR");
    } else {
      throw new Error(`Duplicate organizationId shelter registration allowed. Status: ${dupShelter.status}`);
    }

    // Create duplicate Category Name
    switchUser(adminCookies);
    log("Creating duplicate category name (Expected: 409 or 400)...");
    const dupCategory = await apiRequest("POST", "/api/categories", {
      name: "Medical Supplies", // Already registered
      icon: "shield"
    });
    if (dupCategory.status === 409 || dupCategory.status === 400) {
      log("Blocked duplicate category creation.", "INTENDED_ERROR");
    } else {
      throw new Error(`Duplicate category name creation allowed. Status: ${dupCategory.status}`);
    }

    // Create duplicate GlobalItem Title
    log("Creating duplicate global item title (Expected: 409 or 400)...");
    const dupGIItem = await apiRequest("POST", "/api/global-items", {
      title: "Bandages", // Already registered
      categoryId: medCatId
    });
    if (dupGIItem.status === 409 || dupGIItem.status === 400) {
      log("Blocked duplicate global item creation.", "INTENDED_ERROR");
    } else {
      throw new Error(`Duplicate global item title creation allowed. Status: ${dupGIItem.status}`);
    }

    log("\nPhase 3 Edge Cases & Security verification completed successfully!", "SUCCESS");

  } catch (error: any) {
    testFailed = true;
    log(`Test runner encountered critical failure: ${error.message}`, "FAIL");
  } finally {
    // Stop test server
    log("Shutting down the test server...");
    server.close(() => {
      log("Test server offline.");
    });

    if (testFailed) {
      log("TEST RUN COMPLETED WITH FAILURES. Please view test_run.log for details.", "FAIL");
      process.exit(1);
    } else {
      log("ALL INTEGRATION AND SECURITY VERIFICATION TESTS COMPLETED SUCCESSFULLY! No actual errors found.", "SUCCESS");
      process.exit(0);
    }
  }
}

runTests();
