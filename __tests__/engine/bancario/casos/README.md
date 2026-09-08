# Casos congelados — regressão pericial

Cada `.json` desta pasta congela as premissas e os resultados de um trabalho
concreto. `casos-regressao.test.ts` reexecuta todos a cada `npm run test`.

**Para que serve:** um defeito no motor não atinge só o próximo laudo — muda os
números de todos os que ele já gerou. Estes casos são a barreira: qualquer
alteração que mexa no resultado de um trabalho já emitido quebra o build,
em vez de aparecer meses depois numa impugnação.

## Quando incluir um caso

Inclua sempre que um laudo:

- for protocolado;
- sobreviver a impugnação (o mais valioso — é resultado validado por adversário);
- tiver combinação de premissas ainda não coberta (SAM, capitalização simples,
  série de juros, lacuna documental).

## Como incluir

1. Monte o caso com as premissas reais e rode o motor.
2. Grave `premissas`, `lancamentos`, `atualizacao` e o bloco `esperado` com os
   valores obtidos, incluindo `motorVersao` e `impressaoPremissas`.
3. Nomeie `NNN-descricao-curta.json`, em sequência.
4. **Confira os números contra o laudo protocolado antes de congelar.** Congelar
   um valor errado transforma a barreira em armadilha: o build passa a proteger
   o defeito.

## Anonimização

Não coloque nome de parte, número de processo ou dado que identifique o caso.
As folhas dos autos podem ficar — são referência interna e não identificam
ninguém sozinhas. O que importa aqui são os números, não a identificação.

## Quando um caso quebrar

Um caso vermelho significa uma de duas coisas, e a diferença importa:

- **corrigiu-se um defeito** — o valor novo está certo, o congelado estava
  errado. Então há laudos emitidos com valor errado, e isso exige providência
  processual, não só atualizar o JSON;
- **introduziu-se um defeito** — reverta.

Nunca atualize o `esperado` para "fazer passar" sem decidir qual dos dois é.
