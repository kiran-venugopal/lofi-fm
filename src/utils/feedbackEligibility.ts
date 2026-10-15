export const VISIT_DATES_KEY = "lofifm_visit_dates";

/**
 * Records the current day's visit (YYYY-MM-DD) into localStorage.
 * Returns the list of unique visited dates.
 */
export function recordVisitDay(): string[] {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(window.localStorage.getItem(VISIT_DATES_KEY) || "[]");
    const dates: string[] = Array.isArray(stored) ? stored : [];
    if (!dates.includes(today)) {
      dates.push(today);
      window.localStorage.setItem(VISIT_DATES_KEY, JSON.stringify(dates));
    }
    return dates;
  } catch (e) {
    console.error("Error recording visit date", e);
    return [];
  }
}

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
}

/**
 * Evaluates whether the user is eligible to see the feedback form.
 * Conditions:
 * 1. added custom songs
 * 2. starred any songs
 * 3. visited the app at least 2 different days
 * 4. added custom image url in background
 */
export function getFeedbackEligibility(
  currentBgUrl?: string,
  starredIds?: string[]
): EligibilityResult {
  const reasons: string[] = [];

  try {
    // 1. Added custom songs
    const addedSongs = JSON.parse(window.localStorage.getItem("addedSongs") || "[]");
    if (Array.isArray(addedSongs) && addedSongs.length > 0) {
      reasons.push("added_custom_songs");
    }

    // 2. Starred any songs
    const storedStarred = JSON.parse(window.localStorage.getItem("starred") || "[]");
    const isStarred =
      (Array.isArray(storedStarred) && storedStarred.length > 0) ||
      (Array.isArray(starredIds) && starredIds.length > 0);
    if (isStarred) {
      reasons.push("starred_any_songs");
    }

    // 3. Visited the app at least 2 different days
    const visitDates = JSON.parse(window.localStorage.getItem(VISIT_DATES_KEY) || "[]");
    if (Array.isArray(visitDates) && new Set(visitDates).size >= 2) {
      reasons.push("visited_atleast_2_days");
    }

    // 4. Added custom image url in background
    const bgUrl = (currentBgUrl || window.localStorage.getItem("bgImgUrl") || "").trim();
    const isCustomUrl =
      bgUrl.length > 0 &&
      !bgUrl.startsWith("/gifs/") &&
      bgUrl !== "/synthwave-visualizer-bg.svg";

    if (isCustomUrl) {
      reasons.push("added_custom_bg_url");
    }
  } catch (err) {
    console.error("Error evaluating feedback eligibility", err);
  }

  return {
    isEligible: reasons.length > 0,
    reasons,
  };
}
