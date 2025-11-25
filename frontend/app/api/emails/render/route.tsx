import { render } from '@react-email/components';
import ServiceRequestEmail from '@/emails/service-request-email';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requestId, tipo, fecha, franja, direccion } = body;

        const html = await render(
            <ServiceRequestEmail
        requestId={ requestId }
        tipo = { tipo }
        fecha = { fecha }
        franja = { franja }
        direccion = { direccion }
            />
    );

        return NextResponse.json({ html });
    } catch (error) {
        console.error('Error rendering email:', error);
        return NextResponse.json({ error: 'Error rendering email' }, { status: 500 });
    }
}
