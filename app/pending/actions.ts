"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  const cookieStore = await cookies();
  
  // This deletes the JWT cookie that keeps the user logged in
  cookieStore.delete("vianest_session"); 
  
  // Send them back to the login screen
  redirect("/login");
}