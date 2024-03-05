import * as React from "react";
import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";

type VerificationEmailProps = {
  userName: string;
  verificationLink: string;
};

export default function VerificationEmail({
  userName,
  verificationLink,
}: VerificationEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-indigo-500">
          <Container className="mx-auto my-16 flex min-w-[400px] flex-col items-center  rounded-md border bg-white p-6 shadow-md ">
            <Heading>🔐 Next Auth V5</Heading>
            <Text className="text-center text-gray-600 ">
              Hey {userName} let&apos;s verify your email
            </Text>
            <Button
              href={verificationLink}
              className="mx-auto my-6 cursor-pointer rounded-md bg-blue-500 p-3 text-white"
            >
              Confirm Email
            </Button>
            <Text className="text-center text-gray-600">
              Email sent from resend for auth.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
