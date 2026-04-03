import { db } from '../db/index.js';
import { profiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface UpsertProfileInput {
  deviceId: string;
  ageYears: number;
  weightKg: number;
  allergies: string[];
  lang?: string;
}

export async function upsertProfile(input: UpsertProfileInput) {
  const allergiesJson = JSON.stringify(input.allergies);

  const existing = db
    .select()
    .from(profiles)
    .where(eq(profiles.deviceId, input.deviceId))
    .get();

  if (existing) {
    db.update(profiles)
      .set({
        ageYears: input.ageYears,
        weightKg: input.weightKg,
        allergies: allergiesJson,
        lang: input.lang ?? 'id',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(profiles.deviceId, input.deviceId))
      .run();
  } else {
    db.insert(profiles)
      .values({
        deviceId: input.deviceId,
        ageYears: input.ageYears,
        weightKg: input.weightKg,
        allergies: allergiesJson,
        lang: input.lang ?? 'id',
      })
      .run();
  }

  return db
    .select()
    .from(profiles)
    .where(eq(profiles.deviceId, input.deviceId))
    .get();
}

export async function getProfile(deviceId: string) {
  return db
    .select()
    .from(profiles)
    .where(eq(profiles.deviceId, deviceId))
    .get();
}
