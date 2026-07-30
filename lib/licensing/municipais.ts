import type { Licenca } from './types'

export const LICENCAS_MUNICIPAIS: Licenca[] = [
  {
    id: 'municipal-alvara-funcionamento',
    orgao: 'MUNICIPAL',
    sigla: 'Alvará de Funcionamento',
    nome: 'Alvará de Funcionamento (Localização e Operação)',
    categoria: 'alvara-municipal',
    descricao:
      'Autorização municipal obrigatória para o exercício de atividade econômica em endereço certo. Em regra, engloba o Alvará de Localização (uso do solo) e o Alvará Sanitário (quando aplicável). Emitido pela Prefeitura local, com possibilidade de ser provisório a depender da fase (instalação ou operação).',
    resumo:
      'Autorização municipal que habilita a empresa a funcionar em determinado endereço, combinando uso do solo, vigilância sanitária e, em alguns casos, posturas municipais.',
    publicoAlvo: [
      'Toda empresa que exerça atividade econômica em endereço fixo',
      'Indústrias, comércios, prestadores de serviço, escritórios',
      'MEI, ME, EPP, médias e grandes',
      'Empreendimentos em vias públicas (food trucks, quiosques) também precisam',
    ],
    requisitos: [
      'CNPJ ativo com CNAE compatível com o uso permitido no endereço',
      'Inscrição municipal (CCM / CGM) aberta',
      'Responsável técnico quando a atividade exigir (médico, farmacêutico, engenheiro, etc.)',
      'Projeto aprovado para construção/ampliação, quando aplicável',
      'Vistoria prévia da Secretaria de Urbanismo, Vigilância Sanitária e, em alguns casos, Meio Ambiente',
    ],
    documentos: [
      { nome: 'Cartão CNPJ atualizado', descricao: 'Com situação cadastral regular na Receita Federal', obrigatorio: true },
      { nome: 'Contrato social ou requerimento de empresário', descricao: 'Última alteração', obrigatorio: true },
      { nome: 'Comprovante de endereço do imóvel', descricao: 'Conta de água, luz ou contrato de locação', obrigatorio: true },
      { nome: 'Habite-se do imóvel', descricao: 'Quando exigível (construções e reformas)', obrigatorio: false },
      { nome: 'Certidão de RT quando aplicável', descricao: 'Engenheiro, farmacêutico, médico, nutricionista, etc.', obrigatorio: false },
      { nome: 'Projeto de prevenção contra incêndio (CLCB/AVCB)', descricao: 'Aprovado pelo Corpo de Bombeiros', obrigatorio: true },
      { nome: 'Laudo de vistoria do imóvel', descricao: 'Conforme exigências do município', obrigatorio: false },
      { nome: 'Certidões negativas de débitos municipais', descricao: 'Tributos e eventuais multas', obrigatorio: true },
    ],
    prazos: {
      analise: '5 a 30 dias úteis (varia muito por município)',
      validade: 'Anual ou vinculado ao exercício corrente (renovação anual)',
      observacao: 'São Paulo, por exemplo, é de renovação anual. Curitiba emite por tempo indeterminado com chave de autenticidade.',
    },
    custos: [
      { descricao: 'Taxa de vistoria / expediente', valorMin: 50, valorMax: 800, unidade: 'R$', observacao: 'Varia em cada município; alguns cobram por metro quadrado.' },
      { descricao: 'ISS Autônomo / TFE (quando aplicável)', valorMin: 100, valorMax: 3500, unidade: 'R$/ano' },
      { descricao: 'Taxa de Vigilância Sanitária municipal', valorMin: 80, valorMax: 3000, unidade: 'R$' },
      { descricao: 'Emissao de segunda via / renovação', valorMin: 30, valorMax: 250, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei federal complementar 116/2003 (ISS)',
      'Lei federal 10.406/2002 (Código Civil)',
      'Código Tributário Municipal de cada cidade',
      'Plano Diretor Estratégico / Lei de Uso do Solo municipal',
      'Código Sanitário Municipal (Vigilância Sanitária)',
    ],
    urlOficial: '',
    tags: ['alvara', 'municipal', 'ccm', 'iss', 'uso-do-solo', 'vistoria'],
    exemplosAplicacao: [
      'Abertura de mercearia',
      'Indústria iniciando operação',
      'Escritório de advocacia em prédio comercial',
      'Centro de distribuição armazeando produtos',
    ],
  },
  {
    id: 'municipal-alvara-sanitario',
    orgao: 'MUNICIPAL',
    sigla: 'Alvará Sanitário',
    nome: 'Alvará Sanitário Municipal (Vigilância Sanitária)',
    categoria: 'alvara-sanitario',
    descricao:
      'Documento emitido pela Vigilância Sanitária municipal (em alguns casos, estadual) que autoriza o funcionamento da empresa em atividades sob risco sanitário. Pode estar embutido no Alvará de Funcionamento ou ser peça autônoma, conforme o município. Convalida o rigor da ANVISA no nível local.',
    resumo:
      'Liberação da Vigilância Sanitária municipal para atividades que lidam com saúde, alimentos, saneantes, cosméticos, medicamentos e correlatos.',
    publicoAlvo: [
      'Indústria de alimentos, bebidas, suplementos',
      'Restaurantes, padarias, lanchonetes, food trucks',
      'Cosméticos, saneantes, farmácias, drogarias',
      'Clínicas, hospitais, laboratórios, consultórios',
      'Distribuidoras e transportadoras de produtos regulados',
    ],
    requisitos: [
      'Manual de Boas Práticas conforme RDC_setor',
      'Responsável técnico legalmente habilitado',
      'Estrutura física compatível com a categoria',
      'PGRSS (Plano de Gerenciamento de Resíduos de Serviços de Saúde) quando aplicável',
      'Curso de capacitação para manipuladores de alimentos (em vários municípios)',
    ],
    documentos: [
      { nome: 'Cópia do Alvará de Funcionamento', descricao: 'Ou solicitação de abertura do processo', obrigatorio: true },
      { nome: 'Manual de Boas Práticas (MBPF/POPs)', descricao: 'Conforme a atividade', obrigatorio: true },
      { nome: 'Documento de Responsabilidade Técnica', descricao: 'Com ART/RT do conselho', obrigatorio: true },
      { nome: 'Plano de Gerenciamento de Resíduos (PGRSS)', descricao: 'Para serviços de saúde', obrigatorio: false },
      { nome: 'Certificado de Boas Práticas (CBPF) ANVISA', descricao: 'Quando aplicável', obrigatorio: false },
      { nome: 'Projetos de rotulagem, layout, etc.', descricao: 'Conforme vigilância exige', obrigatorio: false },
    ],
    prazos: {
      analise: '7 a 45 dias úteis (varia por município e porte)',
      validade: 'Anual, bienal ou trienal — depende do risco',
    },
    custos: [
      { descricao: 'Taxa de vistoria sanitária', valorMin: 80, valorMax: 4500, unidade: 'R$', observacao: 'Varia por município e risco da atividade.' },
      { descricao: 'Análise de projeto (quando exigida)', valorMin: 200, valorMax: 1500, unidade: 'R$' },
      { descricao: 'Renovação / revalidação', valorMin: 80, valorMax: 1200, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.437/1977 (infrações sanitárias)',
      'Lei federal 8.080/1990 (SUS e vigilância)',
      'RDCs ANVISA setoriais',
      'Código Sanitário Municipal de cada cidade',
    ],
    urlOficial: '',
    tags: ['alvara', 'sanitario', 'vigilancia', 'municipal', 'rt', 'bpf'],
    exemplosAplicacao: [
      'Padaria artesanal',
      'Distribuidora de cosméticos',
      'Hospital de pequeno porte',
      'Lava-jato que manipula saneantes',
    ],
  },
  {
    id: 'bombeiros-avcb',
    orgao: 'BOMBEIROS',
    sigla: 'AVCB',
    nome: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)',
    categoria: 'avcb',
    descricao:
      'Documento emitido pelo Corpo de Bombeiros Militar do estado que atesta que a edificação possui condições de segurança contra incêndio e pânico, conforme regulamento técnico. AVCB vale para edificações de maior risco; CLCB vale para atividades de baixo risco. Em alguns estados, o nome muda (ex.: ALCB, CLCB).',
    resumo:
      'Certificado de segurança contra incêndio: AVCB (alto risco) ou CLCB (baixo risco).',
    publicoAlvo: [
      'Industrias, comércios e prestadores de serviço',
      'Edificações residenciais multifamiliares com mais de 1.500 m²',
      'Locais de reunião com público acima dos limites legais',
      'Galpões, depósitos, centrais de gás, ocupações com risco médio',
    ],
    requisitos: [
      'Projeto de prevenção contra incêndio aprovado pelo Corpo de Bombeiros',
      'Laudo de execução emitido por engenheiro credenciado',
      'ART do responsável técnico',
      'Equipamentos de combate a incêndio instalados e testados',
      'Brigada de incêndio treinada (NBR 14276)',
      'Sinalização de emergência conforme NBR 16820',
    ],
    documentos: [
      { nome: 'Projeto técnico de incêndio', descricao: 'Aprovado pelo Corpo de Bombeiros', obrigatorio: true },
      { nome: 'ART de execução', descricao: 'Anotação de Responsabilidade Técnica', obrigatorio: true },
      { nome: 'Laudo de teste de equipamentos', descricao: 'Hidrantes, extintores, chuveiros automáticos', obrigatorio: true },
      { nome: 'Atestado de brigada', descricao: 'Com lista de treinados', obrigatorio: true },
      { nome: 'Planta de risco/de emergência', descricao: 'Conforme IT do estado', obrigatorio: true },
      { nome: 'Certificado de treinamento da brigada', descricao: 'NBR 14276', obrigatorio: true },
    ],
    prazos: {
      analise: '15 a 60 dias úteis (depende do estado)',
      validade: 'AVCB: 1 a 5 anos (varia por estado); CLCB em São Paulo é válido por 5 anos',
    },
    custos: [
      { descricao: 'Taxa de vistoria do Corpo de Bombeiros', valorMin: 100, valorMax: 1500, unidade: 'R$', observacao: 'Varia por estado. Em SP, a taxa é calculada pela metragem.' },
      { descricao: 'Projeto de prevenção contra incêndio', valorMin: 2500, valorMax: 18000, unidade: 'R$' },
      { descricao: 'Acompanhamento de execução', valorMin: 1500, valorMax: 9000, unidade: 'R$' },
      { descricao: 'Treinamento de brigada (turma)', valorMin: 1200, valorMax: 6000, unidade: 'R$' },
      { descricao: 'Equipamentos obrigatórios', valorMin: 3000, valorMax: 40000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei federal 13.425/2017 (Política Nacional de Segurança contra Incêndio)',
      'Decreto 7.257/2010 (federal) e regulamentos estaduais',
      'NBR 14276 (Brigada de incêndio)',
      'NBR 16820 (sinalização)',
      'IT-Resolução Técnica do Corpo de Bombeiros do estado',
    ],
    urlOficial: 'https://www.corpodebombeiros.sp.gov.br',
    tags: ['bombeiros', 'avcb', 'clcb', 'incendio', 'pci', 'seguranca'],
    exemplosAplicacao: [
      'Galpão industrial de 3.000 m²',
      'Shopping center',
      'Hospital de médio porte',
      'Edifício de escritórios',
    ],
  },
  {
    id: 'bombeiros-clcb',
    orgao: 'BOMBEIROS',
    sigla: 'CLCB',
    nome: 'Certificado de Licença do Corpo de Bombeiros (CLCB)',
    categoria: 'clcb',
    descricao:
      'Modalidade simplificada do AVCB para edificações de baixo risco. Auto-declaratório ou com vistoria simplificada, conforme o estado. Em São Paulo, substitui o AVCB para ocupações de baixo risco e áreas restritas.',
    resumo:
      'Versão simplificada do AVCB para atividades de baixo risco.',
    publicoAlvo: [
      'Pequenos comércios até ~750 m²',
      'Escritórios de pequeno porte',
      'MEI com baixo risco de incêndio',
      'Atividades industriais leves',
    ],
    requisitos: [
      'Edificação classificada como baixo risco',
      'Equipamentos de combate a incêndio compatíveis',
      'Sinalização básica de emergência',
      'Saídas de emergência compatíveis',
    ],
    documentos: [
      { nome: 'Formulário próprio do Corpo de Bombeiros', descricao: 'Auto-declaratório', obrigatorio: true },
      { nome: 'ART do responsável técnico', descricao: 'Obrigatória em alguns estados', obrigatorio: false },
      { nome: 'Fotos da edificação', descricao: 'Conforme instruções', obrigatorio: true },
      { nome: 'Cópia do CNPJ / RG do responsável', descricao: 'Identificação', obrigatorio: true },
    ],
    prazos: {
      analise: 'Imediato (auto-declaratório) a 15 dias úteis',
      validade: '3 a 5 anos (varia por estado)',
    },
    custos: [
      { descricao: 'Taxa CLCB', valorMin: 50, valorMax: 300, unidade: 'R$' },
      { descricao: 'ART e declaração', valorMin: 200, valorMax: 800, unidade: 'R$' },
      { descricao: 'Equipamentos de combate a incêndio', valorMin: 800, valorMax: 6000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Decreto estadual 63.911/2018 (SP)',
      'Resolução técnica do CB local',
      'Lei 13.425/2017',
    ],
    urlOficial: '',
    tags: ['bombeiros', 'clcb', 'baixo-risco', 'avcb-simplificado'],
    exemplosAplicacao: [
      'Loja de roupas até 200 m²',
      'Escritório de advocacia',
      'Padaria de bairro',
      'Mercadinho',
    ],
  },
  {
    id: 'municipal-habite-se',
    orgao: 'MUNICIPAL',
    sigla: 'Habite-se',
    nome: 'Habite-se / Carta de Habitação',
    categoria: 'habite-se',
    descricao:
      'Documento municipal que atesta que a edificação construída, reformada ou ampliada está em conformidade com o projeto aprovado e habilitada para uso. Pré-requisito para o alvará de funcionamento e para o AVCB.',
    resumo:
      'Certificado da conclusão de obra aprovada pela Prefeitura.',
    publicoAlvo: [
      'Construções novas',
      'Reformas com mudança de uso ou área',
      'Ampliações de edificações já existentes',
      'Mudança de uso para hospedagem, saúde, ensino, indústria',
    ],
    requisitos: [
      'Projeto aprovado pela Prefeitura',
      'Licença de Instalação (LI) vigente',
      'ARTs de execução (estrutural, elétrico, hidráulico, incêndio)',
      'Aprovação de todos os corpos envolvidos (Saúde, Meio Ambiente, Bombeiros)',
      'Vistoria municipal final',
    ],
    documentos: [
      { nome: 'Projeto aprovado com chave de validação', descricao: 'Plantas oficiais', obrigatorio: true },
      { nome: 'ARTs de execução de obra', descricao: 'Engenheiro responsável', obrigatorio: true },
      { nome: 'Certidão de execução de medidas de prevenção', descricao: 'Bombeiros', obrigatorio: true },
      { nome: 'Comprovante de ligação de água, luz e esgoto', descricao: 'Concessionárias', obrigatorio: true },
      { nome: 'CNPJ e documentos do imóvel', descricao: 'Matrícula atualizada', obrigatorio: true },
    ],
    prazos: {
      analise: '15 a 60 dias úteis',
      validade: 'Indeterminada',
    },
    custos: [
      { descricao: 'Taxa de vistoria municipal', valorMin: 100, valorMax: 1500, unidade: 'R$' },
      { descricao: 'Projeto arquitetônico aprovado', valorMin: 8000, valorMax: 40000, unidade: 'R$' },
      { descricao: 'Execução de obra (quadros, rede de incêndio)', valorMin: 20000, valorMax: 300000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei de Uso e Ocupação do Solo municipal',
      'Código de Obras municipal',
      'Plano Diretor Estratégico',
    ],
    urlOficial: '',
    tags: ['habite-se', 'obra', 'municipal', 'concluída', 'aprovada'],
    exemplosAplicacao: [
      'Construção de nova fábrica',
      'Ampliação de galpão logístico',
      'Reforma de restaurante para novo uso',
    ],
  },
]

export const CIDADES_CONHEBIDAS: Record<string, { 
  nome: string; 
  uf: string; 
  particularidades: string[]; 
  alvaraNomes: string[];
  prazoAlvara: string;
  obsAlvara: string;
  alvaraSanitario?: string;
  bombeiros: string;
}> = {
  'sao paulo': {
    nome: 'São Paulo',
    uf: 'SP',
    particularidades: [
      'Alvará emitido pela SP Regula/Subprefeitura e integra Cadastro de Contribuintes Mobiliários (CCM).',
      'Vistoria obrigatória da COVISA (Vigilância Sanitária) para atividades de risco',
      'CLCB obrigatório para baixo risco; AVCB para médio/alto',
      'Reforma Tributária alterou a cobrança do ISS, mas o alvará continua anual',
    ],
    alvaraNomes: ['Alvará de Funcionamento (CCM)', 'Licença de Funcionamento SP'],
    prazoAlvara: 'Processo médio de 20 a 60 dias úteis',
    obsAlvara: 'O alvará definitivo é anual. Atividades que dependem de licenças ANVISA/CETESB costumam ter alvará provisório até emissão do documento federal/estadual.',
    alvaraSanitario: 'COVISA emite Licença Sanitária / Alvará Sanitário municipal',
    bombeiros: 'AVCB obrigatório para > 750 m² ou risco médio/alto; CLCB para o resto',
  },
  'curitiba': {
    nome: 'Curitiba',
    uf: 'PR',
    particularidades: [
      'Alvará de Localização emitido pela Secretaria de Urbanismo',
      'Secretaria Municipal de Saúde emite Licença Sanitária',
      'CLCB definitivo para baixo risco (Resolução CBMPR)',
      'ISS variável por CNAE',
    ],
    alvaraNomes: ['Alvará de Localização', 'Alvará Sanitário (SMS)'],
    prazoAlvara: '10 a 30 dias úteis',
    obsAlvara: 'Curitiba dispensa renovação anual para muitas atividades; exige recadastramento bianual.',
    alvaraSanitario: 'Curitiba emite Licença Sanitária pela SMS',
    bombeiros: 'CLCB exigido para baixo risco; AVCB para médio/alto',
  },
  'rio de janeiro': {
    nome: 'Rio de Janeiro',
    uf: 'RJ',
    particularidades: [
      'Alvará de Licença para Estabelecimento (ALE)',
      'Secretaria de Saúde emite Licença Sanitária',
      'Orçamento público depende da emissão do CLF (Certificado de Licença de Funcionamento)',
      'SEPOL/SMFA fiscaliza o Corpo de Bombeiros local',
    ],
    alvaraNomes: ['Alvará de Licença para Estabelecimento (ALE)', 'Licença de Funcionamento Municipal'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'A ALE exige vistoria proporcional ao risco.',
    alvaraSanitario: 'Vigilância Sanitária Municipal emite Licença Sanitária',
    bombeiros: 'AVCB obrigatório para todas as edificações, exceto baixíssimo risco',
  },
  'belo horizonte': {
    nome: 'Belo Horizonte',
    uf: 'MG',
    particularidades: [
      'Alvará de Licença Localização e Funcionamento pela RFB/PBH',
      'Vigilância Sanitária municipal (SUBVSA) emite Licença Sanitária',
      'CTM Belo Horizonte dispõe sobre ISS',
    ],
    alvaraNomes: ['Alvará de Localização e Funcionamento', 'Inscrição Municipal (ISS)'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Anual; renovação exige ausência de débitos.',
    alvaraSanitario: 'SUBVSA emite Licença Sanitária',
    bombeiros: 'CBMMG - AVCB é obrigatório para a maioria',
  },
  'porto alegre': {
    nome: 'Porto Alegre',
    uf: 'RS',
    particularidades: [
      'Alvará de Funcionamento pela Secretaria de Indústria, Comércio e Turismo (SICT)',
      'Coordenadoria de Vigilância Sanitária (DCVS) emite documento',
      'ISS calculado pelo CNAE',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SICT)', 'Inscrição Municipal'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Renovação anual. Algumas atividades de impacto são analisadas por conselho.',
    alvaraSanitario: 'DCVS - Coordenadoria de Vigilância Sanitária',
    bombeiros: 'CBMRS - AVCB obrigatório',
  },
  'salvador': {
    nome: 'Salvador',
    uf: 'BA',
    particularidades: [
      'Alvará de Funcionamento pela SDE (Secretaria de Desenvolvimento Econômico)',
      'Vigilância Sanitária municipal (DIVISA)',
      'Centro Histórico exige aprovação do IPAC',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SDE)', 'Alvará da SUCOM (uso do solo)'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Salvador exige licença de uso do solo específica para zonas históricas.',
    alvaraSanitario: 'DIVISA emite Licença Sanitária',
    bombeiros: 'CBMBA - AVCB obrigatório',
  },
  'recife': {
    nome: 'Recife',
    uf: 'PE',
    particularidades: [
      'Alvará de Funcionamento pela SEFIN',
      'Vigilância Sanitária municipal (DSVS)',
      'Plano Diretor de Recife exige análise de impacto para grandes atividades',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEFIN)', 'Licença de Localização'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual. Recife classifica por grau de risco.',
    alvaraSanitario: 'DSVS - Departamento de Vigilância Sanitária',
    bombeiros: 'CBMPE - AVCB',
  },
  'fortaleza': {
    nome: 'Fortaleza',
    uf: 'CE',
    particularidades: [
      'Alvará de Funcionamento (SEFIN)',
      'Célula de Vigilância Sanitária (COVISA)',
      'Plano Diretor Participativo',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEFIN)', 'Alvará de Localização'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Renovação anual.',
    alvaraSanitario: 'COVISA - Célula de Vigilância Sanitária',
    bombeiros: 'CBMCE - AVCB',
  },
  'brasilia': {
    nome: 'Brasília',
    uf: 'DF',
    particularidades: [
      'Alvará de Funcionamento pela SSP/DF',
      'Diretoria de Vigilância Sanitária (DIVISA-DF)',
      'Plano Diretor Local — atenção ao CUP (Coeficiente de Aproveitamento)',
      'LUOS (Lei de Uso e Ocupação do Solo) disciplina atividades',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SSP/DF)', 'Licença de Funcionamento (DF)'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Anual. DF cobra TFRM (Taxa de Fiscalização de Recursos Mobiliários).',
    alvaraSanitario: 'DIVISA-DF emite Licença Sanitária',
    bombeiros: 'CBMDF - AVCB ou CLCB conforme risco',
  },
  'campinas': {
    nome: 'Campinas',
    uf: 'SP',
    particularidades: [
      'Alvará de Funcionamento pela SEPLAN',
      'Vigilância Sanitária municipal (VISA)',
      'Cobrança de ISS segue regulamento próprio',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEPLAN)', 'CADM - Cadastro Mobiliário'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual. Taxa de funcionamento por metro quadrado.',
    alvaraSanitario: 'VISA Campinas emite Licença Sanitária',
    bombeiros: 'CBMESP - AVCB / CLCB',
  },
  'santos': {
    nome: 'Santos',
    uf: 'SP',
    particularidades: [
      'Alvará de Funcionamento pela SEFIN',
      'Vigilância Sanitária municipal (COVISA)',
      'Plano Diretor de Santos disciplina áreas portuárias',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEFIN)', 'Alvará da Zona Portuária'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'COVISA Santos',
    bombeiros: 'CBMESP - AVCB',
  },
  'ribeirao preto': {
    nome: 'Ribeirão Preto',
    uf: 'SP',
    particularidades: [
      'Alvará de Funcionamento pela SEMUR',
      'Vigilância Sanitária municipal',
      'ISS bastante ativo na cadeia agro',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEMUR)', 'Inscrição Municipal (CCM)'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'Vigilância Sanitária Municipal',
    bombeiros: 'CBMESP - AVCB',
  },
  'manaus': {
    nome: 'Manaus',
    uf: 'AM',
    particularidades: [
      'Alvará de Funcionamento pela SEMEF',
      'Vigilância Sanitária municipal (VISA-Manaus)',
      'Zona Franca influencia tributação',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEMEF)', 'Inscrição Municipal'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Suframa interfere em vários processos. Análise de MEI facilitada.',
    alvaraSanitario: 'VISA-Manaus',
    bombeiros: 'CBMAM - AVCB',
  },
  'belem': {
    nome: 'Belém',
    uf: 'PA',
    particularidades: [
      'Alvará de Funcionamento pela SEFIN',
      'Vigilância Sanitária municipal (VISA)',
      'Plano Diretor de Belém',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEFIN)', 'Cadastro Municipal'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'VISA Belém',
    bombeiros: 'CBMPA - AVCB',
  },
  'goiania': {
    nome: 'Goiânia',
    uf: 'GO',
    particularidades: [
      'Alvará de Funcionamento pela SEMAD',
      'Vigilância Sanitária municipal (VISA)',
      'ISS observado por CNAE',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEMAD)', 'Inscrição Municipal (CCM)'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual. Goiânia adota o Lindec (limite de redução).',
    alvaraSanitario: 'VISA Goiânia',
    bombeiros: 'CBMGO - AVCB',
  },
  'florianopolis': {
    nome: 'Florianópolis',
    uf: 'SC',
    particularidades: [
      'Alvará de Funcionamento pela SMMA / SMU',
      'Vigilância Sanitária municipal',
      'Plano Diretor de Florianópolis atualizou áreas',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SMU)', 'Alvará Sanitário (Vigilância)'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'Vigilância Sanitária Municipal',
    bombeiros: 'CBMESP - AVCB / CLCB',
  },
  'vitoria': {
    nome: 'Vitória',
    uf: 'ES',
    particularidades: [
      'Alvará de Funcionamento pela SEMFA',
      'Vigilância Sanitária municipal (VISA)',
      'Plano Diretor de Vitória',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEMFA)', 'Cadastro Mobiliário (CCM)'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual. Vitória cobra Taxa de Coleta de Lixo.',
    alvaraSanitario: 'VISA Vitória',
    bombeiros: 'CBMES - AVCB',
  },
  'cuiaba': {
    nome: 'Cuiabá',
    uf: 'MT',
    particularidades: [
      'Alvará de Funcionamento pela Sefaz',
      'Vigilância Sanitária municipal (VISA)',
      'Modelo parceiro do ITDES para licenciamento',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEFAZ)', 'CCM'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'VISA Cuiabá',
    bombeiros: 'CBMMT - AVCB',
  },
  'campo grande': {
    nome: 'Campo Grande',
    uf: 'MS',
    particularidades: [
      'Alvará de Funcionamento pela Sefin',
      'Vigilância Sanitária municipal',
      'Plano Diretor urbano atualizado',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEFIN)', 'CCM'],
    prazoAlvara: '15 a 45 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'VISA Campo Grande',
    bombeiros: 'CBMESP - AVCB',
  },
  'sao luiz': {
    nome: 'São Luís',
    uf: 'MA',
    particularidades: [
      'Alvará de Funcionamento pela SEMFAZ',
      'Vigilância Sanitária municipal (VISA)',
      'Plano Diretor de São Luís',
    ],
    alvaraNomes: ['Alvará de Funcionamento (SEMFAZ)', 'Inscrição Municipal'],
    prazoAlvara: '20 a 60 dias úteis',
    obsAlvara: 'Anual.',
    alvaraSanitario: 'VISA São Luís',
    bombeiros: 'CBMMA - AVCB',
  },
}

export function getCidade(chave: string) {
  const c = normalizar(chave)
  return CIDADES_CONHEBIDAS[c]
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function buscarCidade(municipio: string): { chave: string; info: (typeof CIDADES_CONHEBIDAS)[string] } | null {
  if (!municipio) return null
  const alvo = normalizar(municipio)
  let best: { chave: string; info: (typeof CIDADES_CONHEBIDAS)[string] } | null = null
  const entries: [string, (typeof CIDADES_CONHEBIDAS)[string]][] = Object.entries(CIDADES_CONHEBIDAS)
  for (const [chave, info] of entries) {
    if (alvo.includes(chave) || chave.includes(alvo)) {
      best = { chave, info }
      break
    }
  }
  return best
}
