import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
    userFirstname?: string;
}

export const WelcomeEmail = ({
    userFirstname = "Usuario",
}: WelcomeEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bienvenido a FireX - Tu seguridad es nuestra prioridad</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Section className="mt-[32px]">
                            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                                Bienvenido a <strong>FireX</strong>
                            </Heading>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Hola {userFirstname},
                            </Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Estamos encantados de tenerte con nosotros. FireX está aquí para ayudarte a gestionar tus servicios de seguridad contra incendios de manera eficiente.
                            </Text>
                            <Section className="text-center mt-[32px] mb-[32px]">
                                <Button
                                    className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                    href="http://localhost:3000"
                                >
                                    Ir a la Plataforma
                                </Button>
                            </Section>
                            <Text className="text-black text-[14px] leading-[24px]">
                                Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;
