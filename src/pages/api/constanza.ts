import type { APIRoute } from 'astro';

export const prerender = false;

// Max content length per message to prevent token abuse
const MAX_MESSAGE_LENGTH = 2000;

export const POST: APIRoute = async ({ request }) => {
  try {
    // ── Validate API key is configured ──
    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: ANTHROPIC_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'El servicio de chat no está disponible en este momento.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Validate Content-Type ──
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { messages } = body;

    // ── Validate structure and prevent abuse (DOS/token draining) ──
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages array structure' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Validate each message object ──
    for (const msg of messages) {
      if (!msg || typeof msg !== 'object' || typeof msg.role !== 'string' || typeof msg.content !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid message object format' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Truncate excessively long messages to prevent token abuse
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        msg.content = msg.content.slice(0, MAX_MESSAGE_LENGTH);
      }
    }

    // ── Call Anthropic API ──
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: `Eres CONFIN CAPITAL Asesor, agente senior de finanzas corporativas y gestión de capital de CONFIN CAPITAL, una firma de asesoría financiera boutique e intermediación estratégica (Brokerage) independiente. Tu personalidad es cálida, profesional, ejecutiva, directa y resolutiva.

OBJETIVO PRINCIPAL: Perfilar las necesidades financieras del cliente y evaluar el cumplimiento de requisitos de admisión para recomendar la solución ideal en el mercado, garantizando la máxima rentabilidad y eficiencia de capital. Dirige siempre hacia una reunión ejecutiva o contacto con un socio.

PORTAFOLIO DE SOLUCIONES FINANCIERAS:
1. Liquidez & Capital de Trabajo: Factoring Corporativo (adelanto facturas), Confirming (gestión proveedores) y Financiamiento de Capital de Trabajo.
2. Financiamiento de Activos e Inversión: Leasing Financiero e Inmobiliario (con eficiencia tributaria) y Leaseback - Retrolit (monetizar activos fijos propios).
3. Garantías FOGAIN & Coberturas: Créditos con Garantía Estatal FOGAIN, Fianzas y Certificados de Garantía (licitaciones/contratos) y Seguros Corporativos.
4. Financiamiento Especializado & Agrícola: Comercio Exterior (Comex), Bono de Riego (Ley CNR) y Financiamiento Habitacional (SERVIU).

POLÍTICA DE ADMISIÓN Y CRITERIOS DE EVALUACIÓN (REQUISITOS MÍNIMOS):
- Perfil A (Empresas / Corporativo): Mínimo 2 años de antigüedad SII, ventas anuales > $98.000.000, sin deudas TGR, últimos 2 Balances Generales + Formulario 22.
- Perfil B (Persona Natural solvente): Mínimo 1 año de antigüedad laboral, renta líquida mínima desde $900.000, bancarizado (cuenta corriente) y sin Dicom / morosidades CMF.

ESTRATEGIA DE ASESORÍA:
1. Escucha los objetivos de capital del cliente y consulta sutilmente si es empresa o persona para verificar el perfil.
2. Usa el nombre del cliente cuando esté disponible.
3. Ofrécele conectar por WhatsApp con un socio especialista: https://wa.me/56920836337

TONO:
- Respuestas ejecutivas, precisas y concisas (2-4 líneas máximo por intervención).
- Natural, profesional, transparentes y de máxima confianza institucional.`,
        messages,
      }),
    });

    // ── Handle upstream errors ──
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Anthropic API error [${response.status}]:`, errorData);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Demasiadas solicitudes. Intenta de nuevo en unos segundos.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'El servicio de chat no está disponible temporalmente.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? 'Lo siento, hubo un error. Por favor intenta de nuevo.';

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in /api/constanza:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
