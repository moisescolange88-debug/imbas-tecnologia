'use client'

export const CONTACT_EMAIL = 'moises@imbascontabilidade.com.br'
export const WHATSAPP_E164 = '5519974128714'
export const WHATSAPP_DISPLAY = '(19) 97412-8714'
export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
  'Olá! Gostaria de falar com a Imbas Tecnologia.',
)}`

export default function WhatsAppBadge() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-banner"
      aria-label={`Falar no WhatsApp: ${WHATSAPP_DISPLAY}`}
    >
      <span className="wa-banner__pulse" aria-hidden="true" />
      <span className="wa-banner__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2a9.93 9.93 0 0 0-8.48 15.13L2 22l5.02-1.52A9.93 9.93 0 1 0 12.04 2Zm5.78 14.07c-.24.68-1.42 1.3-1.97 1.38-.52.08-1.18.11-1.91-.12-.44-.14-1-.33-1.72-.64-3.03-1.31-5-4.38-5.15-4.58-.15-.2-1.23-1.64-1.23-3.13 0-1.49.78-2.22 1.06-2.52.28-.3.61-.38.81-.38.2 0 .41 0 .59.01.19.01.44-.07.69.53.26.62.88 2.15.96 2.31.08.16.13.34.02.55-.1.2-.16.34-.31.52-.15.18-.32.4-.46.54-.15.15-.31.32-.13.63.18.3.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.3.15.48.13.66-.08.18-.2.76-.88.96-1.18.2-.3.41-.25.68-.15.28.1 1.76.83 2.06.98.3.15.5.22.58.35.07.12.07.72-.17 1.4Z" />
        </svg>
      </span>
      <span className="wa-banner__meta">
        <span className="wa-banner__tag">WhatsApp</span>
        <span className="wa-banner__num">{WHATSAPP_DISPLAY}</span>
      </span>
    </a>
  )
}
