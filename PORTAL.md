# Área do Cliente (`/portal`)

A Área do Cliente dá acesso às ferramentas de cálculo. O navegador do cliente só fala com este site; as contas, os
créditos, os casos e os arquivos ficam no servidor das ferramentas, que o cliente nunca acessa diretamente.

```
cliente → este site (Vercel) → app/api/portal/[...caminho]/route.ts → túnel → servidor das ferramentas
```

| Arquivo | Para que serve |
|---|---|
| `app/portal/` | Página e estilos da Área do Cliente |
| `components/portal/Portal.tsx` | Tela: entrada, primeira senha, termo, casos, conversa e arquivos |
| `components/portal/Markdown.tsx` | Mostra o texto das respostas sem interpretar HTML |
| `app/api/portal/[...caminho]/route.ts` | Ponte. Repassa ao servidor só os caminhos permitidos, com a chave secreta. Recusa escrita vinda de outro site e envios acima de 4 MB. |
| `next.config.mjs` | Cabeçalhos de segurança de `/portal` e `/api/portal` |

## Variáveis na Vercel (Settings → Environment Variables)

| Nome | Valor |
|---|---|
| `PORTAL_BACKEND_URL` | Endereço HTTPS do túnel que leva ao servidor das ferramentas |
| `PORTAL_CHAVE` | A chave do servidor. Nunca vai para o navegador nem para o repositório. |

Sem essas variáveis a página abre, mas avisa que a Área do Cliente ainda não está ligada ao servidor.

## Testar localmente

Crie `.env.local` com as duas variáveis (apontando para o servidor local) e rode `npm run dev`.
