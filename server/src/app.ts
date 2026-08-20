import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import { ApiError } from "@/lib/errors";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/user/user.routes";
import { shelterRouter } from "./modules/shelter/shelter.routes";
import { categoryRouter } from "./modules/category/category.routes";
import { globalItemRouter } from "./modules/globalItem/globalItem.routes";
import { requestedItemRouter } from "./modules/requestedItem/requestedItem.routes";
import { shelterRequestRouter } from "./modules/shelterRequest/shelterRequest.routes";
import { pledgeRouter } from "./modules/pledge/pledge.routes";
import { pledgedItemRouter } from "./modules/pledgedItem/pledgedItem.routes";
import { uploadRouter } from "./modules/upload/upload.routes";
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
app.use("/api/categories", categoryRouter);
app.use("/api/global-items", globalItemRouter);
app.use("/api/requested-items", requestedItemRouter);
app.use("/api/shelter-requests", shelterRequestRouter);
app.use("/api/pledges", pledgeRouter);
app.use("/api/pledged-items", pledgedItemRouter);
app.use("/api/upload", uploadRouter);

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
