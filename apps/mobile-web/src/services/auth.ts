"use client";

import type { Session } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/services/supabase";
import { updateMyProfile } from "@/services/panenin-api";

const PENDING_ONBOARDING_KEY = "panenin.pending-onboarding";

export type PendingOnboardingDraft = {
  display_name: string;
  kabupaten: string;
  preferred_plants: string[];
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function savePendingOnboardingDraft(draft: PendingOnboardingDraft) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PENDING_ONBOARDING_KEY, JSON.stringify(draft));
}

export function getPendingOnboardingDraft(): PendingOnboardingDraft | null {
  if (!canUseStorage()) return null;

  const raw = window.localStorage.getItem(PENDING_ONBOARDING_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as PendingOnboardingDraft;
  } catch {
    return null;
  }
}

export function clearPendingOnboardingDraft() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PENDING_ONBOARDING_KEY);
}

export async function syncPendingOnboardingDraft(session?: Session | null) {
  const draft = getPendingOnboardingDraft();

  if (!draft) {
    return null;
  }

  const activeSession =
    session ||
    (await getSupabaseBrowserClient().auth.getSession()).data.session;

  if (!activeSession?.access_token) {
    return null;
  }

  const profile = await updateMyProfile(draft);
  clearPendingOnboardingDraft();
  return profile;
}

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  const result = await supabase.auth.signInWithPassword({ email, password });

  if (result.error) {
    throw result.error;
  }

  await syncPendingOnboardingDraft(result.data.session);
  return result.data.session;
}

export async function signUpWithEmailPassword(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  const result = await supabase.auth.signUp({ email, password });

  if (result.error) {
    throw result.error;
  }

  if (result.data.session) {
    await syncPendingOnboardingDraft(result.data.session);
  }

  return result.data;
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  const result = await supabase.auth.signOut();

  if (result.error) {
    throw result.error;
  }
}
