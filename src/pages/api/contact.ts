import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// ── HTML sanitization ──
function escapeHtml(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return m;
    }
  });
}

// ── Basic email validation ──
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // ── Validate API key is configured ──
    const apiKey = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'El servicio de correo no está disponible.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);

    // ── Parse and validate body ──
    const body = await request.json();
    const { empresa, telefono_empresa, solicitante, telefono_solicitante, correo, servicio } = body;

    // ── Required fields check ──
    if (!empresa || !solicitante || !correo || !servicio) {
      return new Response(
        JSON.stringify({ success: false, error: 'Faltan campos obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Email format validation ──
    if (!isValidEmail(correo)) {
      return new Response(
        JSON.stringify({ success: false, error: 'El correo electrónico no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Honeypot check (if a hidden field is submitted, it's likely a bot) ──
    if (body._honeypot) {
      // Silently succeed to not reveal the trap
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ── Sanitize all inputs ──
    const cleanEmpresa = escapeHtml(empresa);
    const cleanTelefonoEmpresa = escapeHtml(telefono_empresa);
    const cleanSolicitante = escapeHtml(solicitante);
    const cleanTelefonoSolicitante = escapeHtml(telefono_solicitante);
    const cleanCorreo = escapeHtml(correo);
    const cleanServicio = escapeHtml(servicio);

    // ── Send email ──
    const { data, error } = await resend.emails.send({
      from: 'CONFIN CAPITAL <onboarding@resend.dev>',
      to: 'confincapital@gmail.com',
      subject: `Nueva solicitud — ${cleanServicio}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#0a0a0a;color:#ffffff;border:1px solid #1B3C9C;border-radius:8px;">
          <h2 style="color:#1B3C9C;">Nueva solicitud de servicio 🚀</h2>
          <p><strong>🏢 Empresa/Negocio:</strong> ${cleanEmpresa}</p>
          <p><strong>☎️ Teléfono Empresa:</strong> ${cleanTelefonoEmpresa}</p>
          <p><strong>👤 Solicitante:</strong> ${cleanSolicitante}</p>
          <p><strong>📱 Teléfono Solicitante:</strong> ${cleanTelefonoSolicitante}</p>
          <p><strong>📧 Correo:</strong> ${cleanCorreo}</p>
          <p><strong>💼 Servicio:</strong> ${cleanServicio}</p>
          <hr style="border-color:#1B3C9C;margin:24px 0;"/>
          <p style="color:#666;font-size:12px;">Lead generado desde confincapital.cl</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'No se pudo enviar el correo. Intenta de nuevo.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Error fatal en el endpoint /api/contact:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
