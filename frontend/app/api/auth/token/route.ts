import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.session?.token) {
    return Response.json({ token: null }, { status: 401 });
  }
  return Response.json({ token: session.session.token });
}
