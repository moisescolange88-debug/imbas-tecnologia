import type { Licenca, Orgao } from './types'

export const LICENCAS: Licenca[] = [
  // ============ ANVISA ============
  {
    id: 'anvisa-afe',
    orgao: 'ANVISA',
    sigla: 'AFE',
    nome: 'Autorização de Funcionamento de Empresa',
    categoria: 'alimentos',
    descricao:
      'Autorização expedida pela ANVISA que habilita a empresa a exercer atividades relacionadas a produtos sujeitos à vigilância sanitária. É o documento inicial obrigatório para qualquer empresa que fabrique, importe, distribua, transporte, armazene ou comercialize esses produtos.',
    resumo:
      'Habilitação sanitária da empresa para operar com produtos sob vigilância da ANVISA.',
    publicoAlvo: [
      'Indústrias de alimentos, cosméticos, saneantes e medicamentos',
      'Distribuidoras, importadoras e transportadoras',
      'Farmácias de manipulação e drogarias',
      'Empresas de dispositivos médicos',
    ],
    requisitos: [
      'CNPJ ativo com CNAE compatível',
      'Empresa previamente cadastrada no sistema da ANVISA (Datavisa)',
      'Responsável técnico legalmente habilitado (RT) com vínculo formal',
      'Estrutura física compatível com a atividade (condições higiênico-sanitárias)',
      'Manual de Boas Práticas (MBPF) ou equivalente implementado',
    ],
    documentos: [
      { nome: 'Cartão CNPJ atualizado', descricao: 'Comprovante de inscrição e situação cadastral', obrigatorio: true },
      { nome: 'Contrato Social ou Requerimento de Empresário', descricao: 'Com última alteração contratual', obrigatorio: true },
      { nome: 'Comprovante de endereço do estabelecimento', descricao: 'Conta de luz, água ou contrato de aluguel', obrigatorio: true },
      { nome: 'Certidão de Regularidade Técnica', descricao: 'Emitida pelo conselho profissional do RT', obrigatorio: true },
      { nome: 'Documento de responsabilidade técnica', descricao: 'Contrato de prestação de serviço ou anotação na CTPS', obrigatorio: true },
      { nome: 'Projeto de Boas Práticas de Fabricação', descricao: 'Conforme RDC 275/2019 e equivalentes', obrigatorio: true },
      { nome: 'Alvará da vigilância sanitária local', descricao: 'Emitido pela municipal ou estadual', obrigatorio: true },
    ],
    prazos: {
      analise: '10 a 30 dias úteis',
      validade: 'Indeterminada, sujeita a renovação do RT',
      observacao: 'A AFE pode ser publicada no DOU em até 5 dias úteis após deferimento.',
    },
    custos: [
      { descricao: 'Taxa de Fiscalização de Vigilância Sanitária (TFVS)', valorMin: 600, valorMax: 18000, unidade: 'R$', observacao: 'Varia por porte da empresa e atividade (Lei 6.437/77 e atualizações).' },
      { descricao: 'Honorários do Responsável Técnico', valorMin: 1500, valorMax: 6000, unidade: 'R$/mês', observacao: 'Pode ser variável; valores de referência do conselho.' },
      { descricao: 'Projeto de Boas Práticas', valorMin: 3000, valorMax: 15000, unidade: 'R$', observacao: 'Consultoria especializada com ART.' },
    ],
    fundamentacaoLegal: [
      'Lei 6.360/1976 (Vigilância Sanitária)',
      'Lei 9.782/1999 (Sistema Nacional de Vigilância Sanitária)',
      'RDC 16/2014 (critérios para AFE)',
      'RDC 275/2019 (Boas Práticas de Fabricação)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/regularizacao/autorizacao-de-funcionamento',
    tags: ['afe', 'alimentos', 'medicamentos', 'cosmeticos', 'saneantes', 'vigilancia-sanitaria'],
    exemplosAplicacao: [
      'Indústria de suplementos alimentares que precisa iniciar a produção',
      'Importadora de cosméticos que deseja nacionalizar estoque',
      'Distribuidora de saneantes que atenderá hospitais',
    ],
  },
  {
    id: 'anvisa-registro-alimento',
    orgao: 'ANVISA',
    sigla: 'Registro de Alimento',
    nome: 'Registro de Produto Alimentício',
    categoria: 'alimentos',
    descricao:
      'Obrigatório para alimentos com claims funcionais, novel foods, alimentos infantis, suplementos alimentares e produtos com adição de nutrientes. Alimentos comuns seguem o sistema de notificação; alimentos de maior risco seguem o registro com análise técnica completa.',
    resumo:
      'Registro ou notificação de produto alimentício na ANVISA, conforme categoria de risco.',
    publicoAlvo: [
      'Indústrias de alimentos',
      'Fabricantes de suplementos alimentares',
      'Empresas de nutrição infantil',
      'Foodtechs com ingredientes inovadores',
    ],
    requisitos: [
      'AFE válida para a atividade',
      'Responsável técnico habilitado',
      'Comprovação de segurança de uso e estudos quando aplicável',
      'Rotulagem conforme RDC 26/2015 e regulamentos específicos',
    ],
    documentos: [
      { nome: 'Formulário de petição (peticionamento eletrônico)', descricao: 'No portal da ANVISA', obrigatorio: true },
      { nome: 'Fórmula completa quali-quantitativa', descricao: 'Com limites de variação e função de cada ingrediente', obrigatorio: true },
      { nome: 'Laudos laboratoriais', descricao: 'Físico-químico, microbiológico e de contaminantes', obrigatorio: true },
      { nome: 'Projeto de rotulagem', descricao: 'Todos os dizeres obrigatórios e claims', obrigatorio: true },
      { nome: 'Estudos de estabilidade', descricao: 'Shelf life e condições de armazenamento', obrigatorio: true },
      { nome: 'Documentação de Boas Práticas', descricao: 'Certificado ou relatório de inspeção', obrigatorio: true },
    ],
    prazos: {
      analise: '90 a 180 dias para registro; 10 a 30 dias para notificação',
      validade: '5 anos (registro) ou Indeterminada (notificação)',
      observacao: 'Suplementos alimentares e alimentos infantis são registros típicos.',
    },
    custos: [
      { descricao: 'Taxa de avaliação de petição', valorMin: 7000, valorMax: 18000, unidade: 'R$' },
      { descricao: 'Laudos laboratoriais', valorMin: 5000, valorMax: 15000, unidade: 'R$' },
      { descricao: 'Estudos de estabilidade', valorMin: 8000, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Consultoria de rotulagem e adequação', valorMin: 4000, valorMax: 12000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 9.782/1999',
      'RDC 26/2015 (Rotulagem)',
      'RDC 243/2018 (Suplementos)',
      'RDC 27/2010 (Alimentos infantis)',
      'RDC 24/2014 (Notificação de alimentos)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/alimentos',
    tags: ['alimentos', 'suplementos', 'notificacao', 'registro', 'rotulagem'],
    exemplosAplicacao: [
      'Lançamento de whey protein com nova formulação',
      'Bebida vegetal com enriquecimento de vitaminas',
      'Mistura para bolo funcional com claim de saúde',
    ],
  },
  {
    id: 'anvisa-registro-cosmetico',
    orgao: 'ANVISA',
    sigla: 'Registro de Cosmético',
    nome: 'Registro ou Notificação de Produto Cosmético',
    categoria: 'cosmeticos',
    descricao:
      'Produtos cosméticos de Grau 1 (risco mínimo) são apenas notificados; Grau 2 (com claims específicos ou maior risco) exigem registro. Sistema baseado em autodeclaração e responsabilidade da empresa.',
    resumo:
      'Regularização de cosméticos conforme o grau de risco (Grau 1 notifica; Grau 2 registra).',
    publicoAlvo: [
      'Indústrias de cosméticos',
      'Marcas próprias de higiene pessoal',
      'Salões de beleza com fabricação própria',
      'Startups de beleza e bem-estar',
    ],
    requisitos: [
      'AFE vigente',
      'Responsável técnico habilitado',
      'Boas Práticas de Fabricação implementadas (RDC 752/2022)',
      'Sistema de cosmetovigilância ativo',
    ],
    documentos: [
      { nome: 'Fórmula quali-quantitativa', descricao: 'Conforme IN 29/2013 e atualizações', obrigatorio: true },
      { nome: 'Documentação de segurança e eficácia', descricao: 'Testes ou relatórios técnicos', obrigatorio: true },
      { nome: 'Projeto de rotulagem', descricao: 'Conforme RDC 07/2015', obrigatorio: true },
      { nome: 'Comprovação de boas práticas', descricao: 'Manual, procedimentos e registros', obrigatorio: true },
      { nome: 'Laudo de controle de qualidade', descricao: 'Físico-químico e microbiológico', obrigatorio: true },
    ],
    prazos: {
      analise: 'Imediato para notificação (Grau 1); 30 a 60 dias para Grau 2',
      validade: '5 anos (registro) / Indeterminada (notificação)',
    },
    custos: [
      { descricao: 'Taxa de notificação/registro', valorMin: 200, valorMax: 1500, unidade: 'R$' },
      { descricao: 'Laudos de segurança e eficácia', valorMin: 3000, valorMax: 12000, unidade: 'R$' },
      { descricao: 'Adequação de rotulagem', valorMin: 1500, valorMax: 5000, unidade: 'R$' },
      { descricao: 'Implementação de BPF', valorMin: 5000, valorMax: 25000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.360/1976',
      'RDC 752/2022 (BPF para cosméticos)',
      'RDC 07/2015 (Rotulagem)',
      'IN 29/2013 (Lista de substâncias)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/cosmeticos',
    tags: ['cosmeticos', 'higiene', 'beleza', 'notificacao', 'registro'],
    exemplosAplicacao: [
      'Shampoo natural com óleos essenciais',
      'Hidratante facial com proteção solar',
      'Sérum antissinais com retinol',
    ],
  },
  {
    id: 'anvisa-afe-drogaria',
    orgao: 'ANVISA',
    sigla: 'AFE - Drogaria',
    nome: 'Autorização de Funcionamento de Drogaria/Farmácia',
    categoria: 'medicamentos',
    descricao:
      'Habilitação específica para farmácias e drogarias. Inclui a obrigatoriedade de farmacêutico responsável presente durante todo o horário de funcionamento.',
    resumo:
      'Autorização para funcionamento de drogarias com farmacêutico responsável.',
    publicoAlvo: [
      'Drogarias e farmácias',
      'Farmácias de manipulação',
      'Farmácias hospitalares',
      'Postos de medicamentos',
    ],
    requisitos: [
      'Farmacêutico Responsável Técnico (RT) com carga horária compatível',
      'Estrutura física conforme RDC 44/2009',
      'Sistema de escrituração (SNGPC ou conforme normas)',
      'Plano de gerenciamento de resíduos',
    ],
    documentos: [
      { nome: 'Ato constitutivo da empresa', descricao: 'Com últimas alterações', obrigatorio: true },
      { nome: 'Certidão de RT emitida pelo CRF', descricao: 'Com vencimento válido', obrigatorio: true },
      { nome: 'Planta baixa aprovada', descricao: 'Conforme legislação municipal', obrigatorio: true },
      { nome: 'Alvará sanitário local', descricao: 'Da vigilância sanitária estadual ou municipal', obrigatorio: true },
      { nome: 'PGRSS', descricao: 'Plano de Gerenciamento de Resíduos de Serviços de Saúde', obrigatorio: true },
      { nome: 'Manual de Boas Práticas', descricao: 'Conforme RDC 44/2009 e atualizações', obrigatorio: true },
    ],
    prazos: {
      analise: '15 a 45 dias úteis',
      validade: 'Indeterminada enquanto mantiver RT',
    },
    custos: [
      { descricao: 'Taxa ANVISA (TFVS)', valorMin: 600, valorMax: 1800, unidade: 'R$' },
      { descricao: 'Honorários do farmacêutico RT', valorMin: 4000, valorMax: 12000, unidade: 'R$/mês' },
      { descricao: 'Adequação de planta', valorMin: 5000, valorMax: 30000, unidade: 'R$' },
      { descricao: 'Manual de BPF e PGRSS', valorMin: 3000, valorMax: 8000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 13.021/2014 (Farmácias)',
      'RDC 44/2009 (Boas Práticas em Drogarias)',
      'Lei 5.991/1973 (controle sanitário do comércio)',
      'RDC 67/2007 (Manipulação)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/medicamentos',
    tags: ['drogaria', 'farmacia', 'medicamentos', 'sngpc', 'rt'],
    exemplosAplicacao: [
      'Abertura de drogaria de bairro',
      'Conversão de farmácia de manipulação para comercialização',
      'Posto de medicamentos em posto de saúde',
    ],
  },
  {
    id: 'anvisa-registro-medicamento',
    orgao: 'ANVISA',
    sigla: 'Registro de Medicamento',
    nome: 'Registro de Medicamento - Categoria Sintético, Biológico ou Genérico',
    categoria: 'medicamentos',
    descricao:
      'Processo mais complexo da ANVISA. Exige estudos de eficácia, segurança e qualidade. Categorias: novo, genérico, similar, biológico, fitoterápico, entre outras. Cada categoria tem requisitos regulatórios específicos.',
    resumo:
      'Registro completo de medicamento com estudos clínicos e não clínicos conforme categoria.',
    publicoAlvo: [
      'Indústrias farmacêuticas',
      'Biolaboratórios',
      'Empresas de biotecnologia',
      'Fabricantes de fitoterápicos',
    ],
    requisitos: [
      'AFE vigente',
      'Responsável técnico com formação compatível',
      'Sistema de Farmacovigilância estruturado',
      'CGMP (Current Good Manufacturing Practices) certificado',
      'Estudos clínicos quando aplicável (fase I, II, III)',
    ],
    documentos: [
      { nome: 'Dossiê completo de registro', descricao: 'Formulários F1 e F2 do CTD/eCTD', obrigatorio: true },
      { nome: 'Estudos de eficácia e segurança', descricao: 'Conforme categoria e perfil do produto', obrigatorio: true },
      { nome: 'Documentação de qualidade (CMC)', descricao: 'Chemistry, Manufacturing and Controls', obrigatorio: true },
      { nome: 'Plano de Farmacovigilância', descricao: 'Com RMP (Risk Management Plan)', obrigatorio: true },
      { nome: 'Laudos de equivalência farmacêutica/biodisponibilidade', descricao: 'Para genéricos e similares', obrigatorio: true },
      { nome: 'Certificado de BPF (CBPF)', descricao: 'Emitido após inspeção', obrigatorio: true },
      { nome: 'Bula e rotulagem', descricao: 'Conforme legislação vigente', obrigatorio: true },
    ],
    prazos: {
      analise: '12 a 24 meses (média histórica)',
      validade: '5 anos',
      observacao: 'Prazos podem ser reduzidos para genéricos pelo procedimento sumário.',
    },
    custos: [
      { descricao: 'Taxa de análise regulatória', valorMin: 25000, valorMax: 80000, unidade: 'R$' },
      { descricao: 'Estudos clínicos (fase II/III)', valorMin: 500000, valorMax: 5000000, unidade: 'R$' },
      { descricao: 'Estudos de bioequivalência', valorMin: 80000, valorMax: 300000, unidade: 'R$' },
      { descricao: 'Consultoria regulatória e CTD', valorMin: 100000, valorMax: 500000, unidade: 'R$' },
      { descricao: 'Implementação de CGMP', valorMin: 500000, valorMax: 5000000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.360/1976',
      'Lei 9.787/1999 (Medicamentos genéricos)',
      'RDC 200/2017 (BPF em medicamentos)',
      'RDC 753/2022 (Registro de medicamentos)',
      'RDC 55/2010 (Biológicos)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/registros',
    tags: ['medicamento', 'registro', 'bioequivalencia', 'ctd', 'farmaco'],
    exemplosAplicacao: [
      'Lançamento de genérico de antihipertensivo',
      'Biológico biossimilar para artrite reumatoide',
      'Fitoterápico com base em estudos clínicos',
    ],
  },
  {
    id: 'anvisa-dispositivos-medicos',
    orgao: 'ANVISA',
    sigla: 'Registro de DM',
    nome: 'Regularização de Dispositivos Médicos',
    categoria: 'medicos-dispositivos',
    descricao:
      'Dispositivos médicos são classificados em Classes I, II, III e IV conforme o risco. Classe I e II geralmente seguem cadastro; Classes III e IV exigem registro com análise completa. Inclui equipamentos, implantes, materiais de consumo, software como dispositivo médico (SaMD).',
    resumo:
      'Cadastro (baixo risco) ou registro (alto risco) de dispositivos médicos na ANVISA.',
    publicoAlvo: [
      'Fabricantes de equipamentos médicos',
      'Indústrias de materiais hospitalares',
      'Empresas de SaMD (Software as Medical Device)',
      'Fabricantes de órteses e próteses',
    ],
    requisitos: [
      'AFE vigente',
      'Classificação de risco conforme Regras 1-22 da RDC 751/2022',
      'Sumarização Técnica (Technical File) estruturada',
      'Sistema de Gestão da Qualidade (SGQ) certificado ISO 13485 idealmente',
      'Para Classes III/IV: ensaios de biocompatibilidade, elétricos, EMC conforme normas aplicáveis',
    ],
    documentos: [
      { nome: 'Dossiê técnico completo', descricao: 'Conforme Anexo III da RDC 751/2022', obrigatorio: true },
      { nome: 'Relatório de Gerenciamento de Risco', descricao: 'Conforme ISO 14971', obrigatorio: true },
      { nome: 'Rotulagem e instruções de uso', descricao: 'Conforme RDC 185/2001 e atualizações', obrigatorio: true },
      { nome: 'Certificado de Conformidade INMETRO', descricao: 'Para equipamentos sob regime compulsório', obrigatorio: false },
      { nome: 'Estudos clínicos ou literatura', descricao: 'Para Classes III e IV', obrigatorio: true },
      { nome: 'Comprovação de SGQ', descricao: 'ISO 13485 ou equivalente', obrigatorio: true },
    ],
    prazos: {
      analise: '30 a 90 dias (cadastro) / 180 a 365 dias (registro)',
      validade: 'Indeterminada (cadastro) / 5 anos (registro)',
    },
    custos: [
      { descricao: 'Taxa ANVISA', valorMin: 1500, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Certificação ISO 13485', valorMin: 30000, valorMax: 80000, unidade: 'R$' },
      { descricao: 'Ensaios laboratoriais (biocompatibilidade, elétricos)', valorMin: 15000, valorMax: 100000, unidade: 'R$' },
      { descricao: 'Consultoria de classificação e dossiê', valorMin: 20000, valorMax: 80000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'RDC 751/2022 (Classificação de risco)',
      'RDC 549/2021 (rotulagem)',
      'RDC 185/2001 (registro)',
      'ABNT NBR ISO 13485 (SGQ)',
      'ABNT NBR ISO 14971 (gerenciamento de risco)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/produtos-para-a-saude',
    tags: ['dispositivo-medico', 'equipamento', 'orthese', 'protese', 'samd', 'sgq'],
    exemplosAplicacao: [
      'App de análise de ECG como SaMD',
      'Cateter intravenoso de Classe III',
      'Monitor multiparamétrico Classe II',
    ],
  },
  {
    id: 'anvisa-produtos-saude',
    orgao: 'ANVISA',
    sigla: 'Registro de Produto para Saúde',
    nome: 'Registro de Produtos para Saúde (Correlatos)',
    categoria: 'produtos-saude',
    descricao:
      'Produtos para saúde incluem artigos de uso médico-hospitalar, materiais de laboratório, produtos de diagnóstico in vitro e reagentes. A regularização depende da classe de risco (I, II, III, IV).',
    resumo:
      'Regularização de produtos para saúde (materiais, equipamentos, diagnóstico in vitro).',
    publicoAlvo: [
      'Fabricantes de materiais médicos',
      'Indústrias de diagnóstico in vitro',
      'Empresas de reagentes',
      'Distribuidoras de correlatos',
    ],
    requisitos: [
      'AFE vigente',
      'Sistema de qualidade conforme ABNT NBR ISO 13485',
      'Notificação de eventos adversos sistemática',
      'Acompanhamento pós-mercado',
    ],
    documentos: [
      { nome: 'Relatório técnico estruturado', descricao: 'Conforme RDC 36/2015 e atualizações', obrigatorio: true },
      { nome: 'Relatório de gerenciamento de risco', descricao: 'ISO 14971', obrigatorio: true },
      { nome: 'Laudos de controle de qualidade', descricao: 'Conforme normas específicas', obrigatorio: true },
      { nome: 'Rotulagem e instruções de uso', descricao: 'Em português', obrigatorio: true },
      { nome: 'Certificado de boas práticas de fabricação', descricao: 'CBPF quando aplicável', obrigatorio: true },
    ],
    prazos: {
      analise: '60 a 180 dias (dependendo da classe)',
      validade: '5 anos (registro) / Indeterminada (cadastro)',
    },
    custos: [
      { descricao: 'Taxa ANVISA', valorMin: 800, valorMax: 12000, unidade: 'R$' },
      { descricao: 'Laudos e ensaios', valorMin: 8000, valorMax: 50000, unidade: 'R$' },
      { descricao: 'Certificação ISO 13485', valorMin: 25000, valorMax: 70000, unidade: 'R$' },
      { descricao: 'Consultoria regulatória', valorMin: 15000, valorMax: 60000, unidade: 'R$' },
    ],
    fundamentacaoLegal: ['RDC 36/2015', 'RDC 206/2006', 'Lei 6.360/1976', 'RDC 16/2014 (AFE)'],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/produtos-para-a-saude',
    tags: ['correlatos', 'produtos-saude', 'diagnostico', 'laboratorio'],
    exemplosAplicacao: [
      'Teste rápido de gravidez',
      'Seringa descartável Classe II',
      'Reagente para hemograma',
    ],
  },
  {
    id: 'anvisa-saneantes',
    orgao: 'ANVISA',
    sigla: 'Registro de Saneante',
    nome: 'Registro ou Notificação de Saneante',
    categoria: 'saneantes',
    descricao:
      'Saneantes domissanitários e profissionais divididos em risco 1 (notificação) e risco 2 (registro). Inclui desinfetantes, detergentes, sanitizantes, inseticidas e produtos para piscinas.',
    resumo:
      'Regularização de saneantes conforme risco 1 (notifica) ou risco 2 (registra).',
    publicoAlvo: [
      'Indústrias de produtos de limpeza',
      'Fabricantes de desinfetantes hospitalares',
      'Empresas de tratamento de água e piscinas',
      'Fabricantes de inseticidas domissanitários',
    ],
    requisitos: [
      'AFE vigente',
      'Responsável técnico habilitado',
      'BPF conforme RDC 59/2010',
      'Para risco 2: estudos de eficácia e segurança',
    ],
    documentos: [
      { nome: 'Fórmula completa', descricao: 'Com concentrações e funções', obrigatorio: true },
      { nome: 'Laudos de eficácia e segurança', descricao: 'Especialmente para risco 2', obrigatorio: true },
      { nome: 'Projeto de rotulagem', descricao: 'Conforme legislação específica', obrigatorio: true },
      { nome: 'Certificado de BPF', descricao: 'CBPF quando aplicável', obrigatorio: true },
      { nome: 'Estudo de estabilidade', descricao: 'Compatibilidade em embalagem', obrigatorio: true },
    ],
    prazos: {
      analise: '15 a 30 dias (notificação) / 90 a 180 dias (registro)',
      validade: '5 anos (registro)',
    },
    custos: [
      { descricao: 'Taxa ANVISA', valorMin: 600, valorMax: 8000, unidade: 'R$' },
      { descricao: 'Laudos de eficácia', valorMin: 5000, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Estudos de estabilidade', valorMin: 4000, valorMax: 15000, unidade: 'R$' },
      { descricao: 'Implementação de BPF', valorMin: 8000, valorMax: 30000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'RDC 59/2010 (BPF em saneantes)',
      'RDC 35/2010 (Desinfetantes)',
      'RDC 32/2011 (Insecticidas)',
      'RDC 14/2014 (Piscinas)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/saneantes',
    tags: ['saneantes', 'desinfetante', 'limpeza', 'piscinas', 'inseticida'],
    exemplosAplicacao: [
      'Álcool em gel 70%',
      'Desinfetante hospitalar à base de quaternário de amônio',
      'Clarificante para piscina',
    ],
  },
  {
    id: 'anvisa-cbpf',
    orgao: 'ANVISA',
    sigla: 'CBPF',
    nome: 'Certificado de Boas Práticas de Fabricação (CBPF)',
    categoria: 'alimentos',
    descricao:
      'Certificado emitido após inspeção da ANVISA que atesta que a empresa segue as Boas Práticas de Fabricação. É pré-requisito para o registro de medicamentos, alimentos com AFE específica, produtos para saúde e cosméticos Grau 2.',
    resumo:
      'Certificado que atesta BPF após inspeção; pré-requisito para diversos registros.',
    publicoAlvo: [
      'Fabricantes de medicamentos',
      'Indústrias de alimentos registrados',
      'Fabricantes de produtos para saúde Classes III/IV',
      'Indústrias de cosméticos Grau 2',
    ],
    requisitos: [
      'AFE vigente',
      'Sistema de qualidade implantado',
      'Estrutura física e equipamentos conformes',
      'Procedimentos operacionais padrão (POPs)',
      'Capacitação de colaboradores',
    ],
    documentos: [
      { nome: 'Solicitação de inspeção', descricao: 'Peticionamento eletrônico', obrigatorio: true },
      { nome: 'Relatório de auto-avaliação', descricao: 'Conforme roteiro da ANVISA', obrigatorio: true },
      { nome: 'Manual da qualidade', descricao: 'Com políticas e procedimentos', obrigatorio: true },
      { nome: 'Procedimentos operacionais padrão (POPs)', descricao: 'Lista mestra e POPs-chave', obrigatorio: true },
      { nome: 'Certificados de calibração', descricao: 'De equipamentos críticos', obrigatorio: true },
      { nome: 'Documentação de treinamento', descricao: 'Registros de capacitação', obrigatorio: true },
    ],
    prazos: {
      analise: 'Inspeção em 60 a 180 dias; emissão após 30 a 90 dias',
      validade: '2 anos (renovável)',
    },
    custos: [
      { descricao: 'Taxa de inspeção ANVISA', valorMin: 2000, valorMax: 12000, unidade: 'R$' },
      { descricao: 'Consultoria para adequação', valorMin: 15000, valorMax: 80000, unidade: 'R$' },
      { descricao: 'Adequação de equipamentos', valorMin: 10000, valorMax: 100000, unidade: 'R$' },
      { descricao: 'Documentação e BPF', valorMin: 5000, valorMax: 25000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'RDC 275/2019 (Alimentos)',
      'RDC 200/2017 (Medicamentos)',
      'RDC 752/2022 (Cosméticos)',
      'RDC 59/2010 (Saneantes)',
    ],
    urlOficial: 'https://www.gov.br/anvisa/pt-br/assuntos/inspecao/certificado-de-boas-praticas-de-fabricacao',
    tags: ['cbpf', 'bpf', 'inspecao', 'qualidade'],
    exemplosAplicacao: [
      'Indústria farmacêutica pleiteando primeiro registro',
      'Cosmético Grau 2 entrando no mercado',
      'Alimento com padrões elevados de qualidade',
    ],
  },

  // ============ CETESB ============
  {
    id: 'cetesb-lo',
    orgao: 'CETESB',
    sigla: 'LO',
    nome: 'Licença de Operação',
    categoria: 'licenca-operacao',
    descricao:
      'Autoriza a operação de atividade ou empreendimento após a verificação da conformidade com a legislação ambiental. Válida por prazo determinado (geralmente 4 anos, renovável). Emitida após a LI para a fase de operação efetiva.',
    resumo:
      'Licença para operar atividade potencialmente poluidora, válida por até 4 anos.',
    publicoAlvo: [
      'Indústrias de qualquer porte',
      'Postos de combustíveis',
      'Hospitais e laboratórios',
      'Centros logísticos e galpões industriais',
      'Empresas de saneamento e resíduos',
    ],
    requisitos: [
      'Licença de Instalação (LI) válida',
      'Plano de Operação conforme licenças anteriores',
      'Manutenção de controles ambientais',
      'Comprovação de regularidade das condicionantes',
      'Sistema de gestão ambiental ativo',
    ],
    documentos: [
      { nome: 'Requerimento padrão CETESB', descricao: 'Formulário online ou em SED', obrigatorio: true },
      { nome: 'Relatório de operação atualizado', descricao: 'Com indicadores ambientais', obrigatorio: true },
      { nome: 'Certidões negativas de débito ambiental', descricao: 'Federal, estadual e municipal', obrigatorio: true },
      { nome: 'Cópia da LI', descricao: 'Ou protocolo de pedido de renovação', obrigatorio: true },
      { nome: 'Comprovante de atendimento de condicionantes', descricao: 'Relatórios e laudos', obrigatorio: true },
      { nome: 'Laudos de monitoramento (se aplicável)', descricao: 'Emissões atmosféricas, efluentes, ruídos', obrigatorio: true },
      { nome: 'Plano de Gerenciamento de Resíduos Sólidos', descricao: 'PGRS conforme PNSR', obrigatorio: true },
    ],
    prazos: {
      analise: '60 a 180 dias',
      validade: '4 anos (renovável)',
      observacao: 'Vencimento durante período pandêmico ou emergências ambientais pode ser estendido por resolução.',
    },
    custos: [
      { descricao: 'Taxa CETESB (TFDA ou similar)', valorMin: 1500, valorMax: 30000, unidade: 'R$', observacao: 'Varia por porte e potencial poluidor.' },
      { descricao: 'Laudos de monitoramento', valorMin: 3000, valorMax: 20000, unidade: 'R$' },
      { descricao: 'Consultoria ambiental', valorMin: 5000, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Elaboração de relatórios', valorMin: 2000, valorMax: 12000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.938/1981 (PNMA)',
      'Lei Estadual 9.509/1997 (protecao ambiental SP)',
      'Resolução CONAMA 237/1997',
      'Resoluções SMA/CETESB específicas',
    ],
    urlOficial: 'https://cetesb.sp.gov.br/licenciamento/licenca-de-operacao-lo/',
    tags: ['lo', 'operacao', 'renovacao', 'condiciambientais'],
    exemplosAplicacao: [
      'Indústria química em operação desde 2018 com LI vencida',
      'Posto de combustível que completou instalação',
      'Centro de distribuição em início de operação',
    ],
  },
  {
    id: 'cetesb-li',
    orgao: 'CETESB',
    sigla: 'LI',
    nome: 'Licença de Instalação',
    categoria: 'licenca-instalacao',
    descricao:
      'Autoriza a instalação ou ampliação de empreendimento ou atividade, conforme projeto aprovado. Deve ser obtida antes do início das obras. Inclui o detalhamento de medidas de controle ambiental a serem implementadas durante a construção.',
    resumo:
      'Autoriza a construção ou ampliação de atividade potencialmente poluidora.',
    publicoAlvo: [
      'Empresas em fase de instalação/construção',
      'Indústrias em ampliação',
      'Galpões logísticos novos',
      'Empreendimentos com novas linhas de produção',
    ],
    requisitos: [
      'Licença Prévia (LP) válida',
      'Projeto executivo aprovado',
      'Plano de Controle Ambiental (PCA) ou equivalente',
      'Programa de Recuperação de Áreas Degradadas quando aplicável',
      'Projeto de tratamento de efluentes e emissões',
    ],
    documentos: [
      { nome: 'Requerimento CETESB', descricao: 'Formulário específico para LI', obrigatorio: true },
      { nome: 'Projeto executivo aprovado', descricao: 'Com ART do responsável técnico', obrigatorio: true },
      { nome: 'Plano de Controle Ambiental (PCA)', descricao: 'Conforme termos de referência', obrigatorio: true },
      { nome: 'Cópia da LP', descricao: 'Com condicionantes atendidas', obrigatorio: true },
      { nome: 'Estudos complementares', descricao: 'Ruído, geotécnico, hidrogeológico conforme atividade', obrigatorio: true },
      { nome: 'Cronograma de implantação', descricao: 'Com marcos físicos e ambientais', obrigatorio: true },
      { nome: 'Outorga de uso de água', descricao: 'Quando aplicável (DAEE)', obrigatorio: false },
    ],
    prazos: {
      analise: '90 a 270 dias',
      validade: 'Conforme cronograma definido (geralmente 2 a 6 anos)',
    },
    custos: [
      { descricao: 'Taxa CETESB', valorMin: 2000, valorMax: 50000, unidade: 'R$' },
      { descricao: 'Projeto executivo ambiental', valorMin: 15000, valorMax: 80000, unidade: 'R$' },
      { descricao: 'Estudos complementares', valorMin: 8000, valorMax: 60000, unidade: 'R$' },
      { descricao: 'Acompanhamento de obra (PCA)', valorMin: 10000, valorMax: 50000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.938/1981',
      'Lei Estadual 9.509/1997',
      'Resolução CONAMA 237/1997',
      'Resoluções SMA 49/2014 e atualizações',
    ],
    urlOficial: 'https://cetesb.sp.gov.br/licenciamento/licenca-de-instalacao-li/',
    tags: ['li', 'instalacao', 'ampliacao', 'obras', 'pca'],
    exemplosAplicacao: [
      'Construção de nova fábrica de comida congelada',
      'Instalação de tanque de combustível em posto',
      'Galpão logístico em região metropolitana',
    ],
  },
  {
    id: 'cetesb-lp',
    orgao: 'CETESB',
    sigla: 'LP',
    nome: 'Licença Prévia',
    categoria: 'licenca-previa',
    descricao:
      'Primeira fase do licenciamento. Avalia a viabilidade ambiental do empreendimento quanto à sua localização, concepção e tecnologia proposta. Aprovada a LP, o proponente pode requerer a LI para iniciar a construção.',
    resumo:
      'Atesta a viabilidade ambiental do empreendimento antes da instalação.',
    publicoAlvo: [
      'Novos empreendimentos industriais',
      'Projetos de grande porte',
      'Empreendimentos em zonas de restrição',
      'Empreendimentos com alto potencial poluidor',
    ],
    requisitos: [
      'Estudo de Impacto Ambiental (EIA) ou Relatório Ambiental Preliminar (RAP)',
      'Zoneamento municipal favorável',
      'Estudo de vizinhança quando aplicável',
      'Audiência pública ou consulta popular (dependendo da magnitude)',
    ],
    documentos: [
      { nome: 'Requerimento CETESB', descricao: 'Formulário específico para LP', obrigatorio: true },
      { nome: 'EIA/RIMA ou RAP', descricao: 'Conforme Termo de Referência', obrigatorio: true },
      { nome: 'CAR (Cadastro Ambiental Rural)', descricao: 'Para atividades em zona rural', obrigatorio: false },
      { nome: 'Mapa de localização', descricao: 'Com zoneamento, APPs, unidades de conservação', obrigatorio: true },
      { nome: 'Certidões municipais', descricao: 'Uso do solo e viabilidade', obrigatorio: true },
      { nome: 'Estudo de capacidade de suporte', descricao: 'Recursos hídricos, infraestrutura', obrigatorio: true },
    ],
    prazos: {
      analise: '180 a 720 dias (depende da complexidade)',
      validade: '5 anos (renovável)',
      observacao: 'Projetos complexos com EIA costumam levar mais de 1 ano.',
    },
    custos: [
      { descricao: 'Taxa CETESB', valorMin: 3000, valorMax: 80000, unidade: 'R$' },
      { descricao: 'EIA/RIMA completo', valorMin: 80000, valorMax: 400000, unidade: 'R$' },
      { descricao: 'RAP (Relatório Ambiental Preliminar)', valorMin: 20000, valorMax: 100000, unidade: 'R$' },
      { descricao: 'Consultoria ambiental completa', valorMin: 50000, valorMax: 250000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.938/1981',
      'Resolução CONAMA 01/1986',
      'Resolução CONAMA 237/1997',
      'Lei Estadual 9.509/1997',
    ],
    urlOficial: 'https://cetesb.sp.gov.br/licenciamento/licenca-previa-lp/',
    tags: ['lp', 'viabilidade', 'eia', 'rima', 'rap'],
    exemplosAplicacao: [
      'Novo parque industrial em município do interior',
      'Complexo logístico em área de manancial',
      'Planta de geração de energia',
    ],
  },
  {
    id: 'cetesb-aia',
    orgao: 'CETESB',
    sigla: 'AA',
    nome: 'Autorização Ambiental',
    categoria: 'autorizacao-ambiental',
    descricao:
      'Autoriza operações de menor porte e impacto localizado, geralmente para empreendimentos dispensados de licenciamento trifásico. Exemplos: pequenos改修, lotes, área de escape de gases e emissão de ruído temporária.',
    resumo:
      'Autorização para atividades de menor porte e impacto ambiental específico.',
    publicoAlvo: [
      'Pequenos empreendimentos',
      'Atividades temporárias',
      'Eventos com impacto ambiental localizado',
      'Modificações de pequeno porte',
    ],
    requisitos: [
      'Caracterização simplificada do impacto',
      'Medidas de controle específicas',
      'Compromisso de recuperação ambiental',
    ],
    documentos: [
      { nome: 'Requerimento CETESB', descricao: 'Formulário simplificado', obrigatorio: true },
      { nome: 'Memorial descritivo da atividade', descricao: 'Com cronograma e localização', obrigatorio: true },
      { nome: 'Medidas mitigadoras propostas', descricao: 'Plano simplificado de controle', obrigatorio: true },
      { nome: 'Anuência municipal', descricao: 'Quando aplicável', obrigatorio: false },
    ],
    prazos: {
      analise: '15 a 60 dias',
      validade: 'Definida pela natureza da atividade',
    },
    custos: [
      { descricao: 'Taxa CETESB', valorMin: 300, valorMax: 3000, unidade: 'R$' },
      { descricao: 'Memorial descritivo', valorMin: 1500, valorMax: 8000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Resolução CONAMA 237/1997',
      'Resoluções SMA específicas',
      'Decreto Estadual 8.468/1976',
    ],
    urlOficial: 'https://cetesb.sp.gov.br/licenciamento/autorizacao-ambiental/',
    tags: ['aa', 'autorizacao', 'simples', 'baixo-impacto'],
    exemplosAplicacao: [
      'Estrutura temporária para evento',
      'Pequena reforma em estabelecimento',
      'Supressão de árvore isolada',
    ],
  },
  {
    id: 'cetesb-cadastro',
    orgao: 'CETESB',
    sigla: 'CTF/APP',
    nome: 'Cadastro Técnico Federal de Atividades Potencialmente Poluidoras',
    categoria: 'cadastro-tecnico',
    descricao:
      'Cadastro obrigatório no IBAMA para empresas que exercem atividades potencialmente poluidoras. CTEFAPP (Cadastro Técnico Federal de Atividades e Instrumentos de Defesa Ambiental) requer o pagamento da TCFA (Taxa de Controle e Fiscalização Ambiental).',
    resumo:
      'Cadastro federal de atividades potencialmente poluidoras (IBAMA).',
    publicoAlvo: [
      'Indústrias de qualquer porte',
      'Postos de combustíveis',
      'Transportadoras de produtos perigosos',
      'Empresas de gerenciamento de resíduos',
    ],
    requisitos: [
      'CNPJ ativo',
      'Caracterização da atividade potencialmente poluidora',
      'Comprovação de regularidade dos relatórios',
      'Pagamento anual da TCFA',
    ],
    documentos: [
      { nome: 'Certificado de Cadastro no CTF/APP', descricao: 'Emitido pelo IBAMA', obrigatorio: true },
      { nome: 'Comprovante de pagamento da TCFA', descricao: 'Anual', obrigatorio: true },
      { nome: 'Relatório de atividades', descricao: 'Conforme código da atividade', obrigatorio: true },
      { nome: 'Plano de gerenciamento ambiental', descricao: 'Conforme atividade', obrigatorio: true },
    ],
    prazos: {
      analise: 'Imediato após cadastro',
      validade: 'Anual (com atualização de dados)',
    },
    custos: [
      { descricao: 'TCFA anual', valorMin: 150, valorMax: 9000, unidade: 'R$', observacao: 'Varia por porte e potencial poluidor.' },
      { descricao: 'Mão-de-obra para Relatórios de Atividades', valorMin: 1000, valorMax: 8000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 6.938/1981',
      'Lei 10.165/2000 (TCFA)',
      'IN IBAMA 06/2013',
      'IN IBAMA 10/2013',
    ],
    urlOficial: 'https://www.gov.br/ibama/pt-br/assuntos/emissoes-e-licenciamentos/cadastro-e-relatorios',
    tags: ['ctf', 'app', 'tfa', 'relatorios', 'ibama'],
    exemplosAplicacao: [
      'Posto de combustível com vencimento do TCFA',
      'Transportadora de produtos químicos',
      'Geradora de resíduos perigosos',
    ],
  },
  {
    id: 'cetesb-outorga',
    orgao: 'CETESB',
    sigla: 'Outorga',
    nome: 'Outorga de Direito de Uso de Recursos Hídricos (DAEE)',
    categoria: 'autorizacao-ambiental',
    descricao:
      'Autorização obrigatória para captação de água superficial ou subterrânea, lançamento de efluentes e uso de recursos hídricos. Emitida pelo DAEE no estado de São Paulo (em outros estados, pelos órgãos competentes).',
    resumo:
      'Autorização de uso da água (captação, lançamento, derivação) pelo DAEE.',
    publicoAlvo: [
      'Indústrias com captação própria',
      'Empreendimentos que lançam efluentes',
      'Barragens e usinas',
      'Irrigação de larga escala',
    ],
    requisitos: [
      'Vazão requerida caracterizada',
      'Ensaio de bombeamento (para captação subterrânea)',
      'Plano de uso racional da água',
      'Monitoramento quali-quantitativo',
    ],
    documentos: [
      { nome: 'Requerimento DAEE', descricao: 'Formulário de outorga', obrigatorio: true },
      { nome: 'Projeto técnico de captação', descricao: 'Com ART', obrigatorio: true },
      { nome: 'Ensaio de bombeamento', descricao: 'Para poços', obrigatorio: true },
      { nome: 'Plano de uso racional da água', descricao: 'Conforme Lei 9.433/1997', obrigatorio: true },
      { nome: 'Sistema de monitoramento', descricao: 'Hidrômetros e qualidade', obrigatorio: true },
    ],
    prazos: {
      analise: '90 a 365 dias',
      validade: '5 a 10 anos (renovável)',
    },
    custos: [
      { descricao: 'Taxa DAEE', valorMin: 800, valorMax: 15000, unidade: 'R$' },
      { descricao: 'Ensaio de bombeamento', valorMin: 4000, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Projeto técnico', valorMin: 5000, valorMax: 30000, unidade: 'R$' },
    ],
    fundamentacaoLegal: [
      'Lei 9.433/1997 (PNRH)',
      'Lei Estadual 7.663/1991',
      'Decreto Estadual 41.258/1996',
      'Portarias DAEE 2.292/2012 e atualizações',
    ],
    urlOficial: 'https://www.daee.sp.gov.br/index.php?option=com_content&view=article&id=157',
    tags: ['outorga', 'agua', 'capitacao', 'efluentes', 'daee'],
    exemplosAplicacao: [
      'Poço artesiano para fábrica de alimentos',
      'Captação em rio para indústria',
      'Lançamento de efluente tratado em corpo d\'água',
    ],
  },
  {
    id: 'cetesb-grandes-geradores',
    orgao: 'CETESB',
    sigla: 'PGRS',
    nome: 'Plano de gerenciamento de Resíduos Sólidos para Grandes Geradores',
    categoria: 'autorizacao-ambiental',
    descricao:
      'Obrigatório para grandes geradores de resíduos sólidos (industriais, da construção civil, serviços de saúde, etc.). A definição de grande gerador varia por município, mas geralmente é o que gera mais de 100 ou 200 litros/dia ou 50 kg/dia.',
    resumo:
      'Plano de gerenciamento de resíduos sólidos para grandes geradores.',
    publicoAlvo: [
      'Indústrias de médio e grande porte',
      'Construção civil de grande porte',
      'Hospitais e laboratórios',
      'Shoppings e condomínios empresariais',
    ],
    requisitos: [
      'Caracterização qualitativa e quantitativa dos resíduos',
      'Sistema de coleta seletiva (conforme necessário)',
      'Destinação ambientalmente adequada',
      'Responsabilização compartilhada',
    ],
    documentos: [
      { nome: 'PGRS completo', descricao: 'Conforme PGRNS e legislação municipal', obrigatorio: true },
      { nome: 'Cadastro de geradores', descricao: 'Municipal quando aplicável', obrigatorio: true },
      { nome: 'Manifestos de transporte de resíduos', descricao: 'MTR/RTR conforme sistema', obrigatorio: true },
      { nome: 'Certificados de destinação final', descricao: 'De empresas licenciadas', obrigatorio: true },
      { nome: 'Relatórios anuais', descricao: 'Com a planilha de movimentação', obrigatorio: true },
    ],
    prazos: {
      analise: 'Conforme sistema público (municipal ou SINIR)',
      validade: 'Revisão anual',
    },
    custos: [
      { descricao: 'Elaboração de PGRS', valorMin: 4000, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Gestão de MTR', valorMin: 1500, valorMax: 8000, unidade: 'R$' },
      { descricao: 'Destinação de resíduos perigosos', valorMin: 3000, valorMax: 20000, unidade: 'R$/mês' },
    ],
    fundamentacaoLegal: [
      'Lei 12.305/2010 (PNRS)',
      'Lei Estadual 13.798/2009',
      'Decreto Federal 10.936/2022',
      'Decreto Estadual 54.645/2009',
    ],
    urlOficial: 'https://cetesb.sp.gov.br/residuos-solidos/',
    tags: ['pgrs', 'residuos', 'geradores', 'mtr', 'destinacao'],
    exemplosAplicacao: [
      'Hotel com mais de 200 litros/dia de resíduos',
      'Indústria química com classes I e II',
      'Hospital de grande porte',
    ],
  },
  {
    id: 'cetesb-rapp',
    orgao: 'CETESB',
    sigla: 'RAPP',
    nome: 'Relatório Anual de Atividades Potencialmente Poluidoras',
    categoria: 'cadastro-tecnico',
    descricao:
      'Obrigação anual para empresas que operam com atividades potencialmente poluidoras. Apresenta o desempenho ambiental do ano anterior, emissões, resíduos, água, energia e iniciativas ambientais.',
    resumo:
      'Relatório anual obrigatório de desempenho ambiental.',
    publicoAlvo: [
      'Indústrias com LO válida',
      'Empresas com TCFA ativa',
      'Operações de lavra mineral',
      'Atividades de transporte de produtos perigosos',
    ],
    requisitos: [
      'Consolidação de indicadores ambientais',
      'Inventário de emissões, efluentes e resíduos',
      'Consumo de água e energia',
      'Ações educativas e socioambientais',
    ],
    documentos: [
      { nome: 'RAPP preenchido', descricao: 'Conforme roteiro CETESB', obrigatorio: true },
      { nome: 'Anexos comprobatórios', descricao: 'Laudos, MTRs, faturas', obrigatorio: true },
      { nome: 'Inventário de emissões', descricao: 'Quando aplicável', obrigatorio: true },
      { nome: 'Plano de Gerenciamento de Resíduos', descricao: 'Resultado do ano base', obrigatorio: true },
    ],
    prazos: {
      analise: 'Análise posterior; prazo de entrega até 31 de março',
      validade: 'Anual',
    },
    custos: [
      { descricao: 'Consultoria para compilação', valorMin: 3000, valorMax: 25000, unidade: 'R$' },
      { descricao: 'Software de gestão ambiental', valorMin: 1500, valorMax: 8000, unidade: 'R$/mês' },
    ],
    fundamentacaoLegal: [
      'Lei 6.938/1981',
      'Lei 10.165/2000',
      'Decreto Estadual 8.468/1976',
      'Resoluções SMA 75/2009 e atualizações',
    ],
    urlOficial: 'https://cetesb.sp.gov.br/rapp/',
    tags: ['rapp', 'relatorio', 'anual', 'indicadores'],
    exemplosAplicacao: [
      'Indústria de médio porte com LO',
      'Posto de combustível',
      'Centro de tratamento de efluentes',
    ],
  },
]

export const METADADOS: {
  orgao: Orgao
  resumo: string
  totalLicencas: number
  urlOficial: string
  itens: string[]
  tags: string[]
}[] = [
  {
    orgao: 'ANVISA',
    resumo:
      'Agência Nacional de Vigilância Sanitária. Regulariza produtos e empresas que atuam com alimentos, cosméticos, saneantes, medicamentos, dispositivos médicos, entre outros.',
    totalLicencas: LICENCAS.filter(l => l.orgao === 'ANVISA').length,
    urlOficial: 'https://www.gov.br/anvisa',
    itens: [
      'Autorização de Funcionamento de Empresa (AFE)',
      'Certificado de Boas Práticas de Fabricação (CBPF)',
      'Registros de produtos (alimentos, cosméticos, medicamentos, saneantes, correlatos)',
      'Cadastro de produtos de baixo risco',
    ],
    tags: ['vigilancia-sanitaria', 'afe', 'registro', 'saude'],
  },
  {
    orgao: 'CETESB',
    resumo:
      'Companhia Ambiental do Estado de São Paulo. Responsável pelo licenciamento ambiental de empreendimentos e atividades potencialmente poluidoras no estado de São Paulo, em interação com o IBAMA para assuntos federais.',
    totalLicencas: LICENCAS.filter(l => l.orgao === 'CETESB').length,
    urlOficial: 'https://cetesb.sp.gov.br/',
    itens: [
      'Licença Prévia (LP)',
      'Licença de Instalação (LI)',
      'Licença de Operação (LO)',
      'Autorização Ambiental (AA)',
      'Outorga de uso de água (DAEE)',
      'Plano de Gerenciamento de Resíduos Sólidos (PGRS)',
      'RAPP - Relatório Anual de Atividades Potencialmente Poluidoras',
    ],
    tags: ['licenciamento-ambiental', 'estado-sp', 'cetesb'],
  },
  {
    orgao: 'MUNICIPAL',
    resumo:
      'Alvarás emitidos pela Prefeitura da cidade onde a empresa atua. Inclui o Alvará de Funcionamento (Localização + Operação), o Alvará Sanitário (Vigilância Sanitária municipal) e o Habite-se para construção, ampliação ou reforma.',
    totalLicencas: 3,
    urlOficial: '',
    itens: [
      'Alvará de Funcionamento (Localização + Operação)',
      'Alvará Sanitário da Vigilância Sanitária municipal',
      'Habite-se / Carta de Habitação (após obra aprovada)',
      'Inspeções da Secretaria de Urbanismo, Saúde e Meio Ambiente',
      'Cadastro Mobiliário (CCM) e ISS',
    ],
    tags: ['municipal', 'alvara', 'prefeitura', 'iss', 'ccm', 'habite-se'],
  },
  {
    orgao: 'BOMBEIROS',
    resumo:
      'Corpo de Bombeiros Militar de cada estado. Emite o AVCB (alto/médio risco) ou CLCB (baixo risco), atestando que a edificação possui condições de segurança contra incêndio e pânico. Pré-requisito para o Alvará de Funcionamento.',
    totalLicencas: 2,
    urlOficial: 'https://www.corpodebombeiros.sp.gov.br',
    itens: [
      'AVCB - Auto de Vistoria do Corpo de Bombeiros',
      'CLCB - Certificado de Licença do Corpo de Bombeiros',
      'Brigada de incêndio (NBR 14276)',
      'Sinalização de emergência (NBR 16820)',
      'Plano de emergência e rota de fuga',
    ],
    tags: ['bombeiros', 'avcb', 'clcb', 'incendio', 'pci'],
  },
]
