import { UserController } from "@/server/controllers/user.controller";
import { NextRequest, NextResponse } from "next/server";

const controller = new UserController();

export async function POST(request: NextRequest) {
  return controller.create(request);
}

export async function GET() {
  return controller.getAllUsers();
}
// Other methods (GET, PUT, DELETE) were moved to src/app/api/users/[id]/route.ts