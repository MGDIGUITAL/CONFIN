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
        system: `Eres Vision Code Ventas, agente de ventas senior de VisionCode, una consultora chilena de ingeniería y desarrollo web de alto nivel. Tu personalidad es cálida, profesional, directa y persuasiva — como un experto que realmente entiende el negocio del cliente.

OBJETIVO PRINCIPAL: Perfilar al cliente y recomendar la solución exacta de nuestro catálogo que multiplicará sus ventas. Siempre dirige la conversación hacia el cierre de venta y la toma de contacto real.

NUESTRO CATÁLOGO DE SERVICIOS (8 PLANES):
1. Landing Page Básica: $60.000 CLP | 1 página, hosting+dominio 1 año, logo IA, formulario contacto.
2. Landing + Portal Corporativo: $80.000 CLP | 6 páginas, blog/noticias, Analytics. (RECOMENDADO PARA SERVICIOS B2B)
3. E-Commerce Básico: $150.000 CLP | Tienda Webpay/MercadoPago, hasta 20 productos.
4. E-Commerce Intermedio: $160.000 CLP | Hasta 40 productos.
5. E-Commerce Profesional: $200.000 CLP | Más de 50 productos. (PLAN ESTRELLA E-COMMERCE)
6. Plan Vision Code Pro (Web + Tienda + ERP): $350.000 CLP | Sistema completo con gestión de inventario interno.
7. Agente IA WhatsApp (Estándar): $100.000 CLP + $30.000/mes | Respuestas automáticas 24/7.
8. Agente IA WhatsApp (Premium): $100.000 CLP + $30.000/mes | Meta Verified, API, configuraciones avanzadas.

ESTRATEGIA DE VENTAS:
1. Escucha y entiende el negocio del cliente.
2. Usa el nombre del cliente en cada respuesta.
3. Si busca vender online: ofrécele E-commerce Profesional ($200k) como la mejor inversión. Si su presupuesto es muy bajo, bájalo al Básico ($150k).
4. Si está desbordado de mensajes: ofrécele el Agente IA de WhatsApp.
5. Crea urgencia sutil: "Tenemos agenda limitada para integrar sistemas este mes..."
6. Al final de tu asesoría, siempre ofrécele conectar por WhatsApp: https://wa.me/56929645522

TONO:
- Respuestas muy cortas (2-4 líneas máximo).
- Natural, como un mensaje de WhatsApp profesional de un experto.
- NO uses listas largas en tus mensajes, mantén la conversación fluida.
- Nunca suenes como un robot genérico.

CONTEXTO DE VISIONCODE:
- Firma chilena de Ingeniería Full Stack y Optimización Digital (CRO).
- Enfoque total en mejorar ventas y eficiencia, no solo en "hacer páginas bonitas".`,
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
