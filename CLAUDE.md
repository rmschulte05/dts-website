# Showcase Website

## Stack
- **Astro 5** — zero-JS-by-default static site framework
- **Tailwind CSS v4** — via `@tailwindcss/vite` (no config file needed, CSS-first)
- **GSAP + ScrollTrigger** — animations, registered in `Base.astro`
- **Sharp** — automatic image optimization for Astro's `<Image />` component

## Project Structure
```
src/
  layouts/
    Base.astro          ← HTML shell, global scripts (GSAP ScrollTrigger setup)
  pages/
    index.astro         ← Compose modules here — reorder freely
  components/
    modules/            ← Self-contained page sections (each is a full-width block)
      Hero.astro
      TextBlock.astro
      Gallery.astro
      VideoShowcase.astro
      Divider.astro
  styles/
    global.css          ← @import "tailwindcss" + base resets
public/                 ← Static assets (images, videos, fonts)
```

## Module System
Every file in `src/components/modules/` is a standalone full-width section.
In `index.astro`, just import and drop them in order — that IS the page layout.

```astro
<Base title="My Page">
  <Hero headline="Hello." />
  <TextBlock heading="About us" body="..." />
  <Gallery images={[...]} />
</Base>
```

To rearrange the page: reorder the tags. To add a section: add a new module file and import it.

## Animations
- **Global scroll animations**: add `data-animate` to any element — it fades in on scroll automatically.
- **Stagger delay**: add `data-animate-delay="0.2"` for a delay in seconds.
- **Custom animations**: import GSAP directly in a module's `<script>` tag.

## Images
- Use Astro's built-in `<Image />` from `astro:assets` for auto-optimization.
- Regular `<img loading="lazy" decoding="async">` for dynamic/placeholder images.
- Put image files in `public/` for direct URL access, or `src/assets/` for optimized processing.

## Videos
- Use `VideoShowcase.astro` — videos lazy-load via IntersectionObserver (no download until in view).
- Pass `src` prop pointing to your video file in `public/`.
- Background videos in `Hero.astro` use `autoplay muted loop playsinline`.

## Commands
```bash
npm run dev      # start dev server (localhost:4321)
npm run build    # production build → dist/
npm run preview  # preview production build locally
```
