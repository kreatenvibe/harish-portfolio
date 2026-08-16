import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { unstable_rethrow } from "next/navigation";
import { RequestError, ValidationError } from "@/lib/http-errors";
import logger from "@/lib/logger";

export function handleError(
  error: unknown,
  type: "server" | "api" = "server"
): ActionResponse | APIErrorResponse {
  unstable_rethrow(error);

  if (error instanceof RequestError) {
    logger.error({ err: error }, `${error.name}: ${error.message}`);
    if (type === "api") {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          error: { message: error.message, details: error.errors },
        },
        { status: error.statusCode }
      );
    }
    return {
      success: false,
      error: { message: error.message, details: error.errors },
      status: error.statusCode,
    };
  }

  if (error instanceof ZodError) {
    const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
    return handleError(new ValidationError(fieldErrors), type);
  }

  const genericError = error instanceof Error ? error : new Error(String(error));
  logger.error(genericError, "Unexpected error");

  if (type === "api") {
    return NextResponse.json<ErrorResponse>(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
  return { success: false, error: { message: "Internal server error" }, status: 500 };
}

export default handleError;
