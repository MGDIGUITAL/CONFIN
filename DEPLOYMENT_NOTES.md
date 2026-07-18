# Instrucciones de Despliegue en Vercel

## IMPORTANTE: Variables de Entorno en Producción

Antes del deploy funcional, deberás configurar las siguientes variables de entorno en el dashboard de Vercel:

- `ANTHROPIC_API_KEY` — Para el chatbot Constanza IA
- `RESEND_API_KEY` — Para el formulario de contacto
- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` — Si usas Supabase

## ADVERTENCIA: Dominio de Email (Resend)

Actualmente el remitente del formulario es `onboarding@resend.dev`. Para producción, deberás verificar tu dominio en Resend y cambiar el remitente (`from`) a algo como `contacto@vision-code.cl`.
