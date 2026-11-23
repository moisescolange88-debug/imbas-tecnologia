/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Área do Cliente: nada de cache, nada de moldura em outro site, fora dos buscadores
    const portal = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Cache-Control', value: 'no-store' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
    ]
    return [
      { source: '/portal', headers: portal },
      { source: '/api/portal/:caminho*', headers: portal },
    ]
  },
}

export default nextConfig
