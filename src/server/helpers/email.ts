import { Resend } from "resend";
// UTILS
import { env } from "@/env";
// CUSTOM COMPONENTS
import VerificationEmail from "@/components/emails/verification-email";

const resend = new Resend(env.RESEND_API_KEY);

type VerificationEmailType = {
  email: string;
  verificationToken: string;
  subject: string;
  userName: string;
};

export async function sendVerificationEmail({
  email,
  verificationToken,
  subject,
  userName,
}: VerificationEmailType) {
  const { error } = await resend.emails.send({
    from: env.MAIL_SENDER_ADDRESS,
    to: email,
    subject,
    react: VerificationEmail({
      verificationLink: `${env.SITE_URL}/new-verification?token=${verificationToken}`,
      userName,
    }),
  });

  return error === null;
}
