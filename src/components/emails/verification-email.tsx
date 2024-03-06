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
        <Body className="bg-blue-500">
          <Container className="my-16 flex min-w-[400px] flex-col items-center rounded-md  border bg-white p-6 text-center shadow-md ">
            <Heading>Digital Hippo</Heading>
            <Text className="text-gray-500 ">
              Hey {userName} let&apos;s verify your email
            </Text>
            <Button
              href={verificationLink}
              className="my-6 cursor-pointer rounded-md bg-blue-500 p-3 text-white"
            >
              Verify Email
            </Button>
            <Text className=" text-gray-500">
              Email sent from digital hippo for email verification.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
