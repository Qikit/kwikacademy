/** Join Astro's BASE_URL with an app path, normalizing duplicate slashes. */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  const b = ('/' + base + '/').replace(/\/+/g, '/');
  const p = path.replace(/^\/+/, '');
  return (b + p).replace(/\/+/g, '/');
}
