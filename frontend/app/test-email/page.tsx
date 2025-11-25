'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmailTestPage() {
    const [html, setHtml] = useState('');
    const [loading, setLoading] = useState(false);

    const testEmailRender = async () => {
        console.log("Starting test...");
        setLoading(true);
        try {
            const res = await fetch('/api/emails/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: 'TEST-123',
                    tipo: 'ABC',
                    fecha: '2023-12-01',
                    franja: 'Mañana',
                    direccion: 'Calle Falsa 123'
                })
            });
            console.log("Response status:", res.status);
            const data = await res.json();
            console.log("Response data:", data);
            setHtml(data.html || JSON.stringify(data));
            if (data.html) alert("¡Éxito! HTML generado correctamente.");
        } catch (err) {
            console.error("Error:", err);
            setHtml('Error: ' + err);
            alert("Error: " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Email Rendering</h1>
            <Button onClick={testEmailRender} disabled={loading}>
                {loading ? 'Rendering...' : 'Test Render'}
            </Button>
            <div className="mt-8 border p-4 rounded bg-gray-100 whitespace-pre-wrap font-mono text-xs">
                {html}
            </div>
        </div>
    );
}
