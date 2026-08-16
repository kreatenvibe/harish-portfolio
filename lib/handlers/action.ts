import type { ZodType } from "zod";
import type { Session } from "next-auth";
import { unstable_rethrow } from "next/navigation";
import { UnauthorizedError } from "@/lib/http-errors";
import { dbConnect } from "@/lib/mongoose";

import { auth } from "@/auth";

type ActionSession = Session | null;

type ActionOptions<T> = {
  params: T;
  schema: ZodType<T>;
  authorize?: boolean;
};

type ActionResult<T> = {
  params: T;
  session: ActionSession;
};

export async function action<T>(
  options: ActionOptions<T>
): Promise<ActionResult<T> | Error> {
  const { params, schema, authorize = false } = options;
  try {
    let session: ActionSession = null;

    if (authorize) {
      session = await auth();
      if (!session) throw new UnauthorizedError();
    }

    const result = schema.safeParse(params);
    if (!result.success) throw result.error;

    await dbConnect();

    return { params: result.data, session };
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof Error) return error;
    return new Error(String(error));
  }
}

export default action;
