import fs from "fs";
import path from "path";
import { Role, PledgeStatus, VerificationStatus } from "@prisma/client";

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

async function runTests() {
  log("Starting Heimdall integration and security verification tests...");

  // 1. Start test server
  const server = app.listen(5001, () => {
    log("Test server successfully listening on http://localhost:5001");
  });

  let testFailed = false;

  try {
    // 2. Register temporary Super Admin A to perform database cleanup
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

    // Run purges in correct order to avoid foreign key / dependency issues
    log("Purging database records...");
    await apiRequest("DELETE", "/api/pledged-items");
    await apiRequest("DELETE", "/api/pledges");
    await apiRequest("DELETE", "/api/requested-items");
    await apiRequest("DELETE", "/api/shelter-requests");
    await apiRequest("DELETE", "/api/shelters");
    await apiRequest("DELETE", "/api/global-items");
    await apiRequest("DELETE", "/api/categories");
    await apiRequest("DELETE", "/api/users"); // This will also delete our temp cleaner

    log("Database successfully cleaned up. Proceeding with actual test cases.", "SUCCESS");

    // Clear session cookies for cleaner run
    activeCookies = {};

    // ==========================================
    // TEST CASE 1: Authentication & RBAC Checks
    // ==========================================
    log("\n--- TEST CASE 1: Authentication & Role-Based Access Control (RBAC) ---");

    // Register Super Admin B
    const superAdminEmail = `super.admin.${Date.now()}@example.com`;
    log(`Registering Super Admin B: ${superAdminEmail}`);
    const regAdmin = await apiRequest("POST", "/api/auth/register-super-admin", {
      name: "Admin Bob",
      email: superAdminEmail,
      password: "Password123!",
    });
    if (regAdmin.status !== 201) throw new Error("Failed to register Super Admin B");
    log("Super Admin B registered.", "SUCCESS");

    // Capture Admin Cookies and logout
    const adminCookies = { ...activeCookies };
    activeCookies = {}; // Clear active cookies

    // Register Donor C
    const donorCEmail = `donor.c.${Date.now()}@example.com`;
    log(`Registering Donor C: ${donorCEmail}`);
    const regDonorC = await apiRequest("POST", "/api/auth/register", {
      name: "Donor Charlie",
      email: donorCEmail,
      password: "Password123!",
    });
    if (regDonorC.status !== 201) throw new Error("Failed to register Donor C");
    log("Donor C registered successfully as DONOR role.", "SUCCESS");
    const donorCCookies = { ...activeCookies };

    // Register Donor D
    activeCookies = {};
    const donorDEmail = `donor.d.${Date.now()}@example.com`;
    log(`Registering Donor D: ${donorDEmail}`);
    const regDonorD = await apiRequest("POST", "/api/auth/register", {
      name: "Donor Daisy",
      email: donorDEmail,
      password: "Password123!",
    });
    if (regDonorD.status !== 201) throw new Error("Failed to register Donor D");
    log("Donor D registered successfully.", "SUCCESS");
    const donorDCookies = { ...activeCookies };

    // RBAC Test: Let Donor D try to retrieve all users (Super Admin only)
    activeCookies = { ...donorDCookies };
    log("Attempting to list all users as Donor D (Expected: 403 Forbidden)...");
    const getUsersD = await apiRequest("GET", "/api/users");
    if (getUsersD.status === 403) {
      log("Successfully blocked Donor D from accessing admin endpoint.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Donor D retrieved users with status ${getUsersD.status}`);
    }

    // Super Admin B reads users list
    activeCookies = { ...adminCookies };
    log("Attempting to list all users as Super Admin B (Expected: 200 OK)...");
    const getUsersAdmin = await apiRequest("GET", "/api/users");
    if (getUsersAdmin.status === 200 && Array.isArray(getUsersAdmin.data.data)) {
      log(`Super Admin B retrieved ${getUsersAdmin.data.data.length} users.`, "SUCCESS");
    } else {
      throw new Error(`Failed to list users as Admin: ${JSON.stringify(getUsersAdmin.data)}`);
    }

    // IDOR Test: Let Donor D try to update Donor C's profile
    activeCookies = { ...donorDCookies };
    const donorCId = regDonorC.data.data.id;
    log(`Attempting to update Donor C's profile as Donor D (Expected: 403 Forbidden)...`);
    const updateProfileD = await apiRequest("PATCH", `/api/users/${donorCId}`, { name: "Hacked!" });
    if (updateProfileD.status === 403) {
      log("Successfully blocked Donor D from modifying Donor C's profile.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Profile update allowed! Status: ${updateProfileD.status}`);
    }

    // ==========================================
    // TEST CASE 2: Shelter Registration & Cookie Synchronization
    // ==========================================
    log("\n--- TEST CASE 2: Shelter Registration & Cookie Synchronization ---");

    activeCookies = { ...donorCCookies };
    log("Registering a Shelter as Donor C (using verified EIN bypass)...");
    const regShelter = await apiRequest("POST", "/api/shelters", {
      name: "Hope Shelter A",
      country: "USA",
      organizationIdType: "EIN",
      organizationId: "135562725", // verified bypass EIN
      street: "123 Hope Way",
      city: "Austin",
      state: "TX",
      zip: "78701",
      longitude: -97.7431,
      latitude: 30.2672,
      dropOffHours: "9 AM - 5 PM Daily",
      contactEmail: "hope.shelter@example.com",
    });

    if (regShelter.status !== 201) {
      throw new Error(`Failed to create shelter: ${JSON.stringify(regShelter.data)}`);
    }
    const shelter = regShelter.data.data;
    log(`Shelter "${shelter.name}" registered successfully. Verification Status: ${shelter.verificationStatus}`, "SUCCESS");

    // Capture the promoted SHELTER_ADMIN cookies of Donor C
    const donorCAdminCookies = { ...activeCookies };

    // Wait a brief moment for the background verification execution
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verify role promotion in the active session
    log("Verifying if Donor C's active cookies were promoted to SHELTER_ADMIN role...");
    // If cookies were synced correctly, Donor C should now be able to call shelter-restricted writes
    // We will test this by attempting to create a shelter request
    const createReqTest = await apiRequest("POST", "/api/shelter-requests", {
      shelterId: shelter.id,
      title: "Canned food items needed",
      urgency: "HIGH",
      items: []
    });

    if (createReqTest.status === 201) {
      log("Session cookies successfully promoted! User allowed to create shelter requests.", "SUCCESS");
    } else {
      throw new Error(`Promotion failed. Cookie was not synchronized. Status: ${createReqTest.status}`);
    }
    const shelterRequest = createReqTest.data.data;

    // ==========================================
    // TEST CASE 3: Category & GlobalItem Setup
    // ==========================================
    log("\n--- TEST CASE 3: Category & GlobalItem Setup ---");

    // Setup Category as Admin Bob
    activeCookies = { ...adminCookies };
    log("Creating a category 'Food' as Super Admin...");
    const regCat = await apiRequest("POST", "/api/categories", {
      name: "Food",
      icon: "apple",
      description: "Edible provisions"
    });
    if (regCat.status !== 201) throw new Error("Failed to create category");
    const category = regCat.data.data;
    log(`Category "${category.name}" created.`, "SUCCESS");

    // Setup GlobalItem as Admin Bob
    log("Creating Global Item 'Canned Beans' as Super Admin...");
    const regItem = await apiRequest("POST", "/api/global-items", {
      title: "Canned Beans",
      defaultUnit: "cans",
      categoryId: category.id
    });
    if (regItem.status !== 201) throw new Error("Failed to create global item");
    const globalItem = regItem.data.data;
    log(`Global Item "${globalItem.title}" created.`, "SUCCESS");

    // ==========================================
    // TEST CASE 4: Requested Items & Admin Isolation
    // ==========================================
    log("\n--- TEST CASE 4: Requested Items & Admin Isolation (IDOR) ---");

    // We have Donor C (admin of Shelter A) and Donor D (regular donor).
    // Let's register a Shelter B under Donor D so D becomes SHELTER_ADMIN of Shelter B
    activeCookies = { ...donorDCookies };
    log("Registering Shelter B under Donor D...");
    const regShelterB = await apiRequest("POST", "/api/shelters", {
      name: "Grace Shelter B",
      country: "USA",
      organizationIdType: "EIN",
      organizationId: "135562726", // different EIN
      street: "456 Grace Ave",
      city: "Dallas",
      state: "TX",
      zip: "75201",
      longitude: -96.7970,
      latitude: 32.7767,
      dropOffHours: "10 AM - 4 PM Daily",
      contactEmail: "grace@example.com",
    });
    if (regShelterB.status !== 201) throw new Error("Failed to register Shelter B");
    const shelterB = regShelterB.data.data;
    log("Shelter B registered. Donor D session promoted to Shelter B admin.", "SUCCESS");
    const donorDAdminCookies = { ...activeCookies };

    // Donor D tries to add a requested item to Shelter A's Request (Expected: 403 Forbidden)
    activeCookies = { ...donorDAdminCookies };
    log("Attempting to add requested item to Shelter A request as Shelter B Admin D (Expected: 403)...");
    const badAddItem = await apiRequest("POST", "/api/requested-items", {
      requestId: shelterRequest.id,
      globalItemId: globalItem.id,
      quantityNeeded: 20
    });
    if (badAddItem.status === 403) {
      log("Successfully blocked Shelter B admin from modifying Shelter A request.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: Admin isolation bypassed! Status: ${badAddItem.status}`);
    }

    // Donor C (owner of Shelter A) adds requested item
    activeCookies = { ...donorCAdminCookies };
    log("Adding requested item 'Canned Beans' (needed: 10) to Shelter A request...");
    const goodAddItem = await apiRequest("POST", "/api/requested-items", {
      requestId: shelterRequest.id,
      globalItemId: globalItem.id,
      quantityNeeded: 10,
      unit: "cans"
    });
    if (goodAddItem.status !== 201) {
      throw new Error(`Failed to add item: ${JSON.stringify(goodAddItem.data)}`);
    }
    const requestedItem = goodAddItem.data.data;
    log(`Requested item added. Reserved: ${requestedItem.quantityReserved}, Delivered: ${requestedItem.quantityDelivered}`, "SUCCESS");

    // ==========================================
    // TEST CASE 5: Pledge Reservations & Race Conditions
    // ==========================================
    log("\n--- TEST CASE 5: Pledge Reservations & Race Conditions ---");

    // Donor D (acting as a donor now) pledges 4 Canned Beans
    activeCookies = { ...donorDCookies };
    log("Donor D pledges 4 Canned Beans...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const pledge1 = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: requestedItem.id, quantityPledged: 4 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });

    if (pledge1.status !== 201) {
      throw new Error(`Failed to pledge: ${JSON.stringify(pledge1.data)}`);
    }
    log(`Pledge created successfully. Code: ${pledge1.data.data.pledgeCode}`, "SUCCESS");

    // Verify inventory pipeline (Pledged -> increments quantityReserved)
    log("Verifying quantityReserved has incremented to 4...");
    const checkItem1 = await apiRequest("GET", `/api/requested-items/${requestedItem.id}`);
    if (checkItem1.data.data.quantityReserved === 4) {
      log("Inventory correctly moved to RESERVED state.", "SUCCESS");
    } else {
      throw new Error(`Reservation logic failure: expected 4, got ${checkItem1.data.data.quantityReserved}`);
    }

    // Attempt to pledge more than available capacity (available = 10 - 4 = 6)
    // Attempting to pledge 7 (Expected: 400 Bad Request)
    log("Attempting to pledge 7 items (Expected: 400 Bad Request due to capacity)...");
    const badPledge = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: requestedItem.id, quantityPledged: 7 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (badPledge.status === 400) {
      log("Successfully blocked over-capacity reservation.", "INTENDED_ERROR");
    } else {
      throw new Error(`Failed to block over-capacity pledge. Status: ${badPledge.status}`);
    }

    // Pledge 5 items (should succeed, available is now 6)
    log("Donor D pledges 5 additional Canned Beans...");
    const pledge2 = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: requestedItem.id, quantityPledged: 5 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (pledge2.status !== 201) throw new Error("Pledge failed");
    log("Second pledge successful.", "SUCCESS");

    // Check reservation again (reserved should be 9)
    const checkItem2 = await apiRequest("GET", `/api/requested-items/${requestedItem.id}`);
    log(`Requested item current reservation state: ${checkItem2.data.data.quantityReserved}/10`, "SUCCESS");

    // ==========================================
    // TEST CASE 6: Pledge IDOR Checks
    // ==========================================
    log("\n--- TEST CASE 6: Pledge IDOR checks ---");

    const pledge1Id = pledge1.data.data.id;
    const pledge1Code = pledge1.data.data.pledgeCode;

    // Donor C (shelter admin receiving the pledge) reads pledge details -> should succeed
    activeCookies = { ...donorCAdminCookies };
    log("Shelter Admin C retrieving Pledge D details by ID...");
    const getPledgeByAdmin = await apiRequest("GET", `/api/pledges/${pledge1Id}`);
    if (getPledgeByAdmin.status === 200) {
      log("Shelter admin correctly permitted to view pledge.", "SUCCESS");
    } else {
      throw new Error(`Shelter admin denied access: ${getPledgeByAdmin.status}`);
    }

    // Donor D (pledge owner) reads pledge details -> should succeed
    activeCookies = { ...donorDCookies };
    log("Donor D retrieving own Pledge details by Code...");
    const getPledgeByOwner = await apiRequest("GET", `/api/pledges/code/${pledge1Code}`);
    if (getPledgeByOwner.status === 200) {
      log("Donor owner correctly permitted to view own pledge.", "SUCCESS");
    } else {
      throw new Error(`Donor owner denied access: ${getPledgeByOwner.status}`);
    }

    // Switch to another donor (e.g. fresh registration or Admin acting as different donor)
    activeCookies = { ...adminCookies }; // Admin Bob has no connection to this pledge
    log("Super Admin Bob retrieving Pledge details by ID (Expected: 200 OK since Super Admin has override)...");
    const getPledgeBySuper = await apiRequest("GET", `/api/pledges/${pledge1Id}`);
    if (getPledgeBySuper.status === 200) {
      log("Super Admin override verified successfully.", "SUCCESS");
    } else {
      throw new Error(`Super admin denied override access: ${getPledgeBySuper.status}`);
    }

    // Register Donor E who has no rights
    activeCookies = {};
    const donorEEmail = `donor.e.${Date.now()}@example.com`;
    const regDonorE = await apiRequest("POST", "/api/auth/register", {
      name: "Donor Ethan",
      email: donorEEmail,
      password: "Password123!",
    });
    const donorECookies = { ...activeCookies };

    log("Donor Ethan retrieving Pledge details by ID (Expected: 403 Forbidden)...");
    const getPledgeByIdor = await apiRequest("GET", `/api/pledges/${pledge1Id}`);
    if (getPledgeByIdor.status === 403) {
      log("Successfully blocked unauthorized user from viewing pledge details.", "INTENDED_ERROR");
    } else {
      throw new Error(`Security breach: IDOR read bypass succeeded! Status: ${getPledgeByIdor.status}`);
    }

    // ==========================================
    // TEST CASE 7: Pledge Fulfillment (Delivery Verification)
    // ==========================================
    log("\n--- TEST CASE 7: Pledge Fulfillment (Delivery Verification) ---");

    // Shelter Admin C fulfills Pledge D (quantity: 4)
    activeCookies = { ...donorCAdminCookies };
    log("Fulfilling Pledge 1 (quantity: 4) as Shelter Admin C...");
    const fulfillPledge = await apiRequest("POST", "/api/pledges/verify", {
      pledgeCode: pledge1Code,
      impactPhotoUrl: "http://example.com/delivered_beans.jpg",
      shelterThankYouNote: "Thank you for the beans!"
    });

    if (fulfillPledge.status !== 200) {
      throw new Error(`Fulfillment failed: ${JSON.stringify(fulfillPledge.data)}`);
    }
    log("Pledge successfully fulfilled.", "SUCCESS");

    // Verify inventory pipeline (Delivered state)
    // quantityReserved should decrement by 4 (9 - 4 = 5)
    // quantityDelivered should increment by 4 (0 + 4 = 4)
    log("Verifying RequestedItem inventory pipeline recalculations...");
    const checkItem3 = await apiRequest("GET", `/api/requested-items/${requestedItem.id}`);
    const ri = checkItem3.data.data;
    log(`RequestedItem State - Reserved: ${ri.quantityReserved}, Delivered: ${ri.quantityDelivered}`, "SUCCESS");
    
    if (ri.quantityReserved !== 5 || ri.quantityDelivered !== 4) {
      throw new Error(`Incorrect inventory calculation! Expected reserved=5, delivered=4. Got reserved=${ri.quantityReserved}, delivered=${ri.quantityDelivered}`);
    }

    // Verify donor trust metrics
    log("Verifying Donor D's trust scores...");
    activeCookies = { ...adminCookies };
    const checkDonorD = await apiRequest("GET", `/api/users/${regDonorD.data.data.id}`);
    log(`Donor D trust metrics - Completed pledges: ${checkDonorD.data.data.pledgesCompleted}, Expired: ${checkDonorD.data.data.pledgesExpired}`, "SUCCESS");
    if (checkDonorD.data.data.pledgesCompleted !== 1) {
      throw new Error("Donor pledgesCompleted metric did not increment.");
    }

    // ==========================================
    // TEST CASE 8: Ghost Pledge Cancellation
    // ==========================================
    log("\n--- TEST CASE 8: Ghost Pledge Cancellation ---");

    // Donor D creates Pledge E with 1 item of quantity 1
    activeCookies = { ...donorDCookies };
    log("Donor D creating Pledge E with 1 Canned Beans item...");
    const pledgeE = await apiRequest("POST", "/api/pledges", {
      items: [{ requestedItemId: requestedItem.id, quantityPledged: 1 }],
      scheduledDropOffDate: tomorrow.toISOString()
    });
    if (pledgeE.status !== 201) throw new Error("Pledge E creation failed");
    const pledgedItemId = pledgeE.data.data.items[0].id;
    log(`Pledge E created. PledgedItem ID: ${pledgedItemId}`, "SUCCESS");

    // Delete that pledged item.
    // This should result in 0 items in the parent pledge, automatically cancelling it.
    log("Deleting the pledged item from Pledge E (should trigger parent cancellation)...");
    const deletePledgedItem = await apiRequest("DELETE", `/api/pledged-items/${pledgedItemId}`);
    if (deletePledgedItem.status !== 200) {
      throw new Error(`Failed to delete pledged item: ${JSON.stringify(deletePledgedItem.data)}`);
    }
    log("Pledged item deleted successfully.", "SUCCESS");

    // Verify parent pledge is cancelled
    log("Verifying parent Pledge E status is updated to CANCELLED...");
    const checkPledgeE = await apiRequest("GET", `/api/pledges/${pledgeE.data.data.id}`);
    log(`Pledge E Status: ${checkPledgeE.data.data.status}`, "SUCCESS");
    if (checkPledgeE.data.data.status !== PledgeStatus.CANCELLED) {
      throw new Error(`Expected pledge status CANCELLED, got ${checkPledgeE.data.data.status}`);
    }

    // Verify quantityReserved is decremented
    log("Verifying RequestedItem quantityReserved was decremented back...");
    const checkItem4 = await apiRequest("GET", `/api/requested-items/${requestedItem.id}`);
    log(`RequestedItem quantityReserved: ${checkItem4.data.data.quantityReserved} (Expected: 5)`, "SUCCESS");
    if (checkItem4.data.data.quantityReserved !== 5) {
      throw new Error(`Expected reserved 5, got ${checkItem4.data.data.quantityReserved}`);
    }

  } catch (error: any) {
    testFailed = true;
    log(`Test runner encounted critical failure: ${error.message}`, "FAIL");
  } finally {
    // 14. Stop test server
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
