import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "@react-email/components";

interface EmailLayoutProps {
  preview: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export function EmailLayout({
  preview,
  title,
  description,
  buttonText,
  buttonUrl,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />

      <Preview>{preview}</Preview>

      <Tailwind config={{
        presets: [pixelBasedPreset],
      }}>
        <Body className="bg-gray-100 py-10">
          <Container className="mx-auto max-w-xl rounded-lg bg-white p-10 shadow-md">

            {/* Brand */}
            <Heading className="text-center text-3xl font-bold text-orange-500">
              Platera
            </Heading>

            <Hr className="my-6" />

            <Section>
              <Heading className="text-2xl font-semibold text-gray-900">
                {title}
              </Heading>

              <Text className="mt-4 text-base leading-7 text-gray-600">
                {description}
              </Text>

              <Button
                href={buttonUrl}
                className="mt-6 rounded-md bg-orange-500 px-6 py-3 text-white"
              >
                {buttonText}
              </Button>

              <Text className="mt-8 text-sm text-gray-500">
                If the button does not work, copy and paste this link:
              </Text>

              <Text className="break-all text-sm text-blue-600">
                {buttonUrl}
              </Text>

              <Text className="mt-6 text-sm text-gray-500">
                This link expires in 1 hour.
              </Text>
            </Section>

            <Hr className="my-8" />

            <Text className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Platera. All rights reserved.
            </Text>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}