import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import { ApiError } from "@/lib/errors";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/user/user.routes";
import { shelterRouter } from "./modules/shelter/shelter.routes";
import { responseFormatter } from "./shared/middlewares/responseFormatter";

const app = express();
const PORT = process.env.PORT || 5000;

// Standard middleware
app.use(express.json());
app.use(cookieParser());
app.use(responseFormatter);

// Debug log middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount modular routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/shelters", shelterRouter);

// Global Error Handling Middleware (replaces next-based handleError)
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      errors: err.issues,
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// Start listening if not running in a test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Heimdall Server running on port ${PORT}`);
  });
}

export default app;
