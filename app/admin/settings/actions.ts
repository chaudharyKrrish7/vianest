"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

export async function updateMarkup(formData: FormData) {
  const newMarkup = Number(formData.get("flightMarkup"));
  
  if (isNaN(newMarkup) || newMarkup < 0) {
    throw new Error("Markup must be a valid positive number.");
  }

  // We use upsert so it creates the "global" record if it doesn't exist yet
  await db.platformSettings.upsert({
    where: { id: "global" },
    update: { flightMarkup: newMarkup },
    create: { id: "global", flightMarkup: newMarkup }
  });

  revalidatePath("/admin/settings");
}