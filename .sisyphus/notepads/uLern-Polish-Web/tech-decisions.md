# Technology Decisions: uLern-Polish-Web

## Project Overview
uLern-Polish-Web is a modern, responsive web application designed for Polish language learning. It focuses on interactive lessons, vocabulary exercises, and progress tracking with a clean, user-friendly interface.

## Decision Criteria
- **Developer Experience (DX):** Fast development cycles and excellent tooling.
- **Performance:** Fast initial load and smooth interactions for educational exercises.
- **Scalability:** Ability to add more lessons and features without significant refactoring.
- **Ecosystem:** Access to high-quality libraries for UI, state management, and forms.
- **Mobile-First:** Seamless experience across all devices.

## Framework Comparison: React/Next.js vs. Vue/Nuxt

| Feature | Next.js (React) | Nuxt (Vue) |
|---------|-----------------|------------|
| **Ecosystem** | Massive, industry standard. | Large, but slightly smaller than React. |
| **Learning Curve** | Moderate (JSX, Hooks). | Lower (Templates, Composition API). |
| **UI Libraries** | shadcn/ui, Radix, Headless UI. | PrimeVue, Vuetify, Nuxt UI. |
| **Deployment** | Optimized for Vercel. | Flexible, but Vercel is still great. |
| **State Management** | Zustand, Redux, Context. | Pinia, Vuex. |

**Decision: Next.js (React)**
Next.js was chosen for its robust ecosystem and the availability of `shadcn/ui`, which allows for high-quality, accessible UI components with minimal overhead. Its SSR/SSG capabilities also provide a solid foundation for future SEO needs.

## Component Library Selection
**Decision: shadcn/ui**
Instead of a traditional component library, `shadcn/ui` provides a set of accessible, unstyled components that are copied directly into the project. This offers:
- Full control over the code.
- No external dependency bloat.
- Built-in accessibility (Radix UI).
- Seamless integration with Tailwind CSS.

## Styling Framework Selection
**Decision: Tailwind CSS**
Tailwind CSS is the utility-first CSS framework of choice. It enables:
- Rapid UI prototyping.
- Consistent design system through configuration.
- Small bundle sizes via PurgeCSS.
- Excellent responsive design support.

## Additional Tooling Decisions

### State Management: Zustand
Zustand is a small, fast, and scalable state-management solution. It's simpler than Redux and more performant than React Context for frequently updated state like lesson progress.

### Icons: Lucide React
Lucide provides a clean, consistent set of icons that are easy to use and customize within React components.

### Form Handling & Validation: React Hook Form + Zod
This combination provides high-performance forms with full TypeScript support and schema-based validation, ensuring data integrity for user progress and settings.

### Testing: Vitest + React Testing Library
Vitest is a fast, modern test runner that integrates perfectly with Vite-based projects (and Next.js via configuration), while React Testing Library ensures components are tested from a user's perspective.

## Rationale Summary
The chosen stack (Next.js, Tailwind, shadcn/ui, Zustand) represents the modern standard for web development. It balances rapid development with high performance and maintainability, making it ideal for an interactive educational platform like uLern-Polish-Web.
