/**
 * Facile logo lockup (ring + wordmark), rendered from the shared brand artwork
 * copied from the landing site. Two transparent variants are shipped and the
 * one that reads on the surface is picked via the `.dark` class:
 *   - logo-full-dark.png  → dark text, for LIGHT surfaces
 *   - logo-full-light.png → white text, for DARK surfaces
 *
 * Vite serves /public under the app base (`/app/`), so reference assets with
 * import.meta.env.BASE_URL rather than a root-absolute path.
 */
export default function Wordmark({ className = "" }) {
  const base = import.meta.env.BASE_URL;
  const common = "h-7 w-auto select-none";
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={`${base}brand/logo-full-dark.png`}
        alt="Facile"
        className={`${common} block dark:hidden`}
      />
      <img
        src={`${base}brand/logo-full-light.png`}
        alt="Facile"
        className={`${common} hidden dark:block`}
      />
    </span>
  );
}
