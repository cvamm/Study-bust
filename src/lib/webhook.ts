export const PABBLY_WEBHOOK_URL =
  "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjMwNTZlMDYzNzA0MzI1MjZiNTUzMiI_3D_pc/IjU3NjcwNTY4MDYzZjA0MzU1MjZkNTUzNDUxMzUi_pc";

export interface WebhookEventPayload {
  event: string;
  platform: string;
  timestamp: string;
  [key: string]: unknown;
}

/**
 * Sends real-time lead and user events to the configured Pabbly Connect Webhook.
 * Includes multiple fallback strategies for maximum browser and network reliability.
 */
export async function sendWebhookEvent(
  event: string,
  data: Record<string, unknown>
): Promise<boolean> {
  if (!PABBLY_WEBHOOK_URL) return false;

  const payload: WebhookEventPayload = {
    event,
    platform: "StudyBust 12",
    timestamp: new Date().toISOString(),
    ...data,
  };

  const jsonStr = JSON.stringify(payload);

  // Strategy 1: Standard fetch with application/json
  try {
    const res = await fetch(PABBLY_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: jsonStr,
    });

    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn("[StudyBust Webhook] Standard fetch attempt encountered an issue:", err);
  }

  // Strategy 2: Fallback to navigator.sendBeacon (bypasses preflight CORS restrictions)
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([jsonStr], { type: "application/json" });
      const queued = navigator.sendBeacon(PABBLY_WEBHOOK_URL, blob);
      if (queued) return true;
    }
  } catch (err2) {
    console.warn("[StudyBust Webhook] Beacon fallback error:", err2);
  }

  // Strategy 3: Fallback to no-cors fetch
  try {
    await fetch(PABBLY_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: jsonStr,
    });
    return true;
  } catch (err3) {
    console.error("[StudyBust Webhook] All delivery attempts failed:", err3);
    return false;
  }
}
