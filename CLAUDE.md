# CLAUDE.md — Vision Code Project Context

> Este archivo es leído automáticamente por Claude al conectarse al proyecto.
> Contiene todo el contexto necesario para trabajar en el codebase de Vision Code.

---

## 🏢 Proyecto

**Nombre:** Vision Code  
**Tipo:** Landing page corporativa + tienda  
**Descripción:** Agencia de Marketing Digital y Desarrollo Web. Ofrece servicios de ingeniería de software, e-commerce y sistemas a medida.  
**URL local:** `http://localhost:4321`  
**URL producción:** (Vercel) — ver `.vercel/`  
**Repositorio:** `MGDIGUITAL/Vison-Code` (GitHub)

---

## ⚙️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Framework | **Astro 4.x** (static-first, islands architecture) |
| Estilos | **Tailwind CSS 3.4** + CSS custom (variables en `Layout.astro`) |
| Backend / DB | **Supabase** (PostgreSQL) |
| Email | **Resend** |
| Deploy | **Vercel** (`@astrojs/vercel`) |
| Runtime | **Node 20.x** |
| Fuentes | Google Fonts: **Montserrat** (principal), Barlow Condensed, Inter |

### Comandos clave
```bash
npm run dev       # Servidor local en localhost:4321
npm run build     # Build de producción
npm run preview   # Preview del build
```

---

## 🎨 Sistema de Diseño

### Paleta de colores (Blanco + Rojo + Negro)

| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--saas-bg` | `#ffffff` | Fondo principal |
| `--saas-bg-alt` | `#F6F6F6` | Fondo secciones alternas |
| `--saas-bg-dark` | `#0a0a0a` | Secciones oscuras de contraste |
| `--saas-brand` | `#E8001C` | Rojo principal (acento, botones, CTAs) |
| `--saas-brand-dark` | `#B8000E` | Rojo hover/oscuro |
| `--saas-text` | `#0a0a0a` | Texto principal (negro) |
| `--saas-text-muted` | `rgba(0,0,0,0.50)` | Texto secundario |
| `--saas-border` | `rgba(0,0,0,0.09)` | Bordes sutiles |

### Clases CSS globales disponibles

```css
.bento-card       /* Card blanca con hover rojo */
.saas-badge       /* Badge rojo pequeño */
.btn-primary      /* Botón rojo sólido */
.btn-secondary    /* Botón outline negro (para fondos blancos) */
.section-dark     /* Sección con fondo negro #0a0a0a */
.section-light    /* Sección con fondo gris claro #F6F6F6 */
.fade-up          /* Animación reveal on scroll */
.animate-marquee  /* Marquee infinito horizontal */
```

### Tipografía
- **Montserrat** — fuente principal (headings, UI, botones)
- **Barlow Condensed** — títulos impacto editorial
- **Inter** — cuerpo de texto

### Logos disponibles en `/public/images/`
| Archivo | Uso |
|---------|-----|
| `logo-blanco.png` | Sobre fondos oscuros (Navbar negro) |
| `logo-negro.png` | Sobre fondos claros / favicon |
| `logo.png` | Alias de logo-blanco.png |
| `hero-person.png` | Imagen B&W editorial para el Hero |

---

## 📁 Estructura del Proyecto

```
d:\VISION CODE\
├── src/
│   ├── layouts/
│   │   └── Layout.astro          ← Variables CSS globales, <head>, scripts
│   ├── components/
│   │   ├── Navbar.astro          ← Navegación (fondo negro fijo)
│   │   ├── Hero.astro            ← Hero split-layout (texto + imagen circular)
│   │   ├── Metrics.astro         ← Métricas / números de impacto
│   │   ├── Services.astro        ← Grid de servicios
│   │   ├── Projects.astro        ← Portafolio / casos
│   │   ├── Testimonials.astro    ← Testimonios de clientes
│   │   ├── Pricing.astro         ← Planes / precios
│   │   ├── Process.astro         ← Proceso de trabajo
│   │   ├── Contact.astro         ← Formulario de contacto (Supabase + Resend)
│   │   ├── Footer.astro          ← Footer editorial
│   │   └── SalesAgent.astro      ← Bot de ventas autónomo (chat widget)
│   └── pages/
│       ├── index.astro           ← Página principal (orquesta todos los componentes)
│       ├── tienda.astro          ← Tienda de productos digitales
│       ├── servicio/             ← Páginas de detalle por servicio
│       └── api/                  ← Endpoints de API (formulario, bot)
├── public/
│   └── images/                   ← Logos, hero, assets estáticos
├── Skills/                       ← Sistema de skills /slash para Antigravity
│   ├── diseño/SKILL.md
│   ├── dev/SKILL.md
│   └── repo/SKILL.md
├── Layout.astro                  ← ⚠️ Archivo más importante para estilos
├── tailwind.config.mjs           ← Configuración de Tailwind + paleta brand
├── astro.config.mjs              ← Config Astro (vercel adapter)
├── .env.local                    ← Variables de entorno (NO subir a git)
└── package.json
```

---

## 🔑 Variables de Entorno (`.env.local`)

```env
PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX   # opcional
```

> ⚠️ **Nunca commitear `.env.local`** — está en `.gitignore`

---

## 🧩 Componentes Clave — Notas de Implementación

### `Layout.astro`
- **ES EL ARCHIVO MÁS IMPORTANTE.** Centraliza todas las variables CSS, estilos globales, Google Fonts y scripts de animación.
- Al cambiar colores globales, editarlo aquí propaga a todo el sitio.
- Incluye el `<SalesAgent />` al final del body.

### `Navbar.astro`
- **Fondo negro permanente** (`background: #0a0a0a`) — NO usar transparente.
- Usa `logo-blanco.png` (logo blanco para fondo negro).
- Línea roja de 3px en el top (acento Bull).
- Al hacer scroll solo añade `box-shadow`, NO cambia el fondo.

### `Hero.astro`
- Layout 2 columnas: texto izquierda, imagen circular derecha.
- Fondo **blanco**.
- Imagen en blanco y negro con borde circular rojo.
- Trust bar negro al fondo con marquee de tecnologías.

### `SalesAgent.astro`
- Bot de ventas autónomo (sin APIs externas).
- Lógica de perfilado de leads y cierre de contacto.
- Se conecta a WhatsApp para cerrar conversiones.

### `Contact.astro`
- Envía datos a Supabase y email via Resend.
- Endpoint en `src/pages/api/`.

---

## 🎯 Convenciones de Código

1. **Siempre usar variables CSS** (`var(--saas-brand)`) para colores de marca, no hardcodear hex.
2. **Clases Tailwind** para layout/spacing. **CSS custom** para efectos y animaciones.
3. Secciones claras → fondo blanco o `section-light`.
4. Secciones de contraste → clase `section-dark` (fondo negro, textos automáticos blancos).
5. Todos los botones CTA → `btn-primary` (rojo) o `btn-secondary` (outline negro).
6. Cards → clase `bento-card` siempre.
7. Animaciones reveal → clase `fade-up` (activada por IntersectionObserver en Layout).
8. Fuente siempre **Montserrat**, `font-black` para headings de impacto.
9. El Navbar siempre va **fuera del `<main>`**, al mismo nivel en `index.astro`.

---

## 🚫 Lo que NO hacer

- ❌ NO cambiar el fondo del Navbar a transparente.
- ❌ NO usar colores hardcodeados (`#F2C116`, dorado, etc.) — la paleta anterior fue migrada.
- ❌ NO modificar `.env.local` ni commitear variables sensibles.
- ❌ NO usar `border-radius` en cards ni botones — el estilo es angular/editorial.
- ❌ NO importar fuentes distintas a las definidas en `Layout.astro`.

---

## 📐 Referencia Visual

El diseño está inspirado en **[Agencia Bull](https://agenciabull.cl/)** — estilo editorial, tipografía contundente uppercase, líneas rojas de acento, fondos blancos con contraste en negro.

---

## 🔗 Links Útiles

- **Dev:** `http://localhost:4321`
- **Supabase Dashboard:** `https://supabase.com/dashboard`
- **Vercel Dashboard:** `https://vercel.com/dashboard`
- **GitHub:** `https://github.com/MGDIGUITAL/Vison-Code`
- **Referencia estilo:** `https://agenciabull.cl/`
