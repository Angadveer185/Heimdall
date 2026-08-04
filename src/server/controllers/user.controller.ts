import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/lib/errors";
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  updateUserSchema,
} from "@/lib/validations/user.validation";
import { UserService } from "../services/user.service";

const service = new UserService();

export class UserController {
  private handleError(error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          ...(error.errors && { errors: error.errors }),
        },
        { status: error.statusCode },
      );
    }

    // Fallback for unhandled unexpected JS errors (e.g., syntax errors, network drop)
    console.error("Unhandled Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }

  async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validatedData = createUserSchema.parse(body);
      const user = await service.createUser(validatedData);

      return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string) {
    try {
      const validatedData = getUserSchema.parse({ id });
      const user = await service.getUserById(validatedData.id);

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllUsers() {
    try {
      const users = await service.getAllUsers();
      return NextResponse.json({ success: true, data: users }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateById(id: string, req: NextRequest) {
    try {
      const body = await req.json();
      const validatedData = updateUserSchema.parse({ id, ...body });
      const { id: _, ...updateFields } = validatedData;

      const user = await service.updateUserById(id, updateFields);

      return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteById(id: string) {
    try {
      const validatedData = deleteUserSchema.parse({ id });
      const user = await service.deleteUserById(validatedData.id);

      return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }
}
