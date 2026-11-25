export const RECIPE_PATHS = [
  { id: 'wok_sear', label: 'Wok Sear', tag: 'WOK' },
  { id: 'bamboo_steam', label: 'Bamboo Steam', tag: 'STEAM' },
  { id: 'island_carve', label: 'Island Carve', tag: 'CARVE' },
];

export const TWELVE_COMBINATIONS = [
  { id: 'char_kway_teow', base: 'Noodles', path: 'Wok Sear', sauce: 'Chili Crisp', title: 'Char Kway Teow', price: 34 },
  { id: 'scallion_lo_mein', base: 'Noodles', path: 'Bamboo Steam', sauce: 'Scallion & Lime', title: 'Scallion Oil Noodles', price: 32 },
  { id: 'dan_dan_silk', base: 'Noodles', path: 'Island Carve', sauce: 'Sesame Chili', title: 'Sesame Dan Dan', price: 36 },
  { id: 'crispy_gyoza', base: 'Dumplings', path: 'Wok Sear', sauce: 'Chili Crisp', title: 'Potsticker Sear', price: 40 },
  { id: 'xiaolongbao', base: 'Dumplings', path: 'Bamboo Steam', sauce: 'Black Vinegar', title: 'Xiaolongbao', price: 38 },
  { id: 'emerald_won_ton', base: 'Dumplings', path: 'Island Carve', sauce: 'Scallion & Lime', title: 'Jade Wonton Platter', price: 42 },
  { id: 'wok_duck_fried', base: 'Duck', path: 'Wok Sear', sauce: 'Plum Glaze', title: 'Wok-Tossed Duck Rice', price: 62 },
  { id: 'tea_smoked_duck', base: 'Duck', path: 'Bamboo Steam', sauce: 'Sesame Chili', title: 'Tea-Steamed Duck', price: 68 },
  { id: 'vip_peking_duck', base: 'Duck', path: 'Island Carve', sauce: 'Plum Glaze', title: 'VIP Peking Duck', price: 74 },
  { id: 'chili_prawn', base: 'Prawn', path: 'Wok Sear', sauce: 'Chili Crisp', title: 'Chili Tiger Prawn', price: 46 },
  { id: 'garlic_steam_prawn', base: 'Prawn', path: 'Bamboo Steam', sauce: 'Scallion & Lime', title: 'Garlic Steamed Prawn', price: 44 },
  { id: 'drunken_prawn', base: 'Prawn', path: 'Island Carve', sauce: 'Black Vinegar', title: 'Lantern Prawn Trio', price: 50 },
];

export function getCombinationById(recipeId) {
  return TWELVE_COMBINATIONS.find((c) => c.id === recipeId) || TWELVE_COMBINATIONS[0];
}

export function buildRecipeSteps(recipeId) {
  const item = getCombinationById(recipeId);
  return [
    `1. Larder: ${item.base}`,
    `2. Butcher Prep: ${item.base}`,
    `3. Station: ${item.path}`,
    `4. Finish: ${item.sauce}`,
  ];
}

export function validateGarnishPairing(recipeId, sauceLabel) {
  const item = getCombinationById(recipeId);
  const norm = String(sauceLabel || '').toLowerCase();
  return item.sauce.toLowerCase().includes(norm);
}

export function computeComboPayout(recipeId, heatCombo = 1, silkPass = false) {
  const item = getCombinationById(recipeId);
  const wokBonus = Math.min(24, Math.max(0, (heatCombo - 1) * 3));
  const tip = silkPass ? Math.round(item.price * 0.2) : Math.round(item.price * 0.12);
  return { base: item.price, wokBonus, tip, total: item.price + wokBonus + tip };
}
