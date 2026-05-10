import { Resend } from "resend";

import { env, featureFlags } from "@/lib/env";

type BasicUser = {
  email: string;
  name?: string | null;
};

function getResendClient() {
  if (!featureFlags.resend) {
    return null;
  }

  return new Resend(env.resendApiKey);
}

async function deliverEmail(subject: string, to: string, html: string) {
  const resend = getResendClient();

  if (!resend) {
    console.info(`[email-fallback] ${subject} -> ${to}`);
    return { delivered: false, fallback: true };
  }

  await resend.emails.send({
    from: env.resendFromEmail,
    to,
    subject,
    html,
  });

  return { delivered: true, fallback: false };
}

export function sendWelcomeEmail(user: BasicUser) {
  return deliverEmail(
    "Welcome to NarraTrack",
    user.email,
    `<p>Welcome${user.name ? `, ${user.name}` : ""}.</p><p>Your narrator business workspace is ready.</p>`,
  );
}

export function sendAuditionStatusChangeEmail(user: BasicUser, title: string, status: string) {
  return deliverEmail(
    `Audition updated: ${title}`,
    user.email,
    `<p>Your audition for <strong>${title}</strong> is now <strong>${status.toLowerCase()}</strong>.</p>`,
  );
}

export function sendOverdueInvoiceReminder(user: BasicUser, invoiceLabel: string) {
  return deliverEmail(
    "Invoice reminder",
    user.email,
    `<p>The invoice for <strong>${invoiceLabel}</strong> is overdue. Review it in NarraTrack.</p>`,
  );
}

export function sendExclusivityWindowAlert(user: BasicUser, bookingTitle: string, endDate: string) {
  return deliverEmail(
    "Exclusivity window ending soon",
    user.email,
    `<p><strong>${bookingTitle}</strong> reaches its exclusivity window end on ${endDate}.</p>`,
  );
}

export function sendTrialEndingReminder(user: BasicUser, endDate: string) {
  return deliverEmail(
    "Trial ending soon",
    user.email,
    `<p>Your NarraTrack trial ends on ${endDate}. Visit pricing to choose a plan.</p>`,
  );
}
