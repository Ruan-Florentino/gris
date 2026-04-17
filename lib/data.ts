export type ResourceCategory = 
  | 'METAIS_PRECIOSOS' 
  | 'METAIS_BASE' 
  | 'MINERAIS_CRITICOS' 
  | 'COMBUSTIVEIS_FOSSEIS' 
  | 'ENERGIA_NUCLEAR'
  | 'DADOS_GEOFISICOS'
  | 'INTELIGENCIA_MINERAL'
  | 'POTENCIAL_EXPLORACAO';

export type ResourceType = 
  | 'oil_field' | 'gas_basin' | 'pre_salt' | 'offshore_basin' | 'coal_mine' | 'uranium_mine'
  | 'gold_deposit' | 'lithium_triangle' | 'rare_earth' | 'copper_belt' | 'iron_formation'
  | 'cobalt_mine' | 'nickel_deposit' | 'platinum_reserve' | 'diamond_mine' | 'bauxite_mine'
  | 'silver_mine' | 'palladium_reserve' | 'zinc_deposit' | 'titanium_mine' | 'graphite_deposit'
  | 'tungsten_mine' | 'manganese_deposit' | 'tin_mine' | 'lead_deposit' | 'chromium_mine'
  | 'molybdenum_mine' | 'vanadium_deposit'
  | 'sedimentary_basin' | 'seismic_zone'
  | 'fault_line' | 'tectonic_plate';

export interface ResourceData {
  id: string;
  name: string;
  category: ResourceCategory;
  type: ResourceType;
  lat: number;
  lng: number;
  country: string;
  region: string;
  basin?: string;
  estimatedSize: string;
  depth: string;
  probability: number;
  confidence: number;
  source: string;
  classification: 'PUBLIC' | 'CONFIDENTIAL' | 'RESTRICTED' | 'PRO_ONLY';
  threatLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  operator?: string;
  grade?: string;
  reserveType?: 'PROVEN' | 'PROBABLE' | 'INFERRED';
  lastUpdate?: string;
  description?: string;
}

export const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  METAIS_PRECIOSOS: 'Metais Preciosos',
  METAIS_BASE: 'Metais de Base',
  MINERAIS_CRITICOS: 'Minerais Críticos & REE',
  COMBUSTIVEIS_FOSSEIS: 'Combustíveis Fósseis',
  ENERGIA_NUCLEAR: 'Energia Nuclear',
  DADOS_GEOFISICOS: 'Dados Geofísicos',
  INTELIGENCIA_MINERAL: 'Inteligência Mineral',
  POTENCIAL_EXPLORACAO: 'Potencial de Exploração'
};

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  oil_field: '#FF9500',
  gas_basin: '#5AC8FA',
  pre_salt: '#FF9500',
  offshore_basin: '#FF9500',
  coal_mine: '#8E8E93',
  uranium_mine: '#34C759',
  gold_deposit: '#FFD700', // Ouro
  lithium_triangle: '#FF2D55', // Lítio
  rare_earth: '#AF52DE',
  copper_belt: '#FF4500', // Cobre
  iron_formation: '#FF6B00', // Ferro
  cobalt_mine: '#007AFF',
  nickel_deposit: '#8E8E93',
  platinum_reserve: '#E5E5EA',
  diamond_mine: '#5AC8FA',
  bauxite_mine: '#FF3B30',
  silver_mine: '#D1D1D6',
  palladium_reserve: '#C7C7CC',
  zinc_deposit: '#5AC8FA',
  titanium_mine: '#FFFFFF',
  graphite_deposit: '#1C1C1E',
  tungsten_mine: '#FF9500',
  manganese_deposit: '#AF52DE',
  tin_mine: '#8E8E93',
  lead_deposit: '#3A3A3C',
  chromium_mine: '#34C759',
  molybdenum_mine: '#007AFF',
  vanadium_deposit: '#FF2D55',
  sedimentary_basin: '#FF9500',
  seismic_zone: '#FF3B30',
  fault_line: '#FF3B30',
  tectonic_plate: '#8E8E93'
};

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  oil_field: 'Campo de Petróleo',
  gas_basin: 'Bacia de Gás',
  pre_salt: 'Camada Pré-Sal',
  offshore_basin: 'Bacia Offshore',
  coal_mine: 'Mina de Carvão',
  uranium_mine: 'Mina de Urânio',
  gold_deposit: 'Depósito de Ouro',
  lithium_triangle: 'Extração de Lítio',
  rare_earth: 'Elementos de Terras Raras',
  copper_belt: 'Cinturão de Cobre',
  iron_formation: 'Formação de Ferro',
  cobalt_mine: 'Mina de Cobalto',
  nickel_deposit: 'Depósito de Níquel',
  platinum_reserve: 'Reserva de Platina',
  diamond_mine: 'Mina de Diamante',
  bauxite_mine: 'Mina de Bauxita',
  silver_mine: 'Mina de Prata',
  palladium_reserve: 'Reserva de Paládio',
  zinc_deposit: 'Depósito de Zinco',
  titanium_mine: 'Mina de Titânio',
  graphite_deposit: 'Depósito de Grafite',
  tungsten_mine: 'Mina de Tungstênio',
  manganese_deposit: 'Depósito de Manganês',
  tin_mine: 'Mina de Estanho',
  lead_deposit: 'Depósito de Chumbo',
  chromium_mine: 'Mina de Cromo',
  molybdenum_mine: 'Mina de Molibdênio',
  vanadium_deposit: 'Depósito de Vanádio',
  sedimentary_basin: 'Bacia Sedimentar',
  seismic_zone: 'Zona de Atividade Sísmica',
  fault_line: 'Linha de Falha',
  tectonic_plate: 'Limite de Placa Tectônica'
};

// Dados Reais de Ativos Minerais e Energéticos (Global Decision Intelligence)
const realAssets: ResourceData[] = [
  // COMBUSTÍVEIS FÓSSEIS
  {
    id: 'RES-OIL-001', name: 'Ghawar Field', category: 'COMBUSTIVEIS_FOSSEIS', type: 'oil_field',
    lat: 25.45, lng: 49.60, country: 'Arábia Saudita', region: 'Oriente Médio', basin: 'Al-Ahsa',
    estimatedSize: '71.0 Bilhões BBL', depth: '1.950m', probability: 99, confidence: 98,
    source: 'OPEC / IEA', classification: 'PUBLIC', threatLevel: 'MODERATE',
    operator: 'Saudi Aramco', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'O maior campo de petróleo convencional do mundo. Responsável por mais da metade da produção acumulada da Arábia Saudita.'
  },
  {
    id: 'RES-OIL-002', name: 'Permian Basin', category: 'COMBUSTIVEIS_FOSSEIS', type: 'sedimentary_basin',
    lat: 31.85, lng: -102.36, country: 'EUA', region: 'Texas/Novo México', basin: 'Permian',
    estimatedSize: '46.0 Bilhões BBL', depth: '3.000m', probability: 98, confidence: 96,
    source: 'EIA', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Múltiplos (Exxon, Chevron, Pioneer)', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Maior bacia produtora de shale oil/gas (não-convencional) dos EUA, central para a independência energética americana.'
  },
  {
    id: 'RES-GAS-001', name: 'North Field / South Pars', category: 'COMBUSTIVEIS_FOSSEIS', type: 'gas_basin',
    lat: 26.65, lng: 51.05, country: 'Qatar/Irã', region: 'Golfo Pérsico', basin: 'Golfo Pérsico',
    estimatedSize: '1.800 Trilhões ft³', depth: '3.000m', probability: 99, confidence: 99,
    source: 'IEA', classification: 'PUBLIC', threatLevel: 'ELEVATED',
    operator: 'QatarEnergy / NIOC', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Maior campo de gás natural do mundo (offshore). Ponto de atrito geopolítico extremo e vital para o mercado de GNL.'
  },
  {
    id: 'RES-GAS-002', name: 'Urengoy Field', category: 'COMBUSTIVEIS_FOSSEIS', type: 'gas_basin',
    lat: 66.08, lng: 76.67, country: 'Rússia', region: 'Sibéria', basin: 'Sibéria Ocidental',
    estimatedSize: '388 Trilhões ft³', depth: '1.100m', probability: 99, confidence: 95,
    source: 'Gazprom', classification: 'RESTRICTED', threatLevel: 'CRITICAL',
    operator: 'Gazprom', reserveType: 'PROVEN', lastUpdate: '2023-Q4',
    description: 'Segundo maior campo de gás natural do mundo. Historicamente fundamental para o abastecimento europeu, agora focando rotas asiáticas.'
  },
  {
    id: 'RES-OIL-003', name: 'Campo de Tupi', category: 'COMBUSTIVEIS_FOSSEIS', type: 'pre_salt',
    lat: -24.00, lng: -43.00, country: 'Brasil', region: 'América do Sul', basin: 'Bacia de Santos',
    estimatedSize: '8.3 Bilhões BBL', depth: '5.000m', probability: 92, confidence: 95,
    source: 'ANP', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Petrobras', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Campo supergigante em águas ultra-profundas do pré-sal brasileiro. Maior produtor do Brasil.'
  },
  {
    id: 'RES-OIL-004', name: 'Campo de Búzios', category: 'COMBUSTIVEIS_FOSSEIS', type: 'pre_salt',
    lat: -23.82, lng: -42.80, country: 'Brasil', region: 'América do Sul', basin: 'Bacia de Santos',
    estimatedSize: '11.3 Bilhões BBL', depth: '5.500m', probability: 95, confidence: 92,
    source: 'Petrobras', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Petrobras/CNODC/CNOOC', reserveType: 'PROBABLE', lastUpdate: '2023-Q4',
    description: 'Maior campo em águas profundas do mundo em volume recuperável. Recebendo os novos navios-plataforma FPSO de mais alta capacidade.'
  },

  // MINERAIS CRÍTICOS - LÍTIO E TERRAS RARAS
  {
    id: 'RES-LIT-001', name: 'Salar de Atacama (SQM/Albemarle)', category: 'MINERAIS_CRITICOS', type: 'lithium_triangle',
    lat: -23.50, lng: -68.30, country: 'Chile', region: 'Atacama', basin: 'Salar de Atacama',
    estimatedSize: '9.3 Milhões MT', depth: 'Superfície', probability: 99, confidence: 99,
    source: 'Cochilco', classification: 'PUBLIC', threatLevel: 'MODERATE',
    operator: 'SQM / Albemarle', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Um dos maiores recursos e a fonte mais barata de lítio (salamoura) no mundo global. Risco de regulações nacionalistas.'
  },
  {
    id: 'RES-LIT-002', name: 'Mina Greenbushes', category: 'MINERAIS_CRITICOS', type: 'lithium_triangle',
    lat: -33.86, lng: 116.05, country: 'Austrália', region: 'Austrália Ocidental', basin: 'Yilgarn Craton',
    estimatedSize: '8.6 Milhões MT', depth: '350m', probability: 99, confidence: 99,
    source: 'Talison', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Talison Lithium (Tianqi/IGO/Albemarle)', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Maior e mais produtiva mina de lítio em rocha dura (espodumênio) global.'
  },
  {
    id: 'RES-LIT-003', name: 'Salar de Uyuni', category: 'MINERAIS_CRITICOS', type: 'lithium_triangle',
    lat: -20.13, lng: -67.62, country: 'Bolívia', region: 'América do Sul', basin: 'Altiplano',
    estimatedSize: '21.0 Milhões MT', depth: 'Superfície-100m', probability: 99, confidence: 95,
    source: 'USGS', classification: 'PUBLIC', threatLevel: 'ELEVATED',
    operator: 'YLB (Estatal Boliviana) / Consórcios Chineses', reserveType: 'PROBABLE', lastUpdate: '2023-Q4',
    description: 'O maior recurso contíguo de lítio do planeta. Fricção de viabilidade comercial pelas chuvas e impurezas (magnésio).'
  },
  {
    id: 'RES-REE-001', name: 'Bayan Obo Mine', category: 'MINERAIS_CRITICOS', type: 'rare_earth',
    lat: 41.78, lng: 109.97, country: 'China', region: 'Mongólia Interior', basin: 'Sino-Korean Craton',
    estimatedSize: '40.0 Milhões MT', depth: 'Superfície-400m', probability: 99, confidence: 98,
    source: 'Baogang', classification: 'RESTRICTED', threatLevel: 'CRITICAL',
    operator: 'Baotou Steel', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Maior mina de Terras Raras do mundo. Confere domínio quase monopolista à China sobre a cadeia de refinamento e extração de HREE/LREE.'
  },
  {
    id: 'RES-REE-002', name: 'Mountain Pass Mine', category: 'MINERAIS_CRITICOS', type: 'rare_earth',
    lat: 35.48, lng: -115.53, country: 'EUA', region: 'Califórnia', basin: 'Mojave',
    estimatedSize: '20.0 Milhões MT', depth: 'Superfície-200m', probability: 99, confidence: 98,
    source: 'MP Materials', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'MP Materials', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'A única extração significativa e processamento de Terras Raras da América do Norte. Ponto estratégico para fornecimento da defesa ocidental.'
  },
  {
    id: 'RES-REE-003', name: 'Mount Weld', category: 'MINERAIS_CRITICOS', type: 'rare_earth',
    lat: -28.78, lng: 122.56, country: 'Austrália', region: 'Austrália Ocidental', basin: 'Yilgarn Craton',
    estimatedSize: '3.0 Milhões MT', depth: 'Central Carbonatite', probability: 98, confidence: 99,
    source: 'Lynas', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Lynas Rare Earths', reserveType: 'PROVEN', lastUpdate: '2023-Q4',
    description: 'Um dos depósitos contendo terras raras de mais alto teor do mundo e pilar estratégico fora do controle chinês.'
  },

  // METAIS DE BASE & COBALTO
  {
    id: 'RES-COP-001', name: 'Mina Escondida', category: 'METAIS_BASE', type: 'copper_belt',
    lat: -24.27, lng: -69.07, country: 'Chile', region: 'Antofagasta', basin: 'Complexo Pórfiro',
    estimatedSize: '32.0 Milhões MT (Contido)', depth: 'Superfície (Pit) até 1.000m+', probability: 100, confidence: 100,
    source: 'BHP', classification: 'PUBLIC', threatLevel: 'MODERATE',
    operator: 'BHP, Rio Tinto, JECO', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Maior mina de cobre (produção mundial). Fortemente exposta a questões de dessalinização de água e sindicatos.'
  },
  {
    id: 'RES-COP-002', name: 'Grasberg Block Cave', category: 'METAIS_PRECIOSOS', type: 'copper_belt',
    lat: -4.05, lng: 137.11, country: 'Indonésia', region: 'Papua', basin: 'Sudirman Range',
    estimatedSize: '30 Milhões Oz Au / 30 Bi lbs Cu', depth: 'Subterrânea-1200m', probability: 100, confidence: 99,
    source: 'Freeport-McMoRan', classification: 'PUBLIC', threatLevel: 'ELEVATED',
    operator: 'PT Freeport Indonesia', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Uma das maiores minas de cobre e a maior ou segunda maior mina de ouro combinadas do mundo. Transição massiva para block-caving.'
  },
  {
    id: 'RES-COB-001', name: 'Tenke Fungurume', category: 'MINERAIS_CRITICOS', type: 'cobalt_mine',
    lat: -10.55, lng: 26.21, country: 'RD Congo', region: 'Lualaba', basin: 'Katanga Copperbelt',
    estimatedSize: '5.0 Milhões MT', depth: 'Superfície-300m', probability: 99, confidence: 95,
    source: 'CMOC', classification: 'RESTRICTED', threatLevel: 'CRITICAL',
    operator: 'CMOC Group Limited', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Mina de cobre gigante e um dos maiores produtores isolados de cobalto do mundo. Fricções de royalties com o governo e tensões de controle chinês.'
  },
  {
    id: 'RES-IRO-001', name: 'Minas de Carajás (S11D)', category: 'METAIS_BASE', type: 'iron_formation',
    lat: -6.40, lng: -50.36, country: 'Brasil', region: 'Pará', basin: 'Bacia Amazônica',
    estimatedSize: '7.2 Bilhões MT', depth: 'Superfície', probability: 100, confidence: 100,
    source: 'Vale', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Vale S.A.', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'O maior complexo de minério de ferro de alto teor e alta pureza do mundo, vital para produção sustentável (Direct Reduction Iron) no mundo.'
  },
  {
    id: 'RES-IRO-002', name: 'Simandou', category: 'METAIS_BASE', type: 'iron_formation',
    lat: -8.84, lng: -8.87, country: 'Guiné', region: 'Nzérékoré', basin: 'Simandou Range',
    estimatedSize: '2.4 Bilhões MT', depth: 'Superfície', probability: 98, confidence: 90,
    source: 'Rio Tinto/WCS', classification: 'RESTRICTED', threatLevel: 'CRITICAL',
    operator: 'Rio Tinto / Winning Consortium / Simfer', reserveType: 'PROBABLE', lastUpdate: '2024-Q1',
    description: 'A maior e mais rica reserva de ferro inexplorada do mundo. Requer a construção massiva de ferrovia trans-guineana de 600km. Altera o mercado da China e Austrália.'
  },
  {
    id: 'RES-NIC-001', name: 'Bacia de Sudbury', category: 'METAIS_BASE', type: 'nickel_deposit',
    lat: 46.49, lng: -81.01, country: 'Canadá', region: 'Ontário', basin: 'Estrutura de Sudbury',
    estimatedSize: '8.0 Milhões MT', depth: '1.500m', probability: 100, confidence: 99,
    source: 'NRC', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Vale / Glencore', reserveType: 'PROVEN', lastUpdate: '2023-Q4',
    description: 'Importante depósito polimetálico de níquel-cobre (Classe 1, bateria) formado por impacto de meteorito antigo. Operação estável e norte-americana.'
  },
  {
    id: 'RES-NIC-002', name: 'Polar Division (Norilsk)', category: 'METAIS_BASE', type: 'nickel_deposit',
    lat: 69.34, lng: 88.21, country: 'Rússia', region: 'Krasnoyarsk Krai', basin: 'Taimyr',
    estimatedSize: 'Grande Escala Mista', depth: 'Superfície-Subterrânea', probability: 100, confidence: 98,
    source: 'Nornickel', classification: 'CONFIDENTIAL', threatLevel: 'CRITICAL',
    operator: 'Nornickel', reserveType: 'PROVEN', lastUpdate: '2023-Q4',
    description: 'Responsável pela maior extração combinada de Níquel e Paládio do mundo. Riscos de sanções financeiras e dependência russa formam uma alta vulnerabilidade do mercado.'
  },

  // METAIS PRECIOSOS E ESTRATÉGICOS
  {
    id: 'RES-GLD-001', name: 'Muruntau Gold Mine', category: 'METAIS_PRECIOSOS', type: 'gold_deposit',
    lat: 41.50, lng: 64.60, country: 'Uzbequistão', region: 'Kyzylkum', basin: 'Deserto de Kyzylkum',
    estimatedSize: '150.0 Milhões Oz', depth: '600m open pit', probability: 99, confidence: 97,
    source: 'NMMC', classification: 'CONFIDENTIAL', threatLevel: 'LOW',
    operator: 'Navoi Mining and Metallurgical Company', reserveType: 'PROVEN', lastUpdate: '2023-Q4',
    description: 'A maior mina de ouro open-pit contígua do planeta. Propriedade estatal e uma das minas de custo mais baixo da indústria.'
  },
  {
    id: 'RES-GLD-002', name: 'Super Pit (Fimiston)', category: 'METAIS_PRECIOSOS', type: 'gold_deposit',
    lat: -30.77, lng: 121.50, country: 'Austrália', region: 'Kalgoorlie', basin: 'Golden Mile',
    estimatedSize: '20 Milhões Oz+', depth: '600m', probability: 99, confidence: 99,
    source: 'KCGM', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Northern Star Resources', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Uma das operações a céu aberto mais icônicas da Austrália, processamento massivo e expansões subterrâneas atuais.'
  },
  {
    id: 'RES-PGM-001', name: 'Complexo de Bushveld', category: 'METAIS_PRECIOSOS', type: 'platinum_reserve',
    lat: -24.75, lng: 29.81, country: 'África do Sul', region: 'Rustemburgo', basin: 'Bacia de Transvaal',
    estimatedSize: '75% das Reservas Globais', depth: '1.000-2.500m', probability: 100, confidence: 99,
    source: 'Impala/Amplats', classification: 'CONFIDENTIAL', threatLevel: 'ELEVATED',
    operator: 'Múltiplos (Amplats, Implats, Sibanye)', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Contém as maiores reservas mundiais de metais do grupo da platina (PGMs). Muito vulnerável a cortes de energia contínuos (Eskom) e atrito trabalhista.'
  },

  // ENERGIA NUCLEAR
  {
    id: 'RES-URA-001', name: 'Cigar Lake / McArthur River', category: 'ENERGIA_NUCLEAR', type: 'uranium_mine',
    lat: 58.06, lng: -104.53, country: 'Canadá', region: 'Saskatchewan', basin: 'Bacia de Athabasca',
    estimatedSize: '200+ Milhões lbs U3O8', depth: '400m-600m', probability: 100, confidence: 99,
    source: 'Cameco', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'Cameco Corporation', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Minas de urânio de mais alto teor do globo (chegando a 15-20%). Estratégico para reatores de nova geração ocidentais. Requer mitigação contínua de água congelada nas minas.'
  },
  {
    id: 'RES-URA-002', name: 'Olympic Dam', category: 'ENERGIA_NUCLEAR', type: 'uranium_mine',
    lat: -30.43, lng: 136.88, country: 'Austrália', region: 'Austrália Meridional', basin: 'Gawler Craton',
    estimatedSize: 'Maior do Mundo (Contido)', depth: '500m Subterrânea', probability: 100, confidence: 100,
    source: 'BHP', classification: 'PUBLIC', threatLevel: 'LOW',
    operator: 'BHP', reserveType: 'PROVEN', lastUpdate: '2023-Q4',
    description: 'Polimetálico gigantesco: Maior recurso único de urânio do mundo e o quarto de cobre, tudo na mesma jazida.'
  },

  // HOTSPOTS GEOPOLÍTICOS ESPECÍFICOS & DISPUTAS (PRO_ONLY FOCUS)
  {
    id: 'RES-LIT-004', name: 'Jadar Project', category: 'MINERAIS_CRITICOS', type: 'lithium_triangle',
    lat: 44.55, lng: 19.30, country: 'Sérvia', region: 'Loznica', basin: 'Vale do Jadar',
    estimatedSize: '1.2 Milhão MT (Jadarita)', depth: 'Subterrânea', probability: 95, confidence: 90,
    source: 'Rio Tinto', classification: 'PRO_ONLY', threatLevel: 'CRITICAL',
    operator: 'Rio Tinto', reserveType: 'PROBABLE', lastUpdate: '2024-Q1',
    description: 'Projeto de lítio de classe mundial travado politicamente por ativistas. Representa a diferença chave na cadeia autônoma de VEs (Veículos Elétricos) na Europa.'
  },
  {
    id: 'RES-COP-003', name: 'Reko Diq', category: 'METAIS_BASE', type: 'copper_belt',
    lat: 29.13, lng: 61.64, country: 'Paquistão', region: 'Baluchistão', basin: 'Cinturão de Tethyan',
    estimatedSize: '54 Bi lbs Cu / 42 Mi Oz Au', depth: 'Superfície (Pit Futuro)', probability: 92, confidence: 85,
    source: 'Barrick Gold', classification: 'PRO_ONLY', threatLevel: 'CRITICAL',
    operator: 'Barrick Gold / Estado', reserveType: 'PROBABLE', lastUpdate: '2024-Q1',
    description: 'Reserva enorme inexplorada perto das fronteiras de afegãos e iranianos. História legal turbulenta. Retomado após uma década no tribunal arbitral global.'
  },
  {
    id: 'RES-COP-004', name: 'Oyu Tolgoi', category: 'METAIS_BASE', type: 'copper_belt',
    lat: 43.01, lng: 106.14, country: 'Mongólia', region: 'Gobi do Sul', basin: 'Complexo Pórfiro',
    estimatedSize: 'Tornar-se-á Top 4 Global', depth: 'Subterrânea c/ Block Caving', probability: 98, confidence: 95,
    source: 'Rio Tinto', classification: 'RESTRICTED', threatLevel: 'ELEVATED',
    operator: 'Rio Tinto / Governo da Mongólia', reserveType: 'PROVEN', lastUpdate: '2024-Q1',
    description: 'Depende pesadamente de relações logísticas logísticas vitais entre a Rússia e a China. Engenharia de ponta que puxa todo o PIB do país.'
  }
];

export const resourcesData: ResourceData[] = realAssets;

export interface RiskZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // em metros
  riskLevel: 'CRITICAL' | 'ELEVATED' | 'MODERATE';
  description: string;
}

export interface ExportRoute {
  id: string;
  name: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  type: 'MARITIME' | 'RAIL' | 'PIPELINE';
  status: 'ACTIVE' | 'DISRUPTED' | 'MONITORED';
}

export const riskZones: RiskZone[] = [
  { id: 'RZ-1', name: 'Zona de Disputa Ártica', lat: 80, lng: 0, radius: 1000000, riskLevel: 'CRITICAL', description: 'Alta atividade militar e reivindicações territoriais sobrepostas.' },
  { id: 'RZ-2', name: 'Tensão no Triângulo do Lítio', lat: -23, lng: -67, radius: 500000, riskLevel: 'ELEVATED', description: 'Nacionalismo de recursos e volatilidade na cadeia de suprimentos.' },
  { id: 'RZ-3', name: 'Corredor do Mar da China Meridional', lat: 15, lng: 115, radius: 800000, riskLevel: 'CRITICAL', description: 'Rota marítima estratégica com alta fricção geopolítica.' },
  { id: 'RZ-4', name: 'Segurança na Bacia do Congo', lat: -2, lng: 23, radius: 600000, riskLevel: 'ELEVATED', description: 'Instabilidade local afetando a extração de minerais críticos.' },
  { id: 'RZ-5', name: 'Hub de Energia do Oriente Médio', lat: 26, lng: 50, radius: 700000, riskLevel: 'MODERATE', description: 'Estável, mas alvo de alto valor para ameaças cibernéticas e cinéticas.' },
];

export const exportRoutes: ExportRoute[] = [
  { id: 'ER-1', name: 'Corredor de Lítio do Pacífico', startLat: -23, startLng: -70, endLat: 31, endLng: 121, type: 'MARITIME', status: 'ACTIVE' },
  { id: 'ER-2', name: 'Gasoduto Nórdico', startLat: 70, startLng: 20, endLat: 53, endLng: 7, type: 'PIPELINE', status: 'MONITORED' },
  { id: 'ER-3', name: 'Link Ferroviário Eurasiano', startLat: 51, startLng: 71, endLat: 52, endLng: 13, type: 'RAIL', status: 'ACTIVE' },
  { id: 'ER-4', name: 'Trânsito no Estreito de Ormuz', startLat: 26, startLng: 50, endLat: 15, endLng: 65, type: 'MARITIME', status: 'DISRUPTED' },
  { id: 'ER-5', name: 'Rota do Cobre Africano', startLat: -10, startLng: 25, endLat: -29, endLng: 31, type: 'RAIL', status: 'ACTIVE' },
];

