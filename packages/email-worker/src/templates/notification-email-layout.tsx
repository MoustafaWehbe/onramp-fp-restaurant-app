import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface NotificationEmailLayoutProps {
  preview: string;
  title: string;
  description: string;
}

export function NotificationEmailLayout({
  preview,
  title,
  description,
}: NotificationEmailLayoutProps) {
  return (
    <Html>
      <Head />

      <Preview>{preview}</Preview>

      <Tailwind>
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