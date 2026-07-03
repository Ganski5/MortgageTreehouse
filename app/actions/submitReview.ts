"use server";

import fs from "fs/promises";
import path from "path";

export interface PendingReview {
  id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  body: string;
  submittedAt: string;
}

interface ReviewInput {
  name: string;
  role: string;
  company: string;
  rating: number;
  body: string;
}

const FILE = path.join(process.cwd(), "data", "pending-reviews.json");

export async function submitReview(data: ReviewInput): Promise<void> {
  let existing: PendingReview[] = [];

  try {
    const raw = await fs.readFile(FILE, "utf-8");
    existing = JSON.parse(raw);
  } catch {
    // file missing or empty — start fresh
  }

  existing.push({
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    ...data,
  });

  await fs.writeFile(FILE, JSON.stringify(existing, null, 2));
}
