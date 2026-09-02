import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vianest_session")?.value;
  
  if (!token) return null;
  
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string; status: string };
  } catch (error) {
    return null;
  }
}