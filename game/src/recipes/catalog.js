export const RECIPE_BASES = [
  { id: 'noodles', label: 'NOODLES', price: 34, color: '#EAB308' },
  { id: 'dumplings', label: 'DUMPLINGS', price: 38, color: '#FDE68A' },
  { id: 'duck', label: 'PEKING DUCK', price: 74, color: '#B45309' },
  { id: 'prawn', label: 'CHILI PRAWN', price: 46, color: '#FB7185' },
];

export const HERO_RECIPES = {
  char_kway_teow: {
    id: 'char_kway_teow',
    title: 'CHAR KWAY TEOW',
    price: 34,
    base: 'noodles',
    station: 'Wok Sear',
    nextIng: 'Noodles',
    stepLabel: 'Wok Sear: Noodles',
    vip: false,
  },
  xiaolongbao: {
    id: 'xiaolongbao',
    title: 'XIAOLONGBAO',
    price: 38,
    base: 'dumplings',
    station: 'Bamboo Steam',
    nextIng: 'Dumplings',
    stepLabel: 'Steam: Dumplings',
    vip: false,
  },
  vip_peking_duck: {
    id: 'vip_peking_duck',
    title: 'VIP PEKING DUCK',
    price: 74,
    base: 'duck',
    station: 'Island Carve',
    nextIng: 'Duck',
    stepLabel: 'Carve 2/3 -> Glaze',
    vip: true,
  },
  chili_prawn: {
    id: 'chili_prawn',
    title: 'CHILI PRAWN',
    price: 46,
    base: 'prawn',
    station: 'Wok Sear',
    nextIng: 'Prawn',
    stepLabel: 'Next: Prawn (0:04)',
    vip: false,
  },
};

export const SAUCES = [
  { id: 'plum', label: 'PLUM', color: '#881337', accent: '#E11D48' },
  { id: 'chili', label: 'CHILI', color: '#B91C1C', accent: '#EF4444' },
  { id: 'scallion', label: 'SCALLION', color: '#15803D', accent: '#4ADE80' },
  { id: 'sesame', label: 'SESAME', color: '#D97706', accent: '#FBBF24' },
];
