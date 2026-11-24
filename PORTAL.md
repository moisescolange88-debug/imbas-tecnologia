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
| `app/api/portal/[...caminho]/route.ts` | Ponte. Repassa ao servidor só os caminhos permitidos, com a chave secreta. Recusa escrita vinda de outro site e pedidos acima de 4 MB (limite da Vercel: 4,5 MB por pedido). |
| `next.config.mjs` | Cabeçalhos de segurança de `/portal` e `/api/portal` |

## Variáveis na Vercel (Settings → Environment Variables)

| Nome | Valor |
|---|---|
| `PORTAL_BACKEND_URL` | Endereço HTTPS do túnel que leva ao servidor das ferramentas |
| `PORTAL_CHAVE` | A chave do servidor. Nunca vai para o navegador nem para o repositório. |

Sem essas variáveis a página abre, mas avisa que a Área do Cliente ainda não está ligada ao servidor.

## Testar localmente

Crie `.env.local` com as duas variáveis (apontando para o servidor local) e rode `npm run dev`.

## Anexos grandes

A Vercel não deixa passar mais de 4,5 MB por pedido. Por isso a tela nunca manda o arquivo junto com a pergunta:

1. abre um envio no servidor (`POST /api/envio`, com nome e tamanho);
2. manda o arquivo em partes de 2 MB, uma por vez (`POST /api/envio/<código>/<n>`), repetindo a parte se a conexão cair;
3. cita o código do envio na pergunta (`envios`).

Texto (`.txt`, `.csv`) é compactado no próprio navegador antes de subir, quando o navegador sabe fazer isso. O limite
por arquivo vem do servidor em `/api/estado` (`limite_arquivo` e `arquivo_maximo` de cada ferramenta); a tela só repete
o que o servidor informa.
