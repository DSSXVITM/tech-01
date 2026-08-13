import { NextResponse } from "next/server";
import { getSession } from "@/lib/db/auth";

export const dynamic = "force-dynamic";

/** Returns the current session (or null) for client-side auth state. */
export async function GET() {
  const session = await getSession();
  return NextResponse.json({ session });
}
