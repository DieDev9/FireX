import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface ServiceRequestEmailProps {
    requestId?: string;
    tipo?: string;
    fecha?: string;
    franja?: string;
    direccion?: string;
}

export const ServiceRequestEmail = ({
    requestId = "SR-123456789",
    tipo = "ABC - Polvo Químico Seco",
    fecha = "2023-11-25",
    franja = "Mañana",
    direccion = "Calle 123 #45-67",
}: ServiceRequestEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Confirmación de Solicitud - FireX #{requestId}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: "#ea580c", // Orange-600
                            },
                        },
                    },
                }}
            >
                <Body className="bg-gray-100 my-auto mx-auto font-sans">
                    <Container className="bg-white border border-solid border-[#eaeaea] rounded-lg shadow-md my-[40px] mx-auto max-w-[465px] overflow-hidden">

                        {/* Header con color de marca */}
                        <Section className="bg-brand p-[20px] text-center">
                            <Heading className="text-white text-[24px] font-bold m-0">
                                FireX
                            </Heading>
                        </Section>

                        <Section className="p-[20px]">
                            <Heading className="text-black text-[20px] font-normal text-center p-0 my-[20px] mx-0">
                                ¡Solicitud Recibida!
                            </Heading>
                            <Text className="text-gray-700 text-[14px] leading-[24px]">
                                Hola,
                            </Text>
                            <Text className="text-gray-700 text-[14px] leading-[24px]">
                                Hemos recibido tu solicitud de servicio con el ID <strong>{requestId}</strong>.
                            </Text>

                            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

                            <Text className="text-gray-500 text-[12px] font-bold tracking-wider uppercase mb-2">
                                Detalles del Servicio
                            </Text>

                            <Section className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <Text className="m-0 text-[14px] leading-[24px] text-gray-800">
                                    <span className="font-semibold text-gray-500">Tipo:</span> {tipo}
                                </Text>
                                <Text className="m-0 text-[14px] leading-[24px] text-gray-800 mt-2">
                                    <span className="font-semibold text-gray-500">Fecha:</span> {fecha} ({franja})
                                </Text>
                                <Text className="m-0 text-[14px] leading-[24px] text-gray-800 mt-2">
                                    <span className="font-semibold text-gray-500">Dirección:</span> {direccion}
                                </Text>
                            </Section>

                            <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

                            <Text className="text-gray-700 text-[14px] leading-[24px]">
                                Un técnico se pondrá en contacto contigo pronto para coordinar el servicio.
                            </Text>
                            <Text className="text-gray-700 text-[14px] leading-[24px] mt-4">
                                Atentamente,<br />
                                <span className="font-bold text-brand">Equipo FireX</span>
                            </Text>
                        </Section>

                        <Section className="bg-gray-100 p-[10px] text-center">
                            <Text className="text-gray-400 text-[12px] m-0">
                                © 2024 FireX. Todos los derechos reservados.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ServiceRequestEmail;
