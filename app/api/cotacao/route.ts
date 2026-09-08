import { NextResponse } from 'next/server'
import { montarCotacao, normalizarPerfil } from '@/lib/licensing/motor'
import type { PerfilEmpresa } from '@/lib/licensing/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Body {
  perfil: Partial<PerfilEmpresa>
  mensagem?: string
  provider?: string
}

const PROVIDERS: Record<string, { baseUrl: string; model: string; header?: (key: string) => Record<string, string> }> = {
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    model: process.env.AI_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free',
    header: (key: string) => {
      const h: Record<string, string> = { authorization: `Bearer ${key}` }
      if (process.env.AI_REFERER) h['HTTP-Referer'] = process.env.AI_REFERER
      h['X-Title'] = 'Imbas Tecnologia'
      return h
    },
  },
  stepfun: {
    baseUrl: 'https://api.stepfun.ai/v1',
    model: 'step-1-8k',
    header: key => ({ authorization: `Bearer ${key}` }),
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    header: key => ({ authorization: `Bearer ${key}` }),
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-sonnet-5',
  },
  gemini: {
    baseUrl: 'https://api.generativelanguage.googleapis.com/v1beta',
    model: 'gemini-1.5-flash',
  },
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const perfil = normalizarPerfil(body.perfil ?? {})
    const cotacao = montarCotacao(perfil)

    const provider = (body.provider || process.env.AI_PROVIDER || 'openrouter').toLowerCase()
    const apiKey = process.env.AI_API_KEY

    if (apiKey && body.mensagem) {
      const ia = await chamarIA(cotacao.promptIA ?? '', body.mensagem, { provider, apiKey })
      return NextResponse.json({ cotacao, mensagemIA: ia, provider })
    }

    return NextResponse.json({ cotacao, mensagemIA: null, provider })
  } catch (err: any) {
    return NextResponse.json({ erro: err?.message || 'Falha ao gerar cotação.' }, { status: 400 })
  }
}

async function chamarIA(promptSistema: string, mensagem: string, opts: { provider: string; apiKey: string }): Promise<string> {
  const { provider, apiKey } = opts
  const config = PROVIDERS[provider] || PROVIDERS.openrouter

  if (provider === 'anthropic') {
    const res = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1500,
        // O Sonnet 5 pensa por padrão quando `thinking` é omitido, e max_tokens
        // limita thinking + resposta juntos — 1500 truncaria a mensagem no meio.
        // Mensagem comercial curta não precisa de raciocínio: desligado sai mais
        // barato e mais rápido.
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
        system: promptSistema,
        messages: [{ role: 'user', content: mensagem }],
      }),
    })
    if (!res.ok) throw new Error(`IA ${provider} falhou: ${res.status} ${(await res.text()).slice(0, 200)}`)
    const data = await res.json()
    return data?.content?.[0]?.text ?? ''
  }

  if (provider === 'gemini') {
    const url = `${config.baseUrl}/models/${config.model}:generateContent?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: promptSistema }] },
        contents: [{ role: 'user', parts: [{ text: mensagem }] }],
      }),
    })
    if (!res.ok) throw new Error(`IA ${provider} falhou: ${res.status} ${(await res.text()).slice(0, 200)}`)
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  }

  const url = `${config.baseUrl}/chat/completions`
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (config.header) Object.assign(headers, config.header(apiKey))
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: promptSistema },
        { role: 'user', content: mensagem },
      ],
      max_tokens: 1500,
    }),
  })
  if (!res.ok) throw new Error(`IA ${provider} falhou: ${res.status} ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}
