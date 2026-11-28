var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/src/constants.ts
function starterUnitCount(category) {
  const list = STARTER_PACK[category];
  return (list ?? []).reduce((sum, item) => sum + item.quantity, 0);
}
var EQUIPMENT_CATEGORIES, STARTER_PACK, STARTER_ECONOMY, FACTORY_COUNT_IN_STARTER, MINE_COUNT_IN_STARTER, DERIVED_FACTORY_INCOME_PER_UNIT, DERIVED_MINE_INCOME_PER_UNIT, FLAG_CHOICES, RELATION_STATUSES, RELATION_LABELS_FA, ROLES, RESOURCES, RESOURCE_KEYS, REFINED_PRODUCTS, REFINERY_RECIPES, TRADE_PARTNERS, IMPORT_SHIPPING_FEE, CONTRACT_TERM_DAYS, CONTRACT_TYPES, BUDGET_POTS, BUILDINGS, BUILDING_UPGRADE_COST_FACTOR, BUILDING_MAX_LEVEL, MAX_CONCURRENT_PROJECTS, BUILDING_KEYS, BANK_LOAN, TRANSACTION_TYPE_LABELS_FA, WAR_STATUS_LABELS_FA, DIPLOMACY_REQUEST_KINDS, STATEMENT_STATUS_LABELS_FA, RANKING_METRICS, DEFAULT_RANKING_WEIGHTS, DEFAULT_BATTLE_PARAMS, DEFAULT_PROFILE_RULES, DEFAULT_DIPLOMACY_RULES, DEFAULT_ECONOMY_RULES, FEATURE_FLAGS, GAME_SETTING_KEYS, DEFAULT_BRANDING, DEFAULT_QUOTA_GUARD, ROUTES, PLAYER_PAGES, PLAYER_PAGE_META, ADMIN_SECTIONS, MAX_STATEMENT_CHARS, MIN_STATEMENT_CHARS, DEFENSE_ARRANGEMENT, DEFENSE_ARRANGEMENT_KEYS, DEFENSE_FORTIFICATION_TOKEN, DAILY_PRIZES;
var init_constants = __esm({
  "shared/src/constants.ts"() {
    "use strict";
    EQUIPMENT_CATEGORIES = [
      { key: "tanks", labelFa: "\u062A\u0627\u0646\u06A9\u200C\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u062A\u0627\u0646\u06A9", emoji: "\u{1FA96}", role: "offense" },
      { key: "ground_air_defense", labelFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u0632\u0645\u06CC\u0646\u06CC", shopLabelFa: "\u062E\u0631\u06CC\u062F \u067E\u062F\u0627\u0641\u0646\u062F \u0632\u0645\u06CC\u0646\u06CC", emoji: "\u{1F6E1}\uFE0F", role: "defense" },
      { key: "air_air_defense", labelFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC", shopLabelFa: "\u062E\u0631\u06CC\u062F \u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC", emoji: "\u{1F6E1}\uFE0F", role: "defense" },
      { key: "naval_air_defense", labelFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u062F\u0631\u06CC\u0627\u06CC\u06CC", shopLabelFa: "\u062E\u0631\u06CC\u062F \u067E\u062F\u0627\u0641\u0646\u062F \u062F\u0631\u06CC\u0627\u06CC\u06CC", emoji: "\u2693", role: "defense" },
      { key: "factories", labelFa: "\u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u06A9\u0627\u0631\u062E\u0627\u0646\u0647", emoji: "\u{1F3ED}", role: "economy" },
      { key: "mines", labelFa: "\u0645\u0639\u0627\u062F\u0646", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0645\u0639\u062F\u0646", emoji: "\u26CF\uFE0F", role: "economy" },
      { key: "apc", labelFa: "\u0646\u0641\u0631\u0628\u0631\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0646\u0641\u0631\u0628\u0631", emoji: "\u{1F69B}", role: "offense" },
      { key: "rockets", labelFa: "\u0631\u0627\u06A9\u062A\u200C\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0631\u0627\u06A9\u062A", emoji: "\u{1F680}", role: "offense" },
      { key: "helicopters", labelFa: "\u0647\u0644\u06CC\u06A9\u0648\u067E\u062A\u0631\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0647\u0644\u06CC\u06A9\u0648\u067E\u062A\u0631", emoji: "\u{1F681}", role: "offense" },
      { key: "radars", labelFa: "\u0631\u0627\u062F\u0627\u0631\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0631\u0627\u062F\u0627\u0631", emoji: "\u{1F4E1}", role: "support" },
      { key: "submarines", labelFa: "\u0632\u06CC\u0631\u062F\u0631\u06CC\u0627\u06CC\u06CC\u200C\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0632\u06CC\u0631\u062F\u0631\u06CC\u0627\u06CC\u06CC", emoji: "\u{1F30A}", role: "offense" },
      { key: "drones", labelFa: "\u067E\u0647\u067E\u0627\u062F\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u067E\u0647\u067E\u0627\u062F", emoji: "\u{1F6E9}\uFE0F", role: "offense" },
      { key: "soldiers", labelFa: "\u0633\u0631\u0628\u0627\u0632\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0633\u0631\u0628\u0627\u0632", emoji: "\u{1FA96}", role: "offense" },
      { key: "artillery", labelFa: "\u062A\u0648\u067E\u062E\u0627\u0646\u0647", shopLabelFa: "\u062E\u0631\u06CC\u062F \u062A\u0648\u067E\u062E\u0627\u0646\u0647", emoji: "\u{1F4A5}", role: "offense" },
      { key: "ships", labelFa: "\u0646\u0627\u0648\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0646\u0627\u0648", emoji: "\u{1F6A2}", role: "offense" },
      { key: "transport_aircraft", labelFa: "\u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0647\u0627\u06CC \u062A\u0631\u0627\u0628\u0631\u06CC", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u06CC \u062A\u0631\u0627\u0628\u0631\u06CC", emoji: "\u2708\uFE0F", role: "support" },
      { key: "fighters", labelFa: "\u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u062C\u0646\u06AF\u0646\u062F\u0647", emoji: "\u{1F6EB}", role: "offense" },
      { key: "missiles", labelFa: "\u0645\u0648\u0634\u06A9\u200C\u0647\u0627", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0645\u0648\u0634\u06A9", emoji: "\u{1F680}", role: "offense" },
      { key: "fuel", labelFa: "\u0633\u0648\u062E\u062A \u0646\u0638\u0627\u0645\u06CC", shopLabelFa: "\u062E\u0631\u06CC\u062F \u0633\u0648\u062E\u062A \u0646\u0638\u0627\u0645\u06CC", emoji: "\u26FD", role: "support" }
    ];
    STARTER_PACK = {
      tanks: [
        { code: "m1_abrams", nameFa: "M1 Abrams", quantity: 100, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0627\u0646\u06A9 \u0627\u0635\u0644\u06CC \u0645\u06CC\u062F\u0627\u0646 \u0646\u0628\u0631\u062F" },
        { code: "leopard_2a7", nameFa: "Leopard 2A7", quantity: 50, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0627\u0646\u06A9 \u0633\u0628\u06A9 \u0648 \u0686\u0627\u0628\u06A9" }
      ],
      ground_air_defense: [
        { code: "patriot", nameFa: "Patriot", quantity: 20, unitFa: "\u0648\u0627\u062D\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0633\u0627\u0645\u062A \u067E\u062F\u0627\u0641\u0646\u062F \u0632\u0645\u06CC\u0646\u06CC" },
        { code: "s400", nameFa: "S-400", quantity: 10, unitFa: "\u0648\u0627\u062D\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0633\u0627\u0645\u062A \u067E\u062F\u0627\u0641\u0646\u062F \u0632\u0645\u06CC\u0646\u06CC" }
      ],
      air_air_defense: [
        { code: "f35_ad", nameFa: "F-35", quantity: 5, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC (\u062B\u0628\u062A \u062C\u062F\u0627 \u0627\u0632 \u062F\u0633\u062A\u0647 \u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627)" },
        { code: "f22_ad", nameFa: "F-22", quantity: 3, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC (\u062B\u0628\u062A \u062C\u062F\u0627 \u0627\u0632 \u062F\u0633\u062A\u0647 \u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627)" }
      ],
      naval_air_defense: [
        { code: "aegis", nameFa: "Aegis", quantity: 5, unitFa: "\u0648\u0627\u062D\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0633\u0627\u0645\u062A \u067E\u062F\u0627\u0641\u0646\u062F \u062F\u0631\u06CC\u0627\u06CC\u06CC" },
        { code: "aster_30", nameFa: "Aster 30", quantity: 10, unitFa: "\u0648\u0627\u062D\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0633\u0627\u0645\u062A \u067E\u062F\u0627\u0641\u0646\u062F \u062F\u0631\u06CC\u0627\u06CC\u06CC" }
      ],
      factories: [
        { code: "steel_plant", nameFa: "\u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0641\u0648\u0644\u0627\u062F", quantity: 2, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0648\u0644\u06CC\u062F \u062F\u0631\u0622\u0645\u062F \u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0627\u06CC" },
        { code: "aircraft_plant", nameFa: "\u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0633\u0627\u0632\u06CC", quantity: 1, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0648\u0644\u06CC\u062F \u062F\u0631\u0622\u0645\u062F \u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0627\u06CC" }
      ],
      mines: [
        { code: "gold_mine", nameFa: "\u0645\u0639\u062F\u0646 \u0637\u0644\u0627", quantity: 2, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0648\u0644\u06CC\u062F \u062F\u0631\u0622\u0645\u062F \u0645\u0639\u062F\u0646\u06CC" },
        { code: "iron_mine", nameFa: "\u0645\u0639\u062F\u0646 \u0622\u0647\u0646", quantity: 3, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0648\u0644\u06CC\u062F \u062F\u0631\u0622\u0645\u062F \u0645\u0639\u062F\u0646\u06CC" }
      ],
      apc: [
        { code: "m113_apc", nameFa: "M113 APC", quantity: 100, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u0641\u0631\u0628\u0631 \u0632\u0631\u0647\u06CC" },
        { code: "stryker_icv", nameFa: "Stryker ICV", quantity: 50, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u0641\u0631\u0628\u0631 \u0632\u0631\u0647\u06CC" }
      ],
      rockets: [
        { code: "hydra_70", nameFa: "Hydra 70", quantity: 100, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0631\u0627\u06A9\u062A \u0647\u0648\u0627\u200C\u0628\u0647\u200C\u0632\u0645\u06CC\u0646" },
        { code: "s8_rocket", nameFa: "S-8 Rocket", quantity: 50, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0631\u0627\u06A9\u062A \u0647\u0648\u0627\u200C\u0628\u0647\u200C\u0632\u0645\u06CC\u0646" }
      ],
      helicopters: [
        { code: "ah64_apache", nameFa: "AH-64 Apache", quantity: 10, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0647\u0644\u06CC\u06A9\u0648\u067E\u062A\u0631 \u062A\u0647\u0627\u062C\u0645\u06CC" },
        { code: "mi28_havoc", nameFa: "Mi-28 Havoc", quantity: 5, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0647\u0644\u06CC\u06A9\u0648\u067E\u062A\u0631 \u062A\u0647\u0627\u062C\u0645\u06CC" }
      ],
      radars: [
        { code: "an_tpy2", nameFa: "AN/TPY-2", quantity: 5, unitFa: "\u062F\u0633\u062A\u06AF\u0627\u0647", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0631\u0627\u062F\u0627\u0631 \u0647\u0634\u062F\u0627\u0631 \u0632\u0648\u062F\u0647\u0646\u06AF\u0627\u0645" },
        { code: "an_spy6", nameFa: "AN/SPY-6", quantity: 3, unitFa: "\u062F\u0633\u062A\u06AF\u0627\u0647", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0631\u0627\u062F\u0627\u0631 \u0647\u0634\u062F\u0627\u0631 \u0632\u0648\u062F\u0647\u0646\u06AF\u0627\u0645" }
      ],
      submarines: [
        { code: "virginia_class", nameFa: "Virginia-class", quantity: 2, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0632\u06CC\u0631\u062F\u0631\u06CC\u0627\u06CC\u06CC" },
        { code: "kilo_class", nameFa: "Kilo-class", quantity: 3, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0632\u06CC\u0631\u062F\u0631\u06CC\u0627\u06CC\u06CC" }
      ],
      drones: [
        { code: "mq9_reaper", nameFa: "MQ-9 Reaper", quantity: 10, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u067E\u0647\u067E\u0627\u062F \u0631\u0632\u0645\u06CC" },
        { code: "bayraktar_tb2", nameFa: "Bayraktar TB2", quantity: 20, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u067E\u0647\u067E\u0627\u062F \u0631\u0632\u0645\u06CC" }
      ],
      soldiers: [
        { code: "infantry", nameFa: "\u0633\u0631\u0628\u0627\u0632 \u067E\u06CC\u0627\u062F\u0647", quantity: 1e4, unitFa: "\u0646\u0641\u0631", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u0633\u0627\u0646\u06CC \u067E\u0627\u06CC\u0647" },
        { code: "rangers", nameFa: "\u062A\u06A9\u0627\u0648\u0631", quantity: 2e3, unitFa: "\u0646\u0641\u0631", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u06CC\u0631\u0648\u06CC \u0648\u06CC\u0698\u0647 \u0631\u0632\u0645\u06CC" },
        { code: "special_forces", nameFa: "\u0646\u06CC\u0631\u0648\u06CC \u0648\u06CC\u0698\u0647", quantity: 500, unitFa: "\u0646\u0641\u0631", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u06CC\u0631\u0648\u06CC \u0648\u06CC\u0698\u0647" },
        { code: "snipers", nameFa: "\u062A\u06A9\u200C\u062A\u06CC\u0631\u0627\u0646\u062F\u0627\u0632", quantity: 300, unitFa: "\u0646\u0641\u0631", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u06A9\u200C\u062A\u06CC\u0631\u0627\u0646\u062F\u0627\u0632" }
      ],
      artillery: [
        { code: "pzh2000", nameFa: "PzH 2000", quantity: 10, unitFa: "\u062F\u0633\u062A\u06AF\u0627\u0647", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0648\u067E\u062E\u0627\u0646\u0647 \u062E\u0648\u062F\u06A9\u0634\u0634" },
        { code: "k9_thunder", nameFa: "K9 Thunder", quantity: 15, unitFa: "\u062F\u0633\u062A\u06AF\u0627\u0647", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062A\u0648\u067E\u062E\u0627\u0646\u0647 \u062E\u0648\u062F\u06A9\u0634\u0634" }
      ],
      ships: [
        { code: "gerald_r_ford", nameFa: "Gerald R. Ford", quantity: 1, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u0627\u0648 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0628\u0631" },
        { code: "nimitz", nameFa: "Nimitz", quantity: 1, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0646\u0627\u0648 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0628\u0631" }
      ],
      transport_aircraft: [
        { code: "c17_globemaster", nameFa: "C-17 Globemaster III", quantity: 5, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u06CC \u062A\u0631\u0627\u0628\u0631\u06CC \u0633\u0646\u06AF\u06CC\u0646" },
        { code: "c130j_super_hercules", nameFa: "C-130J Super Hercules", quantity: 10, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u06CC \u062A\u0631\u0627\u0628\u0631\u06CC \u062A\u0627\u06A9\u062A\u06CC\u06A9\u06CC" }
      ],
      fighters: [
        { code: "f22_raptor", nameFa: "F-22 Raptor", quantity: 5, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062C\u0646\u06AF\u0646\u062F\u0647 (\u062B\u0628\u062A \u062C\u062F\u0627 \u0627\u0632 \u062F\u0633\u062A\u0647 \u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC)" },
        { code: "f35_lightning2", nameFa: "F-35 Lightning II", quantity: 10, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062C\u0646\u06AF\u0646\u062F\u0647 (\u062B\u0628\u062A \u062C\u062F\u0627 \u0627\u0632 \u062F\u0633\u062A\u0647 \u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC)" },
        { code: "su57", nameFa: "Su-57", quantity: 5, unitFa: "\u0641\u0631\u0648\u0646\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u062C\u0646\u06AF\u0646\u062F\u0647" }
      ],
      missiles: [
        { code: "df41", nameFa: "DF-41", quantity: 5, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0645\u0648\u0634\u06A9 \u0628\u0627\u0644\u0633\u062A\u06CC\u06A9" },
        { code: "tomahawk", nameFa: "Tomahawk", quantity: 20, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0645\u0648\u0634\u06A9 \u06A9\u0631\u0648\u0632" },
        { code: "brahmos", nameFa: "BrahMos", quantity: 10, unitFa: "\u0639\u062F\u062F", price: null, attackPoints: null, defensePoints: null, descriptionFa: "\u0645\u0648\u0634\u06A9 \u06A9\u0631\u0648\u0632" }
      ]
    };
    STARTER_ECONOMY = {
      treasury: 1e6,
      factoryIncome: 5e4,
      mineIncome: 3e4,
      incomeCycleSeconds: 24 * 60 * 60
    };
    FACTORY_COUNT_IN_STARTER = starterUnitCount("factories");
    MINE_COUNT_IN_STARTER = starterUnitCount("mines");
    DERIVED_FACTORY_INCOME_PER_UNIT = FACTORY_COUNT_IN_STARTER > 0 ? Math.round(STARTER_ECONOMY.factoryIncome / FACTORY_COUNT_IN_STARTER) : 0;
    DERIVED_MINE_INCOME_PER_UNIT = MINE_COUNT_IN_STARTER > 0 ? Math.round(STARTER_ECONOMY.mineIncome / MINE_COUNT_IN_STARTER) : 0;
    FLAG_CHOICES = [
      "\u{1F3F3}\uFE0F",
      "\u{1F3F4}",
      "\u{1F7E6}\u{1F7E8}\u{1F7E5}",
      "\u{1F7E9}\u{1F7E8}\u{1F7E5}",
      "\u2B1B\u2B1C\u{1F7E5}",
      "\u{1F7E5}\u2B1C\u{1F7E6}",
      "\u{1F7E8}\u{1F7E9}",
      "\u{1F7E6}\u{1F7E5}",
      "\u{1F535}\u{1F7E1}",
      "\u{1F7E2}\u26AA\u{1F534}",
      "\u{1F7E3}\u{1F7E0}",
      "\u26AA\u{1F535}",
      "\u{1F319}\u2B50",
      "\u{1F985}",
      "\u{1F409}",
      "\u{1F6E1}\uFE0F"
    ];
    RELATION_STATUSES = ["neutral", "friend", "ally", "enemy", "negotiating", "peace_treaty"];
    RELATION_LABELS_FA = {
      neutral: "\u0628\u06CC\u200C\u0637\u0631\u0641",
      friend: "\u062F\u0648\u0633\u062A",
      ally: "\u0645\u062A\u062D\u062F",
      enemy: "\u062F\u0634\u0645\u0646",
      negotiating: "\u062F\u0631 \u062D\u0627\u0644 \u0645\u0630\u0627\u06A9\u0631\u0647",
      peace_treaty: "\u062F\u0627\u0631\u0627\u06CC \u067E\u06CC\u0645\u0627\u0646 \u0635\u0644\u062D"
    };
    ROLES = ["player", "admin", "super_admin"];
    RESOURCES = [
      { key: "oil", emoji: "\u{1F6E2}\uFE0F", nameFa: "\u0646\u0641\u062A", unitFa: "\u0628\u0634\u06A9\u0647", reserve: 5e5, stock: 5e5, market: 10, extractCost: 500, capacity: 5e3, wells: 5 },
      { key: "gas", emoji: "\u{1F525}", nameFa: "\u06AF\u0627\u0632 \u0637\u0628\u06CC\u0639\u06CC", unitFa: "\u0648\u0627\u062D\u062F", reserve: 8e5, stock: 8e5, market: 8, extractCost: 700, capacity: 8e3, wells: 6 },
      { key: "iron", emoji: "\u26CF\uFE0F", nameFa: "\u0622\u0647\u0646", unitFa: "\u062A\u0646", reserve: 3e5, stock: 3e5, market: 10, extractCost: 600, capacity: 6e3, wells: 4 },
      { key: "gold", emoji: "\u{1F947}", nameFa: "\u0637\u0644\u0627", unitFa: "\u0648\u0627\u062D\u062F", reserve: 5e4, stock: 5e4, market: 1e3, extractCost: 1500, capacity: 1e3, wells: 2 },
      { key: "uranium", emoji: "\u2622\uFE0F", nameFa: "\u0627\u0648\u0631\u0627\u0646\u06CC\u0648\u0645", unitFa: "\u0648\u0627\u062D\u062F", reserve: 2e3, stock: 2e3, market: 5e3, extractCost: 2500, capacity: 200, wells: 1 },
      { key: "diamond", emoji: "\u{1F48E}", nameFa: "\u0627\u0644\u0645\u0627\u0633", unitFa: "\u0648\u0627\u062D\u062F", reserve: 1e3, stock: 1e3, market: 5e3, extractCost: 3e3, capacity: 100, wells: 1 }
    ];
    RESOURCE_KEYS = RESOURCES.map((r) => r.key);
    REFINED_PRODUCTS = [
      { key: "fuel", emoji: "\u26FD", nameFa: "\u0633\u0648\u062E\u062A", unitFa: "\u0648\u0627\u062D\u062F" },
      { key: "steel", emoji: "\u2699\uFE0F", nameFa: "\u0641\u0648\u0644\u0627\u062F", unitFa: "\u0648\u0627\u062D\u062F" },
      { key: "energy", emoji: "\u26A1", nameFa: "\u0627\u0646\u0631\u0698\u06CC", unitFa: "\u0648\u0627\u062D\u062F" }
    ];
    REFINERY_RECIPES = [
      { key: "oil_to_fuel", emoji: "\u26FD", inputKey: "oil", inputQty: 1e3, outputKey: "fuel", outputQty: 800, cost: 300, minutes: 30 },
      { key: "iron_to_steel", emoji: "\u2699\uFE0F", inputKey: "iron", inputQty: 1e3, outputKey: "steel", outputQty: 800, cost: 300, minutes: 30 },
      { key: "gas_to_energy", emoji: "\u26A1", inputKey: "gas", inputQty: 1e3, outputKey: "energy", outputQty: 800, cost: 300, minutes: 30 }
    ];
    TRADE_PARTNERS = [
      { key: "russia", flag: "\u{1F1F7}\u{1F1FA}", nameFa: "\u0631\u0648\u0633\u06CC\u0647" },
      { key: "saudi", flag: "\u{1F1F8}\u{1F1E6}", nameFa: "\u0639\u0631\u0628\u0633\u062A\u0627\u0646" },
      { key: "iraq", flag: "\u{1F1EE}\u{1F1F6}", nameFa: "\u0639\u0631\u0627\u0642" },
      { key: "emirates", flag: "\u{1F1E6}\u{1F1EA}", nameFa: "\u0627\u0645\u0627\u0631\u0627\u062A" }
    ];
    IMPORT_SHIPPING_FEE = 2e3;
    CONTRACT_TERM_DAYS = 7;
    CONTRACT_TYPES = [
      { key: "oil", emoji: "\u{1F6E2}\uFE0F", nameFa: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0646\u0641\u062A\u06CC" },
      { key: "gas", emoji: "\u{1F525}", nameFa: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F \u06AF\u0627\u0632\u06CC" },
      { key: "mineral", emoji: "\u26CF\uFE0F", nameFa: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0645\u0648\u0627\u062F \u0645\u0639\u062F\u0646\u06CC" },
      { key: "supply", emoji: "\u{1F4E6}", nameFa: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F \u062A\u0623\u0645\u06CC\u0646 \u0645\u0646\u0627\u0628\u0639" }
    ];
    BUDGET_POTS = [
      { key: "military", emoji: "\u{1F6E1}\uFE0F", nameFa: "\u0628\u0648\u062F\u062C\u0647 \u0646\u0638\u0627\u0645\u06CC" },
      { key: "construction", emoji: "\u{1F3D7}\uFE0F", nameFa: "\u0628\u0648\u062F\u062C\u0647 \u0633\u0627\u062E\u062A\u200C\u0648\u0633\u0627\u0632" },
      { key: "industry", emoji: "\u{1F3ED}", nameFa: "\u0628\u0648\u062F\u062C\u0647 \u0635\u0646\u0627\u06CC\u0639" },
      { key: "public", emoji: "\u{1F4B5}", nameFa: "\u0628\u0648\u062F\u062C\u0647 \u0639\u0645\u0648\u0645\u06CC" }
    ];
    BUILDINGS = [
      { key: "barracks", emoji: "\u{1FA96}", nameFa: "\u067E\u0627\u062F\u06AF\u0627\u0646 \u0646\u0638\u0627\u0645\u06CC", descFa: "\u0622\u0645\u0648\u0632\u0634 \u0648 \u062C\u0630\u0628 \u0633\u0631\u0628\u0627\u0632", cost: 1e4, durationSeconds: 7200, grant: { kind: "units", templateCode: "rangers", quantity: 1e3 } },
      { key: "airbase", emoji: "\u{1F6E9}\uFE0F", nameFa: "\u067E\u0627\u06CC\u06AF\u0627\u0647 \u0647\u0648\u0627\u06CC\u06CC", descFa: "\u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627", cost: 2e4, durationSeconds: 10800, grant: { kind: "units", templateCode: "su57", quantity: 3 } },
      { key: "factory", emoji: "\u{1F3ED}", nameFa: "\u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0646\u0638\u0627\u0645\u06CC", descFa: "\u062A\u0648\u0644\u06CC\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0646\u0638\u0627\u0645\u06CC", cost: 3e4, durationSeconds: 9e3, grant: { kind: "units", templateCode: "leopard_2a7", quantity: 25 } },
      { key: "navalbase", emoji: "\u2693", nameFa: "\u067E\u0627\u06CC\u06AF\u0627\u0647 \u062F\u0631\u06CC\u0627\u06CC\u06CC", descFa: "\u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0646\u0627\u0648\u0647\u0627 \u0648 \u0632\u06CC\u0631\u062F\u0631\u06CC\u0627\u06CC\u06CC\u200C\u0647\u0627", cost: 25e3, durationSeconds: 10800, grant: { kind: "units", templateCode: "nimitz", quantity: 1 } },
      { key: "shelter", emoji: "\u{1F6E1}\uFE0F", nameFa: "\u067E\u0646\u0627\u0647\u06AF\u0627\u0647 \u0646\u0638\u0627\u0645\u06CC", descFa: "\u0627\u0641\u0632\u0627\u06CC\u0634 \u0645\u0642\u0627\u0648\u0645\u062A \u06A9\u0634\u0648\u0631", cost: 15e3, durationSeconds: 7200, grant: { kind: "fortification", quantity: 2 } },
      { key: "radar", emoji: "\u{1F4E1}", nameFa: "\u0645\u0631\u06A9\u0632 \u0631\u0627\u062F\u0627\u0631", descFa: "\u0627\u0641\u0632\u0627\u06CC\u0634 \u0634\u0646\u0627\u0633\u0627\u06CC\u06CC \u062A\u0647\u062F\u06CC\u062F\u0647\u0627", cost: 13e3, durationSeconds: 5400, grant: { kind: "units", templateCode: "an_spy6", quantity: 3 } }
    ];
    BUILDING_UPGRADE_COST_FACTOR = 0.6;
    BUILDING_MAX_LEVEL = 10;
    MAX_CONCURRENT_PROJECTS = 3;
    BUILDING_KEYS = BUILDINGS.map((b) => b.key);
    BANK_LOAN = {
      options: [5e3, 1e4, 2e4],
      interestRate: 0.1,
      termDays: 7
    };
    TRANSACTION_TYPE_LABELS_FA = {
      starter_grant: "\u062F\u0627\u0631\u0627\u06CC\u06CC \u0627\u0648\u0644\u06CC\u0647 \u06A9\u0634\u0648\u0631",
      revenue: "\u062F\u0631\u0622\u0645\u062F \u062F\u0648\u0631\u0647\u200C\u0627\u06CC",
      purchase: "\u062E\u0631\u06CC\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A",
      admin_credit: "\u0627\u0641\u0632\u0627\u06CC\u0634 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631",
      admin_debit: "\u06A9\u0627\u0647\u0634 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631",
      admin_correction: "\u0627\u0635\u0644\u0627\u062D \u0645\u0627\u0644\u06CC \u0645\u062F\u06CC\u0631",
      war_indemnity: "\u063A\u0631\u0627\u0645\u062A \u062C\u0646\u06AF",
      war_cost: "\u0647\u0632\u06CC\u0646\u0647 \u062C\u0646\u06AF",
      tax: "\u0645\u0627\u0644\u06CC\u0627\u062A",
      maintenance: "\u0647\u0632\u06CC\u0646\u0647 \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC",
      battle_loss_compensation: "\u062C\u0628\u0631\u0627\u0646 \u062E\u0633\u0627\u0631\u062A",
      prize: "\u062C\u0627\u06CC\u0632\u0647 \u0634\u0627\u0646\u0633\u06CC \u0631\u0648\u0632\u0627\u0646\u0647",
      loan_disbursement: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC",
      loan_repayment: "\u062A\u0633\u0648\u06CC\u0647 \u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC"
    };
    WAR_STATUS_LABELS_FA = {
      proposed: "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u067E\u0630\u06CC\u0631\u0634",
      accepted: "\u067E\u0630\u06CC\u0631\u0641\u062A\u0647\u200C\u0634\u062F\u0647",
      active: "\u0641\u0639\u0627\u0644",
      peace_requested: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D",
      ended: "\u067E\u0627\u06CC\u0627\u0646\u200C\u06CC\u0627\u0641\u062A\u0647",
      cancelled: "\u0644\u063A\u0648\u0634\u062F\u0647",
      stopped_by_admin: "\u0645\u062A\u0648\u0642\u0641\u200C\u0634\u062F\u0647 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631"
    };
    DIPLOMACY_REQUEST_KINDS = ["friendship", "alliance", "peace", "non_aggression", "war", "message", "dissolve"];
    STATEMENT_STATUS_LABELS_FA = {
      draft: "\u067E\u06CC\u0634\u200C\u0646\u0648\u06CC\u0633",
      pending_review: "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0623\u06CC\u06CC\u062F \u0645\u062F\u06CC\u0631",
      published: "\u0645\u0646\u062A\u0634\u0631\u0634\u062F\u0647",
      rejected: "\u0631\u062F\u0634\u062F\u0647",
      removed: "\u062D\u0630\u0641\u200C\u0634\u062F\u0647"
    };
    RANKING_METRICS = [
      "treasury",
      "military_power",
      "income",
      "equipment_count",
      "war_wins",
      "economic_score"
    ];
    DEFAULT_RANKING_WEIGHTS = {
      treasury: 1,
      military_power: 1,
      income: 1,
      equipment_count: 0.5,
      war_wins: 1,
      economic_score: 1
    };
    DEFAULT_BATTLE_PARAMS = {
      /** controlled randomness range: 1 ± warRandomness */
      warRandomness: 0.15,
      /** share of the enemy pool destroyed per round */
      damagePerRound: 0.08,
      maxRounds: 12,
      /** attacker advantage multiplier */
      attackerAdvantage: 1.05,
      /** defender (home) advantage multiplier */
      defenderAdvantage: 1.1,
      /** manpower -> points factor (used when soldiers have no explicit points) */
      manpowerFactor: 0.2,
      /** radar support bonus ratio applied to defense */
      radarSupportBonus: 0.05,
      /** alliance defense sharing ratio */
      allianceSupportRatio: 0.25,
      /** coin indemnity per destroyed power point */
      indemnityPerPoint: 100,
      /** flat entry cost multiplier of treasury */
      warEntryTaxRate: 0,
      minWarDurationSeconds: 3600,
      warCooldownSeconds: 6 * 3600,
      maxActiveWarsPerNation: 1,
      maxAttackersPerTarget: 1,
      peaceCooldownSeconds: 12 * 3600
    };
    DEFAULT_PROFILE_RULES = {
      renameCooldownSeconds: 7 * 24 * 3600,
      leaderRenameCooldownSeconds: 7 * 24 * 3600,
      flagChangeCooldownSeconds: 24 * 3600,
      maxNationsPerUser: 1
    };
    DEFAULT_DIPLOMACY_RULES = {
      maxPendingRequestsPerNation: 20,
      maxFriends: 30,
      maxAllianceMembers: 12,
      requestExpirySeconds: 72 * 3600,
      allowNeutralAttacks: true
    };
    DEFAULT_ECONOMY_RULES = {
      incomeCycleSeconds: STARTER_ECONOMY.incomeCycleSeconds,
      factoryIncomePerUnit: DERIVED_FACTORY_INCOME_PER_UNIT,
      mineIncomePerUnit: DERIVED_MINE_INCOME_PER_UNIT,
      /** tax on gross revenue, ratio 0..1 */
      taxRate: 0,
      /** maintenance per cycle, ratio of a configured upkeep base */
      maintenanceRate: 0,
      /** per-unit upkeep by category (admin-filled) */
      maintenancePerUnit: {},
      /** max cycles credited in one cron run (catch-up cap) */
      maxCatchupCycles: 3,
      /** minimum treasury allowed (DB CHECK mirrors 0) */
      minTreasury: 0,
      negativeBalanceAllowed: false,
      globalMultiplier: 1
    };
    FEATURE_FLAGS = {
      warEnabled: true,
      shopEnabled: true,
      diplomacyEnabled: true,
      statementsEnabled: true,
      statementsRequireApproval: false,
      attacksRequireVictimApproval: true,
      miniAppEnabled: true
    };
    GAME_SETTING_KEYS = {
      battle: "battle_params",
      economy: "economy_rules",
      profile: "profile_rules",
      diplomacy: "diplomacy_rules",
      features: "feature_flags",
      rankingWeights: "ranking_weights",
      categoryWeights: "category_power_weights",
      branding: "branding",
      quota: "quota_guard"
    };
    DEFAULT_BRANDING = {
      gameName: "World War",
      welcomeTitle: "\u{1F30D} \u0628\u0647 World War \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F!",
      welcomeText: "\u{1F30D} \u0628\u0647 World War \u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F!\n\n\u06A9\u0634\u0648\u0631 \u062E\u0648\u062F \u0631\u0627 \u0628\u0633\u0627\u0632\u06CC\u062F\u060C \u0627\u0642\u062A\u0635\u0627\u062F \u0622\u0646 \u0631\u0627 \u062A\u0648\u0633\u0639\u0647 \u062F\u0647\u06CC\u062F\u060C \u0627\u0631\u062A\u0634 \u0628\u0686\u06CC\u0646\u06CC\u062F \u0648 \u062F\u0631 \u062C\u0646\u06AF\u200C\u0647\u0627\u06CC \u062C\u0647\u0627\u0646\u06CC \u0634\u0631\u06A9\u062A \u06A9\u0646\u06CC\u062F.\n\u0628\u0631\u0627\u06CC \u0634\u0631\u0648\u0639 \xAB\u0627\u06CC\u062C\u0627\u062F \u06A9\u0634\u0648\u0631\xBB \u0631\u0627 \u0628\u0632\u0646\u06CC\u062F.",
      nationNamePrompt: "\u270D\uFE0F \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F (\u06F3 \u062A\u0627 \u06F3\u06F0 \u0646\u0648\u06CC\u0633\u0647\u060C \u06CC\u06A9\u062A\u0627):",
      leaderNamePrompt: "\u270D\uFE0F \u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631 \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F (\u06F2 \u062A\u0627 \u06F4\u06F0 \u0646\u0648\u06CC\u0633\u0647):",
      flagPrompt: "\u{1F6A9} \u067E\u0631\u0686\u0645 \u06A9\u0634\u0648\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F:",
      statementPrompt: "\u{1F4DC} \u0635\u062F\u0648\u0631 \u0628\u06CC\u0627\u0646\u06CC\u0647\n\n\u0644\u0637\u0641\u0627\u064B \u0645\u062A\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u062E\u0648\u062F \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F.\n\n\u0628\u06CC\u0627\u0646\u06CC\u0647 \u0634\u0645\u0627 \u067E\u0633 \u0627\u0632 \u062B\u0628\u062A\u060C \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0645\u0648\u0636\u0639 \u0631\u0633\u0645\u06CC \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0645\u0646\u062A\u0634\u0631 \u062E\u0648\u0627\u0647\u062F \u0634\u062F.\n\n\u270D\uFE0F \u0645\u062A\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0631\u0627 \u062F\u0631 \u06CC\u06A9 \u067E\u06CC\u0627\u0645 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F."
    };
    DEFAULT_QUOTA_GUARD = {
      /** stop non-essential cron work above this share of the daily D1 read limit */
      d1RowsDailySoftLimit: 5e6,
      cronFailuresBeforePause: 5,
      warnAtPercent: 80
    };
    ROUTES = {
      playerRoot: "/app/player",
      adminRoot: "/app/admin",
      apiRoot: "/api",
      webhook: "/api/telegram/webhook"
    };
    PLAYER_PAGES = [
      "dashboard",
      "economy",
      "military",
      "marketplace",
      "country",
      "war",
      "defense",
      "diplomacy",
      "statements",
      "rankings",
      "settings"
    ];
    PLAYER_PAGE_META = {
      dashboard: { labelFa: "\u062F\u0627\u0634\u0628\u0648\u0631\u062F", emoji: "\u{1F3E0}" },
      economy: { labelFa: "\u0627\u0642\u062A\u0635\u0627\u062F", emoji: "\u{1F4B0}" },
      military: { labelFa: "\u062F\u0627\u0631\u0627\u06CC\u06CC \u0646\u0638\u0627\u0645\u06CC", emoji: "\u{1F396}\uFE0F" },
      marketplace: { labelFa: "\u0641\u0631\u0648\u0634\u06AF\u0627\u0647", emoji: "\u{1F6D2}" },
      country: { labelFa: "\u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0634\u0648\u0631", emoji: "\u{1F6E1}\uFE0F" },
      war: { labelFa: "\u062C\u0646\u06AF", emoji: "\u2694\uFE0F" },
      defense: { labelFa: "\u062F\u0641\u0627\u0639", emoji: "\u{1F6E1}\uFE0F" },
      diplomacy: { labelFa: "\u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC", emoji: "\u{1F310}" },
      statements: { labelFa: "\u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0647\u0627", emoji: "\u{1F4DC}" },
      rankings: { labelFa: "\u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC", emoji: "\u{1F4CA}" },
      settings: { labelFa: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A", emoji: "\u2699\uFE0F" }
    };
    ADMIN_SECTIONS = [
      "users",
      "nations",
      "economy",
      "shop",
      "wars",
      "diplomacy",
      "statements",
      "settings",
      "roles",
      "backup",
      "quota",
      "audit"
    ];
    MAX_STATEMENT_CHARS = 1200;
    MIN_STATEMENT_CHARS = 10;
    DEFENSE_ARRANGEMENT = [
      { key: "tanks", labelFa: "\u062A\u0627\u0646\u06A9", emoji: "\u{1F69C}" },
      { key: "soldiers", labelFa: "\u0633\u0631\u0628\u0627\u0632", emoji: "\u{1FA96}" },
      { key: "ground_air_defense", labelFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u0632\u0645\u06CC\u0646\u06CC", emoji: "\u{1F6E1}\uFE0F" },
      { key: "apc", labelFa: "\u0646\u0641\u0631\u0628\u0631", emoji: "\u{1F69B}" },
      { key: "air_air_defense", labelFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC", emoji: "\u{1F6E1}\uFE0F" },
      { key: "missiles", labelFa: "\u0645\u0648\u0634\u06A9 \u062F\u0641\u0627\u0639\u06CC", emoji: "\u{1F680}" },
      { key: "helicopters", labelFa: "\u0647\u0644\u06CC\u06A9\u0648\u067E\u062A\u0631", emoji: "\u{1F681}" },
      { key: "fighters", labelFa: "\u062C\u0646\u06AF\u0646\u062F\u0647", emoji: "\u2708\uFE0F" },
      { key: "naval_air_defense", labelFa: "\u067E\u062F\u0627\u0641\u0646\u062F \u062F\u0631\u06CC\u0627\u06CC\u06CC", emoji: "\u2693" },
      { key: "ships", labelFa: "\u0646\u0627\u0648 \u062C\u0646\u06AF\u06CC", emoji: "\u{1F6A2}" },
      { key: "fortification", labelFa: "\u0627\u0633\u062A\u062D\u06A9\u0627\u0645\u0627\u062A \u062F\u0641\u0627\u0639\u06CC", emoji: "\u{1F3F0}" },
      { key: "radars", labelFa: "\u0631\u0627\u062F\u0627\u0631", emoji: "\u{1F4E1}" }
    ];
    DEFENSE_ARRANGEMENT_KEYS = DEFENSE_ARRANGEMENT.map((d) => d.key);
    DEFENSE_FORTIFICATION_TOKEN = "fortification";
    DAILY_PRIZES = [
      { key: "aster30_10", emoji: "\u{1F6E1}\uFE0F", labelFa: "\u06F1\u06F0 \u067E\u062F\u0627\u0641\u0646\u062F Aster 30", kind: "equipment" },
      { key: "soldiers_500", emoji: "\u{1FA96}", labelFa: "\u06F5\u06F0\u06F0 \u0633\u0631\u0628\u0627\u0632 \u062A\u06A9\u0627\u0648\u0631", kind: "equipment" },
      { key: "su57_5", emoji: "\u2708\uFE0F", labelFa: "\u06F5 \u062C\u0646\u06AF\u0646\u062F\u0647 SU-57", kind: "equipment" },
      { key: "nimitz_1", emoji: "\u{1F6A2}", labelFa: "\u06F1 \u0646\u0627\u0648 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0628\u0631 Nimitz", kind: "equipment" },
      { key: "df41_2", emoji: "\u{1F680}", labelFa: "\u06F2 \u0645\u0648\u0634\u06A9 DF-41", kind: "equipment" },
      { key: "coins_5000", emoji: "\u{1F4B0}", labelFa: "\u06F5\u06F0\u06F0\u06F0 \u0633\u06A9\u0647", kind: "coins" },
      { key: "coins_800", emoji: "\u{1F4B0}", labelFa: "\u06F8\u06F0\u06F0 \u0633\u06A9\u0647", kind: "coins" }
    ];
  }
});

// shared/src/types.ts
var init_types = __esm({
  "shared/src/types.ts"() {
    "use strict";
  }
});

// shared/node_modules/zod/v3/helpers/util.js
var util, objectUtil, ZodParsedType, getParsedType;
var init_util = __esm({
  "shared/node_modules/zod/v3/helpers/util.js"() {
    (function(util3) {
      util3.assertEqual = (_) => {
      };
      function assertIs(_arg) {
      }
      util3.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util3.assertNever = assertNever;
      util3.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util3.getValidEnumValues = (obj) => {
        const validKeys = util3.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util3.objectValues(filtered);
      };
      util3.objectValues = (obj) => {
        return util3.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util3.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util3.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util3.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util3.joinValues = joinValues;
      util3.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil3) {
      objectUtil3.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    };
  }
});

// shared/node_modules/zod/v3/ZodError.js
var ZodIssueCode, quotelessJson, ZodError;
var init_ZodError = __esm({
  "shared/node_modules/zod/v3/ZodError.js"() {
    init_util();
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    ZodError = class _ZodError extends Error {
      get errors() {
        return this.issues;
      }
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            const firstEl = sub.path[0];
            fieldErrors[firstEl] = fieldErrors[firstEl] || [];
            fieldErrors[firstEl].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
  }
});

// shared/node_modules/zod/v3/locales/en.js
var errorMap, en_default;
var init_en = __esm({
  "shared/node_modules/zod/v3/locales/en.js"() {
    init_ZodError();
    init_util();
    errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "bigint")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message };
    };
    en_default = errorMap;
  }
});

// shared/node_modules/zod/v3/errors.js
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var overrideErrorMap;
var init_errors = __esm({
  "shared/node_modules/zod/v3/errors.js"() {
    init_en();
    overrideErrorMap = en_default;
  }
});

// shared/node_modules/zod/v3/helpers/parseUtil.js
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync;
var init_parseUtil = __esm({
  "shared/node_modules/zod/v3/helpers/parseUtil.js"() {
    init_errors();
    init_en();
    makeIssue = (params) => {
      const { data, path, errorMaps, issueData } = params;
      const fullPath = [...path, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    };
    EMPTY_PATH = [];
    ParseStatus = class _ParseStatus {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = (value) => ({ status: "dirty", value });
    OK = (value) => ({ status: "valid", value });
    isAborted = (x) => x.status === "aborted";
    isDirty = (x) => x.status === "dirty";
    isValid = (x) => x.status === "valid";
    isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  }
});

// shared/node_modules/zod/v3/helpers/typeAliases.js
var init_typeAliases = __esm({
  "shared/node_modules/zod/v3/helpers/typeAliases.js"() {
  }
});

// shared/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
var init_errorUtil = __esm({
  "shared/node_modules/zod/v3/helpers/errorUtil.js"() {
    (function(errorUtil3) {
      errorUtil3.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil3.toString = (message) => typeof message === "string" ? message : message?.message;
    })(errorUtil || (errorUtil = {}));
  }
});

// shared/node_modules/zod/v3/types.js
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap3, invalid_type_error, required_error, description } = params;
  if (errorMap3 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap3)
    return { errorMap: errorMap3, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER;
var init_types2 = __esm({
  "shared/node_modules/zod/v3/types.js"() {
    init_ZodError();
    init_errors();
    init_errorUtil();
    init_parseUtil();
    init_util();
    ParseInputLazyPath = class {
      constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (Array.isArray(this._key)) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = (ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error = new ZodError(ctx.common.issues);
            this._error = error;
            return this._error;
          }
        };
      }
    };
    ZodType = class {
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        const ctx = {
          common: {
            issues: [],
            async: params?.async ?? false,
            contextualErrorMap: params?.errorMap
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      "~validate"(data) {
        const ctx = {
          common: {
            issues: [],
            async: !!this["~standard"].async
          },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        if (!this["~standard"].async) {
          try {
            const result = this._parseSync({ data, path: [], parent: ctx });
            return isValid(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            };
          } catch (err) {
            if (err?.message?.toLowerCase()?.includes("encountered")) {
              this["~standard"].async = true;
            }
            ctx.common = {
              issues: [],
              async: true
            };
          }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        });
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params?.errorMap,
            async: true
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (data) => this["~validate"](data)
        };
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
    ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    ZodString = class _ZodString extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      base64url(message) {
        return this._addCheck({
          kind: "base64url",
          ...errorUtil.errToObj(message)
        });
      }
      jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
      }
      ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          offset: options?.offset ?? false,
          local: options?.local ?? false,
          ...errorUtil.errToObj(options?.message)
        });
      }
      date(message) {
        return this._addCheck({ kind: "date", message });
      }
      time(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          ...errorUtil.errToObj(options?.message)
        });
      }
      duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message)
        });
      }
      includes(value, options) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options?.position,
          ...errorUtil.errToObj(options?.message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message)
        });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodNumber = class _ZodNumber extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message)
        });
      }
      safe(message) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          try {
            input.data = BigInt(input.data);
          } catch {
            return this._getInvalidInput(input);
          }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          return this._getInvalidInput(input);
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.bigint,
          received: ctx.parsedType
        });
        return INVALID;
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (Number.isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    ZodObject = class _ZodObject extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") {
          } else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: errorUtil.errToObj(message).message ?? defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: () => ({
            ...this._def.shape(),
            ...augmentation
          })
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        for (const key of util.objectKeys(mask)) {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return util.objectValues(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else if (type instanceof ZodOptional) {
        return [void 0, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
      } else {
        return [];
      }
    };
    ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new _ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodRecord = class _ZodRecord extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (ctx.common.async) {
          return ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new _ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new _ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    ZodMap = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodFunction = class _ZodFunction extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType
          });
          return INVALID;
        }
        function makeArgsIssue(args, error) {
          return makeIssue({
            data: args,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return makeIssue({
            data: returns,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          const me = this;
          return OK(async function(...args) {
            const error = new ZodError([]);
            const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await Reflect.apply(fn, this, parsedArgs);
            const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          const me = this;
          return OK(function(...args) {
            const parsedArgs = me._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = Reflect.apply(fn, this, parsedArgs.data);
            const parsedReturns = me._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new _ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new _ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new _ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    ZodEnum = class _ZodEnum extends ZodType {
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(this._def.values);
        }
        if (!this._cache.has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(util.getValidEnumValues(this._def.values));
        }
        if (!this._cache.has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return INVALID;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return INVALID;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                status: status.value,
                value: result
              }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    BRAND = Symbol("zod_brand");
    ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new _ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        };
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    late = {
      object: ZodObject.lazycreate
    };
    (function(ZodFirstPartyTypeKind3) {
      ZodFirstPartyTypeKind3["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind3["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind3["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind3["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind3["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind3["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind3["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind3["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind3["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind3["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind3["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind3["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind3["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind3["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind3["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind3["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind3["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind3["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind3["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind3["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind3["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind3["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind3["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind3["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind3["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind3["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind3["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind3["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind3["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind3["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind3["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind3["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind3["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind3["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind3["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind3["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => custom((data) => data instanceof cls, params);
    stringType = ZodString.create;
    numberType = ZodNumber.create;
    nanType = ZodNaN.create;
    bigIntType = ZodBigInt.create;
    booleanType = ZodBoolean.create;
    dateType = ZodDate.create;
    symbolType = ZodSymbol.create;
    undefinedType = ZodUndefined.create;
    nullType = ZodNull.create;
    anyType = ZodAny.create;
    unknownType = ZodUnknown.create;
    neverType = ZodNever.create;
    voidType = ZodVoid.create;
    arrayType = ZodArray.create;
    objectType = ZodObject.create;
    strictObjectType = ZodObject.strictCreate;
    unionType = ZodUnion.create;
    discriminatedUnionType = ZodDiscriminatedUnion.create;
    intersectionType = ZodIntersection.create;
    tupleType = ZodTuple.create;
    recordType = ZodRecord.create;
    mapType = ZodMap.create;
    setType = ZodSet.create;
    functionType = ZodFunction.create;
    lazyType = ZodLazy.create;
    literalType = ZodLiteral.create;
    enumType = ZodEnum.create;
    nativeEnumType = ZodNativeEnum.create;
    promiseType = ZodPromise.create;
    effectsType = ZodEffects.create;
    optionalType = ZodOptional.create;
    nullableType = ZodNullable.create;
    preprocessType = ZodEffects.createWithPreprocess;
    pipelineType = ZodPipeline.create;
    ostring = () => stringType().optional();
    onumber = () => numberType().optional();
    oboolean = () => booleanType().optional();
    coerce = {
      string: (arg) => ZodString.create({ ...arg, coerce: true }),
      number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
      boolean: (arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      }),
      bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
      date: (arg) => ZodDate.create({ ...arg, coerce: true })
    };
    NEVER = INVALID;
  }
});

// shared/node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});
var init_external = __esm({
  "shared/node_modules/zod/v3/external.js"() {
    init_errors();
    init_parseUtil();
    init_typeAliases();
    init_util();
    init_types2();
    init_ZodError();
  }
});

// shared/node_modules/zod/index.js
var init_zod = __esm({
  "shared/node_modules/zod/index.js"() {
    init_external();
    init_external();
  }
});

// shared/src/schemas.ts
function formatZodError(err) {
  const fields = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  const first = err.issues[0];
  return { code: "validation_error", message: first ? first.message : "\u062F\u0627\u062F\u0647\u200C\u0647\u0627\u06CC \u0627\u0631\u0633\u0627\u0644\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A", fields };
}
var NAME_RE, nationNameSchema, leaderNameSchema, flagSchema, statementTextSchema, purchaseSchema, relationSchema, diplomacyRequestSchema, requestDecisionSchema, warProposeSchema, equipmentUpsertSchema, adminAdjustTreasurySchema, adminSetIncomeSchema, adminInventoryDeltaSchema, categorySchema, battleParamsSchema, economyRulesSchema, profileRulesSchema, diplomacyRulesSchema, featureFlagsSchema, brandingSchema, quotaGuardSchema, starterTemplateSchema, nationUpdateSchema, telegramIdSchema, statementCreateSchema;
var init_schemas = __esm({
  "shared/src/schemas.ts"() {
    "use strict";
    init_zod();
    init_constants();
    NAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} .،()\-_]{1,58}[\p{L}\p{N} .،()\-_]$/u;
    nationNameSchema = external_exports.string().trim().min(3, "\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F3 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F").max(30, "\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F").regex(NAME_RE, "\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0634\u0627\u0645\u0644 \u0646\u0648\u06CC\u0633\u0647\u200C\u0647\u0627\u06CC \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A").refine((v) => !/^\s+$/.test(v), "\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A");
    leaderNameSchema = external_exports.string().trim().min(2, "\u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F2 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F").max(40, "\u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F4\u06F0 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F").regex(NAME_RE, "\u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631 \u0634\u0627\u0645\u0644 \u0646\u0648\u06CC\u0633\u0647\u200C\u0647\u0627\u06CC \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A");
    flagSchema = external_exports.string().trim().min(1, "\u067E\u0631\u0686\u0645 \u0644\u0627\u0632\u0645 \u0627\u0633\u062A").max(24, "\u067E\u0631\u0686\u0645 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0637\u0648\u0644\u0627\u0646\u06CC \u0627\u0633\u062A");
    statementTextSchema = external_exports.string().trim().min(MIN_STATEMENT_CHARS, `\u0645\u062A\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 ${MIN_STATEMENT_CHARS} \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F`).max(MAX_STATEMENT_CHARS, `\u0645\u062A\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u06A9\u062B\u0631 ${MAX_STATEMENT_CHARS} \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F`).refine((t) => !/<[^>]+>/.test(t), "\u0645\u062A\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0634\u0627\u0645\u0644 \u062A\u06AF HTML \u0628\u0627\u0634\u062F");
    purchaseSchema = external_exports.object({
      templateId: external_exports.coerce.number().int().positive(),
      quantity: external_exports.coerce.number().int().min(1).max(1e5),
      idempotencyKey: external_exports.string().trim().min(8).max(80)
    });
    relationSchema = external_exports.object({
      otherNationId: external_exports.coerce.number().int().positive(),
      status: external_exports.enum(RELATION_STATUSES)
    });
    diplomacyRequestSchema = external_exports.object({
      toNationId: external_exports.coerce.number().int().positive(),
      kind: external_exports.enum(DIPLOMACY_REQUEST_KINDS),
      message: external_exports.string().trim().max(600).optional().nullable(),
      allianceId: external_exports.coerce.number().int().positive().optional().nullable(),
      allianceName: external_exports.string().trim().min(3).max(40).optional().nullable()
    });
    requestDecisionSchema = external_exports.object({
      requestId: external_exports.coerce.number().int().positive(),
      accept: external_exports.coerce.boolean()
    });
    warProposeSchema = external_exports.object({
      targetNationId: external_exports.coerce.number().int().positive(),
      indemnityOffered: external_exports.coerce.number().int().min(0).max(1e9).optional().default(0)
    });
    equipmentUpsertSchema = external_exports.object({
      id: external_exports.coerce.number().int().positive().optional().nullable(),
      categoryKey: external_exports.string().trim().min(1).max(40),
      code: external_exports.string().trim().min(1).max(60).regex(/^[a-z0-9_]+$/i, "\u06A9\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0641\u0642\u0637 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062D\u0631\u0648\u0641\u060C \u0631\u0642\u0645 \u0648 _ \u0628\u0627\u0634\u062F"),
      nameFa: external_exports.string().trim().min(1).max(80),
      unitFa: external_exports.string().trim().min(1).max(16),
      /** null => not priced, purchase disabled */
      price: external_exports.coerce.number().int().min(1, "\u0642\u06CC\u0645\u062A \u0628\u0627\u06CC\u062F \u0639\u062F\u062F \u0635\u062D\u06CC\u062D \u0645\u062B\u0628\u062A \u0628\u0627\u0634\u062F (\u0628\u0631\u0627\u06CC \xAB\u0642\u06CC\u0645\u062A\u200C\u06AF\u0630\u0627\u0631\u06CC\u200C\u0646\u0634\u062F\u0647\xBB \u062E\u0627\u0644\u06CC \u0628\u06AF\u0630\u0627\u0631\u06CC\u062F)").nullable().optional().default(null),
      attackPoints: external_exports.coerce.number().min(0).nullable().optional().default(null),
      defensePoints: external_exports.coerce.number().min(0).nullable().optional().default(null),
      descriptionFa: external_exports.string().trim().max(200).optional().default(""),
      isActive: external_exports.coerce.boolean().optional().default(true),
      isForSale: external_exports.coerce.boolean().optional().default(true),
      purchaseLimitPerCycle: external_exports.coerce.number().int().min(1).nullable().optional().default(null),
      maintenancePerUnit: external_exports.coerce.number().min(0).int().nullable().optional().default(null)
    });
    adminAdjustTreasurySchema = external_exports.object({
      nationId: external_exports.coerce.number().int().positive(),
      delta: external_exports.coerce.number().int().refine((v) => v !== 0, "\u0645\u0642\u062F\u0627\u0631 \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0635\u0641\u0631 \u0628\u0627\u0634\u062F"),
      reason: external_exports.string().trim().min(3).max(200)
    });
    adminSetIncomeSchema = external_exports.object({
      nationId: external_exports.coerce.number().int().positive(),
      factoryIncome: external_exports.coerce.number().int().min(0).max(1e9).optional(),
      mineIncome: external_exports.coerce.number().int().min(0).max(1e9).optional(),
      upkeepBase: external_exports.coerce.number().int().min(0).max(1e9).optional(),
      reason: external_exports.string().trim().min(3).max(200)
    });
    adminInventoryDeltaSchema = external_exports.object({
      nationId: external_exports.coerce.number().int().positive(),
      templateId: external_exports.coerce.number().int().positive(),
      delta: external_exports.coerce.number().int().refine((v) => v !== 0, "\u0645\u0642\u062F\u0627\u0631 \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0635\u0641\u0631 \u0628\u0627\u0634\u062F"),
      reason: external_exports.string().trim().min(3).max(200)
    });
    categorySchema = external_exports.object({
      key: external_exports.string().trim().min(1).max(40).regex(/^[a-z0-9_]+$/i),
      labelFa: external_exports.string().trim().min(1).max(40),
      shopLabelFa: external_exports.string().trim().min(1).max(60),
      emoji: external_exports.string().trim().min(1).max(8),
      role: external_exports.enum(["offense", "defense", "economy", "support"]),
      sortOrder: external_exports.coerce.number().int().min(0).optional().default(999),
      isActive: external_exports.coerce.boolean().optional().default(true)
    });
    battleParamsSchema = external_exports.object({
      warRandomness: external_exports.coerce.number().min(0).max(0.5),
      damagePerRound: external_exports.coerce.number().min(0.01).max(0.5),
      maxRounds: external_exports.coerce.number().int().min(1).max(50),
      attackerAdvantage: external_exports.coerce.number().min(0.5).max(2),
      defenderAdvantage: external_exports.coerce.number().min(0.5).max(2),
      manpowerFactor: external_exports.coerce.number().min(0).max(5),
      radarSupportBonus: external_exports.coerce.number().min(0).max(1),
      allianceSupportRatio: external_exports.coerce.number().min(0).max(1),
      indemnityPerPoint: external_exports.coerce.number().min(0).max(1e5),
      warEntryTaxRate: external_exports.coerce.number().min(0).max(0.5),
      minWarDurationSeconds: external_exports.coerce.number().int().min(0).max(86400),
      warCooldownSeconds: external_exports.coerce.number().int().min(0).max(604800),
      maxActiveWarsPerNation: external_exports.coerce.number().int().min(0).max(20),
      maxAttackersPerTarget: external_exports.coerce.number().int().min(0).max(20),
      peaceCooldownSeconds: external_exports.coerce.number().int().min(0).max(604800)
    });
    economyRulesSchema = external_exports.object({
      incomeCycleSeconds: external_exports.coerce.number().int().min(60).max(30 * 86400),
      factoryIncomePerUnit: external_exports.coerce.number().min(0).max(1e6),
      mineIncomePerUnit: external_exports.coerce.number().min(0).max(1e6),
      taxRate: external_exports.coerce.number().min(0).max(0.9),
      maintenanceRate: external_exports.coerce.number().min(0).max(0.9),
      maintenancePerUnit: external_exports.record(external_exports.coerce.number().min(0).max(1e5)),
      maxCatchupCycles: external_exports.coerce.number().int().min(1).max(720),
      minTreasury: external_exports.coerce.number().int().min(0),
      negativeBalanceAllowed: external_exports.coerce.boolean(),
      globalMultiplier: external_exports.coerce.number().min(0.1).max(10)
    });
    profileRulesSchema = external_exports.object({
      renameCooldownSeconds: external_exports.coerce.number().int().min(0).max(365 * 86400),
      leaderRenameCooldownSeconds: external_exports.coerce.number().int().min(0).max(365 * 86400),
      flagChangeCooldownSeconds: external_exports.coerce.number().int().min(0).max(365 * 86400),
      maxNationsPerUser: external_exports.coerce.number().int().min(1).max(50)
    });
    diplomacyRulesSchema = external_exports.object({
      maxPendingRequestsPerNation: external_exports.coerce.number().int().min(1).max(500),
      maxFriends: external_exports.coerce.number().int().min(1).max(500),
      maxAllianceMembers: external_exports.coerce.number().int().min(2).max(100),
      requestExpirySeconds: external_exports.coerce.number().int().min(300).max(90 * 86400),
      allowNeutralAttacks: external_exports.coerce.boolean()
    });
    featureFlagsSchema = external_exports.object({
      warEnabled: external_exports.boolean(),
      shopEnabled: external_exports.boolean(),
      diplomacyEnabled: external_exports.boolean(),
      statementsEnabled: external_exports.boolean(),
      statementsRequireApproval: external_exports.boolean(),
      attacksRequireVictimApproval: external_exports.boolean(),
      miniAppEnabled: external_exports.boolean()
    });
    brandingSchema = external_exports.object({
      gameName: external_exports.string().trim().min(1).max(40),
      welcomeTitle: external_exports.string().trim().min(1).max(120),
      welcomeText: external_exports.string().trim().min(1).max(1500),
      nationNamePrompt: external_exports.string().trim().min(1).max(500),
      leaderNamePrompt: external_exports.string().trim().min(1).max(500),
      flagPrompt: external_exports.string().trim().min(1).max(500),
      statementPrompt: external_exports.string().trim().min(1).max(1e3)
    });
    quotaGuardSchema = external_exports.object({
      d1RowsDailySoftLimit: external_exports.coerce.number().int().min(1e3),
      cronFailuresBeforePause: external_exports.coerce.number().int().min(1).max(100),
      warnAtPercent: external_exports.coerce.number().min(1).max(100)
    });
    starterTemplateSchema = external_exports.object({
      id: external_exports.coerce.number().int().positive().optional(),
      name: external_exports.string().trim().min(2).max(40),
      treasury: external_exports.coerce.number().int().min(0).max(1e9),
      factoryIncome: external_exports.coerce.number().int().min(0).max(1e9),
      mineIncome: external_exports.coerce.number().int().min(0).max(1e9),
      incomeCycleSeconds: external_exports.coerce.number().int().min(60).max(30 * 86400),
      setAsDefault: external_exports.coerce.boolean().optional().default(false),
      items: external_exports.array(
        external_exports.object({
          templateId: external_exports.coerce.number().int().positive(),
          quantity: external_exports.coerce.number().int().min(0)
        })
      ).optional().default([])
    });
    nationUpdateSchema = external_exports.object({
      name: nationNameSchema.optional(),
      leaderName: leaderNameSchema.optional(),
      flag: flagSchema.optional()
    });
    telegramIdSchema = external_exports.coerce.number().int().positive();
    statementCreateSchema = external_exports.object({ text: statementTextSchema });
  }
});

// shared/src/index.ts
var init_src = __esm({
  "shared/src/index.ts"() {
    "use strict";
    init_constants();
    init_types();
    init_schemas();
  }
});

// apps/worker/src/core/errors.ts
function isApiError(e) {
  return e instanceof ApiError;
}
function toApiError(e) {
  if (isApiError(e)) return e;
  const msg = e instanceof Error ? e.message : String(e);
  const lower = msg.toLowerCase();
  if (lower.includes("unique") || lower.includes("conflict")) return ApiError.conflict(msg);
  if (lower.includes("check constraint")) return ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u0648\u0627\u0631\u062F \u0634\u062F\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (lower.includes("foreign key")) return ApiError.validation("\u0631\u0627\u0628\u0637\u0647 \u062F\u0627\u062F\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (lower.includes("append-only")) return ApiError.forbidden("\u062B\u0628\u062A\u200C\u0647\u0627\u06CC \u0645\u0627\u0644\u06CC \u0642\u0627\u0628\u0644 \u062A\u063A\u06CC\u06CC\u0631 \u06CC\u0627 \u062D\u0630\u0641 \u0646\u06CC\u0633\u062A\u0646\u062F.");
  return ApiError.internal("\u062E\u0637\u0627\u06CC \u063A\u06CC\u0631\u0645\u0646\u062A\u0638\u0631\u0647.", msg);
}
var ApiError;
var init_errors2 = __esm({
  "apps/worker/src/core/errors.ts"() {
    "use strict";
    ApiError = class _ApiError extends Error {
      status;
      code;
      details;
      constructor(code, message, status = 400, details) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.status = status;
        this.details = details;
      }
      static unauthorized(message = "\u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u06A9\u0627\u0631 \u0628\u0627\u06CC\u062F \u0648\u0627\u0631\u062F \u0634\u0648\u06CC\u062F.") {
        return new _ApiError("unauthorized", message, 401);
      }
      static forbidden(message = "\u0627\u062C\u0627\u0632\u0647 \u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F.") {
        return new _ApiError("forbidden", message, 403);
      }
      static notFound(message = "\u0645\u0648\u0631\u062F\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.") {
        return new _ApiError("not_found", message, 404);
      }
      static validation(message, details) {
        return new _ApiError("validation_error", message, 422, details);
      }
      static conflict(message, details) {
        return new _ApiError("conflict", message, 409, details);
      }
      static insufficientFunds(message = "\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.", details) {
        return new _ApiError("insufficient_funds", message, 409, details);
      }
      static rateLimited(message, retryAfterSeconds = 60) {
        return new _ApiError("rate_limited", message, 429, { retryAfterSeconds });
      }
      static disabled(feature) {
        return new _ApiError("feature_disabled", `\u0628\u062E\u0634 \xAB${feature}\xBB \u0645\u0648\u0642\u062A\u0627\u064B \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A.`, 403);
      }
      static quota(message = "\u0633\u0647\u0645\u06CC\u0647 \u067E\u0631\u062F\u0627\u0632\u0634\u06CC \u0633\u0631\u0648\u06CC\u0633 \u0631\u0627\u06CC\u06AF\u0627\u0646 \u0628\u0647 \u062D\u062F \u062E\u0648\u062F \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A.") {
        return new _ApiError("quota_exceeded", message, 503);
      }
      static internal(message = "\u062E\u0637\u0627\u06CC \u062F\u0627\u062E\u0644\u06CC \u0633\u0631\u0648\u0631.", details) {
        return new _ApiError("internal_error", message, 500, details);
      }
    };
  }
});

// apps/worker/src/core/sql.ts
function sql(strings, ...values) {
  let out = "";
  const bindings = [];
  strings.forEach((chunk, i) => {
    out += chunk;
    if (i < values.length) {
      const v = values[i];
      if (Array.isArray(v)) {
        if (v.length === 0) throw new Error("empty array binding is not allowed");
        out += v.map(() => "?").join(", ");
        bindings.push(...v.map(normalize));
      } else {
        out += "?";
        bindings.push(normalize(v));
      }
    }
  });
  return { sql: out, bindings };
}
function normalize(v) {
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v === void 0) return null;
  if (v instanceof Date) return Math.floor(v.getTime() / 1e3);
  if (typeof v === "number" && !Number.isFinite(v)) throw new Error("non-finite number binding");
  return v;
}
var init_sql = __esm({
  "apps/worker/src/core/sql.ts"() {
    "use strict";
  }
});

// apps/worker/src/core/ids.ts
function randomToken(bytes = 32) {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  let s = "";
  for (const b of buf) s += ENC[b % ENC.length];
  return s;
}
function uuid() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = b[6] & 15 | 64;
  b[8] = b[8] & 63 | 128;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
async function timingSafeEqualHex(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function seedFromString(input) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}
var ENC, revenueCycleKey, purchaseIdempotencyKey, adminTxKey, warTxKey;
var init_ids = __esm({
  "apps/worker/src/core/ids.ts"() {
    "use strict";
    ENC = "abcdefghijklmnopqrstuvwxyz0123456789";
    revenueCycleKey = (nationId, cycleIndex) => `rev:${nationId}:${cycleIndex}`;
    purchaseIdempotencyKey = (nationId, key) => `buy:${nationId}:${key}`;
    adminTxKey = (action, nationId, at, seq) => `adm:${action}:${nationId}:${at}:${seq}`;
    warTxKey = (kind, warId, side) => `war:${kind}:${warId}:${side}`;
  }
});

// apps/worker/src/core/telegram-auth.ts
async function hmacBytes(secret, data) {
  const material = secret;
  const key = typeof secret === "string" ? await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]) : await crypto.subtle.importKey("raw", material, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
}
async function deriveWebAppSecretKey(botToken) {
  return hmacBytes("WebAppData", botToken);
}
async function verifyInitDataFull(initData, botToken, opts = {}) {
  if (!botToken) throw ApiError.internal("BOT_TOKEN \u062A\u0646\u0638\u06CC\u0645 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  if (!initData || initData === "undefined" || initData === "null") {
    throw ApiError.unauthorized("initData \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u0628\u0627\u0632\u06CC \u0631\u0627 \u0627\u0632 \u062F\u0627\u062E\u0644 \u062A\u0644\u06AF\u0631\u0627\u0645 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F.");
  }
  let params;
  try {
    params = new URLSearchParams(initData);
  } catch {
    throw ApiError.unauthorized("initData \u0642\u0627\u0628\u0644 \u062A\u062C\u0632\u06CC\u0647 \u0646\u06CC\u0633\u062A.");
  }
  const hash = params.get("hash");
  if (!hash) throw ApiError.unauthorized("initData \u0628\u062F\u0648\u0646 \u0627\u0645\u0636\u0627 \u0627\u0633\u062A.");
  const dataCheckString = [...params.entries()].filter(([k]) => k !== "hash").sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => `${k}=${v}`).join("\n");
  const secretKey = await deriveWebAppSecretKey(botToken);
  const computed = toHex(await hmacBytes(secretKey, dataCheckString));
  if (!await timingSafeEqualHex(computed, hash.toLowerCase())) {
    throw ApiError.unauthorized("\u0627\u0645\u0636\u0627\u06CC initData \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  }
  const authDate = Number(params.get("auth_date") ?? 0);
  const maxAge = opts.maxAgeSeconds ?? MAX_AGE_SECONDS;
  if (!authDate) throw ApiError.unauthorized("auth_date \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F.");
  if (maxAge > 0 && Math.floor(Date.now() / 1e3) - authDate > maxAge) {
    throw ApiError.unauthorized("\u0646\u0634\u0633\u062A \u062A\u0644\u06AF\u0631\u0627\u0645 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A\u061B Mini App \u0631\u0627 \u0628\u0628\u0646\u062F\u06CC\u062F \u0648 \u062F\u0648\u0628\u0627\u0631\u0647 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F.");
  }
  let user = null;
  try {
    const rawUser = params.get("user");
    if (rawUser) user = JSON.parse(rawUser);
  } catch {
    throw ApiError.unauthorized("\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u06A9\u0627\u0631\u0628\u0631 initData \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  }
  if (!user || typeof user.id !== "number") throw ApiError.unauthorized("\u06A9\u0627\u0631\u0628\u0631 \u062F\u0631 initData \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F.");
  const raw2 = {};
  for (const [k, v] of params.entries()) if (k !== "hash" && k !== "user") raw2[k] = v;
  return {
    user: {
      telegramId: user.id,
      username: user.username ?? null,
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      languageCode: user.language_code ?? null,
      allowsWriteToPm: Boolean(user.allows_write_to_pm ?? true),
      authDate
    },
    startParam: params.get("start_param"),
    queryId: params.get("query_id"),
    raw: raw2
  };
}
function checkWebhookSecret(header, expected) {
  if (!expected) return true;
  return typeof header === "string" && header === expected;
}
var MAX_AGE_SECONDS, encoder, toHex;
var init_telegram_auth = __esm({
  "apps/worker/src/core/telegram-auth.ts"() {
    "use strict";
    init_errors2();
    init_ids();
    MAX_AGE_SECONDS = 24 * 3600;
    encoder = new TextEncoder();
    toHex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
});

// apps/worker/src/core/format.ts
function toIso(seconds) {
  if (seconds === null || seconds === void 0) return null;
  return new Date(seconds * 1e3).toISOString();
}
function nowSeconds() {
  return Math.floor(Date.now() / 1e3);
}
function dayKey(seconds) {
  return new Date(seconds * 1e3).toISOString().slice(0, 10);
}
function humanDuration(seconds) {
  if (seconds <= 0) return "\u0627\u06A9\u0646\u0648\u0646";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d} \u0631\u0648\u0632 \u0648 ${h % 24} \u0633\u0627\u0639\u062A`;
  }
  if (h > 0) return `${h} \u0633\u0627\u0639\u062A \u0648 ${m} \u062F\u0642\u06CC\u0642\u0647`;
  if (m > 0) return `${m} \u062F\u0642\u06CC\u0642\u0647 \u0648 ${s} \u062B\u0627\u0646\u06CC\u0647`;
  return `${s} \u062B\u0627\u0646\u06CC\u0647`;
}
function truncate(text, max = 4e3) {
  return text.length <= max ? text : `${text.slice(0, max - 1)}\u2026`;
}
var init_format = __esm({
  "apps/worker/src/core/format.ts"() {
    "use strict";
  }
});

// apps/worker/src/bot/telegram.ts
var telegram_exports = {};
__export(telegram_exports, {
  TELEGRAM_API_BASE: () => TELEGRAM_API_BASE,
  TelegramApi: () => TelegramApi,
  coins: () => coins,
  configureTelegramApiBase: () => configureTelegramApiBase,
  escapeHtml: () => escapeHtml,
  inlineKeyboard: () => inlineKeyboard,
  telegramApiBase: () => telegramApiBase,
  twoColumns: () => twoColumns
});
function configureTelegramApiBase(base) {
  if (base && base.trim()) apiBase = base.trim().replace(/\/$/, "");
}
function telegramApiBase() {
  return apiBase;
}
function inlineKeyboard(rows) {
  return rows;
}
function twoColumns(items, lastFullRow) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  if (lastFullRow) rows.push([lastFullRow]);
  return rows;
}
function escapeHtml(text) {
  return String(text).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
}
var TELEGRAM_API_BASE, apiBase, TelegramApi, coins;
var init_telegram = __esm({
  "apps/worker/src/bot/telegram.ts"() {
    "use strict";
    init_format();
    TELEGRAM_API_BASE = "https://api.telegram.org";
    apiBase = TELEGRAM_API_BASE;
    TelegramApi = class {
      /**
       * @param apiBase official Bot API by default; configurable via TELEGRAM_API_BASE so a
       * network that cannot reach api.telegram.org can use its own telegram-bot-api server/relay.
       * @param fetchImpl NOT `= fetch`: calling an unbound reference to the global with the class
       * instance as `this` is rejected by workerd ("Illegal invocation"). The arrow keeps the
       * global receiver and still lets tests inject a stub.
       */
      constructor(token, apiBase2 = telegramApiBase(), fetchImpl = (input, init) => fetch(input, init)) {
        this.token = token;
        this.apiBase = apiBase2;
        this.fetchImpl = fetchImpl;
      }
      get enabled() {
        return Boolean(this.token);
      }
      async call(method, payload = {}) {
        if (!this.token) throw new Error("BOT_TOKEN is not configured");
        const res = await this.fetchImpl(`${(this.apiBase || TELEGRAM_API_BASE).replace(/\/+$/, "")}/bot${this.token}/${method}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!json.ok) {
          const err = new Error(`telegram ${method} failed: ${json.description ?? res.status}`);
          err.payload = json;
          throw err;
        }
        return json.result;
      }
      async sendMessage(chatId, text, opts = {}) {
        const reply_markup = {};
        if (opts.inline?.length) {
          reply_markup.inline_keyboard = opts.inline;
        } else if (opts.reply?.length) {
          reply_markup.keyboard = opts.reply;
          reply_markup.resize_keyboard = true;
          reply_markup.is_persistent = true;
        } else if (opts.removeReplyKeyboard) {
          reply_markup.remove_keyboard = true;
        }
        return this.call("sendMessage", {
          chat_id: chatId,
          text: truncate(text, 4e3),
          parse_mode: "HTML",
          disable_web_page_preview: opts.disablePreview !== false,
          ...Object.keys(reply_markup).length ? { reply_markup } : {}
        });
      }
      async editMessageText(chatId, messageId, text, inline) {
        try {
          return await this.call("editMessageText", {
            chat_id: chatId,
            message_id: messageId,
            text: truncate(text, 4e3),
            parse_mode: "HTML",
            ...inline?.length ? { reply_markup: { inline_keyboard: inline } } : {}
          });
        } catch {
          return null;
        }
      }
      async answerCallbackQuery(callbackQueryId, text, showAlert = false) {
        try {
          return await this.call("answerCallbackQuery", {
            callback_query_id: callbackQueryId,
            ...text ? { text: truncate(text, 190), show_alert: showAlert } : {}
          });
        } catch {
          return null;
        }
      }
      async setMyCommands(commands) {
        return this.call("setMyCommands", { commands, scope: { type: "default" } });
      }
      async setWebhook(url, secretToken) {
        return this.call("setWebhook", {
          url,
          secret_token: secretToken,
          drop_pending_updates: false,
          allowed_updates: ["message", "callback_query", "edited_message", "my_chat_member"]
        });
      }
      async deleteWebhook(dropPending = false) {
        return this.call("deleteWebhook", { drop_pending_updates: dropPending });
      }
      async getWebhookInfo() {
        return this.call("getWebhookInfo");
      }
      async getUpdates(offset = 0, limit = 25) {
        return this.call("getUpdates", { offset, limit, timeout: 0, allowed_updates: ["message", "callback_query"] });
      }
      async getMe() {
        return this.call("getMe");
      }
    };
    coins = (value) => `${value < 0 ? "-" : ""}${Math.abs(Math.round(value)).toLocaleString("en-US")} \u0633\u06A9\u0647`;
  }
});

// apps/worker/src/services/authService.ts
var authService_exports = {};
__export(authService_exports, {
  authenticateInitData: () => authenticateInitData,
  createSession: () => createSession,
  loadPermissions: () => loadPermissions,
  loadSessionUser: () => loadSessionUser,
  parseAdminIds: () => parseAdminIds,
  purgeExpiredSessions: () => purgeExpiredSessions,
  revokeSession: () => revokeSession,
  setActiveNation: () => setActiveNation,
  upsertTelegramUser: () => upsertTelegramUser
});
function parseAdminIds(env) {
  return new Set(
    (env.ADMIN_TELEGRAM_IDS ?? "").split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n) && n > 0)
  );
}
async function upsertTelegramUser(db, identity, env) {
  if (!identity.telegramId || identity.telegramId <= 0) throw ApiError.unauthorized("\u0634\u0646\u0627\u0633\u0647 \u062A\u0644\u06AF\u0631\u0627\u0645 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const now = nowSeconds();
  const adminIds = parseAdminIds(env);
  const shouldBeAdmin = adminIds.has(identity.telegramId);
  const existing = await db.first(
    sql`SELECT id, role, status, is_primary_admin FROM users WHERE telegram_user_id = ${identity.telegramId}`
  );
  if (existing) {
    await db.run(
      sql`UPDATE users SET username = ${identity.username ?? null}, first_name = ${identity.firstName ?? null},
               last_name = ${identity.lastName ?? null}, language_code = COALESCE(${identity.languageCode ?? null}, language_code),
               last_seen_at = ${now}, seen_count = seen_count + 1, updated_at = ${now}
           WHERE id = ${existing.id}`
    );
    let role2 = existing.role;
    if (shouldBeAdmin && role2 === "player") {
      await db.batch([
        sql`UPDATE users SET role = 'super_admin', updated_at = ${now} WHERE id = ${existing.id}`,
        sql`INSERT INTO user_roles (user_id, role, note, granted_by, is_active)
             VALUES (${existing.id}, 'super_admin', 'promoted from ADMIN_TELEGRAM_IDS', ${existing.id}, 1)
             ON CONFLICT (user_id, role) DO UPDATE SET is_active = 1, granted_at = ${now}`
      ]);
      role2 = "super_admin";
    }
    return { userId: existing.id, role: role2, status: existing.status, created: false };
  }
  const primary = shouldBeAdmin && adminIds.size > 0 ? Number([...adminIds][0]) === identity.telegramId : false;
  const role = shouldBeAdmin ? "super_admin" : "player";
  const inserted = await db.first(
    sql`INSERT INTO users (telegram_user_id, username, first_name, last_name, language_code, role, status, is_primary_admin, last_seen_at, seen_count, tos_accepted_at)
         VALUES (${identity.telegramId}, ${identity.username ?? null}, ${identity.firstName ?? null}, ${identity.lastName ?? null},
                 ${identity.languageCode ?? "fa"}, ${role}, 'active', ${primary ? 1 : 0}, ${now}, 1, ${now})
         RETURNING id`
  );
  const userId = inserted.id;
  await db.run(
    sql`INSERT INTO user_roles (user_id, role, note, granted_by, is_active)
         VALUES (${userId}, ${role}, 'bootstrap', NULL, 1)
         ON CONFLICT (user_id, role) DO UPDATE SET is_active = 1`
  );
  return { userId, role, status: "active", created: true };
}
async function createSession(db, user, meta) {
  const token = randomToken(32);
  const tokenHash = await sha256Hex(token);
  const now = nowSeconds();
  const expiresAt = now + SESSION_TTL_SECONDS;
  await db.run(
    sql`INSERT INTO sessions (token_hash, user_id, role, ip, user_agent, created_at, last_seen_at, expires_at)
         VALUES (${tokenHash}, ${user.userId}, ${user.role}, ${meta.ip ?? null}, ${meta.userAgent ? meta.userAgent.slice(0, 180) : null}, ${now}, ${now}, ${expiresAt})`
  );
  return { token, expiresAt };
}
async function loadSessionUser(db, token) {
  const tokenHash = await sha256Hex(token);
  const now = nowSeconds();
  const row = await db.first(
    sql`SELECT s.id AS session_id, s.expires_at, u.id AS user_id, u.telegram_user_id, u.role, u.status, u.username,
               u.is_primary_admin, s.active_nation_id AS session_active_nation_id
          FROM sessions s
          JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ${tokenHash} AND s.revoked_at IS NULL`
  );
  if (!row) return null;
  if (Number(row.expires_at) < now) {
    await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE id = ${row.session_id}`);
    return null;
  }
  const nations = await db.all(
    sql`SELECT id FROM nations WHERE owner_user_id = ${row.user_id} AND status <> 'dissolved' ORDER BY id`
  );
  const permissions = await loadPermissions(db, Number(row.user_id), row.role);
  await db.run(sql`UPDATE sessions SET last_seen_at = ${now} WHERE id = ${row.session_id}`);
  return {
    userId: Number(row.user_id),
    telegramId: Number(row.telegram_user_id),
    role: row.role,
    username: row.username ?? null,
    status: row.status,
    permissions,
    nationIds: nations.map((n) => n.id),
    activeNationId: activeNation(nations.map((n) => n.id), row.session_active_nation_id),
    sessionId: Number(row.session_id),
    isPrimaryAdmin: Number(row.is_primary_admin) === 1
  };
}
function activeNation(ids, preferred) {
  if (ids.length === 0) return null;
  const pref = Number(preferred);
  return ids.includes(pref) ? pref : ids[0];
}
async function loadPermissions(db, userId, role) {
  if (role === "super_admin") return {};
  const rows = await db.all(
    sql`SELECT resource, can_read, can_write FROM admin_permissions WHERE user_id = ${userId}`
  );
  const out = {};
  for (const r of rows) out[r.resource] = { read: r.can_read === 1, write: r.can_write === 1 };
  return out;
}
async function setActiveNation(db, userId, sessionId, nationId, nationIds) {
  if (!nationIds.includes(nationId)) throw ApiError.forbidden("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A.");
  await db.run(sql`UPDATE sessions SET active_nation_id = ${nationId} WHERE id = ${sessionId} AND user_id = ${userId}`);
  return { activeNationId: nationId };
}
async function revokeSession(db, userId, sessionId) {
  const now = nowSeconds();
  if (sessionId) await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE user_id = ${userId} AND id = ${sessionId}`);
  else await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE user_id = ${userId} AND revoked_at IS NULL`);
}
async function purgeExpiredSessions(db, now = nowSeconds()) {
  const r = await db.run(sql`UPDATE sessions SET revoked_at = ${now} WHERE revoked_at IS NULL AND expires_at < ${now}`);
  return r.meta.changes ?? 0;
}
async function authenticateInitData(db, env, initData, meta) {
  const { user } = await verifyInitDataFull(initData, env.BOT_TOKEN ?? "");
  const upsert = await upsertTelegramUser(db, user, env);
  if (upsert.status !== "active") {
    throw new ApiError("forbidden", upsert.status === "blocked" ? "\u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u0645\u0633\u062F\u0648\u062F \u0634\u062F\u0647 \u0627\u0633\u062A." : "\u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A.", 403);
  }
  const session = await createSession(db, upsert, meta);
  return { upsert, session };
}
var SESSION_TTL_SECONDS;
var init_authService = __esm({
  "apps/worker/src/services/authService.ts"() {
    "use strict";
    init_sql();
    init_errors2();
    init_ids();
    init_format();
    init_telegram_auth();
    SESSION_TTL_SECONDS = 7 * 24 * 3600;
  }
});

// apps/worker/src/game-engine/scoring.ts
var scoring_exports = {};
__export(scoring_exports, {
  computeEconomicScore: () => computeEconomicScore,
  computePower: () => computePower,
  roleOf: () => roleOf
});
function roleOf(categoryKey, fallback = "offense") {
  return ROLE_BY_CATEGORY[categoryKey] ?? fallback;
}
function computePower(rows, categoryWeights, opts = {}) {
  const manpowerFactor = opts.manpowerFactor ?? 0.2;
  const byCategory = {};
  let attackPower = 0;
  let defensePower = 0;
  let equipmentCount = 0;
  let troopsCount = 0;
  let radarCount = 0;
  let airDefenseUnits = 0;
  for (const row of rows) {
    const qty = Math.max(0, row.quantity);
    if (qty === 0) continue;
    const role = roleOf(row.categoryKey);
    const weight = Number(categoryWeights[row.categoryKey] ?? 0);
    const unitAttack = row.attackPoints ?? (role === "economy" ? 0 : weight);
    const unitDefense = row.defensePoints ?? (role === "economy" ? 0 : weight);
    const bucket = byCategory[row.categoryKey] ??= { quantity: 0, attack: 0, defense: 0 };
    let attack = 0;
    let defense = 0;
    if (row.categoryKey === "soldiers") {
      const per = row.attackPoints ?? manpowerFactor;
      attack = qty * per;
      defense = qty * (row.defensePoints ?? manpowerFactor);
      troopsCount += qty;
    } else if (role === "offense") {
      attack = qty * unitAttack;
      defense = qty * (row.defensePoints ?? 0);
    } else if (role === "defense") {
      defense = qty * unitDefense;
      attack = qty * (row.attackPoints ?? 0);
      airDefenseUnits += qty;
    } else if (role === "support") {
      attack = qty * unitAttack * 0.5;
      defense = qty * unitDefense;
      if (row.categoryKey === "radars") radarCount += qty;
    }
    if (row.categoryKey === "factories" || row.categoryKey === "mines") {
      attack = 0;
      defense = 0;
    }
    bucket.quantity += qty;
    bucket.attack += attack;
    bucket.defense += defense;
    attackPower += attack;
    defensePower += defense;
    if (role !== "economy" && row.categoryKey !== "soldiers") equipmentCount += qty;
  }
  const fortBonus = 1 + Math.max(0, opts.fortificationLevel ?? 0) * 0.02;
  defensePower *= fortBonus;
  for (const key of Object.keys(byCategory)) {
    byCategory[key] = {
      quantity: byCategory[key].quantity,
      attack: round2(byCategory[key].attack),
      defense: round2(byCategory[key].defense)
    };
  }
  return {
    attackPower: round2(attackPower),
    defensePower: round2(defensePower),
    militaryPower: round2(attackPower + defensePower),
    equipmentCount,
    troopsCount,
    radarCount,
    airDefenseUnits,
    byCategory
  };
}
function computeEconomicScore(input) {
  return round2(
    input.grossIncome * 0.5 + input.netIncome * 0.5 + (input.factories + input.mines) * 1e3 + input.treasury * 0.01
  );
}
function round2(v) {
  return Math.round(v * 100) / 100;
}
var ROLE_BY_CATEGORY;
var init_scoring = __esm({
  "apps/worker/src/game-engine/scoring.ts"() {
    "use strict";
    init_src();
    ROLE_BY_CATEGORY = Object.fromEntries(
      EQUIPMENT_CATEGORIES.map((c) => [c.key, c.role])
    );
  }
});

// apps/worker/src/game-engine/economy.ts
function computeCycleIncome(snap, rules) {
  const multiplier = clamp(rules.globalMultiplier, 0, 100);
  const flatFactories = snap.nullIncomeFactories ?? snap.factoryCount;
  const flatMines = snap.nullIncomeMines ?? snap.mineCount;
  const starterFlatFactories = snap.starterFlatFactories ?? snap.starterFactoryCount;
  const starterFlatMines = snap.starterFlatMines ?? snap.starterMineCount;
  const factoryFraction = snap.starterFactoryCount > 0 ? clamp(snap.factoryCount / snap.starterFactoryCount, 0, 1) : 1;
  const mineFraction = snap.starterMineCount > 0 ? clamp(snap.mineCount / snap.starterMineCount, 0, 1) : 1;
  const extraFactories = Math.max(0, flatFactories - starterFlatFactories);
  const extraMines = Math.max(0, flatMines - starterFlatMines);
  const templateFactoryIncome = Math.max(0, snap.templateFactoryIncome ?? 0);
  const templateMineIncome = Math.max(0, snap.templateMineIncome ?? 0);
  const baseFactoryIncome = snap.factoryIncome * factoryFraction;
  const baseMineIncome = snap.mineIncome * mineFraction;
  const factoryIncomeEffective = Math.max(
    0,
    Math.round((baseFactoryIncome + rules.factoryIncomePerUnit * extraFactories + templateFactoryIncome) * multiplier)
  );
  const mineIncomeEffective = Math.max(
    0,
    Math.round((baseMineIncome + rules.mineIncomePerUnit * extraMines + templateMineIncome) * multiplier)
  );
  const grossIncome = Math.max(0, factoryIncomeEffective + mineIncomeEffective);
  const taxRate = clamp(snap.taxRateOverride ?? rules.taxRate, 0, 0.95);
  const taxCost = Math.floor(grossIncome * taxRate);
  const maintenanceCost = Math.floor(grossIncome * clamp(rules.maintenanceRate, 0, 0.95)) + Math.max(0, snap.upkeepBase) + Math.max(0, snap.perUnitMaintenance) + Math.max(0, snap.policeUpkeep ?? 0);
  const netIncome = grossIncome - taxCost - maintenanceCost;
  const cycleSeconds = Math.max(60, snap.cycleSecondsOverride ?? rules.incomeCycleSeconds);
  return { factoryIncomeEffective, mineIncomeEffective, grossIncome, taxCost, maintenanceCost, netIncome, cycleSeconds };
}
function clamp(v, min, max) {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}
var init_economy = __esm({
  "apps/worker/src/game-engine/economy.ts"() {
    "use strict";
  }
});

// apps/worker/src/game-engine/ranking.ts
function rankNations(nations, weights = {}, orderBy = "total") {
  const max = {};
  for (const m of RANKING_METRICS) {
    max[m] = nations.reduce((acc, n) => Math.max(acc, metricOf(n, m) || 0), 0) || 1;
  }
  const scored = nations.map((n) => {
    const metrics = {};
    let total = 0;
    for (const m of RANKING_METRICS) {
      const w = weights[m] ?? 1;
      const normalized = max[m] > 0 ? metricOf(n, m) / max[m] : 0;
      metrics[m] = Math.round(normalized * 1e4) / 1e4;
      total += normalized * w * 1e3;
    }
    return { ...n, metrics, score: Math.round(total * 100) / 100 };
  });
  const sorted = [...scored].sort((a, b) => {
    const key = orderBy === "total" ? b.score - a.score : metricOf(b, orderBy) - metricOf(a, orderBy);
    return key !== 0 ? key : a.nationId - b.nationId;
  });
  return sorted.map((n, i) => ({ ...n, rank: i + 1 }));
}
function metricOf(n, m) {
  switch (m) {
    case "treasury":
      return n.treasury;
    case "military_power":
      return n.militaryPower;
    case "income":
      return n.income;
    case "equipment_count":
      return n.equipmentCount;
    case "war_wins":
      return n.warWins;
    case "economic_score":
      return n.economicScore;
    default:
      return 0;
  }
}
var init_ranking = __esm({
  "apps/worker/src/game-engine/ranking.ts"() {
    "use strict";
    init_src();
  }
});

// apps/worker/src/db/queries.ts
var queries_exports = {};
__export(queries_exports, {
  POLICE_UPKEEP_PER_DAY: () => POLICE_UPKEEP_PER_DAY,
  assertNationAccess: () => assertNationAccess,
  categoryQuantities: () => categoryQuantities,
  computeNation: () => computeNation,
  ensureNationExt: () => ensureNationExt,
  loadCategoryWeights: () => loadCategoryWeights,
  loadEconomyRow: () => loadEconomyRow,
  loadInventory: () => loadInventory,
  loadNation: () => loadNation,
  loadNationOwnedBy: () => loadNationOwnedBy,
  loadSettingsForNation: () => loadSettingsForNation,
  mapNationSummary: () => mapNationSummary,
  perUnitMaintenance: () => perUnitMaintenance,
  recomputeRankings: () => recomputeRankings,
  refreshNationStats: () => refreshNationStats,
  relationCounts: () => relationCounts,
  relationLabel: () => relationLabel,
  templateIncomeSums: () => templateIncomeSums,
  txLabel: () => txLabel,
  warLabel: () => warLabel
});
async function loadNation(db, nationId) {
  const row = await db.first(sql`SELECT * FROM nations WHERE id = ${nationId}`);
  if (!row) throw ApiError.notFound("\u06A9\u0634\u0648\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  return row;
}
async function loadNationOwnedBy(db, userId, preferId) {
  if (preferId) {
    const own = await db.first(sql`SELECT * FROM nations WHERE id = ${preferId} AND owner_user_id = ${userId}`);
    if (own) return own;
  }
  return db.first(sql`SELECT * FROM nations WHERE owner_user_id = ${userId} AND status <> 'dissolved' ORDER BY id LIMIT 1`);
}
async function assertNationAccess(user, db, nationId) {
  const ok = await db.first(
    sql`SELECT COUNT(*) AS c FROM nations WHERE id = ${nationId} AND owner_user_id = ${user.userId}`
  );
  if (!ok || Number(ok.c) === 0) throw ApiError.forbidden("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A.");
}
async function loadInventory(db, nationId) {
  const rows = await db.all(
    sql`SELECT i.id AS id, t.id AS templateId, t.code AS code, t.name_fa AS nameFa, t.unit_fa AS unitFa,
               t.price AS price, t.attack_points AS attackPoints, t.defense_points AS defensePoints,
               t.description AS description, t.is_for_sale AS is_for_sale, t.is_active AS is_active,
               t.purchase_limit_per_cycle AS purchase_limit_per_cycle, t.maintenance_per_unit AS maintenance_per_unit,
               c.key AS categoryKey, c.label_fa AS categoryLabelFa, c.emoji AS emoji,
               i.quantity AS quantity, i.updated_at AS updated_at
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.nation_id = ${nationId} AND t.is_active = 1
         ORDER BY c.sort_order, t.name_fa`
  );
  return rows;
}
async function loadCategoryWeights(db) {
  const rows = await db.all(sql`SELECT key, power_weight FROM equipment_categories`);
  return Object.fromEntries(rows.map((r) => [r.key, Number(r.power_weight)]));
}
async function loadEconomyRow(db, nationId) {
  return db.first(
    sql`SELECT nation_id, factory_income, mine_income, starter_factory_count, starter_mine_count,
               upkeep_base, gross_income, maintenance_cost, tax_cost, net_income,
               total_income, total_spent, total_tax, war_loss_total,
               starter_factory_template_income, starter_mine_template_income,
               starter_flat_factories, starter_flat_mines
          FROM nation_economy WHERE nation_id = ${nationId}`
  );
}
async function loadSettingsForNation(db, nationId) {
  return db.first(
    sql`SELECT income_cycle_seconds, tax_rate_override, defense_mode, fortification_level FROM nation_settings WHERE nation_id = ${nationId}`
  );
}
async function ensureNationExt(db, nationId) {
  await db.run(
    sql`INSERT OR IGNORE INTO nation_state_ext (nation_id) VALUES (${nationId})`
  );
  return db.first(
    sql`SELECT nation_id, police, border_level, infra_level, education_level, housing_level, hospital_level,
               fuel_level, ammo_level, equipment_health
          FROM nation_state_ext WHERE nation_id = ${nationId}`
  );
}
async function templateIncomeSums(db, nationId) {
  const factories = await db.first(
    sql`SELECT COALESCE(SUM(t.income_per_cycle * COALESCE(l.level, 1) * i.quantity), 0) AS tpl,
               COALESCE(SUM(CASE WHEN t.income_per_cycle IS NULL THEN i.quantity ELSE 0 END), 0) AS flat
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nationId} AND c.key = 'factories'`
  );
  const mines = await db.first(
    sql`SELECT COALESCE(SUM(t.income_per_cycle * i.quantity), 0) AS tpl,
               COALESCE(SUM(CASE WHEN t.income_per_cycle IS NULL THEN i.quantity ELSE 0 END), 0) AS flat
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.nation_id = ${nationId} AND c.key = 'mines'`
  );
  return {
    templateFactoryIncome: Number(factories?.tpl ?? 0),
    templateMineIncome: Number(mines?.tpl ?? 0),
    nullIncomeFactories: Number(factories?.flat ?? 0),
    nullIncomeMines: Number(mines?.flat ?? 0)
  };
}
function categoryQuantities(rows) {
  const out = {};
  for (const r of rows) out[r.categoryKey] = (out[r.categoryKey] ?? 0) + Math.max(0, r.quantity);
  return out;
}
async function perUnitMaintenance(db, nationId, rules) {
  const row = await db.first(
    sql`SELECT COALESCE(SUM(COALESCE(t.maintenance_per_unit, 0) * i.quantity), 0) AS total
          FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
         WHERE i.nation_id = ${nationId}`
  );
  const byCategory = await db.all(
    sql`SELECT c.key AS category_key, SUM(i.quantity) AS qty
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.nation_id = ${nationId} GROUP BY c.key`
  );
  let extra = 0;
  for (const b of byCategory) extra += (rules.maintenancePerUnit[b.category_key] ?? 0) * Number(b.qty);
  return Math.round(Number(row?.total ?? 0) + extra);
}
async function computeNation(db, nation, settings, opts = {}) {
  const inventory = await loadInventory(db, nation.id);
  const weights = await loadCategoryWeights(db);
  const economyRow = await loadEconomyRow(db, nation.id);
  const nationSettings = await loadSettingsForNation(db, nation.id);
  const factoryCount = inventory.filter((i) => i.categoryKey === "factories").reduce((s, i) => s + i.quantity, 0);
  const mineCount = inventory.filter((i) => i.categoryKey === "mines").reduce((s, i) => s + i.quantity, 0);
  const perUnit = opts.forceZeroMaintenance ? 0 : await perUnitMaintenance(db, nation.id, settings.economy);
  const tplIncome = await templateIncomeSums(db, nation.id);
  const ext = await ensureNationExt(db, nation.id);
  const snap = {
    factoryIncome: Number(economyRow?.factory_income ?? 0),
    mineIncome: Number(economyRow?.mine_income ?? 0),
    starterFactoryCount: Number(economyRow?.starter_factory_count ?? 0),
    starterMineCount: Number(economyRow?.starter_mine_count ?? 0),
    factoryCount,
    mineCount,
    upkeepBase: Number(economyRow?.upkeep_base ?? 0),
    perUnitMaintenance: perUnit,
    taxRateOverride: nationSettings?.tax_rate_override ?? null,
    cycleSecondsOverride: nationSettings?.income_cycle_seconds ?? null,
    templateFactoryIncome: Math.max(0, tplIncome.templateFactoryIncome - Number(economyRow?.starter_factory_template_income ?? 0)),
    templateMineIncome: Math.max(0, tplIncome.templateMineIncome - Number(economyRow?.starter_mine_template_income ?? 0)),
    nullIncomeFactories: tplIncome.nullIncomeFactories,
    nullIncomeMines: tplIncome.nullIncomeMines,
    policeUpkeep: Math.max(0, Number(ext?.police ?? 0) * POLICE_UPKEEP_PER_DAY),
    starterFlatFactories: economyRow?.starter_flat_factories ?? null,
    starterFlatMines: economyRow?.starter_flat_mines ?? null
  };
  const income = computeCycleIncome(snap, settings.economy);
  const power = computePower(inventory, weights, {
    manpowerFactor: settings.battle.manpowerFactor,
    fortificationLevel: nationSettings?.fortification_level ?? 0
  });
  const economicScore = computeEconomicScore({
    treasury: nation.treasury,
    grossIncome: income.grossIncome,
    netIncome: income.netIncome,
    factories: factoryCount,
    mines: mineCount
  });
  return { income, power, economicScore, factoryCount, mineCount };
}
async function refreshNationStats(db, nation, settings) {
  const computed = await computeNation(db, nation, settings);
  await db.batch([
    sql`UPDATE nations SET military_power = ${computed.power.militaryPower}, economic_score = ${computed.economicScore},
               equipment_count = ${computed.power.equipmentCount}, troops_count = ${computed.power.troopsCount},
               updated_at = ${nowSeconds()}
           WHERE id = ${nation.id}`,
    sql`UPDATE nation_economy SET gross_income = ${computed.income.grossIncome}, tax_cost = ${computed.income.taxCost},
               maintenance_cost = ${computed.income.maintenanceCost}, net_income = ${computed.income.netIncome},
               updated_at = ${nowSeconds()}
           WHERE nation_id = ${nation.id}`
  ]);
  return computed;
}
async function recomputeRankings(db, settings, chunkSize = 80) {
  const rows = await db.all(
    sql`SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
               n.equipment_count, n.wins_count, e.net_income
          FROM nations n LEFT JOIN nation_economy e ON e.nation_id = n.id
         WHERE n.status <> 'dissolved'`
  );
  const ranked = rankNations(
    rows.map((n) => ({
      nationId: n.id,
      name: n.name,
      flag: n.flag,
      leaderName: n.leader_name,
      treasury: Number(n.treasury),
      income: Number(n.net_income ?? 0),
      militaryPower: Number(n.military_power),
      equipmentCount: Number(n.equipment_count),
      warWins: Number(n.wins_count),
      economicScore: Number(n.economic_score)
    })),
    settings.rankingWeights
  );
  const stmts = [];
  for (let i = 0; i < ranked.length; i += chunkSize) {
    const chunk = ranked.slice(i, i + chunkSize);
    const whenRank = chunk.map((r) => `WHEN ${Number(r.nationId)} THEN ${r.rank}`).join(" ");
    const whenScore = chunk.map((r) => `WHEN ${Number(r.nationId)} THEN ${Number(r.score).toFixed(2)}`).join(" ");
    const ids = chunk.map((r) => Number(r.nationId));
    stmts.push({
      sql: `UPDATE nations SET world_rank = CASE id ${whenRank} ELSE world_rank END,
                                   total_score = CASE id ${whenScore} ELSE total_score END
              WHERE id IN (${ids.map(() => "?").join(", ")})`,
      bindings: ids
    });
  }
  if (stmts.length) await db.batch(stmts);
  return ranked.length;
}
function mapNationSummary(n, extra = { incomePerCycle: 0, allies: 0, enemies: 0 }) {
  return {
    id: n.id,
    name: n.name,
    flag: n.flag,
    leaderName: n.leader_name,
    status: n.status,
    treasury: Number(n.treasury),
    incomePerCycle: Math.round(extra.incomePerCycle),
    militaryPower: Number(n.military_power),
    economicScore: Number(n.economic_score),
    totalScore: Number(n.total_score),
    worldRank: Number(n.world_rank),
    alliesCount: extra.allies || Number(n.allies_count),
    enemiesCount: extra.enemies || Number(n.enemies_count),
    warsCount: Number(n.wars_count),
    winsCount: Number(n.wins_count),
    lossesCount: Number(n.losses_count),
    equipmentCount: Number(n.equipment_count),
    troopsCount: Number(n.troops_count),
    createdAt: toIso(n.created_at) ?? ""
  };
}
async function relationCounts(db, nationId) {
  const rows = await db.all(
    sql`SELECT status, COUNT(*) AS c FROM diplomatic_relations WHERE nation_id = ${nationId} GROUP BY status`
  );
  const map = {};
  for (const r of rows) map[r.status] = Number(r.c);
  return {
    allies: (map.ally ?? 0) + (map.friend ?? 0),
    enemies: map.enemy ?? 0,
    neutral: map.neutral ?? 0,
    negotiating: map.negotiating ?? 0,
    peace: map.peace_treaty ?? 0
  };
}
var POLICE_UPKEEP_PER_DAY, relationLabel, txLabel, warLabel;
var init_queries = __esm({
  "apps/worker/src/db/queries.ts"() {
    "use strict";
    init_src();
    init_sql();
    init_errors2();
    init_format();
    init_scoring();
    init_economy();
    init_ranking();
    POLICE_UPKEEP_PER_DAY = 150;
    relationLabel = (status) => RELATION_LABELS_FA[status] ?? status;
    txLabel = (type) => TRANSACTION_TYPE_LABELS_FA[type] ?? type;
    warLabel = (status) => WAR_STATUS_LABELS_FA[status] ?? status;
  }
});

// apps/worker/src/services/auditService.ts
function safeJson(value) {
  if (value === void 0 || value === null) return null;
  try {
    const s = JSON.stringify(value);
    return s.length > MAX_JSON ? s.slice(0, MAX_JSON) + "\u2026" : s;
  } catch {
    return null;
  }
}
async function audit(db, input) {
  const now = nowSeconds();
  await db.run(
    sql`INSERT INTO audit_logs (actor_user_id, actor_telegram_id, action, target_type, target_id, before_json, after_json, reason, ip, created_at)
         VALUES (${input.actor?.userId ?? null}, ${input.actor?.telegramId ?? null}, ${input.action},
                 ${input.targetType ?? null}, ${typeof input.targetId === "number" ? input.targetId : null},
                 ${safeJson(input.before)}, ${safeJson(input.after)}, ${input.reason ?? null}, ${input.ip ?? null}, ${now})`
  );
}
var MAX_JSON;
var init_auditService = __esm({
  "apps/worker/src/services/auditService.ts"() {
    "use strict";
    init_sql();
    init_format();
    MAX_JSON = 4e3;
  }
});

// apps/worker/src/services/notificationService.ts
async function notify(db, input) {
  const now = nowSeconds();
  const user = await db.first(sql`SELECT owner_user_id AS user_id FROM nations WHERE id = ${input.nationId}`);
  const row = await db.first(
    sql`INSERT INTO notifications (nation_id, user_id, kind, title, body, data, is_read, created_at)
         VALUES (${input.nationId}, ${user?.user_id ?? null}, ${input.kind}, ${input.title}, ${input.body},
                 ${input.data ? JSON.stringify(input.data).slice(0, 2e3) : null}, 0, ${now})
         RETURNING id`
  );
  if (input.telegram?.botToken) {
    await deliverTelegram(input.telegram.botToken, input.telegram.chatId, input.telegram.text, input.telegram.apiBase);
  }
  return row?.id ?? 0;
}
async function listNotifications(db, nationId, limit = 30) {
  return db.all(
    sql`SELECT id, kind, title, body, data, is_read, created_at
          FROM notifications WHERE nation_id = ${nationId}
         ORDER BY id DESC LIMIT ${Math.min(100, Math.max(1, limit))}`
  );
}
async function unreadCount(db, nationIds) {
  if (nationIds.length === 0) return 0;
  const row = await db.first(
    sql`SELECT COUNT(*) AS c FROM notifications WHERE nation_id IN (${nationIds}) AND is_read = 0`
  );
  return Number(row?.c ?? 0);
}
async function markRead(db, nationIds, id) {
  const now = nowSeconds();
  if (id) {
    await db.run(sql`UPDATE notifications SET is_read = 1, read_at = ${now} WHERE id = ${id} AND nation_id IN (${nationIds})`);
    return;
  }
  await db.run(sql`UPDATE notifications SET is_read = 1, read_at = ${now} WHERE nation_id IN (${nationIds}) AND is_read = 0`);
}
async function deliverTelegram(botToken, chatId, text, apiBase2) {
  try {
    await new TelegramApi(botToken, apiBase2).sendMessage(chatId, text.slice(0, 4e3), { disablePreview: true });
  } catch {
  }
}
var init_notificationService = __esm({
  "apps/worker/src/services/notificationService.ts"() {
    "use strict";
    init_sql();
    init_format();
    init_telegram();
  }
});

// apps/worker/src/game-engine/battle.ts
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = a + 1831565813 >>> 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function previewBattle(attacker, defender, params) {
  const att = attacker.attackPower * params.attackerAdvantage;
  const def = defender.defensePower * params.defenderAdvantage * (1 + clamp(defender.fortificationLevel, 0, 20) * 0.02) * (1 + clamp(defender.allianceSupport, 0, 1));
  const chance = att + def <= 0 ? 0.5 : att / (att + def);
  const ratio = att + def <= 0 ? 1 : att / Math.max(att, def);
  const expectedRounds = Math.max(1, Math.min(params.maxRounds, Math.round(params.maxRounds * (1 - clamp(ratio, 0, 1) * 0.6))));
  const lossPercent = clamp(params.damagePerRound * 100 * expectedRounds * (1 - chance), 0, 90);
  return {
    attackerWinChance: round4(chance),
    defenderWinChance: round4(1 - chance),
    expectedRounds,
    expectedLossPercent: Math.round(lossPercent),
    entryCost: Math.round(attacker.treasury * clamp(params.warEntryTaxRate, 0, 0.5)),
    suggestedIndemnity: Math.round((att + def) * 0.05 * params.indemnityPerPoint)
  };
}
function simulateBattle(input) {
  const { attacker, defender, params, seed } = input;
  const rng = mulberry32(seed >>> 0);
  const roundsToRun = input.rounds ?? params.maxRounds;
  let attRemaining = Math.max(0, attacker.attackPower);
  let defRemaining = Math.max(0, defender.defensePower * (1 + clamp(defender.fortificationLevel, 0, 20) * 0.02) * (1 + clamp(defender.allianceSupport, 0, 1) * params.radarSupportBonus * 4));
  const attStart = Math.max(1, attRemaining);
  const defStart = Math.max(1, defRemaining);
  let attLostTotal = 0;
  let defLostTotal = 0;
  const rounds = [];
  const rolls = [];
  const breakdownAtt = input.attackerCategories ?? {};
  const breakdownDef = input.defenderCategories ?? {};
  let attCatRatio = 0;
  let defCatRatio = 0;
  for (let roundNo = 1; roundNo <= roundsToRun; roundNo++) {
    const rAtt = rng();
    const rDef = rng();
    rolls.push(Math.round(rAtt * 1e4) / 1e4);
    const attPower = attRemaining * params.attackerAdvantage * (1 + (rAtt * 2 - 1) * params.warRandomness) * clamp(attacker.morale, 0.5, 1.5);
    const defPower = defRemaining * params.defenderAdvantage * (1 + (rDef * 2 - 1) * params.warRandomness) * clamp(defender.morale, 0.5, 1.5);
    const chance = attPower + defPower <= 0 ? 0.5 : attPower / (attPower + defPower);
    const roll = rng();
    rolls.push(Math.round(roll * 1e4) / 1e4);
    const attackerWonRound = roll < chance;
    const margin = attPower + defPower === 0 ? 0 : Math.abs(attPower - defPower) / (attPower + defPower);
    const damage = clamp(params.damagePerRound * (1 + margin), 5e-3, 0.6);
    let attackerLosses = 0;
    let defenderLosses = 0;
    if (attackerWonRound) {
      defenderLosses = defRemaining * damage;
      defRemaining = Math.max(0, defRemaining - defenderLosses);
      defLostTotal += defenderLosses;
      defCatRatio = defStart > 0 ? defLostTotal / defStart : 0;
    } else {
      attackerLosses = attRemaining * damage;
      attRemaining = Math.max(0, attRemaining - attackerLosses);
      attLostTotal += attackerLosses;
      attCatRatio = attStart > 0 ? attLostTotal / attStart : 0;
    }
    const attrition = damage * 0.35;
    if (attackerWonRound) {
      const l = attRemaining * attrition;
      attRemaining = Math.max(0, attRemaining - l);
      attLostTotal += l;
      attCatRatio = attStart > 0 ? attLostTotal / attStart : 0;
      attackerLosses += l;
    } else {
      const l = defRemaining * attrition;
      defRemaining = Math.max(0, defRemaining - l);
      defLostTotal += l;
      defCatRatio = defStart > 0 ? defLostTotal / defStart : 0;
      defenderLosses += l;
    }
    rounds.push({
      roundNo,
      attackerPower: round22(attPower),
      defenderPower: round22(defPower),
      attackerWinChance: round4(chance),
      attackerWonRound,
      attackerLosses: round22(attackerLosses),
      defenderLosses: round22(defenderLosses),
      attackerRemaining: round22(attRemaining),
      defenderRemaining: round22(defRemaining)
    });
    if (attRemaining <= attStart * 0.1 || defRemaining <= defStart * 0.1) break;
  }
  const finished = attRemaining <= attStart * 0.1 || defRemaining <= defStart * 0.1 || rounds.length >= params.maxRounds;
  let winner = null;
  if (attRemaining <= attStart * 0.1 && defRemaining <= defStart * 0.1) winner = "draw";
  else if (attRemaining <= attStart * 0.1) winner = "defender";
  else if (defRemaining <= defStart * 0.1) winner = "attacker";
  else if (rounds.length >= params.maxRounds || rounds.length >= roundsToRun) {
    if (Math.abs(attRemaining / attStart - defRemaining / defStart) < 0.01) winner = "draw";
    else winner = attRemaining / attStart > defRemaining / defStart ? "attacker" : "defender";
  }
  const loserRemainingRatio = winner === "attacker" ? defRemaining / defStart : winner === "defender" ? attRemaining / attStart : 0;
  const destroyedPower = winner === "draw" ? attLostTotal + defLostTotal : (attStart + defStart) * (1 - loserRemainingRatio) * 0.5;
  const indemnity = Math.max(0, Math.round(destroyedPower * params.indemnityPerPoint));
  return {
    finished,
    winner,
    rounds,
    attackerRemaining: round22(attRemaining),
    defenderRemaining: round22(defRemaining),
    attackerLosses: round22(attLostTotal),
    defenderLosses: round22(defLostTotal),
    attackerLossRatio: round4(clamp(attCatRatio, 0, 1)),
    defenderLossRatio: round4(clamp(defCatRatio, 0, 1)),
    attackerLossesByCategory: allocateLosses(breakdownAtt, attCatRatio),
    defenderLossesByCategory: allocateLosses(breakdownDef, defCatRatio),
    indemnity,
    rolls
  };
}
function allocateLosses(categories, ratio) {
  const out = {};
  const r = clamp(ratio, 0, 1);
  for (const [key, qty] of Object.entries(categories)) {
    const lost = qty > 0 ? Math.min(qty, Math.floor(qty * r)) : 0;
    if (lost > 0) out[key] = lost;
  }
  return out;
}
function round22(v) {
  return Math.round(v * 100) / 100;
}
function round4(v) {
  return Math.round(v * 1e4) / 1e4;
}
var init_battle = __esm({
  "apps/worker/src/game-engine/battle.ts"() {
    "use strict";
    init_economy();
  }
});

// apps/worker/src/services/warService.ts
var warService_exports = {};
__export(warService_exports, {
  adminStopWar: () => adminStopWar,
  defenseCombatantOf: () => defenseCombatantOf,
  expireProposal: () => expireProposal,
  finalizeWar: () => finalizeWar,
  getWarDetail: () => getWarDetail,
  getWarsForNation: () => getWarsForNation,
  listDueWars: () => listDueWars,
  listExpiredProposals: () => listExpiredProposals,
  listNations: () => listNations,
  listOverdueWars: () => listOverdueWars,
  loadDefensePlan: () => loadDefensePlan,
  mapWar: () => mapWar,
  normalizeAttackPlan: () => normalizeAttackPlan,
  proposeWar: () => proposeWar,
  requestPeace: () => requestPeace,
  resolveAttackPlan: () => resolveAttackPlan,
  resolveRound: () => resolveRound,
  respondPeace: () => respondPeace,
  respondToWar: () => respondToWar,
  validateAttackPlan: () => validateAttackPlan
});
async function loadWar(db, warId) {
  const row = await db.first(
    sql`SELECT w.*, a.name AS attacker_name, a.flag AS attacker_flag, d.name AS defender_name, d.flag AS defender_flag
          FROM wars w
          JOIN nations a ON a.id = w.attacker_nation_id
          JOIN nations d ON d.id = w.defender_nation_id
         WHERE w.id = ${warId}`
  );
  if (!row) throw ApiError.notFound("\u062C\u0646\u06AF \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  return row;
}
function normalizeAttackPlan(raw2) {
  if (raw2 === null || raw2 === void 0) return null;
  const list = Array.isArray(raw2) ? raw2 : [];
  const merged = /* @__PURE__ */ new Map();
  for (const item of list) {
    const templateId = Number(item?.templateId);
    const quantity = Number(item?.quantity);
    if (!Number.isFinite(templateId) || !Number.isFinite(quantity)) throw ApiError.validation("\u0622\u0631\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
    if (templateId <= 0 || quantity <= 0) throw ApiError.validation("\u0622\u0631\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
    const qty = Math.floor(quantity);
    merged.set(Math.floor(templateId), (merged.get(Math.floor(templateId)) ?? 0) + qty);
  }
  const entries = [...merged.entries()].map(([templateId, quantity]) => ({ templateId, quantity }));
  if (entries.length === 0) return null;
  if (entries.length > 40 || entries.reduce((n, e) => n + e.quantity, 0) > 1e5) {
    throw ApiError.validation("\u0622\u0631\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0628\u0632\u0631\u06AF \u0627\u0633\u062A.");
  }
  return entries;
}
async function validateAttackPlan(db, nationId, plan) {
  const inventory = await loadInventory(db, nationId);
  const byId = new Map(inventory.map((i) => [i.templateId, i]));
  for (const e of plan) {
    const have = byId.get(e.templateId);
    if (!have || have.quantity < e.quantity) {
      throw ApiError.validation("\u062A\u0639\u062F\u0627\u062F \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0627\u0632 \u0645\u0648\u062C\u0648\u062F\u06CC \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0628\u06CC\u0634\u062A\u0631 \u0627\u0633\u062A.", { templateId: e.templateId });
    }
  }
  return byId;
}
async function committedCombatantOf(db, nation, settings, plan) {
  const inventory = await loadInventory(db, nation.id);
  const committed = plan.map((e) => {
    const inv = inventory.find((i) => i.templateId === e.templateId);
    if (!inv) return null;
    return {
      templateId: e.templateId,
      categoryKey: inv.categoryKey,
      quantity: Math.min(e.quantity, inv.quantity),
      attackPoints: inv.attackPoints,
      defensePoints: inv.defensePoints
    };
  }).filter((r) => r !== null && r.quantity > 0);
  if (committed.length === 0) {
    return { nationId: nation.id, attackPower: 0, defensePower: 0, troopsCount: 0, equipmentCount: 0, treasury: nation.treasury, allianceSupport: 0, fortificationLevel: 0, morale: 1, categories: {} };
  }
  const weights = await loadCategoryWeights(db);
  const power = computePower(committed, weights, { manpowerFactor: settings.battle.manpowerFactor, fortificationLevel: 0 });
  const categories = {};
  for (const r of committed) categories[r.categoryKey] = (categories[r.categoryKey] ?? 0) + r.quantity;
  return {
    nationId: nation.id,
    attackPower: power.attackPower,
    defensePower: power.defensePower,
    troopsCount: power.troopsCount,
    equipmentCount: power.equipmentCount,
    treasury: nation.treasury,
    allianceSupport: 0,
    fortificationLevel: 0,
    morale: 1,
    categories
  };
}
function parseAttackPlan(raw2) {
  if (!raw2) return null;
  try {
    const parsed = JSON.parse(raw2);
    if (Array.isArray(parsed) && parsed.length === 0) return [];
    return normalizeAttackPlan(parsed);
  } catch {
    return null;
  }
}
async function resolveAttackPlan(db, plan) {
  const out = [];
  for (const e of plan) {
    const t = await db.first(
      sql`SELECT t.name_fa, c.emoji AS emoji, c.key AS categoryKey
            FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id WHERE t.id = ${e.templateId}`
    );
    out.push({ templateId: e.templateId, quantity: e.quantity, categoryKey: t?.categoryKey ?? "", nameFa: t?.name_fa ?? `#${e.templateId}`, emoji: t?.emoji ?? "\u{1F396}\uFE0F" });
  }
  return out;
}
async function applyCommittedLosses(db, nationId, plan, lossesByCategory, at) {
  const inventory = await loadInventory(db, nationId);
  const invByTemplate = new Map(inventory.map((i) => [i.templateId, i]));
  const byCat = /* @__PURE__ */ new Map();
  for (const entry of plan) {
    const inv = invByTemplate.get(entry.templateId);
    if (!inv) continue;
    const list = byCat.get(inv.categoryKey) ?? [];
    list.push(entry);
    byCat.set(inv.categoryKey, list);
  }
  const stmts = [];
  const remaining2 = [];
  for (const [cat, entries] of byCat) {
    const available = entries.map((e) => Math.min(e.quantity, invByTemplate.get(e.templateId).quantity));
    const availTotal = available.reduce((a, b) => a + b, 0);
    const want = Math.min(availTotal, Math.max(0, Math.floor(Number(lossesByCategory[cat] ?? 0))));
    if (want <= 0) {
      for (const e of entries) if (e.quantity > 0) remaining2.push({ templateId: e.templateId, quantity: e.quantity });
      continue;
    }
    const raw2 = available.map((a) => availTotal > 0 ? want * a / availTotal : 0);
    const alloc = raw2.map(Math.floor);
    const leftover = want - alloc.reduce((a, b) => a + b, 0);
    [...raw2.keys()].map((i) => [raw2[i] - alloc[i], i]).sort((a, b) => b[0] - a[0]).slice(0, leftover).forEach(([, i]) => alloc[i] = alloc[i] + 1);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const inv = invByTemplate.get(entry.templateId);
      const lost = Math.min(alloc[i] ?? 0, entry.quantity, inv.quantity);
      const left = Math.max(0, entry.quantity - lost);
      if (lost > 0) {
        stmts.push(sql`UPDATE nation_inventory SET quantity = MAX(0, quantity - ${lost}), updated_at = ${at} WHERE id = ${inv.id}`);
      }
      if (left > 0) remaining2.push({ templateId: entry.templateId, quantity: left });
    }
  }
  if (stmts.length) await db.batch(stmts);
  return remaining2;
}
async function loadDefensePlan(db, nationId) {
  const ns = await db.first(
    sql`SELECT defense_plan FROM nation_settings WHERE nation_id = ${nationId}`
  );
  const raw2 = ns?.defense_plan;
  if (!raw2) return null;
  try {
    const parsed = JSON.parse(raw2);
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.filter((k) => typeof k === "string" && DEFENSE_ARRANGEMENT_KEYS.includes(k));
    return valid;
  } catch {
    return null;
  }
}
async function expandDefensePlan(db, nationId, plan) {
  const catKeys = plan.filter((k) => k !== DEFENSE_FORTIFICATION_TOKEN);
  if (catKeys.length === 0) return [];
  const inventory = await loadInventory(db, nationId);
  const allow = new Set(catKeys);
  return inventory.filter((i) => allow.has(i.categoryKey) && i.quantity > 0).map((i) => ({ templateId: i.templateId, categoryKey: i.categoryKey, quantity: i.quantity, attackPoints: i.attackPoints, defensePoints: i.defensePoints }));
}
async function defenseCombatantOf(db, nation, settings) {
  const plan = await loadDefensePlan(db, nation.id);
  if (!plan) return combatantOf(db, nation, settings, "defender");
  const allies = await db.all(
    sql`SELECT n.military_power
          FROM alliance_members am
          JOIN alliance_members am2 ON am2.alliance_id = am.alliance_id
          JOIN nations n ON n.id = am2.nation_id
         WHERE am.nation_id = ${nation.id} AND n.id <> ${nation.id} AND n.status = 'active'
         LIMIT 10`
  );
  const ns = await db.first(
    sql`SELECT fortification_level, defense_mode FROM nation_settings WHERE nation_id = ${nation.id}`
  );
  const fortificationLevel = plan.includes(DEFENSE_FORTIFICATION_TOKEN) ? ns?.fortification_level ?? 0 : 0;
  const morale = ns?.defense_mode === "fortified" ? 1.1 : 1;
  const units = await expandDefensePlan(db, nation.id, plan);
  const categories = {};
  for (const u of units) categories[u.categoryKey] = (categories[u.categoryKey] ?? 0) + u.quantity;
  if (units.length === 0) {
    return { nationId: nation.id, attackPower: 0, defensePower: 0, troopsCount: 0, equipmentCount: 0, treasury: nation.treasury, allianceSupport: 0, fortificationLevel: 0, morale, categories };
  }
  const weights = await loadCategoryWeights(db);
  const power = computePower(units, weights, { manpowerFactor: settings.battle.manpowerFactor, fortificationLevel });
  const shared = allies.reduce((sum, a) => sum + Number(a.military_power), 0);
  const allianceSupport = settings.battle.allianceSupportRatio * (power.defensePower > 0 ? Math.min(1, shared / power.defensePower) : 0);
  return {
    nationId: nation.id,
    attackPower: power.attackPower,
    defensePower: power.defensePower,
    troopsCount: power.troopsCount,
    equipmentCount: power.equipmentCount,
    treasury: nation.treasury,
    allianceSupport,
    fortificationLevel,
    morale,
    categories
  };
}
async function combatantOf(db, nation, settings, side) {
  const computed = await computeNation(db, nation, settings);
  const inventory = await loadInventory(db, nation.id);
  const categories = {};
  for (const i of inventory) categories[i.categoryKey] = (categories[i.categoryKey] ?? 0) + i.quantity;
  let allianceSupport = 0;
  if (side === "defender") {
    const allies = await db.all(
      sql`SELECT n.military_power
            FROM alliance_members am
            JOIN alliance_members am2 ON am2.alliance_id = am.alliance_id
            JOIN nations n ON n.id = am2.nation_id
           WHERE am.nation_id = ${nation.id} AND n.id <> ${nation.id} AND n.status = 'active'
           LIMIT 10`
    );
    const shared = allies.reduce((s, a) => s + Number(a.military_power), 0);
    allianceSupport = settings.battle.allianceSupportRatio * (computed.power.defensePower > 0 ? Math.min(1, shared / computed.power.defensePower) : 0);
  }
  const ns = await db.first(
    sql`SELECT fortification_level, defense_mode FROM nation_settings WHERE nation_id = ${nation.id}`
  );
  return {
    nationId: nation.id,
    attackPower: computed.power.attackPower,
    defensePower: computed.power.defensePower,
    troopsCount: computed.power.troopsCount,
    equipmentCount: computed.power.equipmentCount,
    treasury: nation.treasury,
    allianceSupport,
    fortificationLevel: ns?.fortification_level ?? 0,
    morale: side === "attacker" ? 1 : ns?.defense_mode === "fortified" ? 1.1 : 1,
    categories
  };
}
async function listNations(db, opts = {}) {
  const limit = Math.min(50, Math.max(1, Number(opts.limit ?? 20) || 20));
  const offset = Math.max(0, Number(opts.offset ?? 0) || 0);
  const clauses = ["n.status <> 'dissolved'"];
  const bindings = [];
  if (opts.search) {
    clauses.push("(n.name LIKE ? OR n.leader_name LIKE ?)");
    bindings.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.excludeNationId) {
    clauses.push("n.id <> ?");
    bindings.push(opts.excludeNationId);
  }
  bindings.push(limit, offset);
  const rows = await db.all({
    sql: `SELECT n.id, n.name, n.flag, n.leader_name, n.status, n.treasury, n.military_power, n.economic_score,
                 n.total_score, n.world_rank, n.allies_count, n.enemies_count, n.wins_count, n.equipment_count,
                 n.troops_count, n.created_at,
                 COALESCE(e.net_income, 0) AS net_income,
                 (SELECT COUNT(*) FROM wars w WHERE w.defender_nation_id = n.id AND w.status IN ('proposed','accepted','active','peace_requested')) AS incoming_wars,
                 rel.status AS relation_status
            FROM nations n
            LEFT JOIN nation_economy e ON e.nation_id = n.id
            LEFT JOIN diplomatic_relations rel ON rel.nation_id = ? AND rel.other_nation_id = n.id
           WHERE ${clauses.join(" AND ")}
           ORDER BY n.world_rank ASC, n.total_score DESC
           LIMIT ? OFFSET ?`,
    bindings: [opts.excludeNationId ?? 0, ...bindings]
  });
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    flag: String(r.flag),
    leaderName: String(r.leader_name),
    status: String(r.status),
    treasury: Number(r.treasury),
    militaryPower: Number(r.military_power),
    economicScore: Number(r.economic_score),
    worldRank: Number(r.world_rank),
    alliesCount: Number(r.allies_count),
    enemiesCount: Number(r.enemies_count),
    winsCount: Number(r.wins_count),
    equipmentCount: Number(r.equipment_count),
    troopsCount: Number(r.troops_count),
    incomePerCycle: Number(r.net_income),
    incomingWars: Number(r.incoming_wars),
    relationStatus: r.relation_status ?? "neutral",
    createdAt: toIso(Number(r.created_at))
  }));
}
async function proposeWar(db, attacker, targetNationId, indemnityOffered, settings, actor, botToken, attackPlan) {
  if (!settings.features.warEnabled) throw ApiError.disabled("\u062C\u0646\u06AF");
  if (attacker.id === targetNationId) throw ApiError.forbidden("\u062D\u0645\u0644\u0647 \u0628\u0647 \u06A9\u0634\u0648\u0631 \u062E\u0648\u062F \u0627\u0645\u06A9\u0627\u0646\u200C\u067E\u0630\u06CC\u0631 \u0646\u06CC\u0633\u062A.");
  if (attacker.status !== "active") throw ApiError.forbidden("\u0648\u0636\u0639\u06CC\u062A \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0627\u062C\u0627\u0632\u0647 \u0627\u0639\u0644\u0627\u0645 \u062C\u0646\u06AF \u0646\u062F\u0627\u0631\u062F.");
  const target = await db.first(sql`SELECT * FROM nations WHERE id = ${targetNationId}`);
  if (!target || target.status === "dissolved") throw ApiError.notFound("\u06A9\u0634\u0648\u0631 \u0647\u062F\u0641 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (target.status !== "active") throw ApiError.forbidden("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u062F\u0631 \u0648\u0636\u0639\u06CC\u062A \u0641\u0639\u0627\u0644 \u0646\u06CC\u0633\u062A \u0648 \u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0647\u062F\u0641 \u0642\u0631\u0627\u0631 \u06AF\u06CC\u0631\u062F.");
  if (!settings.diplomacy.allowNeutralAttacks) {
    const rel = await db.first(
      sql`SELECT status FROM diplomatic_relations WHERE nation_id = ${attacker.id} AND other_nation_id = ${targetNationId}`
    );
    const allowed = ["enemy", "negotiating"];
    if (!rel || !allowed.includes(rel.status)) throw ApiError.forbidden("\u062D\u0645\u0644\u0647 \u0641\u0642\u0637 \u0628\u0647 \u06A9\u0634\u0648\u0631\u0647\u0627\u06CC\u06CC \u06A9\u0647 \u062F\u0631 \u0648\u0636\u0639\u06CC\u062A \u062F\u0634\u0645\u0646\u06CC \u06CC\u0627 \u0645\u0630\u0627\u06A9\u0631\u0647 \u0647\u0633\u062A\u0646\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A.");
  }
  const peace = await db.first(
    sql`SELECT id FROM diplomatic_relations WHERE nation_id = ${attacker.id} AND other_nation_id = ${targetNationId} AND status = 'peace_treaty'`
  );
  if (peace) throw ApiError.forbidden("\u0628\u0627 \u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u067E\u06CC\u0645\u0627\u0646 \u0635\u0644\u062D \u062F\u0627\u0631\u06CC\u062F\u061B \u0646\u0642\u0636 \u067E\u06CC\u0645\u0627\u0646 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631 \u0645\u0645\u06A9\u0646 \u0627\u0633\u062A.");
  const activeWars = await db.first(
    sql`SELECT COUNT(*) AS c FROM wars WHERE (attacker_nation_id = ${attacker.id} OR defender_nation_id = ${attacker.id}) AND status IN ('proposed','accepted','active','peace_requested')`
  );
  if (Number(activeWars?.c ?? 0) >= settings.battle.maxActiveWarsPerNation) {
    throw ApiError.conflict(`\u0634\u0645\u0627 \u0647\u0645\u200C\u0627\u06A9\u0646\u0648\u0646 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0645\u062C\u0627\u0632 (${settings.battle.maxActiveWarsPerNation}) \u062C\u0646\u06AF \u0641\u0639\u0627\u0644 \u062F\u0627\u0631\u06CC\u062F.`);
  }
  const attackers = await db.first(
    sql`SELECT COUNT(*) AS c FROM wars WHERE defender_nation_id = ${targetNationId} AND status IN ('proposed','accepted','active')`
  );
  if (Number(attackers?.c ?? 0) >= settings.battle.maxAttackersPerTarget) {
    throw ApiError.conflict("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0647\u0645\u200C\u0627\u06A9\u0646\u0648\u0646 \u062F\u0631\u06AF\u06CC\u0631 \u062C\u0646\u06AF \u0627\u0633\u062A (\u0633\u0642\u0641 \u0645\u0647\u0627\u062C\u0645\u0627\u0646 per target \u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F\u0647).");
  }
  const lastEnded = await db.first(
    sql`SELECT ended_at FROM wars WHERE attacker_nation_id = ${attacker.id} AND status = 'ended' ORDER BY ended_at DESC LIMIT 1`
  );
  if (lastEnded?.ended_at && settings.battle.warCooldownSeconds > 0) {
    const left = settings.battle.warCooldownSeconds - (nowSeconds() - lastEnded.ended_at);
    if (left > 0) throw ApiError.conflict(`\u0628\u0631\u0627\u06CC \u062D\u0645\u0644\u0647 \u0628\u0639\u062F\u06CC ${humanDuration(left)} \u0628\u0627\u06CC\u062F \u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F.`);
  }
  const plan = normalizeAttackPlan(attackPlan);
  if (plan) await validateAttackPlan(db, attacker.id, plan);
  const att = plan ? await committedCombatantOf(db, attacker, settings, plan) : await combatantOf(db, attacker, settings, "attacker");
  const def = await defenseCombatantOf(db, target, settings);
  const preview = previewBattle(att, def, settings.battle);
  const indemnity = Math.max(0, Math.min(indemnityOffered || 0, attacker.treasury));
  const entryCost = preview.entryCost;
  if (entryCost > 0 && attacker.treasury < entryCost) {
    throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  }
  const at = nowSeconds();
  const seed = seedFromString(`war:${attacker.id}:${targetNationId}:${at}`);
  const war = await db.first(
    sql`INSERT INTO wars (attacker_nation_id, defender_nation_id, status, initiated_by, attacker_power, defender_power,
                          attacker_win_chance, max_rounds, entry_cost, indemnity_offered, seed, proposed_at, accepted_at, started_at, next_round_at, ends_at, attack_plan, attack_plan_remaining)
         VALUES (${attacker.id}, ${targetNationId}, 'active', 'attacker', ${att.attackPower}, ${def.defensePower},
                 ${preview.attackerWinChance}, ${settings.battle.maxRounds}, ${entryCost}, ${indemnity}, ${seed}, ${at}, ${at}, ${at}, ${at}, ${at + settings.battle.minWarDurationSeconds * settings.battle.maxRounds},
                 ${plan ? JSON.stringify(plan) : null}, ${plan ? JSON.stringify(plan) : null})
         RETURNING id`
  );
  const warId = Number(war?.id ?? 0);
  if (!warId) throw ApiError.conflict("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u062A\u06A9\u0631\u0627\u0631\u06CC \u0627\u0633\u062A \u06CC\u0627 \u06A9\u0634\u0648\u0631 \u0647\u062F\u0641 \u062F\u0631\u06AF\u06CC\u0631 \u062C\u0646\u06AF \u0627\u0633\u062A.");
  const kickoff = [
    sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, message, expires_at, created_at, handled_at)
         VALUES ('war', 'accepted', ${attacker.id}, ${targetNationId},
                 ${`\u062D\u0645\u0644\u0647 \u0628\u0627 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u063A\u0631\u0627\u0645\u062A ${indemnity.toLocaleString("en-US")} \u0633\u06A9\u0647`},
                 ${at + settings.diplomacy.requestExpirySeconds}, ${at}, ${at})
         ON CONFLICT DO NOTHING`,
    sql`UPDATE diplomatic_relations SET status = 'enemy', updated_at = ${at}
         WHERE nation_id = ${attacker.id} AND other_nation_id = ${targetNationId}`,
    sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
         VALUES (${targetNationId}, ${attacker.id}, 'enemy', ${at}, ${at})
         ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = 'enemy', updated_at = ${at}`,
    sql`UPDATE nations SET status = 'at_war' WHERE id IN (${attacker.id}, ${target.id})`
  ];
  if (entryCost > 0) {
    kickoff.push(
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, reason, created_at)
           VALUES (${uuid()}, ${attacker.id}, 'war_cost', ${-entryCost}, ${attacker.treasury}, ${attacker.treasury - entryCost}, 'coin',
                   ${warTxKey("entry", warId, "attacker")}, 'war', ${warId}, 'هزینه ورود به جنگ', ${at})`,
      sql`UPDATE nations SET treasury = treasury - ${entryCost}, updated_at = ${at} WHERE id = ${attacker.id}`
    );
  }
  kickoff.push(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'جنگ آغاز شد', ${`\u2694\uFE0F ${attacker.flag} ${attacker.name} \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 ${target.flag} ${target.name} \u2014 \u0627\u062D\u062A\u0645\u0627\u0644 \u067E\u06CC\u0631\u0648\u0632\u06CC \u0645\u0647\u0627\u062C\u0645 ${Math.round(preview.attackerWinChance * 100)}\u066A`}, 'global', ${attacker.id}, ${at})`
  );
  await db.batch(kickoff);
  await sendWarWarning(db, target, botToken, attacker, `${Math.round(preview.attackerWinChance * 100)}`, warId, plan);
  await sendDefenseMobilized(db, target, botToken, attacker.name, warId);
  await audit(db, { actor, action: "war.propose", targetType: "war", targetId: warId, after: { targetNationId, indemnity, autoAccepted: true } });
  return { warId, preview: { ...preview, indemnity }, status: "active" };
}
async function respondToWar(db, warId, accept, nation, settings, botToken) {
  const war = await loadWar(db, warId);
  if (war.defender_nation_id !== nation.id) throw ApiError.forbidden("\u0641\u0642\u0637 \u06A9\u0634\u0648\u0631 \u0647\u062F\u0641 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0628\u0647 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u067E\u0627\u0633\u062E \u062F\u0647\u062F.");
  if (war.status !== "proposed") throw ApiError.conflict(`\u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u06CC\u06AF\u0631 \u062F\u0631 \u0648\u0636\u0639\u06CC\u062A \u0627\u0646\u062A\u0638\u0627\u0631 \u0646\u06CC\u0633\u062A (${warLabel(war.status)}).`);
  const at = nowSeconds();
  if (!accept) {
    await db.batch([
      sql`UPDATE wars SET status = 'cancelled', ended_at = ${at}, attack_plan_remaining = NULL WHERE id = ${warId}`,
      sql`UPDATE diplomatic_requests SET status = 'rejected', handled_at = ${at} WHERE kind = 'war' AND from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id} AND status = 'pending'`,
      sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
           VALUES ('war', 'رد درخواست جنگ', ${`${nation.flag} ${nation.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u0631\u0627 \u0631\u062F \u06A9\u0631\u062F.`}, 'global', ${nation.id}, ${at})`
    ]);
    await notifyAttacker(db, war, "\u274C \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u0634\u0645\u0627 \u0631\u062F \u0634\u062F.", `${nation.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u0631\u0627 \u0631\u062F \u06A9\u0631\u062F.`, botToken);
    return { status: "cancelled" };
  }
  const attacker = await db.first(sql`SELECT * FROM nations WHERE id = ${war.attacker_nation_id}`);
  if (!attacker) throw ApiError.notFound("\u06A9\u0634\u0648\u0631 \u0645\u0647\u0627\u062C\u0645 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const plan = parseAttackPlan(war.attack_plan);
  const att = plan ? await committedCombatantOf(db, attacker, settings, plan) : await combatantOf(db, attacker, settings, "attacker");
  const def = await defenseCombatantOf(db, nation, settings);
  const preview = previewBattle(att, def, settings.battle);
  const entryCost = war.entry_cost || preview.entryCost;
  if (entryCost > 0) {
    await db.batch([
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, reason, created_at)
           VALUES (${uuid()}, ${attacker.id}, 'war_cost', ${-entryCost}, ${attacker.treasury}, ${attacker.treasury - entryCost}, 'coin',
                   ${warTxKey("entry", warId, "attacker")}, 'war', ${warId}, 'هزینه ورود به جنگ', ${at})`,
      sql`UPDATE nations SET treasury = treasury - ${entryCost}, updated_at = ${at} WHERE id = ${attacker.id}`
    ]);
  }
  await db.batch([
    sql`UPDATE wars SET status = 'active', accepted_at = ${at}, started_at = ${at}, next_round_at = ${at},
                       attacker_power = ${att.attackPower}, defender_power = ${def.defensePower},
                       attacker_win_chance = ${preview.attackerWinChance}, entry_cost = ${entryCost}
           WHERE id = ${warId}`,
    sql`UPDATE nations SET status = 'at_war' WHERE id IN (${attacker.id}, ${nation.id})`,
    sql`UPDATE diplomatic_requests SET status = 'accepted', handled_at = ${at} WHERE kind = 'war' AND from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id} AND status = 'pending'`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'جنگ آغاز شد', ${`\u2694\uFE0F ${attacker.flag} ${attacker.name} \u062F\u0631 \u0628\u0631\u0627\u0628\u0631 ${nation.flag} ${nation.name} \u2014 \u0627\u062D\u062A\u0645\u0627\u0644 \u067E\u06CC\u0631\u0648\u0632\u06CC \u0645\u0647\u0627\u062C\u0645 ${Math.round(preview.attackerWinChance * 100)}\u066A`}, 'global', ${attacker.id}, ${at})`
  ]);
  await notify(db, {
    nationId: attacker.id,
    kind: "war_started",
    title: "\u2694\uFE0F \u062C\u0646\u06AF \u0622\u063A\u0627\u0632 \u0634\u062F",
    body: "\u062F\u0641\u0627\u0639 \u0627\u0632 \u06A9\u0634\u0648\u0631 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u0631\u0627 \u067E\u0630\u06CC\u0631\u0641\u062A. \u0646\u0648\u0628\u062A\u200C\u0647\u0627\u06CC \u0646\u0628\u0631\u062F \u062A\u0648\u0633\u0637 \u0632\u0645\u0627\u0646\u200C\u0628\u0646\u062F \u0627\u062C\u0631\u0627 \u0645\u06CC\u200C\u0634\u0648\u062F.",
    data: { warId }
  });
  await sendDefenseMobilized(db, nation, botToken, attacker.name, warId);
  return { status: "active", preview };
}
async function ownerTelegramId(db, nationId) {
  const row = await db.first(
    sql`SELECT u.telegram_user_id FROM nations n JOIN users u ON u.id = n.owner_user_id WHERE n.id = ${nationId}`
  );
  return row ? Number(row.telegram_user_id) : null;
}
async function defenseTally(db, nationId) {
  const rows = await db.all(
    sql`SELECT c.key AS key, COALESCE(SUM(i.quantity), 0) AS qty
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.nation_id = ${nationId} AND c.key IN ('fighters', 'missiles', 'ground_air_defense', 'air_air_defense', 'naval_air_defense')
         GROUP BY c.key`
  );
  const get = (k) => Number(rows.find((r) => r.key === k)?.qty ?? 0);
  return { fighters: get("fighters"), missiles: get("missiles"), airDefense: get("ground_air_defense") + get("air_air_defense") + get("naval_air_defense") };
}
async function sendWarWarning(db, defender, botToken, attacker, winChancePercent, warId, plan) {
  const tally = await defenseTally(db, defender.id);
  const resolved = plan ? await resolveAttackPlan(db, plan) : [];
  const commitLine = resolved.length ? `\u0646\u06CC\u0631\u0648\u0647\u0627\u06CC \u0627\u0639\u0632\u0627\u0645\u200C\u0634\u062F\u0647 \u0645\u0647\u0627\u062C\u0645: ${resolved.map((r) => `${r.quantity}\xD7 ${r.nameFa}`).join("\u060C ")}` : null;
  const body = [
    "\u0647\u0634\u062F\u0627\u0631 \u0648\u0636\u0639\u06CC\u062A \u062C\u0646\u06AF\u06CC!",
    "\u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0645\u0648\u0631\u062F \u062D\u0645\u0644\u0647 \u0646\u0638\u0627\u0645\u06CC \u0642\u0631\u0627\u0631 \u06AF\u0631\u0641\u062A!",
    "",
    `\u06A9\u0634\u0648\u0631 \u0645\u0647\u0627\u062C\u0645: ${attacker.name}`,
    `\u06A9\u0634\u0648\u0631 \u0645\u062F\u0627\u0641\u0639: ${defender.name}`,
    "",
    "\u0646\u06CC\u0631\u0648\u0647\u0627\u06CC \u062F\u0634\u0645\u0646 \u062F\u0631 \u062D\u0627\u0644 \u067E\u06CC\u0634\u0631\u0648\u06CC \u0647\u0633\u062A\u0646\u062F!",
    "\u0646\u06CC\u0631\u0648\u0647\u0627\u06CC \u062F\u0641\u0627\u0639\u06CC \u0634\u0645\u0627 \u0628\u0647 \u062D\u0627\u0644\u062A \u0622\u0645\u0627\u062F\u0647\u200C\u0628\u0627\u0634 \u062F\u0631\u0622\u0645\u062F\u0647\u200C\u0627\u0646\u062F.",
    `\u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627: ${tally.fighters}`,
    `\u0645\u0648\u0634\u06A9\u200C\u0647\u0627: ${tally.missiles}`,
    `\u067E\u062F\u0627\u0641\u0646\u062F: ${tally.airDefense}`,
    ...commitLine ? ["", commitLine] : [],
    "",
    "\u0633\u0631\u0646\u0648\u0634\u062A \u0627\u06CC\u0646 \u0646\u0628\u0631\u062F \u0628\u0647 \u0622\u0631\u0627\u06CC\u0634 \u062F\u0641\u0627\u0639\u06CC \u0634\u0645\u0627 \u0628\u0633\u062A\u06AF\u06CC \u062F\u0627\u0631\u062F.",
    "\u0639\u0645\u0644\u06CC\u0627\u062A \u062F\u0641\u0627\u0639 \u0627\u0632 \u06A9\u0634\u0648\u0631 \u0622\u063A\u0627\u0632 \u0634\u062F!"
  ].join("\n");
  const chatId = await ownerTelegramId(db, defender.id);
  await notify(db, {
    nationId: defender.id,
    kind: "war_warning",
    title: "\u{1F6A8} \u0647\u0634\u062F\u0627\u0631 \u0648\u0636\u0639\u06CC\u062A \u062C\u0646\u06AF\u06CC!",
    body,
    data: { warId, attackerNationId: attacker.id },
    telegram: botToken && chatId ? { botToken, chatId, text: body } : null
  });
}
async function sendDefenseMobilized(db, defender, botToken, attackerName, warId) {
  const tally = await defenseTally(db, defender.id);
  const body = [
    "\u{1F6E1}\uFE0F \u0639\u0645\u0644\u06CC\u0627\u062A \u062F\u0641\u0627\u0639 \u0627\u0632 \u06A9\u0634\u0648\u0631 \u0622\u063A\u0627\u0632 \u0634\u062F!",
    "",
    `\u06A9\u0634\u0648\u0631 \u0645\u0647\u0627\u062C\u0645: ${attackerName}`,
    `\u06A9\u0634\u0648\u0631 \u0645\u062F\u0627\u0641\u0639: ${defender.name}`,
    "",
    `\u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627: ${tally.fighters}`,
    `\u0645\u0648\u0634\u06A9\u200C\u0647\u0627: ${tally.missiles}`,
    `\u067E\u062F\u0627\u0641\u0646\u062F: ${tally.airDefense}`
  ].join("\n");
  const chatId = await ownerTelegramId(db, defender.id);
  await notify(db, {
    nationId: defender.id,
    kind: "war_defense",
    title: "\u{1F6E1}\uFE0F \u0633\u067E\u0631 \u06A9\u0634\u0648\u0631 \u0641\u0639\u0627\u0644 \u0634\u062F",
    body,
    data: { warId },
    telegram: botToken && chatId ? { botToken, chatId, text: body } : null
  });
}
async function notifyAttacker(db, war, title, body, botToken) {
  const chatId = await ownerTelegramId(db, war.attacker_nation_id);
  await notify(db, {
    nationId: war.attacker_nation_id,
    kind: "war",
    title,
    body,
    data: { warId: war.id },
    telegram: botToken && chatId ? { botToken, chatId, text: `${title}
${body}` } : null
  });
}
async function resolveRound(db, warId, settings, opts = {}) {
  const war = await loadWar(db, warId);
  if (!["active", "peace_requested"].includes(war.status)) throw ApiError.conflict("\u0627\u06CC\u0646 \u062C\u0646\u06AF \u062F\u0631 \u0648\u0636\u0639\u06CC\u062A \u0627\u062C\u0631\u0627 \u0646\u06CC\u0633\u062A.");
  const at = nowSeconds();
  if (!opts.force && war.next_round_at && war.next_round_at > at) {
    throw ApiError.rateLimited(`\u0646\u0648\u0628\u062A \u0628\u0639\u062F\u06CC ${humanDuration(war.next_round_at - at)} \u062F\u06CC\u06AF\u0631 \u0641\u0631\u0627 \u0645\u06CC\u200C\u0631\u0633\u062F.`, war.next_round_at - at);
  }
  const attacker = await db.first(sql`SELECT * FROM nations WHERE id = ${war.attacker_nation_id}`);
  const defender = await db.first(sql`SELECT * FROM nations WHERE id = ${war.defender_nation_id}`);
  if (!attacker || !defender) throw ApiError.notFound("\u06A9\u0634\u0648\u0631\u0647\u0627\u06CC \u062F\u0631\u06AF\u06CC\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F\u0646\u062F.");
  const plan = parseAttackPlan(war.attack_plan_remaining ?? war.attack_plan);
  const att = plan ? await committedCombatantOf(db, attacker, settings, plan) : await combatantOf(db, attacker, settings, "attacker");
  const def = await defenseCombatantOf(db, defender, settings);
  const roundsLeft = Math.max(1, settings.battle.maxRounds - war.rounds_played);
  const outcome = simulateBattle({
    attacker: att,
    defender: def,
    params: settings.battle,
    seed: war.seed + war.rounds_played + 1 >>> 0,
    attackerCategories: att.categories,
    defenderCategories: def.categories,
    rounds: Math.min(roundsLeft, 1)
  });
  const nextRound = war.rounds_played + 1;
  const finished = outcome.finished || nextRound >= settings.battle.maxRounds;
  const battle = await db.first(
    sql`INSERT INTO battles (war_id, round_no, attacker_power, defender_power, attacker_losses, defender_losses, winner, seed, created_at)
         VALUES (${warId}, ${nextRound}, ${outcome.rounds[0]?.attackerPower ?? 0}, ${outcome.rounds[0]?.defenderPower ?? 0},
                 ${outcome.attackerLosses}, ${outcome.defenderLosses}, ${outcome.winner ?? "draw"}, ${war.seed + nextRound}, ${at})
         RETURNING id`
  );
  const battleId = Number(battle?.id ?? 0);
  await db.batch([
    sql`INSERT INTO battle_reports (battle_id, war_id, attacker_nation_id, defender_nation_id, attacker_win_chance,
                                    attacker_json, defender_json, indemnity, detail_json, created_at)
         VALUES (${battleId}, ${warId}, ${attacker.id}, ${defender.id}, ${outcome.rounds[0]?.attackerWinChance ?? 0.5},
                 ${JSON.stringify({ power: att.attackPower, remaining: outcome.attackerRemaining, losses: outcome.attackerLosses, byCategory: outcome.attackerLossesByCategory, troops: att.troopsCount })},
                 ${JSON.stringify({ power: def.defensePower, remaining: outcome.defenderRemaining, losses: outcome.defenderLosses, byCategory: outcome.defenderLossesByCategory, troops: def.troopsCount })},
                 ${outcome.indemnity}, ${JSON.stringify({ round: nextRound, finished, rolls: outcome.rolls.slice(0, 20), seed: war.seed + nextRound })}, ${at})`,
    sql`UPDATE wars SET rounds_played = ${nextRound}, next_round_at = ${at + settings.battle.minWarDurationSeconds},
                       ends_at = ${at + settings.battle.minWarDurationSeconds * Math.max(1, settings.battle.maxRounds - nextRound)}
           WHERE id = ${warId}`
  ]);
  if (plan) {
    const remaining2 = await applyCommittedLosses(db, attacker.id, plan, outcome.attackerLossesByCategory, at);
    await db.run(sql`UPDATE wars SET attack_plan_remaining = ${remaining2.length ? JSON.stringify(remaining2) : "[]"} WHERE id = ${warId}`);
  } else {
    await applyLosses(db, attacker.id, outcome.attackerLossesByCategory, at);
  }
  const defPlan = await loadDefensePlan(db, defender.id);
  if (defPlan) {
    const allow = new Set(defPlan.filter((k) => k !== DEFENSE_FORTIFICATION_TOKEN));
    const filtered = Object.fromEntries(Object.entries(outcome.defenderLossesByCategory).filter(([k]) => allow.has(k)));
    await applyLosses(db, defender.id, filtered, at);
  } else {
    await applyLosses(db, defender.id, outcome.defenderLossesByCategory, at);
  }
  if (finished) await finalizeWar(db, warId, settings, at);
  return { round: nextRound, finished, outcome };
}
async function applyLosses(db, nationId, lossesByCategory, at) {
  const entries = Object.entries(lossesByCategory).filter(([, lost]) => lost > 0);
  if (entries.length === 0) return;
  const inventory = await loadInventory(db, nationId);
  const stmts = [];
  for (const [categoryKey, lost] of entries) {
    const rows = inventory.filter((i) => i.categoryKey === categoryKey && i.quantity > 0);
    if (rows.length === 0) continue;
    const totalQty = rows.reduce((s, r) => s + r.quantity, 0);
    const ratio = Math.min(1, lost / Math.max(1, totalQty));
    for (const row of rows) {
      const decrement = Math.min(row.quantity, Math.floor(row.quantity * ratio));
      if (decrement <= 0) continue;
      stmts.push(sql`UPDATE nation_inventory SET quantity = quantity - ${decrement}, updated_at = ${at} WHERE id = ${row.id}`);
    }
  }
  if (stmts.length) await db.batch(stmts);
}
async function finalizeWar(db, warId, settings, at = nowSeconds()) {
  const war = await loadWar(db, warId);
  if (war.status === "ended") return { status: "ended", winnerNationId: war.winner_nation_id, indemnity: 0, winnerSide: "draw" };
  const attacker = await db.first(sql`SELECT * FROM nations WHERE id = ${war.attacker_nation_id}`);
  const defender = await db.first(sql`SELECT * FROM nations WHERE id = ${war.defender_nation_id}`);
  if (!attacker || !defender) throw ApiError.notFound("\u06A9\u0634\u0648\u0631\u0647\u0627\u06CC \u062F\u0631\u06AF\u06CC\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F\u0646\u062F.");
  const totals = await db.first(
    sql`SELECT COALESCE(SUM(attacker_losses), 0) AS al, COALESCE(SUM(defender_losses), 0) AS dl FROM battles WHERE war_id = ${warId}`
  );
  const attStart = Math.max(0, Number(war.attacker_power));
  const defStart = Math.max(0, Number(war.defender_power));
  const attRemaining = Math.max(0, attStart - Number(totals?.al ?? 0));
  const defRemaining = Math.max(0, defStart - Number(totals?.dl ?? 0));
  const winnerSide = attRemaining === defRemaining ? "draw" : attRemaining > defRemaining ? "attacker" : "defender";
  const winner = winnerSide === "defender" ? defender : attacker;
  const loser = winnerSide === "defender" ? attacker : defender;
  const destroyed = Math.max(attStart - attRemaining, defStart - defRemaining);
  const wantedIndemnity = winnerSide === "attacker" ? Math.max(0, war.indemnity_offered) : Math.round(destroyed * settings.battle.indemnityPerPoint);
  const indemnity = winnerSide === "draw" ? 0 : Math.min(wantedIndemnity, loser.treasury);
  await applyResidualLosses(db, attacker.id, defender.id, {
    attackerRatio: attStart > 0 ? Math.min(1, (attStart - attRemaining) / attStart) : 0,
    defenderRatio: defStart > 0 ? Math.min(1, (defStart - defRemaining) / defStart) : 0
  }, at, war);
  const stmts = [
    sql`UPDATE wars SET status = 'ended', ended_at = ${at}, winner_nation_id = ${winnerSide === "draw" ? null : winner.id},
                       indemnity_paid = ${indemnity}, attacker_power = ${attRemaining}, defender_power = ${defRemaining},
                       outcome_summary = ${winnerSide === "draw" ? "\u{1F91D} \u0646\u0628\u0631\u062F \u0628\u0627 \u062A\u0633\u0627\u0648\u06CC \u067E\u0627\u06CC\u0627\u0646 \u06CC\u0627\u0641\u062A." : `\u0628\u0631\u0646\u062F\u0647: ${winner.name} (\u0642\u062F\u0631\u062A \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647 \u0645\u0647\u0627\u062C\u0645 ${Math.round(attRemaining)} / \u0645\u062F\u0627\u0641\u0639 ${Math.round(defRemaining)})`}
           WHERE id = ${warId}`,
    sql`UPDATE nations SET status = 'active', updated_at = ${at} WHERE id IN (${attacker.id}, ${defender.id}) AND status = 'at_war'`,
    sql`UPDATE nations SET wars_count = wars_count + 1, updated_at = ${at} WHERE id IN (${attacker.id}, ${defender.id})`
  ];
  if (winnerSide !== "draw") {
    stmts.push(sql`UPDATE nations SET wins_count = wins_count + 1 WHERE id = ${winner.id}`);
    stmts.push(sql`UPDATE nations SET losses_count = losses_count + 1 WHERE id = ${loser.id}`);
  }
  if (indemnity > 0) {
    stmts.push(
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, counterparty_nation_id, reason, created_at)
           VALUES (${uuid()}, ${loser.id}, 'war_indemnity', ${-indemnity}, ${loser.treasury}, ${loser.treasury - indemnity}, 'coin',
                   ${warTxKey("indemnity", warId, "loser")}, 'war', ${warId}, ${winner.id}, 'غرامت جنگ', ${at})`,
      sql`UPDATE nations SET treasury = treasury - ${indemnity} WHERE id = ${loser.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, counterparty_nation_id, reason, created_at)
           VALUES (${uuid()}, ${winner.id}, 'war_indemnity', ${indemnity}, ${winner.treasury}, ${winner.treasury + indemnity}, 'coin',
                   ${warTxKey("indemnity", warId, "winner")}, 'war', ${warId}, ${loser.id}, 'غرامت دریافتی', ${at})`,
      sql`UPDATE nations SET treasury = treasury + ${indemnity} WHERE id = ${winner.id}`,
      sql`UPDATE nation_economy SET war_loss_total = war_loss_total + ${indemnity} WHERE nation_id = ${loser.id}`
    );
  }
  stmts.push(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'پایان جنگ', ${winnerSide === "draw" ? `\u{1F91D} \u062C\u0646\u06AF ${war.attacker_name} \u0648 ${war.defender_name} \u0628\u0627 \u062A\u0633\u0627\u0648\u06CC \u067E\u0627\u06CC\u0627\u0646 \u06CC\u0627\u0641\u062A.` : `\u{1F3C1} ${winner.flag} ${winner.name} \u067E\u06CC\u0631\u0648\u0632 \u0646\u0628\u0631\u062F \u0628\u0627 ${loser.flag} ${loser.name} \u0634\u062F (\u063A\u0631\u0627\u0645\u062A: ${indemnity.toLocaleString("en-US")} \u0633\u06A9\u0647).`}, 'global', ${winner.id}, ${at})`
  );
  await db.batch(stmts);
  const summaryLine = winnerSide === "draw" ? "\u0646\u062A\u06CC\u062C\u0647: \u062A\u0633\u0627\u0648\u06CC" : `\u0628\u0631\u0646\u062F\u0647: ${winner.name}`;
  await notify(db, { nationId: attacker.id, kind: "war_end", title: "\u{1F3C1} \u062C\u0646\u06AF \u067E\u0627\u06CC\u0627\u0646 \u06CC\u0627\u0641\u062A", body: summaryLine, data: { warId } });
  await notify(db, { nationId: defender.id, kind: "war_end", title: "\u{1F3C1} \u062C\u0646\u06AF \u067E\u0627\u06CC\u0627\u0646 \u06CC\u0627\u0641\u062A", body: summaryLine, data: { warId } });
  await refreshAfterWar(db, attacker.id, settings);
  await refreshAfterWar(db, defender.id, settings);
  return { status: "ended", winnerNationId: winner.id, indemnity, winnerSide };
}
async function applyResidualLosses(db, attackerId, defenderId, ratios, at, war) {
  const attackerPlan = parseAttackPlan(war.attack_plan_remaining ?? war.attack_plan);
  const defenderArrangement = await loadDefensePlan(db, defenderId);
  const defenderPlan = defenderArrangement ? (await expandDefensePlan(db, defenderId, defenderArrangement)).map((u) => ({ templateId: u.templateId, quantity: u.quantity })) : null;
  for (const [nationId, ratio, plan] of [
    [attackerId, ratios.attackerRatio, attackerPlan],
    [defenderId, ratios.defenderRatio, defenderPlan]
  ]) {
    if (ratio <= 0.05) continue;
    const effective = Math.min(0.5, ratio * 0.5);
    const inventory = await loadInventory(db, nationId);
    let rows = inventory.filter((i) => i.categoryKey !== "factories" && i.categoryKey !== "mines" && i.quantity > 1);
    if (plan) {
      const remainingMap = new Map(plan.map((e) => [e.templateId, e.quantity]));
      rows = rows.filter((r) => (remainingMap.get(r.templateId) ?? 0) > 0).map((r) => ({ ...r, quantity: Math.min(r.quantity, remainingMap.get(r.templateId) ?? 0) }));
    }
    const stmts = rows.map((row) => {
      const decrement = Math.floor(row.quantity * effective);
      return sql`UPDATE nation_inventory SET quantity = MAX(0, quantity - ${decrement}), updated_at = ${at} WHERE id = ${row.id} AND quantity >= ${decrement}`;
    }).filter((_, idx) => idx < 40);
    if (stmts.length) await db.batch(stmts);
    if (plan) await db.run(sql`UPDATE wars SET attack_plan_remaining = NULL WHERE id = ${war.id}`);
  }
}
async function refreshAfterWar(db, nationId, settings) {
  const { loadNation: loadNation2, refreshNationStats: refreshNationStats2 } = await Promise.resolve().then(() => (init_queries(), queries_exports));
  const nation = await loadNation2(db, nationId);
  await refreshNationStats2(db, nation, settings);
}
async function requestPeace(db, warId, nation, settings, botToken) {
  const war = await loadWar(db, warId);
  if (war.status !== "active") throw ApiError.conflict("\u0627\u06CC\u0646 \u062C\u0646\u06AF \u0641\u0639\u0627\u0644 \u0646\u06CC\u0633\u062A.");
  const at = nowSeconds();
  const initiatorIsAttacker = war.attacker_nation_id === nation.id;
  if (!initiatorIsAttacker && war.defender_nation_id !== nation.id) throw ApiError.forbidden("\u0634\u0645\u0627 \u0637\u0631\u0641 \u0627\u06CC\u0646 \u062C\u0646\u06AF \u0646\u06CC\u0633\u062A\u06CC\u062F.");
  const otherSide = initiatorIsAttacker ? war.defender_nation_id : war.attacker_nation_id;
  await db.batch([
    sql`UPDATE wars SET status = 'peace_requested', peace_requested_at = ${at} WHERE id = ${warId}`,
    sql`UPDATE diplomatic_requests SET status = 'cancelled' WHERE kind = 'peace' AND from_nation_id = ${nation.id} AND to_nation_id = ${otherSide} AND status = 'pending'`,
    sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, message, expires_at, created_at)
         VALUES ('peace', 'pending', ${nation.id}, ${otherSide}, ${`${nation.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u062F\u0627\u062F (\u067E\u0627\u06CC\u0627\u0646 \u062C\u0646\u06AF ${warId}).`},
                 ${at + settings.diplomacy.requestExpirySeconds}, ${at})`
  ]);
  const other = await db.first(sql`SELECT owner_user_id FROM nations WHERE id = ${otherSide}`);
  await notify(db, {
    nationId: otherSide,
    kind: "peace_request",
    title: "\u{1F54A}\uFE0F \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D",
    body: `${nation.flag} ${nation.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u067E\u0627\u06CC\u0627\u0646 \u062C\u0646\u06AF \u062F\u0627\u062F.`,
    data: { warId },
    telegram: botToken && other ? { botToken, chatId: other.owner_user_id, text: `\u{1F54A}\uFE0F ${nation.name} \u0627\u0632 \u0634\u0645\u0627 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u06A9\u0631\u062F.` } : null
  });
  return { status: "peace_requested" };
}
async function respondPeace(db, warId, accept, nation, botToken) {
  const war = await loadWar(db, warId);
  if (war.status !== "peace_requested") throw ApiError.conflict("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D\u06CC \u0628\u0631\u0627\u06CC \u067E\u0627\u0633\u062E \u062F\u0627\u062F\u0646 \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  if (war.attacker_nation_id !== nation.id && war.defender_nation_id !== nation.id) {
    throw ApiError.forbidden("\u0634\u0645\u0627 \u0637\u0631\u0641 \u0627\u06CC\u0646 \u062C\u0646\u06AF \u0646\u06CC\u0633\u062A\u06CC\u062F.");
  }
  const at = nowSeconds();
  const offer = await db.first(
    sql`SELECT from_nation_id FROM diplomatic_requests
          WHERE kind = 'peace' AND status = 'pending'
            AND ((from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id})
              OR (from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id}))
          ORDER BY id DESC LIMIT 1`
  );
  const requesterId = Number(offer?.from_nation_id ?? 0);
  if (requesterId && requesterId === nation.id) {
    throw ApiError.forbidden("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u0631\u0627 \u0647\u0645\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u062B\u0628\u062A \u06A9\u0631\u062F\u0647 \u0627\u0633\u062A\u061B \u0628\u0627\u06CC\u062F \u0637\u0631\u0641 \u0645\u0642\u0627\u0628\u0644 \u067E\u0627\u0633\u062E \u062F\u0647\u062F.");
  }
  if (!accept) {
    await db.batch([
      sql`UPDATE wars SET status = 'active', next_round_at = ${at} WHERE id = ${warId}`,
      sql`UPDATE diplomatic_requests SET status = 'rejected', handled_at = ${at}
            WHERE kind = 'peace' AND status = 'pending'
              AND ((from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id})
                OR (from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id}))`
    ]);
    await notify(db, { nationId: war.attacker_nation_id === nation.id ? war.defender_nation_id : war.attacker_nation_id, kind: "peace", title: "\u274C \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u0631\u062F \u0634\u062F", body: `${nation.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u0631\u0627 \u0631\u062F \u06A9\u0631\u062F.`, data: { warId } });
    return { status: "active" };
  }
  await db.batch([
    sql`UPDATE wars SET status = 'ended', ended_at = ${at}, outcome_summary = ${"\u{1F54A}\uFE0F \u067E\u06CC\u0645\u0627\u0646 \u0635\u0644\u062D \u0627\u0645\u0636\u0627 \u0634\u062F \u2014 \u0628\u062F\u0648\u0646 \u063A\u0631\u0627\u0645\u062A."} WHERE id = ${warId}`,
    sql`UPDATE diplomatic_requests SET status = 'accepted', handled_at = ${at}
          WHERE kind = 'peace' AND status = 'pending'
            AND ((from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id})
              OR (from_nation_id = ${war.defender_nation_id} AND to_nation_id = ${war.attacker_nation_id}))`,
    sql`UPDATE nations SET status = 'active' WHERE id IN (${war.attacker_nation_id}, ${war.defender_nation_id}) AND status = 'at_war'`,
    sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
         VALUES (${war.attacker_nation_id}, ${war.defender_nation_id}, 'peace_treaty', ${at}, ${at})
         ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = 'peace_treaty', updated_at = ${at}`,
    sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
         VALUES (${war.defender_nation_id}, ${war.attacker_nation_id}, 'peace_treaty', ${at}, ${at})
         ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = 'peace_treaty', updated_at = ${at}`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('war', 'پیمان صلح', ${`\u{1F54A}\uFE0F \u0635\u0644\u062D \u0645\u06CC\u0627\u0646 ${war.attacker_name} \u0648 ${war.defender_name} \u0627\u0645\u0636\u0627 \u0634\u062F.`}, 'global', ${nation.id}, ${at})`
  ]);
  await notify(db, { nationId: war.attacker_nation_id === nation.id ? war.defender_nation_id : war.attacker_nation_id, kind: "peace", title: "\u{1F54A}\uFE0F \u0635\u0644\u062D \u0627\u0645\u0636\u0627 \u0634\u062F", body: "\u062C\u0646\u06AF \u0628\u0627 \u067E\u06CC\u0645\u0627\u0646 \u0635\u0644\u062D \u067E\u0627\u06CC\u0627\u0646 \u06CC\u0627\u0641\u062A.", data: { warId }, telegram: botToken ? { botToken, chatId: nation.id, text: "\u{1F54A}\uFE0F \u067E\u06CC\u0645\u0627\u0646 \u0635\u0644\u062D \u0627\u0645\u0636\u0627 \u0634\u062F." } : null });
  return { status: "ended" };
}
async function getWarsForNation(db, nationId) {
  const rows = await db.all(
    sql`SELECT w.*, a.name AS attacker_name, a.flag AS attacker_flag, d.name AS defender_name, d.flag AS defender_flag
          FROM wars w JOIN nations a ON a.id = w.attacker_nation_id JOIN nations d ON d.id = w.defender_nation_id
         WHERE (w.attacker_nation_id = ${nationId} OR w.defender_nation_id = ${nationId})
         ORDER BY (w.status IN ('proposed','accepted','active','peace_requested')) DESC, w.id DESC
         LIMIT 50`
  );
  return rows.map((w) => mapWar(w));
}
function mapWar(w) {
  return {
    id: w.id,
    attackerNationId: w.attacker_nation_id,
    defenderNationId: w.defender_nation_id,
    attackerName: w.attacker_name,
    defenderName: w.defender_name,
    attackerFlag: w.attacker_flag,
    defenderFlag: w.defender_flag,
    status: w.status,
    statusLabelFa: warLabel(w.status),
    initiatedBy: w.initiated_by,
    attackerPower: Number(w.attacker_power),
    defenderPower: Number(w.defender_power),
    attackerWinChance: Number(w.attacker_win_chance),
    roundsPlayed: Number(w.rounds_played),
    maxRounds: Number(w.max_rounds),
    entryCost: Number(w.entry_cost),
    indemnityOffered: Number(w.indemnity_offered),
    indemnityPaid: Number(w.indemnity_paid),
    winnerNationId: w.winner_nation_id,
    outcomeSummary: w.outcome_summary,
    proposedAt: toIso(w.proposed_at),
    startedAt: toIso(w.started_at),
    nextRoundAt: toIso(w.next_round_at),
    endedAt: toIso(w.ended_at),
    endsAt: toIso(w.ends_at)
  };
}
async function getWarDetail(db, warId, viewerNationIds, isAdmin) {
  const war = await loadWar(db, warId);
  if (!isAdmin && !viewerNationIds.includes(war.attacker_nation_id) && !viewerNationIds.includes(war.defender_nation_id)) {
    throw ApiError.forbidden("\u062F\u0633\u062A\u0631\u0633\u06CC \u0628\u0647 \u0627\u06CC\u0646 \u062C\u0646\u06AF \u0646\u062F\u0627\u0631\u06CC\u062F.");
  }
  const reports = await db.all(
    sql`SELECT br.*, b.round_no, b.winner, b.attacker_losses, b.defender_losses
          FROM battle_reports br JOIN battles b ON b.id = br.battle_id
         WHERE br.war_id = ${warId} ORDER BY b.round_no DESC LIMIT 30`
  );
  const plan = parseAttackPlan(war.attack_plan);
  const remaining2 = parseAttackPlan(war.attack_plan_remaining ?? war.attack_plan);
  return {
    war: mapWar(war),
    attackPlan: plan ? await resolveAttackPlan(db, plan) : null,
    attackPlanRemaining: remaining2 ? await resolveAttackPlan(db, remaining2) : null,
    reports: reports.map((r) => ({
      id: Number(r.id),
      roundNo: Number(r.round_no),
      winner: String(r.winner),
      attackerWinChance: Number(r.attacker_win_chance),
      attacker: safeParse(r.attacker_json),
      defender: safeParse(r.defender_json),
      indemnity: Number(r.indemnity),
      detail: safeParse(r.detail_json),
      createdAt: toIso(Number(r.created_at))
    }))
  };
}
function safeParse(text) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    return {};
  }
}
async function adminStopWar(db, warId, mode, actor, reason) {
  const war = await loadWar(db, warId);
  const at = nowSeconds();
  const status = mode === "stop" ? "stopped_by_admin" : "ended";
  await db.batch([
    sql`UPDATE wars SET status = ${status}, ended_at = ${at}, stopped_by_user_id = ${actor.userId},
                       outcome_summary = ${`\u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631: ${reason}`} WHERE id = ${warId}`,
    sql`UPDATE nations SET status = 'active' WHERE id IN (${war.attacker_nation_id}, ${war.defender_nation_id}) AND status = 'at_war'`,
    sql`UPDATE diplomatic_requests SET status = 'cancelled', handled_at = ${at} WHERE kind = 'war' AND status = 'pending'
           AND from_nation_id = ${war.attacker_nation_id} AND to_nation_id = ${war.defender_nation_id}`,
    sql`INSERT INTO announcements (kind, title, body, audience, created_at)
         VALUES ('admin', 'توقف جنگ توسط مدیر', ${`\u062C\u0646\u06AF #${warId} (${war.attacker_name} \u2194 ${war.defender_name}) \u0645\u062A\u0648\u0642\u0641 \u0634\u062F. \u062F\u0644\u06CC\u0644: ${reason}`}, 'global', ${at})`
  ]);
  await audit(db, { actor, action: `war.${mode}`, targetType: "war", targetId: warId, reason });
  return { status };
}
async function listDueWars(db, now = nowSeconds(), limit = 20) {
  return db.all(
    sql`SELECT id FROM wars WHERE status = 'active' AND (next_round_at IS NULL OR next_round_at <= ${now}) ORDER BY id LIMIT ${limit}`
  );
}
async function listExpiredProposals(db, expirySeconds, now = nowSeconds(), limit = 25) {
  return db.all(
    sql`SELECT id, attacker_nation_id, defender_nation_id FROM wars
          WHERE status = 'proposed' AND proposed_at < ${now - Math.max(300, expirySeconds)}
         ORDER BY id LIMIT ${limit}`
  );
}
async function expireProposal(db, warId, at = nowSeconds()) {
  await db.batch([
    sql`UPDATE wars SET status = 'cancelled', ended_at = ${at}, outcome_summary = ${"\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF \u0628\u062F\u0648\u0646 \u067E\u0627\u0633\u062E \u0645\u0627\u0646\u062F \u0648 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F."} WHERE id = ${warId}`,
    sql`UPDATE diplomatic_requests SET status = 'expired', handled_at = ${at} WHERE kind = 'war' AND status = 'pending'
           AND from_nation_id = (SELECT attacker_nation_id FROM wars WHERE id = ${warId})`
  ]);
}
async function listOverdueWars(db, now = nowSeconds(), limit = 25) {
  return db.all(
    sql`SELECT id FROM wars WHERE status IN ('active','peace_requested') AND ends_at IS NOT NULL AND ends_at < ${now} ORDER BY id LIMIT ${limit}`
  );
}
var init_warService = __esm({
  "apps/worker/src/services/warService.ts"() {
    "use strict";
    init_sql();
    init_errors2();
    init_format();
    init_ids();
    init_queries();
    init_scoring();
    init_battle();
    init_src();
    init_auditService();
    init_notificationService();
  }
});

// apps/worker/src/services/diplomacyService.ts
async function sendRequest(db, from, input, settings, botToken) {
  if (!settings.features.diplomacyEnabled) throw ApiError.disabled("\u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC");
  if (from.id === input.toNationId) throw ApiError.forbidden("\u0627\u0631\u0633\u0627\u0644 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0647 \u062E\u0648\u062F\u062A\u0627\u0646 \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A.");
  if (input.kind === "war") throw ApiError.validation("\u0628\u0631\u0627\u06CC \u0627\u0639\u0644\u0627\u0645 \u062C\u0646\u06AF \u0627\u0632 \u0628\u062E\u0634 \xAB\u062C\u0646\u06AF\xBB \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
  if (input.kind === "peace") throw ApiError.validation("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u0628\u0627\u06CC\u062F \u0631\u0648\u06CC \u062C\u0646\u06AF \u0641\u0639\u0627\u0644 \u062B\u0628\u062A \u0634\u0648\u062F.");
  const to = await db.first(sql`SELECT * FROM nations WHERE id = ${input.toNationId}`);
  if (!to || to.status === "dissolved") throw ApiError.notFound("\u06A9\u0634\u0648\u0631 \u0645\u0642\u0635\u062F \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (to.status === "banned" || to.status === "frozen") throw ApiError.forbidden("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u062F\u0631 \u0648\u0636\u0639\u06CC\u062A \u0641\u0639\u0627\u0644 \u0646\u06CC\u0633\u062A.");
  const pendingCount = await db.first(
    sql`SELECT COUNT(*) AS c FROM diplomatic_requests WHERE (from_nation_id = ${from.id} OR to_nation_id = ${from.id}) AND status = 'pending'`
  );
  if (Number(pendingCount?.c ?? 0) >= settings.diplomacy.maxPendingRequestsPerNation) {
    throw ApiError.rateLimited("\u062A\u0639\u062F\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u0634\u0645\u0627 \u0628\u0647 \u0633\u0642\u0641 \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A.");
  }
  if (input.kind === "friendship") {
    const friends = await db.first(
      sql`SELECT COUNT(*) AS c FROM diplomatic_relations WHERE nation_id = ${from.id} AND status = 'friend'`
    );
    if (Number(friends?.c ?? 0) >= settings.diplomacy.maxFriends) throw ApiError.conflict("\u0628\u0647 \u0633\u0642\u0641 \u062A\u0639\u062F\u0627\u062F \u0645\u062A\u062D\u062F\u0627\u0646/\u062F\u0648\u0633\u062A\u0627\u0646 \u0631\u0633\u06CC\u062F\u0647\u200C\u0627\u06CC\u062F.");
  }
  const at = nowSeconds();
  const req = await db.first(
    sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, alliance_name, message, expires_at, created_at)
         VALUES (${input.kind}, 'pending', ${from.id}, ${input.toNationId}, ${input.allianceName ?? null},
                 ${input.message ? String(input.message).slice(0, 600) : null},
                 ${at + settings.diplomacy.requestExpirySeconds}, ${at})
         RETURNING id`
  );
  await notify(db, {
    nationId: input.toNationId,
    kind: `diplomacy_${input.kind}`,
    title: `\u{1F310} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u062F\u06CC\u062F: ${kindLabel(input.kind)}`,
    body: `${from.flag} ${from.name}: ${input.message || "(\u0628\u062F\u0648\u0646 \u067E\u06CC\u0627\u0645)"}`,
    data: { requestId: req?.id },
    telegram: botToken ? { botToken, chatId: to.owner_user_id, text: `\u{1F310} ${from.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A ${kindLabel(input.kind)} \u0641\u0631\u0633\u062A\u0627\u062F.` } : null
  });
  return { requestId: Number(req?.id ?? 0), status: "pending" };
}
function kindLabel(kind) {
  return {
    friendship: "\u062F\u0648\u0633\u062A\u06CC",
    alliance: "\u0627\u062A\u062D\u0627\u062F",
    peace: "\u0635\u0644\u062D",
    non_aggression: "\u067E\u06CC\u0645\u0627\u0646 \u0639\u062F\u0645 \u062A\u062C\u0627\u0648\u0632",
    war: "\u062C\u0646\u06AF",
    message: "\u067E\u06CC\u0627\u0645 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9",
    dissolve: "\u0644\u063A\u0648 \u0631\u0648\u0627\u0628\u0637"
  }[kind];
}
async function listIncoming(db, nationId, status = "pending") {
  return db.all(
    sql`SELECT r.*, f.name AS from_name, f.flag AS from_flag, t.name AS to_name, t.flag AS to_flag
          FROM diplomatic_requests r
          JOIN nations f ON f.id = r.from_nation_id
          JOIN nations t ON t.id = r.to_nation_id
         WHERE r.to_nation_id = ${nationId} AND r.status = ${status}
         ORDER BY r.id DESC LIMIT 50`
  );
}
async function listOutgoing(db, nationId, status = "pending") {
  return db.all(
    sql`SELECT r.*, f.name AS from_name, f.flag AS from_flag, t.name AS to_name, t.flag AS to_flag
          FROM diplomatic_requests r
          JOIN nations f ON f.id = r.from_nation_id
          JOIN nations t ON t.id = r.to_nation_id
         WHERE r.from_nation_id = ${nationId} AND r.status = ${status}
         ORDER BY r.id DESC LIMIT 50`
  );
}
async function cancelRequest(db, requestId, nation) {
  const row = await db.first(
    sql`SELECT id, from_nation_id, status FROM diplomatic_requests WHERE id = ${requestId}`
  );
  if (!row) throw ApiError.notFound("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (row.from_nation_id !== nation.id) throw ApiError.forbidden("\u0641\u0642\u0637 \u0641\u0631\u0633\u062A\u0646\u062F\u0647 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0631\u0627 \u0644\u063A\u0648 \u06A9\u0646\u062F.");
  if (row.status !== "pending") throw ApiError.conflict("\u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u06CC\u06AF\u0631 \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u0646\u06CC\u0633\u062A.");
  await db.run(sql`UPDATE diplomatic_requests SET status = 'cancelled', handled_at = ${nowSeconds()} WHERE id = ${requestId}`);
  return { status: "cancelled" };
}
async function decideRequest(db, requestId, me, accept, settings, actor, botToken) {
  const req = await db.first(
    sql`SELECT r.*, f.name AS from_name, f.flag AS from_flag FROM diplomatic_requests r
          JOIN nations f ON f.id = r.from_nation_id WHERE r.id = ${requestId}`
  );
  if (!req) throw ApiError.notFound("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (Number(req.to_nation_id) !== me.id) throw ApiError.forbidden("\u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0631\u0627\u06CC \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A.");
  if (req.status !== "pending") throw ApiError.conflict("\u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0642\u0628\u0644\u0627\u064B \u0631\u0633\u06CC\u062F\u06AF\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A.");
  const at = nowSeconds();
  const fromId = Number(req.from_nation_id);
  const kind = String(req.kind);
  const expires = Number(req.expires_at ?? 0);
  if (expires && expires < at) {
    await db.run(sql`UPDATE diplomatic_requests SET status = 'expired', handled_at = ${at} WHERE id = ${requestId}`);
    throw ApiError.conflict("\u0627\u06CC\u0646 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A.");
  }
  if (!accept) {
    await db.run(sql`UPDATE diplomatic_requests SET status = 'rejected', handled_at = ${at} WHERE id = ${requestId}`);
    await notify(db, { nationId: fromId, kind: "diplomacy_rejected", title: "\u274C \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0631\u062F \u0634\u062F", body: `${me.flag} ${me.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A ${kindLabel(kind)} \u0631\u0627 \u0631\u062F \u06A9\u0631\u062F.` });
    return { status: "rejected" };
  }
  const stmts = [
    sql`UPDATE diplomatic_requests SET status = 'accepted', handled_at = ${at} WHERE id = ${requestId}`
  ];
  let allianceId = null;
  if (kind === "friendship" || kind === "non_aggression") {
    const status = kind === "friendship" ? "friend" : "peace_treaty";
    stmts.push(
      sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
           VALUES (${me.id}, ${fromId}, ${status}, ${at}, ${at})
           ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = ${status}, updated_at = ${at}`,
      sql`INSERT INTO diplomatic_relations (nation_id, other_nation_id, status, created_at, updated_at)
           VALUES (${fromId}, ${me.id}, ${status}, ${at}, ${at})
           ON CONFLICT (nation_id, other_nation_id) DO UPDATE SET status = ${status}, updated_at = ${at}`,
      sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
           VALUES ('news', ${MUTUAL_FOR.has(kind) ? "\u062A\u063A\u06CC\u06CC\u0631 \u0631\u0648\u0627\u0628\u0637 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9" : "\u0631\u0648\u0627\u0628\u0637 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9"},
                   ${`${me.flag} ${me.name} \u0648 ${req.from_flag} ${req.from_name}: ${RELATION_LABELS_FA[status]}`}, 'global', ${me.id}, ${at})`
    );
  } else if (kind === "alliance") {
    const existing = await db.first(
      sql`SELECT alliance_id FROM alliance_members WHERE nation_id = ${fromId} LIMIT 1`
    );
    if (existing) {
      allianceId = Number(existing.alliance_id);
      const size = await db.first(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE alliance_id = ${allianceId}`);
      if (Number(size?.c ?? 0) >= settings.diplomacy.maxAllianceMembers) throw ApiError.conflict("\u0638\u0631\u0641\u06CC\u062A \u0627\u0639\u0636\u0627\u06CC \u0627\u06CC\u0646 \u0627\u062A\u062D\u0627\u062F \u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F\u0647 \u0627\u0633\u062A.");
      const meAlready = await db.first(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE nation_id = ${me.id}`);
      if (Number(meAlready?.c ?? 0) > 0) throw ApiError.conflict("\u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0639\u0636\u0648 \u06CC\u06A9 \u0627\u062A\u062D\u0627\u062F \u062F\u06CC\u06AF\u0631 \u0627\u0633\u062A.");
      stmts.push(
        sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${me.id}, 'member', ${at})
             ON CONFLICT (alliance_id, nation_id) DO NOTHING`
      );
    } else {
      const name = String(req.alliance_name || `\u0627\u062A\u062D\u0627\u062F ${String(req.from_name)}`).slice(0, 40);
      const created = await db.first(
        sql`INSERT INTO alliances (name, leader_nation_id, status, created_by, created_at)
             VALUES (${name}, ${fromId}, 'active', NULL, ${at}) RETURNING id`
      );
      allianceId = Number(created?.id ?? 0);
      stmts.push(
        sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${fromId}, 'leader', ${at})
             ON CONFLICT (alliance_id, nation_id) DO NOTHING`,
        sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${me.id}, 'member', ${at})
             ON CONFLICT (alliance_id, nation_id) DO NOTHING`,
        sql`UPDATE alliances SET name = ${name} WHERE id = ${allianceId}`,
        sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
             VALUES ('alliance', 'اتحاد جدید تشکیل شد', ${`\u{1F91D} \u0627\u062A\u062D\u0627\u062F \xAB${name}\xBB \u0645\u06CC\u0627\u0646 ${req.from_name} \u0648 ${me.name}.`}, 'global', ${fromId}, ${at})`
      );
    }
    stmts.push(
      sql`UPDATE diplomatic_relations SET status = 'ally', alliance_id = ${allianceId}, updated_at = ${at}
           WHERE nation_id = ${me.id} AND other_nation_id = ${fromId}`,
      sql`UPDATE diplomatic_relations SET status = 'ally', alliance_id = ${allianceId}, updated_at = ${at}
           WHERE nation_id = ${fromId} AND other_nation_id = ${me.id}`
    );
  } else if (kind === "dissolve") {
    stmts.push(
      sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
           WHERE nation_id = ${me.id} AND other_nation_id = ${fromId}`,
      sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
           WHERE nation_id = ${fromId} AND other_nation_id = ${me.id}`
    );
  } else if (kind === "peace") {
    throw ApiError.validation("\u0635\u0644\u062D \u0627\u0632 \u0637\u0631\u06CC\u0642 \u062C\u0646\u06AF \u062B\u0628\u062A \u0645\u06CC\u200C\u0634\u0648\u062F.");
  }
  await db.batch(stmts);
  await notify(db, {
    nationId: fromId,
    kind: "diplomacy_accepted",
    title: "\u2705 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u067E\u0630\u06CC\u0631\u0641\u062A\u0647 \u0634\u062F",
    body: `${me.flag} ${me.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A ${kindLabel(kind)} \u0631\u0627 \u067E\u0630\u06CC\u0631\u0641\u062A.`,
    data: { allianceId },
    telegram: botToken ? { botToken, chatId: Number(fromId), text: `\u2705 ${me.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0634\u0645\u0627 \u0631\u0627 \u067E\u0630\u06CC\u0631\u0641\u062A.` } : null
  });
  await audit(db, { actor, action: `diplomacy.accept_${kind}`, targetType: "nation", targetId: me.id, after: { requestId, fromId } });
  return { status: "accepted", allianceId };
}
async function listRelations(db, nationId) {
  const rows = await db.all(
    sql`SELECT r.status, r.updated_at, r.alliance_id, o.id AS other_id, o.name AS other_name, o.flag AS other_flag,
               o.leader_name AS other_leader, a.name AS alliance_name, o.treasury, o.military_power, o.world_rank
          FROM diplomatic_relations r
          JOIN nations o ON o.id = r.other_nation_id
          LEFT JOIN alliances a ON a.id = r.alliance_id
         WHERE r.nation_id = ${nationId}
         ORDER BY CASE r.status WHEN 'ally' THEN 0 WHEN 'friend' THEN 1 WHEN 'negotiating' THEN 2 WHEN 'peace_treaty' THEN 3 WHEN 'enemy' THEN 4 ELSE 5 END, o.world_rank`
  );
  return rows.map((r) => ({
    otherNationId: Number(r.other_id),
    otherNationName: String(r.other_name),
    otherFlag: String(r.other_flag),
    otherLeaderName: String(r.other_leader),
    otherTreasury: Number(r.treasury),
    otherMilitaryPower: Number(r.military_power),
    otherWorldRank: Number(r.world_rank),
    status: String(r.status),
    statusLabelFa: RELATION_LABELS_FA[r.status] ?? String(r.status),
    since: toIso(Number(r.updated_at)),
    allianceId: r.alliance_id === null ? null : Number(r.alliance_id),
    allianceName: r.alliance_name ?? null
  }));
}
async function dissolveRelation(db, me, otherNationId, settings, botToken) {
  const rel = await db.first(
    sql`SELECT id, status FROM diplomatic_relations WHERE nation_id = ${me.id} AND other_nation_id = ${otherNationId}`
  );
  if (!rel) throw ApiError.notFound("\u0631\u0627\u0628\u0637\u0647\u200C\u0627\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  const at = nowSeconds();
  if (rel.status === "ally") {
    await db.batch([
      sql`INSERT INTO diplomatic_requests (kind, status, from_nation_id, to_nation_id, message, expires_at, created_at)
           VALUES ('dissolve', 'pending', ${me.id}, ${otherNationId}, ${`${me.name} \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062E\u0631\u0648\u062C \u0627\u0632 \u0627\u062A\u062D\u0627\u062F/\u0644\u063A\u0648 \u0631\u0648\u0627\u0628\u0637 \u062F\u0627\u062F.`},
                   ${at + settings.diplomacy.requestExpirySeconds}, ${at})`
    ]);
    const allyRow = await db.first(sql`SELECT alliance_id FROM alliance_members WHERE nation_id = ${me.id} LIMIT 1`);
    if (allyRow) await leaveAlliance(db, me, Number(allyRow.alliance_id), at);
    return { status: "pending", note: "\u062E\u0631\u0648\u062C \u0627\u0632 \u0627\u062A\u062D\u0627\u062F \u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u0627\u0637\u0644\u0627\u0639 \u0633\u0627\u06CC\u0631 \u0627\u0639\u0636\u0627 \u0627\u0633\u062A." };
  }
  await db.batch([
    sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
         WHERE nation_id = ${me.id} AND other_nation_id = ${otherNationId}`,
    sql`UPDATE diplomatic_relations SET status = 'neutral', alliance_id = NULL, updated_at = ${at}
         WHERE nation_id = ${otherNationId} AND other_nation_id = ${me.id}`
  ]);
  await notify(db, { nationId: otherNationId, kind: "diplomacy", title: "\u{1F51A} \u0644\u063A\u0648 \u0631\u0648\u0627\u0628\u0637", body: `${me.name} \u0631\u0648\u0627\u0628\u0637 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9 \u0631\u0627 \u0644\u063A\u0648 \u06A9\u0631\u062F.`, telegram: botToken ? { botToken, chatId: otherNationId, text: "\u{1F51A} \u0631\u0648\u0627\u0628\u0637 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9 \u0644\u063A\u0648 \u0634\u062F." } : null });
  return { status: "neutral" };
}
async function createAlliance(db, me, name, settings) {
  if (!settings.features.diplomacyEnabled) throw ApiError.disabled("\u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC");
  const clean = name.trim().slice(0, 40);
  if (clean.length < 3) throw ApiError.validation("\u0646\u0627\u0645 \u0627\u062A\u062D\u0627\u062F \u062D\u062F\u0627\u0642\u0644 \u06F3 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u06CC\u062F \u0628\u0627\u0634\u062F.");
  const alreadyMember = await db.first(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE nation_id = ${me.id}`);
  if (Number(alreadyMember?.c ?? 0) > 0) throw ApiError.conflict("\u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0639\u0636\u0648 \u06CC\u06A9 \u0627\u062A\u062D\u0627\u062F \u0627\u0633\u062A. \u0627\u0628\u062A\u062F\u0627 \u062E\u0627\u0631\u062C \u0634\u0648\u06CC\u062F.");
  const dupName = await db.first(sql`SELECT id FROM alliances WHERE name = ${clean} COLLATE NOCASE AND status = 'active'`);
  if (dupName) throw ApiError.conflict("\u0627\u06CC\u0646 \u0646\u0627\u0645 \u0627\u062A\u062D\u0627\u062F \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.");
  const at = nowSeconds();
  const created = await db.first(
    sql`INSERT INTO alliances (name, leader_nation_id, status, created_at) VALUES (${clean}, ${me.id}, 'active', ${at}) RETURNING id`
  );
  const allianceId = Number(created?.id ?? 0);
  await db.batch([
    sql`INSERT INTO alliance_members (alliance_id, nation_id, role, joined_at) VALUES (${allianceId}, ${me.id}, 'leader', ${at})`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('alliance', 'اتحاد جدید', ${`\u{1F6E1}\uFE0F \u0627\u062A\u062D\u0627\u062F \xAB${clean}\xBB \u062A\u0648\u0633\u0637 ${me.name} \u062A\u0623\u0633\u06CC\u0633 \u0634\u062F.`}, 'global', ${me.id}, ${at})`
  ]);
  return { allianceId, name: clean };
}
async function leaveAlliance(db, me, allianceId, at = nowSeconds()) {
  const membership = await db.first(
    sql`SELECT role FROM alliance_members WHERE alliance_id = ${allianceId} AND nation_id = ${me.id}`
  );
  if (!membership) throw ApiError.notFound("\u0634\u0645\u0627 \u0639\u0636\u0648 \u0627\u06CC\u0646 \u0627\u062A\u062D\u0627\u062F \u0646\u06CC\u0633\u062A\u06CC\u062F.");
  const size = await db.first(sql`SELECT COUNT(*) AS c FROM alliance_members WHERE alliance_id = ${allianceId}`);
  const stmts = [
    sql`DELETE FROM alliance_members WHERE alliance_id = ${allianceId} AND nation_id = ${me.id}`,
    sql`UPDATE diplomatic_relations SET status = 'friend', alliance_id = NULL, updated_at = ${at}
         WHERE alliance_id = ${allianceId} AND nation_id = ${me.id}`
  ];
  if (membership.role === "leader") {
    const next = await db.first(
      sql`SELECT nation_id FROM alliance_members WHERE alliance_id = ${allianceId} AND nation_id <> ${me.id} ORDER BY joined_at LIMIT 1`
    );
    if (next && Number(size?.c ?? 0) > 1) {
      stmts.push(sql`UPDATE alliances SET leader_nation_id = ${next.nation_id} WHERE id = ${allianceId}`);
    } else {
      stmts.push(sql`UPDATE alliances SET status = 'disbanded', disbanded_at = ${at} WHERE id = ${allianceId}`);
    }
  }
  await db.batch(stmts);
  return { left: true };
}
async function listAlliances(db, limit = 30) {
  const rows = await db.all(
    sql`SELECT a.id, a.name, a.motto, a.status, a.created_at, l.name AS leader_name, l.flag AS leader_flag,
               COUNT(m.nation_id) AS members,
               COALESCE(SUM(n.military_power), 0) AS power,
               COALESCE(SUM(n.treasury), 0) AS treasury
          FROM alliances a
          JOIN nations l ON l.id = a.leader_nation_id
          LEFT JOIN alliance_members m ON m.alliance_id = a.id
          LEFT JOIN nations n ON n.id = m.nation_id
         WHERE a.status = 'active'
         GROUP BY a.id ORDER BY power DESC LIMIT ${Math.min(100, Math.max(1, limit))}`
  );
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    motto: r.motto ?? null,
    status: String(r.status),
    leaderName: String(r.leader_name),
    leaderFlag: String(r.leader_flag),
    members: Number(r.members),
    power: Number(r.power),
    treasury: Number(r.treasury),
    createdAt: toIso(Number(r.created_at))
  }));
}
async function myAlliance(db, nationId) {
  const row = await db.first(
    sql`SELECT a.id, a.name, a.status, am.role, a.leader_nation_id, a.created_at
          FROM alliances a JOIN alliance_members am ON am.alliance_id = a.id
         WHERE am.nation_id = ${nationId} AND a.status = 'active' LIMIT 1`
  );
  if (!row) return null;
  const members = await db.all(
    sql`SELECT n.id, n.name, n.flag, n.leader_name, n.military_power, n.world_rank, am.role, am.joined_at
          FROM alliance_members am JOIN nations n ON n.id = am.nation_id
         WHERE am.alliance_id = ${row.id} ORDER BY CASE am.role WHEN 'leader' THEN 0 ELSE 1 END, n.world_rank`
  );
  return {
    id: Number(row.id),
    name: String(row.name),
    status: String(row.status),
    myRole: String(row.role),
    leaderNationId: Number(row.leader_nation_id),
    createdAt: toIso(Number(row.created_at)),
    members: members.map((m) => ({
      nationId: Number(m.id),
      name: String(m.name),
      flag: String(m.flag),
      leaderName: String(m.leader_name),
      militaryPower: Number(m.military_power),
      worldRank: Number(m.world_rank),
      role: String(m.role),
      joinedAt: toIso(Number(m.joined_at))
    }))
  };
}
async function expireRequests(db, now = nowSeconds(), limit = 50) {
  const r = await db.run(
    sql`UPDATE diplomatic_requests SET status = 'expired'
         WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at < ${now}
           AND id IN (SELECT id FROM diplomatic_requests WHERE status = 'pending' AND expires_at < ${now} ORDER BY id LIMIT ${limit})`
  );
  return r.meta.changes ?? 0;
}
var MUTUAL_FOR;
var init_diplomacyService = __esm({
  "apps/worker/src/services/diplomacyService.ts"() {
    "use strict";
    init_src();
    init_sql();
    init_errors2();
    init_format();
    init_auditService();
    init_notificationService();
    MUTUAL_FOR = /* @__PURE__ */ new Set(["friendship", "non_aggression"]);
  }
});

// apps/worker/src/bot/botActions.ts
var botActions_exports = {};
__export(botActions_exports, {
  previewForWarTarget: () => previewForWarTarget,
  sendRequestFriendly: () => sendRequestFriendly
});
async function sendRequestFriendly(db, from, toNationId, kind, settings) {
  try {
    const res = await sendRequest(
      db,
      from,
      { toNationId, kind, message: kind === "friendship" ? `\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u0648\u0633\u062A\u06CC \u0627\u0632 \u0633\u0648\u06CC ${from.name}` : null },
      settings
    );
    return `\u2705 \u062F\u0631\u062E\u0648\u0627\u0633\u062A ${kind === "friendship" ? "\u062F\u0648\u0633\u062A\u06CC" : kind === "alliance" ? "\u0627\u062A\u062D\u0627\u062F" : kind === "message" ? "\u067E\u06CC\u0627\u0645" : "\u0639\u062F\u0645 \u062A\u062C\u0627\u0648\u0632"} \u0627\u0631\u0633\u0627\u0644 \u0634\u062F (\u0634\u0646\u0627\u0633\u0647 ${res.requestId}). \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u067E\u0627\u0633\u062E \u06A9\u0634\u0648\u0631 \u0645\u0642\u0627\u0628\u0644.`;
  } catch (err) {
    if (err instanceof ApiError) return `\u26A0\uFE0F ${err.message}`;
    throw err;
  }
}
async function previewForWarTarget(db, attacker, targetId, settings, attackPlan) {
  if (attacker.id === targetId) throw ApiError.forbidden("\u062D\u0645\u0644\u0647 \u0628\u0647 \u06A9\u0634\u0648\u0631 \u062E\u0648\u062F \u0627\u0645\u06A9\u0627\u0646\u200C\u067E\u0630\u06CC\u0631 \u0646\u06CC\u0633\u062A.");
  const target = await loadNation(db, targetId);
  let att;
  if (attackPlan) {
    const { normalizeAttackPlan: normalizeAttackPlan2, validateAttackPlan: validateAttackPlan2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
    const plan = normalizeAttackPlan2(attackPlan);
    if (plan) {
      await validateAttackPlan2(db, attacker.id, plan);
      const { loadInventory: loadInventory2, loadCategoryWeights: loadCategoryWeights2 } = await Promise.resolve().then(() => (init_queries(), queries_exports));
      const { computePower: computePower2 } = await Promise.resolve().then(() => (init_scoring(), scoring_exports));
      const inventory = await loadInventory2(db, attacker.id);
      const committed = plan.map((e) => {
        const inv = inventory.find((i) => i.templateId === e.templateId);
        return { templateId: e.templateId, categoryKey: inv.categoryKey, quantity: Math.min(e.quantity, inv.quantity), attackPoints: inv.attackPoints, defensePoints: inv.defensePoints };
      });
      const power = computePower2(committed, await loadCategoryWeights2(db), { manpowerFactor: settings.battle.manpowerFactor, fortificationLevel: 0 });
      att = { nationId: attacker.id, attackPower: power.attackPower, defensePower: power.defensePower, troopsCount: power.troopsCount, equipmentCount: power.equipmentCount, treasury: attacker.treasury, allianceSupport: 0, fortificationLevel: 0, morale: 1 };
    } else {
      att = await combatant(db, attacker, settings, "attacker");
    }
  } else {
    att = await combatant(db, attacker, settings, "attacker");
  }
  const def = await defenderCombatant(db, target, settings);
  const p = previewBattle(att, def, settings.battle);
  return {
    targetName: target.name,
    targetFlag: target.flag,
    attackerPower: att.attackPower,
    defenderPower: def.defensePower,
    attackerWinChance: p.attackerWinChance,
    entryCost: p.entryCost,
    maxRounds: settings.battle.maxRounds,
    expectedLossPercent: p.expectedLossPercent
  };
}
async function defenderCombatant(db, nation, settings) {
  const { defenseCombatantOf: defenseCombatantOf2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  return defenseCombatantOf2(db, nation, settings);
}
async function combatant(db, nation, settings, side) {
  const computed = await computeNation(db, nation, settings);
  const ns = await db.first(
    sql`SELECT fortification_level FROM nation_settings WHERE nation_id = ${nation.id}`
  );
  return {
    nationId: nation.id,
    attackPower: computed.power.attackPower,
    defensePower: computed.power.defensePower,
    troopsCount: computed.power.troopsCount,
    equipmentCount: computed.power.equipmentCount,
    treasury: nation.treasury,
    allianceSupport: 0,
    fortificationLevel: ns?.fortification_level ?? 0,
    morale: 1
  };
}
var init_botActions = __esm({
  "apps/worker/src/bot/botActions.ts"() {
    "use strict";
    init_sql();
    init_errors2();
    init_queries();
    init_diplomacyService();
    init_battle();
    init_queries();
  }
});

// node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  res;
  status;
  /**
  * Creates an instance of `HTTPException`.
  * @param status - HTTP status code for the exception. Defaults to 500.
  * @param options - Additional options for the exception.
  */
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  /**
  * Returns the response object associated with the exception.
  * If a response object is not provided, a new response is created with the error message and status code.
  * @returns The response object.
  */
  getResponse() {
    if (this.res) return new Response(this.res.body, {
      status: this.status,
      headers: this.res.headers
    });
    return new Response(this.message, { status: this.status });
  }
};

// node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = Symbol();

// node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  return new Response(arrayBuffer, { headers: { "Content-Type": contentType.replace(/^[^;]+/, (mediaType) => mediaType.toLowerCase()) } }).formData();
};

// node_modules/hono/dist/utils/body.js
var MAX_NESTED_OBJECTS = 1e4;
var isRawRequest = (request) => "headers" in request;
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const mediaType = (isRawRequest(request) ? request.headers : request.raw.headers).get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (mediaType === "multipart/form-data" || mediaType === "application/x-www-form-urlencoded") return parseFormData(request, {
    all,
    dot
  });
  return {};
};
async function parseFormData(request, options) {
  if (!isRawRequest(request) && request.bodyCache.formData) return convertFormDataToBodyData(await request.bodyCache.formData, options);
  const headers = isRawRequest(request) ? request.headers : request.raw.headers;
  const arrayBuffer = await request.arrayBuffer();
  const formDataPromise = bufferToFormData(arrayBuffer, headers.get("Content-Type") || "");
  if (!isRawRequest(request)) request.bodyCache.formData = formDataPromise;
  const formData = await formDataPromise;
  if (formData) return convertFormDataToBodyData(formData, options);
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  const nestingState = { count: 0 };
  formData.forEach((value, key) => {
    if (!(options.all || key.endsWith("[]"))) form[key] = value;
    else handleParsingAllValues(form, key, value);
  });
  if (options.dot) Object.entries(form).forEach(([key, value]) => {
    if (key.includes(".")) {
      handleParsingNestedValues(form, key, value, nestingState);
      delete form[key];
    }
  });
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) form[key].push(value);
    else form[key] = [form[key], value];
  } else if (!key.endsWith("[]")) form[key] = value;
  else form[key] = [value];
};
var handleParsingNestedValues = (form, key, value, state) => {
  if (/(?:^|\.)(?:__proto__|constructor\.prototype)\./.test(key)) return;
  let nestedForm = form;
  const keys = key.split(".", 34);
  if (keys.length > 33) throwNestingLimitExceeded();
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) nestedForm[key2] = value;
    else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        if (state.count++ >= MAX_NESTED_OBJECTS) throwNestingLimitExceeded();
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var throwNestingLimitExceeded = () => {
  throw new Error("Nesting limit exceeded");
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") paths.shift();
  return paths;
};
var splitRoutingPath = (routePath2) => {
  const { groups, path } = extractGroupsFromPath(routePath2);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return {
    groups,
    path
  };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) if (paths[j].includes(mark)) {
      paths[j] = paths[j].replace(mark, groups[i][1]);
      break;
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") return "*";
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [
        cacheKey,
        match2[1],
        new RegExp(`^(?:${match2[2]})(?=/${next})`)
      ] : [
        label,
        match2[1],
        new RegExp(`^(?:${match2[2]})$`)
      ];
      else patternCache[cacheKey] = [
        label,
        match2[1],
        true
      ];
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var decodeURIWithPreservedPercent = (value) => decodeURI(value.includes("%25") ? value.replace(/%25/g, "%2525") : value);
var getPath = (request) => {
  const url = request.url;
  const start = url.charCodeAt(0) === 47 ? 0 : url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      const decoded = tryDecode(path, decodeURIWithPreservedPercent);
      if (/%(?![0-9A-Fa-f]{2})/.test(path)) {
        const rewritten = new URL("http://localhost");
        rewritten.pathname = decoded.replace(/[\\\t\n\r]/g, encodeURIComponent);
        if (tryDecode(rewritten.pathname, decodeURIWithPreservedPercent) !== decoded) return tryDecode(path.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"), decodeURIWithPreservedPercent);
      }
      return decoded;
    } else if (charCode === 63 || charCode === 35) break;
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) sub = mergePath(sub, ...rest);
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) return null;
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) basePath += "/" + segment;
    else if (/\:/.test(segment)) {
      if (segment.charCodeAt(segment.length - 1) === 63) {
        if (results.length === 0 && basePath === "") results.push("/");
        else results.push(basePath);
        const optionalSegment = segment.slice(0, -1);
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else basePath += "/" + segment;
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var tryDecodeURIComponent = (str) => str.indexOf("%") !== -1 ? tryDecode(str, decodeURIComponent_) : str;
var _decodeURI = (value) => {
  if (value.indexOf("+") !== -1) value = value.replace(/\+/g, " ");
  return tryDecodeURIComponent(value);
};
var _getQueryParam = (url, key, multiple) => {
  const hashIndex = url.indexOf("#", 8);
  if (hashIndex !== -1) url = url.slice(0, hashIndex);
  let encoded;
  if (!multiple && key && !/[%+&=]/.test(key)) {
    const queryIndex = url.indexOf("?", 8);
    let keyIndex2 = queryIndex;
    if (keyIndex2 === -1) return;
    if (!url.startsWith(key, keyIndex2 + 1)) keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61 || trailingKeyCode === 38 || isNaN(trailingKeyCode)) {
        if (keyIndex2 > queryIndex && /(?:^|&)[^=&]*[%+]/.test(url.slice(queryIndex + 1, keyIndex2))) break;
        if (trailingKeyCode === 61) {
          const valueIndex = keyIndex2 + key.length + 2;
          const endIndex = url.indexOf("&", valueIndex);
          return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
        }
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) return;
  }
  const results = /* @__PURE__ */ Object.create(null);
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) valueIndex = -1;
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex);
    if (encoded) name = _decodeURI(name);
    keyIndex = nextKeyIndex;
    if (name === "") continue;
    let value;
    if (valueIndex === -1) value = "";
    else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) value = _decodeURI(value);
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) results[name] = [];
      results[name].push(value);
    } else results[name] ??= value;
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  /**
  * `.raw` can get the raw Request object.
  *
  * @see {@link https://hono.dev/docs/api/request#raw}
  *
  * @example
  * ```ts
  * // For Cloudflare Workers
  * app.post('/', async (c) => {
  *   const metadata = c.req.raw.cf?.hostMetadata?
  *   ...
  * })
  * ```
  */
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  /**
  * `.path` can get the pathname of the request.
  *
  * @see {@link https://hono.dev/docs/api/request#path}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const pathname = c.req.path // `/about/me`
  * })
  * ```
  */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex]?.[1][key];
    const param = this.#getParamValue(paramKey);
    return param && tryDecodeURIComponent(param);
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex]?.[1] ?? {});
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) decoded[key] = tryDecodeURIComponent(value);
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) return this.raw.headers.get(name) ?? void 0;
    const headerData = /* @__PURE__ */ Object.create(null);
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) return cachedBody;
    for (const anyCachedKey in bodyCache) return bodyCache[anyCachedKey].then((body) => {
      if (anyCachedKey === "json") body = JSON.stringify(body);
      const contentType = anyCachedKey === "formData" ? void 0 : raw2.headers.get("content-type");
      return new Response(body, { headers: contentType ? { "Content-Type": contentType } : void 0 })[key]();
    });
    return bodyCache[key] = raw2[key]();
  };
  /**
  * `.json()` can parse Request body of type `application/json`
  *
  * @see {@link https://hono.dev/docs/api/request#json}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.json()
  * })
  * ```
  */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
  * `.text()` can parse Request body of type `text/plain`
  *
  * @see {@link https://hono.dev/docs/api/request#text}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.text()
  * })
  * ```
  */
  text() {
    return this.#cachedBody("text");
  }
  /**
  * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
  *
  * @see {@link https://hono.dev/docs/api/request#arraybuffer}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.arrayBuffer()
  * })
  * ```
  */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
  * `.bytes()` parses the request body as a `Uint8Array`.
  *
  * @see {@link https://hono.dev/docs/api/request#bytes}
  *
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.bytes()
  * })
  * ```
  */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
  * Parses the request body as a `Blob`.
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.blob();
  * });
  * ```
  * @see https://hono.dev/docs/api/request#blob
  */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
  * Parses the request body as `FormData`.
  * @example
  * ```ts
  * app.post('/entry', async (c) => {
  *   const body = await c.req.formData();
  * });
  * ```
  * @see https://hono.dev/docs/api/request#formdata
  */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
  * Adds validated data to the request.
  *
  * @param target - The target of the validation.
  * @param data - The validated data to add.
  */
  addValidatedData(target, data) {
    (this.#validatedData ??= {})[target] = data;
  }
  valid(target) {
    return this.#validatedData?.[target];
  }
  /**
  * `.url` can get the request url strings.
  *
  * @see {@link https://hono.dev/docs/api/request#url}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const url = c.req.url // `http://localhost:8787/about/me`
  *   ...
  * })
  * ```
  */
  get url() {
    return this.raw.url;
  }
  /**
  * `.method` can get the method name of the request.
  *
  * @see {@link https://hono.dev/docs/api/request#method}
  *
  * @example
  * ```ts
  * app.get('/about/me', (c) => {
  *   const method = c.req.method // `GET`
  * })
  * ```
  */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
  * `.matchedRoutes` can return a matched route in the handler
  *
  * @deprecated
  *
  * Use matchedRoutes helper defined in "hono/route" instead.
  *
  * @see {@link https://hono.dev/docs/api/request#matchedroutes}
  *
  * @example
  * ```ts
  * app.use('*', async function logger(c, next) {
  *   await next()
  *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
  *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
  *     console.log(
  *       method,
  *       ' ',
  *       path,
  *       ' '.repeat(Math.max(10 - path.length, 0)),
  *       name,
  *       i === c.req.routeIndex ? '<- respond from here' : ''
  *     )
  *   })
  * })
  * ```
  */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
  * `.routePath` can retrieve the path registered within the handler
  *
  * @deprecated
  *
  * Use routePath helper defined in "hono/route" instead.
  *
  * @see {@link https://hono.dev/docs/api/request#routepath}
  *
  * @example
  * ```ts
  * app.get('/posts/:id', (c) => {
  *   return c.json({ path: c.req.routePath })
  * })
  * ```
  */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) str = str.toString();
    if (str instanceof Promise) str = await str;
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) return Promise.resolve(str);
  if (buffer) buffer[0] += str;
  else buffer = [str];
  const resStr = Promise.all(callbacks.map((c) => c({
    phase,
    buffer,
    context
  }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) return raw(await resStr, callbacks);
  else return resStr;
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context = class {
  #rawRequest;
  #req;
  /**
  * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
  *
  * @see {@link https://hono.dev/docs/api/context#env}
  *
  * @example
  * ```ts
  * // Environment object for Cloudflare Workers
  * app.get('*', async c => {
  *   const counter = c.env.COUNTER
  * })
  * ```
  */
  env = {};
  #var;
  finalized = false;
  /**
  * `.error` can get the error object from the middleware if the Handler throws an error.
  *
  * @see {@link https://hono.dev/docs/api/context#error}
  *
  * @example
  * ```ts
  * app.use('*', async (c, next) => {
  *   await next()
  *   if (c.error) {
  *     // do something...
  *   }
  * })
  * ```
  */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
  * Creates an instance of the Context class.
  *
  * @param req - The Request object.
  * @param options - Optional configuration options for the context.
  */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
  * `.req` is the instance of {@link HonoRequest}.
  */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#event}
  * The FetchEvent associated with the current request.
  *
  * @throws Will throw an error if the context does not have a FetchEvent.
  */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) return this.#executionCtx;
    else throw Error("This context has no FetchEvent");
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#executionctx}
  * The ExecutionContext associated with the current request.
  *
  * @throws Will throw an error if the context does not have an ExecutionContext.
  */
  get executionCtx() {
    if (this.#executionCtx) return this.#executionCtx;
    else throw Error("This context has no ExecutionContext");
  }
  /**
  * @see {@link https://hono.dev/docs/api/context#res}
  * The Response object for the current request.
  */
  get res() {
    return this.#res ||= createResponseInstance(null, { headers: this.#preparedHeaders ??= new Headers() });
  }
  /**
  * Sets the Response object for the current request.
  *
  * @param _res - The Response object to set.
  */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") continue;
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) _res.headers.append("set-cookie", cookie);
        } else _res.headers.set(k, v);
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
  * `.render()` can create a response within a layout.
  *
  * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
  *
  * @example
  * ```ts
  * app.get('/', (c) => {
  *   return c.render('Hello!')
  * })
  * ```
  */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
  * Sets the layout for the response.
  *
  * @param layout - The layout to set.
  * @returns The layout function.
  */
  setLayout = (layout) => this.#layout = layout;
  /**
  * Gets the current layout for the response.
  *
  * @returns The current layout function.
  */
  getLayout = () => this.#layout;
  /**
  * `.setRenderer()` can set the layout in the custom middleware.
  *
  * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
  *
  * @example
  * ```tsx
  * app.use('*', async (c, next) => {
  *   c.setRenderer((content) => {
  *     return c.html(
  *       <html>
  *         <body>
  *           <p>{content}</p>
  *         </body>
  *       </html>
  *     )
  *   })
  *   await next()
  * })
  * ```
  */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
  * `.header()` can set headers.
  *
  * @see {@link https://hono.dev/docs/api/context#header}
  *
  * @example
  * ```ts
  * app.get('/welcome', (c) => {
  *   // Set headers
  *   c.header('X-Message', 'Hello!')
  *   c.header('Content-Type', 'text/plain')
  *
  *   // Append multiple headers using the append option (e.g. Vary)
  *   c.header('Vary', 'Accept-Encoding', { append: true })
  *   c.header('Vary', 'User-Agent', { append: true })
  *
  *   return c.body('Thank you for coming')
  * })
  * ```
  */
  header = (name, value, options) => {
    if (this.finalized && !this.#res.bodyUsed) this.#res = createResponseInstance(this.#res.body, this.#res);
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) headers.delete(name);
    else if (options?.append) headers.append(name, value);
    else headers.set(name, value);
  };
  status = (status) => {
    this.#status = status;
  };
  /**
  * `.set()` can set the value specified by the key.
  *
  * @see {@link https://hono.dev/docs/api/context#set-get}
  *
  * @example
  * ```ts
  * app.use('*', async (c, next) => {
  *   c.set('message', 'Hono is hot!!')
  *   await next()
  * })
  * ```
  */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
  * `.get()` can use the value specified by the key.
  *
  * @see {@link https://hono.dev/docs/api/context#set-get}
  *
  * @example
  * ```ts
  * app.get('/', (c) => {
  *   const message = c.get('message')
  *   return c.text(`The message is "${message}"`)
  * })
  * ```
  */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
  * `.var` can access the value of a variable.
  *
  * @see {@link https://hono.dev/docs/api/context#var}
  *
  * @example
  * ```ts
  * const result = c.var.client.oneMethod()
  * ```
  */
  get var() {
    if (!this.#var) return {};
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    let responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders;
    if (typeof arg === "object" && arg.headers) {
      responseHeaders ??= new Headers();
      for (const [key, value] of new Headers(arg.headers)) if (key === "set-cookie") responseHeaders.append(key, value);
      else responseHeaders.set(key, value);
    }
    if (headers) {
      if (!responseHeaders) {
        let count = 0;
        for (const k in headers) if (++count > 1 || typeof headers[k] !== "string") {
          responseHeaders = new Headers();
          break;
        }
      }
      if (responseHeaders) for (const k in headers) {
        const v = headers[k];
        if (typeof v === "string") responseHeaders.set(k, v);
        else {
          responseHeaders.delete(k);
          for (const v2 of v) responseHeaders.append(k, v2);
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, {
      status,
      headers: responseHeaders ?? headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
  * `.body()` can return the HTTP response.
  * You can set headers with `.header()` and set HTTP status code with `.status`.
  * This can also be set in `.text()`, `.json()` and so on.
  *
  * @see {@link https://hono.dev/docs/api/context#body}
  *
  * @example
  * ```ts
  * app.get('/welcome', (c) => {
  *   // Set headers
  *   c.header('X-Message', 'Hello!')
  *   c.header('Content-Type', 'text/plain')
  *   // Set HTTP status code
  *   c.status(201)
  *
  *   // Return the response body
  *   return c.body('Thank you for coming')
  * })
  * ```
  */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
  * `.text()` can render text as `Content-Type:text/plain`.
  *
  * @see {@link https://hono.dev/docs/api/context#text}
  *
  * @example
  * ```ts
  * app.get('/say', (c) => {
  *   return c.text('Hello!')
  * })
  * ```
  */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(text, arg, setDefaultContentType(TEXT_PLAIN, headers));
  };
  /**
  * `.json()` can render JSON as `Content-Type:application/json`.
  *
  * @see {@link https://hono.dev/docs/api/context#json}
  *
  * @example
  * ```ts
  * app.get('/api', (c) => {
  *   return c.json({ message: 'Hello!' })
  * })
  * ```
  */
  json = (object, arg, headers) => {
    return this.#newResponse(JSON.stringify(object), arg, setDefaultContentType("application/json", headers));
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
  * `.redirect()` can Redirect, default status code is 302.
  *
  * @see {@link https://hono.dev/docs/api/context#redirect}
  *
  * @example
  * ```ts
  * app.get('/redirect', (c) => {
  *   return c.redirect('/')
  * })
  * app.get('/redirect-permanently', (c) => {
  *   return c.redirect('/', 301)
  * })
  * ```
  */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header("Location", !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString));
    return this.newResponse(null, status ?? 302);
  };
  /**
  * `.notFound()` can return the Not Found Response.
  *
  * @see {@link https://hono.dev/docs/api/context#notfound}
  *
  * @example
  * ```ts
  * app.get('/notfound', (c) => {
  *   return c.notFound()
  * })
  * ```
  */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      let res;
      let isError = false;
      let handler2;
      if (middleware[i]) {
        handler2 = middleware[i][0][0];
        context.req.routeIndex = i;
      } else handler2 = i === middleware.length && next || void 0;
      if (handler2) try {
        res = await handler2(context, () => dispatch(i + 1));
      } catch (err) {
        if (err instanceof Error && onError) {
          context.error = err;
          res = await onError(err, context);
          isError = true;
        } else throw err;
      }
      else if (context.finalized === false && onNotFound) res = await onNotFound(context);
      if (res && (context.finalized === false || isError)) context.res = res;
      return context;
    }
  };
};

// node_modules/hono/dist/helper/route/index.js
var matchedRoutes = (c) => c.req[GET_MATCH_RESULT][0].map(([[, route]]) => route);
var routePath = (c, index) => matchedRoutes(c).at(index ?? c.req.routeIndex)?.path ?? "";

// node_modules/hono/dist/router.js
var METHODS = [
  "get",
  "post",
  "put",
  "delete",
  "options",
  "patch",
  "query"
];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/utils/mount.js
var countTrailingSlashes = (path) => {
  let index = path.length;
  while (index > 0 && path.charCodeAt(index - 1) === 47) index--;
  return path.length - index;
};
var getPathPrefixLength = (c, pathPrefix, routePath2) => {
  if (!/[:*]/.test(pathPrefix)) return pathPrefix.length;
  const path = c.req.path;
  const matchResult = c.req[GET_MATCH_RESULT];
  const paramNames = /* @__PURE__ */ new Set();
  let length = 0;
  for (const part of splitRoutingPath(pathPrefix)) {
    if (part[0] === ":" && part.endsWith("}?")) throw new Error(`mount(): Optional regular expression parameters are not supported in "${routePath2}".`);
    const pattern = getPattern(part);
    if (pattern && pattern !== "*") {
      const name = pattern[1];
      if (paramNames.has(name)) throw new Error(`mount(): Duplicate path parameter "${name}" in "${routePath2}".`);
      paramNames.add(name);
    }
    if (pattern && pattern !== "*" && pattern[2] !== true) {
      const value = matchResult.length === 2 ? matchResult[1][matchResult[0][c.req.routeIndex][1][pattern[1]]] : matchResult[0][c.req.routeIndex][1][pattern[1]];
      length += value.length + 1;
    } else if (pattern || part.endsWith("*")) {
      const end = path.indexOf("/", length + 1);
      length = end === -1 ? path.length : end;
    } else length += part.length + 1;
  }
  return length;
};
var createMountedRequest = (c, pathPrefix, routePath2) => {
  if (/[^/]\*$/.test(routePath2)) throw new Error(`mount(): Wildcard must follow "/" in "${routePath2}".`);
  const prefixLength = getPathPrefixLength(c, pathPrefix, routePath2);
  const path = c.req.path.slice(prefixLength) || "/";
  if (prefixLength > c.req.path.length || path[0] !== "/" || /\/(?:\.|%2e){1,2}(?:\/|$)/i.test(path)) throw new HTTPException(400, { message: "Invalid mounted path" });
  const rawUrl = c.req.raw.url;
  if (/^[^/?#]*\/\/[^/?#\\]*[?#\\]/.test(rawUrl)) throw new HTTPException(400, { message: "Invalid mounted path" });
  const rawPathEnd = rawUrl.search(/[?#]/);
  const rawTrailingSlashes = countTrailingSlashes(rawPathEnd === -1 ? rawUrl : rawUrl.slice(0, rawPathEnd));
  if (rawTrailingSlashes > 1 && countTrailingSlashes(c.req.path) === rawTrailingSlashes - 1) throw new HTTPException(400, { message: "Invalid mounted path" });
  const url = new URL(rawUrl);
  url.pathname = path.replace(/[\\\t\n\r]/g, encodeURIComponent);
  if (path.includes("%")) {
    let decoded;
    try {
      decoded = decodeURI(path);
    } catch {
    }
    if (decoded === void 0) {
      if (tryDecode(url.pathname, (value) => decodeURI(value.replace(/%25/g, "%2525"))) !== path) throw new HTTPException(400, { message: "Invalid mounted path" });
    }
  }
  return new Request(url, c.req.raw);
};

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class Hono2 {
  get;
  post;
  put;
  delete;
  options;
  patch;
  query;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    [...METHODS, "all"].forEach((method) => {
      this[method] = (args1, ...args) => {
        const methodName = method.toUpperCase();
        if (typeof args1 === "string") this.#path = args1;
        else this.#addRoute(methodName, this.#path, args1);
        args.forEach((handler2) => {
          this.#addRoute(methodName, this.#path, handler2);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          const methodName = m.toUpperCase();
          for (const handler2 of handlers) this.#addRoute(methodName, this.#path, handler2);
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") this.#path = arg1;
      else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler2) => {
        this.#addRoute("ALL", this.#path, handler2);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono2({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  /**
  * `.route()` allows grouping other Hono instance in routes.
  *
  * @see {@link https://hono.dev/docs/api/routing#grouping}
  *
  * @param {string} path - base Path
  * @param {Hono} app - other Hono instance
  * @returns {Hono} routed Hono instance
  *
  * @example
  * ```ts
  * const app = new Hono()
  * const app2 = new Hono()
  *
  * app2.get("/user", (c) => c.text("user"))
  * app.route("/api", app2) // GET /api/user
  * ```
  */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler2;
      if (app2.errorHandler === errorHandler) handler2 = r.handler;
      else {
        handler2 = async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res;
        handler2[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler2, r.basePath);
    });
    return this;
  }
  /**
  * `.basePath()` allows base paths to be specified.
  *
  * @see {@link https://hono.dev/docs/api/routing#base-path}
  *
  * @param {string} path - base Path
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * const api = new Hono().basePath('/api')
  * ```
  */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
  * `.onError()` handles an error and returns a customized Response.
  *
  * @see {@link https://hono.dev/docs/api/hono#error-handling}
  *
  * @param {ErrorHandler} handler - request Handler for error
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * app.onError((err, c) => {
  *   console.error(`${err}`)
  *   return c.text('Custom Error Message', 500)
  * })
  * ```
  */
  onError = (handler2) => {
    this.errorHandler = handler2;
    return this;
  };
  /**
  * `.notFound()` allows you to customize a Not Found Response.
  *
  * @see {@link https://hono.dev/docs/api/hono#not-found}
  *
  * @param {NotFoundHandler} handler - request handler for not-found
  * @returns {Hono} changed Hono instance
  *
  * @example
  * ```ts
  * app.notFound((c) => {
  *   return c.text('Custom 404 Message', 404)
  * })
  * ```
  */
  notFound = (handler2) => {
    this.#notFoundHandler = handler2;
    return this;
  };
  /**
  * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
  *
  * @deprecated Use `mount()` from `hono/mount` instead. `.mount()` will be removed in v5.
  *
  * @see {@link https://hono.dev/docs/api/hono#mount}
  *
  * @param {string} path - base Path
  * @param {Function} applicationHandler - other Request Handler
  * @param {MountOptions} [options] - options of `.mount()`
  * @returns {Hono} mounted Hono instance
  * @throws {Error} If automatic request rewriting encounters duplicate path parameter names or an optional regular expression parameter.
  * @throws {HTTPException} With status 400 if automatic request rewriting cannot safely preserve the routed path.
  *
  * @example
  * ```ts
  * import { Router as IttyRouter } from 'itty-router'
  * import { Hono } from 'hono'
  * // Create itty-router application
  * const ittyRouter = IttyRouter()
  * // GET /itty-router/hello
  * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
  *
  * const app = new Hono()
  * app.mount('/itty-router', ittyRouter.handle)
  * ```
  *
  * @example
  * ```ts
  * const app = new Hono()
  * // Send the request to another application without modification.
  * app.mount('/app', anotherApp, {
  *   replaceRequest: (req) => req,
  * })
  * ```
  */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") optionHandler = options;
      else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) replaceRequest = (request) => request;
        else replaceRequest = options.replaceRequest;
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    const defaultReplaceRequest = (c) => {
      const mountedRoutePath = routePath(c);
      return createMountedRequest(c, mountedRoutePath.replace(/\/?\*$/, ""), mountedRoutePath);
    };
    const handler2 = async (c, next) => {
      const res = await applicationHandler(replaceRequest ? replaceRequest(c.req.raw) : defaultReplaceRequest(c), ...getOptions(c));
      if (res) return res;
      await next();
    };
    this.#addRoute("ALL", mergePath(path, "*"), handler2);
    return this;
  }
  #addRoute(method, path, handler2, baseRoutePath) {
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler: handler2
    };
    this.router.add(method, path, [handler2, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) return this.errorHandler(err, c);
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
  * `.fetch()` will be entry point of your app.
  *
  * @see {@link https://hono.dev/docs/api/hono#fetch}
  *
  * @param {Request} request - request Object of request
  * @param {Env} env - env Object
  * @param {ExecutionContext} executionCtx - context of execution
  * @returns {Response | Promise<Response>} response of request
  *
  */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
  * `.request()` is a useful method for testing.
  * You can pass a URL or pathname to send a GET request.
  * app will return a Response object.
  * ```ts
  * test('GET /hello is ok', async () => {
  *   const res = await app.request('/hello')
  *   expect(res.status).toBe(200)
  * })
  * ```
  * @see https://hono.dev/docs/api/hono#request
  */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    input = input.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
  };
  /**
  * `.fire()` automatically adds a global fetch event listener.
  * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
  * @deprecated
  * Use `fire` from `hono/service-worker` instead.
  * ```ts
  * import { Hono } from 'hono'
  * import { fire } from 'hono/service-worker'
  *
  * const app = new Hono()
  * // ...
  * fire(app)
  * ```
  * @see https://hono.dev/docs/api/hono#fire
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
  */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/utils.js
var createNullObject = () => /* @__PURE__ */ Object.create(null);

// node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path2) => {
    const matcher = matchers[method2] || matchers["ALL"];
    const staticMatch = matcher[2][path2];
    if (staticMatch) return staticMatch;
    const match3 = path2.match(matcher[0]);
    if (!match3) return [[], emptyParam];
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path);
}

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = "[^]*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/[^]*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = /* @__PURE__ */ new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) return b.length === 1 ? a < b ? -1 : 1 : -1;
  if (b.length === 1) return 1;
  if (a === "[^]*" || a === "(?:|/[^]*)") return b === "[^]*" ? -1 : 1;
  else if (b === "[^]*" || b === "(?:|/[^]*)") return -1;
  if (a === "[^/]+") return 1;
  else if (b === "[^/]+") return -1;
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class Node2 {
  #index;
  #varIndex;
  #children = createNullObject();
  insert(tokens, index, paramMap, context, keys) {
    let node = this;
    for (let i = 0, len = tokens.length; i < len; i++) {
      const token = tokens[i];
      const pattern = token.length === 1 ? token === "*" ? i === len - 1 ? [
        "",
        "",
        ONLY_WILDCARD_REG_EXP_STR
      ] : [
        "",
        "",
        LABEL_REG_EXP_STR
      ] : null : token === "/*" ? [
        "",
        "",
        TAIL_WILDCARD_REG_EXP_STR
      ] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
      let nextNode;
      if (pattern) {
        const name = pattern[1];
        let regexpStr = pattern[2] || "[^/]+";
        if (name && pattern[2]) {
          if (new RegExp(regexpStr).test("")) throw PATH_ERROR;
          regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
          if (/\((?!\?:)/.test(regexpStr)) throw PATH_ERROR;
          if (regexpStr.length === 1 && regExpMetaChars.has(regexpStr)) throw PATH_ERROR;
        }
        keys.push(regexpStr);
        nextNode = node.#children[regexpStr];
        if (!nextNode) {
          if (regexpStr !== "[^]*" && regexpStr !== "(?:|/[^]*)") {
            for (const k in node.#children) if ((regexpStr.length > 1 || k.length > 1) && k !== "[^]*" && k !== "(?:|/[^]*)") throw PATH_ERROR;
          }
          nextNode = node.#children[regexpStr] = new Node2();
        }
        if (name !== "") {
          nextNode.#varIndex ??= context.varIndex++;
          paramMap.push([name, nextNode.#varIndex]);
        }
      } else {
        keys.push(token);
        nextNode = node.#children[token];
        if (!nextNode) {
          for (const k in node.#children) if (k.length > 1 && k !== "[^]*" && k !== "(?:|/[^]*)") throw PATH_ERROR;
          nextNode = node.#children[token] = new Node2();
        }
      }
      node = nextNode;
    }
    if (node.#index !== void 0) throw PATH_ERROR;
    node.#index = index;
  }
  buildRegExpStr() {
    const strList = Object.keys(this.#children).sort(compareKey).map((k) => {
      const c = this.#children[k];
      const childStr = c.buildRegExpStr();
      return childStr === "" ? "" : (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + childStr;
    }).filter(Boolean);
    if (typeof this.#index === "number" && this.#index !== -1) strList.unshift(`#${this.#index}`);
    if (strList.length === 0) return "";
    if (strList.length === 1) return strList[0];
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  #index = 0;
  paths = createNullObject();
  insert(path, isStatic) {
    const keys = [];
    if (isStatic) {
      this.#root.insert(path.split(""), -1, [], this.#context, keys);
      this.paths[path] = [
        -1,
        [],
        keys
      ];
      return;
    }
    const paramAssoc = [];
    const groups = [];
    let markedPath = path;
    for (let i = 0; ; ) {
      let replaced = false;
      markedPath = markedPath.replace(/\{(?:\{[\d,]+\}|[^}])+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) break;
    }
    const tokens = markedPath.match(/(?::[^\/]+)|(?:\/\*$)|./gs) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) if (tokens[j].indexOf(mark) !== -1) {
        tokens[j] = tokens[j].replace(mark, groups[i][1]);
        break;
      }
    }
    this.#root.insert(tokens, this.#index, paramAssoc, this.#context, keys);
    this.paths[path] = [
      this.#index++,
      paramAssoc,
      keys
    ];
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") return [
      /^$/,
      [],
      []
    ];
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [
      new RegExp(`^${regexp}`),
      indexReplacementMap,
      paramReplacementMap
    ];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
function endsWithWildcard(keys) {
  const tail = keys[keys.length - 1];
  return tail === "[^]*" || tail === "(?:|/[^]*)";
}
function covers(wildcard, target) {
  const last = wildcard.length - 1;
  for (let i = 0; i < last; i++) if (wildcard[i] !== target[i]) return false;
  return wildcard[last] === "[^]*" || target.length === last || target[last] === "/";
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #handlers;
  #tries;
  constructor() {
    this.#handlers = { ["ALL"]: [] };
    this.#tries = { ["ALL"]: new Trie() };
  }
  #insertPath(method, path) {
    try {
      this.#tries[method].insert(path, !/\*|\/:/.test(path));
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
  }
  add(method, path, handler2) {
    const handlers = this.#handlers;
    if (!handlers) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    const tries = this.#tries;
    if (!handlers[method]) {
      tries[method] = new Trie();
      handlers[method] = [...handlers["ALL"]];
      for (const p in tries["ALL"].paths) this.#insertPath(method, p);
    }
    if (path === "/*") path = "*";
    const methods = method === "ALL" ? Object.keys(handlers) : [method];
    const paths = checkOptionalParameter(path) || [path];
    for (const path2 of paths) for (const m of methods) {
      if (!tries[m].paths[path2]) this.#insertPath(m, path2);
      handlers[m].push([handler2, path2]);
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = createNullObject();
    for (const method of Object.keys(this.#handlers)) matchers[method] = this.#buildMatcher(method);
    this.#handlers = this.#tries = void 0;
    return matchers;
  }
  #buildMatcher(method) {
    const handlers = this.#handlers[method];
    const trie = this.#tries[method];
    const staticMap = createNullObject();
    const handlerData = [];
    const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
    const own = createNullObject();
    const entries = handlers.map(([h, p], i) => {
      (own[p] ??= []).push(i);
      return [h, trie.paths[p][1].reduceRight((map, [key, varIndex]) => {
        map[key] = paramReplacementMap[varIndex];
        return map;
      }, createNullObject())];
    });
    const wildcards = Object.keys(own).filter((p) => endsWithWildcard(trie.paths[p][2]));
    for (const path in trie.paths) {
      const [index, , keys] = trie.paths[path];
      const indexes = [...own[path]];
      for (const p of wildcards) if (p !== path && covers(trie.paths[p][2], keys)) indexes.push(...own[p]);
      const data = indexes.sort((a, b) => a - b).map((i) => entries[i]);
      if (index === -1) {
        const last = Math.max(-1, ...data.flatMap(([, map]) => Object.values(map)));
        staticMap[path] = [data, last === -1 ? emptyParam : path.match(regexp).slice(0, last + 1)];
      } else handlerData[index] = data;
    }
    return [
      regexp,
      indexReplacementMap.map((i) => handlerData[i]),
      staticMap
    ];
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler2) {
    if (!this.#routes) throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    this.#routes.push([
      method,
      path,
      handler2
    ]);
  }
  match(method, path) {
    if (!this.#routes) throw new Error("Fatal error");
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) router.add(...routes[i2]);
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) continue;
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) throw new Error("Fatal error");
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) throw new Error("No active router has been determined yet.");
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = createNullObject();
var order = 0;
var Node3 = class Node4 {
  #methods = [];
  #children = createNullObject();
  #patterns = [];
  #pattern;
  #params = emptyParams;
  insert(method, path, handler2) {
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = /* @__PURE__ */ new Set();
    let i = 0;
    for (const p of parts) {
      const nextP = parts[++i];
      const pattern = getPattern(p, nextP) || (nextP === void 0 && p && p.indexOf("*") === p.length - 1 ? p : null);
      const isParam = Array.isArray(pattern);
      const key = isParam ? pattern[0] : pattern || p;
      const child = curNode.#children[key] ||= new Node4();
      if (pattern && !child.#pattern) {
        child.#pattern = pattern;
        curNode.#patterns.push(child);
      }
      curNode = child;
      if (isParam) possibleKeys.add(pattern[1]);
    }
    const methodMap = createNullObject();
    methodMap[method] = {
      handler: handler2,
      possibleKeys: [...possibleKeys],
      score: ++order
    };
    curNode.#methods.push(methodMap);
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m["ALL"];
      if (handlerSet) {
        handlerSet.params = createNullObject();
        handlerSets.push(handlerSet);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          handlerSet.params[key] = params?.[key] && !i2 ? params[key] : nodeParams[key] ?? params?.[key];
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    let curNodes = [this];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else tempNodes.push(nextNode);
        }
        for (const child of node.#patterns) {
          const pattern = child.#pattern;
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (typeof pattern === "string") {
            if (pattern === "*" || part.startsWith(pattern.slice(0, -1))) {
              this.#pushHandlerSets(handlerSets, child, method, node.#params);
              if (pattern === "*") {
                child.#params = params;
                tempNodes.push(child);
              }
            }
            continue;
          }
          const [, name, matcher] = pattern;
          if (!part && matcher === true) continue;
          if (matcher !== true) {
            if (!partOffsets) {
              partOffsets = [];
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.slice(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              if (!Object.hasOwn(params, name)) params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (m[0].length === restPathString.length && child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, node.#params, params);
              for (const _ in child.#children) {
                child.#params = params;
                const componentCount = m[0].match(/\//g)?.length ?? 0;
                (curNodesQueue[componentCount] ||= []).push(child);
                break;
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            if (!Object.hasOwn(params, name)) params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) this.#pushHandlerSets(handlerSets, child.#children["*"], method, params, node.#params);
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets[1]) handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [handlerSets.map(({ handler: handler2, params }) => [handler2, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node = new Node3();
  add(method, path, handler2) {
    for (const result of checkOptionalParameter(path) || [path]) this.#node.insert(method, result, handler2);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono3 = class extends Hono {
  /**
  * Creates an instance of the Hono class.
  *
  * @param options - Optional configuration options for the Hono instance.
  */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({ routers: [new RegExpRouter(), new TrieRouter()] });
  }
};

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const opts = {
    origin: "*",
    allowMethods: [
      "GET",
      "HEAD",
      "PUT",
      "POST",
      "DELETE",
      "PATCH",
      "QUERY"
    ],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const exposeHeadersStr = opts.exposeHeaders?.length ? opts.exposeHeaders.join(",") : void 0;
  const allowHeadersStr = opts.allowHeaders?.length ? opts.allowHeaders.join(",") : void 0;
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") return () => optsOrigin;
      else return (origin) => optsOrigin === origin ? origin : null;
    } else if (typeof optsOrigin === "function") return optsOrigin;
    else return (origin) => optsOrigin.includes(origin) ? origin : null;
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") return async (origin, c) => (await optsAllowMethods(origin, c)).join(",");
    else if (Array.isArray(optsAllowMethods)) {
      const methodsStr = optsAllowMethods.join(",");
      return () => methodsStr;
    } else return () => "";
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) set("Access-Control-Allow-Origin", allowOrigin);
    if (opts.credentials) set("Access-Control-Allow-Credentials", "true");
    if (exposeHeadersStr) set("Access-Control-Expose-Headers", exposeHeadersStr);
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") c.res.headers.append("Vary", "Origin");
      if (opts.maxAge != null) set("Access-Control-Max-Age", opts.maxAge.toString());
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods) set("Access-Control-Allow-Methods", allowMethods);
      let headersStr = allowHeadersStr;
      if (!headersStr) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) headersStr = requestHeaders.split(",").map((h) => h.trim()).join(",");
      }
      if (headersStr) {
        set("Access-Control-Allow-Headers", headersStr);
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") c.header("Vary", "Origin", { append: true });
  };
};

// apps/worker/src/app.ts
init_src();
init_errors2();

// apps/worker/src/core/db.ts
var Db = class {
  constructor(d1) {
    this.d1 = d1;
  }
  metrics = { reads: 0, writes: 0, rowsRead: 0, rowsWritten: 0, queries: 0 };
  bind(statement, s) {
    return s.bindings.length ? statement.bind(...s.bindings) : statement;
  }
  count(result, isWrite) {
    this.metrics.queries++;
    const meta = result?.meta ?? {};
    this.metrics.rowsRead += meta.rows_read ?? 0;
    this.metrics.rowsWritten += meta.rows_written ?? 0;
    if (isWrite) this.metrics.writes++;
    else this.metrics.reads++;
  }
  async all(s) {
    const r = await this.bind(this.d1.prepare(s.sql), s).all();
    this.count(r, false);
    return r.results ?? [];
  }
  async first(s) {
    const rows = await this.all(s);
    return rows[0] ?? null;
  }
  async run(s) {
    const r = await this.bind(this.d1.prepare(s.sql), s).run();
    this.count(r, true);
    return r;
  }
  /** single implicit SQLite transaction — used for all financial mutations */
  async batch(stmts) {
    const r = await this.d1.batch(stmts.map((s) => this.bind(this.d1.prepare(s.sql), s)));
    for (const item of r) this.count(item, true);
    return r;
  }
  async firstInBatch(stmts) {
    const res = await this.batch(stmts);
    const last = res[res.length - 1];
    return last?.results?.[0] ?? null;
  }
  async exec(sqlText) {
    await this.d1.exec(sqlText);
  }
};

// apps/worker/src/app.ts
init_sql();
init_telegram_auth();

// apps/worker/src/core/settings.ts
init_src();
init_sql();
init_format();
init_errors2();
var ECONOMY_SCOPED_KEYS = /* @__PURE__ */ new Set([GAME_SETTING_KEYS.economy, "starter_economy"]);
function merge(defaults, stored) {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return { ...defaults };
  const out = { ...defaults };
  for (const [k, v] of Object.entries(stored)) {
    if (k in out && v !== void 0) out[k] = v;
  }
  return out;
}
var cache = null;
var CACHE_TTL = 10;
function invalidateSettingsCache() {
  cache = null;
}
async function loadSettings(db, opts = {}) {
  const now = nowSeconds();
  if (!opts.force && cache && now - cache.at < CACHE_TTL) return cache.bundle;
  const rows = await db.all(
    sql`SELECT key, value, 'game' AS src FROM game_settings
        UNION ALL
        SELECT key, value, 'economy' AS src FROM economy_settings`
  );
  const map = {};
  for (const r of rows) {
    try {
      map[r.key] = JSON.parse(r.value);
    } catch {
      map[r.key] = r.value;
    }
  }
  const bundle = {
    battle: merge(DEFAULT_BATTLE_PARAMS, map[GAME_SETTING_KEYS.battle]),
    economy: merge(DEFAULT_ECONOMY_RULES, map.economy_rules),
    profile: merge(DEFAULT_PROFILE_RULES, map[GAME_SETTING_KEYS.profile]),
    diplomacy: merge(DEFAULT_DIPLOMACY_RULES, map[GAME_SETTING_KEYS.diplomacy]),
    features: merge(FEATURE_FLAGS, map[GAME_SETTING_KEYS.features]),
    quota: merge(DEFAULT_QUOTA_GUARD, map[GAME_SETTING_KEYS.quota]),
    branding: merge(DEFAULT_BRANDING, map[GAME_SETTING_KEYS.branding]),
    rankingWeights: merge(DEFAULT_RANKING_WEIGHTS, map[GAME_SETTING_KEYS.rankingWeights]),
    loadedAt: now
  };
  cache = { bundle, at: now };
  return bundle;
}
var SETTABLE_KEYS = {
  [GAME_SETTING_KEYS.battle]: "battle_params",
  [GAME_SETTING_KEYS.economy]: "economy_rules",
  [GAME_SETTING_KEYS.profile]: "profile_rules",
  [GAME_SETTING_KEYS.diplomacy]: "diplomacy_rules",
  [GAME_SETTING_KEYS.features]: "feature_flags",
  [GAME_SETTING_KEYS.rankingWeights]: "ranking_weights",
  [GAME_SETTING_KEYS.branding]: "branding",
  [GAME_SETTING_KEYS.quota]: "quota_guard"
};
function tableForKey(key) {
  return ECONOMY_SCOPED_KEYS.has(key) ? "economy_settings" : "game_settings";
}
async function setSettingsBulk(db, patch, actorUserId) {
  const keys = Object.keys(patch);
  if (keys.length === 0) return [];
  const at = nowSeconds();
  const stmts = keys.map((key) => {
    const table = tableForKey(key);
    return {
      sql: `INSERT INTO ${table} (key, value, value_type, updated_by, updated_at)
            VALUES (?, ?, 'json', ?, ?)
            ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      bindings: [key, JSON.stringify(patch[key]), actorUserId, at]
    };
  });
  await db.batch(stmts);
  invalidateSettingsCache();
  return keys;
}

// apps/worker/src/services/quotaService.ts
init_sql();
init_format();
var FREE_PLAN_LIMITS = {
  workerRequestsPerDay: 1e5,
  workerCpuMsPerRequest: 10,
  workerCpuMsPerCron: 3e4,
  d1RowsReadPerDay: 5e6,
  d1RowsWrittenPerDay: 1e5,
  d1DatabaseSizeMB: 5,
  d1RequestsPerDay: 5e5,
  cronTriggersMax: 5
};
var counters = {};
var pendingNationStats = null;
function record(delta) {
  counters.apiRequests = (counters.apiRequests ?? 0) + (delta.apiRequests ?? 0);
  counters.botUpdates = (counters.botUpdates ?? 0) + (delta.botUpdates ?? 0);
  counters.cronRuns = (counters.cronRuns ?? 0) + (delta.cronRuns ?? 0);
  counters.errors = (counters.errors ?? 0) + (delta.errors ?? 0);
  counters.dbReads = (counters.dbReads ?? 0) + (delta.dbReads ?? 0);
  counters.dbWrites = (counters.dbWrites ?? 0) + (delta.dbWrites ?? 0);
  counters.rowsRead = (counters.rowsRead ?? 0) + (delta.rowsRead ?? 0);
  counters.rowsWritten = (counters.rowsWritten ?? 0) + (delta.rowsWritten ?? 0);
}
function takeCounters() {
  const copy = { ...counters };
  for (const k of Object.keys(counters)) delete counters[k];
  return copy;
}
async function flushQuota(db) {
  const delta = takeCounters();
  const hasDelta = Object.values(delta).some((v) => (v ?? 0) > 0);
  if (!hasDelta && !pendingNationStats) return;
  const day = dayKey(nowSeconds());
  await db.run(
    sql`INSERT INTO quota_stats (day, api_requests, bot_updates, cron_runs, errors, db_reads_est, db_writes_est,
                                 nations_count, users_count, transactions_count, updated_at)
         VALUES (${day}, ${delta.apiRequests ?? 0}, ${delta.botUpdates ?? 0}, ${delta.cronRuns ?? 0}, ${delta.errors ?? 0},
                 ${delta.rowsRead ?? 0}, ${delta.rowsWritten ?? 0},
                 ${pendingNationStats?.nations ?? 0}, ${pendingNationStats?.users ?? 0}, ${pendingNationStats?.transactions ?? 0}, ${nowSeconds()})
         ON CONFLICT (day) DO UPDATE SET
           api_requests = quota_stats.api_requests + excluded.api_requests,
           bot_updates = quota_stats.bot_updates + excluded.bot_updates,
           cron_runs = quota_stats.cron_runs + excluded.cron_runs,
           errors = quota_stats.errors + excluded.errors,
           db_reads_est = quota_stats.db_reads_est + excluded.db_reads_est,
           db_writes_est = quota_stats.db_writes_est + excluded.db_writes_est,
           nations_count = CASE WHEN excluded.nations_count > 0 THEN excluded.nations_count ELSE quota_stats.nations_count END,
           users_count = CASE WHEN excluded.users_count > 0 THEN excluded.users_count ELSE quota_stats.users_count END,
           transactions_count = CASE WHEN excluded.transactions_count > 0 THEN excluded.transactions_count ELSE quota_stats.transactions_count END,
           updated_at = excluded.updated_at`
  );
  pendingNationStats = null;
}
async function snapshotQuota(db, settings) {
  const day = dayKey(nowSeconds());
  const [today, recent, counts] = await Promise.all([
    db.first(sql`SELECT * FROM quota_stats WHERE day = ${day}`),
    db.all(sql`SELECT * FROM quota_stats ORDER BY day DESC LIMIT 14`),
    db.first(
      sql`SELECT (SELECT COUNT(*) FROM nations) AS nations, (SELECT COUNT(*) FROM users) AS users,
                 (SELECT COUNT(*) FROM transactions) AS transactions`
    )
  ]);
  pendingNationStats = {
    nations: Number(counts?.nations ?? 0),
    users: Number(counts?.users ?? 0),
    transactions: Number(counts?.transactions ?? 0)
  };
  const apiRequests = Number(today?.api_requests ?? 0);
  const rowsRead = Number(today?.db_reads_est ?? 0);
  const rowsWritten = Number(today?.db_writes_est ?? 0);
  const pct = (value, limit) => Math.round(value / Math.max(1, limit) * 1e3) / 10;
  const warnAt = settings.quota.warnAtPercent;
  const series = ["api_requests", "bot_updates", "cron_runs", "errors", "db_reads_est"];
  return {
    day,
    measured: {
      apiRequests,
      botUpdates: Number(today?.bot_updates ?? 0),
      cronRuns: Number(today?.cron_runs ?? 0),
      errors: Number(today?.errors ?? 0),
      // D1 reports rows_read / rows_written per statement in `meta` — these are
      // measured values, not estimates.
      d1RowsRead: rowsRead,
      d1RowsWritten: rowsWritten,
      nations: Number(counts?.nations ?? 0),
      users: Number(counts?.users ?? 0),
      transactions: Number(counts?.transactions ?? 0)
    },
    /** NOT available from inside the Worker: the panel must show "unknown". */
    notMeasured: {
      cpuMs: null,
      databaseBytes: null,
      memory: null,
      note: "\u0645\u0635\u0631\u0641 CPU \u0648 \u062D\u062C\u0645 \u062F\u0642\u06CC\u0642 \u062F\u06CC\u062A\u0627\u0628\u06CC\u0633 \u0627\u0632 \u062F\u0627\u062E\u0644 Worker \u0642\u0627\u0628\u0644 \u0627\u0646\u062F\u0627\u0632\u0647\u200C\u06AF\u06CC\u0631\u06CC \u0646\u06CC\u0633\u062A\u061B \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0627\u0639\u062F\u0627\u062F \u0627\u0632 \u062F\u0627\u0634\u0628\u0648\u0631\u062F Cloudflare \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F."
    },
    limits: FREE_PLAN_LIMITS,
    usagePercent: {
      requests: pct(apiRequests, FREE_PLAN_LIMITS.workerRequestsPerDay),
      d1RowsRead: pct(rowsRead, FREE_PLAN_LIMITS.d1RowsReadPerDay),
      d1RowsWritten: pct(rowsWritten, FREE_PLAN_LIMITS.d1RowsWrittenPerDay)
    },
    warnings: [
      pct(apiRequests, FREE_PLAN_LIMITS.workerRequestsPerDay) >= warnAt ? "\u062A\u0639\u062F\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u0627\u0645\u0631\u0648\u0632 \u0628\u0647 \u0633\u0642\u0641 \u067E\u0644\u0646 \u0631\u0627\u06CC\u06AF\u0627\u0646 \u0646\u0632\u062F\u06CC\u06A9 \u0634\u062F\u0647 \u0627\u0633\u062A." : null,
      pct(rowsRead, FREE_PLAN_LIMITS.d1RowsReadPerDay) >= warnAt ? "\u0645\u0635\u0631\u0641 \u0631\u0634\u062A\u0647\u200C\u0647\u0627\u06CC \u062E\u0648\u0627\u0646\u062F\u0647\u200C\u0634\u062F\u0647 D1 \u0646\u0632\u062F\u06CC\u06A9 \u0633\u0642\u0641 \u0627\u0633\u062A\u061B \u06A9\u0634\u200C\u06A9\u0631\u062F\u0646 \u0622\u0645\u0627\u0631 \u0648 \u0644\u06CC\u0633\u062A\u200C\u0647\u0627 \u0628\u0647\u06CC\u0646\u0647 \u0634\u0648\u062F." : null,
      pct(rowsWritten, FREE_PLAN_LIMITS.d1RowsWrittenPerDay) >= warnAt ? "\u0646\u0648\u0634\u062A\u0647\u200C\u0647\u0627\u06CC D1 \u0627\u0645\u0631\u0648\u0632 \u0646\u0632\u062F\u06CC\u06A9 \u0633\u0642\u0641 \u0631\u0648\u0632\u0627\u0646\u0647 \u0627\u0633\u062A." : null
    ].filter(Boolean),
    history: recent.map((r) => ({
      day: String(r.day),
      ...Object.fromEntries(series.map((k) => [k, Number(r[k] ?? 0)]))
    })).reverse()
  };
}
async function isCronPaused(db, settings) {
  if (settings.quota.d1RowsDailySoftLimit <= 0) return false;
  const row = await db.first(sql`SELECT db_reads_est FROM quota_stats WHERE day = ${dayKey(nowSeconds())}`);
  return Number(row?.db_reads_est ?? 0) > settings.quota.d1RowsDailySoftLimit;
}
async function markJob(db, jobKey, patch) {
  const at = nowSeconds();
  const cursor = patch.cursor ?? Number((await db.first(sql`SELECT cursor FROM job_checkpoints WHERE job_key = ${jobKey}`))?.cursor ?? 0);
  const failed = patch.error !== void 0 && patch.error !== null;
  const ok = !failed && patch.success !== false;
  await db.run({
    sql: `INSERT INTO job_checkpoints (job_key, cursor, last_run_at, last_success_at, rows_processed, last_error, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT (job_key) DO UPDATE SET
             cursor = excluded.cursor,
             last_run_at = excluded.last_run_at,
             last_success_at = COALESCE(excluded.last_success_at, job_checkpoints.last_success_at),
             rows_processed = job_checkpoints.rows_processed + excluded.rows_processed,
             last_error = CASE WHEN excluded.last_success_at IS NULL THEN COALESCE(excluded.last_error, job_checkpoints.last_error) ELSE NULL END,
             updated_at = excluded.updated_at`,
    bindings: [jobKey, cursor, at, ok ? at : null, patch.rowsProcessed ?? 0, failed ? String(patch.error).slice(0, 400) : null, at]
  });
}

// node_modules/hono/dist/helper/factory/index.js
var createMiddleware = (middleware) => middleware;

// apps/worker/src/api/middleware.ts
init_errors2();
init_format();
init_telegram();
init_ids();
init_authService();
init_queries();
var createContext = createMiddleware(async (c, next) => {
  configureTelegramApiBase(c.env.TELEGRAM_API_BASE);
  const db = new Db(c.env.DB);
  c.set("db", db);
  const requestId = randomToken(8);
  const started = Date.now();
  try {
    await next();
  } finally {
    const metrics = db.metrics;
    record({
      apiRequests: 1,
      dbReads: metrics.reads,
      dbWrites: metrics.writes,
      rowsRead: metrics.rowsRead,
      rowsWritten: metrics.rowsWritten,
      errors: c.res.status >= 500 ? 1 : 0
    });
    await flushQuota(db).catch(() => void 0);
    if (c.env.APP_ENV === "development") {
      console.log(JSON.stringify({ requestId, path: new URL(c.req.url).pathname, status: c.res.status, ms: Date.now() - started, queries: metrics.queries }));
    }
  }
});
var errorHandler2 = createMiddleware(async (c, next) => {
  try {
    await next();
  } catch (err) {
    const api = toApiError(err);
    if (api.status >= 500) console.error(`[error:${api.code}]`, api.message);
    return c.json(
      {
        error: {
          code: api.code,
          message: api.message,
          ...api.details === void 0 ? {} : { details: api.details },
          requestId: nowSeconds().toString(36)
        }
      },
      api.status
    );
  }
});
async function settingsFor(c) {
  const cached = c.get("settings");
  if (cached) return cached;
  const settings = await loadSettings(c.get("db"));
  c.set("settings", settings);
  return settings;
}
function bearer(c) {
  const header = c.req.header("authorization") ?? c.req.header("Authorization");
  if (header?.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  const q = c.req.query("token");
  return q && q.length >= 16 ? q : null;
}
var requireUser = createMiddleware(async (c, next) => {
  const token = bearer(c);
  if (!token) throw ApiError.unauthorized();
  const user = await loadSessionUser(c.get("db"), token);
  if (!user) throw ApiError.unauthorized("\u0646\u0634\u0633\u062A \u0645\u0646\u0642\u0636\u06CC \u06CC\u0627 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A\u061B Mini App \u0631\u0627 \u062F\u0648\u0628\u0627\u0631\u0647 \u0628\u0627\u0632 \u06A9\u0646\u06CC\u062F.");
  if (user.status !== "active") throw ApiError.forbidden(user.status === "blocked" ? "\u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u0645\u0633\u062F\u0648\u062F \u0634\u062F\u0647 \u0627\u0633\u062A." : "\u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A.");
  c.set("user", user);
  await next();
});
var requireNation = createMiddleware(async (c, next) => {
  const user = c.get("user");
  const nation = await loadNationOwnedBy(c.get("db"), user.userId, user.activeNationId);
  if (!nation) throw new ApiError("not_found", "\u0634\u0645\u0627 \u0647\u0646\u0648\u0632 \u06A9\u0634\u0648\u0631\u06CC \u0646\u0633\u0627\u062E\u062A\u0647\u200C\u0627\u06CC\u062F. \u0627\u0632 \u0631\u0628\u0627\u062A \u062A\u0644\u06AF\u0631\u0627\u0645 /start \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F.", 404);
  if (nation.status === "banned") throw ApiError.forbidden("\u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0645\u0633\u062F\u0648\u062F \u0634\u062F\u0647 \u0627\u0633\u062A. \u0628\u0627 \u0645\u062F\u06CC\u0631 \u0628\u0627\u0632\u06CC \u062A\u0645\u0627\u0633 \u0628\u06AF\u06CC\u0631\u06CC\u062F.");
  if (nation.status === "frozen") throw ApiError.forbidden("\u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0628\u0647 \u0635\u0648\u0631\u062A \u0645\u0648\u0642\u062A \u0645\u0646\u062C\u0645\u062F \u0634\u062F\u0647 \u0627\u0633\u062A.");
  c.set("nationId", nation.id);
  c.set("nation", nation);
  await next();
});
function requireAdmin(section, write2 = false) {
  return createMiddleware(async (c, next) => {
    const user = c.get("user");
    if (user.role !== "admin" && user.role !== "super_admin") {
      throw ApiError.forbidden("\u0627\u06CC\u0646 \u0628\u062E\u0634 \u0641\u0642\u0637 \u0628\u0631\u0627\u06CC \u0645\u062F\u06CC\u0631\u0627\u0646 \u0628\u0627\u0632\u06CC \u0627\u0633\u062A.");
    }
    if (section && user.role !== "super_admin") {
      const grant = user.permissions[section];
      if (!grant?.read) throw ApiError.forbidden(`\u0645\u062C\u0648\u0632 \u0645\u0634\u0627\u0647\u062F\u0647 \u0628\u062E\u0634 \xAB${section}\xBB \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F.`);
      if (write2 && !grant.write) throw ApiError.forbidden(`\u0645\u062C\u0648\u0632 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0628\u062E\u0634 \xAB${section}\xBB \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F.`);
    }
    await next();
  });
}
function actorOf(user) {
  return { userId: user.userId, telegramId: user.telegramId };
}
function adminActorOf(user) {
  return { userId: user.userId, telegramId: user.telegramId, role: user.role };
}
async function parseJson(c) {
  try {
    return await c.req.json();
  } catch {
    throw ApiError.validation("\u0628\u062F\u0646\u0647 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0628\u0627\u06CC\u062F JSON \u0645\u0639\u062A\u0628\u0631 \u0628\u0627\u0634\u062F.");
  }
}

// apps/worker/node_modules/zod/v3/external.js
var external_exports2 = {};
__export(external_exports2, {
  BRAND: () => BRAND2,
  DIRTY: () => DIRTY2,
  EMPTY_PATH: () => EMPTY_PATH2,
  INVALID: () => INVALID2,
  NEVER: () => NEVER2,
  OK: () => OK2,
  ParseStatus: () => ParseStatus2,
  Schema: () => ZodType2,
  ZodAny: () => ZodAny2,
  ZodArray: () => ZodArray2,
  ZodBigInt: () => ZodBigInt2,
  ZodBoolean: () => ZodBoolean2,
  ZodBranded: () => ZodBranded2,
  ZodCatch: () => ZodCatch2,
  ZodDate: () => ZodDate2,
  ZodDefault: () => ZodDefault2,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion2,
  ZodEffects: () => ZodEffects2,
  ZodEnum: () => ZodEnum2,
  ZodError: () => ZodError2,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind2,
  ZodFunction: () => ZodFunction2,
  ZodIntersection: () => ZodIntersection2,
  ZodIssueCode: () => ZodIssueCode2,
  ZodLazy: () => ZodLazy2,
  ZodLiteral: () => ZodLiteral2,
  ZodMap: () => ZodMap2,
  ZodNaN: () => ZodNaN2,
  ZodNativeEnum: () => ZodNativeEnum2,
  ZodNever: () => ZodNever2,
  ZodNull: () => ZodNull2,
  ZodNullable: () => ZodNullable2,
  ZodNumber: () => ZodNumber2,
  ZodObject: () => ZodObject2,
  ZodOptional: () => ZodOptional2,
  ZodParsedType: () => ZodParsedType2,
  ZodPipeline: () => ZodPipeline2,
  ZodPromise: () => ZodPromise2,
  ZodReadonly: () => ZodReadonly2,
  ZodRecord: () => ZodRecord2,
  ZodSchema: () => ZodType2,
  ZodSet: () => ZodSet2,
  ZodString: () => ZodString2,
  ZodSymbol: () => ZodSymbol2,
  ZodTransformer: () => ZodEffects2,
  ZodTuple: () => ZodTuple2,
  ZodType: () => ZodType2,
  ZodUndefined: () => ZodUndefined2,
  ZodUnion: () => ZodUnion2,
  ZodUnknown: () => ZodUnknown2,
  ZodVoid: () => ZodVoid2,
  addIssueToContext: () => addIssueToContext2,
  any: () => anyType2,
  array: () => arrayType2,
  bigint: () => bigIntType2,
  boolean: () => booleanType2,
  coerce: () => coerce2,
  custom: () => custom2,
  date: () => dateType2,
  datetimeRegex: () => datetimeRegex2,
  defaultErrorMap: () => en_default2,
  discriminatedUnion: () => discriminatedUnionType2,
  effect: () => effectsType2,
  enum: () => enumType2,
  function: () => functionType2,
  getErrorMap: () => getErrorMap2,
  getParsedType: () => getParsedType2,
  instanceof: () => instanceOfType2,
  intersection: () => intersectionType2,
  isAborted: () => isAborted2,
  isAsync: () => isAsync2,
  isDirty: () => isDirty2,
  isValid: () => isValid2,
  late: () => late2,
  lazy: () => lazyType2,
  literal: () => literalType2,
  makeIssue: () => makeIssue2,
  map: () => mapType2,
  nan: () => nanType2,
  nativeEnum: () => nativeEnumType2,
  never: () => neverType2,
  null: () => nullType2,
  nullable: () => nullableType2,
  number: () => numberType2,
  object: () => objectType2,
  objectUtil: () => objectUtil2,
  oboolean: () => oboolean2,
  onumber: () => onumber2,
  optional: () => optionalType2,
  ostring: () => ostring2,
  pipeline: () => pipelineType2,
  preprocess: () => preprocessType2,
  promise: () => promiseType2,
  quotelessJson: () => quotelessJson2,
  record: () => recordType2,
  set: () => setType2,
  setErrorMap: () => setErrorMap2,
  strictObject: () => strictObjectType2,
  string: () => stringType2,
  symbol: () => symbolType2,
  transformer: () => effectsType2,
  tuple: () => tupleType2,
  undefined: () => undefinedType2,
  union: () => unionType2,
  unknown: () => unknownType2,
  util: () => util2,
  void: () => voidType2
});

// apps/worker/node_modules/zod/v3/helpers/util.js
var util2;
(function(util3) {
  util3.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util3.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util3.assertNever = assertNever;
  util3.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util3.getValidEnumValues = (obj) => {
    const validKeys = util3.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util3.objectValues(filtered);
  };
  util3.objectValues = (obj) => {
    return util3.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util3.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util3.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util3.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util3.joinValues = joinValues;
  util3.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util2 || (util2 = {}));
var objectUtil2;
(function(objectUtil3) {
  objectUtil3.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil2 || (objectUtil2 = {}));
var ZodParsedType2 = util2.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType2 = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType2.undefined;
    case "string":
      return ZodParsedType2.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType2.nan : ZodParsedType2.number;
    case "boolean":
      return ZodParsedType2.boolean;
    case "function":
      return ZodParsedType2.function;
    case "bigint":
      return ZodParsedType2.bigint;
    case "symbol":
      return ZodParsedType2.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType2.array;
      }
      if (data === null) {
        return ZodParsedType2.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType2.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType2.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType2.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType2.date;
      }
      return ZodParsedType2.object;
    default:
      return ZodParsedType2.unknown;
  }
};

// apps/worker/node_modules/zod/v3/ZodError.js
var ZodIssueCode2 = util2.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson2 = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError2 = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util2.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError2.create = (issues) => {
  const error = new ZodError2(issues);
  return error;
};

// apps/worker/node_modules/zod/v3/locales/en.js
var errorMap2 = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode2.invalid_type:
      if (issue.received === ZodParsedType2.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode2.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util2.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode2.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util2.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode2.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode2.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util2.joinValues(issue.options)}`;
      break;
    case ZodIssueCode2.invalid_enum_value:
      message = `Invalid enum value. Expected ${util2.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode2.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode2.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode2.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode2.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util2.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode2.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode2.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode2.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode2.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode2.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode2.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util2.assertNever(issue);
  }
  return { message };
};
var en_default2 = errorMap2;

// apps/worker/node_modules/zod/v3/errors.js
var overrideErrorMap2 = en_default2;
function setErrorMap2(map) {
  overrideErrorMap2 = map;
}
function getErrorMap2() {
  return overrideErrorMap2;
}

// apps/worker/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue2 = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH2 = [];
function addIssueToContext2(ctx, issueData) {
  const overrideMap = getErrorMap2();
  const issue = makeIssue2({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default2 ? void 0 : en_default2
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus2 = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID2;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID2;
      if (value.status === "aborted")
        return INVALID2;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID2 = Object.freeze({
  status: "aborted"
});
var DIRTY2 = (value) => ({ status: "dirty", value });
var OK2 = (value) => ({ status: "valid", value });
var isAborted2 = (x) => x.status === "aborted";
var isDirty2 = (x) => x.status === "dirty";
var isValid2 = (x) => x.status === "valid";
var isAsync2 = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// apps/worker/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil2;
(function(errorUtil3) {
  errorUtil3.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil3.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil2 || (errorUtil2 = {}));

// apps/worker/node_modules/zod/v3/types.js
var ParseInputLazyPath2 = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult2 = (ctx, result) => {
  if (isValid2(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError2(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams2(params) {
  if (!params)
    return {};
  const { errorMap: errorMap3, invalid_type_error, required_error, description } = params;
  if (errorMap3 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap3)
    return { errorMap: errorMap3, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType2 = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType2(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType2(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus2(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType2(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync2(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType2(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult2(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType2(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid2(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid2(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType2(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync2(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult2(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode2.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects2({
      schema: this,
      typeName: ZodFirstPartyTypeKind2.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional2.create(this, this._def);
  }
  nullable() {
    return ZodNullable2.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray2.create(this);
  }
  promise() {
    return ZodPromise2.create(this, this._def);
  }
  or(option) {
    return ZodUnion2.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection2.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects2({
      ...processCreateParams2(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind2.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault2({
      ...processCreateParams2(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind2.ZodDefault
    });
  }
  brand() {
    return new ZodBranded2({
      typeName: ZodFirstPartyTypeKind2.ZodBranded,
      type: this,
      ...processCreateParams2(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch2({
      ...processCreateParams2(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind2.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline2.create(this, target);
  }
  readonly() {
    return ZodReadonly2.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex2 = /^c[^\s-]{8,}$/i;
var cuid2Regex2 = /^[0-9a-z]+$/;
var ulidRegex2 = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex2 = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex2 = /^[a-z0-9_-]{21}$/i;
var jwtRegex2 = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex2 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex2 = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex2 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex2;
var ipv4Regex2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex2 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex2 = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex2 = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource2 = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex2 = new RegExp(`^${dateRegexSource2}$`);
function timeRegexSource2(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex2(args) {
  return new RegExp(`^${timeRegexSource2(args)}$`);
}
function datetimeRegex2(args) {
  let regex = `${dateRegexSource2}T${timeRegexSource2(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP2(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex2.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex2.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT2(jwt, alg) {
  if (!jwtRegex2.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr2(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex2.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex2.test(ip)) {
    return true;
  }
  return false;
}
var ZodString2 = class _ZodString extends ZodType2 {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext2(ctx2, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.string,
        received: ctx2.parsedType
      });
      return INVALID2;
    }
    const status = new ParseStatus2();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext2(ctx, {
              code: ZodIssueCode2.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext2(ctx, {
              code: ZodIssueCode2.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "email",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex2) {
          emojiRegex2 = new RegExp(_emojiRegex2, "u");
        }
        if (!emojiRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "emoji",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "uuid",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "nanoid",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "cuid",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "cuid2",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "ulid",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "url",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "regex",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex2(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex2;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex2(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "duration",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP2(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "ip",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT2(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "jwt",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr2(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "cidr",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "base64",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex2.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            validation: "base64url",
            code: ZodIssueCode2.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util2.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode2.invalid_string,
      ...errorUtil2.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil2.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil2.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil2.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil2.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil2.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil2.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil2.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil2.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil2.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil2.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil2.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil2.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil2.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil2.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil2.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil2.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil2.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil2.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil2.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil2.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil2.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil2.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil2.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil2.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString2.create = (params) => {
  return new ZodString2({
    checks: [],
    typeName: ZodFirstPartyTypeKind2.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams2(params)
  });
};
function floatSafeRemainder2(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber2 = class _ZodNumber extends ZodType2 {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext2(ctx2, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.number,
        received: ctx2.parsedType
      });
      return INVALID2;
    }
    let ctx = void 0;
    const status = new ParseStatus2();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util2.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder2(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util2.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil2.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil2.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil2.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil2.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil2.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil2.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil2.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil2.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil2.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil2.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil2.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil2.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil2.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil2.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util2.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber2.create = (params) => {
  return new ZodNumber2({
    checks: [],
    typeName: ZodFirstPartyTypeKind2.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams2(params)
  });
};
var ZodBigInt2 = class _ZodBigInt extends ZodType2 {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus2();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util2.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext2(ctx, {
      code: ZodIssueCode2.invalid_type,
      expected: ZodParsedType2.bigint,
      received: ctx.parsedType
    });
    return INVALID2;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil2.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil2.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil2.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil2.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil2.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil2.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil2.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil2.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil2.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil2.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt2.create = (params) => {
  return new ZodBigInt2({
    checks: [],
    typeName: ZodFirstPartyTypeKind2.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams2(params)
  });
};
var ZodBoolean2 = class extends ZodType2 {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.boolean,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
};
ZodBoolean2.create = (params) => {
  return new ZodBoolean2({
    typeName: ZodFirstPartyTypeKind2.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams2(params)
  });
};
var ZodDate2 = class _ZodDate extends ZodType2 {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext2(ctx2, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.date,
        received: ctx2.parsedType
      });
      return INVALID2;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext2(ctx2, {
        code: ZodIssueCode2.invalid_date
      });
      return INVALID2;
    }
    const status = new ParseStatus2();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util2.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil2.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil2.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate2.create = (params) => {
  return new ZodDate2({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind2.ZodDate,
    ...processCreateParams2(params)
  });
};
var ZodSymbol2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.symbol,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
};
ZodSymbol2.create = (params) => {
  return new ZodSymbol2({
    typeName: ZodFirstPartyTypeKind2.ZodSymbol,
    ...processCreateParams2(params)
  });
};
var ZodUndefined2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.undefined,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
};
ZodUndefined2.create = (params) => {
  return new ZodUndefined2({
    typeName: ZodFirstPartyTypeKind2.ZodUndefined,
    ...processCreateParams2(params)
  });
};
var ZodNull2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.null,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
};
ZodNull2.create = (params) => {
  return new ZodNull2({
    typeName: ZodFirstPartyTypeKind2.ZodNull,
    ...processCreateParams2(params)
  });
};
var ZodAny2 = class extends ZodType2 {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK2(input.data);
  }
};
ZodAny2.create = (params) => {
  return new ZodAny2({
    typeName: ZodFirstPartyTypeKind2.ZodAny,
    ...processCreateParams2(params)
  });
};
var ZodUnknown2 = class extends ZodType2 {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK2(input.data);
  }
};
ZodUnknown2.create = (params) => {
  return new ZodUnknown2({
    typeName: ZodFirstPartyTypeKind2.ZodUnknown,
    ...processCreateParams2(params)
  });
};
var ZodNever2 = class extends ZodType2 {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext2(ctx, {
      code: ZodIssueCode2.invalid_type,
      expected: ZodParsedType2.never,
      received: ctx.parsedType
    });
    return INVALID2;
  }
};
ZodNever2.create = (params) => {
  return new ZodNever2({
    typeName: ZodFirstPartyTypeKind2.ZodNever,
    ...processCreateParams2(params)
  });
};
var ZodVoid2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.void,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
};
ZodVoid2.create = (params) => {
  return new ZodVoid2({
    typeName: ZodFirstPartyTypeKind2.ZodVoid,
    ...processCreateParams2(params)
  });
};
var ZodArray2 = class _ZodArray extends ZodType2 {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType2.array) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.array,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext2(ctx, {
          code: tooBig ? ZodIssueCode2.too_big : ZodIssueCode2.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext2(ctx, {
          code: ZodIssueCode2.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext2(ctx, {
          code: ZodIssueCode2.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath2(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus2.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath2(ctx, item, ctx.path, i));
    });
    return ParseStatus2.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil2.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil2.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil2.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray2.create = (schema, params) => {
  return new ZodArray2({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind2.ZodArray,
    ...processCreateParams2(params)
  });
};
function deepPartialify2(schema) {
  if (schema instanceof ZodObject2) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional2.create(deepPartialify2(fieldSchema));
    }
    return new ZodObject2({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray2) {
    return new ZodArray2({
      ...schema._def,
      type: deepPartialify2(schema.element)
    });
  } else if (schema instanceof ZodOptional2) {
    return ZodOptional2.create(deepPartialify2(schema.unwrap()));
  } else if (schema instanceof ZodNullable2) {
    return ZodNullable2.create(deepPartialify2(schema.unwrap()));
  } else if (schema instanceof ZodTuple2) {
    return ZodTuple2.create(schema.items.map((item) => deepPartialify2(item)));
  } else {
    return schema;
  }
}
var ZodObject2 = class _ZodObject extends ZodType2 {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util2.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext2(ctx2, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.object,
        received: ctx2.parsedType
      });
      return INVALID2;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever2 && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath2(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever2) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext2(ctx, {
            code: ZodIssueCode2.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath2(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus2.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus2.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil2.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil2.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind2.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util2.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util2.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify2(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util2.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util2.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional2) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum2(util2.objectKeys(this.shape));
  }
};
ZodObject2.create = (shape, params) => {
  return new ZodObject2({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever2.create(),
    typeName: ZodFirstPartyTypeKind2.ZodObject,
    ...processCreateParams2(params)
  });
};
ZodObject2.strictCreate = (shape, params) => {
  return new ZodObject2({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever2.create(),
    typeName: ZodFirstPartyTypeKind2.ZodObject,
    ...processCreateParams2(params)
  });
};
ZodObject2.lazycreate = (shape, params) => {
  return new ZodObject2({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever2.create(),
    typeName: ZodFirstPartyTypeKind2.ZodObject,
    ...processCreateParams2(params)
  });
};
var ZodUnion2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError2(result.ctx.common.issues));
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_union,
        unionErrors
      });
      return INVALID2;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError2(issues2));
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_union,
        unionErrors
      });
      return INVALID2;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion2.create = (types, params) => {
  return new ZodUnion2({
    options: types,
    typeName: ZodFirstPartyTypeKind2.ZodUnion,
    ...processCreateParams2(params)
  });
};
var getDiscriminator2 = (type) => {
  if (type instanceof ZodLazy2) {
    return getDiscriminator2(type.schema);
  } else if (type instanceof ZodEffects2) {
    return getDiscriminator2(type.innerType());
  } else if (type instanceof ZodLiteral2) {
    return [type.value];
  } else if (type instanceof ZodEnum2) {
    return type.options;
  } else if (type instanceof ZodNativeEnum2) {
    return util2.objectValues(type.enum);
  } else if (type instanceof ZodDefault2) {
    return getDiscriminator2(type._def.innerType);
  } else if (type instanceof ZodUndefined2) {
    return [void 0];
  } else if (type instanceof ZodNull2) {
    return [null];
  } else if (type instanceof ZodOptional2) {
    return [void 0, ...getDiscriminator2(type.unwrap())];
  } else if (type instanceof ZodNullable2) {
    return [null, ...getDiscriminator2(type.unwrap())];
  } else if (type instanceof ZodBranded2) {
    return getDiscriminator2(type.unwrap());
  } else if (type instanceof ZodReadonly2) {
    return getDiscriminator2(type.unwrap());
  } else if (type instanceof ZodCatch2) {
    return getDiscriminator2(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion2 = class _ZodDiscriminatedUnion extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.object) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.object,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID2;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator2(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind2.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams2(params)
    });
  }
};
function mergeValues2(a, b) {
  const aType = getParsedType2(a);
  const bType = getParsedType2(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType2.object && bType === ZodParsedType2.object) {
    const bKeys = util2.objectKeys(b);
    const sharedKeys = util2.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues2(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType2.array && bType === ZodParsedType2.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues2(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType2.date && bType === ZodParsedType2.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection2 = class extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted2(parsedLeft) || isAborted2(parsedRight)) {
        return INVALID2;
      }
      const merged = mergeValues2(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext2(ctx, {
          code: ZodIssueCode2.invalid_intersection_types
        });
        return INVALID2;
      }
      if (isDirty2(parsedLeft) || isDirty2(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection2.create = (left, right, params) => {
  return new ZodIntersection2({
    left,
    right,
    typeName: ZodFirstPartyTypeKind2.ZodIntersection,
    ...processCreateParams2(params)
  });
};
var ZodTuple2 = class _ZodTuple extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.array) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.array,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID2;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath2(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus2.mergeArray(status, results);
      });
    } else {
      return ParseStatus2.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple2.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple2({
    items: schemas,
    typeName: ZodFirstPartyTypeKind2.ZodTuple,
    rest: null,
    ...processCreateParams2(params)
  });
};
var ZodRecord2 = class _ZodRecord extends ZodType2 {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.object) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.object,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath2(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath2(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus2.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus2.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType2) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind2.ZodRecord,
        ...processCreateParams2(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString2.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind2.ZodRecord,
      ...processCreateParams2(second)
    });
  }
};
var ZodMap2 = class extends ZodType2 {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.map) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.map,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath2(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath2(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID2;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID2;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap2.create = (keyType, valueType, params) => {
  return new ZodMap2({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind2.ZodMap,
    ...processCreateParams2(params)
  });
};
var ZodSet2 = class _ZodSet extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.set) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.set,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext2(ctx, {
          code: ZodIssueCode2.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext2(ctx, {
          code: ZodIssueCode2.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID2;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath2(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil2.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil2.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet2.create = (valueType, params) => {
  return new ZodSet2({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind2.ZodSet,
    ...processCreateParams2(params)
  });
};
var ZodFunction2 = class _ZodFunction extends ZodType2 {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.function) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.function,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    function makeArgsIssue(args, error) {
      return makeIssue2({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap2(), en_default2].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode2.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue2({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap2(), en_default2].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode2.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise2) {
      const me = this;
      return OK2(async function(...args) {
        const error = new ZodError2([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK2(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError2([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError2([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple2.create(items).rest(ZodUnknown2.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple2.create([]).rest(ZodUnknown2.create()),
      returns: returns || ZodUnknown2.create(),
      typeName: ZodFirstPartyTypeKind2.ZodFunction,
      ...processCreateParams2(params)
    });
  }
};
var ZodLazy2 = class extends ZodType2 {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy2.create = (getter, params) => {
  return new ZodLazy2({
    getter,
    typeName: ZodFirstPartyTypeKind2.ZodLazy,
    ...processCreateParams2(params)
  });
};
var ZodLiteral2 = class extends ZodType2 {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        received: ctx.data,
        code: ZodIssueCode2.invalid_literal,
        expected: this._def.value
      });
      return INVALID2;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral2.create = (value, params) => {
  return new ZodLiteral2({
    value,
    typeName: ZodFirstPartyTypeKind2.ZodLiteral,
    ...processCreateParams2(params)
  });
};
function createZodEnum2(values, params) {
  return new ZodEnum2({
    values,
    typeName: ZodFirstPartyTypeKind2.ZodEnum,
    ...processCreateParams2(params)
  });
}
var ZodEnum2 = class _ZodEnum extends ZodType2 {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext2(ctx, {
        expected: util2.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode2.invalid_type
      });
      return INVALID2;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext2(ctx, {
        received: ctx.data,
        code: ZodIssueCode2.invalid_enum_value,
        options: expectedValues
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum2.create = createZodEnum2;
var ZodNativeEnum2 = class extends ZodType2 {
  _parse(input) {
    const nativeEnumValues = util2.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType2.string && ctx.parsedType !== ZodParsedType2.number) {
      const expectedValues = util2.objectValues(nativeEnumValues);
      addIssueToContext2(ctx, {
        expected: util2.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode2.invalid_type
      });
      return INVALID2;
    }
    if (!this._cache) {
      this._cache = new Set(util2.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util2.objectValues(nativeEnumValues);
      addIssueToContext2(ctx, {
        received: ctx.data,
        code: ZodIssueCode2.invalid_enum_value,
        options: expectedValues
      });
      return INVALID2;
    }
    return OK2(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum2.create = (values, params) => {
  return new ZodNativeEnum2({
    values,
    typeName: ZodFirstPartyTypeKind2.ZodNativeEnum,
    ...processCreateParams2(params)
  });
};
var ZodPromise2 = class extends ZodType2 {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType2.promise && ctx.common.async === false) {
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.promise,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    const promisified = ctx.parsedType === ZodParsedType2.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK2(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise2.create = (schema, params) => {
  return new ZodPromise2({
    type: schema,
    typeName: ZodFirstPartyTypeKind2.ZodPromise,
    ...processCreateParams2(params)
  });
};
var ZodEffects2 = class extends ZodType2 {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind2.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext2(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID2;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID2;
          if (result.status === "dirty")
            return DIRTY2(result.value);
          if (status.value === "dirty")
            return DIRTY2(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID2;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID2;
        if (result.status === "dirty")
          return DIRTY2(result.value);
        if (status.value === "dirty")
          return DIRTY2(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID2;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID2;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid2(base))
          return INVALID2;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid2(base))
            return INVALID2;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util2.assertNever(effect);
  }
};
ZodEffects2.create = (schema, effect, params) => {
  return new ZodEffects2({
    schema,
    typeName: ZodFirstPartyTypeKind2.ZodEffects,
    effect,
    ...processCreateParams2(params)
  });
};
ZodEffects2.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects2({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind2.ZodEffects,
    ...processCreateParams2(params)
  });
};
var ZodOptional2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType2.undefined) {
      return OK2(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional2.create = (type, params) => {
  return new ZodOptional2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind2.ZodOptional,
    ...processCreateParams2(params)
  });
};
var ZodNullable2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType2.null) {
      return OK2(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable2.create = (type, params) => {
  return new ZodNullable2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind2.ZodNullable,
    ...processCreateParams2(params)
  });
};
var ZodDefault2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType2.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault2.create = (type, params) => {
  return new ZodDefault2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind2.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams2(params)
  });
};
var ZodCatch2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync2(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError2(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError2(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch2.create = (type, params) => {
  return new ZodCatch2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind2.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams2(params)
  });
};
var ZodNaN2 = class extends ZodType2 {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType2.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext2(ctx, {
        code: ZodIssueCode2.invalid_type,
        expected: ZodParsedType2.nan,
        received: ctx.parsedType
      });
      return INVALID2;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN2.create = (params) => {
  return new ZodNaN2({
    typeName: ZodFirstPartyTypeKind2.ZodNaN,
    ...processCreateParams2(params)
  });
};
var BRAND2 = Symbol("zod_brand");
var ZodBranded2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline2 = class _ZodPipeline extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID2;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY2(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID2;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind2.ZodPipeline
    });
  }
};
var ZodReadonly2 = class extends ZodType2 {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid2(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync2(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly2.create = (type, params) => {
  return new ZodReadonly2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind2.ZodReadonly,
    ...processCreateParams2(params)
  });
};
function cleanParams2(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom2(check, _params = {}, fatal) {
  if (check)
    return ZodAny2.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams2(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams2(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny2.create();
}
var late2 = {
  object: ZodObject2.lazycreate
};
var ZodFirstPartyTypeKind2;
(function(ZodFirstPartyTypeKind3) {
  ZodFirstPartyTypeKind3["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind3["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind3["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind3["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind3["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind3["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind3["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind3["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind3["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind3["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind3["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind3["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind3["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind3["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind3["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind3["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind3["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind3["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind3["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind3["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind3["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind3["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind3["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind3["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind3["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind3["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind3["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind3["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind3["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind3["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind3["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind3["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind3["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind3["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind3["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind3["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind2 || (ZodFirstPartyTypeKind2 = {}));
var instanceOfType2 = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom2((data) => data instanceof cls, params);
var stringType2 = ZodString2.create;
var numberType2 = ZodNumber2.create;
var nanType2 = ZodNaN2.create;
var bigIntType2 = ZodBigInt2.create;
var booleanType2 = ZodBoolean2.create;
var dateType2 = ZodDate2.create;
var symbolType2 = ZodSymbol2.create;
var undefinedType2 = ZodUndefined2.create;
var nullType2 = ZodNull2.create;
var anyType2 = ZodAny2.create;
var unknownType2 = ZodUnknown2.create;
var neverType2 = ZodNever2.create;
var voidType2 = ZodVoid2.create;
var arrayType2 = ZodArray2.create;
var objectType2 = ZodObject2.create;
var strictObjectType2 = ZodObject2.strictCreate;
var unionType2 = ZodUnion2.create;
var discriminatedUnionType2 = ZodDiscriminatedUnion2.create;
var intersectionType2 = ZodIntersection2.create;
var tupleType2 = ZodTuple2.create;
var recordType2 = ZodRecord2.create;
var mapType2 = ZodMap2.create;
var setType2 = ZodSet2.create;
var functionType2 = ZodFunction2.create;
var lazyType2 = ZodLazy2.create;
var literalType2 = ZodLiteral2.create;
var enumType2 = ZodEnum2.create;
var nativeEnumType2 = ZodNativeEnum2.create;
var promiseType2 = ZodPromise2.create;
var effectsType2 = ZodEffects2.create;
var optionalType2 = ZodOptional2.create;
var nullableType2 = ZodNullable2.create;
var preprocessType2 = ZodEffects2.createWithPreprocess;
var pipelineType2 = ZodPipeline2.create;
var ostring2 = () => stringType2().optional();
var onumber2 = () => numberType2().optional();
var oboolean2 = () => booleanType2().optional();
var coerce2 = {
  string: (arg) => ZodString2.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber2.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean2.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt2.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate2.create({ ...arg, coerce: true })
};
var NEVER2 = INVALID2;

// apps/worker/src/api/routes/auth.ts
init_src();
init_errors2();
init_authService();
init_authService();

// apps/worker/src/services/nationService.ts
init_sql();
init_errors2();
init_format();
init_ids();
init_queries();
init_auditService();

// apps/worker/src/services/financeService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_queries();
init_auditService();
init_notificationService();
function completedCycleIndex(anchorAt, cycleSeconds, now) {
  if (cycleSeconds <= 0) return -1;
  const elapsed = now - anchorAt;
  if (elapsed < cycleSeconds) return -1;
  return Math.floor(elapsed / cycleSeconds) - 1;
}
async function creditCycle(db, nation, settings, now = nowSeconds()) {
  const override = await db.first(
    sql`SELECT income_cycle_seconds FROM nation_settings WHERE nation_id = ${nation.id}`
  );
  const cycleSeconds = Math.max(60, override?.income_cycle_seconds ?? settings.economy.incomeCycleSeconds);
  const due = completedCycleIndex(nation.income_anchor_at, cycleSeconds, now);
  const lastCredited = Number(nation.last_income_cycle ?? -1);
  if (due <= lastCredited) {
    return { nationId: nation.id, status: "not_due", cycleIndex: lastCredited, gross: 0, tax: 0, maintenance: 0, net: 0, treasuryAfter: nation.treasury };
  }
  const cycleIndex = lastCredited + 1;
  const computed = await computeNation(db, nation, settings);
  const { grossIncome, taxCost, maintenanceCost } = computed.income;
  let net = grossIncome - taxCost - maintenanceCost;
  if (net < 0) net = -Math.min(-net, nation.treasury);
  const key = revenueCycleKey(nation.id, cycleIndex);
  const txUuid = uuid();
  const at = nowSeconds();
  if (net === 0) {
    await db.batch([
      sql`INSERT OR IGNORE INTO revenue_cycles (nation_id, cycle_index, cycle_key, gross_amount, tax_amount, maintenance_amount, net_amount, status, computed_at, credited_at)
           VALUES (${nation.id}, ${cycleIndex}, ${key}, ${grossIncome}, ${taxCost}, ${maintenanceCost}, 0, 'skipped', ${at}, ${at})`,
      sql`UPDATE nations SET last_income_cycle = ${cycleIndex}, last_income_at = ${at}, updated_at = ${at} WHERE id = ${nation.id}`
    ]);
    return { nationId: nation.id, status: "skipped", cycleIndex, gross: grossIncome, tax: taxCost, maintenance: maintenanceCost, net: 0, treasuryAfter: nation.treasury };
  }
  try {
    await db.batch([
      sql`INSERT OR IGNORE INTO revenue_cycles (nation_id, cycle_index, cycle_key, gross_amount, tax_amount, maintenance_amount, net_amount, status, computed_at)
           VALUES (${nation.id}, ${cycleIndex}, ${key}, ${grossIncome}, ${taxCost}, ${maintenanceCost}, ${net}, 'pending', ${at})`,
      sql`UPDATE nations
             SET treasury = treasury + COALESCE((SELECT net_amount FROM revenue_cycles WHERE cycle_key = ${key} AND status = 'pending'), 0),
                 last_income_cycle = ${cycleIndex},
                 last_income_at = ${at},
                 updated_at = ${at}
           WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${txUuid}, ${nation.id}, 'revenue', ${net}, ${nation.treasury},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), 'coin',
                   ${key}, 'revenue_cycle',
                   (SELECT id FROM revenue_cycles WHERE cycle_key = ${key}),
                   ${`\u062F\u0631\u0622\u0645\u062F \u062F\u0648\u0631\u0647 ${cycleIndex + 1}`},
                   ${JSON.stringify({ gross: grossIncome, tax: taxCost, maintenance: maintenanceCost })}, ${at})`,
      sql`UPDATE revenue_cycles
              SET status = 'credited', credited_at = ${at},
                  transaction_id = (SELECT id FROM transactions WHERE idempotency_key = ${key})
            WHERE cycle_key = ${key} AND status = 'pending'`,
      sql`UPDATE nation_economy
              SET total_income = total_income + ${Math.max(0, net)},
                  total_tax = total_tax + ${taxCost},
                  updated_at = ${at}
            WHERE nation_id = ${nation.id}`,
      sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
           VALUES (${nation.id}, ${dayKey(at)},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), ${net},
                   (SELECT military_power FROM nations WHERE id = ${nation.id}),
                   (SELECT equipment_count FROM nations WHERE id = ${nation.id}), ${at})
           ON CONFLICT (nation_id, day) DO UPDATE SET
             treasury = excluded.treasury, income = nation_stat_history.income + excluded.income,
             power = excluded.power, equipment = excluded.equipment`
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed: (revenue_cycles|transactions)/i.test(message)) {
      const balance2 = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
      return { nationId: nation.id, status: "no_change", cycleIndex, gross: grossIncome, tax: taxCost, maintenance: maintenanceCost, net: 0, treasuryAfter: Number(balance2?.treasury ?? nation.treasury) };
    }
    throw err;
  }
  const balance = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  return {
    nationId: nation.id,
    status: "credited",
    cycleIndex,
    gross: grossIncome,
    tax: taxCost,
    maintenance: maintenanceCost,
    net,
    treasuryAfter: Number(balance?.treasury ?? nation.treasury)
  };
}
async function listTransactions(db, nationId, opts = {}) {
  const limit = Math.min(100, Math.max(1, opts.limit ?? 25));
  const offset = Math.max(0, opts.offset ?? 0);
  const where = opts.type && opts.type !== "all" ? "AND t.type = ?" : "";
  const bindings = [nationId, ...opts.type && opts.type !== "all" ? [opts.type] : [], limit + 1, offset];
  const rows = await db.all({
    sql: `SELECT t.* FROM transactions t WHERE t.nation_id = ? ${where} ORDER BY t.id DESC LIMIT ? OFFSET ?`,
    bindings
  });
  const page = rows.slice(0, limit);
  const ids = page.map((r) => Number(r.id));
  const items = ids.length ? await db.all(
    sql`SELECT transaction_id, name_snapshot, quantity, unit_price, total_price
              FROM transaction_items WHERE transaction_id IN (${ids})`
  ) : [];
  const byTx = /* @__PURE__ */ new Map();
  for (const it of items) {
    const list = byTx.get(Number(it.transaction_id)) ?? [];
    list.push({
      nameFa: String(it.name_snapshot),
      quantity: Number(it.quantity),
      unitPrice: it.unit_price === null ? null : Number(it.unit_price),
      totalPrice: it.total_price === null ? null : Number(it.total_price)
    });
    byTx.set(Number(it.transaction_id), list);
  }
  return {
    rows: page.map((r) => ({
      id: Number(r.id),
      uuid: String(r.uuid),
      type: r.type,
      typeLabelFa: TRANSACTION_TYPE_LABELS_FA[r.type] ?? String(r.type),
      amount: Number(r.amount),
      balanceBefore: r.balance_before === null ? null : Number(r.balance_before),
      balanceAfter: r.balance_after === null ? null : Number(r.balance_after),
      reason: r.reason ?? null,
      referenceType: r.reference_type ?? null,
      referenceId: r.reference_id === null ? null : Number(r.reference_id),
      createdAt: toIso(Number(r.created_at)),
      items: byTx.get(Number(r.id)) ?? []
    })),
    nextOffset: rows.length > limit ? offset + limit : null
  };
}
async function treasuryHistory(db, nationId, days = 30) {
  const rows = await db.all(
    sql`SELECT day, treasury, income, power, equipment FROM nation_stat_history
          WHERE nation_id = ${nationId} ORDER BY day DESC LIMIT ${Math.min(365, Math.max(2, days))}`
  );
  const history = rows.reverse();
  if (history.length > 0) return history;
  return db.all(
    sql`SELECT strftime('%Y-%m-%d', created_at, 'unixepoch') AS day,
               SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,
               SUM(amount) AS treasury
          FROM transactions WHERE nation_id = ${nationId}
         GROUP BY day ORDER BY day ASC LIMIT ${Math.min(365, Math.max(2, days))}`
  );
}
async function adminAdjustTreasury(db, nation, delta, reason, actor) {
  if (!Number.isInteger(delta) || delta === 0) throw ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (reason.trim().length < 3) throw ApiError.validation("\u062B\u0628\u062A \u062F\u0644\u06CC\u0644 \u0628\u0631\u0627\u06CC \u0627\u0635\u0644\u0627\u062D \u0645\u0627\u0644\u06CC \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A.");
  const at = nowSeconds();
  const key = adminTxKey(delta > 0 ? "credit" : "debit", nation.id, at, uuid().slice(0, 8));
  const type = delta > 0 ? "admin_credit" : "admin_debit";
  try {
    await db.batch([
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reference_id, reason, created_by_user_id, created_at)
           VALUES (${uuid()}, ${nation.id}, ${type}, ${delta}, ${nation.treasury}, ${nation.treasury + delta}, 'coin', ${key},
                   'admin', ${actor.userId}, ${reason.trim()}, ${actor.userId}, ${at})`,
      sql`UPDATE nations SET treasury = treasury + ${delta}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`UPDATE nation_economy
              SET total_income = total_income + CASE WHEN ${delta} > 0 THEN ${delta} ELSE 0 END,
                  total_spent  = total_spent  + CASE WHEN ${delta} < 0 THEN ${-delta} ELSE 0 END,
                  updated_at = ${at}
            WHERE nation_id = ${nation.id}`
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("check constraint")) {
      throw ApiError.validation("\u06A9\u0627\u0647\u0634 \u0645\u0648\u062C\u0648\u062F\u06CC \u0628\u0627\u0639\u062B \u0645\u0646\u0641\u06CC \u0634\u062F\u0646 \u062E\u0632\u0627\u0646\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A.");
    }
    throw err;
  }
  const after = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor,
    action: "economy.adjust_treasury",
    targetType: "nation",
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), delta },
    reason: reason.trim()
  });
  await notify(db, {
    nationId: nation.id,
    kind: "admin",
    title: delta > 0 ? "\u0627\u0641\u0632\u0627\u06CC\u0634 \u062E\u0632\u0627\u0646\u0647 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631" : "\u06A9\u0627\u0647\u0634 \u062E\u0632\u0627\u0646\u0647 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631",
    body: `${delta > 0 ? "+" : ""}${delta.toLocaleString("en-US")} \u0633\u06A9\u0647 \u2014 \u062F\u0644\u06CC\u0644: ${reason.trim()}`
  });
  return { treasuryBefore: nation.treasury, treasuryAfter: Number(after?.treasury ?? 0) };
}
async function adminSetIncome(db, nation, patch, reason, settings, actor) {
  const at = nowSeconds();
  const sets = [];
  const bindings = [];
  for (const [col, value] of [
    ["factory_income", patch.factoryIncome],
    ["mine_income", patch.mineIncome],
    ["upkeep_base", patch.upkeepBase]
  ]) {
    if (value === void 0) continue;
    if (!Number.isInteger(value) || value < 0) throw ApiError.validation("\u0645\u0642\u0627\u062F\u06CC\u0631 \u062F\u0631\u0622\u0645\u062F \u0648 \u0647\u0632\u06CC\u0646\u0647 \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC \u0628\u0627\u06CC\u062F \u0639\u062F\u062F \u0635\u062D\u06CC\u062D \u063A\u06CC\u0631\u0645\u0646\u0641\u06CC \u0628\u0627\u0634\u0646\u062F.");
    sets.push(`${col} = ?`);
    bindings.push(value);
  }
  if (sets.length === 0) throw ApiError.validation("\u0647\u06CC\u0686 \u062A\u063A\u06CC\u06CC\u0631\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  if (reason.trim().length < 3) throw ApiError.validation("\u062B\u0628\u062A \u062F\u0644\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A.");
  bindings.push(at, nation.id);
  await db.run({
    sql: `UPDATE nation_economy SET ${sets.join(", ")}, updated_at = ? WHERE nation_id = ?`,
    bindings
  });
  const updated = await db.first(
    sql`SELECT factory_income, mine_income FROM nation_economy WHERE nation_id = ${nation.id}`
  );
  await db.run(
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                  reference_type, reference_id, reason, created_by_user_id, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, 'admin_correction', 0, ${nation.treasury}, ${nation.treasury}, 'coin', ${adminTxKey("income", nation.id, at, uuid().slice(0, 8))},
                 'economy', NULL, ${reason.trim()}, ${actor.userId}, ${JSON.stringify({ ...patch })}, ${at})`
  );
  await refreshNationStatsAfterIncomeChange(db, nation, settings);
  await audit(db, {
    actor,
    action: "economy.set_income",
    targetType: "nation",
    targetId: nation.id,
    before: { factoryIncome: (await loadIncome(db, nation.id))?.factory_income },
    after: { ...patch, factory_income: updated?.factory_income, mine_income: updated?.mine_income },
    reason: reason.trim()
  });
  return updated;
}
async function loadIncome(db, nationId) {
  return db.first(
    sql`SELECT factory_income, mine_income, upkeep_base FROM nation_economy WHERE nation_id = ${nationId}`
  );
}
async function refreshNationStatsAfterIncomeChange(db, nation, settings) {
  const { refreshNationStats: refreshNationStats2 } = await Promise.resolve().then(() => (init_queries(), queries_exports));
  await refreshNationStats2(db, nation, settings);
}
async function globalMoneyStats(db) {
  const row = await db.first(
    sql`SELECT (SELECT COALESCE(SUM(treasury),0) FROM nations) AS total_treasury,
               (SELECT COALESCE(SUM(gross_income),0) FROM nation_economy) AS total_income,
               (SELECT COUNT(*) FROM transactions) AS total_tx`
  );
  return {
    totalTreasury: Number(row?.total_treasury ?? 0),
    totalIncomePerCycle: Number(row?.total_income ?? 0),
    transactionCount: Number(row?.total_tx ?? 0)
  };
}

// apps/worker/src/services/nationService.ts
function starterFlatUnits(items) {
  let factory = 0, mine = 0;
  for (const it of items) {
    const flat = !it.income_per_cycle || Number(it.income_per_cycle) <= 0;
    if (!flat) continue;
    const qty = Math.max(0, Number(it.quantity) || 0);
    if (it.category_key === "factories") factory += qty;
    else if (it.category_key === "mines") mine += qty;
  }
  return { factory, mine };
}
function starterTemplateIncomes(items) {
  let factory = 0, mine = 0;
  for (const it of items) {
    const inc = Math.max(0, Number(it.income_per_cycle ?? 0)) * Math.max(0, Number(it.quantity) || 0);
    if (it.category_key === "factories") factory += inc;
    else if (it.category_key === "mines") mine += inc;
  }
  return { factory, mine };
}
async function getDefaultStarterTemplate(db) {
  const head = await db.first(
    sql`SELECT id, name, treasury, factory_income, mine_income, income_cycle_seconds
          FROM starter_templates WHERE is_active = 1 ORDER BY is_default DESC, id ASC LIMIT 1`
  );
  if (!head) {
    throw ApiError.internal("\u0628\u0633\u062A\u0647 \u0627\u0648\u0644\u06CC\u0647 \u06A9\u0634\u0648\u0631 \u062F\u0631 \u062F\u06CC\u062A\u0627\u0628\u06CC\u0633 \u0646\u06CC\u0633\u062A. seed \u0631\u0627 \u0627\u062C\u0631\u0627 \u06A9\u0646\u06CC\u062F: npm run db:seed:local / db:seed:remote");
  }
  const items = await db.all(
    sql`SELECT ti.equipment_template_id, ti.quantity, t.income_per_cycle, c.key AS category_key
          FROM starter_template_items ti
          JOIN equipment_templates t ON t.id = ti.equipment_template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE ti.starter_template_id = ${head.id}`
  );
  return { ...head, items };
}
async function createNation(db, actor, input, settings) {
  const name = input.name.trim();
  const leader = input.leaderName.trim();
  const flag = input.flag.trim();
  if (!name || !leader || !flag) throw ApiError.validation("\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631\u060C \u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u0648 \u067E\u0631\u0686\u0645 \u0644\u0627\u0632\u0645 \u0627\u0633\u062A.");
  if (name.length > 30) throw ApiError.validation("\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u0646\u0648\u06CC\u0633\u0647 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0628\u0627\u0634\u062F.");
  const owned = await db.first(
    sql`SELECT COUNT(*) AS c FROM nations WHERE owner_user_id = ${actor.userId} AND status <> 'dissolved'`
  );
  if (Number(owned?.c ?? 0) >= settings.profile.maxNationsPerUser) {
    throw ApiError.forbidden(
      `\u0634\u0645\u0627 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F ${settings.profile.maxNationsPerUser} \u06A9\u0634\u0648\u0631 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F. \u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0627\u0632 \u067E\u0646\u0644 \u0627\u062F\u0645\u06CC\u0646 \u0642\u0627\u0628\u0644 \u062A\u063A\u06CC\u06CC\u0631 \u0627\u0633\u062A.`
    );
  }
  const duplicate = await db.first(sql`SELECT id FROM nations WHERE name = ${name} COLLATE NOCASE`);
  if (duplicate) throw ApiError.conflict("\u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A. \u0646\u0627\u0645 \u062F\u06CC\u06AF\u0631\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.");
  const starter = await getDefaultStarterTemplate(db);
  const gross = starter.factory_income + starter.mine_income;
  const starterTpi = starterTemplateIncomes(starter.items);
  const starterFlat = starterFlatUnits(starter.items);
  const now = nowSeconds();
  const nationRow = await db.first(
    sql`INSERT INTO nations (owner_user_id, name, flag, leader_name, status, treasury,
                             income_anchor_at, last_income_cycle, starter_template_id, created_at, updated_at)
         VALUES (${actor.userId}, ${name}, ${flag}, ${leader}, 'active', ${starter.treasury}, ${now}, -1, ${starter.id}, ${now}, ${now})
         RETURNING id`
  );
  const nationId = Number(nationRow?.id ?? 0);
  if (!nationId) throw ApiError.internal("\u0627\u06CC\u062C\u0627\u062F \u06A9\u0634\u0648\u0631 \u0646\u0627\u0645\u0648\u0641\u0642 \u0628\u0648\u062F.");
  const invStmts = mapStmts(nationId, now)(starter.items.filter((i) => i.quantity > 0));
  await db.batch([
    ...invStmts,
    sql`INSERT INTO nation_economy (nation_id, factory_income, mine_income, starter_factory_count, starter_mine_count,
                                    gross_income, net_income, total_income, starter_factory_template_income, starter_mine_template_income,
                                    starter_flat_factories, starter_flat_mines, updated_at)
         VALUES (${nationId}, ${starter.factory_income}, ${starter.mine_income},
                 (SELECT COALESCE(SUM(i.quantity), 0) FROM nation_inventory i
                    JOIN equipment_templates t ON t.id = i.template_id
                    JOIN equipment_categories c ON c.id = t.category_id
                   WHERE i.nation_id = ${nationId} AND c.key = 'factories'),
                 (SELECT COALESCE(SUM(i.quantity), 0) FROM nation_inventory i
                    JOIN equipment_templates t ON t.id = i.template_id
                    JOIN equipment_categories c ON c.id = t.category_id
                   WHERE i.nation_id = ${nationId} AND c.key = 'mines'),
                 ${gross}, ${gross}, ${starter.treasury}, ${starterTpi.factory}, ${starterTpi.mine}, ${starterFlat.factory}, ${starterFlat.mine}, ${now})`,
    sql`INSERT INTO nation_settings (nation_id, defense_mode, fortification_level, notify_enabled, updated_at)
         VALUES (${nationId}, 'standard', 0, 1, ${now})`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                   idempotency_key, reference_type, reference_id, reason, created_by_user_id, meta, created_at)
         VALUES (${uuid()}, ${nationId}, 'starter_grant', ${starter.treasury}, 0, ${starter.treasury}, 'coin',
                 ${`starter:${nationId}`}, 'nation', ${nationId}, 'دارایی اولیه کشور', ${actor.userId},
                 ${JSON.stringify({ starterTemplate: starter.name, itemCount: starter.items.length })}, ${now})`,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('event', 'تأسیس کشور جدید', ${`${flag} ${name} \u0628\u0647 \u0631\u06CC\u0627\u0633\u062A ${leader} \u0628\u0647 \u0628\u0627\u0632\u06CC \u067E\u06CC\u0648\u0633\u062A.`}, 'global', ${nationId}, ${now})`
  ]);
  const nation = await loadNation(db, nationId);
  await refreshNationStats(db, nation, settings);
  await audit(db, {
    actor: { userId: actor.userId, telegramId: actor.telegramId },
    action: "nation.create",
    targetType: "nation",
    targetId: nationId,
    after: { name, leaderName: leader, flag, starterTemplate: starter.name },
    reason: "onboarding"
  });
  return {
    nationId,
    summary: [
      `${flag} \u06A9\u0634\u0648\u0631 \xAB${name}\xBB \u062A\u0623\u0633\u06CC\u0633 \u0634\u062F.`,
      `\u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631: ${leader}`,
      `\u062E\u0632\u0627\u0646\u0647 \u0627\u0648\u0644\u06CC\u0647: ${starter.treasury.toLocaleString("en-US")} \u0633\u06A9\u0647`,
      `\u062F\u0631\u0622\u0645\u062F \u0647\u0631 \u062F\u0648\u0631\u0647: ${gross.toLocaleString("en-US")} \u0633\u06A9\u0647 (\u06A9\u0627\u0631\u062E\u0627\u0646\u0647 ${starter.factory_income.toLocaleString("en-US")} + \u0645\u0639\u062F\u0646 ${starter.mine_income.toLocaleString("en-US")})`,
      `\u062A\u0639\u062F\u0627\u062F \u0627\u0642\u0644\u0627\u0645 \u0627\u0648\u0644\u06CC\u0647: ${starter.items.filter((i) => i.quantity > 0).length}`
    ].join("\n")
  };
}
function mapStmts(nationId, now) {
  return (items) => items.map(
    (item) => sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nationId}, ${item.equipment_template_id}, ${item.quantity}, ${now}, ${now})
           ON CONFLICT (nation_id, template_id) DO NOTHING`
  );
}
async function updateNationProfile(db, nation, patch, settings, actor) {
  const now = nowSeconds();
  const changes = [];
  const stmts = [];
  if (patch.name && patch.name.trim() !== nation.name) {
    const cd = settings.profile.renameCooldownSeconds;
    if (cd > 0 && nation.last_rename_at && now - nation.last_rename_at < cd) {
      throw ApiError.conflict(`\u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0647\u0631 ${humanDuration(cd)} \u06CC\u06A9\u200C\u0628\u0627\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A. \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647: ${humanDuration(cd - (now - nation.last_rename_at))}.`);
    }
    const dup = await db.first(
      sql`SELECT id FROM nations WHERE name = ${patch.name.trim()} COLLATE NOCASE AND id <> ${nation.id}`
    );
    if (dup) throw ApiError.conflict("\u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.");
    stmts.push(sql`UPDATE nations SET name = ${patch.name.trim()}, last_rename_at = ${now}, updated_at = ${now} WHERE id = ${nation.id}`);
    changes.push("\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631");
  }
  if (patch.leaderName && patch.leaderName.trim() !== nation.leader_name) {
    const cd = settings.profile.leaderRenameCooldownSeconds;
    if (cd > 0 && nation.last_leader_rename_at && now - nation.last_leader_rename_at < cd) {
      throw ApiError.conflict(`\u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631 \u0647\u0631 ${humanDuration(cd)} \u06CC\u06A9\u200C\u0628\u0627\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A.`);
    }
    stmts.push(sql`UPDATE nations SET leader_name = ${patch.leaderName.trim()}, last_leader_rename_at = ${now}, updated_at = ${now} WHERE id = ${nation.id}`);
    changes.push("\u0646\u0627\u0645 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631");
  }
  if (patch.flag && patch.flag.trim() !== nation.flag) {
    const cd = settings.profile.flagChangeCooldownSeconds;
    if (cd > 0 && nation.last_flag_change_at && now - nation.last_flag_change_at < cd) {
      throw ApiError.conflict(`\u062A\u063A\u06CC\u06CC\u0631 \u067E\u0631\u0686\u0645 \u0647\u0631 ${humanDuration(cd)} \u06CC\u06A9\u200C\u0628\u0627\u0631 \u0645\u062C\u0627\u0632 \u0627\u0633\u062A.`);
    }
    stmts.push(sql`UPDATE nations SET flag = ${patch.flag.trim()}, last_flag_change_at = ${now}, updated_at = ${now} WHERE id = ${nation.id}`);
    changes.push("\u067E\u0631\u0686\u0645");
  }
  if (stmts.length === 0) return [];
  await db.batch([
    ...stmts,
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('news', 'تغییر مشخصات کشور', ${`${nation.name}: ${changes.join("\u060C ")} \u0628\u0647\u200C\u0631\u0648\u0632\u0631\u0633\u0627\u0646\u06CC \u0634\u062F.`}, 'global', ${nation.id}, ${now})`
  ]);
  await audit(db, {
    actor,
    action: "nation.profile_update",
    targetType: "nation",
    targetId: nation.id,
    before: { name: nation.name, leaderName: nation.leader_name, flag: nation.flag },
    after: patch
  });
  return changes;
}
async function buildNationView(db, nation, settings, opts = {}) {
  const [economyRow, rel] = await Promise.all([loadEconomyRow(db, nation.id), relationCounts(db, nation.id)]);
  const computed = await computeNation(db, nation, settings);
  const dueCycle = completedCycleIndex(nation.income_anchor_at, computed.income.cycleSeconds, nowSeconds());
  const pendingCycles = Math.max(0, dueCycle - Number(nation.last_income_cycle ?? -1));
  let pendingAmount = 0;
  {
    let sim = nation.treasury;
    for (let i = 0; i < pendingCycles; i++) {
      let net = computed.income.netIncome;
      if (net < 0) net = -Math.min(-net, sim);
      sim += net;
      pendingAmount += net;
    }
  }
  const pending = { cycles: pendingCycles, amount: pendingAmount };
  const cycleSeconds = computed.income.cycleSeconds;
  const elapsed = nowSeconds() - nation.income_anchor_at;
  const completed = Math.max(0, Math.floor(elapsed / cycleSeconds));
  const nextIncomeIn = Math.max(0, (completed + 1) * cycleSeconds - elapsed);
  const view = {
    nation: mapNationSummary(nation, { incomePerCycle: computed.income.netIncome, allies: rel.allies, enemies: rel.enemies }),
    economy: {
      treasury: nation.treasury,
      factoryIncome: computed.income.factoryIncomeEffective,
      mineIncome: computed.income.mineIncomeEffective,
      grossIncome: computed.income.grossIncome,
      maintenanceCost: computed.income.maintenanceCost,
      taxCost: computed.income.taxCost,
      netIncome: computed.income.netIncome,
      cycleSeconds,
      nextIncomeIn,
      nextIncomeAt: toIso(nowSeconds() + nextIncomeIn),
      pendingIncome: pending.amount,
      pendingIncomeCycles: pending.cycles,
      lastIncomeAt: toIso(nation.last_income_at),
      totalIncome: Number(economyRow?.total_income ?? 0),
      totalSpent: Number(economyRow?.total_spent ?? 0),
      totalTax: Number(economyRow?.total_tax ?? 0),
      totalWarLosses: Number(economyRow?.war_loss_total ?? 0)
    },
    military: {
      attackPower: computed.power.attackPower,
      defensePower: computed.power.defensePower,
      militaryPower: computed.power.militaryPower,
      equipmentCount: computed.power.equipmentCount,
      troopsCount: computed.power.troopsCount,
      radarCount: computed.power.radarCount,
      airDefenseUnits: computed.power.airDefenseUnits
    },
    diplomacy: rel,
    history: {
      createdAt: toIso(nation.created_at) ?? "",
      lastRenameAt: toIso(nation.last_rename_at),
      lastLeaderRenameAt: toIso(nation.last_leader_rename_at),
      lastFlagChangeAt: toIso(nation.last_flag_change_at),
      cooldowns: {
        renameSecondsLeft: remaining(nation.last_rename_at, settings.profile.renameCooldownSeconds),
        leaderSecondsLeft: remaining(nation.last_leader_rename_at, settings.profile.leaderRenameCooldownSeconds),
        flagSecondsLeft: remaining(nation.last_flag_change_at, settings.profile.flagChangeCooldownSeconds)
      }
    }
  };
  if (opts.includeStarter && nation.starter_template_id) {
    const t = await db.first(sql`SELECT name FROM starter_templates WHERE id = ${nation.starter_template_id}`);
    if (t) view.starterTemplateName = t.name;
  }
  return view;
}
function remaining(lastAt, cooldown) {
  if (!cooldown || !lastAt) return 0;
  return Math.max(0, cooldown - (nowSeconds() - lastAt));
}
async function buildDefenseView(db, nation, settings) {
  const [inventory, weights, nationSettings] = await Promise.all([
    loadInventory(db, nation.id),
    loadCategoryWeights(db),
    loadSettingsForNation(db, nation.id)
  ]);
  const computed = await computeNation(db, nation, settings);
  const byCat = /* @__PURE__ */ new Map();
  for (const item of inventory) {
    const entry = byCat.get(item.categoryKey) ?? { label: item.categoryLabelFa, emoji: item.emoji, qty: 0, value: 0 };
    const weight = item.defensePoints ?? weights[item.categoryKey] ?? 0;
    entry.qty += item.quantity;
    entry.value += item.quantity * (item.categoryKey === "factories" || item.categoryKey === "mines" ? 0 : weight);
    byCat.set(item.categoryKey, entry);
  }
  const breakdown = [...byCat.entries()].filter(([, v]) => v.value > 0).map(([categoryKey, v]) => ({
    categoryKey,
    labelFa: v.label,
    emoji: v.emoji,
    quantity: v.qty,
    contribution: Math.round(v.value * 100) / 100
  })).sort((a, b) => b.contribution - a.contribution);
  const threats = await db.all(
    sql`SELECT w.id AS warId, w.attacker_nation_id AS attackerNationId, n.name AS attackerName, n.flag AS flag, w.rounds_played AS roundNo
          FROM wars w JOIN nations n ON n.id = w.attacker_nation_id
         WHERE w.defender_nation_id = ${nation.id} AND w.status IN ('active', 'proposed', 'peace_requested')`
  );
  const mode = nationSettings?.defense_mode ?? "standard";
  const status = threats.length > 0 ? "under_attack" : mode === "fortified" || mode === "alert" ? "alert" : computed.power.defensePower < computed.power.attackPower * 0.5 ? "exposed" : "secure";
  return {
    defenseScore: computed.power.defensePower,
    overallScore: Math.round((computed.power.defensePower + computed.power.attackPower * 0.5) * 100) / 100,
    troopsCount: computed.power.troopsCount,
    radarCount: computed.power.radarCount,
    airDefenseUnits: computed.power.airDefenseUnits,
    fortificationLevel: nationSettings?.fortification_level ?? 0,
    defenseMode: mode,
    status,
    statusLabelFa: { secure: "\u0627\u06CC\u0645\u0646", exposed: "\u0622\u0633\u06CC\u0628\u200C\u067E\u0630\u06CC\u0631", under_attack: "\u062A\u062D\u062A \u062D\u0645\u0644\u0647", alert: "\u0647\u0634\u062F\u0627\u0631" }[status],
    breakdown,
    activeThreats: threats
  };
}

// apps/worker/src/api/routes/auth.ts
init_sql();
var authRoutes = new Hono3();
var sessionSchema = external_exports2.object({ initData: external_exports2.string().min(20, "initData \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A") });
var DEV_LOGIN_ENVS = /* @__PURE__ */ new Set(["development", "test", "local"]);
authRoutes.post("/session", async (c) => {
  const db = new Db(c.env.DB);
  const body = await c.req.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    const e = formatZodError(parsed.error);
    throw ApiError.validation(e.message, e.fields);
  }
  const { upsert, session } = await authenticateInitData(db, c.env, parsed.data.initData, {
    ip: c.req.header("cf-connecting-ip") ?? null,
    userAgent: c.req.header("user-agent") ?? null
  });
  const user = await loadSessionUser(db, session.token);
  const nations = user ? await db.all(sql`SELECT id FROM nations WHERE owner_user_id = ${user.userId} AND status <> 'dissolved' ORDER BY id`) : [];
  let view = null;
  if (user?.activeNationId) {
    const settings = await loadSettings(db);
    const nation = await db.first(sql`SELECT * FROM nations WHERE id = ${user.activeNationId}`);
    if (nation) view = await buildNationView(db, nation, settings, { includeStarter: true });
  }
  return c.json({
    token: session.token,
    expiresAt: new Date(session.expiresAt * 1e3).toISOString(),
    user: {
      userId: upsert.userId,
      role: upsert.role,
      isAdmin: upsert.role === "admin" || upsert.role === "super_admin",
      isPrimaryAdmin: Boolean(user?.isPrimaryAdmin)
    },
    nations: nations.map((n) => n.id),
    view
  });
});
authRoutes.use("/me", requireUser);
authRoutes.use("/logout", requireUser);
authRoutes.use("/switch-nation", requireUser);
authRoutes.get("/me", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const settings = await loadSettings(db);
  const nationId = user.activeNationId;
  const nationRow = nationId ? await db.first(sql`SELECT * FROM nations WHERE id = ${nationId}`) : null;
  const view = nationRow ? await buildNationView(db, nationRow, settings) : null;
  return c.json({
    userId: user.userId,
    telegramId: user.telegramId,
    username: user.username,
    role: user.role,
    status: user.status,
    permissions: user.permissions,
    nationIds: user.nationIds,
    activeNationId: user.activeNationId,
    isAdmin: user.role === "admin" || user.role === "super_admin",
    isPrimaryAdmin: user.isPrimaryAdmin,
    features: settings.features,
    branding: { gameName: settings.branding.gameName, welcomeTitle: settings.branding.welcomeTitle },
    view
  });
});
authRoutes.post("/switch-nation", async (c) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => null);
  const parsed = external_exports2.object({ nationId: external_exports2.coerce.number().int().positive() }).safeParse(body);
  if (!parsed.success) {
    const e = formatZodError(parsed.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return c.json(await setActiveNation(c.get("db"), user.userId, user.sessionId, parsed.data.nationId, user.nationIds));
});
authRoutes.post("/logout", async (c) => {
  const user = c.get("user");
  await revokeSession(c.get("db"), user.userId, user.sessionId);
  return c.json({ ok: true });
});
authRoutes.post("/dev-login", async (c) => {
  if (!DEV_LOGIN_ENVS.has(c.env.APP_ENV ?? "production")) {
    throw ApiError.forbidden("\u0627\u06CC\u0646 \u0645\u0633\u06CC\u0631 \u0641\u0642\u0637 \u062F\u0631 \u062D\u0627\u0644\u062A \u062A\u0648\u0633\u0639\u0647 \u0641\u0639\u0627\u0644 \u0627\u0633\u062A (APP_ENV=development|test|local).");
  }
  const db = new Db(c.env.DB);
  const body = await c.req.json().catch(() => ({}));
  const telegramId = Number(body.telegramId ?? 1);
  if (!Number.isInteger(telegramId) || telegramId <= 0) throw ApiError.validation("telegramId \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const upsert = await upsertTelegramUser(db, { telegramId, username: `dev_${telegramId}`, firstName: "Dev", lastName: null, languageCode: "fa" }, c.env);
  const { createSession: createSession2 } = await Promise.resolve().then(() => (init_authService(), authService_exports));
  const session = await createSession2(db, upsert, { ip: "127.0.0.1", userAgent: "dev" });
  return c.json({ token: session.token, userId: upsert.userId, role: upsert.role });
});
function mountAuth(app2) {
  app2.route("/api/auth", authRoutes);
}

// apps/worker/src/api/routes/player.ts
init_src();
init_errors2();
init_sql();
init_format();

// apps/worker/src/services/shopService.ts
init_sql();
init_errors2();
init_format();
init_ids();
init_queries();
init_auditService();
init_notificationService();
async function listCategories(db) {
  const rows = await db.all(
    sql`SELECT c.key AS key, c.label_fa AS labelFa, c.shop_label_fa AS shopLabelFa, c.emoji AS emoji, c.role AS role,
               c.sort_order AS sortOrder,
               COUNT(t.id) AS itemCount,
               SUM(CASE WHEN t.price IS NOT NULL AND t.is_for_sale = 1 AND t.is_active = 1 THEN 1 ELSE 0 END) AS purchasableCount
          FROM equipment_categories c
          LEFT JOIN equipment_templates t ON t.category_id = c.id
         WHERE c.is_active = 1
         GROUP BY c.id
         ORDER BY c.sort_order, c.label_fa`
  );
  return rows.map((r) => ({ ...r, itemCount: Number(r.itemCount), purchasableCount: Number(r.purchasableCount ?? 0) }));
}
async function listCategoryItems(db, nation, categoryKey, settings) {
  const category = await db.first(
    sql`SELECT id, key, label_fa AS labelFa, shop_label_fa AS shopLabelFa, emoji, role, sort_order AS sortOrder
          FROM equipment_categories WHERE key = ${categoryKey} COLLATE NOCASE`
  );
  if (!category) throw ApiError.notFound("\u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const rows = await db.all(
    sql`SELECT t.id AS templateId, t.code, t.name_fa AS nameFa, t.unit_fa AS unitFa, t.description,
               t.price, t.attack_points AS attackPoints, t.defense_points AS defensePoints,
               t.purchase_limit_per_cycle AS purchaseLimitPerCycle, t.maintenance_per_unit AS maintenancePerUnit,
               t.is_for_sale AS isForSale, t.is_active AS isActive,
               COALESCE(i.quantity, 0) AS ownedQuantity
          FROM equipment_templates t
          LEFT JOIN nation_inventory i ON i.template_id = t.id AND i.nation_id = ${nation.id}
         WHERE t.category_id = ${category.id} AND t.is_active = 1
         ORDER BY t.name_fa`
  );
  const cycleWindow = await currentCycleWindow(db, nation, settings);
  const items = [];
  for (const r of rows) {
    const price = r.price === null || r.price === void 0 ? null : Number(r.price);
    const owned = Number(r.ownedQuantity ?? 0);
    const limit = r.purchaseLimitPerCycle === null || r.purchaseLimitPerCycle === void 0 ? null : Number(r.purchaseLimitPerCycle);
    let boughtThisCycle = 0;
    if (limit) boughtThisCycle = await boughtInWindow(db, nation.id, Number(r.templateId), cycleWindow);
    const remaining2 = limit ? Math.max(0, limit - boughtThisCycle) : null;
    let disabledReason = null;
    if (!settings.features.shopEnabled) disabledReason = "\u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A";
    else if (Number(r.isActive) !== 1) disabledReason = "\u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A";
    else if (Number(r.isForSale) !== 1) disabledReason = "\u0641\u0631\u0648\u0634 \u0645\u062A\u0648\u0642\u0641 \u0634\u062F\u0647 \u0627\u0633\u062A";
    else if (price === null) disabledReason = "\u0642\u06CC\u0645\u062A \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631 \u062A\u0639\u06CC\u06CC\u0646 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A";
    else if (price <= 0) disabledReason = "\u0642\u06CC\u0645\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A";
    else if (remaining2 === 0) disabledReason = "\u0633\u0642\u0641 \u062E\u0631\u06CC\u062F \u0627\u06CC\u0646 \u062F\u0648\u0631\u0647 \u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F\u0647 \u0627\u0633\u062A";
    else if (price > nation.treasury) disabledReason = "\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A";
    items.push({
      templateId: Number(r.templateId),
      code: String(r.code),
      nameFa: String(r.nameFa),
      unitFa: String(r.unitFa),
      description: String(r.description ?? ""),
      price,
      ownedQuantity: owned,
      purchasable: disabledReason === null,
      disabledReason,
      purchaseLimitPerCycle: limit,
      boughtThisCycle,
      remainingThisCycle: remaining2,
      attackPoints: r.attackPoints === null || r.attackPoints === void 0 ? null : Number(r.attackPoints),
      defensePoints: r.defensePoints === null || r.defensePoints === void 0 ? null : Number(r.defensePoints),
      maintenancePerUnit: r.maintenancePerUnit === null || r.maintenancePerUnit === void 0 ? null : Number(r.maintenancePerUnit)
    });
  }
  return {
    category: {
      key: category.key,
      labelFa: category.labelFa,
      shopLabelFa: category.shopLabelFa,
      emoji: category.emoji,
      role: category.role,
      sortOrder: Number(category.sortOrder),
      itemCount: items.length,
      purchasableCount: items.filter((i) => i.purchasable).length
    },
    items
  };
}
async function currentCycleWindow(db, nation, settings) {
  const override = await db.first(
    sql`SELECT income_cycle_seconds FROM nation_settings WHERE nation_id = ${nation.id}`
  );
  const cycle = Math.max(60, override?.income_cycle_seconds ?? settings.economy.incomeCycleSeconds);
  const completed = Math.max(0, Math.floor((nowSeconds() - nation.income_anchor_at) / cycle));
  return { from: nation.income_anchor_at + completed * cycle, to: nation.income_anchor_at + (completed + 1) * cycle };
}
async function boughtInWindow(db, nationId, templateId, window) {
  const row = await db.first(
    sql`SELECT COALESCE(SUM(ti.quantity), 0) AS c
          FROM transaction_items ti
          JOIN transactions t ON t.id = ti.transaction_id
         WHERE t.nation_id = ${nationId} AND t.type = 'purchase'
           AND ti.template_id = ${templateId}
           AND t.created_at >= ${window.from} AND t.created_at < ${window.to}`
  );
  return Number(row?.c ?? 0);
}
async function purchase(db, nation, input, settings, actor, botToken) {
  if (!settings.features.shopEnabled) throw ApiError.disabled("\u0641\u0631\u0648\u0634\u06AF\u0627\u0647");
  if (nation.status !== "active") throw ApiError.forbidden("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0627\u0645\u06A9\u0627\u0646 \u062E\u0631\u06CC\u062F \u0646\u062F\u0627\u0631\u062F.");
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw ApiError.validation("\u062A\u0639\u062F\u0627\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (input.quantity > 1e5) throw ApiError.validation("\u062D\u062F\u0627\u06A9\u062B\u0631 \u062A\u0639\u062F\u0627\u062F \u062F\u0631 \u0647\u0631 \u062E\u0631\u06CC\u062F \u06F1\u06F0\u06F0,\u06F0\u06F0\u06F0 \u0639\u062F\u062F \u0627\u0633\u062A.");
  const tpl = await db.first(
    sql`SELECT t.id, t.code, t.name_fa, t.unit_fa, t.price, t.is_for_sale, t.is_active, t.purchase_limit_per_cycle,
               t.maintenance_per_unit, c.label_fa AS category_label, c.key AS category_key
          FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
         WHERE t.id = ${input.templateId}`
  );
  if (!tpl) throw ApiError.notFound("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (Number(tpl.is_active) !== 1) throw ApiError.forbidden("\u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A.");
  if (Number(tpl.is_for_sale) !== 1) throw ApiError.forbidden("\u0641\u0631\u0648\u0634 \u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0645\u062A\u0648\u0642\u0641 \u0634\u062F\u0647 \u0627\u0633\u062A.");
  const unitPrice = tpl.price === null || tpl.price === void 0 ? null : Number(tpl.price);
  if (unitPrice === null) {
    throw ApiError.validation(`\u0642\u06CC\u0645\u062A \xAB${tpl.name_fa}\xBB \u0647\u0646\u0648\u0632 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631 \u062A\u0639\u06CC\u06CC\u0646 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u062E\u0631\u06CC\u062F \u0622\u0646 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A.`);
  }
  if (!(unitPrice > 0)) throw ApiError.validation("\u0642\u06CC\u0645\u062A \u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A (\u0635\u0641\u0631 \u06CC\u0627 \u0645\u0646\u0641\u06CC).");
  const limit = tpl.purchase_limit_per_cycle === null || tpl.purchase_limit_per_cycle === void 0 ? null : Number(tpl.purchase_limit_per_cycle);
  if (limit) {
    const window = await currentCycleWindow(db, nation, settings);
    const already = await boughtInWindow(db, nation.id, input.templateId, window);
    if (already + input.quantity > limit) {
      throw ApiError.validation(`\u0633\u0642\u0641 \u062E\u0631\u06CC\u062F \u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u062F\u0631 \u0647\u0631 \u062F\u0648\u0631\u0647 ${limit} \u0639\u062F\u062F \u0627\u0633\u062A (\u062A\u0627\u06A9\u0646\u0648\u0646 ${already} \u062E\u0631\u06CC\u062F \u0634\u062F\u0647).`);
    }
  }
  const totalCost = unitPrice * input.quantity;
  if (totalCost > nation.treasury) {
    throw ApiError.insufficientFunds(
      `\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A. \u0647\u0632\u06CC\u0646\u0647: ${totalCost.toLocaleString("en-US")} \u0633\u06A9\u0647 \u2014 \u0645\u0648\u062C\u0648\u062F\u06CC: ${nation.treasury.toLocaleString("en-US")} \u0633\u06A9\u0647.`,
      { required: totalCost, available: nation.treasury }
    );
  }
  const key = purchaseIdempotencyKey(nation.id, input.idempotencyKey);
  const txUuid = uuid();
  const now = nowSeconds();
  const maintenancePerUnit = tpl.maintenance_per_unit === null || tpl.maintenance_per_unit === void 0 ? 0 : Number(tpl.maintenance_per_unit);
  try {
    await db.batch([
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                     idempotency_key, reference_type, reference_id, reason, created_by_user_id, meta, created_at)
           VALUES (${txUuid}, ${nation.id}, 'purchase', ${-totalCost}, ${nation.treasury}, ${nation.treasury - totalCost}, 'coin',
                   ${key}, 'equipment_template', ${input.templateId}, 'خرید تجهیزات', ${actor.userId},
                   ${JSON.stringify({ templateId: input.templateId, quantity: input.quantity, unitPrice })}, ${now})`,
      sql`INSERT INTO transaction_items (transaction_id, template_id, name_snapshot, category_snapshot, quantity, unit_price, total_price, created_at)
           VALUES (
             (SELECT id FROM transactions WHERE idempotency_key = ${key}),
             ${input.templateId}, ${String(tpl.name_fa)}, ${String(tpl.category_key)}, ${input.quantity}, ${unitPrice}, ${totalCost}, ${now})`,
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nation.id}, ${input.templateId}, ${input.quantity}, ${now}, ${now})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${input.quantity}, updated_at = ${now}`,
      sql`UPDATE nations SET treasury = treasury - ${totalCost}, updated_at = ${now} WHERE id = ${nation.id}`,
      sql`UPDATE nation_economy SET total_spent = total_spent + ${totalCost}, updated_at = ${now} WHERE nation_id = ${nation.id}`
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (isDuplicateKeyError(message, "idempotency_key") || isDuplicateKeyError(message, "sqlite_autoindex")) {
      const existing = await db.first(
        sql`SELECT t.id, t.uuid, t.amount, t.balance_after, ti.quantity, ti.unit_price, ti.total_price
               FROM transactions t JOIN transaction_items ti ON ti.transaction_id = t.id
              WHERE t.idempotency_key = ${key} LIMIT 1`
      );
      if (existing) {
        return {
          duplicate: true,
          transactionId: Number(existing.id),
          transactionUuid: String(existing.uuid),
          templateId: input.templateId,
          nameFa: String(tpl.name_fa),
          quantity: Number(existing.quantity),
          unitPrice: Number(existing.unit_price ?? unitPrice),
          totalCost: Math.abs(Number(existing.amount)),
          treasuryBefore: Number(existing.balance_after) + Math.abs(Number(existing.amount)),
          treasuryAfter: Number(existing.balance_after),
          newQuantity: await quantityOf(db, nation.id, input.templateId),
          maintenanceImpact: 0
        };
      }
      throw ApiError.conflict("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062A\u06A9\u0631\u0627\u0631\u06CC \u0631\u062F \u0634\u062F\u061B \u0646\u062A\u06CC\u062C\u0647 \u062E\u0631\u06CC\u062F \u0642\u0628\u0644\u06CC \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A.");
    }
    if (message.toLowerCase().includes("check constraint")) {
      throw ApiError.insufficientFunds("\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u062E\u0631\u06CC\u062F \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A (\u0645\u0645\u0646\u0648\u0639\u06CC\u062A \u0645\u0648\u062C\u0648\u062F\u06CC \u0645\u0646\u0641\u06CC).");
    }
    throw err;
  }
  const after = await db.first(
    sql`SELECT n.treasury AS treasury,
               (SELECT t.id FROM transactions t WHERE t.idempotency_key = ${key}) AS tx_id
          FROM nations n WHERE n.id = ${nation.id}`
  );
  const treasuryAfter = Number(after?.treasury ?? nation.treasury - totalCost);
  await refreshNationStats(db, { ...nation, treasury: treasuryAfter }, settings);
  await audit(db, {
    actor: { userId: actor.userId, telegramId: actor.telegramId },
    action: "shop.purchase",
    targetType: "nation",
    targetId: nation.id,
    after: { templateId: input.templateId, code: tpl.code, quantity: input.quantity, unitPrice, totalCost },
    reason: "marketplace"
  });
  await notify(db, {
    nationId: nation.id,
    kind: "purchase",
    title: "\u2705 \u062E\u0631\u06CC\u062F \u0627\u0646\u062C\u0627\u0645 \u0634\u062F",
    body: `${input.quantity.toLocaleString("en-US")} \xD7 ${tpl.name_fa} \u0628\u0631\u0627\u06CC ${nation.name} \u062E\u0631\u06CC\u062F\u0627\u0631\u06CC \u0634\u062F (${totalCost.toLocaleString("en-US")} \u0633\u06A9\u0647).`,
    telegram: botToken ? { botToken, chatId: actor.telegramId, text: `\u2705 \u062E\u0631\u06CC\u062F \u0645\u0648\u0641\u0642
${input.quantity} \u0639\u062F\u062F ${tpl.name_fa}
\u0647\u0632\u06CC\u0646\u0647: ${totalCost.toLocaleString("en-US")} \u0633\u06A9\u0647` } : null
  });
  return {
    duplicate: false,
    transactionId: Number(after?.tx_id ?? 0),
    transactionUuid: txUuid,
    templateId: input.templateId,
    nameFa: String(tpl.name_fa),
    quantity: input.quantity,
    unitPrice,
    totalCost,
    treasuryBefore: nation.treasury,
    treasuryAfter,
    newQuantity: await quantityOf(db, nation.id, input.templateId),
    maintenanceImpact: maintenancePerUnit * input.quantity
  };
}
function isDuplicateKeyError(message, indexName) {
  const m = message.toLowerCase();
  return (m.includes("unique") || m.includes("constraint failed")) && (m.includes(indexName) || m.includes("transactions"));
}
async function quantityOf(db, nationId, templateId) {
  const row = await db.first(
    sql`SELECT quantity FROM nation_inventory WHERE nation_id = ${nationId} AND template_id = ${templateId}`
  );
  return Number(row?.quantity ?? 0);
}
async function inventoryView(db, nationId, settings) {
  const rows = await loadInventory(db, nationId);
  const grouped = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const bucket = grouped.get(r.categoryKey) ?? { labelFa: r.categoryLabelFa, emoji: r.emoji, items: [], total: 0 };
    bucket.items.push({
      inventoryId: r.id,
      templateId: r.templateId,
      code: r.code,
      nameFa: r.nameFa,
      quantity: r.quantity,
      unitFa: r.unitFa,
      price: r.price,
      attackPoints: r.attackPoints,
      defensePoints: r.defensePoints,
      description: r.description,
      purchasable: Number(r.is_for_sale) === 1 && r.price !== null,
      updatedAt: toIso(r.updated_at)
    });
    bucket.total += r.quantity;
    grouped.set(r.categoryKey, bucket);
  }
  return [...grouped.entries()].map(([key, v]) => ({ categoryKey: key, labelFa: v.labelFa, emoji: v.emoji, total: v.total, items: v.items }));
}

// apps/worker/src/api/routes/player.ts
init_notificationService();
init_src();

// apps/worker/src/services/dailyPrizeService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_queries();
init_notificationService();
var WEIGHTS = {
  aster30_10: 10,
  soldiers_500: 18,
  su57_5: 8,
  nimitz_1: 5,
  df41_2: 6,
  coins_5000: 25,
  coins_800: 28
};
var PRIZES = [
  { key: "aster30_10", emoji: "\u{1F6E1}\uFE0F", labelFa: "\u06F1\u06F0 \u067E\u062F\u0627\u0641\u0646\u062F Aster 30", weight: WEIGHTS.aster30_10, kind: "equipment", qty: 10, templateCode: "aster_30" },
  { key: "soldiers_500", emoji: "\u{1FA96}", labelFa: "\u06F5\u06F0\u06F0 \u0633\u0631\u0628\u0627\u0632 \u062A\u06A9\u0627\u0648\u0631", weight: WEIGHTS.soldiers_500, kind: "equipment", qty: 500, templateCode: "rangers" },
  { key: "su57_5", emoji: "\u2708\uFE0F", labelFa: "\u06F5 \u062C\u0646\u06AF\u0646\u062F\u0647 SU-57", weight: WEIGHTS.su57_5, kind: "equipment", qty: 5, templateCode: "su57" },
  { key: "nimitz_1", emoji: "\u{1F6A2}", labelFa: "\u06F1 \u0646\u0627\u0648 \u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0628\u0631 Nimitz", weight: WEIGHTS.nimitz_1, kind: "equipment", qty: 1, templateCode: "nimitz" },
  { key: "df41_2", emoji: "\u{1F680}", labelFa: "\u06F2 \u0645\u0648\u0634\u06A9 DF-41", weight: WEIGHTS.df41_2, kind: "equipment", qty: 2, templateCode: "df41" },
  { key: "coins_5000", emoji: "\u{1F4B0}", labelFa: "\u06F5\u06F0\u06F0\u06F0 \u0633\u06A9\u0647", weight: WEIGHTS.coins_5000, kind: "coins", amount: 5e3 },
  { key: "coins_800", emoji: "\u{1F4B0}", labelFa: "\u06F8\u06F0\u06F0 \u0633\u06A9\u0647", weight: WEIGHTS.coins_800, kind: "coins", amount: 800 }
];
function publicPrizes() {
  return PRIZES.map(({ key, emoji, labelFa, kind }) => ({ key, emoji, labelFa, kind }));
}
function publicPrize(key) {
  const found = PRIZES.find((p) => p.key === key);
  if (found) {
    const { key: k, emoji, labelFa, kind } = found;
    return { key: k, emoji, labelFa, kind };
  }
  const shared = DAILY_PRIZES.find((p) => p.key === key);
  return shared ? { key: shared.key, emoji: shared.emoji, labelFa: shared.labelFa, kind: shared.kind } : { key, emoji: "\u{1F381}", labelFa: key, kind: "coins" };
}
function pickPrize(rng = Math.random) {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let roll = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON) * total;
  for (const prize of PRIZES) {
    roll -= prize.weight;
    if (roll < 0) return prize;
  }
  return PRIZES[PRIZES.length - 1];
}
async function prizeState(db, nationId) {
  const day = dayKey(nowSeconds());
  const row = await db.first(
    sql`SELECT prize_key FROM daily_prize_claims WHERE nation_id = ${nationId} AND day = ${day}`
  );
  return { day, claimed: !!row, prize: row ? publicPrize(String(row.prize_key)) : null };
}
async function claimDailyPrize(db, nation, settings, deps = {}) {
  const at = nowSeconds();
  const day = dayKey(at);
  const existing = await db.first(
    sql`SELECT prize_key FROM daily_prize_claims WHERE nation_id = ${nation.id} AND day = ${day}`
  );
  if (existing) return { alreadyClaimed: true, day, prize: publicPrize(String(existing.prize_key)) };
  const prize = pickPrize(deps.rng ?? Math.random);
  let template = null;
  if (prize.kind === "equipment") {
    template = await db.first(
      sql`SELECT id, name_fa FROM equipment_templates WHERE code = ${prize.templateCode} AND is_active = 1`
    );
    if (!template) {
      throw ApiError.conflict("\u0627\u06CC\u0646 \u062C\u0627\u06CC\u0632\u0647 \u0641\u0639\u0644\u0627\u064B \u062F\u0631 \u062F\u0633\u062A\u0631\u0633 \u0646\u06CC\u0633\u062A\u061B \u0644\u0637\u0641\u0627\u064B \u0628\u0639\u062F\u0627\u064B \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.");
    }
  }
  const txKey = `prize:${nation.id}:${day}`;
  const balanceBefore = nation.treasury;
  const stmts = [];
  if (prize.kind === "coins") {
    const amount = prize.amount;
    stmts.push(
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reason, created_at)
           VALUES (${uuid()}, ${nation.id}, 'prize', ${amount}, ${balanceBefore}, ${balanceBefore + amount}, 'coin',
                   ${txKey}, 'prize', 'جایزه شانسی روزانه', ${at})`,
      sql`UPDATE nations SET treasury = treasury + ${amount}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`UPDATE nation_economy SET total_income = total_income + ${amount}, updated_at = ${at} WHERE nation_id = ${nation.id}`
    );
  } else {
    stmts.push(
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity)
           VALUES (${nation.id}, ${template.id}, ${prize.qty})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + excluded.quantity, updated_at = ${at}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key,
                                    reference_type, reason, created_at)
           VALUES (${uuid()}, ${nation.id}, 'prize', 0, ${balanceBefore}, ${balanceBefore}, 'coin',
                   ${txKey}, 'prize', ${`\u062C\u0627\u06CC\u0632\u0647 \u0634\u0627\u0646\u0633\u06CC \u0631\u0648\u0632\u0627\u0646\u0647 \u2014 ${prize.labelFa}`}, ${at})`
    );
  }
  stmts.push(sql`INSERT INTO daily_prize_claims (nation_id, day, prize_key, created_at) VALUES (${nation.id}, ${day}, ${prize.key}, ${at})`);
  try {
    await db.batch(stmts);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("unique")) {
      const winner = await db.first(
        sql`SELECT prize_key FROM daily_prize_claims WHERE nation_id = ${nation.id} AND day = ${day}`
      );
      if (winner) return { alreadyClaimed: true, day, prize: publicPrize(String(winner.prize_key)) };
    }
    throw err;
  }
  await refreshNationStats(db, { ...nation, treasury: prize.kind === "coins" ? balanceBefore + prize.amount : balanceBefore }, settings);
  const owner = await db.first(
    sql`SELECT u.telegram_user_id FROM nations n JOIN users u ON u.id = n.owner_user_id WHERE n.id = ${nation.id}`
  );
  await notify(db, {
    nationId: nation.id,
    kind: "prize",
    title: "\u{1F381} \u062C\u0627\u06CC\u0632\u0647 \u0634\u0627\u0646\u0633\u06CC \u0631\u0648\u0632\u0627\u0646\u0647",
    body: `\u062A\u0628\u0631\u06CC\u06A9! \xAB${prize.labelFa}\xBB \u0628\u0647 \u062F\u0627\u0631\u0627\u06CC\u06CC \u0634\u0645\u0627 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F.`,
    telegram: deps.botToken && owner ? { botToken: deps.botToken, chatId: Number(owner.telegram_user_id), text: `\u{1F381} \u062A\u0628\u0631\u06CC\u06A9! \xAB${prize.labelFa}\xBB \u0628\u0647 \u062F\u0627\u0631\u0627\u06CC\u06CC \u0634\u0645\u0627 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F.` } : null
  });
  return { alreadyClaimed: false, day, prize: publicPrize(prize.key) };
}

// apps/worker/src/services/bankService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_queries();
init_auditService();
init_notificationService();
async function pendingIncome(db, nation, settings, now = nowSeconds()) {
  const override = await db.first(
    sql`SELECT income_cycle_seconds FROM nation_settings WHERE nation_id = ${nation.id}`
  );
  const cycleSeconds = Math.max(60, override?.income_cycle_seconds ?? settings.economy.incomeCycleSeconds);
  const due = completedCycleIndex(nation.income_anchor_at, cycleSeconds, now);
  const lastCredited = Number(nation.last_income_cycle ?? -1);
  const cycles = Math.max(0, due - lastCredited);
  if (cycles <= 0) return { cycles: 0, amount: 0, netPerCycle: 0, cycleSeconds };
  const computed = await computeNation(db, nation, settings);
  const rawNet = computed.income.netIncome;
  let sim = nation.treasury;
  let total = 0;
  for (let i = 0; i < cycles; i++) {
    let net = rawNet;
    if (net < 0) net = -Math.min(-net, sim);
    sim += net;
    total += net;
  }
  return { cycles, amount: total, netPerCycle: rawNet, cycleSeconds };
}
async function claimIncome(db, nation, settings, now = nowSeconds()) {
  let current = nation;
  let cycles = 0;
  let total = 0;
  for (let i = 0; i < 240; i++) {
    const res = await creditCycle(db, current, settings, now);
    if (res.status === "credited") {
      cycles++;
      total += res.net;
      current = await loadNation(db, nation.id);
      continue;
    }
    if (res.status === "skipped") {
      current = await loadNation(db, nation.id);
      continue;
    }
    break;
  }
  return { cycles, total, treasury: current.treasury };
}
async function activeLoan(db, nationId) {
  return db.first(sql`SELECT * FROM nation_loans WHERE nation_id = ${nationId} AND status = 'active'`);
}
async function bankState(db, nation, settings, now = nowSeconds()) {
  const [pending, loan] = await Promise.all([pendingIncome(db, nation, settings, now), activeLoan(db, nation.id)]);
  const daysLeft = loan ? Math.ceil((Number(loan.due_at) - now) / 86400) : null;
  return {
    treasury: nation.treasury,
    pendingIncome: pending,
    activeLoan: loan ? {
      principal: Number(loan.principal),
      repayAmount: Number(loan.repay_amount),
      interestRate: Number(loan.interest_rate),
      createdAt: toIso(Number(loan.created_at)),
      dueAt: toIso(Number(loan.due_at)),
      daysLeft,
      overdue: now > Number(loan.due_at)
    } : null,
    loanOptions: BANK_LOAN.options.map((principal) => ({
      principal,
      interestRate: BANK_LOAN.interestRate,
      repayAmount: principal + Math.round(principal * BANK_LOAN.interestRate),
      termDays: BANK_LOAN.termDays
    })),
    canTakeLoan: !loan
  };
}
async function takeLoan(db, nation, principal, now = nowSeconds()) {
  const allowed = BANK_LOAN.options.find((o) => o === principal);
  if (!allowed) throw ApiError.validation("\u0645\u0628\u0644\u063A \u0648\u0627\u0645 \u0645\u0646\u062A\u062E\u0628 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const repayAmount = allowed + Math.round(allowed * BANK_LOAN.interestRate);
  const existing = await activeLoan(db, nation.id);
  if (existing) throw ApiError.conflict("\u0634\u0645\u0627 \u06CC\u06A9 \u0648\u0627\u0645 \u0641\u0639\u0627\u0644 \u062F\u0627\u0631\u06CC\u062F\u061B \u062A\u0627 \u062A\u0633\u0648\u06CC\u0647 \u0622\u0646 \u0627\u0645\u06A9\u0627\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u062C\u062F\u06CC\u062F \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F.");
  const at = now;
  const dueAt = at + BANK_LOAN.termDays * 86400;
  const idempotencyKey = `loan:${nation.id}:${uuid().slice(0, 12)}`;
  try {
    await db.batch([
      sql`INSERT INTO nation_loans (nation_id, principal, interest_rate, repay_amount, status, created_at, due_at)
           VALUES (${nation.id}, ${allowed}, ${BANK_LOAN.interestRate}, ${repayAmount}, 'active', ${at}, ${dueAt})`,
      sql`UPDATE nations SET treasury = treasury + ${allowed}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${uuid()}, ${nation.id}, 'loan_disbursement', ${allowed}, ${nation.treasury}, ${nation.treasury + allowed}, 'coin',
                   ${idempotencyKey}, 'nation_loan',
                   (SELECT id FROM nation_loans WHERE nation_id = ${nation.id} AND status = 'active' ORDER BY id DESC LIMIT 1),
                   ${`\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC ${allowed.toLocaleString("en-US")} \u0633\u06A9\u0647\u200C\u0627\u06CC`},
                   ${JSON.stringify({ principal: allowed, interestRate: BANK_LOAN.interestRate, repayAmount, dueAt })}, ${at})`,
      sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
           VALUES (${nation.id}, ${dayKey(at)},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), 0,
                   (SELECT military_power FROM nations WHERE id = ${nation.id}),
                   (SELECT equipment_count FROM nations WHERE id = ${nation.id}), ${at})
           ON CONFLICT (nation_id, day) DO UPDATE SET treasury = excluded.treasury`
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed/i.test(message)) {
      throw ApiError.conflict("\u0634\u0645\u0627 \u06CC\u06A9 \u0648\u0627\u0645 \u0641\u0639\u0627\u0644 \u062F\u0627\u0631\u06CC\u062F\u061B \u062A\u0627 \u062A\u0633\u0648\u06CC\u0647 \u0622\u0646 \u0627\u0645\u06A9\u0627\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u062C\u062F\u06CC\u062F \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F.");
    }
    throw err;
  }
  const after = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor: null,
    action: "bank.take_loan",
    targetType: "nation",
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), principal: allowed, dueAt },
    reason: "\u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC"
  });
  await notify(db, {
    nationId: nation.id,
    kind: "bank",
    title: "\u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F",
    body: `\u0648\u0627\u0645 ${allowed.toLocaleString("en-US")} \u0633\u06A9\u0647\u200C\u0627\u06CC \u0628\u0647 \u062E\u0632\u0627\u0646\u0647 \u0648\u0627\u0631\u06CC\u0632 \u0634\u062F. \u0645\u0628\u0644\u063A \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A ${repayAmount.toLocaleString("en-US")} \u0633\u06A9\u0647 (\u0633\u0648\u062F \u06F1\u06F0\u066A) \u062A\u0627 ${new Date(dueAt * 1e3).toISOString().slice(0, 10)}.`
  });
  return { principal: allowed, repayAmount, dueAt, treasury: Number(after?.treasury ?? nation.treasury + allowed) };
}
async function repayLoan(db, nation, now = nowSeconds(), partial) {
  const loan = await activeLoan(db, nation.id);
  if (!loan) throw ApiError.validation("\u0648\u0627\u0645\u06CC \u0628\u0631\u0627\u06CC \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0646\u062F\u0627\u0631\u06CC\u062F.");
  const fullAmount = Number(loan.repay_amount);
  const repayAmount = partial === void 0 ? fullAmount : Math.floor(Number(partial));
  if (!Number.isFinite(repayAmount) || repayAmount <= 0) throw ApiError.validation("\u0645\u0628\u0644\u063A \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (repayAmount > fullAmount) throw ApiError.validation("\u0645\u0628\u0644\u063A \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0628\u06CC\u0634\u062A\u0631 \u0627\u0632 \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647\u0654 \u0628\u062F\u0647\u06CC \u0627\u0633\u062A.");
  if (nation.treasury < repayAmount) {
    throw ApiError.validation(`\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 (${nation.treasury.toLocaleString("en-US")} \u0633\u06A9\u0647) \u0628\u0631\u0627\u06CC \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0648\u0627\u0645 (${repayAmount.toLocaleString("en-US")} \u0633\u06A9\u0647) \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.`);
  }
  const isPartial = repayAmount < fullAmount;
  const at = now;
  const idempotencyKey = isPartial ? `loan-repay:${loan.id}:${at}:${repayAmount}` : `loan-repay:${loan.id}`;
  try {
    await db.batch([
      isPartial ? sql`UPDATE nation_loans SET repay_amount = repay_amount - ${repayAmount} WHERE id = ${loan.id} AND status = 'active' AND repay_amount >= ${repayAmount}` : sql`UPDATE nation_loans SET status = 'repaid', repaid_at = ${at} WHERE id = ${loan.id} AND status = 'active'`,
      sql`UPDATE nations SET treasury = treasury - ${repayAmount}, updated_at = ${at} WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${uuid()}, ${nation.id}, 'loan_repayment', ${-repayAmount}, ${nation.treasury}, ${nation.treasury - repayAmount}, 'coin',
                   ${idempotencyKey}, 'nation_loan', ${loan.id},
                   ${`\u062A\u0633\u0648\u06CC\u0647 \u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC ${Number(loan.principal).toLocaleString("en-US")} \u0633\u06A9\u0647\u200C\u0627\u06CC (\u0633\u0648\u062F \u06F1\u06F0\u066A)`},
                   ${JSON.stringify({ principal: Number(loan.principal), interestRate: Number(loan.interest_rate), repayAmount })}, ${at})`,
      sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
           VALUES (${nation.id}, ${dayKey(at)},
                   (SELECT treasury FROM nations WHERE id = ${nation.id}), 0,
                   (SELECT military_power FROM nations WHERE id = ${nation.id}),
                   (SELECT equipment_count FROM nations WHERE id = ${nation.id}), ${at})
           ON CONFLICT (nation_id, day) DO UPDATE SET treasury = excluded.treasury`
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/UNIQUE constraint failed/i.test(message)) {
      throw ApiError.validation("\u0627\u06CC\u0646 \u0648\u0627\u0645 \u0642\u0628\u0644\u0627\u064B \u062A\u0633\u0648\u06CC\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A.");
    }
    if (message.toLowerCase().includes("check constraint")) {
      throw ApiError.validation("\u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0628\u0627\u0639\u062B \u0645\u0646\u0641\u06CC \u0634\u062F\u0646 \u062E\u0632\u0627\u0646\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A.");
    }
    throw err;
  }
  const after = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  await audit(db, {
    actor: null,
    action: "bank.repay_loan",
    targetType: "nation",
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: Number(after?.treasury ?? 0), repayAmount },
    reason: isPartial ? "\u067E\u0631\u062F\u0627\u062E\u062A \u062C\u0632\u0626\u06CC \u0628\u062F\u0647\u06CC \u0628\u0627\u0646\u06A9\u06CC" : "\u062A\u0633\u0648\u06CC\u0647 \u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC"
  });
  return { repayAmount, partial: isPartial, remaining: isPartial ? fullAmount - repayAmount : 0, treasury: Number(after?.treasury ?? nation.treasury - repayAmount) };
}
async function listLoans(db, nationId, limit = 20) {
  const rows = await db.all(
    sql`SELECT id, principal, repay_amount, interest_rate, status, created_at, due_at, repaid_at
          FROM nation_loans WHERE nation_id = ${nationId} ORDER BY id DESC LIMIT ${Math.min(50, Math.max(1, limit))}`
  );
  return {
    loans: rows.map((r) => ({
      id: Number(r.id),
      principal: Number(r.principal),
      repayAmount: Number(r.repay_amount),
      interestRate: Number(r.interest_rate),
      status: String(r.status),
      statusLabelFa: String(r.status) === "active" ? "\u0641\u0639\u0627\u0644" : String(r.status) === "repaid" ? "\u062A\u0633\u0648\u06CC\u0647\u200C\u0634\u062F\u0647" : String(r.status),
      createdAt: toIso(Number(r.created_at)),
      dueAt: toIso(Number(r.due_at)),
      repaidAt: r.repaid_at ? toIso(Number(r.repaid_at)) : null
    }))
  };
}

// apps/worker/src/services/buildService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_auditService();
init_notificationService();
function buildSpeed(env) {
  const raw2 = Number(env?.BUILD_SPEED ?? "1");
  if (!Number.isFinite(raw2) || raw2 < 0) return 1;
  return Math.min(raw2, 100);
}
var BUILDING_BY_KEY = new Map(BUILDINGS.map((b) => [b.key, b]));
function barracksCapacity(level) {
  return 2 + level;
}
function upgradeCost(baseCost, currentLevel) {
  return Math.max(1, Math.ceil(baseCost * BUILDING_UPGRADE_COST_FACTOR * currentLevel));
}
function projectHash(nationId, key, kind, level) {
  return `build:${nationId}:${key}:${kind}:${level}`;
}
async function sweepBuildProjects(db, nationId, now = nowSeconds()) {
  const due = await db.all(
    sql`SELECT id, building_key, kind, level, cost FROM nation_build_projects
         WHERE nation_id = ${nationId} AND completes_at <= ${now}
         ORDER BY completes_at ASC`
  );
  for (const project of due) {
    const building = BUILDING_BY_KEY.get(project.building_key);
    if (!building) {
      await db.run(sql`DELETE FROM nation_build_projects WHERE id = ${project.id}`);
      continue;
    }
    const at = now;
    const statements = [
      sql`INSERT INTO nation_buildings (nation_id, building_key, built_at, level)
           VALUES (${nationId}, ${building.key}, ${at}, ${project.level})
           ON CONFLICT (nation_id, building_key) DO UPDATE SET level = ${project.level}`,
      sql`DELETE FROM nation_build_projects WHERE id = ${project.id}`
    ];
    if (building.grant.kind === "units") {
      const template = await db.first(
        sql`SELECT id FROM equipment_templates WHERE code = ${building.grant.templateCode}`
      );
      if (template?.id) {
        statements.push(
          sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
               VALUES (${nationId}, ${template.id}, ${building.grant.quantity}, ${at}, ${at})
               ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${building.grant.quantity}, updated_at = ${at}`
        );
      }
    } else if (building.grant.kind === "fortification") {
      statements.push(
        sql`UPDATE nation_settings SET fortification_level = MIN(20, COALESCE(fortification_level, 0) + ${building.grant.quantity}), updated_at = ${at} WHERE nation_id = ${nationId}`
      );
    }
    await db.batch(statements);
    await audit(db, {
      actor: null,
      action: project.kind === "build" ? "build.complete" : "build.upgrade_complete",
      targetType: "nation",
      targetId: nationId,
      before: null,
      after: { building: building.key, level: project.level, cost: project.cost },
      reason: project.kind === "build" ? `\u0633\u0627\u062E\u062A ${building.nameFa}` : `\u0627\u0631\u062A\u0642\u0627\u06CC ${building.nameFa} \u0628\u0647 \u0633\u0637\u062D ${project.level}`
    });
    await notify(db, {
      nationId,
      kind: "build",
      title: project.kind === "build" ? "\u{1F3D7}\uFE0F \u0633\u0627\u0632\u0647 \u0633\u0627\u062E\u062A\u0647 \u0634\u062F" : "\u23EB \u0627\u0631\u062A\u0642\u0627\u06CC \u0633\u0627\u0632\u0647 \u06A9\u0627\u0645\u0644 \u0634\u062F",
      body: project.kind === "build" ? `${building.emoji} ${building.nameFa} \u062A\u06A9\u0645\u06CC\u0644 \u0634\u062F (\u0633\u0637\u062D ${project.level}).` : `${building.emoji} ${building.nameFa} \u0628\u0647 \u0633\u0637\u062D ${project.level} \u0627\u0631\u062A\u0642\u0627 \u06CC\u0627\u0641\u062A.`
    });
  }
  return due.length;
}
async function activeProjects(db, nationId) {
  return db.all(
    sql`SELECT id, building_key, kind, level, cost, started_at, completes_at
          FROM nation_build_projects WHERE nation_id = ${nationId} ORDER BY completes_at ASC`
  );
}
async function buildState(db, nation, now = nowSeconds()) {
  await sweepBuildProjects(db, nation.id, now);
  const [rows, projects] = await Promise.all([
    db.all(
      sql`SELECT building_key, built_at, COALESCE(level, 1) AS level FROM nation_buildings WHERE nation_id = ${nation.id}`
    ),
    activeProjects(db, nation.id)
  ]);
  const built = new Map(rows.map((r) => [String(r.building_key), { builtAt: Number(r.built_at), level: Number(r.level) || 1 }]));
  const projectByKey = new Map(projects.map((p) => [p.building_key, p]));
  const buildings = BUILDINGS.map((b) => {
    const row = built.get(b.key);
    const level = row?.level ?? 0;
    const isBuilt = Boolean(row);
    const atMax = isBuilt && level >= BUILDING_MAX_LEVEL;
    const nextAction = !isBuilt ? "build" : atMax ? "max" : "upgrade";
    const nextCost = !isBuilt ? b.cost : atMax ? 0 : upgradeCost(b.cost, level);
    const nextDurationSeconds = b.durationSeconds * (!isBuilt ? 1 : 0.5 + level * 0.5);
    const proj = projectByKey.get(b.key);
    return {
      key: b.key,
      emoji: b.emoji,
      nameFa: b.nameFa,
      descFa: b.descFa,
      cost: b.cost,
      built: isBuilt,
      builtAt: row ? toIso(row.builtAt) : null,
      level,
      nextAction,
      nextCost,
      nextDurationSeconds: Math.round(nextDurationSeconds),
      upgradeCost: isBuilt && !atMax ? upgradeCost(b.cost, level) : 0,
      grant: b.grant.kind === "units" ? { kind: "units", quantity: b.grant.quantity, templateCode: b.grant.templateCode } : { kind: "fortification", quantity: b.grant.quantity },
      capacityNow: b.key === "barracks" ? barracksCapacity(level) : null,
      capacityAfter: b.key === "barracks" ? barracksCapacity(level + 1) : null,
      activeProjectId: proj?.id ?? null
    };
  });
  const projectViews = projects.map((p) => {
    const b = BUILDING_BY_KEY.get(p.building_key);
    const total = Math.max(1, p.completes_at - p.started_at);
    const progress = Math.min(100, Math.max(0, Math.floor((now - p.started_at) / total * 100)));
    const remaining2 = Math.max(0, p.completes_at - now);
    return {
      id: p.id,
      buildingKey: p.building_key,
      emoji: b?.emoji ?? "\u{1F3D7}\uFE0F",
      nameFa: b?.nameFa ?? p.building_key,
      kind: p.kind,
      targetLevel: Number(p.level),
      cost: Number(p.cost),
      startedAt: toIso(p.started_at),
      completesAt: toIso(p.completes_at),
      progressPercent: progress,
      remainingSeconds: remaining2,
      remainingFa: humanDuration(remaining2),
      descFa: b?.descFa ?? ""
    };
  });
  return {
    treasury: nation.treasury,
    buildings,
    builtCount: buildings.filter((b) => b.built).length,
    totalCount: buildings.length,
    projects: projectViews,
    maxConcurrent: MAX_CONCURRENT_PROJECTS,
    activeProjectCount: projectViews.length,
    maxLevel: BUILDING_MAX_LEVEL
  };
}
async function construct(db, nation, key, now = nowSeconds(), speed = 1) {
  const building = BUILDING_BY_KEY.get(key);
  if (!building) throw ApiError.validation("\u0633\u0627\u0632\u0647\u0654 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  await sweepBuildProjects(db, nation.id, now);
  const existing = await db.first(
    sql`SELECT COALESCE(level, 1) AS level FROM nation_buildings WHERE nation_id = ${nation.id} AND building_key = ${building.key}`
  );
  const active = await db.all(
    sql`SELECT id FROM nation_build_projects WHERE nation_id = ${nation.id}`
  );
  const kind = existing ? "upgrade" : "build";
  const currentLevel = Number(existing?.level ?? 0);
  if (kind === "upgrade" && currentLevel >= BUILDING_MAX_LEVEL) {
    throw ApiError.conflict("\u0627\u06CC\u0646 \u0633\u0627\u0632\u0647 \u0628\u0647 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0633\u0637\u062D \u0645\u0645\u06A9\u0646 \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A.");
  }
  const sameBuildingActive = await db.first(
    sql`SELECT COUNT(*) AS c FROM nation_build_projects WHERE nation_id = ${nation.id} AND building_key = ${building.key}`
  );
  if (Number(sameBuildingActive?.c ?? 0) > 0) {
    throw ApiError.conflict("\u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0633\u0627\u0632\u0647 \u0647\u0645\u06CC\u0646 \u062D\u0627\u0644\u0627 \u067E\u0631\u0648\u0698\u0647\u200C\u0627\u06CC \u062F\u0631 \u062D\u0627\u0644 \u0627\u0646\u062C\u0627\u0645 \u0627\u0633\u062A.");
  }
  if (active.length >= MAX_CONCURRENT_PROJECTS) {
    throw ApiError.conflict(`\u062D\u062F\u0627\u06A9\u062B\u0631 ${MAX_CONCURRENT_PROJECTS} \u067E\u0631\u0648\u0698\u0647\u0654 \u0647\u0645\u200C\u0632\u0645\u0627\u0646 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F\u061B \u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u06CC\u06A9\u06CC \u062A\u06A9\u0645\u06CC\u0644 \u0634\u0648\u062F.`);
  }
  const targetLevel = kind === "build" ? 1 : currentLevel + 1;
  const cost = kind === "build" ? building.cost : upgradeCost(building.cost, currentLevel);
  if (nation.treasury < cost) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  const durationSeconds = Math.max(0, Math.round(building.durationSeconds * speed * (kind === "build" ? 1 : 0.5 + currentLevel * 0.5)));
  const projectId = uuid();
  const completesAt = now + durationSeconds;
  const statements = [
    sql`INSERT INTO nation_build_projects (id, nation_id, building_key, kind, level, cost, started_at, completes_at)
         VALUES (${projectId}, ${nation.id}, ${building.key}, ${kind}, ${targetLevel}, ${cost}, ${now}, ${completesAt})`,
    sql`UPDATE nations SET treasury = treasury - ${cost}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                  idempotency_key, reference_type, reference_id, reason, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, 'purchase', ${-cost}, ${nation.treasury}, ${nation.treasury - cost}, 'coin',
                 ${projectHash(nation.id, building.key, kind, targetLevel)}, 'building', NULL,
                 ${kind === "build" ? `\u{1F3D7}\uFE0F \u0633\u0627\u062E\u062A\u200C\u0648\u0633\u0627\u0632: ${building.nameFa}` : `\u23EB \u0627\u0631\u062A\u0642\u0627\u06CC \u0633\u0627\u0632\u0647: ${building.nameFa} \u2192 \u0633\u0637\u062D ${targetLevel}`},
                 ${JSON.stringify({ buildingKey: building.key, kind, targetLevel, durationSeconds })}, ${now})`,
    sql`UPDATE nation_economy SET total_spent = total_spent + ${cost}, updated_at = ${now} WHERE nation_id = ${nation.id}`
  ];
  try {
    await db.batch(statements);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("check constraint")) {
      throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
    }
    throw err;
  }
  if (durationSeconds === 0) {
    await sweepBuildProjects(db, nation.id, now);
  }
  if (durationSeconds > 0) {
    await audit(db, {
      actor: null,
      action: "build.project_started",
      targetType: "nation",
      targetId: nation.id,
      before: { treasury: nation.treasury },
      after: { treasury: nation.treasury - cost, building: building.key, kind, targetLevel, durationSeconds },
      reason: kind === "build" ? `\u0634\u0631\u0648\u0639 \u0633\u0627\u062E\u062A ${building.nameFa}` : `\u0634\u0631\u0648\u0639 \u0627\u0631\u062A\u0642\u0627\u06CC ${building.nameFa}`
    });
    await notify(db, {
      nationId: nation.id,
      kind: "build",
      title: kind === "build" ? "\u{1F3D7}\uFE0F \u067E\u0631\u0648\u0698\u0647 \u0633\u0627\u062E\u062A \u0622\u063A\u0627\u0632 \u0634\u062F" : "\u23EB \u0627\u0631\u062A\u0642\u0627\u06CC \u0633\u0627\u0632\u0647 \u0622\u063A\u0627\u0632 \u0634\u062F",
      body: `${building.emoji} ${building.nameFa} \u2014 \u0622\u0645\u0627\u062F\u0647\u200C\u0633\u0627\u0632\u06CC ${humanDuration(durationSeconds)} \u062F\u06CC\u06AF\u0631. \u0647\u0632\u06CC\u0646\u0647 ${cost.toLocaleString("en-US")} \u0633\u06A9\u0647 \u0627\u0632 \u062E\u0632\u0627\u0646\u0647 \u06A9\u0633\u0631 \u0634\u062F.`
    });
  }
  const after = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  return {
    building: { key: building.key, nameFa: building.nameFa, emoji: building.emoji },
    kind,
    level: targetLevel,
    cost,
    treasury: Number(after?.treasury ?? nation.treasury - cost),
    projectId,
    completesAt: toIso(completesAt),
    durationSeconds,
    completed: durationSeconds === 0
  };
}

// apps/worker/src/services/industryService.ts
init_sql();
init_errors2();
init_format();
init_ids();
init_auditService();
init_notificationService();

// apps/worker/src/services/coinSpend.ts
init_sql();
init_errors2();
init_format();
init_ids();
async function spendTreasury(db, nation, opts) {
  const amount = Math.max(0, Math.floor(opts.amount));
  const now = opts.now ?? nowSeconds();
  if (nation.treasury < amount) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  const key = `${opts.idempotencyPrefix ?? "spend"}:${nation.id}:${opts.referenceType}:${uuid()}`;
  try {
    await db.batch([
      sql`UPDATE nations SET treasury = treasury - ${amount}, updated_at = ${now} WHERE id = ${nation.id}`,
      sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                    idempotency_key, reference_type, reference_id, reason, meta, created_at)
           VALUES (${uuid()}, ${nation.id}, ${amount > 0 ? "purchase" : "revenue"}, ${-amount}, ${nation.treasury}, ${nation.treasury - amount}, 'coin',
                   ${key}, ${opts.referenceType}, NULL, ${opts.reason},
                   ${JSON.stringify(opts.meta ?? null)}, ${now})`,
      sql`UPDATE nation_economy SET total_spent = total_spent + ${amount}, updated_at = ${now} WHERE nation_id = ${nation.id}`
    ]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("check constraint")) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
    throw err;
  }
  return nation.treasury - amount;
}

// apps/worker/src/services/industryService.ts
var PRODUCT_GROUPS = [
  { key: "aircraft", labelFa: "\u0647\u0648\u0627\u067E\u06CC\u0645\u0627", emoji: "\u2708\uFE0F", categories: ["fighters", "transport_aircraft", "helicopters"] },
  { key: "missile", labelFa: "\u0645\u0648\u0634\u06A9", emoji: "\u{1F680}", categories: ["missiles"] },
  { key: "air_defense", labelFa: "\u0633\u0627\u0645\u0627\u0646\u0647 \u067E\u062F\u0627\u0641\u0646\u062F\u06CC", emoji: "\u{1F6E1}\uFE0F", categories: ["ground_air_defense", "air_air_defense", "naval_air_defense"] },
  { key: "armored", labelFa: "\u062E\u0648\u062F\u0631\u0648\u06CC \u0632\u0631\u0647\u06CC", emoji: "\u{1FA96}", categories: ["tanks", "apc"] },
  { key: "naval", labelFa: "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u062F\u0631\u06CC\u0627\u06CC\u06CC", emoji: "\u{1F6A2}", categories: ["ships", "submarines"] },
  { key: "ammo", labelFa: "\u0645\u0647\u0645\u0627\u062A", emoji: "\u{1F4A5}", categories: ["artillery", "rockets"] }
];
var ALL_PRODUCT_CATEGORIES = [...new Set(PRODUCT_GROUPS.flatMap((g) => g.categories))];
var PRODUCTION_COST_RATIO = 0.5;
var PRODUCTION_SECONDS_PER_UNIT = 120;
var FACTORY_MAX_LEVEL = 10;
function upgradeCostFor(price, level) {
  return Math.max(1, Math.ceil(Number(price ?? 2e6) * 0.5 * level));
}
async function sweepProductionOrders(db, nationId, now = nowSeconds()) {
  const res = await db.run(
    sql`UPDATE nation_production_orders SET status = 'ready'
         WHERE nation_id = ${nationId} AND status = 'in_progress' AND completes_at <= ${now}`
  );
  return Number(res?.changes ?? 0);
}
async function factoryRows(db, nationId) {
  return db.all(
    sql`SELECT t.id AS template_id, t.code, t.name_fa, i.quantity, t.price, t.income_per_cycle, l.level
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nationId} AND c.key = 'factories'`
  );
}
async function industryState(db, nation, now = nowSeconds()) {
  await sweepProductionOrders(db, nation.id, now);
  const rows = await factoryRows(db, nation.id);
  const factories = rows.map((r) => {
    const level = Math.max(1, Number(r.level ?? 1));
    const incomePerCycle = Math.max(0, Number(r.income_per_cycle ?? 0)) * level;
    const atMaxLevel = level >= FACTORY_MAX_LEVEL;
    return {
      templateId: Number(r.template_id),
      code: r.code,
      nameFa: r.name_fa,
      quantity: Number(r.quantity),
      level,
      incomePerCycle,
      incomePerDay: incomePerCycle,
      statusFa: "\u0641\u0639\u0627\u0644",
      upgradeCost: atMaxLevel ? null : upgradeCostFor(r.price, level),
      atMaxLevel
    };
  }).sort((a, b) => b.incomePerDay - a.incomePerDay);
  const factoryCount = factories.reduce((s, f) => s + f.quantity, 0);
  const productionCapacity = factories.reduce((s, f) => s + f.quantity * f.level, 0);
  const activeFactories = factories.filter((f) => f.quantity > 0).length;
  const maxFactoryLevel = factories.reduce((m, f) => Math.max(m, f.level), 1);
  const orders = await db.all(
    sql`SELECT o.id, o.product_key, o.template_id, t.name_fa AS template_name, t.category_id, c.key AS category_key,
               o.quantity, o.total_cost, o.started_at, o.completes_at, o.status
          FROM nation_production_orders o
          JOIN equipment_templates t ON t.id = o.template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE o.nation_id = ${nation.id} AND o.status IN ('in_progress','ready')
         ORDER BY o.completes_at ASC`
  );
  const inProgress = orders.filter((o) => o.status === "in_progress").map((o) => {
    const total = Math.max(1, Number(o.completes_at) - Number(o.started_at));
    const progress = Math.min(100, Math.max(0, Math.floor((now - Number(o.started_at)) / total * 100)));
    const remaining2 = Math.max(0, Number(o.completes_at) - now);
    return {
      id: o.id,
      productKey: o.product_key,
      templateId: Number(o.template_id),
      templateName: o.template_name,
      quantity: Number(o.quantity),
      totalCost: Number(o.total_cost),
      startedAt: toIso(Number(o.started_at)),
      completesAt: toIso(Number(o.completes_at)),
      progressPercent: progress,
      remainingSeconds: remaining2,
      remainingFa: humanDuration(remaining2)
    };
  });
  const readyToClaim = orders.filter((o) => o.status === "ready").map((o) => ({
    id: o.id,
    productKey: o.product_key,
    templateId: Number(o.template_id),
    templateName: o.template_name,
    quantity: Number(o.quantity),
    totalCost: Number(o.total_cost)
  }));
  const available = await db.all(
    sql`SELECT t.id, t.code, t.name_fa, t.price, c.key AS category_key
          FROM equipment_templates t
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE t.is_active = 1 AND c.key IN (${ALL_PRODUCT_CATEGORIES})`
  );
  const byCategory = /* @__PURE__ */ new Map();
  for (const t of available) {
    const price = t.price === null ? null : Number(t.price);
    const unitCost = price === null ? 0 : Math.max(1, Math.floor(price * PRODUCTION_COST_RATIO));
    const arr = byCategory.get(t.category_key) ?? [];
    arr.push({ templateId: Number(t.id), code: t.code, nameFa: t.name_fa, price, unitCost });
    byCategory.set(t.category_key, arr);
  }
  return {
    treasury: nation.treasury,
    factoryCount,
    activeFactories,
    factoryLines: factories.length,
    productionCapacity,
    maxFactoryLevel,
    productionSecondsPerUnit: PRODUCTION_SECONDS_PER_UNIT,
    productionCostRatio: PRODUCTION_COST_RATIO,
    factoryUpgradeFactor: 0.5,
    factories,
    products: PRODUCT_GROUPS.map((g) => ({
      key: g.key,
      labelFa: g.labelFa,
      emoji: g.emoji,
      templates: g.categories.flatMap((c) => byCategory.get(c) ?? [])
    })),
    inProgress,
    readyToClaim
  };
}
async function startProduction(db, nation, input, now = nowSeconds()) {
  await sweepProductionOrders(db, nation.id, now);
  const factoryRowsNow = await factoryRows(db, nation.id);
  const factoryCount = factoryRowsNow.reduce((s, r) => s + Number(r.quantity), 0);
  if (factoryCount < 1) {
    throw ApiError.conflict("\u0628\u0631\u0627\u06CC \u062A\u0648\u0644\u06CC\u062F \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u062F. \u0627\u0632 \xAB\u062E\u0631\u06CC\u062F \u06A9\u0627\u0631\u062E\u0627\u0646\u0647\xBB \u06CC\u0627 \u0633\u0648\u062F\u0627\u06AF\u0631\u0627\u0646 \u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0631\u0627 \u0628\u0633\u0627\u0632\u06CC\u062F.");
  }
  const maxFactoryLevel = factoryRowsNow.reduce((m, r) => Math.max(m, Math.max(1, Number(r.level ?? 1))), 1);
  const productionCapacity = factoryRowsNow.reduce((s, r) => s + Number(r.quantity) * Math.max(1, Number(r.level ?? 1)), 0);
  const quantity = Math.floor(Number(input.quantity));
  if (!Number.isFinite(quantity) || quantity < 1) throw ApiError.validation("\u062A\u0639\u062F\u0627\u062F \u0628\u0627\u06CC\u062F \u062F\u0633\u062A\u200C\u06A9\u0645 \u06F1 \u0628\u0627\u0634\u062F.");
  if (quantity > productionCapacity) throw ApiError.validation(`\u0638\u0631\u0641\u06CC\u062A \u062A\u0648\u0644\u06CC\u062F \u0634\u0645\u0627 ${productionCapacity} \u0648\u0627\u062D\u062F \u062F\u0631 \u0647\u0631 \u0633\u0641\u0627\u0631\u0634 \u0627\u0633\u062A (\u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0647\u0627 \xD7 \u0633\u0637\u0648\u062D\u0634\u0627\u0646).`);
  const template = await db.first(
    sql`SELECT t.id, t.name_fa, t.price, t.is_active, c.key AS category_key
          FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
         WHERE t.id = ${Math.floor(Number(input.templateId))}`
  );
  if (!template || Number(template.is_active) !== 1) throw ApiError.notFound("\u0627\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A \u06CC\u0627 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0634\u062F\u0647 \u0627\u0633\u062A.");
  if (!ALL_PRODUCT_CATEGORIES.includes(template.category_key)) {
    throw ApiError.validation("\u0627\u06CC\u0646 \u062F\u0633\u062A\u0647 \u0642\u0627\u0628\u0644 \u062A\u0648\u0644\u06CC\u062F \u062F\u0631 \u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u06A9\u0634\u0648\u0631 \u0646\u06CC\u0633\u062A.");
  }
  const price = template.price === null ? null : Number(template.price);
  if (price === null || price <= 0) throw ApiError.validation("\u0627\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644 \u0647\u0646\u0648\u0632 \u0642\u06CC\u0645\u062A\u200C\u06AF\u0630\u0627\u0631\u06CC \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  const unitCost = Math.max(1, Math.floor(price * PRODUCTION_COST_RATIO));
  const totalCost = unitCost * quantity;
  const durationSeconds = Math.max(15, Math.ceil(quantity * PRODUCTION_SECONDS_PER_UNIT / (1 + 0.25 * (maxFactoryLevel - 1))));
  const productGroup = PRODUCT_GROUPS.find((g) => g.categories.includes(template.category_key));
  const remaining2 = await spendTreasury(db, nation, {
    amount: totalCost,
    referenceType: "production",
    reason: `\u{1F3ED} \u0633\u0641\u0627\u0631\u0634 \u062A\u0648\u0644\u06CC\u062F: ${quantity} \xD7 ${template.name_fa}`,
    meta: { templateId: template.id, quantity, unitCost, durationSeconds },
    idempotencyPrefix: "production",
    now
  });
  const orderId = uuid();
  const completesAt = now + durationSeconds;
  await db.run(
    sql`INSERT INTO nation_production_orders (id, nation_id, product_key, template_id, quantity, unit_cost, total_cost, started_at, completes_at, status)
         VALUES (${orderId}, ${nation.id}, ${productGroup?.key ?? "custom"}, ${template.id}, ${quantity}, ${unitCost}, ${totalCost}, ${now}, ${completesAt}, 'in_progress')`
  );
  await audit(db, {
    actor: null,
    action: "industry.production_started",
    targetType: "nation",
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { treasury: remaining2, templateId: template.id, quantity, totalCost, durationSeconds },
    reason: `\u0634\u0631\u0648\u0639 \u062A\u0648\u0644\u06CC\u062F ${quantity} \xD7 ${template.name_fa}`
  });
  await notify(db, {
    nationId: nation.id,
    kind: "industry",
    title: "\u{1F3ED} \u0633\u0641\u0627\u0631\u0634 \u062A\u0648\u0644\u06CC\u062F \u062B\u0628\u062A \u0634\u062F",
    body: `${quantity} \xD7 ${template.name_fa} \u2014 \u062A\u06A9\u0645\u06CC\u0644 \u062F\u0631 ${humanDuration(durationSeconds)} \u062F\u06CC\u06AF\u0631.`
  });
  return {
    orderId,
    templateId: Number(template.id),
    templateName: template.name_fa,
    quantity,
    unitCost,
    totalCost,
    durationSeconds,
    completesAt: toIso(completesAt),
    treasury: remaining2
  };
}
async function claimProduction(db, nation, orderId, now = nowSeconds()) {
  await sweepProductionOrders(db, nation.id, now);
  const order2 = await db.first(
    sql`SELECT o.id, o.template_id, o.quantity, o.status, o.total_cost, t.name_fa
          FROM nation_production_orders o JOIN equipment_templates t ON t.id = o.template_id
         WHERE o.id = ${String(orderId)} AND o.nation_id = ${nation.id}`
  );
  if (!order2) throw ApiError.notFound("\u0627\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F.");
  if (order2.status !== "ready") throw ApiError.conflict("\u0627\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634 \u0647\u0646\u0648\u0632 \u0622\u0645\u0627\u062F\u0647 \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u06CC\u0633\u062A.");
  await db.batch([
    sql`UPDATE nation_production_orders SET status = 'claimed' WHERE id = ${order2.id}`,
    sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
         VALUES (${nation.id}, ${order2.template_id}, ${order2.quantity}, ${now}, ${now})
         ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${order2.quantity}, updated_at = ${now}`
  ]);
  await audit(db, {
    actor: null,
    action: "industry.production_claimed",
    targetType: "nation",
    targetId: nation.id,
    before: null,
    after: { templateId: Number(order2.template_id), quantity: Number(order2.quantity) },
    reason: `\u062F\u0631\u06CC\u0627\u0641\u062A \u0633\u0641\u0627\u0631\u0634 \u062A\u0648\u0644\u06CC\u062F: ${order2.quantity} \xD7 ${order2.name_fa}`
  });
  return { orderId: order2.id, templateId: Number(order2.template_id), templateName: order2.name_fa, quantity: Number(order2.quantity) };
}
async function upgradeFactory(db, nation, templateId, now = nowSeconds()) {
  const row = await db.first(
    sql`SELECT t.price, i.quantity, t.name_fa, l.level
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nation.id} AND t.id = ${Math.floor(Number(templateId))} AND c.key = 'factories'`
  );
  if (!row) throw ApiError.notFound("\u0627\u06CC\u0646 \u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0631\u0627 \u0646\u062F\u0627\u0631\u06CC\u062F.");
  const level = Math.max(1, Number(row.level ?? 1));
  if (level >= FACTORY_MAX_LEVEL) throw ApiError.conflict("\u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0628\u0647 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0633\u0637\u062D (\u06F1\u06F0) \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A.");
  const cost = upgradeCostFor(row.price === null ? null : Number(row.price), level);
  const remaining2 = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: "factory_upgrade",
    reason: `\u23EB \u0627\u0631\u062A\u0642\u0627\u06CC \u06A9\u0627\u0631\u062E\u0627\u0646\u0647: ${row.name_fa} \u2192 \u0633\u0637\u062D ${level + 1}`,
    meta: { templateId, fromLevel: level, toLevel: level + 1 },
    idempotencyPrefix: "factory_upgrade",
    now
  });
  await db.run(
    sql`INSERT INTO nation_factory_levels (nation_id, template_id, level, updated_at)
         VALUES (${nation.id}, ${Math.floor(Number(templateId))}, ${level + 1}, ${now})
         ON CONFLICT (nation_id, template_id) DO UPDATE SET level = ${level + 1}, updated_at = ${now}`
  );
  await audit(db, {
    actor: null,
    action: "industry.factory_upgraded",
    targetType: "nation",
    targetId: nation.id,
    before: { level, treasury: nation.treasury },
    after: { level: level + 1, treasury: remaining2 },
    reason: `\u0627\u0631\u062A\u0642\u0627\u06CC ${row.name_fa} \u0628\u0647 \u0633\u0637\u062D ${level + 1}`
  });
  return { templateId: Math.floor(Number(templateId)), level: level + 1, cost, treasury: remaining2 };
}

// apps/worker/src/services/arsenalService.ts
init_sql();
init_errors2();
init_format();
init_queries();
init_auditService();
var ARSENAL_GROUPS = [
  { key: "aircraft", labelFa: "\u0647\u0648\u0627\u067E\u06CC\u0645\u0627\u0647\u0627", emoji: "\u2708\uFE0F", categories: ["fighters", "transport_aircraft", "helicopters", "drones"] },
  { key: "missiles", labelFa: "\u0645\u0648\u0634\u06A9\u200C\u0647\u0627", emoji: "\u{1F680}", categories: ["missiles"] },
  { key: "air_defense", labelFa: "\u0633\u0627\u0645\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u067E\u062F\u0627\u0641\u0646\u062F\u06CC", emoji: "\u{1F6E1}\uFE0F", categories: ["ground_air_defense", "air_air_defense", "naval_air_defense", "radars"] },
  { key: "armored", labelFa: "\u062A\u0627\u0646\u06A9\u200C\u0647\u0627 \u0648 \u062E\u0648\u062F\u0631\u0648\u0647\u0627\u06CC \u0632\u0631\u0647\u06CC", emoji: "\u{1FA96}", categories: ["tanks", "apc"] },
  { key: "naval", labelFa: "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u062F\u0631\u06CC\u0627\u06CC\u06CC", emoji: "\u{1F6A2}", categories: ["ships", "submarines"] },
  { key: "weapons", labelFa: "\u0633\u0644\u0627\u062D \u0648 \u0645\u0647\u0645\u0627\u062A", emoji: "\u{1F4A5}", categories: ["artillery", "rockets"] },
  { key: "fuel", labelFa: "\u0633\u0648\u062E\u062A \u0646\u0638\u0627\u0645\u06CC", emoji: "\u26FD", categories: ["fuel"] }
];
var ARSENAL_CATEGORY_KEYS = [...new Set(ARSENAL_GROUPS.flatMap((g) => g.categories))];
var BASE_CAPACITY = 1e3;
var SHELTER_CAPACITY_PER_LEVEL = 500;
var NON_STORED_CATEGORIES = ["soldiers"];
async function arsenalState(db, nation) {
  const [rows, deployedRows, buildingRow, ext] = await Promise.all([
    db.all(
      sql`SELECT t.id AS template_id, t.code, t.name_fa, i.quantity, t.price, t.attack_points, t.defense_points,
                 t.maintenance_per_unit, c.key AS category_key, c.label_fa AS category_label, t.unit_fa, c.power_weight
            FROM nation_inventory i
            JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nation.id} AND t.is_active = 1
           ORDER BY c.sort_order, t.name_fa`
    ),
    db.all(
      sql`SELECT template_id, quantity FROM nation_deployed WHERE nation_id = ${nation.id} AND quantity > 0`
    ),
    db.first(
      sql`SELECT COALESCE(level, 1) AS level FROM nation_buildings WHERE nation_id = ${nation.id} AND building_key = 'shelter'`
    ),
    ensureNationExt(db, nation.id)
  ]);
  const deployed = new Map(deployedRows.map((r) => [Number(r.template_id), Number(r.quantity)]));
  const shelterLevel = buildingRow ? Math.max(1, Number(buildingRow.level ?? 1)) : 0;
  const capacity = BASE_CAPACITY + shelterLevel * SHELTER_CAPACITY_PER_LEVEL;
  const totalItems = rows.reduce((s, r) => s + (NON_STORED_CATEGORIES.includes(r.category_key) ? 0 : Number(r.quantity)), 0);
  const percent2 = capacity > 0 ? Math.min(100, Math.round(totalItems / capacity * 100)) : 0;
  const health = Number(ext?.equipment_health ?? 85);
  const byCategory = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const arr = byCategory.get(r.category_key) ?? [];
    arr.push(r);
    byCategory.set(r.category_key, arr);
  }
  const mapItem = (r) => {
    const dep = deployed.get(Number(r.template_id)) ?? 0;
    const total = Number(r.quantity);
    const stock = Math.max(0, total - dep);
    const power = Number(r.attack_points ?? 0) + Number(r.defense_points ?? 0);
    return {
      templateId: Number(r.template_id),
      code: r.code,
      nameFa: r.name_fa,
      quantity: stock,
      deployed: dep,
      total,
      unitFa: r.unit_fa || "\u0639\u062F\u062F",
      price: r.price === null ? null : Number(r.price),
      attackPoints: r.attack_points === null ? null : Number(r.attack_points),
      defensePoints: r.defense_points === null ? null : Number(r.defense_points),
      /** امتیاز قدرت مؤثر — اگر قالب امتیاز تخصصی نداشته باشد، وزن دسته اعمال می‌شود */
      powerPoints: power > 0 ? power : Math.round(total * Number(r.power_weight ?? 0)),
      statusFa: health >= 60 ? "\u0639\u0645\u0644\u06CC\u0627\u062A\u06CC" : "\u0646\u06CC\u0627\u0632\u0645\u0646\u062F \u062A\u0639\u0645\u06CC\u0631"
    };
  };
  const groups = ARSENAL_GROUPS.map((g) => {
    const items = g.categories.flatMap((c) => byCategory.get(c) ?? []).map(mapItem);
    const units = items.reduce((s, i) => s + i.total, 0);
    return { key: g.key, labelFa: g.labelFa, emoji: g.emoji, units, items };
  });
  const deployedUnits = [...deployed.values()].reduce((s, n) => s + n, 0);
  return {
    capacity,
    used: totalItems,
    available: Math.max(0, capacity - totalItems),
    percent: percent2,
    health,
    shelterLevel,
    deployedUnits,
    warehouseUnits: Math.max(0, totalItems - deployedUnits),
    groups
  };
}
async function getStock(db, nationId, templateId) {
  const row = await db.first(
    sql`SELECT COALESCE(SUM(i.quantity), 0) AS quantity FROM nation_inventory i WHERE i.nation_id = ${nationId} AND i.template_id = ${templateId}`
  );
  return Number(row?.quantity ?? 0);
}
async function getDeployed(db, nationId, templateId) {
  const row = await db.first(
    sql`SELECT quantity FROM nation_deployed WHERE nation_id = ${nationId} AND template_id = ${templateId}`
  );
  return Number(row?.quantity ?? 0);
}
async function deployUnits(db, nation, templateId, quantity, now = nowSeconds()) {
  const tid = Math.floor(Number(templateId));
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(tid) || tid <= 0) throw ApiError.validation("\u062A\u062C\u0647\u06CC\u0632 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (!Number.isFinite(qty) || qty < 1) throw ApiError.validation("\u062A\u0639\u062F\u0627\u062F \u0628\u0627\u06CC\u062F \u062F\u0633\u062A\u200C\u06A9\u0645 \u06F1 \u0628\u0627\u0634\u062F.");
  const stock = await getStock(db, nation.id, tid);
  const dep = await getDeployed(db, nation.id, tid);
  const available = Math.max(0, stock - dep);
  if (qty > available) throw ApiError.validation(`\u0641\u0642\u0637 ${available} \u0648\u0627\u062D\u062F \u0642\u0627\u0628\u0644 \u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u0647 \u06CC\u06AF\u0627\u0646 \u0627\u0633\u062A.`);
  await db.run(
    sql`INSERT INTO nation_deployed (nation_id, template_id, quantity, updated_at)
         VALUES (${nation.id}, ${tid}, ${qty}, ${now})
         ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = quantity + ${qty}, updated_at = ${now}`
  );
  await audit(db, {
    actor: null,
    action: "arsenal.deployed",
    targetType: "nation",
    targetId: nation.id,
    before: { deployed: dep },
    after: { deployed: dep + qty },
    reason: `\u0627\u0646\u062A\u0642\u0627\u0644 ${qty} \u0648\u0627\u062D\u062F \u062A\u062C\u0647\u06CC\u0632 \u0628\u0647 \u06CC\u06AF\u0627\u0646 (\u0642\u0627\u0644\u0628 #${tid})`
  });
  return { templateId: tid, deployed: dep + qty, moved: qty };
}
async function recallUnits(db, nation, templateId, quantity, now = nowSeconds()) {
  const tid = Math.floor(Number(templateId));
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(tid) || tid <= 0) throw ApiError.validation("\u062A\u062C\u0647\u06CC\u0632 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (!Number.isFinite(qty) || qty < 1) throw ApiError.validation("\u062A\u0639\u062F\u0627\u062F \u0628\u0627\u06CC\u062F \u062F\u0633\u062A\u200C\u06A9\u0645 \u06F1 \u0628\u0627\u0634\u062F.");
  const dep = await getDeployed(db, nation.id, tid);
  if (qty > dep) throw ApiError.validation(`\u0641\u0642\u0637 ${dep} \u0648\u0627\u062D\u062F \u062F\u0631 \u06CC\u06AF\u0627\u0646\u200C\u0647\u0627 \u0645\u0633\u062A\u0642\u0631 \u0627\u0633\u062A.`);
  await db.run(
    sql`UPDATE nation_deployed SET quantity = quantity - ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id} AND template_id = ${tid}`
  );
  await audit(db, {
    actor: null,
    action: "arsenal.recalled",
    targetType: "nation",
    targetId: nation.id,
    before: { deployed: dep },
    after: { deployed: dep - qty },
    reason: `\u0628\u0627\u0632\u06AF\u0634\u062A ${qty} \u0648\u0627\u062D\u062F \u062A\u062C\u0647\u06CC\u0632 \u0627\u0632 \u06CC\u06AF\u0627\u0646 (\u0642\u0627\u0644\u0628 #${tid})`
  });
  return { templateId: tid, deployed: dep - qty, moved: qty };
}

// apps/worker/src/services/armyService.ts
init_sql();
init_errors2();
init_format();
init_queries();
init_auditService();
var ARMY_SECTIONS = [
  { key: "ground", labelFa: "\u0646\u06CC\u0631\u0648\u06CC \u0632\u0645\u06CC\u0646\u06CC", emoji: "\u{1FA96}", categories: ["soldiers", "tanks", "apc", "artillery"] },
  { key: "air", labelFa: "\u0646\u06CC\u0631\u0648\u06CC \u0647\u0648\u0627\u06CC\u06CC", emoji: "\u{1F6EB}", categories: ["fighters", "transport_aircraft", "helicopters", "drones"] },
  { key: "naval", labelFa: "\u0646\u06CC\u0631\u0648\u06CC \u062F\u0631\u06CC\u0627\u06CC\u06CC", emoji: "\u{1F6A2}", categories: ["ships", "submarines"] },
  { key: "missile", labelFa: "\u06CC\u06AF\u0627\u0646 \u0645\u0648\u0634\u06A9\u06CC", emoji: "\u{1F680}", categories: ["missiles", "rockets"] },
  { key: "defense", labelFa: "\u06CC\u06AF\u0627\u0646 \u067E\u062F\u0627\u0641\u0646\u062F\u06CC", emoji: "\u{1F6E1}\uFE0F", categories: ["ground_air_defense", "air_air_defense", "naval_air_defense", "radars"] }
];
var REPAIR_BASE_COST = 5e3;
var REPAIR_VALUE_RATIO = 0.02;
var SUPPLY_FUEL_COST_PER_UNIT = 3;
var SUPPLY_AMMO_COST_PER_UNIT = 2;
async function armyState(db, nation) {
  const [rows, ext, equipmentValueRow] = await Promise.all([
    db.all(
      sql`SELECT c.key AS category_key, SUM(i.quantity) AS quantity,
                 MAX(t.attack_points) AS ap, MAX(t.defense_points) AS dp, SUM(i.quantity * COALESCE(t.price, 0)) AS price,
                 MAX(c.power_weight) AS power_weight
            FROM nation_inventory i
            JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nation.id}
           GROUP BY c.key`
    ),
    ensureNationExt(db, nation.id),
    db.first(
      sql`SELECT SUM(i.quantity * COALESCE(t.price, 0)) AS value, SUM(i.quantity) AS units
            FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
           WHERE i.nation_id = ${nation.id} AND t.price IS NOT NULL`
    )
  ]);
  const qty = (keys) => rows.filter((r) => keys.includes(r.category_key)).reduce((s, r) => s + Number(r.quantity), 0);
  const points = (keys) => rows.filter((r) => keys.includes(r.category_key)).reduce((s, r) => s + Number(r.quantity) * Number(r.power_weight ?? 0), 0);
  const troops = qty(["soldiers"]);
  const sections = ARMY_SECTIONS.map((s) => ({
    key: s.key,
    labelFa: s.labelFa,
    emoji: s.emoji,
    units: qty(s.categories),
    points: Math.round(points(s.categories))
  }));
  const totalPoints = sections.reduce((s, x) => s + x.points, 0);
  for (const s of sections) {
    s.sharePercent = totalPoints > 0 ? Math.round(s.points / totalPoints * 100) : 0;
  }
  const health = Number(ext?.equipment_health ?? 85);
  const fuel = Number(ext?.fuel_level ?? 80);
  const ammo = Number(ext?.ammo_level ?? 75);
  const readiness = Math.min(99, Math.max(5, Math.round(40 + health * 0.45 + Math.min(15, troops / 1e3))));
  const equipmentValue = Number(equipmentValueRow?.value ?? 0);
  const equipmentUnits = Number(equipmentValueRow?.units ?? 0);
  const repairCost = Math.max(REPAIR_BASE_COST, Math.round(equipmentValue * REPAIR_VALUE_RATIO));
  const fuelCost = Math.max(2e3, troops * SUPPLY_FUEL_COST_PER_UNIT + equipmentUnits * 2);
  const ammoCost = Math.max(2e3, Math.round(troops * SUPPLY_AMMO_COST_PER_UNIT * 1.25 + equipmentUnits));
  return {
    troops,
    readiness,
    equipmentHealth: health,
    fuelLevel: fuel,
    ammoLevel: ammo,
    sections,
    equipmentValue,
    equipmentUnits,
    repairCost,
    fuelCost,
    ammoCost,
    soldierUpkeepPerDay: troops * 50
  };
}
async function repairEquipment(db, nation, now = nowSeconds()) {
  const state = await armyState(db, nation);
  if (state.equipmentHealth >= 99) throw ApiError.conflict("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0647\u0645\u06CC\u0646 \u062D\u0627\u0644\u0627 \u062F\u0631 \u0628\u0647\u062A\u0631\u06CC\u0646 \u0648\u0636\u0639\u06CC\u062A \u0647\u0633\u062A\u0646\u062F.");
  const remaining2 = await spendTreasury(db, nation, {
    amount: state.repairCost,
    referenceType: "army_repair",
    reason: "\u{1F527} \u062A\u0639\u0645\u06CC\u0631 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06A9\u0634\u0648\u0631",
    meta: { healthBefore: state.equipmentHealth, cost: state.repairCost },
    idempotencyPrefix: "repair",
    now
  });
  await db.run(
    sql`UPDATE nation_state_ext SET equipment_health = 100, updated_at = ${now} WHERE nation_id = ${nation.id}`
  );
  await audit(db, {
    actor: null,
    action: "army.repair",
    targetType: "nation",
    targetId: nation.id,
    before: { health: state.equipmentHealth, treasury: nation.treasury },
    after: { health: 100, treasury: remaining2 },
    reason: "\u062A\u0639\u0645\u06CC\u0631 \u06A9\u0627\u0645\u0644 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A"
  });
  return { equipmentHealth: 100, cost: state.repairCost, treasury: remaining2 };
}
async function supply(db, nation, kind, now = nowSeconds()) {
  if (kind !== "fuel" && kind !== "ammo") throw ApiError.validation("\u0646\u0648\u0639 \u062A\u0623\u0645\u06CC\u0646 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const state = await armyState(db, nation);
  const cost = kind === "fuel" ? state.fuelCost : state.ammoCost;
  const label = kind === "fuel" ? "\u26FD \u062A\u0623\u0645\u06CC\u0646 \u0633\u0648\u062E\u062A" : "\u{1F9E8} \u062A\u0623\u0645\u06CC\u0646 \u0645\u0647\u0645\u0627\u062A";
  const remaining2 = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: kind === "fuel" ? "army_fuel" : "army_ammo",
    reason: label,
    meta: { cost },
    idempotencyPrefix: kind,
    now
  });
  await db.run(
    kind === "fuel" ? sql`UPDATE nation_state_ext SET fuel_level = 100, updated_at = ${now} WHERE nation_id = ${nation.id}` : sql`UPDATE nation_state_ext SET ammo_level = 100, updated_at = ${now} WHERE nation_id = ${nation.id}`
  );
  await audit(db, {
    actor: null,
    action: kind === "fuel" ? "army.supply_fuel" : "army.supply_ammo",
    targetType: "nation",
    targetId: nation.id,
    before: { level: kind === "fuel" ? state.fuelLevel : state.ammoLevel, treasury: nation.treasury },
    after: { level: 100, treasury: remaining2 },
    reason: label
  });
  return { kind, level: 100, cost, treasury: remaining2 };
}

// apps/worker/src/services/securityService.ts
init_sql();
init_errors2();
init_format();
init_queries();
init_auditService();
var POLICE_COST = 2500;
var BORDER_COST_PER_LEVEL = 15e3;
var INFRA_COST_PER_LEVEL = 25e3;
var PROTECT_COST = 5e3;
var SECURITY_MAX_LEVEL = 10;
async function ownedAssets(db, nationId) {
  const [factories, mines, buildings] = await Promise.all([
    db.all(
      sql`SELECT t.id AS ref, t.name_fa AS name FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nationId} AND c.key = 'factories'`
    ),
    db.all(
      sql`SELECT t.id AS ref, t.name_fa AS name FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id
            JOIN equipment_categories c ON c.id = t.category_id
           WHERE i.nation_id = ${nationId} AND c.key = 'mines'`
    ),
    db.all(
      sql`SELECT b.building_key AS ref, b.building_key AS name FROM nation_buildings b WHERE b.nation_id = ${nationId}`
    )
  ]);
  const BUILDING_NAME = {
    barracks: "\u067E\u0627\u062F\u06AF\u0627\u0646 \u0646\u0638\u0627\u0645\u06CC",
    airbase: "\u067E\u0627\u06CC\u06AF\u0627\u0647 \u0647\u0648\u0627\u06CC\u06CC",
    factory: "\u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0646\u0638\u0627\u0645\u06CC",
    navalbase: "\u067E\u0627\u06CC\u06AF\u0627\u0647 \u062F\u0631\u06CC\u0627\u06CC\u06CC",
    shelter: "\u067E\u0646\u0627\u0647\u06AF\u0627\u0647 \u0646\u0638\u0627\u0645\u06CC",
    radar: "\u0645\u0631\u06A9\u0632 \u0631\u0627\u062F\u0627\u0631"
  };
  return [
    ...factories.map((r) => ({ assetType: "factory", assetRef: String(r.ref), assetName: r.name })),
    ...mines.map((r) => ({ assetType: "mine", assetRef: String(r.ref), assetName: r.name })),
    ...buildings.map((r) => ({ assetType: "building", assetRef: String(r.ref), assetName: BUILDING_NAME[r.ref] ?? r.ref }))
  ];
}
async function securityState(db, nation) {
  const ext = await ensureNationExt(db, nation.id);
  const [protectedRows, assets, factoryCount] = await Promise.all([
    db.all(
      sql`SELECT asset_type, asset_ref, asset_name FROM nation_protected_assets WHERE nation_id = ${nation.id} ORDER BY created_at ASC`
    ),
    ownedAssets(db, nation.id),
    db.first(
      sql`SELECT COUNT(*) AS n FROM (SELECT DISTINCT i.template_id FROM nation_inventory i JOIN equipment_templates t ON t.id = i.template_id JOIN equipment_categories c ON c.id = t.category_id WHERE i.nation_id = ${nation.id} AND c.key = 'factories')`
    )
  ]);
  const protectedSet = new Set(protectedRows.map((r) => `${r.asset_type}:${r.asset_ref}`));
  const police = Number(ext?.police ?? 0);
  const border = Number(ext?.border_level ?? 1);
  const infra = Number(ext?.infra_level ?? 1);
  const health = Number(ext?.equipment_health ?? 85);
  const fuel = Number(ext?.fuel_level ?? 80);
  const ammo = Number(ext?.ammo_level ?? 75);
  const policeUpkeep = police * POLICE_UPKEEP_PER_DAY;
  const alerts = [];
  if (health < 60) {
    alerts.push({ key: "equipment", severity: "critical", title: "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0622\u0633\u06CC\u0628 \u062F\u06CC\u062F\u0647\u200C\u0627\u0646\u062F", hint: `\u0633\u0644\u0627\u0645\u062A \u062A\u062C\u0647\u06CC\u0632\u0627\u062A ${Math.round(health)}\u066A \u0627\u0633\u062A\u061B \u062A\u0639\u0645\u06CC\u0631 \u0633\u0631\u06CC\u0639 \u0644\u0627\u0632\u0645 \u0627\u0633\u062A.`, actionLabel: "\u062A\u0639\u0645\u06CC\u0631 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A", actionRoute: "/app/army" });
  }
  if (fuel < 30 || ammo < 30) {
    alerts.push({ key: "supplies", severity: "critical", title: "\u0630\u062E\u0627\u06CC\u0631 \u0633\u0648\u062E\u062A \u06CC\u0627 \u0645\u0647\u0645\u0627\u062A \u0631\u0648 \u0628\u0647 \u067E\u0627\u06CC\u0627\u0646", hint: `\u0633\u0648\u062E\u062A ${Math.round(fuel)}\u066A \xB7 \u0645\u0647\u0645\u0627\u062A ${Math.round(ammo)}\u066A`, actionLabel: "\u062A\u0623\u0645\u06CC\u0646 \u0630\u062E\u0627\u06CC\u0631", actionRoute: "/app/army" });
  }
  if (border < 3) {
    alerts.push({ key: "border", severity: "warn", title: "\u062D\u0641\u0627\u0638\u062A \u0645\u0631\u0632 \u0636\u0639\u06CC\u0641 \u0627\u0633\u062A", hint: `\u0633\u0637\u062D \u0641\u0639\u0644\u06CC \u0645\u0631\u0632 ${border} \u0627\u0632 ${SECURITY_MAX_LEVEL}.`, actionLabel: "\u062A\u0642\u0648\u06CC\u062A \u0645\u0631\u0632\u0647\u0627", actionRoute: "/app/security" });
  }
  if (infra < 3) {
    alerts.push({ key: "infra", severity: "warn", title: "\u0632\u06CC\u0631\u0633\u0627\u062E\u062A\u200C\u0647\u0627 \u0622\u0633\u06CC\u0628\u200C\u067E\u0630\u06CC\u0631\u0646\u062F", hint: `\u0633\u0637\u062D \u0632\u06CC\u0631\u0633\u0627\u062E\u062A ${infra}\u061B \u062F\u0631 \u0628\u062D\u0631\u0627\u0646\u200C\u0647\u0627 \u0622\u0633\u06CC\u0628 \u0628\u06CC\u0634\u062A\u0631\u06CC \u0645\u06CC\u200C\u0628\u06CC\u0646\u0646\u062F.`, actionLabel: "\u062A\u0642\u0648\u06CC\u062A \u0632\u06CC\u0631\u0633\u0627\u062E\u062A", actionRoute: "/app/security" });
  }
  if (police < 150) {
    alerts.push({ key: "police", severity: "warn", title: "\u06A9\u0645\u0628\u0648\u062F \u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u062A\u0638\u0627\u0645\u06CC", hint: `\u0641\u0642\u0637 ${police} \u067E\u0644\u06CC\u0633 \u0641\u0639\u0627\u0644 \u062F\u0627\u0631\u06CC\u062F.`, actionLabel: "\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u067E\u0644\u06CC\u0633", actionRoute: "/app/security" });
  }
  if (protectedRows.length === 0 && assets.length > 0) {
    alerts.push({ key: "assets", severity: "warn", title: "\u0647\u06CC\u0686 \u0645\u0631\u06A9\u0632 \u0645\u0647\u0645\u06CC \u0645\u062D\u0627\u0641\u0638\u062A \u0646\u0634\u062F\u0647", hint: "\u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0647\u0627 \u0648 \u0645\u0639\u0627\u062F\u0646 \u062F\u0631 \u0628\u062D\u0631\u0627\u0646\u200C\u0647\u0627 \u0628\u06CC\u200C\u062F\u0641\u0627\u0639 \u0645\u06CC\u200C\u0645\u0627\u0646\u0646\u062F.", actionLabel: "\u062D\u0641\u0627\u0638\u062A \u0627\u0632 \u0645\u0631\u0627\u06A9\u0632", actionRoute: "/app/security" });
  }
  if (nation.treasury < 15e4) {
    alerts.push({ key: "budget", severity: "warn", title: "\u062E\u0632\u0627\u0646\u0647 \u062F\u0631 \u062A\u0646\u0634 \u0627\u0633\u062A", hint: `\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 ${nation.treasury.toLocaleString("en-US")} \u0633\u06A9\u0647.`, actionLabel: "\u062F\u0641\u062A\u0631 \u0645\u0627\u0644\u06CC", actionRoute: "/app/economy/treasury" });
  }
  const hasCritical = alerts.some((a) => a.severity === "critical");
  const status = alerts.length === 0 ? "\u0639\u0627\u062F\u06CC" : hasCritical ? "\u0628\u062D\u0631\u0627\u0646\u06CC" : "\u0647\u0634\u062F\u0627\u0631";
  const statusTone = alerts.length === 0 ? "ok" : hasCritical ? "bad" : "warn";
  return {
    status,
    statusTone,
    alerts,
    police,
    policeUpkeep,
    policeCost: POLICE_COST,
    borderLevel: border,
    borderCost: BORDER_COST_PER_LEVEL * border,
    infraLevel: infra,
    infraCost: INFRA_COST_PER_LEVEL * infra,
    maxLevel: SECURITY_MAX_LEVEL,
    borderPercent: Math.round(border / SECURITY_MAX_LEVEL * 100),
    infraPercent: Math.round(infra / SECURITY_MAX_LEVEL * 100),
    protectedAssets: protectedRows.map((r) => ({ assetType: r.asset_type, assetRef: r.asset_ref, assetName: r.asset_name })),
    candidates: assets.map((a) => ({ ...a, protected: protectedSet.has(`${a.assetType}:${a.assetRef}`) })),
    factoryTypes: Number(factoryCount?.n ?? 0),
    protectCost: PROTECT_COST
  };
}
async function hirePolice(db, nation, quantity, now = nowSeconds()) {
  const qty = Math.floor(Number(quantity));
  if (!Number.isFinite(qty) || qty < 1) throw ApiError.validation("\u062A\u0639\u062F\u0627\u062F \u067E\u0644\u06CC\u0633 \u0628\u0627\u06CC\u062F \u062F\u0633\u062A\u200C\u06A9\u0645 \u06F1 \u0628\u0627\u0634\u062F.");
  if (qty > 500) throw ApiError.validation("\u062D\u062F\u0627\u06A9\u062B\u0631 \u06F5\u06F0\u06F0 \u067E\u0644\u06CC\u0633 \u062F\u0631 \u0647\u0631 \u0627\u0633\u062A\u062E\u062F\u0627\u0645.");
  const cost = qty * POLICE_COST;
  const remaining2 = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: "security_police",
    reason: `\u{1F693} \u0627\u0633\u062A\u062E\u062F\u0627\u0645 ${qty} \u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u062A\u0638\u0627\u0645\u06CC`,
    meta: { quantity: qty, cost },
    idempotencyPrefix: "police",
    now
  });
  await ensureNationExt(db, nation.id);
  const res = await db.first(
    sql`UPDATE nation_state_ext SET police = police + ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING police`
  );
  await audit(db, {
    actor: null,
    action: "security.hire_police",
    targetType: "nation",
    targetId: nation.id,
    before: { treasury: nation.treasury },
    after: { police: Number(res?.police ?? 0), treasury: remaining2 },
    reason: `\u0627\u0633\u062A\u062E\u062F\u0627\u0645 ${qty} \u067E\u0644\u06CC\u0633`
  });
  return { police: Number(res?.police ?? 0), cost, treasury: remaining2 };
}
async function levelUp(db, nation, column, costPerLevel, label, now) {
  const ext = await ensureNationExt(db, nation.id);
  const current = Number(ext?.[column] ?? 1);
  if (current >= SECURITY_MAX_LEVEL) throw ApiError.conflict("\u0628\u0647 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0633\u0637\u062D \u0645\u0645\u06A9\u0646 \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A.");
  const cost = costPerLevel * current;
  const remaining2 = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: column === "border_level" ? "security_border" : "security_infra",
    reason: label,
    meta: { fromLevel: current, toLevel: current + 1 },
    idempotencyPrefix: column,
    now
  });
  const res = await db.first(
    column === "border_level" ? sql`UPDATE nation_state_ext SET border_level = border_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING border_level, infra_level` : sql`UPDATE nation_state_ext SET infra_level = infra_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING border_level, infra_level`
  );
  await audit(db, {
    actor: null,
    action: column === "border_level" ? "security.border_up" : "security.infra_up",
    targetType: "nation",
    targetId: nation.id,
    before: { level: current, treasury: nation.treasury },
    after: { level: current + 1, treasury: remaining2 },
    reason: `${label} \u2192 \u0633\u0637\u062D ${current + 1}`
  });
  return {
    level: column === "border_level" ? Number(res?.border_level ?? current + 1) : Number(res?.infra_level ?? current + 1),
    cost,
    treasury: remaining2
  };
}
function upgradeBorder(db, nation, now = nowSeconds()) {
  return levelUp(db, nation, "border_level", BORDER_COST_PER_LEVEL, "\u{1F6E1}\uFE0F \u062A\u0642\u0648\u06CC\u062A \u0645\u0631\u0632", now);
}
function upgradeInfra(db, nation, now = nowSeconds()) {
  return levelUp(db, nation, "infra_level", INFRA_COST_PER_LEVEL, "\u{1F3D7}\uFE0F \u062A\u0642\u0648\u06CC\u062A \u0632\u06CC\u0631\u0633\u0627\u062E\u062A", now);
}
async function toggleProtectedAsset(db, nation, input, now = nowSeconds()) {
  const assetType = input.assetType;
  if (!["factory", "mine", "building"].includes(assetType)) throw ApiError.validation("\u0646\u0648\u0639 \u0645\u0631\u06A9\u0632 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const assetRef = String(input.assetRef).slice(0, 64);
  const assetName = String(input.assetName).slice(0, 120);
  if (!assetRef) throw ApiError.validation("\u0634\u0646\u0627\u0633\u0647\u0654 \u0645\u0631\u06A9\u0632 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const existing = await db.first(
    sql`SELECT rowid AS id FROM nation_protected_assets WHERE nation_id = ${nation.id} AND asset_type = ${assetType} AND asset_ref = ${assetRef}`
  );
  if (existing) {
    await db.run(
      sql`DELETE FROM nation_protected_assets WHERE nation_id = ${nation.id} AND asset_type = ${assetType} AND asset_ref = ${assetRef}`
    );
    await audit(db, {
      actor: null,
      action: "security.unprotect",
      targetType: "nation",
      targetId: nation.id,
      before: { assetType, assetRef, assetName },
      after: null,
      reason: `\u062D\u0630\u0641 \u062D\u0641\u0627\u0638\u062A \u0627\u0632 ${assetName}`
    });
    return { protected: false, assetType, assetRef, treasury: nation.treasury };
  }
  const remaining2 = await spendTreasury(db, nation, {
    amount: PROTECT_COST,
    referenceType: "security_protect",
    reason: `\u{1F6E1}\uFE0F \u062D\u0641\u0627\u0638\u062A \u0627\u0632 ${assetName}`,
    meta: { assetType, assetRef, assetName },
    idempotencyPrefix: "protect",
    now
  });
  await db.run(
    sql`INSERT INTO nation_protected_assets (nation_id, asset_type, asset_ref, asset_name, cost, created_at)
         VALUES (${nation.id}, ${assetType}, ${assetRef}, ${assetName}, ${PROTECT_COST}, ${now})`
  );
  await audit(db, {
    actor: null,
    action: "security.protect",
    targetType: "nation",
    targetId: nation.id,
    before: null,
    after: { assetType, assetRef, assetName, treasury: remaining2 },
    reason: `\u062D\u0641\u0627\u0638\u062A \u0627\u0632 ${assetName}`
  });
  return { protected: true, assetType, assetRef, treasury: remaining2 };
}

// apps/worker/src/services/populationService.ts
init_sql();
init_errors2();
init_format();
init_queries();
init_auditService();
var POPULATION_MAX_LEVEL = 10;
var COSTS = { hospital: 4e4, school: 35e3, housing: 3e4 };
var KIND_LABEL = {
  hospital: "\u{1F3E5} \u0627\u0631\u062A\u0642\u0627\u06CC \u0628\u06CC\u0645\u0627\u0631\u0633\u062A\u0627\u0646\u200C\u0647\u0627",
  school: "\u{1F393} \u0627\u0631\u062A\u0642\u0627\u06CC \u0645\u062F\u0627\u0631\u0633",
  housing: "\u{1F3D7}\uFE0F \u0645\u0633\u06A9\u0646 \u0648 \u0634\u0647\u0631\u0633\u0627\u0632\u06CC"
};
var clamp2 = (v, min, max) => Math.min(max, Math.max(min, v));
var round1 = (v) => Math.round(v * 10) / 10;
async function factoryAndMineTotals(db, nationId) {
  const row = await db.first(
    sql`SELECT
          COALESCE(SUM(CASE WHEN c.key = 'factories' THEN i.quantity * COALESCE(l.level, 1) ELSE 0 END), 0) AS factory_level_sum,
          COALESCE(SUM(CASE WHEN c.key = 'mines' THEN i.quantity ELSE 0 END), 0) AS mine_count,
          COALESCE(SUM(CASE WHEN c.key = 'factories' THEN i.quantity ELSE 0 END), 0) AS factory_count
          FROM nation_inventory i
          JOIN equipment_templates t ON t.id = i.template_id
          JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_factory_levels l ON l.nation_id = i.nation_id AND l.template_id = t.id
         WHERE i.nation_id = ${nationId}`
  );
  return {
    factoryLevelSum: Number(row?.factory_level_sum ?? 0),
    mineCount: Number(row?.mine_count ?? 0),
    factoryCount: Number(row?.factory_count ?? 0)
  };
}
async function populationState(db, nation) {
  const [ext, totals] = await Promise.all([ensureNationExt(db, nation.id), factoryAndMineTotals(db, nation.id)]);
  const housing = Math.max(1, Number(ext?.housing_level ?? 1));
  const hospital = Math.max(1, Number(ext?.hospital_level ?? 1));
  const education = Math.max(1, Number(ext?.education_level ?? 1));
  const capacity = 25e5 + housing * 12e5 + hospital * 3e5;
  const rawTotal = 22e5 + totals.factoryLevelSum * 18e4 + totals.mineCount * 12e4 + housing * 15e4;
  const total = clamp2(Math.round(rawTotal), 5e5, capacity);
  const atCapacity = rawTotal >= capacity;
  const employmentRate = clamp2(0.34 + education * 0.028 + Math.min(0.12, totals.factoryLevelSum * 6e-3), 0.3, 0.78);
  const employed = Math.floor(total * employmentRate);
  const unemployed = total - employed;
  const unemploymentRate = 1 - employmentRate;
  const birthRate = round1(7.5 + housing * 0.5 + hospital * 0.3);
  const deathRate = round1(Math.max(2, 7 - hospital * 0.55 - housing * 0.1));
  let growthRate = round1(birthRate - deathRate + education * 0.15);
  if (atCapacity) growthRate = Math.min(growthRate, 0.2);
  const happiness = clamp2(Math.round(52 + (hospital + education + housing) * 5 - unemploymentRate * 100 * 0.6), 5, 99);
  return {
    total,
    capacity,
    employed,
    unemployed,
    unemploymentRate: round1(unemploymentRate * 1e3) / 10,
    employmentRate: round1(employmentRate * 1e3) / 10,
    birthRate,
    deathRate,
    growthRate,
    happiness,
    atCapacity,
    hospitalLevel: hospital,
    schoolLevel: education,
    housingLevel: housing,
    hospitalCost: COSTS.hospital * hospital,
    schoolCost: COSTS.school * education,
    housingCost: COSTS.housing * housing,
    maxLevel: POPULATION_MAX_LEVEL,
    factoryCount: totals.factoryCount,
    mineCount: totals.mineCount
  };
}
async function upgradePopulation(db, nation, kind, now = nowSeconds()) {
  if (!["hospital", "school", "housing"].includes(kind)) throw ApiError.validation("\u0646\u0648\u0639 \u0627\u0631\u062A\u0642\u0627 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const ext = await ensureNationExt(db, nation.id);
  const column = kind === "hospital" ? "hospital_level" : kind === "school" ? "education_level" : "housing_level";
  const current = Math.max(1, Number(ext?.[column] ?? 1));
  if (current >= POPULATION_MAX_LEVEL) throw ApiError.conflict("\u0627\u06CC\u0646 \u0628\u062E\u0634 \u0628\u0647 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0633\u0637\u062D \u0645\u0645\u06A9\u0646 \u0631\u0633\u06CC\u062F\u0647 \u0627\u0633\u062A.");
  const cost = COSTS[kind] * current;
  const remaining2 = await spendTreasury(db, nation, {
    amount: cost,
    referenceType: `population_${kind}`,
    reason: KIND_LABEL[kind],
    meta: { kind, fromLevel: current, toLevel: current + 1 },
    idempotencyPrefix: `pop_${kind}`,
    now
  });
  const res = await db.first(
    column === "hospital_level" ? sql`UPDATE nation_state_ext SET hospital_level = hospital_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING hospital_level, education_level, housing_level` : column === "education_level" ? sql`UPDATE nation_state_ext SET education_level = education_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING hospital_level, education_level, housing_level` : sql`UPDATE nation_state_ext SET housing_level = housing_level + 1, updated_at = ${now} WHERE nation_id = ${nation.id} RETURNING hospital_level, education_level, housing_level`
  );
  await audit(db, {
    actor: null,
    action: "population.upgrade",
    targetType: "nation",
    targetId: nation.id,
    before: { kind, level: current, treasury: nation.treasury },
    after: {
      kind,
      level: current + 1,
      treasury: remaining2,
      hospital: Number(res?.hospital_level ?? 0),
      education: Number(res?.education_level ?? 0),
      housing: Number(res?.housing_level ?? 0)
    },
    reason: KIND_LABEL[kind]
  });
  return { kind, level: current + 1, cost, treasury: remaining2 };
}

// apps/worker/src/services/resourceService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_auditService();
var resourceDef = (key) => RESOURCES.find((r) => r.key === key) ?? null;
var partnerDef = (key) => TRADE_PARTNERS.find((p) => p.key === key) ?? null;
var recipeDef = (key) => REFINERY_RECIPES.find((r) => r.key === key) ?? null;
var contractTypeDef = (key) => CONTRACT_TYPES.find((t) => t.key === key) ?? null;
async function stockOf(db, nationId, key) {
  const row = await db.first(sql`SELECT stock FROM nation_resources WHERE nation_id = ${nationId} AND resource_key = ${key}`);
  return Number(row?.stock ?? 0);
}
async function ledger(batch, nation, type, amount, reason, referenceType, referenceId, now, meta = {}) {
  batch.push(
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                  idempotency_key, reference_type, reference_id, reason, meta, created_at)
         VALUES (${uuid()}, ${nation.id}, ${type}, ${amount}, ${nation.treasury}, ${nation.treasury + amount}, 'coin',
                 ${`${referenceType}:${nation.id}:${uuid()}`}, ${referenceType}, ${referenceId}, ${reason}, ${JSON.stringify(meta)}, ${now})`
  );
}
async function settleRefineries(db, nationId, now = nowSeconds()) {
  const due = await db.all(
    sql`SELECT id, output_key, output_qty FROM nation_refinery_ops WHERE nation_id = ${nationId} AND settled_at IS NULL AND completes_at <= ${now}`
  );
  if (due.length === 0) return 0;
  const batch = [];
  for (const op of due) {
    batch.push(
      sql`UPDATE nation_refinery_ops SET settled_at = ${now} WHERE id = ${op.id} AND settled_at IS NULL`,
      sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
           VALUES (${nationId}, ${op.output_key}, 0, ${op.output_qty}, ${now})
           ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${op.output_qty}, updated_at = ${now}`
    );
  }
  await db.batch(batch);
  return due.length;
}
async function settleContracts(db, nationId, now = nowSeconds()) {
  const nation = await db.first(sql`SELECT * FROM nations WHERE id = ${nationId}`);
  if (!nation) return 0;
  const due = await db.all(
    sql`SELECT id, side, resource_key, quantity, unit_price, total, partner_key FROM nation_contracts
         WHERE nation_id = ${nationId} AND status = 'active' AND completes_at <= ${now}`
  );
  if (due.length === 0) return 0;
  for (const c of due) {
    const batch = [];
    batch.push(sql`UPDATE nation_contracts SET status = 'completed', settled_at = ${now} WHERE id = ${c.id} AND status = 'active'`);
    if (c.side === "export") {
      batch.push(sql`UPDATE nations SET treasury = treasury + ${c.total}, updated_at = ${now} WHERE id = ${nationId}`);
      batch.push(
        sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency,
                                      idempotency_key, reference_type, reference_id, reason, meta, created_at)
             VALUES (${uuid()}, ${nationId}, 'contract', ${c.total}, ${nation.treasury}, ${nation.treasury + c.total}, 'coin',
                     ${`contract-settle:${c.id}`}, 'contract', ${c.id},
                     ${`\u062A\u0633\u0648\u06CC\u0647 \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0635\u0627\u062F\u0631\u0627\u062A ${c.quantity.toLocaleString("en-US")} \u0648\u0627\u062D\u062F ${c.resource_key}`},
                     ${JSON.stringify({ side: "export", resourceKey: c.resource_key, quantity: c.quantity, unitPrice: c.unit_price })}, ${now})`
      );
      batch.push(sql`UPDATE nation_economy SET total_income = total_income + ${c.total}, updated_at = ${now} WHERE nation_id = ${nationId}`);
    } else {
      batch.push(
        sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
             VALUES (${nationId}, ${c.resource_key}, 0, ${c.quantity}, ${now})
             ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${c.quantity}, updated_at = ${now}`
      );
    }
    batch.push(
      sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
           VALUES (${nationId}, 'contract_settle', ${c.resource_key}, ${c.partner_key}, ${c.quantity}, ${c.unit_price}, ${c.total}, ${now})`
    );
    await db.batch(batch);
  }
  return due.length;
}
async function resourceState(db, nation, now = nowSeconds()) {
  await settleRefineries(db, nation.id, now);
  await settleContracts(db, nation.id, now);
  const rows = await db.all(
    sql`SELECT resource_key, reserves, stock FROM nation_resources WHERE nation_id = ${nation.id}`
  );
  const byKey = new Map(rows.map((r) => [String(r.resource_key), { reserves: Number(r.reserves), stock: Number(r.stock) }]));
  const fresh = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  const treasury = Number(fresh?.treasury ?? nation.treasury);
  const resources = RESOURCES.map((r) => ({
    key: r.key,
    emoji: r.emoji,
    nameFa: r.nameFa,
    unitFa: r.unitFa,
    market: r.market,
    extractCost: r.extractCost,
    capacity: r.capacity,
    wells: r.wells,
    reserves: byKey.get(r.key)?.reserves ?? 0,
    stock: byKey.get(r.key)?.stock ?? 0
  }));
  const products = REFINED_PRODUCTS.map((p) => ({
    key: p.key,
    emoji: p.emoji,
    nameFa: p.nameFa,
    unitFa: p.unitFa,
    stock: byKey.get(p.key)?.stock ?? 0
  }));
  const refineryOps = (await db.all(
    sql`SELECT id, recipe_key, input_key, input_qty, output_key, output_qty, cost, started_at, completes_at
            FROM nation_refinery_ops WHERE nation_id = ${nation.id} AND settled_at IS NULL ORDER BY completes_at ASC`
  )).map((op) => ({
    id: Number(op.id),
    recipeKey: String(op.recipe_key),
    inputKey: String(op.input_key),
    inputQty: Number(op.input_qty),
    outputKey: String(op.output_key),
    outputQty: Number(op.output_qty),
    cost: Number(op.cost),
    startedAt: toIso(Number(op.started_at)),
    completesAt: toIso(Number(op.completes_at)),
    completesInSeconds: Math.max(0, Number(op.completes_at) - now)
  }));
  const tradeTotals = await db.first(
    sql`SELECT SUM(CASE WHEN kind IN ('export','contract_settle') THEN total ELSE 0 END) AS export_total,
               SUM(CASE WHEN kind = 'import' THEN total ELSE 0 END) AS import_total,
               SUM(CASE WHEN kind IN ('export','contract_settle') THEN 1 ELSE 0 END) AS export_count,
               SUM(CASE WHEN kind = 'import' THEN 1 ELSE 0 END) AS import_count
          FROM trade_log WHERE nation_id = ${nation.id}`
  );
  const pots = await db.all(sql`SELECT pot_key, amount FROM nation_budget_pots WHERE nation_id = ${nation.id}`);
  const budgets = BUDGET_POTS.map((p) => ({ key: p.key, emoji: p.emoji, nameFa: p.nameFa, amount: Number(pots.find((x) => String(x.pot_key) === p.key)?.amount ?? 0) }));
  return {
    treasury,
    resources,
    products,
    refineryOps,
    tradeTotals: {
      exportTotal: Number(tradeTotals?.export_total ?? 0),
      importTotal: Number(tradeTotals?.import_total ?? 0),
      exportCount: Number(tradeTotals?.export_count ?? 0),
      importCount: Number(tradeTotals?.import_count ?? 0)
    },
    budgets,
    market: RESOURCES.map((r) => ({ key: r.key, emoji: r.emoji, nameFa: r.nameFa, unitFa: r.unitFa, price: r.market }))
  };
}
async function extract(db, nation, key, amount, now = nowSeconds()) {
  const def = resourceDef(key);
  if (!def) throw ApiError.validation("\u0645\u0646\u0628\u0639 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const qty = Math.floor(Number(amount));
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u0627\u0633\u062A\u062E\u0631\u0627\u062C \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (qty > def.capacity) throw ApiError.validation(`\u062D\u062F\u0627\u06A9\u062B\u0631 \u0638\u0631\u0641\u06CC\u062A \u0647\u0631 \u0639\u0645\u0644\u06CC\u0627\u062A ${def.capacity.toLocaleString("en-US")} \u0648\u0627\u062D\u062F \u0627\u0633\u062A.`);
  if (nation.treasury < def.extractCost) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  const row = await db.first(sql`SELECT reserves FROM nation_resources WHERE nation_id = ${nation.id} AND resource_key = ${def.key}`);
  const reserves = Number(row?.reserves ?? 0);
  if (reserves < qty) throw ApiError.validation("\u0630\u062E\u0627\u06CC\u0631 \u0627\u06CC\u0646 \u0645\u0646\u0628\u0639 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.");
  const batch = [
    sql`UPDATE nation_resources SET reserves = reserves - ${qty}, stock = stock + ${qty}, updated_at = ${now}
         WHERE nation_id = ${nation.id} AND resource_key = ${def.key} AND reserves >= ${qty}`,
    sql`UPDATE nations SET treasury = treasury - ${def.extractCost}, updated_at = ${now} WHERE id = ${nation.id}`
  ];
  await ledger(batch, nation, "resource_extract", -def.extractCost, `\u0627\u0633\u062A\u062E\u0631\u0627\u062C ${qty.toLocaleString("en-US")} ${def.unitFa} ${def.nameFa}`, "resource", null, now, { resourceKey: def.key, quantity: qty });
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${def.extractCost}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  await db.batch(batch);
  await audit(db, { actor: null, action: "resource.extract", targetType: "nation", targetId: nation.id, before: { reserves, treasury: nation.treasury }, after: { reserves: reserves - qty, stockDelta: qty }, reason: `\u0627\u0633\u062A\u062E\u0631\u0627\u062C ${def.nameFa}` });
  return { resourceKey: def.key, extracted: qty, cost: def.extractCost, reservesLeft: reserves - qty };
}
async function sellResource(db, nation, key, amount, partnerKey = null, now = nowSeconds()) {
  const def = resourceDef(key);
  if (!def) throw ApiError.validation("\u0645\u0646\u0628\u0639 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const qty = Number(amount);
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u0641\u0631\u0648\u0634 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const income = Math.floor(qty * def.market);
  const stock = await stockOf(db, nation.id, def.key);
  if (stock < qty) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0627\u06CC\u0646 \u0645\u0646\u0628\u0639 \u062F\u0631 \u0627\u0646\u0628\u0627\u0631 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.");
  const isTrade = partnerKey !== null && partnerDef(partnerKey) !== null;
  const batch = [
    sql`UPDATE nation_resources SET stock = stock - ${qty}, updated_at = ${now}
         WHERE nation_id = ${nation.id} AND resource_key = ${def.key} AND stock >= ${qty}`,
    sql`UPDATE nations SET treasury = treasury + ${income}, updated_at = ${now} WHERE id = ${nation.id}`
  ];
  await ledger(
    batch,
    nation,
    isTrade ? "trade_export" : "resource_sale",
    income,
    `${isTrade ? "\u0635\u0627\u062F\u0631\u0627\u062A" : "\u0641\u0631\u0648\u0634"} ${qty.toLocaleString("en-US")} ${def.unitFa} ${def.nameFa}`,
    "resource",
    null,
    now,
    { resourceKey: def.key, quantity: qty, unitPrice: def.market, partnerKey: partnerKey ?? void 0 }
  );
  batch.push(sql`UPDATE nation_economy SET total_income = total_income + ${income}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  if (isTrade && partnerKey) {
    batch.push(
      sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
           VALUES (${nation.id}, 'export', ${def.key}, ${partnerKey}, ${qty}, ${def.market}, ${income}, ${now})`
    );
  }
  await db.batch(batch);
  await audit(db, { actor: null, action: isTrade ? "trade.export" : "resource.sell", targetType: "nation", targetId: nation.id, before: { stock, treasury: nation.treasury }, after: { stock: stock - qty, treasury: nation.treasury + income }, reason: `${isTrade ? "\u0635\u0627\u062F\u0631\u0627\u062A" : "\u0641\u0631\u0648\u0634"} ${def.nameFa}` });
  return { resourceKey: def.key, sold: qty, unitPrice: def.market, total: income, treasury: nation.treasury + income };
}
async function importResource(db, nation, key, quantity, partnerKey, now = nowSeconds()) {
  const def = resourceDef(key);
  if (!def) throw ApiError.validation("\u0645\u0646\u0628\u0639 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const partner = partnerDef(partnerKey);
  if (!partner) throw ApiError.validation("\u06A9\u0634\u0648\u0631 \u0641\u0631\u0648\u0634\u0646\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u062E\u0631\u06CC\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const goods = Math.floor(qty * def.market);
  const total = goods + IMPORT_SHIPPING_FEE;
  if (nation.treasury < total) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  const batch = [
    sql`UPDATE nations SET treasury = treasury - ${total}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
         VALUES (${nation.id}, ${def.key}, 0, ${qty}, ${now})
         ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${qty}, updated_at = ${now}`
  ];
  await ledger(
    batch,
    nation,
    "trade_import",
    -total,
    `\u0648\u0627\u0631\u062F\u0627\u062A ${qty.toLocaleString("en-US")} ${def.unitFa} ${def.nameFa} \u0627\u0632 ${partner.nameFa}`,
    "trade",
    null,
    now,
    { resourceKey: def.key, quantity: qty, unitPrice: def.market, shippingFee: IMPORT_SHIPPING_FEE, partnerKey }
  );
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${total}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  batch.push(
    sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
         VALUES (${nation.id}, 'import', ${def.key}, ${partnerKey}, ${qty}, ${def.market}, ${total}, ${now})`
  );
  await db.batch(batch);
  await audit(db, { actor: null, action: "trade.import", targetType: "nation", targetId: nation.id, before: { treasury: nation.treasury }, after: { treasury: nation.treasury - total }, reason: `\u0648\u0627\u0631\u062F\u0627\u062A ${def.nameFa} \u0627\u0632 ${partner.nameFa}` });
  return { resourceKey: def.key, quantity: qty, goods, shippingFee: IMPORT_SHIPPING_FEE, total, treasury: nation.treasury - total };
}
async function startRefinery(db, nation, recipeKey, now = nowSeconds()) {
  const recipe = recipeDef(recipeKey);
  if (!recipe) throw ApiError.validation("\u062F\u0633\u062A\u0648\u0631 \u067E\u0627\u0644\u0627\u06CC\u0634 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0634\u062F\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const stock = await stockOf(db, nation.id, recipe.inputKey);
  if (stock < recipe.inputQty) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0645\u0627\u062F\u0647\u0654 \u062E\u0627\u0645 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.");
  if (nation.treasury < recipe.cost) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  const inputDef = resourceDef(recipe.inputKey);
  const batch = [
    sql`UPDATE nation_resources SET stock = stock - ${recipe.inputQty}, updated_at = ${now}
         WHERE nation_id = ${nation.id} AND resource_key = ${recipe.inputKey} AND stock >= ${recipe.inputQty}`,
    sql`UPDATE nations SET treasury = treasury - ${recipe.cost}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO nation_refinery_ops (nation_id, recipe_key, input_key, input_qty, output_key, output_qty, cost, started_at, completes_at)
         VALUES (${nation.id}, ${recipe.key}, ${recipe.inputKey}, ${recipe.inputQty}, ${recipe.outputKey}, ${recipe.outputQty}, ${recipe.cost}, ${now}, ${now + recipe.minutes * 60})`
  ];
  await ledger(
    batch,
    nation,
    "refinery",
    -recipe.cost,
    `\u067E\u0627\u0644\u0627\u06CC\u0634 ${recipe.inputQty.toLocaleString("en-US")} ${inputDef.unitFa} ${inputDef.nameFa}`,
    "refinery",
    null,
    now,
    { recipeKey: recipe.key, inputKey: recipe.inputKey, outputKey: recipe.outputKey, outputQty: recipe.outputQty }
  );
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${recipe.cost}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  await db.batch(batch);
  await audit(db, { actor: null, action: "refinery.start", targetType: "nation", targetId: nation.id, reason: `\u067E\u0627\u0644\u0627\u06CC\u0634 ${recipe.key}`, after: { inputQty: recipe.inputQty, cost: recipe.cost } });
  return { recipeKey: recipe.key, inputKey: recipe.inputKey, inputQty: recipe.inputQty, outputKey: recipe.outputKey, outputQty: recipe.outputQty, cost: recipe.cost, completesInSeconds: recipe.minutes * 60 };
}
async function createContract(db, nation, input, now = nowSeconds()) {
  const def = resourceDef(String(input.resourceKey));
  if (!def) throw ApiError.validation("\u0645\u0646\u0628\u0639 \u0645\u0639\u0627\u0645\u0644\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const type = contractTypeDef(String(input.contractType));
  if (!type) throw ApiError.validation("\u0646\u0648\u0639 \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const partner = partnerDef(String(input.partnerKey));
  if (!partner) throw ApiError.validation("\u06A9\u0634\u0648\u0631 \u0637\u0631\u0641 \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  if (input.side !== "export" && input.side !== "import") throw ApiError.validation("\u062C\u0647\u062A \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const qty = Number(input.quantity);
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const total = Math.floor(qty * def.market);
  const completesAt = now + CONTRACT_TERM_DAYS * 86400;
  const batch = [];
  if (input.side === "export") {
    const stock = await stockOf(db, nation.id, def.key);
    if (stock < qty) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0627\u06CC\u0646 \u0645\u0646\u0628\u0639 \u062F\u0631 \u0627\u0646\u0628\u0627\u0631 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.");
    batch.push(sql`UPDATE nation_resources SET stock = stock - ${qty}, updated_at = ${now}
                    WHERE nation_id = ${nation.id} AND resource_key = ${def.key} AND stock >= ${qty}`);
  } else {
    if (nation.treasury < total) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
    batch.push(sql`UPDATE nations SET treasury = treasury - ${total}, updated_at = ${now} WHERE id = ${nation.id}`);
  }
  batch.push(
    sql`INSERT INTO nation_contracts (nation_id, side, contract_type, resource_key, partner_key, quantity, unit_price, total, status, created_at, completes_at)
         VALUES (${nation.id}, ${input.side}, ${type.key}, ${def.key}, ${partner.key}, ${qty}, ${def.market}, ${total}, 'active', ${now}, ${completesAt})`
  );
  if (input.side === "export") {
  } else {
    await ledger(
      batch,
      nation,
      "contract",
      -total,
      `\u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0648\u0627\u0631\u062F\u0627\u062A ${qty.toLocaleString("en-US")} ${def.unitFa} ${def.nameFa} \u0627\u0632 ${partner.nameFa}`,
      "contract",
      null,
      now,
      { side: "import", resourceKey: def.key, quantity: qty, unitPrice: def.market }
    );
    batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${total}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  }
  batch.push(
    sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
         VALUES (${nation.id}, 'contract_create', ${def.key}, ${partner.key}, ${qty}, ${def.market}, ${total}, ${now})`
  );
  await db.batch(batch);
  const row = await db.first(sql`SELECT id FROM nation_contracts WHERE nation_id = ${nation.id} ORDER BY id DESC LIMIT 1`);
  await audit(db, { actor: null, action: "contract.create", targetType: "nation", targetId: nation.id, after: { side: input.side, resourceKey: def.key, quantity: qty, total }, reason: `\u0642\u0631\u0627\u0631\u062F\u0627\u062F ${type.nameFa}` });
  return { contractId: Number(row?.id ?? 0), side: input.side, resourceKey: def.key, quantity: qty, unitPrice: def.market, total, completesInDays: CONTRACT_TERM_DAYS };
}
async function cancelContract(db, nation, contractId, now = nowSeconds()) {
  const row = await db.first(
    sql`SELECT id, side, resource_key, quantity, total, status, partner_key FROM nation_contracts WHERE id = ${contractId} AND nation_id = ${nation.id}`
  );
  if (!row) throw ApiError.notFound("\u0642\u0631\u0627\u0631\u062F\u0627\u062F \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (String(row.status) !== "active") throw ApiError.conflict("\u0627\u06CC\u0646 \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u062F\u06CC\u06AF\u0631 \u0641\u0639\u0627\u0644 \u0646\u06CC\u0633\u062A.");
  const batch = [sql`UPDATE nation_contracts SET status = 'cancelled', settled_at = ${now} WHERE id = ${row.id} AND status = 'active'`];
  if (String(row.side) === "export") {
    batch.push(
      sql`INSERT INTO nation_resources (nation_id, resource_key, reserves, stock, updated_at)
           VALUES (${nation.id}, ${row.resource_key}, 0, ${Number(row.quantity)}, ${now})
           ON CONFLICT (nation_id, resource_key) DO UPDATE SET stock = stock + ${Number(row.quantity)}, updated_at = ${now}`
    );
  } else {
    batch.push(sql`UPDATE nations SET treasury = treasury + ${Number(row.total)}, updated_at = ${now} WHERE id = ${nation.id}`);
    await ledger(
      batch,
      nation,
      "contract",
      Number(row.total),
      `\u0644\u063A\u0648 \u0642\u0631\u0627\u0631\u062F\u0627\u062F \u0648\u0627\u0631\u062F\u0627\u062A \u2014 \u0628\u0627\u0632\u06AF\u0634\u062A ${Number(row.total).toLocaleString("en-US")} \u0633\u06A9\u0647`,
      "contract",
      Number(row.id),
      now,
      { side: "import", cancelled: true }
    );
  }
  batch.push(
    sql`INSERT INTO trade_log (nation_id, kind, resource_key, partner_key, quantity, unit_price, total, created_at)
         VALUES (${nation.id}, 'contract_cancel', ${row.resource_key}, ${row.partner_key}, ${Number(row.quantity)}, 0, ${Number(row.total)}, ${now})`
  );
  await db.batch(batch);
  await audit(db, { actor: null, action: "contract.cancel", targetType: "nation", targetId: nation.id, after: { contractId: row.id }, reason: "\u0644\u063A\u0648 \u0642\u0631\u0627\u0631\u062F\u0627\u062F" });
  return { contractId: row.id, cancelled: true };
}
async function listContracts(db, nation, now = nowSeconds()) {
  await settleContracts(db, nation.id, now);
  const rows = await db.all(
    sql`SELECT id, side, contract_type, resource_key, partner_key, quantity, unit_price, total, status, created_at, completes_at
          FROM nation_contracts WHERE nation_id = ${nation.id} ORDER BY id DESC LIMIT 20`
  );
  return {
    contracts: rows.map((r) => ({
      id: Number(r.id),
      side: String(r.side),
      sideLabelFa: String(r.side) === "export" ? "\u0635\u0627\u062F\u0631\u0627\u062A" : "\u0648\u0627\u0631\u062F\u0627\u062A",
      contractType: String(r.contract_type),
      contractTypeLabelFa: contractTypeDef(String(r.contract_type))?.nameFa ?? String(r.contract_type),
      resourceKey: String(r.resource_key),
      partnerKey: String(r.partner_key),
      partnerLabelFa: partnerDef(String(r.partner_key))?.nameFa ?? String(r.partner_key),
      partnerFlag: partnerDef(String(r.partner_key))?.flag ?? "",
      quantity: Number(r.quantity),
      unitPrice: Number(r.unit_price),
      total: Number(r.total),
      status: String(r.status),
      daysLeft: String(r.status) === "active" ? Math.max(0, Math.ceil((Number(r.completes_at) - now) / 86400)) : null,
      createdAt: toIso(Number(r.created_at)),
      completesAt: toIso(Number(r.completes_at))
    }))
  };
}
async function tradeHistory(db, nationId, limit = 20) {
  const rows = await db.all(
    sql`SELECT id, kind, resource_key, partner_key, quantity, unit_price, total, created_at
          FROM trade_log WHERE nation_id = ${nationId} ORDER BY id DESC LIMIT ${Math.min(50, Math.max(1, limit))}`
  );
  const kindFa2 = { import: "\u0648\u0627\u0631\u062F\u0627\u062A", export: "\u0635\u0627\u062F\u0631\u0627\u062A", contract_create: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F (\u0627\u06CC\u062C\u0627\u062F)", contract_settle: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F (\u062A\u0633\u0648\u06CC\u0647)", contract_cancel: "\u0642\u0631\u0627\u0631\u062F\u0627\u062F (\u0644\u063A\u0648)" };
  return {
    rows: rows.map((r) => ({
      id: Number(r.id),
      kind: String(r.kind),
      kindLabelFa: kindFa2[String(r.kind)] ?? String(r.kind),
      resourceKey: String(r.resource_key),
      partnerKey: String(r.partner_key),
      partnerLabelFa: partnerDef(String(r.partner_key))?.nameFa ?? String(r.partner_key),
      partnerFlag: partnerDef(String(r.partner_key))?.flag ?? "",
      quantity: Number(r.quantity),
      unitPrice: Number(r.unit_price),
      total: Number(r.total),
      createdAt: toIso(Number(r.created_at))
    }))
  };
}
async function budgetAllocate(db, nation, potKey, amount, now = nowSeconds()) {
  const pot = BUDGET_POTS.find((p) => p.key === potKey);
  if (!pot) throw ApiError.validation("\u0633\u0631\u0641\u0635\u0644 \u0628\u0648\u062F\u062C\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const qty = Math.floor(Number(amount));
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation("\u0645\u0628\u0644\u063A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (nation.treasury < qty) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u0627\u06A9\u0627\u0641\u06CC \u0627\u0633\u062A.");
  const batch = [
    sql`UPDATE nations SET treasury = treasury - ${qty}, updated_at = ${now} WHERE id = ${nation.id}`,
    sql`INSERT INTO nation_budget_pots (nation_id, pot_key, amount, updated_at)
         VALUES (${nation.id}, ${pot.key}, ${qty}, ${now})
         ON CONFLICT (nation_id, pot_key) DO UPDATE SET amount = amount + ${qty}, updated_at = ${now}`
  ];
  await ledger(batch, nation, "budget_transfer", -qty, `\u0648\u0627\u0631\u06CC\u0632 \u0628\u0647 ${pot.nameFa}`, "budget", null, now, { potKey: pot.key });
  batch.push(sql`UPDATE nation_economy SET total_spent = total_spent + ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id}`);
  await db.batch(batch);
  return { potKey: pot.key, allocated: qty, treasury: nation.treasury - qty };
}
async function budgetWithdraw(db, nation, potKey, amount, now = nowSeconds()) {
  const pot = BUDGET_POTS.find((p) => p.key === potKey);
  if (!pot) throw ApiError.validation("\u0633\u0631\u0641\u0635\u0644 \u0628\u0648\u062F\u062C\u0647 \u0645\u0639\u062A\u0628\u0631 \u0646\u06CC\u0633\u062A.");
  const qty = Math.floor(Number(amount));
  if (!Number.isFinite(qty) || qty <= 0) throw ApiError.validation("\u0645\u0628\u0644\u063A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const row = await db.first(sql`SELECT amount FROM nation_budget_pots WHERE nation_id = ${nation.id} AND pot_key = ${pot.key}`);
  const current = Number(row?.amount ?? 0);
  if (current < qty) throw ApiError.validation("\u0645\u0648\u062C\u0648\u062F\u06CC \u0627\u06CC\u0646 \u0633\u0631\u0641\u0635\u0644 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A.");
  const batch = [
    sql`UPDATE nation_budget_pots SET amount = amount - ${qty}, updated_at = ${now} WHERE nation_id = ${nation.id} AND pot_key = ${pot.key} AND amount >= ${qty}`,
    sql`UPDATE nations SET treasury = treasury + ${qty}, updated_at = ${now} WHERE id = ${nation.id}`
  ];
  await ledger(batch, nation, "budget_transfer", qty, `\u0628\u0631\u062F\u0627\u0634\u062A \u0627\u0632 ${pot.nameFa}`, "budget", null, now, { potKey: pot.key });
  await db.batch(batch);
  return { potKey: pot.key, withdrawn: qty, treasury: nation.treasury + qty };
}

// apps/worker/src/api/routes/player.ts
var playerRoutes = new Hono3();
playerRoutes.use(requireUser);
playerRoutes.use(requireNation);
function parse(schema, body) {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}
playerRoutes.get("/nation", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const view = await buildNationView(db, c.get("nation"), settings, { includeStarter: true });
  const unread = await unreadCount(db, c.get("user").nationIds);
  return c.json({ ...view, unreadNotifications: unread });
});
playerRoutes.patch("/nation", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse(nationUpdateSchema, await parseJson(c));
  const nation = c.get("nation");
  const changed = await updateNationProfile(db, nation, body, settings, actorOf(c.get("user")));
  const fresh = await db.first(sql`SELECT * FROM nations WHERE id = ${nation.id}`);
  const view = fresh ? await buildNationView(db, fresh, settings) : null;
  return c.json({ changed, view });
});
playerRoutes.get("/economy", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const view = await buildNationView(db, c.get("nation"), settings);
  const days = Math.min(180, Math.max(7, Number(c.req.query("days") ?? 30)));
  const history = await treasuryHistory(db, c.get("nation").id, days);
  return c.json({ economy: view.economy, history });
});
playerRoutes.get("/transactions", async (c) => {
  const db = c.get("db");
  const limit = Math.min(50, Math.max(5, Number(c.req.query("limit") ?? 20)));
  const offset = Math.max(0, Number(c.req.query("offset") ?? 0));
  const res = await listTransactions(db, c.get("nation").id, { limit, offset, type: c.req.query("type") ?? null });
  return c.json(res);
});
playerRoutes.get("/inventory", async (c) => inventoryHandler(c));
playerRoutes.get("/military", async (c) => inventoryHandler(c));
async function inventoryHandler(c) {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const groups = await inventoryView(db, c.get("nation").id, settings);
  const search = (c.req.query("q") ?? "").trim().toLowerCase();
  const category = c.req.query("category") ?? null;
  let out = groups;
  if (category && category !== "all") out = out.filter((g) => g.categoryKey === category);
  if (search) {
    out = out.map((g) => ({ ...g, items: g.items.filter((i) => i.nameFa.toLowerCase().includes(search) || String(i.code).toLowerCase().includes(search)) })).filter((g) => g.items.length > 0);
  }
  return c.json({ groups: out, totalCategories: groups.length });
}
playerRoutes.get("/defense", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  return c.json(await buildDefenseView(db, c.get("nation"), settings));
});
playerRoutes.get("/defense-plan", async (c) => {
  const db = c.get("db");
  const ns = await db.first(
    sql`SELECT defense_plan FROM nation_settings WHERE nation_id = ${c.get("nation").id}`
  );
  let plan = null;
  try {
    const parsed = ns?.defense_plan ? JSON.parse(ns.defense_plan) : null;
    plan = Array.isArray(parsed) ? parsed.filter((k) => typeof k === "string") : null;
  } catch {
    plan = null;
  }
  return c.json({ plan, tiles: DEFENSE_ARRANGEMENT });
});
playerRoutes.put("/defense-plan", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ categories: external_exports2.array(external_exports2.string()).max(DEFENSE_ARRANGEMENT.length).nullable() }), await parseJson(c));
  let value = null;
  if (body.categories !== null) {
    const unique = [...new Set(body.categories)];
    const invalid = unique.filter((k) => !DEFENSE_ARRANGEMENT_KEYS.includes(k));
    if (invalid.length) throw ApiError.validation(`\u062F\u0633\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: ${invalid.join("\u060C ")}`);
    value = JSON.stringify(unique);
  }
  await db.run(
    sql`INSERT INTO nation_settings (nation_id, defense_plan, updated_at) VALUES (${c.get("nation").id}, ${value}, ${nowSeconds()})
        ON CONFLICT (nation_id) DO UPDATE SET defense_plan = excluded.defense_plan, updated_at = excluded.updated_at`
  );
  return c.json({ plan: value === null ? null : JSON.parse(value) });
});
playerRoutes.get("/daily-prize", async (c) => {
  const db = c.get("db");
  const state = await prizeState(db, c.get("nation").id);
  return c.json({ ...state, prizes: publicPrizes() });
});
playerRoutes.post("/daily-prize/claim", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const result = await claimDailyPrize(db, c.get("nation"), settings, { botToken: c.env.BOT_TOKEN });
  return c.json(result);
});
playerRoutes.get("/bank", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  return c.json(await bankState(db, c.get("nation"), settings));
});
playerRoutes.post("/bank/income-claim", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const result = await claimIncome(db, c.get("nation"), settings);
  return c.json(result);
});
playerRoutes.post("/bank/loan", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ principal: external_exports2.number().int().positive() }), await parseJson(c));
  const nation = c.get("nation");
  const result = await takeLoan(db, nation, body.principal);
  return c.json(result);
});
playerRoutes.post("/bank/loan/repay", async (c) => {
  const db = c.get("db");
  const body = await c.req.json().catch(() => ({}));
  const amount = typeof body.amount === "number" ? Number(body.amount) : void 0;
  const result = await repayLoan(db, c.get("nation"), nowSeconds(), amount);
  return c.json(result);
});
playerRoutes.get("/bank/loans", async (c) => {
  const db = c.get("db");
  return c.json(await listLoans(db, c.get("nation").id));
});
playerRoutes.get("/resources", async (c) => {
  const db = c.get("db");
  return c.json(await resourceState(db, c.get("nation")));
});
playerRoutes.post("/resources/:key/extract", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ amount: external_exports2.coerce.number().positive() }), await parseJson(c));
  const result = await extract(db, c.get("nation"), c.req.param("key"), body.amount);
  return c.json(result);
});
playerRoutes.post("/resources/:key/sell", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ amount: external_exports2.coerce.number().positive(), partnerKey: external_exports2.string().optional() }), await parseJson(c));
  const result = await sellResource(db, c.get("nation"), c.req.param("key"), body.amount, body.partnerKey ?? null);
  return c.json(result);
});
playerRoutes.post("/trade/import", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ resourceKey: external_exports2.string().min(1), quantity: external_exports2.coerce.number().positive(), partnerKey: external_exports2.string().min(1) }), await parseJson(c));
  const result = await importResource(db, c.get("nation"), body.resourceKey, body.quantity, body.partnerKey);
  return c.json(result);
});
playerRoutes.post("/trade/export", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ resourceKey: external_exports2.string().min(1), quantity: external_exports2.coerce.number().positive(), partnerKey: external_exports2.string().min(1) }), await parseJson(c));
  const result = await sellResource(db, c.get("nation"), body.resourceKey, body.quantity, body.partnerKey);
  return c.json(result);
});
playerRoutes.get("/trade/history", async (c) => {
  const db = c.get("db");
  return c.json(await tradeHistory(db, c.get("nation").id, Number(c.req.query("limit") ?? 20)));
});
playerRoutes.post("/refinery/start", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ recipeKey: external_exports2.string().min(1) }), await parseJson(c));
  const result = await startRefinery(db, c.get("nation"), body.recipeKey);
  return c.json(result);
});
playerRoutes.get("/contracts", async (c) => {
  const db = c.get("db");
  return c.json(await listContracts(db, c.get("nation")));
});
playerRoutes.post("/contracts", async (c) => {
  const db = c.get("db");
  const body = parse(
    external_exports2.object({
      side: external_exports2.enum(["export", "import"]),
      contractType: external_exports2.string().min(1),
      resourceKey: external_exports2.string().min(1),
      partnerKey: external_exports2.string().min(1),
      quantity: external_exports2.coerce.number().positive()
    }),
    await parseJson(c)
  );
  const result = await createContract(db, c.get("nation"), body);
  return c.json(result);
});
playerRoutes.post("/contracts/:id/cancel", async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));
  const result = await cancelContract(db, c.get("nation"), id);
  return c.json(result);
});
playerRoutes.post("/budget/allocate", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ potKey: external_exports2.string().min(1), amount: external_exports2.coerce.number().positive() }), await parseJson(c));
  const result = await budgetAllocate(db, c.get("nation"), body.potKey, body.amount);
  return c.json(result);
});
playerRoutes.post("/budget/withdraw", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ potKey: external_exports2.string().min(1), amount: external_exports2.coerce.number().positive() }), await parseJson(c));
  const result = await budgetWithdraw(db, c.get("nation"), body.potKey, body.amount);
  return c.json(result);
});
playerRoutes.get("/buildings", async (c) => {
  const db = c.get("db");
  return c.json(await buildState(db, c.get("nation")));
});
playerRoutes.post("/buildings", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ buildingKey: external_exports2.string().min(1) }), await parseJson(c));
  const result = await construct(db, c.get("nation"), body.buildingKey, nowSeconds(), buildSpeed(c.env));
  return c.json(result);
});
playerRoutes.get("/industries", async (c) => {
  return c.json(await industryState(c.get("db"), c.get("nation")));
});
playerRoutes.post("/industries/start", async (c) => {
  const body = parse(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive(), quantity: external_exports2.coerce.number().int().min(1).max(1e4) }), await parseJson(c));
  return c.json(await startProduction(c.get("db"), c.get("nation"), body));
});
playerRoutes.post("/industries/claim", async (c) => {
  const body = parse(external_exports2.object({ orderId: external_exports2.string().min(1) }), await parseJson(c));
  return c.json(await claimProduction(c.get("db"), c.get("nation"), body.orderId));
});
playerRoutes.post("/industries/upgrade-factory", async (c) => {
  const body = parse(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive() }), await parseJson(c));
  return c.json(await upgradeFactory(c.get("db"), c.get("nation"), body.templateId));
});
playerRoutes.get("/arsenal", async (c) => {
  return c.json(await arsenalState(c.get("db"), c.get("nation")));
});
playerRoutes.post("/arsenal/deploy", async (c) => {
  const body = parse(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive(), quantity: external_exports2.coerce.number().int().min(1).max(1e6) }), await parseJson(c));
  return c.json(await deployUnits(c.get("db"), c.get("nation"), body.templateId, body.quantity));
});
playerRoutes.post("/arsenal/recall", async (c) => {
  const body = parse(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive(), quantity: external_exports2.coerce.number().int().min(1).max(1e6) }), await parseJson(c));
  return c.json(await recallUnits(c.get("db"), c.get("nation"), body.templateId, body.quantity));
});
playerRoutes.get("/army", async (c) => {
  return c.json(await armyState(c.get("db"), c.get("nation")));
});
playerRoutes.post("/army/repair", async (c) => {
  return c.json(await repairEquipment(c.get("db"), c.get("nation")));
});
playerRoutes.post("/army/supply", async (c) => {
  const body = parse(external_exports2.object({ kind: external_exports2.enum(["fuel", "ammo"]) }), await parseJson(c));
  return c.json(await supply(c.get("db"), c.get("nation"), body.kind));
});
playerRoutes.get("/security", async (c) => {
  return c.json(await securityState(c.get("db"), c.get("nation")));
});
playerRoutes.post("/security/police", async (c) => {
  const body = parse(external_exports2.object({ quantity: external_exports2.coerce.number().int().min(1).max(500) }), await parseJson(c));
  return c.json(await hirePolice(c.get("db"), c.get("nation"), body.quantity));
});
playerRoutes.post("/security/border", async (c) => {
  return c.json(await upgradeBorder(c.get("db"), c.get("nation")));
});
playerRoutes.post("/security/infra", async (c) => {
  return c.json(await upgradeInfra(c.get("db"), c.get("nation")));
});
playerRoutes.post("/security/protect", async (c) => {
  const body = parse(
    external_exports2.object({
      assetType: external_exports2.enum(["factory", "mine", "building"]),
      assetRef: external_exports2.string().min(1).max(64),
      assetName: external_exports2.string().min(1).max(120)
    }),
    await parseJson(c)
  );
  return c.json(await toggleProtectedAsset(c.get("db"), c.get("nation"), body));
});
playerRoutes.get("/population", async (c) => {
  return c.json(await populationState(c.get("db"), c.get("nation")));
});
playerRoutes.post("/population/upgrade", async (c) => {
  const body = parse(external_exports2.object({ kind: external_exports2.enum(["hospital", "school", "housing"]) }), await parseJson(c));
  return c.json(await upgradePopulation(c.get("db"), c.get("nation"), body.kind));
});
playerRoutes.get("/notifications", async (c) => {
  const db = c.get("db");
  const rows = await listNotifications(db, c.get("nation").id, Number(c.req.query("limit") ?? 30));
  return c.json({
    rows: rows.map((r) => ({
      id: Number(r.id),
      kind: String(r.kind),
      title: String(r.title),
      body: String(r.body),
      isRead: Number(r.is_read) === 1,
      createdAt: toIso(Number(r.created_at))
    }))
  });
});
playerRoutes.post("/notifications/read", async (c) => {
  const db = c.get("db");
  const body = await c.req.json().catch(() => ({}));
  const id = Number(body.id ?? 0) || void 0;
  await markRead(db, c.get("user").nationIds, id);
  return c.json({ ok: true });
});
playerRoutes.post("/settings/notifications", async (c) => {
  const db = c.get("db");
  const body = parse(external_exports2.object({ enabled: external_exports2.coerce.boolean() }), await parseJson(c));
  await db.run(
    sql`UPDATE nation_settings SET notify_enabled = ${body.enabled ? 1 : 0}, updated_at = ${nowSeconds()} WHERE nation_id = ${c.get("nation").id}`
  );
  return c.json({ enabled: body.enabled });
});
playerRoutes.post("/sessions/revoke-all", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const at = nowSeconds();
  await db.run(sql`UPDATE sessions SET revoked_at = ${at} WHERE user_id = ${user.userId} AND revoked_at IS NULL`);
  return c.json({ ok: true });
});
playerRoutes.post("/settings/active-nation", async (c) => {
  const user = c.get("user");
  const body = parse(external_exports2.object({ nationId: external_exports2.coerce.number().int().positive() }), await parseJson(c));
  const { setActiveNation: setActiveNation2 } = await Promise.resolve().then(() => (init_authService(), authService_exports));
  return c.json(await setActiveNation2(c.get("db"), user.userId, user.sessionId, body.nationId, user.nationIds));
});
function mountPlayer(app2) {
  app2.route("/api/player", playerRoutes);
}

// apps/worker/src/api/routes/shop.ts
init_src();
init_errors2();
init_sql();

// apps/worker/src/core/rateLimit.ts
init_sql();
init_errors2();
init_format();
var memory = /* @__PURE__ */ new Map();
async function enforceRateLimit(db, bucket, limit, windowSeconds, opts = {}) {
  const now = nowSeconds();
  const resetAt = now + windowSeconds;
  const hit = memory.get(bucket);
  if (hit && hit.resetAt > now) {
    if (hit.count >= limit) throw ApiError.rateLimited("\u062A\u0639\u062F\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u0634\u0645\u0627 \u0628\u06CC\u0634 \u0627\u0632 \u062D\u062F \u0645\u062C\u0627\u0632 \u0627\u0633\u062A. \u06A9\u0645\u06CC \u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F.", hit.resetAt - now);
    hit.count += 1;
    if (memory.size > 5e3) memory.clear();
    return;
  }
  memory.set(bucket, { count: 1, resetAt });
  if (!opts.durable) return;
  const windowStart = now - windowSeconds;
  const row = await db.first(
    sql`SELECT COUNT(*) AS c FROM rate_limits WHERE bucket = ${bucket} AND window_at > ${windowStart}`
  );
  const count = Number(row?.c ?? 0);
  if (count >= limit) {
    throw ApiError.rateLimited("\u0633\u0642\u0641 \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u0627\u06CC\u0646 \u0639\u0645\u0644\u06CC\u0627\u062A \u067E\u0631 \u0634\u062F\u0647 \u0627\u0633\u062A. \u06A9\u0645\u06CC \u0628\u0639\u062F \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.", Math.max(1, windowSeconds - now % windowSeconds));
  }
  await db.run(sql`INSERT INTO rate_limits (bucket, window_at, created_at) VALUES (${bucket}, ${now}, ${now})`);
}

// apps/worker/src/api/routes/helpers.ts
init_sql();
init_warService();
async function loadNationsPublic(db, opts = {}) {
  return listNations(db, {
    search: opts.search ?? null,
    limit: Math.min(50, Math.max(1, Number(opts.limit ?? 20))),
    offset: Math.max(0, Number(opts.offset ?? 0))
  });
}

// apps/worker/src/api/routes/shop.ts
var shopRoutes = new Hono3();
shopRoutes.use(requireUser);
function parse2(schema, body) {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}
shopRoutes.get("/categories", async (c) => {
  const cats = await listCategories(c.get("db"));
  return c.json({ categories: cats, enabled: (await settingsFor(c)).features.shopEnabled });
});
shopRoutes.get("/category/:key", requireNation, async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const offset = Math.max(0, Number(c.req.query("offset") ?? 0));
  const res = await listCategoryItems(db, c.get("nation"), c.req.param("key"), settings);
  return c.json({ ...res, offset, pageSize: 12, treasury: c.get("nation").treasury });
});
shopRoutes.get("/nations", async (c) => {
  const db = c.get("db");
  return c.json({ nations: await loadNationsPublic(db, { search: c.req.query("q") ?? null, limit: c.req.query("limit"), offset: c.req.query("offset") }) });
});
shopRoutes.post("/purchase", requireNation, async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const nation = c.get("nation");
  const body = parse2(purchaseSchema, await parseJson(c));
  const user = c.get("user");
  await enforceRateLimit(db, `buy:${user.userId}`, 30, 60, { durable: true });
  const result = await purchase(
    db,
    nation,
    { templateId: body.templateId, quantity: body.quantity, idempotencyKey: body.idempotencyKey },
    settings,
    actorOf(user),
    c.env.BOT_TOKEN
  );
  const fresh = await db.first(sql`SELECT treasury FROM nations WHERE id = ${nation.id}`);
  return c.json({
    ...result,
    treasuryAfter: Number(fresh?.treasury ?? result.treasuryAfter),
    message: result.duplicate ? "\u0627\u06CC\u0646 \u062E\u0631\u06CC\u062F \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0628\u0648\u062F\u061B \u0645\u0628\u0644\u063A \u062F\u0648\u0628\u0627\u0631\u0647 \u06A9\u0633\u0631 \u0646\u0634\u062F." : `${result.quantity.toLocaleString("en-US")} \u0639\u062F\u062F ${result.nameFa} \u0628\u0647 \u0627\u0646\u0628\u0627\u0631 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F.`
  });
});
var warRoutes = new Hono3();
warRoutes.use(requireUser);
warRoutes.use(requireNation);
warRoutes.get("/wars", async (c) => {
  const db = c.get("db");
  const { getWarsForNation: getWarsForNation2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  return c.json({ wars: await getWarsForNation2(db, c.get("nation").id) });
});
warRoutes.get("/wars/:id", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  const { getWarDetail: getWarDetail2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  return c.json(await getWarDetail2(db, Number(c.req.param("id")), user.nationIds, user.role === "admin" || user.role === "super_admin"));
});
warRoutes.post("/propose", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse2(
    external_exports2.object({
      targetNationId: external_exports2.coerce.number().int().positive(),
      indemnityOffered: external_exports2.coerce.number().int().min(0).max(1e9).optional().default(0),
      attackPlan: external_exports2.array(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive(), quantity: external_exports2.coerce.number().int().min(1).max(1e6) })).max(40).optional()
    }),
    await parseJson(c)
  );
  await enforceRateLimit(db, `war:${c.get("user").userId}`, 10, 3600, { durable: true });
  const { proposeWar: proposeWar2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  const res = await proposeWar2(db, c.get("nation"), body.targetNationId, body.indemnityOffered ?? 0, settings, actorOf(c.get("user")), c.env.BOT_TOKEN, body.attackPlan);
  return c.json(res);
});
function warIdOf(raw2) {
  return parse2(external_exports2.coerce.number().int().positive(), raw2);
}
warRoutes.post("/:id/respond", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse2(external_exports2.object({ accept: external_exports2.coerce.boolean() }), await parseJson(c));
  const { respondToWar: respondToWar2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  return c.json(await respondToWar2(db, warIdOf(c.req.param("id")), body.accept, c.get("nation"), settings, c.env.BOT_TOKEN));
});
warRoutes.post("/:id/round", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const { resolveRound: resolveRound2, getWarDetail: getWarDetail2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  const id = warIdOf(c.req.param("id"));
  const res = await resolveRound2(db, id, settings);
  const detail = await getWarDetail2(db, id, [c.get("nation").id], false);
  return c.json({ ...res, war: detail.war, report: detail.reports[0] ?? null });
});
warRoutes.post("/:id/peace", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const { requestPeace: requestPeace2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  return c.json(await requestPeace2(db, warIdOf(c.req.param("id")), c.get("nation"), settings, c.env.BOT_TOKEN));
});
warRoutes.post("/peace/:id/respond", async (c) => {
  const db = c.get("db");
  const body = parse2(external_exports2.object({ accept: external_exports2.coerce.boolean() }), await parseJson(c));
  const { respondPeace: respondPeace2 } = await Promise.resolve().then(() => (init_warService(), warService_exports));
  return c.json(await respondPeace2(db, warIdOf(c.req.param("id")), body.accept, c.get("nation"), c.env.BOT_TOKEN));
});
warRoutes.post("/preview", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse2(
    external_exports2.object({
      targetNationId: external_exports2.coerce.number().int().positive(),
      attackPlan: external_exports2.array(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive(), quantity: external_exports2.coerce.number().int().min(1).max(1e6) })).max(40).optional()
    }),
    await parseJson(c)
  );
  const { previewForWarTarget: previewForWarTarget2 } = await Promise.resolve().then(() => (init_botActions(), botActions_exports));
  return c.json(await previewForWarTarget2(db, c.get("nation"), body.targetNationId, settings, body.attackPlan));
});
function mountShop(app2) {
  app2.route("/api/shop", shopRoutes);
  app2.route("/api/war", warRoutes);
}

// apps/worker/src/api/routes/diplomacy.ts
init_src();
init_errors2();
init_diplomacyService();
init_sql();
var diplomacyRoutes = new Hono3();
diplomacyRoutes.use(requireUser);
diplomacyRoutes.use(requireNation);
function parse3(schema, body) {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}
diplomacyRoutes.get("/relations", async (c) => c.json({ relations: await listRelations(c.get("db"), c.get("nation").id) }));
diplomacyRoutes.get("/requests", async (c) => {
  const db = c.get("db");
  const status = c.req.query("status") ?? "pending";
  const nationId = c.get("nation").id;
  return c.json({
    incoming: await listIncoming(db, nationId, status),
    outgoing: await listOutgoing(db, nationId, status)
  });
});
diplomacyRoutes.post("/request", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse3(diplomacyRequestSchema, await parseJson(c));
  await enforceRateLimit(db, `dip:${c.get("user").userId}`, 30, 3600, { durable: true });
  if (body.kind === "war") throw ApiError.validation("\u0628\u0631\u0627\u06CC \u0627\u0639\u0644\u0627\u0645 \u062C\u0646\u06AF \u0627\u0632 \u0628\u062E\u0634 \u062C\u0646\u06AF \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
  const res = await sendRequest(
    db,
    c.get("nation"),
    { toNationId: body.toNationId, kind: body.kind, message: body.message ?? null, allianceName: body.allianceName ?? null },
    settings,
    c.env.BOT_TOKEN
  );
  return c.json(res);
});
function pathId(raw2) {
  return parse3(external_exports2.coerce.number().int().positive(), raw2);
}
diplomacyRoutes.post("/request/:id/decide", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse3(external_exports2.object({ requestId: external_exports2.coerce.number().int().positive().optional(), accept: external_exports2.coerce.boolean() }), await parseJson(c));
  const requestId = pathId(c.req.param("id"));
  if (body.requestId && body.requestId !== requestId) throw ApiError.validation("\u0634\u0646\u0627\u0633\u0647 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u0631 \u0622\u062F\u0631\u0633 \u0648 \u0628\u062F\u0646\u0647 \u06CC\u06A9\u06CC \u0646\u06CC\u0633\u062A.");
  const res = await decideRequest(db, requestId, c.get("nation"), body.accept, settings, actorOf(c.get("user")), c.env.BOT_TOKEN);
  return c.json(res);
});
diplomacyRoutes.post("/request/:id/cancel", async (c) => {
  return c.json(await cancelRequest(c.get("db"), pathId(c.req.param("id")), c.get("nation")));
});
diplomacyRoutes.post("/dissolve", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse3(external_exports2.object({ otherNationId: external_exports2.coerce.number().int().positive() }), await parseJson(c));
  return c.json(await dissolveRelation(db, c.get("nation"), body.otherNationId, settings, c.env.BOT_TOKEN));
});
diplomacyRoutes.get("/alliance", async (c) => c.json({ alliance: await myAlliance(c.get("db"), c.get("nation").id) }));
diplomacyRoutes.post("/alliance", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse3(external_exports2.object({ name: external_exports2.string().trim().min(3).max(40) }), await parseJson(c));
  return c.json(await createAlliance(db, c.get("nation"), body.name, settings));
});
diplomacyRoutes.post("/alliance/leave", async (c) => {
  const db = c.get("db");
  const mine = await db.first(
    sql`SELECT alliance_id FROM alliance_members WHERE nation_id = ${c.get("nation").id} LIMIT 1`
  );
  if (!mine) throw ApiError.notFound("\u0634\u0645\u0627 \u0639\u0636\u0648 \u0647\u06CC\u0686 \u0627\u062A\u062D\u0627\u062F\u06CC \u0646\u06CC\u0633\u062A\u06CC\u062F.");
  return c.json(await leaveAlliance(db, c.get("nation"), Number(mine.alliance_id)));
});
function mountDiplomacy(app2) {
  app2.route("/api/diplomacy", diplomacyRoutes);
}

// apps/worker/src/api/routes/statements.ts
init_src();
init_errors2();

// apps/worker/src/services/statementService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_auditService();
function sanitize(raw2) {
  return raw2.replace(/\r\n/g, "\n").replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, MAX_STATEMENT_CHARS);
}
function validateStatement(text) {
  const clean = sanitize(text ?? "");
  if (clean.length < 10) throw ApiError.validation("\u0645\u062A\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06F1\u06F0 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F.");
  if (clean.length > MAX_STATEMENT_CHARS) throw ApiError.validation(`\u062D\u062F\u0627\u06A9\u062B\u0631 \u0637\u0648\u0644 \u0628\u06CC\u0627\u0646\u06CC\u0647 ${MAX_STATEMENT_CHARS} \u0646\u0648\u06CC\u0633\u0647 \u0627\u0633\u062A.`);
  return clean;
}
async function createStatement(db, nation, input, settings, actor) {
  if (!settings.features.statementsEnabled) throw ApiError.disabled("\u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0647\u0627");
  if (nation.status === "banned" || nation.status === "frozen") throw ApiError.forbidden("\u0627\u0645\u06A9\u0627\u0646 \u0627\u0646\u062A\u0634\u0627\u0631 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F.");
  const text = validateStatement(input.text);
  const needsReview = settings.features.statementsRequireApproval;
  const status = needsReview ? "pending_review" : "published";
  const at = nowSeconds();
  const row = await db.first(
    sql`INSERT INTO statements (uuid, nation_id, leader_snapshot, text, status, published_at, created_via, created_at, updated_at)
         VALUES (${uuid()}, ${nation.id}, ${nation.leader_name}, ${text}, ${status}, ${status === "published" ? at : null},
                 ${input.via ?? "bot"}, ${at}, ${at})
         RETURNING id`
  );
  const statementId = Number(row?.id ?? 0);
  await db.run(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, statement_id, is_active, created_at)
         VALUES ('statement', ${`${nation.flag} \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0631\u0633\u0645\u06CC ${nation.name}`}, ${truncate(text, 900)}, 'global', ${nation.id}, ${statementId}, ${status === "published" ? 1 : 0}, ${at})`
  );
  if (status === "pending_review") {
    await db.run(
      sql`INSERT INTO notifications (nation_id, user_id, kind, title, body, is_read, created_at)
           SELECT ${nation.id}, owner_user_id, 'statement', 'بیانیه در انتظار بررسی',
                  'بیانیه شما ثبت شد و پس از تأیید مدیر منتشر می‌شود.', 0, ${at} FROM nations WHERE id = ${nation.id}`
    );
  }
  await audit(db, { actor, action: "statement.create", targetType: "statement", targetId: statementId, after: { status, length: text.length } });
  return { statementId, status, statusLabelFa: STATEMENT_STATUS_LABELS_FA[status], preview: text };
}
async function listMyStatements(db, nationIds, limit = 30) {
  if (nationIds.length === 0) return [];
  const rows = await db.all(
    sql`SELECT s.*, n.name AS nation_name, n.flag AS flag
          FROM statements s JOIN nations n ON n.id = s.nation_id
         WHERE s.nation_id IN (${nationIds}) AND s.status <> 'removed'
         ORDER BY s.id DESC LIMIT ${Math.min(100, Math.max(1, limit))}`
  );
  return rows.map(mapStatement);
}
function mapStatement(r) {
  const status = String(r.status);
  return {
    id: Number(r.id),
    nationId: Number(r.nation_id),
    nationName: String(r.nation_name ?? ""),
    flag: String(r.flag ?? ""),
    leaderName: String(r.leader_snapshot ?? ""),
    text: String(r.text),
    status,
    statusLabelFa: STATEMENT_STATUS_LABELS_FA[status] ?? status,
    createdAt: toIso(Number(r.created_at)),
    publishedAt: toIso(r.published_at === null ? null : Number(r.published_at)),
    reviewNote: r.review_note ?? null
  };
}
async function cancelStatement(db, statementId, nationIds) {
  const row = await db.first(
    sql`SELECT id, status, nation_id FROM statements WHERE id = ${statementId}`
  );
  if (!row) throw ApiError.notFound("\u0628\u06CC\u0627\u0646\u06CC\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (!nationIds.includes(row.nation_id)) throw ApiError.forbidden("\u0627\u06CC\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A.");
  if (row.status === "published") {
    await db.batch([
      sql`UPDATE statements SET status = 'removed', updated_at = ${nowSeconds()} WHERE id = ${statementId}`,
      sql`UPDATE announcements SET is_active = 0 WHERE statement_id = ${statementId}`
    ]);
    return { status: "removed" };
  }
  if (row.status !== "pending_review") throw ApiError.conflict("\u0627\u06CC\u0646 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0642\u0627\u0628\u0644 \u0644\u063A\u0648 \u0646\u06CC\u0633\u062A.");
  await db.run(sql`UPDATE statements SET status = 'draft', updated_at = ${nowSeconds()} WHERE id = ${statementId}`);
  return { status: "draft" };
}
async function adminListStatements(db, filter = {}) {
  const limit = Math.min(100, Math.max(1, filter.limit ?? 30));
  const offset = Math.max(0, filter.offset ?? 0);
  const where = [];
  const bindings = [];
  if (filter.status && filter.status !== "all") {
    where.push("s.status = ?");
    bindings.push(filter.status);
  }
  if (filter.search) {
    where.push("(s.text LIKE ? OR n.name LIKE ?)");
    bindings.push(`%${filter.search}%`, `%${filter.search}%`);
  }
  const rows = await db.all({
    sql: `SELECT s.*, n.name AS nation_name, n.flag AS flag
            FROM statements s JOIN nations n ON n.id = s.nation_id
           ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
           ORDER BY s.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset]
  });
  const counts = await db.all(sql`SELECT status, COUNT(*) AS c FROM statements GROUP BY status`);
  return { rows: rows.map(mapStatement), counts: Object.fromEntries(counts.map((c) => [c.status, Number(c.c)])) };
}
async function adminReviewStatement(db, statementId, decision, note, actor) {
  const row = await db.first(
    sql`SELECT id, nation_id, status, text FROM statements WHERE id = ${statementId}`
  );
  if (!row) throw ApiError.notFound("\u0628\u06CC\u0627\u0646\u06CC\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const at = nowSeconds();
  if (decision === "approve") {
    await db.batch([
      sql`UPDATE statements SET status = 'published', published_at = ${at}, review_note = ${note}, reviewed_by = ${actor.userId}, reviewed_at = ${at}, updated_at = ${at} WHERE id = ${statementId}`,
      sql`UPDATE announcements SET is_active = 1, title = ${"\u0628\u06CC\u0627\u0646\u06CC\u0647 \u0631\u0633\u0645\u06CC"}, body = ${row.text.slice(0, 900)} WHERE statement_id = ${statementId}`
    ]);
  } else if (decision === "reject") {
    await db.batch([
      sql`UPDATE statements SET status = 'rejected', review_note = ${note}, reviewed_by = ${actor.userId}, reviewed_at = ${at}, updated_at = ${at} WHERE id = ${statementId}`,
      sql`INSERT INTO notifications (nation_id, user_id, kind, title, body, is_read, created_at)
           SELECT ${row.nation_id}, owner_user_id, 'statement', 'بیانیه رد شد', ${`\u06CC\u0627\u062F\u062F\u0627\u0634\u062A \u0645\u062F\u06CC\u0631: ${note ?? "-"}`}, 0, ${at}
             FROM nations WHERE id = ${row.nation_id}`
    ]);
  } else {
    await db.batch([
      sql`UPDATE statements SET status = 'removed', review_note = ${note}, reviewed_by = ${actor.userId}, updated_at = ${at} WHERE id = ${statementId}`,
      sql`UPDATE announcements SET is_active = 0 WHERE statement_id = ${statementId}`
    ]);
  }
  await audit(db, { actor, action: `statement.${decision}`, targetType: "statement", targetId: statementId, reason: note });
  return { status: decision === "approve" ? "published" : decision === "reject" ? "rejected" : "removed" };
}

// apps/worker/src/api/routes/statements.ts
init_sql();
var statementRoutes = new Hono3();
statementRoutes.use(requireUser);
statementRoutes.use(requireNation);
function parse4(schema, body) {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}
statementRoutes.get("/", async (c) => {
  const db = c.get("db");
  return c.json({ statements: await listMyStatements(db, c.get("user").nationIds, Number(c.req.query("limit") ?? 30)) });
});
statementRoutes.post("/", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const body = parse4(statementCreateSchema, await parseJson(c));
  await enforceRateLimit(db, `statement:${c.get("user").userId}`, 6, 3600, { durable: true });
  const res = await createStatement(db, c.get("nation"), { text: body.text, via: "webapp" }, settings, actorOf(c.get("user")));
  return c.json(res);
});
statementRoutes.post("/preview", async (c) => {
  const body = parse4(statementCreateSchema, await parseJson(c));
  const nation = c.get("nation");
  return c.json({
    preview: body.text.trim(),
    chars: body.text.trim().length,
    signature: `${nation.flag} ${nation.name} \u2014 ${nation.leader_name}`,
    needsApproval: (await settingsFor(c)).features.statementsRequireApproval
  });
});
statementRoutes.delete("/:id", async (c) => {
  const res = await cancelStatement(c.get("db"), Number(c.req.param("id")), c.get("user").nationIds);
  return c.json(res);
});
statementRoutes.get("/published/:nationId", async (c) => {
  const db = c.get("db");
  const nationId = Number(c.req.param("nationId"));
  const rows = await db.all(
    sql`SELECT s.id, s.text, s.created_at, s.published_at, s.leader_snapshot, n.name AS nation_name, n.flag
          FROM statements s JOIN nations n ON n.id = s.nation_id
         WHERE s.nation_id = ${nationId} AND s.status = 'published'
         ORDER BY s.id DESC LIMIT 30`
  );
  return c.json({ rows });
});
function mountStatements(app2) {
  app2.route("/api/statements", statementRoutes);
}

// apps/worker/src/api/routes/social.ts
init_src();

// apps/worker/src/services/newsService.ts
init_sql();
init_format();
init_errors2();
init_ranking();
init_auditService();
init_notificationService();
async function publish(db, input, isActive = true) {
  const at = nowSeconds();
  const row = await db.first(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, target_nation_id, statement_id, war_id, is_active, created_at)
         VALUES (${input.kind}, ${input.title.slice(0, 120)}, ${input.body.slice(0, 1200)},
                 ${input.targetNationId ? "nation" : "global"}, ${input.nationId ?? null}, ${input.targetNationId ?? null},
                 ${input.statementId ?? null}, ${input.warId ?? null}, ${isActive ? 1 : 0}, ${at})
         RETURNING id`
  );
  return Number(row?.id ?? 0);
}
async function adminBroadcast(db, input, actor, botToken) {
  if (!input.title.trim() || !input.body.trim()) throw ApiError.validation("\u0639\u0646\u0648\u0627\u0646 \u0648 \u0645\u062A\u0646 \u0627\u0637\u0644\u0627\u0639\u06CC\u0647 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A.");
  const id = await publish(db, {
    kind: "admin",
    title: input.title.trim(),
    body: input.body.trim(),
    targetNationId: input.targetNationId ?? null
  });
  if (input.targetNationId) {
    await notify(db, {
      nationId: input.targetNationId,
      kind: "admin",
      title: `\u{1F4E2} ${input.title.trim()}`,
      body: input.body.trim()
    });
  }
  await audit(db, { actor, action: "announcement.publish", targetType: "announcement", targetId: id, after: input });
  return { id, audience: input.targetNationId ? "nation" : "global", botTokenProvided: Boolean(botToken) };
}
async function listRankings(db, settings, opts = {}) {
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  if (opts.metric === "development") {
    const devRows = await db.all(
      sql`SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
                 n.equipment_count, n.wins_count, COALESCE(e.net_income, 0) AS net_income,
                 COALESCE(b.c, 0) AS development
            FROM nations n
            LEFT JOIN nation_economy e ON e.nation_id = n.id
            LEFT JOIN (SELECT nation_id, COUNT(*) AS c FROM nation_buildings GROUP BY nation_id) b ON b.nation_id = n.id
           WHERE n.status <> 'dissolved'
           ORDER BY development DESC, n.total_score DESC
           LIMIT 500`
    );
    return devRows.map((r, i) => ({
      rank: i + 1,
      nationId: Number(r.id),
      name: String(r.name),
      flag: String(r.flag),
      leaderName: String(r.leader_name),
      score: Number(r.development),
      metrics: { development: Number(r.development) },
      raw: {
        treasury: Number(r.treasury),
        income: Number(r.net_income),
        militaryPower: Number(r.military_power),
        equipmentCount: Number(r.equipment_count),
        warWins: Number(r.wins_count),
        economicScore: Number(r.economic_score),
        development: Number(r.development)
      }
    })).slice(0, limit);
  }
  const rows = await db.all(
    sql`SELECT n.id, n.name, n.flag, n.leader_name, n.treasury, n.military_power, n.economic_score,
               n.equipment_count, n.wins_count, COALESCE(e.net_income, 0) AS net_income
          FROM nations n LEFT JOIN nation_economy e ON e.nation_id = n.id
         WHERE n.status <> 'dissolved'
         ORDER BY n.total_score DESC LIMIT 500`
  );
  const ranked = rankNations(
    rows.map((r) => ({
      nationId: Number(r.id),
      name: String(r.name),
      flag: String(r.flag),
      leaderName: String(r.leader_name),
      treasury: Number(r.treasury),
      income: Number(r.net_income),
      militaryPower: Number(r.military_power),
      equipmentCount: Number(r.equipment_count),
      warWins: Number(r.wins_count),
      economicScore: Number(r.economic_score)
    })),
    settings.rankingWeights,
    opts.metric ?? "total"
  );
  return ranked.slice(0, limit).map((r) => ({
    rank: r.rank,
    nationId: r.nationId,
    name: r.name,
    flag: r.flag,
    leaderName: r.leaderName,
    score: r.score,
    metrics: r.metrics,
    raw: {
      treasury: r.treasury,
      income: r.income,
      militaryPower: r.militaryPower,
      equipmentCount: r.equipmentCount,
      warWins: r.warWins,
      economicScore: r.economicScore
    }
  }));
}

// apps/worker/src/api/routes/social.ts
init_warService();
init_diplomacyService();
var socialRoutes = new Hono3();
socialRoutes.use(requireUser);
socialRoutes.get("/rankings", async (c) => {
  const db = c.get("db");
  const settings = await settingsFor(c);
  const metric = c.req.query("metric") ?? "total";
  const safeMetric = RANKING_METRICS.includes(metric) || metric === "total" || metric === "development" ? metric : "total";
  return c.json({
    metric: safeMetric,
    weights: settings.rankingWeights,
    available: ["total", ...RANKING_METRICS, "development"],
    rows: await listRankings(db, settings, { metric: safeMetric === "total" ? void 0 : safeMetric, limit: Number(c.req.query("limit") ?? 20) })
  });
});
socialRoutes.get("/nations", async (c) => {
  const db = c.get("db");
  const user = c.get("user");
  return c.json({
    nations: await listNations(db, {
      search: c.req.query("q") ?? null,
      limit: c.req.query("limit") ?? 20,
      offset: c.req.query("offset") ?? 0,
      excludeNationId: user.activeNationId ?? null
    })
  });
});
socialRoutes.get("/nations/:id", async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));
  const all = await listNations(db, { limit: 50, offset: 0 });
  const nation = all.find((n) => n.id === id);
  if (!nation) return c.json({ error: { code: "not_found", message: "\u06A9\u0634\u0648\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." } }, 404);
  const alliance = await myAlliance(db, id);
  return c.json({ nation, allianceName: alliance?.name ?? null });
});
socialRoutes.get("/alliances", async (c) => {
  return c.json({ alliances: await listAlliances(c.get("db"), Number(c.req.query("limit") ?? 30)) });
});
function mountSocial(app2) {
  app2.route("/api/social", socialRoutes);
}

// apps/worker/src/api/routes/admin.ts
init_src();
init_errors2();
init_sql();
init_format();

// apps/worker/src/services/adminService.ts
init_src();
init_sql();
init_errors2();
init_format();
init_ids();
init_queries();
init_auditService();
var toInt = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
};
async function overview(db) {
  const row = await db.first(
    sql`SELECT
      (SELECT COUNT(*) FROM users) AS users_total,
      (SELECT COUNT(*) FROM users WHERE status = 'active') AS users_active,
      (SELECT COUNT(*) FROM users WHERE role IN ('admin','super_admin')) AS admins_total,
      (SELECT COUNT(*) FROM nations WHERE status <> 'dissolved') AS nations_total,
      (SELECT COUNT(*) FROM nations WHERE status = 'active') AS nations_active,
      (SELECT COUNT(*) FROM nations WHERE status = 'at_war') AS nations_at_war,
      (SELECT COALESCE(SUM(treasury),0) FROM nations) AS treasury_sum,
      (SELECT COALESCE(SUM(gross_income),0) FROM nation_economy) AS income_sum,
      (SELECT COALESCE(SUM(net_income),0) FROM nation_economy) AS net_income_sum,
      (SELECT COUNT(*) FROM wars WHERE status IN ('proposed','accepted','active','peace_requested')) AS wars_active,
      (SELECT COUNT(*) FROM wars WHERE status = 'ended') AS wars_ended,
      (SELECT COUNT(*) FROM alliances WHERE status = 'active') AS alliances_active,
      (SELECT COUNT(*) FROM diplomatic_requests WHERE status = 'pending') AS requests_pending,
      (SELECT COUNT(*) FROM statements WHERE status = 'pending_review') AS statements_pending,
      (SELECT COUNT(*) FROM statements) AS statements_total,
      (SELECT COUNT(*) FROM transactions) AS transactions_total,
      (SELECT COUNT(*) FROM notifications WHERE is_read = 0) AS notifications_unread,
      (SELECT COUNT(*) FROM users WHERE last_seen_at >= ${nowSeconds() - 86400}) AS users_24h,
      (SELECT COUNT(*) FROM users WHERE last_seen_at >= ${nowSeconds() - 7 * 86400}) AS users_7d,
      (SELECT COUNT(*) FROM nations WHERE created_at >= ${nowSeconds() - 86400}) AS nations_24h,
      (SELECT COUNT(*) FROM transactions WHERE created_at >= ${nowSeconds() - 86400}) AS tx_24h`
  );
  const num = (k) => Number(row?.[k] ?? 0);
  const recentTx = await db.all(
    sql`SELECT t.id, t.type, t.amount, t.created_at, n.name AS nation_name, n.flag
          FROM transactions t JOIN nations n ON n.id = t.nation_id ORDER BY t.id DESC LIMIT 15`
  );
  const recentAudit = await db.all(
    sql`SELECT a.id, a.action, a.target_type, a.target_id, a.reason, a.created_at, u.telegram_user_id
          FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id ORDER BY a.id DESC LIMIT 15`
  );
  const unpriced = await db.first(sql`SELECT COUNT(*) AS c FROM v_unpriced_equipment`);
  const duplicates = await db.all(sql`SELECT * FROM v_duplicate_equipment_names ORDER BY occurrences DESC LIMIT 20`);
  const jobs = await db.all(sql`SELECT * FROM job_checkpoints ORDER BY job_key LIMIT 20`);
  return {
    counters: {
      users: num("users_total"),
      activeUsers: num("users_active"),
      admins: num("admins_total"),
      nations: num("nations_total"),
      activeNations: num("nations_active"),
      nationsAtWar: num("nations_at_war"),
      totalTreasury: num("treasury_sum"),
      totalIncomePerCycle: num("income_sum"),
      totalNetIncomePerCycle: num("net_income_sum"),
      activeWars: num("wars_active"),
      endedWars: num("wars_ended"),
      alliances: num("alliances_active"),
      pendingRequests: num("requests_pending"),
      pendingStatements: num("statements_pending"),
      statements: num("statements_total"),
      transactions: num("transactions_total"),
      unreadNotifications: num("notifications_unread"),
      usersLast24h: num("users_24h"),
      usersLast7d: num("users_7d"),
      newNations24h: num("nations_24h"),
      transactionsLast24h: num("tx_24h")
    },
    dataQuality: {
      unpricedEquipment: Number(unpriced?.c ?? 0),
      duplicateNames: duplicates.map((d) => ({
        nameFa: String(d.name_fa),
        occurrences: Number(d.occurrences),
        categoryKeys: String(d.category_keys).split(","),
        templateIds: String(d.template_ids).split(",").map(Number)
      })),
      hint: "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0647\u0645\u200C\u0646\u0627\u0645 \u062F\u0631 \u0686\u0646\u062F \u062F\u0633\u062A\u0647 (\u0645\u062B\u0644\u0627\u064B F-22/F-35 \u062F\u0631 \xAB\u067E\u062F\u0627\u0641\u0646\u062F \u0647\u0648\u0627\u06CC\u06CC\xBB \u0648 \xAB\u062C\u0646\u06AF\u0646\u062F\u0647\u200C\u0647\u0627\xBB) \u0637\u0628\u0642 \u0633\u0646\u062F \u0637\u0631\u0627\u062D\u06CC \u0645\u062C\u0627\u0632 \u0648 \u0645\u0633\u062A\u0642\u0644 \u0647\u0633\u062A\u0646\u062F\u061B \u0627\u06CC\u0646 \u0641\u0647\u0631\u0633\u062A \u0641\u0642\u0637 \u0628\u0631\u0627\u06CC \u0622\u06AF\u0627\u0647\u06CC \u0645\u062F\u06CC\u0631 \u0627\u0633\u062A \u0648 \u0647\u06CC\u0686 \u062F\u0627\u062F\u0647\u200C\u0627\u06CC \u062E\u0648\u062F\u06A9\u0627\u0631 \u0627\u062F\u063A\u0627\u0645 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F."
    },
    recentTransactions: recentTx.map((t) => ({
      id: Number(t.id),
      type: String(t.type),
      amount: Number(t.amount),
      nation: String(t.nation_name),
      flag: String(t.flag),
      createdAt: toIso(Number(t.created_at))
    })),
    recentAudit: recentAudit.map((a) => ({
      id: Number(a.id),
      action: String(a.action),
      targetType: a.target_type ?? null,
      targetId: a.target_id === null ? null : Number(a.target_id),
      reason: a.reason ?? null,
      actorTelegramId: a.telegram_user_id === null ? null : Number(a.telegram_user_id),
      createdAt: toIso(Number(a.created_at))
    })),
    jobs: jobs.map((j) => ({
      jobKey: String(j.job_key),
      cursor: Number(j.cursor),
      rowsProcessed: Number(j.rows_processed),
      lastError: j.last_error ?? null,
      updatedAt: toIso(Number(j.updated_at))
    }))
  };
}
async function searchUsers(db, opts) {
  const limit = Math.min(100, Math.max(1, toInt(opts.limit, 25)));
  const offset = Math.max(0, toInt(opts.offset, 0));
  const where = [];
  const bindings = [];
  if (opts.search) {
    const asNumber = Number(opts.search);
    if (Number.isFinite(asNumber) && asNumber > 0) {
      where.push("(u.telegram_user_id = ? OR u.username LIKE ?)");
      bindings.push(asNumber, `%${opts.search}%`);
    } else {
      where.push("(u.username LIKE ? OR u.first_name LIKE ? OR n.name LIKE ?)");
      bindings.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
  }
  if (opts.role) {
    where.push("u.role = ?");
    bindings.push(opts.role);
  }
  if (opts.status && opts.status !== "all") {
    where.push("u.status = ?");
    bindings.push(opts.status);
  }
  const rows = await db.all({
    sql: `SELECT u.*, COUNT(n.id) AS nations_count, GROUP_CONCAT(n.name) AS nation_names,
                 MAX(u.last_seen_at) AS last_seen
            FROM users u LEFT JOIN nations n ON n.owner_user_id = u.id AND n.status <> 'dissolved'
           ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
           GROUP BY u.id ORDER BY u.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset]
  });
  const totalBindings = bindings.slice(0, Math.max(0, bindings.length - 0));
  const total = await db.first(
    rowsHaveGroupBy(where) ? { sql: `SELECT COUNT(DISTINCT u.id) AS c FROM users u LEFT JOIN nations n ON n.owner_user_id = u.id ${where.length ? `WHERE ${where.join(" AND ")}` : ""}`, bindings: totalBindings } : { sql: `SELECT COUNT(*) AS c FROM users u ${where.length ? `WHERE ${where.join(" AND ")}` : ""}`, bindings: totalBindings }
  );
  return {
    rows: rows.map((r) => ({
      id: Number(r.id),
      telegramId: Number(r.telegram_user_id),
      username: r.username ?? null,
      firstName: r.first_name ?? null,
      lastName: r.last_name ?? null,
      role: String(r.role),
      status: String(r.status),
      isPrimaryAdmin: Number(r.is_primary_admin) === 1,
      nationsCount: Number(r.nations_count),
      nationNames: r.nation_names ? String(r.nation_names).split(",") : [],
      createdAt: toIso(Number(r.created_at)),
      lastSeenAt: toIso(r.last_seen === null ? null : Number(r.last_seen))
    })),
    total: Number(total?.c ?? 0)
  };
}
function rowsHaveGroupBy(where) {
  return where.some((w) => w.includes("n.name"));
}
async function setUserStatus(db, targetUserId, status, reason, actor) {
  const target = await db.first(
    sql`SELECT id, is_primary_admin, status FROM users WHERE id = ${targetUserId}`
  );
  if (!target) throw ApiError.notFound("\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (target.is_primary_admin === 1 && status !== "active") {
    throw ApiError.forbidden("\u0645\u062F\u06CC\u0631 \u0627\u0635\u0644\u06CC \u0628\u0627\u0632\u06CC \u0642\u0627\u0628\u0644 \u0645\u0633\u062F\u0648\u062F \u06A9\u0631\u062F\u0646 \u0646\u06CC\u0633\u062A (\u0628\u0631\u0627\u06CC \u062C\u0644\u0648\u06AF\u06CC\u0631\u06CC \u0627\u0632 \u0642\u0641\u0644 \u0634\u062F\u0646 \u067E\u0646\u0644).");
  }
  const at = nowSeconds();
  await db.batch([
    sql`UPDATE users SET status = ${status}, updated_at = ${at} WHERE id = ${targetUserId}`,
    sql`UPDATE nations SET status = CASE WHEN ${status} = 'active' THEN CASE WHEN status = 'banned' THEN 'active' ELSE status END ELSE 'banned' END,
                                 updated_at = ${at}
           WHERE owner_user_id = ${targetUserId}`,
    status === "active" ? sql`SELECT NULL` : sql`UPDATE sessions SET revoked_at = ${at} WHERE user_id = ${targetUserId} AND revoked_at IS NULL`
  ]);
  await audit(db, { actor, action: `user.set_status_${status}`, targetType: "user", targetId: targetUserId, before: { status: target.status }, after: { status }, reason });
  return { status };
}
async function setUserRole(db, targetUserId, role, reason, actor) {
  if (!ROLES.includes(role)) throw ApiError.validation("\u0646\u0642\u0634 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const target = await db.first(
    sql`SELECT id, role, is_primary_admin FROM users WHERE id = ${targetUserId}`
  );
  if (!target) throw ApiError.notFound("\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (target.is_primary_admin === 1 && role !== "super_admin") {
    throw ApiError.forbidden("\u0646\u0642\u0634 \u0645\u062F\u06CC\u0631 \u0627\u0635\u0644\u06CC \u0642\u0627\u0628\u0644 \u062A\u0646\u0632\u0644 \u0646\u06CC\u0633\u062A.");
  }
  const at = nowSeconds();
  await db.batch([
    sql`UPDATE users SET role = ${role}, updated_at = ${at} WHERE id = ${targetUserId}`,
    sql`UPDATE user_roles SET is_active = 0 WHERE user_id = ${targetUserId}`,
    sql`INSERT INTO user_roles (user_id, role, note, granted_by, granted_at, is_active)
         VALUES (${targetUserId}, ${role}, ${reason}, ${actor.userId}, ${at}, 1)
         ON CONFLICT (user_id, role) DO UPDATE SET is_active = 1, granted_at = ${at}, note = ${reason}`
  ]);
  await db.run(sql`UPDATE sessions SET role = ${role} WHERE user_id = ${targetUserId} AND revoked_at IS NULL`);
  await audit(db, { actor, action: "user.set_role", targetType: "user", targetId: targetUserId, before: { role: target.role }, after: { role }, reason });
  return { role };
}
async function setPermissions(db, targetUserId, grants, actor) {
  if (actor.role !== "super_admin") throw ApiError.forbidden("\u0641\u0642\u0637 Super Admin \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0645\u062C\u0648\u0632 \u062A\u0639\u0631\u06CC\u0641 \u06A9\u0646\u062F.");
  const at = nowSeconds();
  const stmts = grants.filter((g) => ADMIN_SECTIONS.includes(g.resource)).map(
    (g) => sql`INSERT INTO admin_permissions (user_id, resource, can_read, can_write, updated_at)
           VALUES (${targetUserId}, ${g.resource}, ${g.read ? 1 : 0}, ${g.write ? 1 : 0}, ${at})
           ON CONFLICT (user_id, resource) DO UPDATE SET can_read = excluded.can_read, can_write = excluded.can_write, updated_at = ${at}`
  );
  if (stmts.length) await db.batch(stmts);
  await audit(db, { actor, action: "roles.set_permissions", targetType: "user", targetId: targetUserId, after: { grants } });
  return { updated: stmts.length };
}
async function getPermissions(db, targetUserId) {
  const rows = await db.all(
    sql`SELECT resource, can_read, can_write FROM admin_permissions WHERE user_id = ${targetUserId}`
  );
  return ADMIN_SECTIONS.map((resource) => {
    const found = rows.find((r) => r.resource === resource);
    return { resource, read: found ? found.can_read === 1 : false, write: found ? found.can_write === 1 : false };
  });
}
async function adminListNations(db, opts = {}) {
  const limit = Math.min(100, Math.max(1, toInt(opts.limit, 25)));
  const offset = Math.max(0, toInt(opts.offset, 0));
  const where = [];
  const bindings = [];
  if (opts.search) {
    where.push("(n.name LIKE ? OR n.leader_name LIKE ? OR u.telegram_user_id = ?)");
    bindings.push(`%${opts.search}%`, `%${opts.search}%`, Number(opts.search) || 0);
  }
  if (opts.status && opts.status !== "all") {
    where.push("n.status = ?");
    bindings.push(opts.status);
  }
  const rows = await db.all({
    sql: `SELECT n.*, u.telegram_user_id, u.username, COALESCE(e.net_income,0) AS net_income, COALESCE(e.gross_income,0) AS gross_income,
                 (SELECT COUNT(*) FROM nation_inventory i WHERE i.nation_id = n.id) AS inventory_rows
            FROM nations n
            LEFT JOIN users u ON u.id = n.owner_user_id
            LEFT JOIN nation_economy e ON e.nation_id = n.id
           ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
           ORDER BY n.world_rank ASC, n.id DESC LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset]
  });
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    flag: String(r.flag),
    leaderName: String(r.leader_name),
    status: String(r.status),
    ownerTelegramId: r.telegram_user_id === null ? null : Number(r.telegram_user_id),
    ownerUsername: r.username ?? null,
    treasury: Number(r.treasury),
    grossIncome: Number(r.gross_income),
    netIncome: Number(r.net_income),
    militaryPower: Number(r.military_power),
    economicScore: Number(r.economic_score),
    worldRank: Number(r.world_rank),
    wins: Number(r.wins_count),
    losses: Number(r.losses_count),
    inventoryRows: Number(r.inventory_rows),
    createdAt: toIso(Number(r.created_at))
  }));
}
async function adminUpdateNation(db, nationId, patch, reason, actor, settings) {
  const nation = await loadNation(db, nationId);
  const at = nowSeconds();
  const sets = [];
  const bindings = [];
  const before = {};
  const after = {};
  if (patch.name && patch.name.trim() !== nation.name) {
    const dup = await db.first(sql`SELECT id FROM nations WHERE name = ${patch.name.trim()} COLLATE NOCASE AND id <> ${nationId}`);
    if (dup) throw ApiError.conflict("\u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.");
    sets.push("name = ?");
    bindings.push(patch.name.trim());
    before.name = nation.name;
    after.name = patch.name.trim();
  }
  if (patch.flag && patch.flag.trim() && patch.flag !== nation.flag) {
    sets.push("flag = ?");
    bindings.push(patch.flag.trim());
    before.flag = nation.flag;
    after.flag = patch.flag.trim();
  }
  if (patch.leaderName && patch.leaderName.trim() !== nation.leader_name) {
    sets.push("leader_name = ?");
    bindings.push(patch.leaderName.trim());
    before.leaderName = nation.leader_name;
    after.leaderName = patch.leaderName.trim();
  }
  if (patch.status && patch.status !== nation.status) {
    if (patch.status === "dissolved") throw ApiError.validation("\u0628\u0631\u0627\u06CC \u0627\u0646\u062D\u0644\u0627\u0644 \u06A9\u0634\u0648\u0631 \u0627\u0632 endpoint \u062D\u0630\u0641 \u0628\u0627 \u062A\u0623\u06CC\u06CC\u062F \u0646\u0647\u0627\u06CC\u06CC \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
    sets.push("status = ?");
    bindings.push(patch.status);
    before.status = nation.status;
    after.status = patch.status;
  }
  if (sets.length === 0) throw ApiError.validation("\u062A\u063A\u06CC\u06CC\u0631\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  sets.push("updated_at = ?");
  bindings.push(at, nationId);
  await db.run({ sql: `UPDATE nations SET ${sets.join(", ")} WHERE id = ?`, bindings });
  await db.run(
    sql`INSERT INTO announcements (kind, title, body, audience, nation_id, created_at)
         VALUES ('admin', 'تغییر کشور توسط مدیر', ${`${nation.name}: ${Object.keys(after).join("\u060C ")} \u2014 \u062F\u0644\u06CC\u0644: ${reason}`}, 'global', ${nationId}, ${at})`
  );
  await refreshNationStats(db, { ...nation, ...after }, settings);
  await audit(db, { actor, action: "nation.admin_update", targetType: "nation", targetId: nationId, before, after, reason });
  return { updated: Object.keys(after) };
}
async function adminDeleteNation(db, nationId, confirmText, reason, actor) {
  if (confirmText !== `DELETE-${nationId}`) {
    throw ApiError.validation(`\u0628\u0631\u0627\u06CC \u062D\u0630\u0641 \u0628\u0627\u06CC\u062F \u0639\u0628\u0627\u0631\u062A \xABDELETE-${nationId}\xBB \u0627\u0631\u0633\u0627\u0644 \u0634\u0648\u062F.`);
  }
  const nation = await loadNation(db, nationId);
  const at = nowSeconds();
  const stmts = [
    sql`UPDATE wars SET status = 'stopped_by_admin', ended_at = ${at}, outcome_summary = ${"\u06A9\u0634\u0648\u0631 \u062D\u0630\u0641 \u0634\u062F."} WHERE status IN ('proposed','accepted','active','peace_requested') AND (attacker_nation_id = ${nationId} OR defender_nation_id = ${nationId})`,
    sql`UPDATE diplomatic_requests SET status = 'cancelled', handled_at = ${at} WHERE status = 'pending' AND (from_nation_id = ${nationId} OR to_nation_id = ${nationId})`,
    sql`UPDATE alliances SET status = 'disbanded', disbanded_at = ${at} WHERE leader_nation_id = ${nationId}`,
    sql`DELETE FROM alliance_members WHERE nation_id = ${nationId}`,
    sql`INSERT INTO audit_logs (actor_user_id, actor_telegram_id, action, target_type, target_id, before_json, after_json, reason, created_at)
         VALUES (${actor.userId}, ${actor.telegramId}, 'nation.delete', 'nation', ${nationId},
                 ${JSON.stringify({ name: nation.name, treasury: nation.treasury })}, ${JSON.stringify({ deleted: true })}, ${reason}, ${at})`,
    sql`INSERT INTO transactions (uuid, nation_id, type, amount, balance_before, balance_after, currency, idempotency_key, reference_type, reference_id, reason, created_by_user_id, created_at)
         VALUES (${uuid()}, ${nationId}, 'admin_correction', 0, ${nation.treasury}, 0, 'coin', ${`del:${nationId}:${at}`},
                 'nation', ${nationId}, ${`\u062D\u0630\u0641 \u06A9\u0634\u0648\u0631 \u2014 ${reason}`}, ${actor.userId}, ${at})`,
    // a nation is DISSOLVED, never hard-deleted: transactions.nation_id is ON DELETE RESTRICT
    // on purpose, so the financial history of a country can never disappear with it.
    sql`UPDATE nations SET status = 'dissolved', treasury = 0, military_power = 0, total_score = 0, world_rank = 0,
                           equipment_count = 0, troops_count = 0, updated_at = ${at}
          WHERE id = ${nationId}`,
    sql`DELETE FROM nation_inventory WHERE nation_id = ${nationId}`,
    sql`DELETE FROM bot_flow_states WHERE nation_id = ${nationId}`
  ];
  await db.batch(stmts);
  return { deleted: true, dissolved: true, nationId, name: nation.name };
}
async function adminAdjustInventory(db, nationId, templateId, delta, reason, settings, actor) {
  if (!Number.isInteger(delta) || delta === 0) throw ApiError.validation("\u0645\u0642\u062F\u0627\u0631 \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  if (reason.trim().length < 3) throw ApiError.validation("\u0630\u06A9\u0631 \u062F\u0644\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A.");
  const nation = await loadNation(db, nationId);
  const tpl = await db.first(sql`SELECT id, name_fa FROM equipment_templates WHERE id = ${templateId}`);
  if (!tpl) throw ApiError.notFound("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const at = nowSeconds();
  try {
    await db.batch([
      sql`INSERT INTO nation_inventory (nation_id, template_id, quantity, created_at, updated_at)
           VALUES (${nationId}, ${templateId}, ${Math.max(0, delta)}, ${at}, ${at})
           ON CONFLICT (nation_id, template_id) DO UPDATE SET quantity = MAX(0, quantity + ${delta}), updated_at = ${at}`
    ]);
  } catch (e) {
    throw ApiError.validation(`\u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645\u0645\u06A9\u0646: ${e instanceof Error ? e.message : "\u062E\u0637\u0627"}`);
  }
  await audit(db, {
    actor,
    action: "nation.adjust_inventory",
    targetType: "nation",
    targetId: nationId,
    after: { templateId, delta, nameFa: tpl.name_fa },
    reason: reason.trim()
  });
  await refreshNationStats(db, nation, settings);
  const after = await db.first(
    sql`SELECT quantity FROM nation_inventory WHERE nation_id = ${nationId} AND template_id = ${templateId}`
  );
  return { quantity: Number(after?.quantity ?? 0) };
}
async function adminListEquipment(db, opts = {}) {
  const limit = Math.min(200, Math.max(1, toInt(opts.limit, 100)));
  const offset = Math.max(0, toInt(opts.offset, 0));
  const where = [];
  const bindings = [];
  if (opts.categoryKey && opts.categoryKey !== "all") {
    where.push("c.key = ?");
    bindings.push(opts.categoryKey);
  }
  if (opts.search) {
    where.push("(t.name_fa LIKE ? OR t.code LIKE ?)");
    bindings.push(`%${opts.search}%`, `%${opts.search}%`);
  }
  if (opts.onlyUnpriced) where.push("t.price IS NULL");
  const rows = await db.all({
    sql: `SELECT t.*, c.key AS category_key, c.label_fa AS category_label, c.emoji,
                 (SELECT COUNT(*) FROM nation_inventory i WHERE i.template_id = t.id) AS holder_count,
                 (SELECT COALESCE(SUM(i.quantity),0) FROM nation_inventory i WHERE i.template_id = t.id) AS total_owned,
                 (SELECT COALESCE(SUM(ti.total_price),0) FROM transaction_items ti JOIN transactions tx ON tx.id = ti.transaction_id WHERE ti.template_id = t.id AND tx.type = 'purchase') AS total_revenue,
                 (SELECT COALESCE(SUM(ti.quantity),0) FROM transaction_items ti JOIN transactions tx ON tx.id = ti.transaction_id WHERE ti.template_id = t.id AND tx.type = 'purchase') AS total_sold
            FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
           ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
           ORDER BY c.sort_order, t.name_fa LIMIT ? OFFSET ?`,
    bindings: [...bindings, limit, offset]
  });
  return rows.map((r) => ({
    id: Number(r.id),
    code: String(r.code),
    nameFa: String(r.name_fa),
    unitFa: String(r.unit_fa),
    categoryKey: String(r.category_key),
    categoryLabel: String(r.category_label),
    emoji: String(r.emoji),
    price: r.price === null ? null : Number(r.price),
    priceSet: r.price !== null,
    attackPoints: r.attack_points === null ? null : Number(r.attack_points),
    defensePoints: r.defense_points === null ? null : Number(r.defense_points),
    description: String(r.description ?? ""),
    isActive: Number(r.is_active) === 1,
    isForSale: Number(r.is_for_sale) === 1,
    purchaseLimitPerCycle: r.purchase_limit_per_cycle === null ? null : Number(r.purchase_limit_per_cycle),
    maintenancePerUnit: r.maintenance_per_unit === null ? null : Number(r.maintenance_per_unit),
    holderCount: Number(r.holder_count),
    totalOwned: Number(r.total_owned),
    totalRevenue: Number(r.total_revenue),
    totalSold: Number(r.total_sold),
    updatedAt: toIso(Number(r.updated_at))
  }));
}
async function adminUpsertEquipment(db, input, actor) {
  const category = await db.first(sql`SELECT id FROM equipment_categories WHERE key = ${String(input.categoryKey)} COLLATE NOCASE`);
  if (!category) throw ApiError.validation("\u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const at = nowSeconds();
  const price = input.price === null || input.price === void 0 || input.price === "" ? null : Number(input.price);
  if (price !== null && (!Number.isFinite(price) || price <= 0)) throw ApiError.validation("\u0642\u06CC\u0645\u062A \u0628\u0627\u06CC\u062F \u0639\u062F\u062F \u0635\u062D\u06CC\u062D \u0628\u0632\u0631\u06AF\u200C\u062A\u0631 \u0627\u0632 \u0635\u0641\u0631 \u0628\u0627\u0634\u062F (\u0642\u06CC\u0645\u062A \u0646\u0627\u0645\u0634\u062E\u0635 = NULL).");
  const payload = {
    category_id: category.id,
    code: String(input.code),
    name_fa: String(input.nameFa),
    unit_fa: String(input.unitFa),
    price,
    attack_points: input.attackPoints === null || input.attackPoints === void 0 || input.attackPoints === "" ? null : Number(input.attackPoints),
    defense_points: input.defensePoints === null || input.defensePoints === void 0 || input.defensePoints === "" ? null : Number(input.defensePoints),
    description: String(input.descriptionFa ?? ""),
    is_active: input.isActive === false ? 0 : 1,
    is_for_sale: input.isForSale === false ? 0 : 1,
    purchase_limit_per_cycle: !input.purchaseLimitPerCycle ? null : Number(input.purchaseLimitPerCycle),
    maintenance_per_unit: input.maintenancePerUnit === null || input.maintenancePerUnit === void 0 || input.maintenancePerUnit === "" ? null : Number(input.maintenancePerUnit),
    updated_at: at
  };
  if (input.id) {
    const id2 = Number(input.id);
    const before = await db.first(sql`SELECT * FROM equipment_templates WHERE id = ${id2}`);
    if (!before) throw ApiError.notFound("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
    await db.run({
      sql: `UPDATE equipment_templates SET ${Object.keys(payload).map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
      bindings: [...Object.values(payload), id2]
    });
    await audit(db, { actor, action: "shop.update_equipment", targetType: "equipment_template", targetId: id2, before, after: payload });
    return { id: id2, created: false };
  }
  const created = await db.first(
    sql`INSERT INTO equipment_templates (category_id, code, name_fa, unit_fa, price, attack_points, defense_points, description,
                                         is_active, is_for_sale, purchase_limit_per_cycle, maintenance_per_unit, created_at, updated_at)
         VALUES (${payload.category_id}, ${payload.code}, ${payload.name_fa}, ${payload.unit_fa}, ${payload.price},
                 ${payload.attack_points}, ${payload.defense_points}, ${payload.description}, ${payload.is_active},
                 ${payload.is_for_sale}, ${payload.purchase_limit_per_cycle}, ${payload.maintenance_per_unit}, ${at}, ${at})
         RETURNING id`
  );
  const id = Number(created?.id ?? 0);
  await audit(db, { actor, action: "shop.create_equipment", targetType: "equipment_template", targetId: id, after: payload });
  return { id, created: true };
}
async function adminSetPricesBulk(db, items, actor) {
  if (items.length === 0) throw ApiError.validation("\u0647\u06CC\u0686 \u0642\u06CC\u0645\u062A\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  const at = nowSeconds();
  const stmts = items.map((i) => {
    if (i.price !== null && (!Number.isInteger(i.price) || i.price <= 0)) {
      throw ApiError.validation("\u0642\u06CC\u0645\u062A \u0628\u0627\u06CC\u062F \u0639\u062F\u062F \u0635\u062D\u06CC\u062D \u0645\u062B\u0628\u062A \u06CC\u0627 NULL (\u062A\u0639\u06CC\u06CC\u0646\u200C\u0646\u0634\u062F\u0647) \u0628\u0627\u0634\u062F.");
    }
    return sql`UPDATE equipment_templates SET price = ${i.price}, updated_at = ${at} WHERE id = ${i.templateId}`;
  });
  await db.batch(stmts);
  await audit(db, { actor, action: "shop.set_prices_bulk", targetType: "equipment_template", after: { count: items.length } });
  return { updated: items.length };
}
async function adminDeleteEquipment(db, templateId, actor) {
  const holders = await db.first(sql`SELECT COUNT(*) AS c FROM nation_inventory WHERE template_id = ${templateId} AND quantity > 0`);
  if (Number(holders?.c ?? 0) > 0) {
    throw ApiError.conflict("\u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u062F\u0631 \u0627\u0646\u0628\u0627\u0631 \u06A9\u0634\u0648\u0631\u0647\u0627 \u0648\u062C\u0648\u062F \u062F\u0627\u0631\u062F\u061B \u0628\u0647\u200C\u062C\u0627\u06CC \u062D\u0630\u0641\u060C \u0622\u0646 \u0631\u0627 \u0627\u0632 \u0641\u0631\u0648\u0634 \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u06A9\u0646\u06CC\u062F.");
  }
  const tpl = await db.first(sql`SELECT name_fa FROM equipment_templates WHERE id = ${templateId}`);
  if (!tpl) throw ApiError.notFound("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  await db.batch([
    sql`DELETE FROM starter_template_items WHERE equipment_template_id = ${templateId}`,
    sql`UPDATE equipment_templates SET is_active = 0, is_for_sale = 0, updated_at = ${nowSeconds()} WHERE id = ${templateId}`
  ]);
  await audit(db, { actor, action: "shop.deactivate_equipment", targetType: "equipment_template", targetId: templateId, after: { nameFa: tpl.name_fa } });
  return { deactivated: true };
}
async function adminUpsertCategory(db, input, actor) {
  const at = nowSeconds();
  const exists = await db.first(sql`SELECT id FROM equipment_categories WHERE key = ${input.key} COLLATE NOCASE`);
  if (exists) {
    await db.run(
      sql`UPDATE equipment_categories SET label_fa = ${input.labelFa}, shop_label_fa = ${input.shopLabelFa}, emoji = ${input.emoji},
                 role = ${input.role}, sort_order = ${input.sortOrder ?? 999}, is_active = ${input.isActive === false ? 0 : 1},
                 power_weight = ${input.powerWeight ?? 0}, updated_at = ${at}
           WHERE id = ${exists.id}`
    );
    await audit(db, { actor, action: "shop.update_category", targetType: "category", targetId: exists.id, after: input });
    return { id: exists.id, created: false };
  }
  const created = await db.first(
    sql`INSERT INTO equipment_categories (key, label_fa, shop_label_fa, emoji, role, sort_order, is_active, power_weight, created_at, updated_at)
         VALUES (${input.key}, ${input.labelFa}, ${input.shopLabelFa}, ${input.emoji}, ${input.role}, ${input.sortOrder ?? 999},
                 ${input.isActive === false ? 0 : 1}, ${input.powerWeight ?? 0}, ${at}, ${at}) RETURNING id`
  );
  await audit(db, { actor, action: "shop.create_category", targetType: "category", targetId: Number(created?.id ?? 0), after: input });
  return { id: Number(created?.id ?? 0), created: true };
}
async function adminSetCategoryWeights(db, weights, actor) {
  const at = nowSeconds();
  const stmts = Object.entries(weights).map(([key, weight]) => {
    const value = Number(weight);
    if (!Number.isFinite(value) || value < 0 || value > 1e5) throw ApiError.validation(`\u0648\u0632\u0646 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0628\u0631\u0627\u06CC ${key}`);
    return sql`UPDATE equipment_categories SET power_weight = ${value}, updated_at = ${at} WHERE key = ${key} COLLATE NOCASE`;
  });
  if (stmts.length === 0) throw ApiError.validation("\u0647\u06CC\u0686 \u0648\u0632\u0646\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  await db.batch(stmts);
  await audit(db, { actor, action: "settings.category_weights", after: weights });
  return { updated: stmts.length };
}
async function adminListCategories(db) {
  const rows = await db.all(
    sql`SELECT c.*, COUNT(t.id) AS templates,
               SUM(CASE WHEN t.price IS NOT NULL THEN 1 ELSE 0 END) AS priced
          FROM equipment_categories c LEFT JOIN equipment_templates t ON t.category_id = c.id
         GROUP BY c.id ORDER BY c.sort_order`
  );
  return rows.map((r) => ({
    id: Number(r.id),
    key: String(r.key),
    labelFa: String(r.label_fa),
    shopLabelFa: String(r.shop_label_fa),
    emoji: String(r.emoji),
    role: String(r.role),
    sortOrder: Number(r.sort_order),
    isActive: Number(r.is_active) === 1,
    powerWeight: Number(r.power_weight),
    templates: Number(r.templates),
    priced: Number(r.priced ?? 0),
    unpriced: Number(r.templates) - Number(r.priced ?? 0)
  }));
}
async function adminListStarterTemplates(db) {
  const rows = await db.all(
    sql`SELECT s.*, COUNT(i.id) AS item_count, COALESCE(SUM(i.quantity),0) AS total_units,
               (SELECT COUNT(*) FROM nations n WHERE n.starter_template_id = s.id) AS used_by
          FROM starter_templates s LEFT JOIN starter_template_items i ON i.starter_template_id = s.id
         GROUP BY s.id ORDER BY s.is_default DESC, s.id`
  );
  return rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    description: r.description ?? null,
    treasury: Number(r.treasury),
    factoryIncome: Number(r.factory_income),
    mineIncome: Number(r.mine_income),
    totalIncome: Number(r.factory_income) + Number(r.mine_income),
    incomeCycleSeconds: Number(r.income_cycle_seconds),
    isDefault: Number(r.is_default) === 1,
    isActive: Number(r.is_active) === 1,
    itemCount: Number(r.item_count),
    totalUnits: Number(r.total_units),
    usedBy: Number(r.used_by)
  }));
}
async function adminUpsertStarterTemplate(db, input, actor) {
  if (input.name.trim().length < 2) throw ApiError.validation("\u0646\u0627\u0645 \u0628\u0633\u062A\u0647 \u062D\u062F\u0627\u0642\u0644 \u06F2 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u06CC\u062F \u0628\u0627\u0634\u062F.");
  const at = nowSeconds();
  let id = Number(input.id ?? 0);
  if (id) {
    const exists = await db.first(sql`SELECT id FROM starter_templates WHERE id = ${id}`);
    if (!exists) throw ApiError.notFound("\u0628\u0633\u062A\u0647 \u0627\u0648\u0644\u06CC\u0647 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
    await db.run(
      sql`UPDATE starter_templates SET name = ${input.name.trim()}, treasury = ${input.treasury}, factory_income = ${input.factoryIncome},
                 mine_income = ${input.mineIncome}, income_cycle_seconds = ${input.incomeCycleSeconds}, updated_at = ${at}
           WHERE id = ${id}`
    );
  } else {
    const created = await db.first(
      sql`INSERT INTO starter_templates (name, treasury, factory_income, mine_income, income_cycle_seconds, is_default, is_active, created_at, updated_at)
           VALUES (${input.name.trim()}, ${input.treasury}, ${input.factoryIncome}, ${input.mineIncome}, ${input.incomeCycleSeconds}, 0, 1, ${at}, ${at})
           RETURNING id`
    );
    id = Number(created?.id ?? 0);
  }
  if (input.items) {
    await db.run(sql`DELETE FROM starter_template_items WHERE starter_template_id = ${id}`);
    const stmts = input.items.filter((i) => Number(i.quantity) > 0).map(
      (i) => sql`INSERT INTO starter_template_items (starter_template_id, equipment_template_id, quantity)
             VALUES (${id}, ${i.templateId}, ${i.quantity}) ON CONFLICT (starter_template_id, equipment_template_id) DO UPDATE SET quantity = ${i.quantity}`
    );
    if (stmts.length) await db.batch(stmts);
  }
  if (input.setAsDefault) {
    await db.batch([
      sql`UPDATE starter_templates SET is_default = 0 WHERE id <> ${id}`,
      sql`UPDATE starter_templates SET is_default = 1, is_active = 1 WHERE id = ${id}`
    ]);
  }
  await audit(db, { actor, action: "settings.starter_template", targetType: "starter_template", targetId: id, after: { name: input.name, treasury: input.treasury, items: input.items?.length ?? 0 } });
  return { id };
}
var EXPORT_TABLES = [
  "users",
  "nations",
  "nation_settings",
  "nation_economy",
  "nation_inventory",
  "equipment_categories",
  "equipment_templates",
  "transactions",
  "transaction_items",
  "revenue_cycles",
  "wars",
  "battles",
  "battle_reports",
  "diplomatic_relations",
  "diplomatic_requests",
  "alliances",
  "alliance_members",
  "statements",
  "announcements",
  "notifications",
  "game_settings",
  "economy_settings",
  "user_roles",
  "admin_permissions",
  "starter_templates",
  "starter_template_items",
  "nation_stat_history",
  "scheduled_events"
];
var BACKUP_TABLES = EXPORT_TABLES;
async function exportBackup(db, opts = {}) {
  const tables = (opts.tables?.length ? opts.tables : EXPORT_TABLES).filter((t) => EXPORT_TABLES.includes(t));
  const out = {};
  for (const table of tables) {
    const sinceClause = opts.since ? `WHERE created_at >= ${Number(opts.since)}` : "";
    const rows = await db.all({
      sql: `SELECT * FROM ${table} ${sinceClause} ORDER BY rowid LIMIT 5000`,
      bindings: []
    });
    out[table] = rows;
  }
  return {
    meta: {
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      tables: Object.keys(out).map((t) => ({ table: t, rows: out[t].length })),
      note: "\u0628\u0631\u0627\u06CC \u0628\u06A9\u0627\u067E \u06A9\u0627\u0645\u0644 \u0648 \u0631\u0633\u0645\u06CC D1 \u0627\u0632 \xABD1 backups\xBB \u062F\u0631 \u062F\u0627\u0634\u0628\u0648\u0631\u062F Cloudflare \u06CC\u0627 wrangler d1 export \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F."
    },
    data: out
  };
}
async function listBackupRuns(db, limit = 20) {
  const rows = await db.all(
    sql`SELECT id, action, target_type, target_id, reason, created_at, after_json
          FROM audit_logs WHERE action IN ('backup.export','backup.restore','backup.import') ORDER BY id DESC LIMIT ${Math.min(50, Math.max(1, limit))}`
  );
  return rows.map((r) => ({
    id: Number(r.id),
    action: String(r.action),
    reason: r.reason ?? null,
    createdAt: toIso(Number(r.created_at)),
    detail: safeJson2(r.after_json)
  }));
}
function safeJson2(v) {
  try {
    return v ? JSON.parse(String(v)) : null;
  } catch {
    return null;
  }
}
async function logBackupRun(db, action, tables, actor, reason) {
  await markJob(db, `backup:${action}`, { cursor: Date.now(), rowsProcessed: tables });
  await audit(db, {
    actor,
    action,
    targetType: "backup",
    after: { tables, at: (/* @__PURE__ */ new Date()).toISOString() },
    reason: reason ?? null
  });
}
async function revenueHealth(db) {
  const row = await db.first(
    sql`SELECT SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
               SUM(CASE WHEN status = 'credited' THEN 1 ELSE 0 END) AS credited,
               MIN(computed_at) AS oldest
          FROM revenue_cycles WHERE status = 'pending'`
  );
  return {
    pendingCycles: Number(row?.pending ?? 0),
    creditedCycles: Number(row?.credited ?? 0),
    oldestPendingAt: row?.oldest ? toIso(Number(row.oldest)) : null
  };
}

// apps/worker/src/api/routes/admin.ts
init_auditService();
init_queries();

// apps/worker/src/scheduled/cron.ts
init_sql();
init_format();
init_queries();
init_warService();
init_diplomacyService();
init_authService();
async function runScheduled(env, db, eventCron, now = nowSeconds()) {
  const startedAt = now;
  const jobs = [];
  const push = (j) => jobs.push(j);
  const run = async (job, fn) => {
    try {
      const r = await fn();
      push({ job, ok: true, processed: r.processed, detail: r.detail });
      await markJob(db, job, { ...r.cursor === void 0 ? {} : { cursor: r.cursor }, rowsProcessed: r.processed, success: true });
      record({ cronRuns: 1 });
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 200) : String(err);
      push({ job, processed: 0, ok: false, detail: message });
      await markJob(db, job, { error: message });
      record({ cronRuns: 1, errors: 1 });
    }
  };
  if (env.CRON_DISABLED === "1") {
    return { startedAt, finishedAt: nowSeconds(), skipped: "CRON_DISABLED", jobs };
  }
  const settings = await loadSettings(db, { force: true });
  const paused = await isCronPaused(db, settings);
  await run("wars", () => warJob(db, settings, now));
  await run("war_expiry", () => warExpiryJob(db, settings, now));
  if (paused) {
    push({ job: "ranking", processed: 0, ok: true, detail: "skipped:quota-guard" });
    push({ job: "diplomacy_expiry", processed: 0, ok: true, detail: "skipped:quota-guard" });
    push({ job: "housekeeping", processed: 0, ok: true, detail: "skipped:quota-guard" });
  } else {
    await run("diplomacy_expiry", () => diplomacyExpiryJob(db, now));
    await run("ranking", () => rankingJob(db, settings, now));
    await run("housekeeping", () => housekeepingJob(db, now));
  }
  await snapshotQuota(db, settings);
  await flushQuota(db);
  return { startedAt, finishedAt: nowSeconds(), jobs, ...{ cron: eventCron ?? null } };
}
async function warJob(db, settings, now) {
  const due = await listDueWars(db, now, 12);
  let done = 0;
  for (const w of due) {
    try {
      await resolveRound(db, w.id, settings, { force: true });
      done++;
    } catch (err) {
      await markJob(db, "wars", { error: `${w.id}: ${err instanceof Error ? err.message.slice(0, 120) : "round failed"}` });
    }
  }
  const overdue = await listOverdueWars(db, now, 8);
  for (const w of overdue) {
    await finalizeWar(db, w.id, settings, now);
    done++;
  }
  return { processed: done, detail: String(done) };
}
async function warExpiryJob(db, settings, now) {
  const expired = await listExpiredProposals(db, settings.diplomacy.requestExpirySeconds, now, 20);
  for (const w of expired) await expireProposal(db, w.id, now);
  return { processed: expired.length, detail: String(expired.length) };
}
async function diplomacyExpiryJob(db, now) {
  const expired = await expireRequests(db, now, 200);
  return { processed: expired, detail: String(expired) };
}
async function rankingJob(db, settings, now) {
  const last = await db.first(sql`SELECT last_success_at FROM job_checkpoints WHERE job_key = 'ranking'`);
  if (last?.last_success_at && now - Number(last.last_success_at) < 600) {
    return { processed: 0, detail: "too-soon" };
  }
  const total = await recomputeRankings(db, settings);
  await db.batch([
    sql`UPDATE nations SET
          allies_count = (SELECT COUNT(*) FROM diplomatic_relations r WHERE r.nation_id = nations.id AND r.status IN ('friend','ally')),
          enemies_count = (SELECT COUNT(*) FROM diplomatic_relations r WHERE r.nation_id = nations.id AND r.status = 'enemy')`
  ]);
  const day = new Date(now * 1e3).toISOString().slice(0, 10);
  await db.run(
    sql`INSERT INTO nation_stat_history (nation_id, day, treasury, income, power, equipment, created_at)
         SELECT n.id, ${day}, n.treasury, COALESCE(e.net_income, 0), n.military_power, n.equipment_count, ${now}
           FROM nations n LEFT JOIN nation_economy e ON e.nation_id = n.id
          WHERE n.status <> 'dissolved'
          ON CONFLICT (nation_id, day) DO UPDATE SET treasury = excluded.treasury, income = excluded.income,
                                                      power = excluded.power, equipment = excluded.equipment`
  );
  return { processed: total, detail: String(total) };
}
async function housekeepingJob(db, now) {
  const sessions = await purgeExpiredSessions(db, now);
  const webhook = await db.run(
    sql`DELETE FROM processed_webhook_updates WHERE created_at < ${now - 30 * 86400} AND id IN (SELECT id FROM processed_webhook_updates WHERE created_at < ${now - 30 * 86400} ORDER BY id LIMIT 500)`
  );
  const stale = await db.run(
    sql`DELETE FROM bot_flow_states WHERE expires_at IS NOT NULL AND expires_at < ${now} AND user_id IN (SELECT user_id FROM bot_flow_states WHERE expires_at < ${now} ORDER BY user_id LIMIT 200)`
  );
  return { processed: sessions, detail: `sessions=${sessions} webhook=${webhook.meta.changes ?? 0} flows=${stale.meta.changes ?? 0}` };
}
async function triggerJobsManually(env, db, jobs) {
  const settings = await loadSettings(db, { force: true });
  const now = nowSeconds();
  const results = [];
  const runOne = async (job, fn) => {
    try {
      const r = await fn();
      results.push({ job, ok: true, processed: r.processed, detail: r.detail });
      await markJob(db, job, { ...r.cursor === void 0 ? {} : { cursor: r.cursor }, rowsProcessed: r.processed, success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message.slice(0, 200) : String(err);
      results.push({ job, processed: 0, ok: false, detail: message });
      await markJob(db, job, { error: message });
    }
  };
  for (const job of jobs) {
    switch (job) {
      case "wars":
        await runOne(job, () => warJob(db, settings, now));
        break;
      case "war_expiry":
        await runOne(job, () => warExpiryJob(db, settings, now));
        break;
      case "ranking":
        await runOne(job, () => rankingJob(db, settings, now));
        break;
      case "diplomacy_expiry":
        await runOne(job, () => diplomacyExpiryJob(db, now));
        break;
      case "housekeeping":
        await runOne(job, () => housekeepingJob(db, now));
        break;
      default:
        results.push({ job, processed: 0, ok: false, detail: "unknown job" });
    }
  }
  return { startedAt: now, finishedAt: nowSeconds(), jobs: results };
}

// apps/worker/src/api/routes/admin.ts
init_warService();

// apps/worker/src/services/assignCountryService.ts
init_sql();
init_errors2();
init_format();
init_queries();
init_auditService();
init_queries();
async function determineCountry(db, actor, input, settings, now = nowSeconds()) {
  const telegramId = Math.floor(Number(input.telegramId));
  if (!Number.isFinite(telegramId) || telegramId <= 0) throw ApiError.validation("\u0622\u06CC\u062F\u06CC \u0639\u062F\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const countryName = String(input.countryName ?? "").trim();
  if (countryName.length < 3) throw ApiError.validation("\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0628\u0627\u06CC\u062F \u062F\u0633\u062A\u200C\u06A9\u0645 \u06F3 \u0646\u0648\u06CC\u0633\u0647 \u0628\u0627\u0634\u062F.");
  if (countryName.length > 30) throw ApiError.validation("\u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F3\u06F0 \u0646\u0648\u06CC\u0633\u0647 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u062F \u0628\u0627\u0634\u062F.");
  const user = await db.first(
    sql`SELECT id, telegram_user_id, first_name, username FROM users WHERE telegram_user_id = ${telegramId}`
  );
  if (!user) throw ApiError.notFound("\u0628\u0627\u0632\u06CC\u06A9\u0646\u06CC \u0628\u0627 \u0627\u06CC\u0646 \u0622\u06CC\u062F\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const owned = await loadNationOwnedBy(db, user.id);
  const dup = await db.first(
    sql`SELECT id, owner_user_id FROM nations WHERE name = ${countryName} COLLATE NOCASE`
  );
  if (dup && (!owned || Number(dup.id) !== Number(owned.id))) {
    throw ApiError.conflict("\u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.");
  }
  let nationId;
  let created = false;
  if (owned) {
    if (owned.name !== countryName) {
      await db.run(sql`UPDATE nations SET name = ${countryName}, updated_at = ${now} WHERE id = ${owned.id}`);
      await refreshNationStats(db, { ...owned, name: countryName }, settings).catch(() => void 0);
    }
    nationId = owned.id;
  } else {
    const result = await createNation(
      db,
      { userId: user.id, telegramId: Number(user.telegram_user_id) },
      { name: countryName, leaderName: (user.first_name ?? "").trim() || "\u0641\u0631\u0645\u0627\u0646\u062F\u0647", flag: "\u{1F3F3}\uFE0F" },
      settings
    );
    nationId = result.nationId;
    created = true;
  }
  await audit(db, {
    actor,
    action: "admin.assign_country",
    targetType: "nation",
    targetId: nationId,
    before: { telegramId, previousName: owned?.name ?? null },
    after: { telegramId, name: countryName, created },
    reason: `\u062A\u0639\u06CC\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0628\u0627\u0632\u06CC\u06A9\u0646 \u062A\u0648\u0633\u0637 \u0627\u062F\u0645\u06CC\u0646: ${countryName}`
  });
  return {
    nationId,
    nationName: countryName,
    created,
    user: { id: Number(user.id), telegramId, firstName: user.first_name, username: user.username }
  };
}

// apps/worker/src/api/routes/admin.ts
var adminRoutes = new Hono3();
adminRoutes.use(requireUser);
function parse5(schema, body) {
  const res = schema.safeParse(body);
  if (!res.success) {
    const e = formatZodError(res.error);
    throw ApiError.validation(e.message, e.fields);
  }
  return res.data;
}
var write = (section) => requireAdmin(section, true);
adminRoutes.get("/overview", requireAdmin(), async (c) => c.json(await overview(c.get("db"))));
adminRoutes.get("/me", requireAdmin(), async (c) => {
  const user = c.get("user");
  return c.json({
    userId: user.userId,
    telegramId: user.telegramId,
    role: user.role,
    sections: ADMIN_SECTIONS.map((s) => ({
      section: s,
      read: user.role === "super_admin" ? true : user.permissions[s]?.read ?? false,
      write: user.role === "super_admin" ? true : user.permissions[s]?.write ?? false
    }))
  });
});
adminRoutes.get("/users", requireAdmin("users"), async (c) => {
  const res = await searchUsers(c.get("db"), {
    search: c.req.query("q") ?? null,
    role: c.req.query("role") || null,
    status: c.req.query("status") ?? null,
    limit: Number(c.req.query("limit") ?? 0) || void 0,
    offset: Number(c.req.query("offset") ?? 0) || void 0
  });
  return c.json(res);
});
adminRoutes.get("/users/:id", requireAdmin("users"), async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));
  const user = await db.first(sql`SELECT * FROM users WHERE id = ${id}`);
  if (!user) throw ApiError.notFound("\u06A9\u0627\u0631\u0628\u0631 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const nations = await adminListNations(db, { search: null });
  const mine = nations.filter((n) => n.ownerTelegramId === Number(user.telegram_user_id));
  const tx = mine.length ? await listTransactions(db, mine[0].id, { limit: 10 }) : { rows: [], nextOffset: null };
  return c.json({
    user: {
      id: Number(user.id),
      telegramId: Number(user.telegram_user_id),
      username: user.username ?? null,
      firstName: user.first_name ?? null,
      role: String(user.role),
      status: String(user.status),
      isPrimaryAdmin: Number(user.is_primary_admin) === 1,
      createdAt: toIso(Number(user.created_at)),
      lastSeenAt: toIso(user.last_seen_at === null ? null : Number(user.last_seen_at))
    },
    nations: mine,
    transactions: tx.rows,
    permissions: await getPermissions(db, id)
  });
});
adminRoutes.post("/determine-country", write("users"), async (c) => {
  const body = parse5(
    external_exports2.object({ telegramId: external_exports2.coerce.number().int().positive(), countryName: external_exports2.string().trim().min(3).max(30) }),
    await parseJson(c)
  );
  const settings = await settingsFor(c);
  const result = await determineCountry(c.get("db"), adminActorOf(c.get("user")), body, settings);
  return c.json(result);
});
adminRoutes.post("/users/:id/status", write("users"), async (c) => {
  const body = parse5(external_exports2.object({ status: external_exports2.enum(["active", "blocked", "disabled"]), reason: external_exports2.string().trim().min(3).max(200) }), await parseJson(c));
  const res = await setUserStatus(c.get("db"), Number(c.req.param("id")), body.status, body.reason, adminActorOf(c.get("user")));
  return c.json(res);
});
adminRoutes.post("/users/:id/role", write("roles"), async (c) => {
  const body = parse5(external_exports2.object({ role: external_exports2.enum(["player", "admin", "super_admin"]), reason: external_exports2.string().trim().min(3).max(200) }), await parseJson(c));
  const res = await setUserRole(c.get("db"), Number(c.req.param("id")), body.role, body.reason, adminActorOf(c.get("user")));
  return c.json(res);
});
adminRoutes.get("/users/:id/permissions", requireAdmin("roles"), async (c) => c.json({ grants: await getPermissions(c.get("db"), Number(c.req.param("id"))) }));
adminRoutes.post("/users/:id/permissions", write("roles"), async (c) => {
  const body = parse5(
    external_exports2.object({
      grants: external_exports2.array(
        external_exports2.object({ resource: external_exports2.enum(ADMIN_SECTIONS), read: external_exports2.coerce.boolean(), write: external_exports2.coerce.boolean() })
      )
    }),
    await parseJson(c)
  );
  return c.json(await setPermissions(c.get("db"), Number(c.req.param("id")), body.grants, adminActorOf(c.get("user"))));
});
adminRoutes.get(
  "/nations",
  requireAdmin("nations"),
  async (c) => c.json({
    nations: await adminListNations(c.get("db"), {
      search: c.req.query("q") ?? null,
      status: c.req.query("status") ?? null,
      limit: Number(c.req.query("limit") ?? 0) || void 0,
      offset: Number(c.req.query("offset") ?? 0) || void 0
    })
  })
);
adminRoutes.post("/nations/:id/update", write("nations"), async (c) => {
  const db = c.get("db");
  const body = parse5(
    external_exports2.object({
      name: external_exports2.string().trim().min(3).max(30).optional(),
      flag: external_exports2.string().trim().min(1).max(24).optional(),
      leaderName: external_exports2.string().trim().min(2).max(40).optional(),
      status: external_exports2.enum(["active", "frozen", "banned", "at_war"]).optional(),
      reason: external_exports2.string().trim().min(3).max(200)
    }),
    await parseJson(c)
  );
  const { reason, ...patch } = body;
  const res = await adminUpdateNation(db, Number(c.req.param("id")), patch, reason, adminActorOf(c.get("user")), await settingsFor(c));
  return c.json(res);
});
adminRoutes.post("/nations/:id/treasury", write("economy"), async (c) => {
  const db = c.get("db");
  const body = parse5(adminAdjustTreasurySchema, await parseJson(c));
  const nation = await loadNation(db, body.nationId);
  const res = await adminAdjustTreasury(db, nation, body.delta, body.reason, adminActorOf(c.get("user")));
  return c.json(res);
});
adminRoutes.post("/nations/:id/income", write("economy"), async (c) => {
  const db = c.get("db");
  const nationId = Number(c.req.param("id"));
  const body = parse5(adminSetIncomeSchema, await parseJson(c));
  const nation = await loadNation(db, nationId);
  const res = await adminSetIncome(
    db,
    nation,
    { factoryIncome: body.factoryIncome, mineIncome: body.mineIncome, upkeepBase: body.upkeepBase },
    body.reason,
    await settingsFor(c),
    adminActorOf(c.get("user"))
  );
  return c.json({ income: res });
});
adminRoutes.post("/nations/:id/inventory", write("nations"), async (c) => {
  const db = c.get("db");
  const body = parse5(adminInventoryDeltaSchema, await parseJson(c));
  const res = await adminAdjustInventory(db, body.nationId, body.templateId, body.delta, body.reason, await settingsFor(c), adminActorOf(c.get("user")));
  return c.json(res);
});
adminRoutes.post("/nations/:id/defense", write("nations"), async (c) => {
  const body = parse5(external_exports2.object({ fortificationLevel: external_exports2.coerce.number().int().min(0).max(20), defenseMode: external_exports2.enum(["standard", "alert", "fortified"]) }), await parseJson(c));
  await c.get("db").run(sql`UPDATE nation_settings SET fortification_level = ${body.fortificationLevel}, defense_mode = ${body.defenseMode}, updated_at = ${nowSeconds()} WHERE nation_id = ${Number(c.req.param("id"))}`);
  await audit(c.get("db"), { actor: adminActorOf(c.get("user")), action: "nation.set_defense", targetType: "nation", targetId: Number(c.req.param("id")), after: body });
  return c.json({ ok: true });
});
adminRoutes.post("/nations/:id/delete", write("nations"), async (c) => {
  const body = parse5(external_exports2.object({ confirmText: external_exports2.string().min(4), reason: external_exports2.string().trim().min(3).max(200) }), await parseJson(c));
  const res = await adminDeleteNation(c.get("db"), Number(c.req.param("id")), body.confirmText, body.reason, adminActorOf(c.get("user")));
  await recomputeRankings(c.get("db"), await settingsFor(c));
  return c.json(res);
});
adminRoutes.get("/economy", requireAdmin("economy"), async (c) => {
  const db = c.get("db");
  const settings = await loadSettings(db);
  return c.json({
    money: await globalMoneyStats(db),
    rules: settings.economy,
    starterEconomy: await db.all(sql`SELECT * FROM starter_templates ORDER BY id`),
    health: await revenueHealth(db)
  });
});
adminRoutes.post("/economy/rules", write("economy"), async (c) => {
  const db = c.get("db");
  const body = parse5(economyRulesSchema, await parseJson(c));
  const updated = await setSettingsBulk(db, { [GAME_SETTING_KEYS.economy]: body }, c.get("user").userId);
  await audit(db, { actor: adminActorOf(c.get("user")), action: "settings.economy_rules", after: body });
  const nations = await db.all(sql`SELECT id FROM nations WHERE status <> 'dissolved' LIMIT 200`);
  for (const n of nations) {
    const nation = await loadNation(db, n.id);
    await refreshNationStats(db, nation, await loadSettings(db, { force: true }));
  }
  return c.json({ updated, recalculatedNations: nations.length });
});
adminRoutes.get("/economy/transactions", requireAdmin("economy"), async (c) => {
  const db = c.get("db");
  const rows = await db.all(
    sql`SELECT t.*, n.name AS nation_name FROM transactions t JOIN nations n ON n.id = t.nation_id
         ORDER BY t.id DESC LIMIT ${Math.min(200, Math.max(10, Number(c.req.query("limit") ?? 50)))}`
  );
  return c.json({ rows });
});
adminRoutes.get(
  "/shop/equipment",
  requireAdmin("shop"),
  async (c) => c.json({
    items: await adminListEquipment(c.get("db"), {
      categoryKey: c.req.query("category") ?? null,
      search: c.req.query("q") ?? null,
      onlyUnpriced: c.req.query("unpriced") === "1",
      limit: Number(c.req.query("limit") ?? 0) || void 0,
      offset: Number(c.req.query("offset") ?? 0) || void 0
    })
  })
);
adminRoutes.post("/shop/equipment", write("shop"), async (c) => {
  const body = parse5(equipmentUpsertSchema, await parseJson(c));
  return c.json(await adminUpsertEquipment(c.get("db"), body, adminActorOf(c.get("user"))));
});
adminRoutes.post(
  "/shop/equipment/:id/delete",
  write("shop"),
  async (c) => c.json(await adminDeleteEquipment(c.get("db"), Number(c.req.param("id")), adminActorOf(c.get("user"))))
);
adminRoutes.post("/shop/prices-bulk", write("shop"), async (c) => {
  const body = parse5(
    external_exports2.object({ items: external_exports2.array(external_exports2.object({ templateId: external_exports2.coerce.number().int().positive(), price: external_exports2.coerce.number().int().min(1).nullable() })) }),
    await parseJson(c)
  );
  return c.json(await adminSetPricesBulk(c.get("db"), body.items, adminActorOf(c.get("user"))));
});
adminRoutes.get("/shop/categories", requireAdmin("shop"), async (c) => c.json({ categories: await adminListCategories(c.get("db")) }));
adminRoutes.post("/shop/categories", write("shop"), async (c) => {
  const body = parse5(categorySchema, await parseJson(c));
  return c.json(await adminUpsertCategory(c.get("db"), { ...body, powerWeight: void 0 }, adminActorOf(c.get("user"))));
});
adminRoutes.post("/shop/category-weights", write("settings"), async (c) => {
  const body = parse5(external_exports2.object({ weights: external_exports2.record(external_exports2.coerce.number().min(0).max(1e5)) }), await parseJson(c));
  return c.json(await adminSetCategoryWeights(c.get("db"), body.weights, adminActorOf(c.get("user"))));
});
adminRoutes.get("/shop/sales", requireAdmin("shop"), async (c) => {
  const rows = await c.get("db").all(
    sql`SELECT ti.name_snapshot AS name, c.label_fa AS category, SUM(ti.quantity) AS units, SUM(COALESCE(ti.total_price,0)) AS revenue,
               COUNT(DISTINCT tx.nation_id) AS buyers
          FROM transaction_items ti
          JOIN transactions tx ON tx.id = ti.transaction_id
          LEFT JOIN equipment_templates t ON t.id = ti.template_id
          LEFT JOIN equipment_categories c ON c.id = t.category_id
         WHERE tx.type = 'purchase'
         GROUP BY ti.name_snapshot, c.label_fa
         ORDER BY revenue DESC LIMIT 50`
  );
  return c.json({ rows });
});
adminRoutes.get("/starter-templates", requireAdmin("economy"), async (c) => c.json({ templates: await adminListStarterTemplates(c.get("db")) }));
adminRoutes.post("/starter-templates", write("economy"), async (c) => {
  const body = parse5(starterTemplateSchema, await parseJson(c));
  return c.json(await adminUpsertStarterTemplate(c.get("db"), { ...body, items: body.items?.map((i) => ({ templateId: i.templateId, quantity: i.quantity })) }, adminActorOf(c.get("user"))));
});
adminRoutes.get("/starter-templates/:id/items", requireAdmin("economy"), async (c) => {
  const rows = await c.get("db").all(
    sql`SELECT i.quantity, t.id AS template_id, t.name_fa, c.label_fa, c.emoji
          FROM starter_template_items i JOIN equipment_templates t ON t.id = i.equipment_template_id
          JOIN equipment_categories c ON c.id = t.category_id
         WHERE i.starter_template_id = ${Number(c.req.param("id"))} ORDER BY c.sort_order`
  );
  return c.json({ rows });
});
adminRoutes.get("/wars", requireAdmin("wars"), async (c) => {
  const db = c.get("db");
  const status = c.req.query("status") ?? "all";
  const allowed = ["proposed", "accepted", "active", "peace_requested", "ended", "cancelled", "stopped_by_admin"];
  const filter = allowed.includes(status) ? "WHERE w.status = ?" : "";
  const bindings = filter ? [status, 100] : [100];
  const rows = await db.all({
    sql: `SELECT w.*, a.name AS attacker_name, a.flag AS attacker_flag, d.name AS defender_name, d.flag AS defender_flag,
                 (SELECT COUNT(*) FROM battles b WHERE b.war_id = w.id) AS battle_count,
                 (SELECT MAX(round_no) FROM battles b2 WHERE b2.war_id = w.id) AS last_round
            FROM wars w JOIN nations a ON a.id = w.attacker_nation_id JOIN nations d ON d.id = w.defender_nation_id
           ${filter}
           ORDER BY w.id DESC LIMIT ?`,
    bindings
  });
  return c.json({
    wars: rows.map((r) => ({
      ...mapWar({
        ...r,
        id: Number(r.id),
        attacker_nation_id: Number(r.attacker_nation_id),
        defender_nation_id: Number(r.defender_nation_id),
        attacker_power: Number(r.attacker_power),
        defender_power: Number(r.defender_power),
        attacker_win_chance: Number(r.attacker_win_chance),
        rounds_played: Number(r.rounds_played),
        max_rounds: Number(r.max_rounds),
        entry_cost: Number(r.entry_cost),
        indemnity_offered: Number(r.indemnity_offered),
        indemnity_paid: Number(r.indemnity_paid),
        seed: Number(r.seed),
        proposed_at: Number(r.proposed_at),
        winner_nation_id: r.winner_nation_id === null ? null : Number(r.winner_nation_id)
      }),
      battles: Number(r.battle_count),
      lastRound: r.last_round === null ? null : Number(r.last_round)
    }))
  });
});
adminRoutes.post("/wars/:id/stop", write("wars"), async (c) => {
  const body = parse5(external_exports2.object({ reason: external_exports2.string().trim().min(3).max(200) }), await parseJson(c));
  return c.json(await adminStopWar(c.get("db"), Number(c.req.param("id")), "stop", adminActorOf(c.get("user")), body.reason));
});
adminRoutes.post("/wars/:id/end", write("wars"), async (c) => {
  const body = parse5(external_exports2.object({ reason: external_exports2.string().trim().min(3).max(200) }), await parseJson(c));
  return c.json(await adminStopWar(c.get("db"), Number(c.req.param("id")), "end", adminActorOf(c.get("user")), body.reason));
});
adminRoutes.get("/wars/:id/report", requireAdmin("wars"), async (c) => {
  const rows = await c.get("db").all(
    sql`SELECT b.*, br.attacker_json, br.defender_json, br.indemnity, br.attacker_win_chance
          FROM battles b LEFT JOIN battle_reports br ON br.battle_id = b.id
         WHERE b.war_id = ${Number(c.req.param("id"))} ORDER BY b.round_no`
  );
  return c.json({ rounds: rows });
});
adminRoutes.get("/diplomacy", requireAdmin("diplomacy"), async (c) => {
  const db = c.get("db");
  const relations = await db.all(
    sql`SELECT r.*, a.name AS n1, b.name AS n2, a.flag AS f1, b.flag AS f2
          FROM diplomatic_relations r JOIN nations a ON a.id = r.nation_id JOIN nations b ON b.id = r.other_nation_id
         ORDER BY r.updated_at DESC LIMIT 200`
  );
  const requests = await db.all(
    sql`SELECT r.*, a.name AS from_name, b.name AS to_name FROM diplomatic_requests r
          JOIN nations a ON a.id = r.from_nation_id JOIN nations b ON b.id = r.to_nation_id
         WHERE r.status = 'pending' ORDER BY r.id DESC LIMIT 100`
  );
  const alliances = await db.all(
    sql`SELECT al.*, COUNT(m.nation_id) AS members, l.name AS leader FROM alliances al
          LEFT JOIN alliance_members m ON m.alliance_id = al.id
          LEFT JOIN nations l ON l.id = al.leader_nation_id
         GROUP BY al.id ORDER BY al.id DESC LIMIT 50`
  );
  return c.json({ relations, requests, alliances });
});
adminRoutes.post("/diplomacy/alliance/:id/disband", write("diplomacy"), async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));
  const at = nowSeconds();
  await db.batch([
    sql`UPDATE alliances SET status = 'disbanded', disbanded_at = ${at} WHERE id = ${id}`,
    sql`DELETE FROM alliance_members WHERE alliance_id = ${id}`,
    sql`UPDATE diplomatic_relations SET status = 'friend', alliance_id = NULL, updated_at = ${at} WHERE alliance_id = ${id}`
  ]);
  await audit(db, { actor: adminActorOf(c.get("user")), action: "diplomacy.disband_alliance", targetType: "alliance", targetId: id });
  return c.json({ disbanded: true });
});
adminRoutes.get(
  "/statements",
  requireAdmin("statements"),
  async (c) => c.json(await adminListStatements(c.get("db"), { status: c.req.query("status") ?? "all", search: c.req.query("q") ?? null, limit: Number(c.req.query("limit") ?? 0) || void 0, offset: Number(c.req.query("offset") ?? 0) || void 0 }))
);
adminRoutes.post("/statements/:id/review", write("statements"), async (c) => {
  const body = parse5(external_exports2.object({ decision: external_exports2.enum(["approve", "reject", "remove"]), note: external_exports2.string().trim().max(200).optional() }), await parseJson(c));
  return c.json(await adminReviewStatement(c.get("db"), Number(c.req.param("id")), body.decision, body.note ?? null, adminActorOf(c.get("user"))));
});
adminRoutes.post("/announcements", write("statements"), async (c) => {
  const body = parse5(external_exports2.object({ title: external_exports2.string().trim().min(3).max(120), body: external_exports2.string().trim().min(3).max(1200), targetNationId: external_exports2.coerce.number().int().positive().nullable().optional() }), await parseJson(c));
  return c.json(await adminBroadcast(c.get("db"), { title: body.title, body: body.body, targetNationId: body.targetNationId ?? null }, adminActorOf(c.get("user")), c.env.BOT_TOKEN));
});
var SETTINGS_BUNDLE_KEY = {
  [GAME_SETTING_KEYS.battle]: "battle",
  [GAME_SETTING_KEYS.economy]: "economy",
  [GAME_SETTING_KEYS.profile]: "profile",
  [GAME_SETTING_KEYS.diplomacy]: "diplomacy",
  [GAME_SETTING_KEYS.features]: "features",
  [GAME_SETTING_KEYS.branding]: "branding",
  [GAME_SETTING_KEYS.quota]: "quota"
};
var SETTINGS_SCHEMAS = {
  [GAME_SETTING_KEYS.battle]: battleParamsSchema,
  [GAME_SETTING_KEYS.economy]: economyRulesSchema,
  [GAME_SETTING_KEYS.profile]: profileRulesSchema,
  [GAME_SETTING_KEYS.diplomacy]: diplomacyRulesSchema,
  [GAME_SETTING_KEYS.features]: featureFlagsSchema,
  [GAME_SETTING_KEYS.branding]: brandingSchema,
  [GAME_SETTING_KEYS.quota]: quotaGuardSchema
};
adminRoutes.get("/settings", requireAdmin(), async (c) => {
  const db = c.get("db");
  const settings = await loadSettings(db, { force: true });
  return c.json({
    settings,
    sections: ADMIN_SECTIONS,
    freePlan: { note: "\u0645\u0642\u0627\u062F\u06CC\u0631 \u0633\u0647\u0645\u06CC\u0647 \u062F\u0631 \u067E\u0646\u0644 \xAB\u0633\u0647\u0645\u06CC\u0647\xBB \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F." }
  });
});
adminRoutes.post("/settings", write("settings"), async (c) => {
  const db = c.get("db");
  const body = await parseJson(c);
  const patch = {};
  const current = await loadSettings(db, { force: true });
  for (const [key, schema] of Object.entries(SETTINGS_SCHEMAS)) {
    if (!(key in body)) continue;
    const bundleKey = SETTINGS_BUNDLE_KEY[key];
    if (!bundleKey) throw ApiError.internal(`\u06A9\u0644\u06CC\u062F \u062A\u0646\u0638\u06CC\u0645\u0627\u062A ${key} \u0634\u0646\u0627\u062E\u062A\u0647\u200C\u0634\u062F\u0647 \u0646\u06CC\u0633\u062A.`);
    const merged = { ...current[bundleKey] ?? {}, ...body[key] ?? {} };
    const res = schema.safeParse(merged);
    if (!res.success) throw ApiError.validation(`\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \xAB${key}\xBB \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A`, formatZodError(res.error).fields);
    patch[key] = res.data;
  }
  if (GAME_SETTING_KEYS.rankingWeights in body) {
    const w = parse5(external_exports2.object({ rankingWeights: external_exports2.record(external_exports2.coerce.number().min(0).max(10)) }), { rankingWeights: body[GAME_SETTING_KEYS.rankingWeights] });
    patch[GAME_SETTING_KEYS.rankingWeights] = w.rankingWeights;
  }
  const keys = Object.keys(patch);
  if (keys.length === 0) throw ApiError.validation("\u0647\u06CC\u0686 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0645\u0639\u062A\u0628\u0631\u06CC \u0627\u0631\u0633\u0627\u0644 \u0646\u0634\u062F.");
  const updated = await setSettingsBulk(db, patch, c.get("user").userId);
  await audit(db, { actor: adminActorOf(c.get("user")), action: "settings.update", after: { keys, patch } });
  if (keys.includes(GAME_SETTING_KEYS.rankingWeights) || keys.includes(GAME_SETTING_KEYS.battle)) await recomputeRankings(db, await loadSettings(db, { force: true }));
  return c.json({ updated });
});
adminRoutes.get("/audit", requireAdmin("audit"), async (c) => {
  const db = c.get("db");
  const limit = Math.min(200, Math.max(10, Number(c.req.query("limit") ?? 50)));
  const offset = Math.max(0, Number(c.req.query("offset") ?? 0));
  const rows = await db.all(
    sql`SELECT a.*, u.username, u.telegram_user_id FROM audit_logs a LEFT JOIN users u ON u.id = a.actor_user_id
         ORDER BY a.id DESC LIMIT ${limit} OFFSET ${offset}`
  );
  return c.json({ rows: rows.map((r) => ({ ...r, created_at_iso: toIso(Number(r.created_at)) })) });
});
adminRoutes.get("/quota", requireAdmin("quota"), async (c) => c.json(await snapshotQuota(c.get("db"), await loadSettings(c.get("db")))));
adminRoutes.post("/jobs/run", write("settings"), async (c) => {
  const body = parse5(
    external_exports2.object({ jobs: external_exports2.array(external_exports2.enum(["wars", "war_expiry", "ranking", "diplomacy_expiry", "housekeeping"])).min(1).max(6) }),
    await parseJson(c)
  );
  const res = await triggerJobsManually(c.env, c.get("db"), body.jobs);
  await audit(c.get("db"), { actor: adminActorOf(c.get("user")), action: "jobs.run", after: body });
  return c.json(res);
});
adminRoutes.get("/backup/export", requireAdmin("backup"), async (c) => {
  const db = c.get("db");
  const tables = (c.req.query("tables") ?? "").split(",").filter(Boolean);
  const dump = await exportBackup(db, { tables: tables.length ? tables : null });
  await logBackupRun(db, "backup.export", dump.meta.tables.length, adminActorOf(c.get("user")), "manual export");
  return new Response(JSON.stringify(dump), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="world-war-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json"`
    }
  });
});
adminRoutes.get("/backup/tables", requireAdmin("backup"), async (c) => c.json({ tables: [...BACKUP_TABLES] }));
adminRoutes.get("/backup/runs", requireAdmin("backup"), async (c) => c.json({ runs: await listBackupRuns(c.get("db")) }));
adminRoutes.post("/backup/restore", write("backup"), async (c) => {
  const db = c.get("db");
  const body = await parseJson(c);
  if (!body.data || typeof body.data !== "object") throw ApiError.validation("\u0633\u0627\u062E\u062A\u0627\u0631 \u0641\u0627\u06CC\u0644 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.");
  const nations = await db.first(sql`SELECT COUNT(*) AS c FROM nations`);
  if (Number(nations?.c ?? 0) > 0 && !body.force) {
    throw ApiError.conflict("\u062F\u06CC\u062A\u0627\u0628\u06CC\u0633 \u062E\u0627\u0644\u06CC \u0646\u06CC\u0633\u062A. \u0628\u0631\u0627\u06CC \u0628\u0627\u0632\u0646\u0648\u06CC\u0633\u06CC force: true \u0628\u0641\u0631\u0633\u062A\u06CC\u062F (\u06CC\u0627 \u0627\u0632 wrangler d1 restore \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F).");
  }
  const allowed = new Set(BACKUP_TABLES);
  const applied = {};
  for (const [table, rows] of Object.entries(body.data)) {
    if (!allowed.has(table) || !Array.isArray(rows)) continue;
    let count = 0;
    for (const row of rows.slice(0, 500)) {
      const obj = row;
      const keys = Object.keys(obj).filter((k) => /^[a-z_]+$/.test(k));
      if (keys.length === 0) continue;
      const stmt = {
        sql: `INSERT OR REPLACE INTO ${table} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
        bindings: keys.map((k) => typeof obj[k] === "boolean" ? Number(obj[k]) : obj[k])
      };
      await db.run(stmt);
      count++;
    }
    applied[table] = count;
  }
  await audit(db, { actor: adminActorOf(c.get("user")), action: "backup.restore", after: { tables: applied } });
  return c.json({ applied });
});
function mountAdmin(app2) {
  app2.route("/api/admin", adminRoutes);
}

// apps/worker/src/bot/handlers.ts
init_src();
init_sql();
init_format();
init_errors2();
init_authService();
init_queries();
init_warService();
init_diplomacyService();
init_telegram();

// apps/worker/src/bot/ui.ts
init_src();
init_telegram();
var REPLY_MENU = [
  [{ text: "\u{1F6E1}\uFE0F \u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0634\u0648\u0631" }, { text: "\u{1F4B0} \u062F\u0627\u0631\u0627\u06CC\u06CC" }],
  [{ text: "\u{1F6D2} \u062E\u0631\u06CC\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A" }, { text: "\u2694\uFE0F \u062D\u0645\u0644\u0647" }],
  [{ text: "\u{1F6E1}\uFE0F \u062F\u0641\u0627\u0639" }, { text: "\u{1F381} \u062C\u0648\u0627\u06CC\u0632 \u0631\u0648\u0632\u0627\u0646\u0647" }],
  [{ text: "\u{1F4DC} \u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0647\u0627" }, { text: "\u{1F3D7}\uFE0F \u0633\u0627\u062E\u062A \u0648 \u0633\u0627\u0632" }],
  [{ text: "\u{1F3E6} \u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC" }, { text: "\u{1F3C6} \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u06A9\u0634\u0648\u0631\u0647\u0627" }]
];
var REPLY_TO_LABEL = {
  "\u{1F6E1}\uFE0F \u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0634\u0648\u0631": "country",
  "\u{1F4B0} \u062F\u0627\u0631\u0627\u06CC\u06CC": "economy",
  "\u{1F6D2} \u062E\u0631\u06CC\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A": "marketplace",
  "\u2694\uFE0F \u062D\u0645\u0644\u0647": "war",
  "\u{1F6E1}\uFE0F \u062F\u0641\u0627\u0639": "defense",
  "\u{1F310} \u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC": "diplomacy",
  "\u{1F4DC} \u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0647\u0627": "statements"
};
function mainMenu(webAppUrl) {
  const rows = [];
  if (webAppUrl) rows.push([{ text: "\u{1F916} \u0648\u0631\u0648\u062F \u0628\u0647 \u0628\u0627\u0632\u06CC \u06A9\u0633\u0628\u200C\u062F\u0631\u0622\u0645\u062F \u{1F916}", web_app: { url: webAppUrl } }]);
  rows.push(
    [{ text: "\u{1F4B0} \u062F\u0627\u0631\u0627\u06CC\u06CC", callback_data: "nav:economy" }, { text: "\u{1F6E1}\uFE0F \u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0634\u0648\u0631", callback_data: "nav:country" }],
    [{ text: "\u{1F6D2} \u062E\u0631\u06CC\u062F \u062A\u062C\u0647\u06CC\u0632\u0627\u062A", callback_data: "nav:marketplace" }, { text: "\u2694\uFE0F \u062D\u0645\u0644\u0647", callback_data: "nav:war" }],
    [{ text: "\u{1F6E1}\uFE0F \u062F\u0641\u0627\u0639", callback_data: "nav:defense" }],
    [{ text: "\u2139\uFE0F \u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0628\u06CC\u0634\u062A\u0631 \u0648 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A", callback_data: "h" }, { text: "\u{1F9ED} \u0633\u0627\u06CC\u0631 \u0628\u062E\u0634\u200C\u0647\u0627", callback_data: "m:more" }]
  );
  return rows;
}
function moreMenu(webAppUrl) {
  const buttons = PLAYER_PAGES.filter((p) => p !== "dashboard").map((p) => ({
    text: `${PLAYER_PAGE_META[p].emoji} ${PLAYER_PAGE_META[p].labelFa}`,
    callback_data: `nav:${p}`
  }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
  if (webAppUrl) rows.unshift([{ text: "\u{1F5A5}\uFE0F \u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u0628\u0627\u0632\u06CC (Mini App)", web_app: { url: webAppUrl } }]);
  rows.push([{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC", callback_data: "m" }]);
  return rows;
}
var CATEGORY_TO_KEY = Object.fromEntries(
  EQUIPMENT_CATEGORIES.map((c) => [c.shopLabelFa, c.key])
);
var CATEGORY_BACK_TEXT = "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC";
var CATEGORY_ENTRY_TEXT = "\u062E\u0628\u060C \u062D\u0627\u0644\u0627 \u0686\u0647 \u06A9\u0627\u0631\u06CC \u0628\u0631\u0627\u06CC \u0627\u0646\u062C\u0627\u0645 \u0628\u062F\u0645\u061F \u{1F447} \u0627\u0632 \u0645\u0646\u0648\u06CC \u067E\u0627\u06CC\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646";
var CATEGORY_KEYPAD = (() => {
  const buttons = EQUIPMENT_CATEGORIES.map((c) => ({ text: c.shopLabelFa }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
  rows.push([{ text: CATEGORY_BACK_TEXT }]);
  return rows;
})();
function backButton(label = "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC") {
  return [[{ text: label, callback_data: "m" }]];
}
function flagKeyboard() {
  const buttons = FLAG_CHOICES.map((flag, index) => ({ text: flag, callback_data: `flag:${index}` }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 4) rows.push(buttons.slice(i, i + 4));
  rows.push([{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "flow:cancel" }]);
  return rows;
}
function yesNoRows(callbackPrefix, yes = "\u2705 \u062A\u0623\u06CC\u06CC\u062F", no = "\u274C \u0644\u063A\u0648") {
  return [[{ text: yes, callback_data: `${callbackPrefix}:yes` }, { text: no, callback_data: `${callbackPrefix}:no` }]];
}
function pager(prefix, offset, total, pageSize = 8) {
  const rows = [];
  const page = Math.floor(offset / pageSize);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const nav = [];
  if (page > 0) nav.push({ text: "\u23EE\uFE0F \u0642\u0628\u0644\u06CC", callback_data: `${prefix}:${offset - pageSize}` });
  nav.push({ text: `\u0635\u0641\u062D\u0647 ${page + 1}/${pages}`, callback_data: "noop" });
  if ((page + 1) * pageSize < total) nav.push({ text: "\u27A1\uFE0F \u0628\u0639\u062F\u06CC", callback_data: `${prefix}:${offset + pageSize}` });
  rows.push(nav);
  return rows;
}
function statLine(label, value) {
  return `${escapeHtml(label)}: <b>${escapeHtml(value)}</b>`;
}
function formatNumber(n) {
  return Math.round(n).toLocaleString("en-US");
}
function percent(v) {
  return `${Math.round(v * 100)}\u066A`;
}

// apps/worker/src/bot/handlers.ts
function createBotCtx(env, db, fetchImpl) {
  configureTelegramApiBase(env.TELEGRAM_API_BASE);
  return {
    db,
    env,
    tg: new TelegramApi(env.BOT_TOKEN ?? "", env.TELEGRAM_API_BASE, fetchImpl),
    settings: {
      battle: {},
      economy: {},
      profile: {},
      diplomacy: {},
      features: {},
      quota: {},
      branding: {},
      rankingWeights: {},
      loadedAt: 0
    },
    webAppUrl: (env.WEBAPP_URL || env.PUBLIC_BASE_URL || "") + "/app/player"
  };
}
async function sendMainMenu(ctx, chatId) {
  await ctx.tg.sendMessage(chatId, "\u2328\uFE0F \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC \u06A9\u0634\u0648\u0631 (\u06F9 \u0628\u062E\u0634) \u0628\u0647\u200C\u0635\u0648\u0631\u062A \u0635\u0641\u062D\u0647\u200C\u06A9\u0644\u06CC\u062F \u067E\u0627\u06CC\u06CC\u0646 \u062A\u0644\u06AF\u0631\u0627\u0645 \u0646\u0635\u0628 \u0634\u062F. \xAB\u{1F504} \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC\xBB \u0647\u0645\u06CC\u0634\u0647 \u0622\u0646 \u0631\u0627 \u0628\u0627\u0632\u0645\u06CC\u200C\u06AF\u0631\u062F\u0627\u0646\u062F.", { reply: REPLY_MENU });
}
async function handleUpdate(ctx, update) {
  const fresh = await ctx.db.run(
    sql`INSERT OR IGNORE INTO processed_webhook_updates (update_id, chat_id, kind, payload_hash, created_at)
         VALUES (${update.update_id}, ${update.message?.chat.id ?? update.callback_query?.message?.chat.id ?? null},
                 ${update.callback_query ? "callback" : update.message ? "message" : "other"},
                 ${hashUpdate(update)}, ${nowSeconds()})`
  );
  if (!fresh.meta.changes) return { handled: "duplicate" };
  if (update.callback_query) return handleCallback(ctx, update.callback_query, update.update_id);
  if (update.message) return handleUserMessage(ctx, update.message, update.update_id);
  return { handled: "ignored" };
}
function hashUpdate(update) {
  return `${update.update_id}:${update.message?.message_id ?? update.callback_query?.id ?? ""}`;
}
async function handleUserMessage(ctx, message, updateId) {
  const from = message.from;
  if (!from?.id) return { handled: "no_user" };
  if (message.text?.startsWith("/")) return handleCommand(ctx, message, updateId);
  const identity = await upsertTelegramUser(ctx.db, { telegramId: from.id, username: from.username ?? null, firstName: from.first_name ?? null, lastName: from.last_name ?? null, languageCode: from.language_code ?? null }, ctx.env);
  const flow = await ctx.db.first(
    sql`SELECT state, data FROM bot_flow_states WHERE user_id = ${identity.userId} AND (expires_at IS NULL OR expires_at > ${nowSeconds()})`
  );
  const text = (message.text ?? "").trim();
  if (!text) {
    await ctx.tg.sendMessage(message.chat.id, "\u062F\u0631 \u0627\u06CC\u0646 \u0645\u0631\u062D\u0644\u0647 \u0641\u0642\u0637 <b>\u0645\u062A\u0646</b> \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F.");
    return { handled: "empty" };
  }
  if (flow?.state === "onb:name") {
    return continueOnboarding(ctx, identity.userId, from.id, "name", text);
  }
  if (flow?.state === "onb:leader") {
    return continueOnboarding(ctx, identity.userId, from.id, "leader", text);
  }
  if (flow?.state === "stmt:text") {
    const nation = await currentNation(ctx, identity.userId);
    if (!nation) {
      await clearFlow(ctx.db, identity.userId);
      return { handled: "no_nation" };
    }
    const preview = [
      `\u{1F4DC} <b>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u0628\u06CC\u0627\u0646\u06CC\u0647</b>`,
      ``,
      `${nation.flag} <b>${escapeHtml(nation.name)}</b> \u2014 \u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631: ${escapeHtml(nation.leader_name)}`,
      ``,
      escapeHtml(text.slice(0, 1200)),
      ``,
      `\u062A\u0623\u06CC\u06CC\u062F \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F\u061F \u067E\u0633 \u0627\u0632 \u062B\u0628\u062A\u060C \u0627\u06CC\u0646 \u0645\u062A\u0646 \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0645\u0648\u0636\u0639 \u0631\u0633\u0645\u06CC \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0645\u0646\u062A\u0634\u0631 \u062E\u0648\u0627\u0647\u062F \u0634\u062F.`
    ].join("\n");
    await ctx.db.run(
      sql`INSERT INTO bot_flow_states (user_id, state, nation_id, data, updated_at, expires_at)
           VALUES (${identity.userId}, 'stmt:confirm', ${nation.id}, ${JSON.stringify({ text: text.slice(0, 1200) })}, ${nowSeconds()}, ${nowSeconds() + 3600})
           ON CONFLICT (user_id) DO UPDATE SET state = 'stmt:confirm', data = excluded.data, updated_at = excluded.updated_at, expires_at = excluded.expires_at`
    );
    await ctx.tg.sendMessage(message.chat.id, preview, { inline: yesNoRows("sp") });
    return { handled: "statement_preview" };
  }
  if (text === "\u{1F381} \u062C\u0648\u0627\u06CC\u0632 \u0631\u0648\u0632\u0627\u0646\u0647") {
    await sendPrizesCard(ctx, message.chat.id, identity.userId);
    return { handled: "reply:prizes" };
  }
  if (text === "\u{1F6E1}\uFE0F \u062F\u0641\u0627\u0639") {
    const nation = await currentNation(ctx, identity.userId);
    if (!nation) {
      await ctx.tg.sendMessage(message.chat.id, "\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", { inline: [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }]] });
      return { handled: "reply:defense:no_nation" };
    }
    await renderDefenseArranger(ctx, message.chat.id, null, identity.userId, nation);
    return { handled: "reply:defense" };
  }
  if (text === "\u{1F3E6} \u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC") {
    const nation = await currentNation(ctx, identity.userId);
    if (!nation) {
      await ctx.tg.sendMessage(message.chat.id, "\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", { inline: [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }]] });
      return { handled: "reply:bank:no_nation" };
    }
    await sendBankHome(ctx, message.chat.id, identity.userId, nation);
    return { handled: "reply:bank" };
  }
  if (text === "\u{1F3D7}\uFE0F \u0633\u0627\u062E\u062A \u0648 \u0633\u0627\u0632") {
    const nation = await currentNation(ctx, identity.userId);
    if (!nation) {
      await ctx.tg.sendMessage(message.chat.id, "\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", { inline: [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }]] });
      return { handled: "reply:build:no_nation" };
    }
    await sendBuildingsHome(ctx, message.chat.id, nation);
    return { handled: "reply:build" };
  }
  if (text === "\u{1F3C6} \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u0642\u062F\u0631\u062A\u200C\u0647\u0627\u06CC \u062C\u0647\u0627\u0646" || text === "\u{1F3C6} \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u06A9\u0634\u0648\u0631\u0647\u0627") {
    await sendRankingsCard(ctx, message.chat.id, identity.userId, "global");
    return { handled: "reply:rankings" };
  }
  const catKey = CATEGORY_TO_KEY[text];
  if (catKey) {
    await sendShopCategoryCard(ctx, message.chat.id, identity.userId, catKey);
    return { handled: `reply:shop:${catKey}` };
  }
  if (text === CATEGORY_BACK_TEXT) {
    await ctx.tg.sendMessage(message.chat.id, await welcomeText(ctx, identity.userId), { inline: mainMenu(ctx.webAppUrl) });
    await sendMainMenu(ctx, message.chat.id);
    return { handled: "reply:back_to_menu" };
  }
  const mapped = REPLY_TO_LABEL[text];
  if (mapped) {
    await renderPage(ctx, message.chat.id, identity.userId, mapped === "menu" ? "dashboard" : mapped, message.message_id);
    if (mapped === "country") {
      await ctx.tg.sendMessage(message.chat.id, CATEGORY_ENTRY_TEXT, { reply: CATEGORY_KEYPAD });
    }
    return { handled: `reply:${mapped}` };
  }
  await ctx.tg.sendMessage(message.chat.id, "\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647. \u0627\u0632 \u0645\u0646\u0648\u06CC \u067E\u0627\u06CC\u06CC\u0646 \u06CC\u0627 /menu \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.");
  return { handled: "unknown" };
}
async function handleCommand(ctx, message, updateId) {
  const from = message.from;
  if (!from?.id) return { handled: "no_user" };
  const parts = (message.text ?? "").trim().split(/\s+/);
  const cmd = (parts[0] ?? "/start").toLowerCase().split("@")[0];
  const identity = await upsertTelegramUser(
    ctx.db,
    { telegramId: from.id, username: from.username ?? null, firstName: from.first_name ?? null, lastName: from.last_name ?? null, languageCode: from.language_code ?? null },
    ctx.env
  );
  const nations = await ctx.db.all(sql`SELECT id FROM nations WHERE owner_user_id = ${identity.userId} AND status <> 'dissolved'`);
  switch (cmd) {
    case "/start": {
      const startParam = parts[1] ?? "";
      if (startParam.startsWith("admin")) {
        await ctx.tg.sendMessage(message.chat.id, `\u{1F6E0}\uFE0F \u067E\u0646\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A: <a href="${ctx.webAppUrl.replace("/app/player", "/app/admin")}">\u0628\u0627\u0632 \u06A9\u0631\u062F\u0646</a>`);
        if (identity.role === "player") {
          await ctx.tg.sendMessage(message.chat.id, "\u0634\u0645\u0627 \u0646\u0642\u0634 \u0645\u062F\u06CC\u0631\u06CC\u062A\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F\u061B \u062F\u0633\u062A\u0631\u0633\u06CC \u0627\u0632 \u067E\u0646\u0644 \u0627\u062F\u0645\u06CC\u0646 \u062A\u0648\u0633\u0637 Super Admin \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.");
        }
        return { handled: "start:admin" };
      }
      if (nations.length === 0) return startOnboarding(ctx, message, identity.userId);
      await ctx.tg.sendMessage(message.chat.id, await welcomeText(ctx, identity.userId), { inline: mainMenu(ctx.webAppUrl) });
      return { handled: "start" };
    }
    case "/id":
    case "/myid": {
      const listed = parseAdminIds(ctx.env).has(from.id);
      const roleFa = identity.role === "super_admin" ? "\u0633\u0648\u067E\u0631 \u0627\u062F\u0645\u06CC\u0646" : identity.role === "admin" ? "\u0645\u062F\u06CC\u0631" : "\u0628\u0627\u0632\u06CC\u06A9\u0646";
      await ctx.tg.sendMessage(
        message.chat.id,
        [
          `\u{1FAAA} <b>\u0622\u06CC\u200C\u062F\u06CC \u062A\u0644\u06AF\u0631\u0627\u0645 \u0634\u0645\u0627:</b> <code>${from.id}</code>`,
          "",
          `\u0646\u0642\u0634 \u062F\u0631 \u0628\u0627\u0632\u06CC: <b>${roleFa}</b>`,
          `\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC: ${from.username ? `@${escapeHtml(from.username)}` : "\u2014"}`,
          `\u06A9\u0634\u0648\u0631\u0647\u0627\u06CC \u0641\u0639\u0627\u0644: <b>${nations.length}</b>`,
          `\u062F\u0631 ADMIN_TELEGRAM_IDS: <b>${listed ? "\u0647\u0633\u062A\u06CC\u062F \u2705" : "\u0646\u06CC\u0633\u062A\u06CC\u062F \u2716\uFE0F"}</b>`,
          "",
          listed ? "\u0628\u0631\u0627\u06CC \u0628\u0627\u0632 \u06A9\u0631\u062F\u0646 \u067E\u0646\u0644: /start admin" : "\u0628\u0631\u0627\u06CC \u0645\u062F\u06CC\u0631 \u0634\u062F\u0646: \u0627\u06CC\u0646 \u0639\u062F\u062F \u0631\u0627 \u0628\u0647 ADMIN_TELEGRAM_IDS \u0627\u0636\u0627\u0641\u0647 \u06A9\u0646\u06CC\u062F (wrangler secret put) \u0648 \u0628\u0639\u062F \u06CC\u06A9 /start \u0628\u0641\u0631\u0633\u062A\u06CC\u062F \u062A\u0627 \u0646\u0642\u0634\u200C\u062A\u0627\u0646 \u0627\u0631\u062A\u0642\u0627 \u067E\u06CC\u062F\u0627 \u06A9\u0646\u062F."
        ].join("\n"),
        { inline: backButton("\u{1F3E0} \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC") }
      );
      return { handled: "id" };
    }
    case "/help":
      await ctx.tg.sendMessage(message.chat.id, helpText(), { inline: backButton("\u{1F3E0} \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC") });
      return { handled: "help" };
    case "/menu":
      if (nations.length === 0) return startOnboarding(ctx, message, identity.userId);
      await ctx.tg.sendMessage(message.chat.id, await welcomeText(ctx, identity.userId), { inline: mainMenu(ctx.webAppUrl) });
      await sendMainMenu(ctx, message.chat.id);
      return { handled: "menu" };
    case "/economy":
      return renderPage(ctx, message.chat.id, identity.userId, "economy", message.message_id);
    case "/assets":
    case "/military":
      return renderPage(ctx, message.chat.id, identity.userId, "military", message.message_id);
    case "/shop":
      return renderPage(ctx, message.chat.id, identity.userId, "marketplace", message.message_id);
    case "/war":
      return renderPage(ctx, message.chat.id, identity.userId, "war", message.message_id);
    case "/diplomacy":
      return renderPage(ctx, message.chat.id, identity.userId, "diplomacy", message.message_id);
    case "/statement":
    case "/statements":
      return renderPage(ctx, message.chat.id, identity.userId, "statements", message.message_id);
    case "/rank":
    case "/rankings":
      return renderPage(ctx, message.chat.id, identity.userId, "rankings", message.message_id);
    case "/country":
      return renderPage(ctx, message.chat.id, identity.userId, "country", message.message_id);
    case "/defense":
      return renderPage(ctx, message.chat.id, identity.userId, "defense", message.message_id);
    case "/build": {
      const nation = await currentNation(ctx, identity.userId);
      if (!nation) {
        await ctx.tg.sendMessage(message.chat.id, "\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", { inline: [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }]] });
        return { handled: "reply:build:no_nation" };
      }
      await sendBuildingsHome(ctx, message.chat.id, nation);
      return { handled: "reply:build" };
    }
    case "/ranking":
      return renderPage(ctx, message.chat.id, identity.userId, "rankings", message.message_id);
    case "/bank": {
      const nation = await currentNation(ctx, identity.userId);
      if (!nation) {
        await ctx.tg.sendMessage(message.chat.id, "\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", { inline: [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }]] });
        return { handled: "bank:no_nation" };
      }
      await sendBankHome(ctx, message.chat.id, identity.userId, nation);
      return { handled: "reply:bank" };
    }
    case "/settings":
      return renderPage(ctx, message.chat.id, identity.userId, "settings", message.message_id);
    default:
      await ctx.tg.sendMessage(message.chat.id, "\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647.\n\n" + helpText(), { inline: backButton("\u{1F3E0} \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC") });
      return { handled: "unknown_command" };
  }
}
function helpText() {
  return [
    "\u2139\uFE0F <b>\u062F\u0633\u062A\u0648\u0631\u0627\u062A \u0631\u0628\u0627\u062A World War</b>",
    "",
    "/start \u2014 \u0634\u0631\u0648\u0639 \u0628\u0627\u0632\u06CC \u06CC\u0627 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC",
    "/id \u2014 \u0622\u06CC\u200C\u062F\u06CC \u062A\u0644\u06AF\u0631\u0627\u0645 \u0648 \u0646\u0642\u0634 \u0634\u0645\u0627",
    "/menu \u2014 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC",
    "/country \u2014 \u0645\u062F\u06CC\u0631\u06CC\u062A \u06A9\u0634\u0648\u0631",
    "/economy \u2014 \u062F\u0627\u0631\u0627\u06CC\u06CC \u0648 \u0627\u0642\u062A\u0635\u0627\u062F",
    "/military \u2014 \u062F\u0627\u0631\u0627\u06CC\u06CC\u200C\u0647\u0627\u06CC \u0646\u0638\u0627\u0645\u06CC",
    "/shop \u2014 \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A",
    "/war \u2014 \u062C\u0646\u06AF\u200C\u0647\u0627 \u0648 \u062D\u0645\u0644\u0627\u062A",
    "/defense \u2014 \u0648\u0636\u0639\u06CC\u062A \u062F\u0641\u0627\u0639\u06CC",
    "/bank \u2014 \u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC (\u062F\u0631\u06CC\u0627\u0641\u062A \u062F\u0631\u0622\u0645\u062F \u0648 \u0648\u0627\u0645)",
    "/build \u2014 \u0648\u0632\u0627\u0631\u062A \u0633\u0627\u062E\u062A\u200C\u0648\u0633\u0627\u0632",
    "/ranking \u2014 \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u06A9\u0634\u0648\u0631\u0647\u0627",
    "/diplomacy \u2014 \u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC \u0648 \u0627\u062A\u062D\u0627\u062F",
    "/statement \u2014 \u0635\u062F\u0648\u0631 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0631\u0633\u0645\u06CC",
    "/rankings \u2014 \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u062C\u0647\u0627\u0646\u06CC",
    "/settings \u2014 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A",
    "",
    "\u0647\u0645\u0647 \u0639\u0645\u0644\u06CC\u0627\u062A \u0645\u0627\u0644\u06CC \u0648 \u0646\u0638\u0627\u0645\u06CC \u062F\u0631 \u0633\u0631\u0648\u0631 \u0627\u0646\u062C\u0627\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F \u0648 \u0647\u06CC\u0686 \u0645\u0628\u0644\u063A\u06CC \u062F\u0631 \u06A9\u0644\u0627\u06CC\u0646\u062A \u0645\u062D\u0627\u0633\u0628\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F."
  ].join("\n");
}
async function welcomeText(ctx, userId) {
  const nation = await currentNation(ctx, userId);
  if (!nation) return ctx.settings.branding.welcomeText;
  const view = await buildNationView(ctx.db, nation, ctx.settings);
  const rel = await relationCounts(ctx.db, nation.id);
  return [
    `${ctx.settings.branding.welcomeTitle}`,
    ``,
    `${nation.flag} ${statLine("\u06A9\u0634\u0648\u0631", nation.name)}`,
    statLine("\u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631", nation.leader_name),
    ``,
    statLine("\u062E\u0632\u0627\u0646\u0647", coins(view.economy.treasury)),
    statLine("\u062F\u0631\u0622\u0645\u062F \u0647\u0631 \u062F\u0648\u0631\u0647", coins(view.economy.netIncome)),
    statLine("\u0642\u062F\u0631\u062A \u0646\u0638\u0627\u0645\u06CC", formatNumber(view.military.militaryPower)),
    statLine("\u0631\u062A\u0628\u0647 \u062C\u0647\u0627\u0646\u06CC", `#${view.nation.worldRank}`),
    statLine("\u0645\u062A\u062D\u062F\u0627\u0646", String(rel.allies)),
    statLine("\u062F\u0634\u0645\u0646\u0627\u0646", String(rel.enemies)),
    statLine("\u0648\u0636\u0639\u06CC\u062A \u06A9\u0634\u0648\u0631", statusLabel(nation.status)),
    ``,
    `\u{1F4B0} \u062F\u0631\u0622\u0645\u062F \u0622\u0645\u0627\u062F\u0647 \u062F\u0631\u06CC\u0627\u0641\u062A: ${formatNumber(view.economy.pendingIncome ?? 0)} \u0633\u06A9\u0647 \u2014 \u0627\u0632 \xAB\u{1F3E6} \u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC\xBB`
  ].join("\n");
}
function statusLabel(status) {
  return { active: "\u0641\u0639\u0627\u0644", frozen: "\u0645\u0646\u062C\u0645\u062F", banned: "\u0645\u0633\u062F\u0648\u062F", at_war: "\u062F\u0631 \u062D\u0627\u0644 \u062C\u0646\u06AF", dissolved: "\u0645\u0646\u062D\u0644\u200C\u0634\u062F\u0647" }[status] ?? status;
}
async function startOnboarding(ctx, message, userId) {
  await ctx.db.run(
    sql`INSERT INTO bot_flow_states (user_id, state, data, updated_at, expires_at)
         VALUES (${userId}, 'onb:name', NULL, ${nowSeconds()}, ${nowSeconds() + 86400})
         ON CONFLICT (user_id) DO UPDATE SET state = 'onb:name', data = NULL, updated_at = excluded.updated_at, expires_at = excluded.expires_at`
  );
  await ctx.tg.sendMessage(message.chat.id, `${ctx.settings.branding.welcomeText}

${ctx.settings.branding.nationNamePrompt}`, {
    inline: [[{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "flow:cancel" }]]
  });
  return { handled: "onboarding" };
}
async function continueOnboarding(ctx, userId, telegramId, step, text) {
  if (step === "name") {
    const name2 = text.slice(0, 30);
    if (name2.trim().length < 3) {
      await ctx.tg.sendMessage(telegramId, ctx.settings.branding.nationNamePrompt);
      return { handled: "onb:retry" };
    }
    const dup = await ctx.db.first(sql`SELECT id FROM nations WHERE name = ${name2.trim()} COLLATE NOCASE`);
    if (dup) {
      await ctx.tg.sendMessage(telegramId, "\u26A0\uFE0F \u0627\u06CC\u0646 \u0646\u0627\u0645 \u06A9\u0634\u0648\u0631 \u0642\u0628\u0644\u0627\u064B \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A.\n" + ctx.settings.branding.nationNamePrompt);
      return { handled: "onb:duplicate" };
    }
    await ctx.db.run(
      sql`UPDATE bot_flow_states SET state = 'onb:leader', data = ${JSON.stringify({ name: name2.trim() })}, updated_at = ${nowSeconds()} WHERE user_id = ${userId}`
    );
    await ctx.tg.sendMessage(telegramId, ctx.settings.branding.leaderNamePrompt, { inline: [[{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "flow:cancel" }]] });
    return { handled: "onb:leader" };
  }
  const flow = await ctx.db.first(sql`SELECT data FROM bot_flow_states WHERE user_id = ${userId}`);
  const name = safeJson3(flow?.data)?.name ?? text.slice(0, 30);
  const leaderName = text.slice(0, 40).trim();
  if (leaderName.length < 2) {
    await ctx.tg.sendMessage(telegramId, ctx.settings.branding.leaderNamePrompt);
    return { handled: "onb:retry" };
  }
  await ctx.db.run(sql`UPDATE bot_flow_states SET state = 'onb:flag', data = ${JSON.stringify({ name, leaderName })} WHERE user_id = ${userId}`);
  await ctx.tg.sendMessage(telegramId, ctx.settings.branding.flagPrompt, { inline: flagKeyboard() });
  return { handled: "onb:flag" };
}
async function finishOnboarding(ctx, userId, telegramId, flag) {
  const flow = await ctx.db.first(sql`SELECT data FROM bot_flow_states WHERE user_id = ${userId}`);
  const data = safeJson3(flow?.data);
  const name = String(data.name ?? "");
  const leaderName = String(data.leaderName ?? "");
  if (!name || !leaderName) {
    await clearFlow(ctx.db, userId);
    await ctx.tg.sendMessage(telegramId, "\u0645\u062A\u0623\u0633\u0641\u0627\u0646\u0647 \u0645\u0631\u0627\u062D\u0644 \u062B\u0628\u062A\u200C\u0646\u0627\u0645 \u0646\u0627\u062A\u0645\u0627\u0645 \u0645\u0627\u0646\u062F. \u062F\u0648\u0628\u0627\u0631\u0647 /start \u0631\u0627 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0646\u06CC\u062F.");
    return;
  }
  try {
    const result = await createNation(ctx.db, { userId, telegramId }, { name, leaderName, flag }, ctx.settings);
    await clearFlow(ctx.db, userId);
    await ctx.tg.sendMessage(telegramId, `\u2705 ${result.summary}`, { inline: mainMenu(ctx.webAppUrl) });
    await sendMainMenu(ctx, telegramId);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "\u062E\u0637\u0627 \u062F\u0631 \u062B\u0628\u062A \u06A9\u0634\u0648\u0631. \u062F\u0648\u0628\u0627\u0631\u0647 \u062A\u0644\u0627\u0634 \u06A9\u0646\u06CC\u062F.";
    await ctx.tg.sendMessage(telegramId, `\u26A0\uFE0F ${escapeHtml(message)}`, { inline: [[{ text: "\u{1F501} \u062A\u0644\u0627\u0634 \u062F\u0648\u0628\u0627\u0631\u0647", callback_data: "new" }]] });
  }
}
function safeJson3(v) {
  try {
    return v ? JSON.parse(String(v)) : {};
  } catch {
    return {};
  }
}
async function clearFlow(db, userId) {
  await db.run(sql`DELETE FROM bot_flow_states WHERE user_id = ${userId}`);
}
async function currentNation(ctx, userId) {
  return loadNationOwnedBy(ctx.db, userId);
}
async function handleCallback(ctx, cb, updateId) {
  const data = cb.data ?? "";
  const from = cb.from;
  const chatId = cb.message?.chat.id ?? from.id;
  const messageId = cb.message?.message_id ?? 0;
  if (!from?.id) return { handled: "no_user" };
  const identity = await upsertTelegramUser(ctx.db, { telegramId: from.id, username: from.username ?? null, firstName: from.first_name ?? null, languageCode: from.language_code ?? null }, ctx.env);
  const answer = (text, alert = false) => ctx.tg.answerCallbackQuery(cb.id, text, alert);
  const [head, ...rest] = data.split(":");
  try {
    switch (head) {
      case "noop":
        await answer();
        return { handled: "noop" };
      case "m":
        if (rest[0] === "more") {
          await ctx.tg.editMessageText(chatId, messageId, "\u{1F9ED} <b>\u0633\u0627\u06CC\u0631 \u0628\u062E\u0634\u200C\u0647\u0627</b>\n\n\u0647\u0631 \u06F1\u06F2 \u0628\u062E\u0634 \u0628\u0627\u0632\u06CC\u060C \u0647\u0645\u0627\u0646\u200C\u0637\u0648\u0631 \u06A9\u0647 \u062F\u0631 \u0645\u06CC\u0646\u06CC\u200C\u0627\u067E \u0647\u0645 \u062F\u0631 \u062F\u0633\u062A\u0631\u0633\u200C\u0627\u0646\u062F:", moreMenu(ctx.webAppUrl));
          await answer();
          return { handled: "menu:more" };
        }
        await ctx.tg.editMessageText(chatId, messageId, await welcomeText(ctx, identity.userId), mainMenu(ctx.webAppUrl));
        await ctx.tg.sendMessage(chatId, "\u2328\uFE0F \u0635\u0641\u062D\u0647\u200C\u06A9\u0644\u06CC\u062F \u0628\u0627\u0632\u06CC\u06A9\u0646 \u0628\u0627\u0632\u06AF\u0631\u062F\u0627\u0646\u062F\u0647 \u0634\u062F.", { reply: REPLY_MENU });
        await answer();
        return { handled: "menu" };
      case "h":
        await ctx.tg.editMessageText(chatId, messageId, helpText(), backButton("\u{1F3E0} \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC"));
        await answer();
        return { handled: "help" };
      case "flow":
        await clearFlow(ctx.db, identity.userId);
        await ctx.tg.editMessageText(chatId, messageId, "\u274C \u0639\u0645\u0644\u06CC\u0627\u062A \u0644\u063A\u0648 \u0634\u062F.", mainMenu(ctx.webAppUrl));
        await answer();
        return { handled: "flow_cancel" };
      case "new": {
        if (!ctx.tg.enabled) throw ApiError.internal("\u0631\u0628\u0627\u062A \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
        await startOnboardingCallback(ctx, chatId, messageId, identity.userId);
        await answer();
        return { handled: "onboarding" };
      }
      case "flag": {
        const flag = FLAG_CHOICES[Number(rest[0])] ?? "\u{1F3F3}\uFE0F";
        await finishOnboarding(ctx, identity.userId, chatId, flag);
        await answer();
        return { handled: "flag" };
      }
      case "nav":
        await renderPageCallback(ctx, chatId, messageId, identity.userId, rest[0]);
        if (rest[0] === "country") await ctx.tg.sendMessage(chatId, CATEGORY_ENTRY_TEXT, { reply: CATEGORY_KEYPAD });
        await answer();
        return { handled: `nav:${rest[0]}` };
      case "cat":
        await renderShopCategory(ctx, chatId, messageId, identity.userId, rest[0], Number(rest[1] ?? 0));
        await answer();
        return { handled: `cat:${rest[0]}` };
      case "item":
        await renderShopItem(ctx, chatId, messageId, identity.userId, Number(rest[0]), Number(rest[1] ?? 0));
        await answer();
        return { handled: "item" };
      case "buy":
        await confirmPurchaseAsk(ctx, chatId, messageId, identity.userId, Number(rest[0]), Number(rest[1]));
        await answer();
        return { handled: "buy" };
      case "bought": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.");
        const result = await purchase(
          ctx.db,
          nation,
          { templateId: Number(rest[0]), quantity: Number(rest[1]), idempotencyKey: `tg${updateId}` },
          ctx.settings,
          { userId: identity.userId, telegramId: from.id },
          ctx.env.BOT_TOKEN
        );
        await ctx.tg.editMessageText(
          chatId,
          messageId,
          [
            `\u{1F6D2} <b>\u062E\u0631\u06CC\u062F \u0627\u0646\u062C\u0627\u0645 \u0634\u062F</b>${result.duplicate ? " (\u062A\u06A9\u0631\u0627\u0631\u06CC \u2014 \u0627\u0639\u0645\u0627\u0644 \u0646\u0634\u062F)" : ""}`,
            `${result.quantity.toLocaleString("en-US")} \u0639\u062F\u062F ${escapeHtml(result.nameFa)}`,
            statLine("\u0642\u06CC\u0645\u062A \u0648\u0627\u062D\u062F", coins(result.unitPrice)),
            statLine("\u0645\u0628\u0644\u063A \u06A9\u0644", coins(result.totalCost)),
            statLine("\u0645\u0648\u062C\u0648\u062F\u06CC \u062C\u062F\u06CC\u062F", formatNumber(result.newQuantity)),
            statLine("\u062E\u0632\u0627\u0646\u0647", coins(result.treasuryAfter))
          ].join("\n"),
          backButton()
        );
        await answer();
        return { handled: "purchase" };
      }
      case "war": {
        if (rest[0] === "list") {
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer();
          return { handled: "war:list" };
        }
        if (rest[0] === "targets") {
          await renderWarTargets(ctx, chatId, messageId, identity.userId, Number(rest[1] ?? 0));
          await answer();
          return { handled: "war:targets" };
        }
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.");
        if (rest[0] === "ask") {
          await renderAttackPlanPicker(ctx, chatId, messageId, identity.userId, nation, Number(rest[1]));
          await answer();
          return { handled: "war:ask" };
        }
        if (rest[0] === "go") {
          const targetIdNum = Number(rest[1]);
          const draft = await loadAttackDraft(ctx.db, identity.userId);
          const planArr = draft && draft.targetNationId === targetIdNum ? draft.plan : [];
          if (planArr.length === 0) {
            await answer("\u0627\u0628\u062A\u062F\u0627 \u0622\u0631\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.", true);
            await renderAttackPlanPicker(ctx, chatId, messageId, identity.userId, nation, targetIdNum);
            return { handled: "war:go:plan_required" };
          }
          const res = await proposeWar(ctx.db, nation, targetIdNum, 0, ctx.settings, { userId: identity.userId, telegramId: from.id }, ctx.env.BOT_TOKEN, planArr);
          await clearFlow(ctx.db, identity.userId);
          const committed = planArr.reduce((sum, e) => sum + e.quantity, 0);
          await ctx.tg.editMessageText(
            chatId,
            messageId,
            `\u2694\uFE0F \u062D\u0645\u0644\u0647 \u0622\u063A\u0627\u0632 \u0634\u062F!
\u0634\u0646\u0627\u0633\u0647 \u062C\u0646\u06AF: <b>${res.warId}</b>
\u0646\u06CC\u0631\u0648\u0647\u0627\u06CC \u0645\u062A\u0639\u0647\u062F: <b>${committed.toLocaleString("en-US")} \u0648\u0627\u062D\u062F</b>
\u0627\u062D\u062A\u0645\u0627\u0644 \u067E\u06CC\u0631\u0648\u0632\u06CC \u0645\u0647\u0627\u062C\u0645: ${percent(res.preview.attackerWinChance)}

\u062E\u0628\u0631 \u0641\u0648\u0631\u06CC \u0628\u0631\u0627\u06CC \u062F\u0641\u0627\u0639 \u0627\u0631\u0633\u0627\u0644 \u0634\u062F. \u062C\u0646\u06AF \u0628\u0644\u0627\u0641\u0627\u0635\u0644\u0647 \u0634\u0631\u0648\u0639 \u0645\u06CC\u200C\u0634\u0648\u062F.`,
            [[{ text: "\u{1F4DC} \u062C\u0646\u06AF\u200C\u0647\u0627\u06CC \u0645\u0646", callback_data: "war:list" }, { text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]]
          );
          await answer();
          return { handled: "war:go" };
        }
        if (rest[0] === "no") {
          await answer("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0644\u063A\u0648 \u0634\u062F.");
          return { handled: "war:no" };
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "war:unknown" };
      }
      case "prize": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) {
          await answer("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", true);
          return { handled: "prize:no_nation" };
        }
        if (rest[0] === "claim") {
          const res = await claimDailyPrize(ctx.db, nation, ctx.settings, { botToken: ctx.env.BOT_TOKEN });
          await ctx.tg.editMessageText(
            chatId,
            messageId,
            res.alreadyClaimed ? `\u2705 \u062C\u0627\u06CC\u0632\u0647\u0654 \u0627\u0645\u0631\u0648\u0632 \u0634\u0645\u0627 \u0642\u0628\u0644\u0627\u064B \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F\u0647 \u0628\u0648\u062F: ${res.prize.emoji} ${res.prize.labelFa}

\u0641\u0631\u062F\u0627 (\u0628\u0647 \u0648\u0642\u062A UTC) \u0628\u0631\u06AF\u0631\u062F\u06CC\u062F!` : `\u{1F389} \u062A\u0628\u0631\u06CC\u06A9! \xAB${res.prize.emoji} ${res.prize.labelFa}\xBB \u0628\u0647 \u062F\u0627\u0631\u0627\u06CC\u06CC \u0634\u0645\u0627 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F.`,
            backButton()
          );
          await answer(res.alreadyClaimed ? "\u0642\u0628\u0644\u0627\u064B \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F" : "\u062C\u0627\u06CC\u0632\u0647 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F \u{1F389}");
          return { handled: "prize:claim" };
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "prize:unknown" };
      }
      case "def": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) {
          await answer("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", true);
          return { handled: "def:no_nation" };
        }
        const sub = rest[0];
        if (sub === "toggle") {
          const key = String(rest[1] ?? "");
          if (!DEFENSE_ARRANGEMENT.some((t) => t.key === key)) {
            await answer("\u062F\u0633\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.", true);
            return { handled: "def:bad_key" };
          }
          const saved = await loadDefensePlan(ctx.db, nation.id);
          const draft = await loadDefenseDraft(ctx.db, identity.userId) ?? saved ?? ALL_DEFENSE_KEYS;
          const next = draft.includes(key) ? draft.filter((k) => k !== key) : [...draft, key];
          await saveDefenseDraft(ctx.db, identity.userId, nation.id, next);
          await renderDefenseArranger(ctx, chatId, messageId, identity.userId, nation);
          await answer();
          return { handled: "def:toggle" };
        }
        if (sub === "apply") {
          const saved = await loadDefensePlan(ctx.db, nation.id);
          const draft = await loadDefenseDraft(ctx.db, identity.userId) ?? saved ?? ALL_DEFENSE_KEYS;
          const isAll = ALL_DEFENSE_KEYS.every((k) => draft.includes(k));
          await ctx.db.run(
            sql`INSERT INTO nation_settings (nation_id, defense_plan, updated_at)
                VALUES (${nation.id}, ${isAll ? null : JSON.stringify(draft)}, ${nowSeconds()})
                ON CONFLICT (nation_id) DO UPDATE SET defense_plan = excluded.defense_plan, updated_at = excluded.updated_at`
          );
          await clearDefenseDraft(ctx.db, identity.userId);
          await renderDefenseArranger(ctx, chatId, messageId, identity.userId, nation);
          await answer("\u0622\u0631\u0627\u06CC\u0634 \u062F\u0641\u0627\u0639\u06CC \u062B\u0628\u062A \u0634\u062F \u2705");
          return { handled: "def:apply" };
        }
        if (sub === "reset") {
          await ctx.db.run(
            sql`INSERT INTO nation_settings (nation_id, defense_plan, updated_at)
                VALUES (${nation.id}, NULL, ${nowSeconds()})
                ON CONFLICT (nation_id) DO UPDATE SET defense_plan = NULL, updated_at = excluded.updated_at`
          );
          await clearDefenseDraft(ctx.db, identity.userId);
          await renderDefenseArranger(ctx, chatId, messageId, identity.userId, nation);
          await answer("\u0628\u0647 \u062D\u0627\u0644\u062A \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u0628\u0627\u0632\u06AF\u0634\u062A (\u0647\u0645\u0647 \u0646\u06CC\u0631\u0648\u0647\u0627)");
          return { handled: "def:reset" };
        }
        if (sub === "stats") {
          const text = await defenseStatsText(ctx, nation);
          await ctx.tg.editMessageText(chatId, messageId, text, [[{ text: "\u{1F6E1}\uFE0F \u0622\u0631\u0627\u06CC\u0634 \u062F\u0641\u0627\u0639\u06CC", callback_data: "def:back" }, { text: "\u2B05\uFE0F \u0645\u0646\u0648", callback_data: "m" }]]);
          await answer();
          return { handled: "def:stats" };
        }
        if (sub === "back") {
          await renderDefenseArranger(ctx, chatId, messageId, identity.userId, nation);
          await answer();
          return { handled: "def:back" };
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "def:unknown" };
      }
      case "bank": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) {
          await answer("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", true);
          return { handled: "bank:no_nation" };
        }
        const sub = rest[0];
        if (sub === "home") {
          await editBankHome(ctx, chatId, messageId, nation);
          await answer();
          return { handled: "bank:home" };
        }
        if (sub === "income") {
          await editBankIncome(ctx, chatId, messageId, nation);
          await answer();
          return { handled: "bank:income" };
        }
        if (sub === "claim_income") {
          const result = await claimIncome(ctx.db, nation, ctx.settings);
          if (result.cycles === 0) {
            await answer("\u062F\u0631\u0622\u0645\u062F\u06CC \u0628\u0631\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u06CC\u0633\u062A.", true);
            await editBankIncome(ctx, chatId, messageId, nation);
            return { handled: "bank:claim:none" };
          }
          await ctx.tg.editMessageText(
            chatId,
            messageId,
            [
              "\u{1F4B4} <b>\u062F\u0631\u0622\u0645\u062F \u06A9\u0634\u0648\u0631</b>",
              "",
              `\u2705 <b>${formatNumber(result.total)} \u0633\u06A9\u0647</b> \u0627\u0632 \u062F\u0631\u0622\u0645\u062F \u062F\u0648\u0631\u0647\u200C\u0627\u06CC \u0628\u0647 \u062E\u0632\u0627\u0646\u0647 \u0648\u0627\u0631\u06CC\u0632 \u0634\u062F (${result.cycles} \u062F\u0648\u0631\u0647).`,
              "",
              `\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647: <b>${formatNumber(result.treasury)} \u0633\u06A9\u0647</b>`
            ].join("\n"),
            [[{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "bank:home" }]]
          );
          await answer("\u062F\u0631\u0622\u0645\u062F \u0628\u0647 \u062E\u0632\u0627\u0646\u0647 \u0648\u0627\u0631\u06CC\u0632 \u0634\u062F \u2705");
          return { handled: "bank:claim_income" };
        }
        if (sub === "loan") {
          await editBankLoan(ctx, chatId, messageId, nation);
          await answer();
          return { handled: "bank:loan" };
        }
        if (sub === "take") {
          const principal = Number(rest[1] ?? "");
          try {
            const res = await takeLoan(ctx.db, nation, principal);
            const dueDate = new Date(res.dueAt * 1e3).toISOString().slice(0, 10);
            await ctx.tg.editMessageText(
              chatId,
              messageId,
              [
                "\u{1F3E6} <b>\u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC \u06A9\u0634\u0648\u0631</b>",
                "",
                `\u2705 \u0648\u0627\u0645 <b>${formatNumber(res.principal)} \u0633\u06A9\u0647\u200C\u0627\u06CC</b> \u0628\u0647 \u062E\u0632\u0627\u0646\u0647 \u0648\u0627\u0631\u06CC\u0632 \u0634\u062F.`,
                "",
                statLine("\u0645\u0628\u0644\u063A \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A (\u0633\u0648\u062F \u06F1\u06F0\u066A)", `${formatNumber(res.repayAmount)} \u0633\u06A9\u0647`),
                statLine("\u0633\u0631\u0631\u0633\u06CC\u062F", dueDate),
                "",
                "\u062A\u0627 \u062A\u0633\u0648\u06CC\u0647 \u0627\u06CC\u0646 \u0648\u0627\u0645\u060C \u0627\u0645\u06A9\u0627\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u062C\u062F\u06CC\u062F \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F."
              ].join("\n"),
              [[{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "bank:home" }]]
            );
            await answer("\u0648\u0627\u0645 \u0628\u0647 \u062E\u0632\u0627\u0646\u0647 \u0645\u0646\u062A\u0642\u0644 \u0634\u062F \u2705");
            return { handled: "bank:take" };
          } catch (err) {
            const message = err instanceof Error ? err.message : "\u062E\u0637\u0627\u06CC\u06CC \u0631\u062E \u062F\u0627\u062F.";
            await answer(message, true);
            await editBankLoan(ctx, chatId, messageId, nation);
            return { handled: "bank:take:failed" };
          }
        }
        if (sub === "repay") {
          try {
            const res = await repayLoan(ctx.db, nation);
            await ctx.tg.editMessageText(
              chatId,
              messageId,
              [
                "\u{1F3E6} <b>\u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC \u06A9\u0634\u0648\u0631</b>",
                "",
                `\u2705 \u0648\u0627\u0645 \u0634\u0645\u0627 \u062A\u0633\u0648\u06CC\u0647 \u0634\u062F. <b>${formatNumber(res.repayAmount)} \u0633\u06A9\u0647</b> \u0627\u0632 \u062E\u0632\u0627\u0646\u0647 \u06A9\u0633\u0631 \u0634\u062F.`,
                "",
                `\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647: <b>${formatNumber(res.treasury)} \u0633\u06A9\u0647</b>`
              ].join("\n"),
              [[{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "bank:home" }]]
            );
            await answer("\u0648\u0627\u0645 \u062A\u0633\u0648\u06CC\u0647 \u0634\u062F \u2705");
            return { handled: "bank:repay" };
          } catch (err) {
            const message = err instanceof Error ? err.message : "\u062E\u0637\u0627\u06CC\u06CC \u0631\u062E \u062F\u0627\u062F.";
            await answer(message, true);
            await editBankLoan(ctx, chatId, messageId, nation);
            return { handled: "bank:repay:failed" };
          }
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "bank:unknown" };
      }
      case "build": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) {
          await answer("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", true);
          return { handled: "build:no_nation" };
        }
        const sub = rest[0];
        if (sub === "home") {
          await editBuildingsHome(ctx, chatId, messageId, nation);
          await answer();
          return { handled: "build:home" };
        }
        if (sub === "ask") {
          const b = BUILDINGS.find((x) => x.key === String(rest[1] ?? ""));
          if (!b) {
            await answer("\u0633\u0627\u0632\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.", true);
            return { handled: "build:ask:bad" };
          }
          const state = await buildState(ctx.db, nation);
          const built = Boolean(state.buildings.find((x) => x.key === b.key)?.built);
          const text = built ? `${b.emoji} <b>${b.nameFa}</b>

\u2705 \u0627\u06CC\u0646 \u0633\u0627\u0632\u0647 \u0642\u0628\u0644\u0627\u064B \u0633\u0627\u062E\u062A\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A.` : [`${b.emoji} <b>${b.nameFa}</b>`, "", escapeHtml(b.descFa), "", `\u0647\u0632\u06CC\u0646\u0647: <b>${formatNumber(b.cost)} \u0633\u06A9\u0647</b>`, "", "\u0633\u0627\u062E\u062A\u0647 \u0634\u0648\u062F\u061F"].join("\n");
          const rows = built ? [[{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A", callback_data: "build:home" }]] : [
            [
              { text: "\u2705 \u062A\u0623\u06CC\u06CC\u062F \u0648 \u0633\u0627\u062E\u062A", callback_data: `build:go:${b.key}` },
              { text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "build:home" }
            ]
          ];
          await ctx.tg.editMessageText(chatId, messageId, text, rows);
          await answer();
          return { handled: "build:ask" };
        }
        if (sub === "go") {
          const key = String(rest[1] ?? "");
          try {
            const res = await construct(ctx.db, nation, key, nowSeconds(), buildSpeed(ctx.env));
            const doneLine = res.completed ? res.kind === "build" ? `\u{1F3D7}\uFE0F <b>${escapeHtml(res.building.nameFa)}</b> \u0633\u0627\u062E\u062A\u0647 \u0634\u062F!` : `\u23EB <b>${escapeHtml(res.building.nameFa)}</b> \u0628\u0647 \u0633\u0637\u062D ${res.level} \u0627\u0631\u062A\u0642\u0627 \u06CC\u0627\u0641\u062A!` : res.kind === "build" ? `\u{1F6A7} \u067E\u0631\u0648\u0698\u0647\u0654 \u0633\u0627\u062E\u062A <b>${escapeHtml(res.building.nameFa)}</b> \u0622\u063A\u0627\u0632 \u0634\u062F` : `\u{1F6A7} \u067E\u0631\u0648\u0698\u0647\u0654 \u0627\u0631\u062A\u0642\u0627\u06CC <b>${escapeHtml(res.building.nameFa)}</b> \u0628\u0647 \u0633\u0637\u062D ${res.level} \u0622\u063A\u0627\u0632 \u0634\u062F`;
            await ctx.tg.editMessageText(
              chatId,
              messageId,
              [
                doneLine,
                "",
                `\u0647\u0632\u06CC\u0646\u0647: <b>${formatNumber(res.cost)} \u0633\u06A9\u0647</b>`,
                `\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647: <b>${formatNumber(res.treasury)} \u0633\u06A9\u0647</b>`
              ].join("\n"),
              [[{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0633\u0627\u062E\u062A\u200C\u0648\u0633\u0627\u0632", callback_data: "build:home" }]]
            );
            await answer(res.completed ? "\u0627\u0646\u062C\u0627\u0645 \u0634\u062F \u{1F3D7}\uFE0F" : "\u067E\u0631\u0648\u0698\u0647 \u0622\u063A\u0627\u0632 \u0634\u062F \u{1F6A7}");
            return { handled: "build:go" };
          } catch (err) {
            const message = err instanceof Error ? err.message : "\u062E\u0637\u0627\u06CC\u06CC \u0631\u062E \u062F\u0627\u062F.";
            await answer(message, true);
            await editBuildingsHome(ctx, chatId, messageId, nation);
            return { handled: "build:go:failed" };
          }
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "build:unknown" };
      }
      case "rank": {
        const metric = ["military", "economic", "global", "development"].includes(String(rest[1] ?? "")) ? String(rest[1]) : "global";
        if (rest[0] === "tab") {
          const nation = await currentNation(ctx, identity.userId) ?? null;
          const card = await rankingsCard(ctx, nation, metric);
          await ctx.tg.editMessageText(chatId, messageId, card.text, card.inline);
          await answer();
          return { handled: `rank:tab:${metric}` };
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "rank:unknown" };
      }
      case "atk": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.");
        const sub = rest[0];
        const targetId = Number(rest[1]);
        if (!Number.isFinite(targetId) || targetId <= 0) {
          await answer("\u0647\u062F\u0641 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.", true);
          return { handled: "atk:bad_target" };
        }
        if (sub === "back") {
          await renderAttackPlanPicker(ctx, chatId, messageId, identity.userId, nation, targetId);
          await answer();
          return { handled: "atk:back" };
        }
        if (sub === "cat") {
          await renderAttackPlanCategory(ctx, chatId, messageId, nation, targetId, String(rest[2] ?? ""));
          await answer();
          return { handled: "atk:cat" };
        }
        if (sub === "tpl") {
          await renderAttackPlanItem(ctx, chatId, messageId, identity.userId, nation, targetId, Number(rest[2]));
          await answer();
          return { handled: "atk:tpl" };
        }
        if (sub === "qty") {
          const templateId = Number(rest[2]);
          const qtyRaw = Number(rest[3]);
          const units = await ownedOffenseUnits(ctx.db, nation.id);
          const item = units.find((u) => u.templateId === templateId);
          if (!item) {
            await answer("\u0627\u06CC\u0646 \u0648\u0627\u062D\u062F \u062F\u0631 \u0627\u0646\u0628\u0627\u0631 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A.", true);
            return { handled: "atk:qty:not_owned" };
          }
          const qty = Math.max(1, Math.min(Math.floor(Number.isFinite(qtyRaw) ? qtyRaw : 1), item.quantity));
          const draft = await loadAttackDraft(ctx.db, identity.userId);
          const plan = draft && draft.targetNationId === targetId ? [...draft.plan] : [];
          const idx = plan.findIndex((e) => e.templateId === templateId);
          if (idx >= 0) plan[idx] = { templateId, quantity: qty };
          else plan.push({ templateId, quantity: qty });
          await saveAttackDraft(ctx.db, identity.userId, nation.id, { targetNationId: targetId, plan });
          await renderAttackPlanPicker(ctx, chatId, messageId, identity.userId, nation, targetId);
          await answer("\u0628\u0647 \u0622\u0631\u0627\u06CC\u0634 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F \u2705");
          return { handled: "atk:qty" };
        }
        if (sub === "del") {
          const templateId = Number(rest[2]);
          const draft = await loadAttackDraft(ctx.db, identity.userId);
          const plan = draft && draft.targetNationId === targetId ? draft.plan.filter((e) => e.templateId !== templateId) : [];
          await saveAttackDraft(ctx.db, identity.userId, nation.id, { targetNationId: targetId, plan });
          await renderAttackPlanPicker(ctx, chatId, messageId, identity.userId, nation, targetId);
          await answer("\u0627\u0632 \u0622\u0631\u0627\u06CC\u0634 \u062D\u0630\u0641 \u0634\u062F");
          return { handled: "atk:del" };
        }
        if (sub === "clear") {
          await saveAttackDraft(ctx.db, identity.userId, nation.id, { targetNationId: targetId, plan: [] });
          await renderAttackPlanPicker(ctx, chatId, messageId, identity.userId, nation, targetId);
          await answer("\u0622\u0631\u0627\u06CC\u0634 \u067E\u0627\u06A9 \u0634\u062F");
          return { handled: "atk:clear" };
        }
        if (sub === "preview") {
          await renderAttackPlanPreview(ctx, chatId, messageId, identity.userId, nation, targetId);
          await answer();
          return { handled: "atk:preview" };
        }
        await answer("\u062F\u0633\u062A\u0648\u0631 \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647", true);
        return { handled: "atk:unknown" };
      }
      case "w": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.");
        const warId = Number(rest[0]);
        const action = rest[1] ?? "view";
        if (action === "view") {
          const detail = await getWarDetail(ctx.db, warId, [nation.id], false);
          await ctx.tg.editMessageText(chatId, messageId, renderWarDetail(detail), [[{ text: "\u{1F519} \u062C\u0646\u06AF\u200C\u0647\u0627", callback_data: "war:list" }, { text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]]);
          await answer();
          return { handled: "war:view" };
        }
        if (action === "yes" || action === "reject") {
          await respondToWar(ctx.db, warId, action === "yes", nation, ctx.settings, ctx.env.BOT_TOKEN);
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer(action === "yes" ? "\u062C\u0646\u06AF \u0622\u063A\u0627\u0632 \u0634\u062F \u2694\uFE0F" : "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0631\u062F \u0634\u062F");
          return { handled: "war:respond" };
        }
        if (action === "round") {
          const res = await resolveRound(ctx.db, warId, ctx.settings, { force: false });
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer(`\u0646\u0648\u0628\u062A ${res.round} \u0627\u062C\u0631\u0627 \u0634\u062F${res.finished ? " \u2014 \u062C\u0646\u06AF \u067E\u0627\u06CC\u0627\u0646 \u06CC\u0627\u0641\u062A" : ""}`);
          return { handled: "war:round" };
        }
        if (action === "peace") {
          await requestPeace(ctx.db, warId, nation, ctx.settings, ctx.env.BOT_TOKEN);
          await renderWarList(ctx, chatId, messageId, identity.userId);
          await answer("\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0635\u0644\u062D \u0627\u0631\u0633\u0627\u0644 \u0634\u062F \u{1F54A}\uFE0F");
          return { handled: "war:peace" };
        }
        await answer("\u0646\u0627\u0645\u0639\u0644\u0648\u0645", true);
        return { handled: "w:unknown" };
      }
      case "d": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.");
        if (rest[0] === "in") {
          await renderDiplomacyInbox(ctx, chatId, messageId, nation.id);
          await answer();
          return { handled: "d:in" };
        }
        if (rest[0] === "rel") {
          await renderRelations(ctx, chatId, messageId, nation.id);
          await answer();
          return { handled: "d:rel" };
        }
        if (rest[0] === "friend") {
          const target = Number(rest[1]);
          const { sendRequestFriendly: sendRequestFriendly2 } = await Promise.resolve().then(() => (init_botActions(), botActions_exports));
          const text = await sendRequestFriendly2(ctx.db, nation, target, "friendship", ctx.settings);
          await ctx.tg.editMessageText(chatId, messageId, text, [[{ text: "\u{1F4E5} \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627", callback_data: "d:in" }, { text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]]);
          await answer("\u0627\u0631\u0633\u0627\u0644 \u0634\u062F");
          return { handled: "d:friend" };
        }
        if (rest[0] === "acc" || rest[0] === "rej") {
          await decideRequest(ctx.db, Number(rest[1]), nation, rest[0] === "acc", ctx.settings, { userId: identity.userId, telegramId: from.id }, ctx.env.BOT_TOKEN);
          await renderDiplomacyInbox(ctx, chatId, messageId, nation.id);
          await answer(rest[0] === "acc" ? "\u067E\u0630\u06CC\u0631\u0641\u062A\u0647 \u0634\u062F \u2705" : "\u0631\u062F \u0634\u062F \u274C");
          return { handled: "d:decide" };
        }
        await answer("\u0646\u0627\u0645\u0639\u0644\u0648\u0645", true);
        return { handled: "d:unknown" };
      }
      case "st": {
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.");
        if (rest[0] === "new") {
          await ctx.db.run(
            sql`INSERT INTO bot_flow_states (user_id, state, nation_id, updated_at, expires_at)
                 VALUES (${identity.userId}, 'stmt:text', ${nation.id}, ${nowSeconds()}, ${nowSeconds() + 3600})
                 ON CONFLICT (user_id) DO UPDATE SET state = 'stmt:text', nation_id = excluded.nation_id, updated_at = excluded.updated_at, expires_at = excluded.expires_at`
          );
          await ctx.tg.editMessageText(chatId, messageId, ctx.settings.branding.statementPrompt, [[{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "flow:cancel" }]]);
          await answer();
          return { handled: "st:new" };
        }
        await renderStatements(ctx, chatId, messageId, identity.userId);
        await answer();
        return { handled: "st:list" };
      }
      case "sp": {
        const flow = await ctx.db.first(sql`SELECT data FROM bot_flow_states WHERE user_id = ${identity.userId}`);
        const nation = await currentNation(ctx, identity.userId);
        if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
        if (rest[0] === "yes") {
          const text = String(safeJson3(flow?.data).text ?? "");
          const result = await createStatement(ctx.db, nation, { text, via: "bot" }, ctx.settings, { userId: identity.userId, telegramId: from.id });
          await clearFlow(ctx.db, identity.userId);
          await ctx.tg.editMessageText(
            chatId,
            messageId,
            `\u{1F4DC} \u0628\u06CC\u0627\u0646\u06CC\u0647 \u062B\u0628\u062A \u0634\u062F.
\u0648\u0636\u0639\u06CC\u062A: <b>${result.statusLabelFa}</b>
\u0634\u0646\u0627\u0633\u0647: ${result.statementId}

${result.status === "published" ? "\u0628\u06CC\u0627\u0646\u06CC\u0647 \u0634\u0645\u0627 \u0645\u0646\u062A\u0634\u0631 \u0634\u062F." : "\u067E\u0633 \u0627\u0632 \u0628\u0631\u0631\u0633\u06CC \u0645\u062F\u06CC\u0631 \u0645\u0646\u062A\u0634\u0631 \u0645\u06CC\u200C\u0634\u0648\u062F."}`,
            [[{ text: "\u{1F4DC} \u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0647\u0627\u06CC \u0645\u0646", callback_data: "st:list" }, { text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]]
          );
          await answer("\u062B\u0628\u062A \u0634\u062F");
          return { handled: "st:confirm" };
        }
        await clearFlow(ctx.db, identity.userId);
        await ctx.tg.editMessageText(chatId, messageId, "\u274C \u0628\u06CC\u0627\u0646\u06CC\u0647 \u0644\u063A\u0648 \u0634\u062F.", mainMenu(ctx.webAppUrl));
        await answer();
        return { handled: "st:cancel" };
      }
      case "set": {
        if (rest[0] === "notify") {
          const nation = await currentNation(ctx, identity.userId);
          if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
          await ctx.db.run(
            sql`UPDATE nation_settings SET notify_enabled = CASE notify_enabled WHEN 1 THEN 0 ELSE 1 END, updated_at = ${nowSeconds()} WHERE nation_id = ${nation.id}`
          );
          await renderPageCallback(ctx, chatId, messageId, identity.userId, "settings");
          await answer("\u0648\u0636\u0639\u06CC\u062A \u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F");
          return { handled: "set:notify" };
        }
        if (rest[0] === "logout") {
          await ctx.db.run(sql`UPDATE sessions SET revoked_at = ${nowSeconds()} WHERE user_id = ${identity.userId} AND revoked_at IS NULL`);
          await answer("\u0646\u0634\u0633\u062A\u200C\u0647\u0627\u06CC Mini App \u0628\u0633\u062A\u0647 \u0634\u062F", true);
          return { handled: "set:logout" };
        }
        await renderPageCallback(ctx, chatId, messageId, identity.userId, "settings");
        await answer();
        return { handled: "set" };
      }
      case "nat": {
        const nationId = Number(rest[0]);
        const own = await ctx.db.first(sql`SELECT id FROM nations WHERE id = ${nationId} AND owner_user_id = ${identity.userId}`);
        if (!own) throw ApiError.forbidden("\u0627\u06CC\u0646 \u06A9\u0634\u0648\u0631 \u0645\u062A\u0639\u0644\u0642 \u0628\u0647 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A.");
        await ctx.tg.editMessageText(chatId, messageId, await welcomeText(ctx, identity.userId), mainMenu(ctx.webAppUrl));
        await answer("\u06A9\u0634\u0648\u0631 \u0641\u0639\u0627\u0644 \u062A\u063A\u06CC\u06CC\u0631 \u06A9\u0631\u062F");
        return { handled: "nat" };
      }
      default:
        await answer("\u0646\u0627\u0645\u0639\u0644\u0648\u0645", true);
        return { handled: "unknown" };
    }
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "\u062E\u0637\u0627\u06CC \u063A\u06CC\u0631\u0645\u0646\u062A\u0638\u0631\u0647 \u062F\u0631 \u067E\u0631\u062F\u0627\u0632\u0634 \u062F\u0631\u062E\u0648\u0627\u0633\u062A.";
    await answer(`\u26A0\uFE0F ${message}`.slice(0, 190), true);
    if (!(err instanceof ApiError)) console.error("[bot]", err instanceof Error ? err.message : err);
    return { handled: "error" };
  }
}
async function startOnboardingCallback(ctx, chatId, messageId, userId) {
  await ctx.db.run(
    sql`INSERT INTO bot_flow_states (user_id, state, data, updated_at, expires_at)
         VALUES (${userId}, 'onb:name', NULL, ${nowSeconds()}, ${nowSeconds() + 86400})
         ON CONFLICT (user_id) DO UPDATE SET state = 'onb:name', data = NULL, updated_at = excluded.updated_at, expires_at = excluded.expires_at`
  );
  await ctx.tg.editMessageText(chatId, messageId, ctx.settings.branding.nationNamePrompt, [[{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "flow:cancel" }]]);
}
async function renderPage(ctx, chatId, userId, page, _messageId) {
  const nation = await currentNation(ctx, userId);
  if (!nation) {
    await ctx.tg.sendMessage(chatId, "\u0634\u0645\u0627 \u0647\u0646\u0648\u0632 \u06A9\u0634\u0648\u0631\u06CC \u0646\u0633\u0627\u062E\u062A\u0647\u200C\u0627\u06CC\u062F.\n\n" + ctx.settings.branding.nationNamePrompt, {
      inline: [[{ text: "\u{1F3F3}\uFE0F \u0634\u0631\u0648\u0639 \u062B\u0628\u062A\u200C\u0646\u0627\u0645", callback_data: "new" }]]
    });
    await ctx.db.run(
      sql`INSERT INTO bot_flow_states (user_id, state, data, updated_at, expires_at)
           VALUES (${userId}, 'onb:name', NULL, ${nowSeconds()}, ${nowSeconds() + 86400})
           ON CONFLICT (user_id) DO UPDATE SET state = 'onb:name', updated_at = excluded.updated_at`
    );
    return { handled: `page:${page}:no_nation` };
  }
  if (page === "defense") {
    await renderDefenseArranger(ctx, chatId, null, userId, nation);
    return { handled: "page:defense" };
  }
  const { text, inline } = await renderFor(ctx, nation, page);
  await ctx.tg.sendMessage(chatId, text, { inline });
  return { handled: `page:${page}` };
}
async function renderPageCallback(ctx, chatId, messageId, userId, page) {
  const nation = await currentNation(ctx, userId);
  if (!nation) {
    await ctx.tg.editMessageText(chatId, messageId, "\u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0628\u062E\u0634 \u0627\u0628\u062A\u062F\u0627 \u0628\u0627\u06CC\u062F \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }, { text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]]);
    return;
  }
  if (page === "defense") {
    await renderDefenseArranger(ctx, chatId, messageId, userId, nation);
    return;
  }
  const { text, inline } = await renderFor(ctx, nation, page);
  await ctx.tg.editMessageText(chatId, messageId, text, inline);
}
async function renderFor(ctx, nation, page) {
  switch (page) {
    case "economy": {
      const view = await buildNationView(ctx.db, nation, ctx.settings);
      const tx = await listTransactions(ctx.db, nation.id, { limit: 6 });
      return {
        text: [
          "\u{1F4B0} <b>\u0627\u0642\u062A\u0635\u0627\u062F \u06A9\u0634\u0648\u0631</b>",
          "",
          statLine("\u062E\u0632\u0627\u0646\u0647", coins(view.economy.treasury)),
          statLine("\u062F\u0631\u0622\u0645\u062F \u06A9\u0627\u0631\u062E\u0627\u0646\u0647\u200C\u0647\u0627", coins(view.economy.factoryIncome)),
          statLine("\u062F\u0631\u0622\u0645\u062F \u0645\u0639\u0627\u062F\u0646", coins(view.economy.mineIncome)),
          statLine("\u062F\u0631\u0622\u0645\u062F \u0646\u0627\u062E\u0627\u0644\u0635", coins(view.economy.grossIncome)),
          statLine("\u0645\u0627\u0644\u06CC\u0627\u062A", coins(view.economy.taxCost)),
          statLine("\u0647\u0632\u06CC\u0646\u0647 \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC", coins(view.economy.maintenanceCost)),
          statLine("\u062F\u0631\u0622\u0645\u062F \u062E\u0627\u0644\u0635 \u0647\u0631 \u062F\u0648\u0631\u0647", coins(view.economy.netIncome)),
          statLine("\u062F\u0648\u0631\u0647 \u0648\u0627\u0631\u06CC\u0632", `${Math.round(view.economy.cycleSeconds / 3600)} \u0633\u0627\u0639\u062A`),
          statLine("\u062F\u0631\u0622\u0645\u062F \u0622\u0645\u0627\u062F\u0647 \u062F\u0631\u06CC\u0627\u0641\u062A", `${formatNumber(view.economy.pendingIncome ?? 0)} \u0633\u06A9\u0647`),
          "",
          "\u{1F9FE} \u0622\u062E\u0631\u06CC\u0646 \u062A\u0631\u0627\u06A9\u0646\u0634\u200C\u0647\u0627:",
          ...tx.rows.map((t) => `\u2022 ${txLabel(t.type)} \u2014 ${t.amount > 0 ? "+" : ""}${formatNumber(t.amount)} \u0633\u06A9\u0647`)
        ].join("\n"),
        inline: [[{ text: "\u{1F5A5}\uFE0F \u0646\u0645\u0648\u062F\u0627\u0631\u0647\u0627 (Mini App)", url: ctx.webAppUrl + "#/economy" }], ...backButton()]
      };
    }
    case "military": {
      const groups = await inventoryView(ctx.db, nation.id, ctx.settings);
      const view = await buildNationView(ctx.db, nation, ctx.settings);
      return {
        text: [
          `\u{1F396}\uFE0F <b>\u062F\u0627\u0631\u0627\u06CC\u06CC\u200C\u0647\u0627\u06CC \u0646\u0638\u0627\u0645\u06CC ${nation.flag}</b>`,
          "",
          statLine("\u0642\u062F\u0631\u062A \u062A\u0647\u0627\u062C\u0645", formatNumber(view.military.attackPower)),
          statLine("\u0642\u062F\u0631\u062A \u062F\u0641\u0627\u0639\u06CC", formatNumber(view.military.defensePower)),
          statLine("\u0646\u06CC\u0631\u0648\u06CC \u0627\u0646\u0633\u0627\u0646\u06CC", formatNumber(view.military.troopsCount)),
          "",
          ...groups.map((g) => `${g.emoji} ${g.labelFa}: <b>${formatNumber(g.total)}</b>`)
        ].join("\n"),
        inline: [[{ text: "\u{1F50E} \u0645\u0634\u0627\u0647\u062F\u0647 \u062C\u0632\u0626\u06CC\u0627\u062A", callback_data: "item:0:0" }], ...backButton()]
      };
    }
    case "marketplace": {
      const cats = await listCategories(ctx.db);
      const buttons = cats.map((c) => ({ text: `${c.emoji} ${c.shopLabelFa}`, callback_data: `cat:${c.key}:0` }));
      const rows = [];
      for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
      rows.push([{ text: "\u{1F5A5}\uFE0F \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u06A9\u0627\u0645\u0644", url: ctx.webAppUrl + "#/marketplace" }]);
      rows.push([{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC", callback_data: "m" }]);
      return {
        text: [
          "\u{1F6D2} <b>\u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A</b>",
          "",
          `\u062E\u0632\u0627\u0646\u0647 \u0634\u0645\u0627: <b>${coins(nation.treasury)}</b>`,
          "\u0642\u06CC\u0645\u062A \u0647\u0631 \u062A\u062C\u0647\u06CC\u0632 \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631 \u062A\u0639\u06CC\u06CC\u0646 \u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u0627\u0642\u0644\u0627\u0645 \u0628\u062F\u0648\u0646 \u0642\u06CC\u0645\u062A \u0642\u0627\u0628\u0644 \u062E\u0631\u06CC\u062F \u0646\u06CC\u0633\u062A\u0646\u062F."
        ].join("\n"),
        inline: rows
      };
    }
    case "country": {
      const view = await buildNationView(ctx.db, nation, ctx.settings, { includeStarter: true });
      return {
        text: [
          `\u{1F6E1}\uFE0F <b>${nation.flag} ${escapeHtml(nation.name)}</b>`,
          "",
          statLine("\u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631", nation.leader_name),
          statLine("\u0648\u0636\u0639\u06CC\u062A", statusLabel(nation.status)),
          statLine("\u062A\u0623\u0633\u06CC\u0633", view.history.createdAt.slice(0, 10)),
          statLine("\u0631\u062A\u0628\u0647 \u062C\u0647\u0627\u0646\u06CC", `#${view.nation.worldRank}`),
          statLine("\u0627\u0645\u062A\u06CC\u0627\u0632 \u06A9\u0644", formatNumber(view.nation.totalScore)),
          statLine("\u0627\u0645\u062A\u06CC\u0627\u0632 \u0627\u0642\u062A\u0635\u0627\u062F\u06CC", formatNumber(view.nation.economicScore)),
          statLine("\u0628\u0633\u062A\u0647 \u0627\u0648\u0644\u06CC\u0647", view.starterTemplateName ?? "-"),
          "",
          statLine("\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645", view.history.cooldowns.renameSecondsLeft ? `${Math.ceil(view.history.cooldowns.renameSecondsLeft / 3600)} \u0633\u0627\u0639\u062A` : "\u0622\u0632\u0627\u062F")
        ].join("\n"),
        inline: [[{ text: "\u270F\uFE0F \u062A\u063A\u06CC\u06CC\u0631 \u0645\u0634\u062E\u0635\u0627\u062A \u062F\u0631 Mini App", url: ctx.webAppUrl + "#/country" }], ...backButton()]
      };
    }
    case "defense":
      return {
        text: await defenseStatsText(ctx, nation),
        inline: [[{ text: "\u{1F6E1}\uFE0F \u0622\u0631\u0627\u06CC\u0634 \u062F\u0641\u0627\u0639\u06CC", callback_data: "def:back" }, { text: "\u2B05\uFE0F \u0645\u0646\u0648", callback_data: "m" }]]
      };
    case "war": {
      const wars = await getWarsForNation(ctx.db, nation.id);
      const text = [
        "\u2694\uFE0F <b>\u062C\u0646\u06AF\u200C\u0647\u0627</b>",
        "",
        ...wars.length === 0 ? ["\u062C\u0646\u06AF\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A."] : [],
        ...wars.slice(0, 6).map((w) => renderWarLine(w))
      ];
      return {
        text: text.join("\n"),
        inline: [[{ text: "\u{1F3AF} \u0627\u0646\u062A\u062E\u0627\u0628 \u0647\u062F\u0641 \u062D\u0645\u0644\u0647", callback_data: "war:targets:0" }, { text: "\u{1F4DC} \u0644\u06CC\u0633\u062A \u062C\u0646\u06AF\u200C\u0647\u0627", callback_data: "war:list" }], ...backButton()]
      };
    }
    case "diplomacy": {
      const rel = await listRelations(ctx.db, nation.id);
      const incoming = await listIncoming(ctx.db, nation.id);
      return {
        text: [
          "\u{1F310} <b>\u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC</b>",
          "",
          statLine("\u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631", String(incoming.length)),
          statLine("\u0645\u062A\u062D\u062F\u0627\u0646", String(rel.filter((r) => r.status === "ally").length)),
          statLine("\u062F\u0648\u0633\u062A\u0627\u0646", String(rel.filter((r) => r.status === "friend").length)),
          statLine("\u062F\u0634\u0645\u0646\u0627\u0646", String(rel.filter((r) => r.status === "enemy").length)),
          "",
          ...rel.slice(0, 8).map((r) => `${r.otherFlag} ${r.otherNationName}: <b>${r.statusLabelFa}</b>`),
          rel.length === 0 ? "\u0647\u0646\u0648\u0632 \u0631\u0627\u0628\u0637\u0647 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A." : ""
        ].join("\n"),
        inline: [
          [{ text: "\u{1F4E5} \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627", callback_data: "d:in" }, { text: "\u{1F91D} \u0631\u0648\u0627\u0628\u0637", callback_data: "d:rel" }],
          [{ text: "\u{1F5A5}\uFE0F \u067E\u0646\u0644 \u062F\u06CC\u067E\u0644\u0645\u0627\u0633\u06CC", url: ctx.webAppUrl + "#/diplomacy" }],
          ...backButton()
        ]
      };
    }
    case "statements":
      return renderStatementsBody(ctx, nation);
    case "rankings": {
      const card = await rankingsCard(ctx, nation, "global");
      return card;
    }
    case "settings": {
      const ns = await ctx.db.first(sql`SELECT notify_enabled FROM nation_settings WHERE nation_id = ${nation.id}`);
      const nations = await ctx.db.all(
        sql`SELECT id, name, flag FROM nations WHERE owner_user_id = ${nation.owner_user_id}`
      );
      return {
        text: [
          "\u2699\uFE0F <b>\u062A\u0646\u0638\u06CC\u0645\u0627\u062A</b>",
          "",
          statLine("\u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627\u06CC \u062A\u0644\u06AF\u0631\u0627\u0645\u06CC", ns?.notify_enabled ? "\u0631\u0648\u0634\u0646" : "\u062E\u0627\u0645\u0648\u0634"),
          statLine("\u06A9\u0634\u0648\u0631\u0647\u0627\u06CC \u0634\u0645\u0627", String(nations.length)),
          statLine("\u062D\u062F\u0627\u06A9\u062B\u0631 \u0645\u062C\u0627\u0632", String(ctx.settings.profile.maxNationsPerUser)),
          "",
          "\u0628\u0631\u0627\u06CC \u062A\u063A\u06CC\u06CC\u0631 \u0646\u0627\u0645/\u067E\u0631\u0686\u0645/\u0631\u0626\u06CC\u0633 \u06A9\u0634\u0648\u0631 \u0628\u0647 Mini App \u0628\u0631\u0648\u06CC\u062F (\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0632\u0645\u0627\u0646\u06CC \u0627\u0632 \u0633\u0648\u06CC \u0645\u062F\u06CC\u0631 \u0627\u0639\u0645\u0627\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F)."
        ].join("\n"),
        inline: [
          [{ text: "\u{1F514} \u062A\u063A\u06CC\u06CC\u0631 \u0648\u0636\u0639\u06CC\u062A \u0627\u0639\u0644\u0627\u0646\u200C\u0647\u0627", callback_data: "set:notify" }],
          ...nations.length > 1 ? [nations.map((n) => ({ text: `${n.flag} ${n.name}`, callback_data: `nat:${n.id}` }))] : [],
          [{ text: "\u{1F512} \u0628\u0633\u062A\u0646 \u0646\u0634\u0633\u062A\u200C\u0647\u0627\u06CC Mini App", callback_data: "set:logout" }],
          ...backButton()
        ]
      };
    }
    default:
      return { text: await welcomeText(ctx, nation.owner_user_id), inline: mainMenu(ctx.webAppUrl) };
  }
}
function renderWarLine(w) {
  const side = `${w.attackerFlag} ${w.attackerName} \u27F7 ${w.defenderFlag} ${w.defenderName}`;
  return `\u2694\uFE0F <b>#${w.id}</b> ${side}
   \u0648\u0636\u0639\u06CC\u062A: ${w.statusLabelFa} | \u0646\u0648\u0628\u062A ${w.roundsPlayed}/${w.maxRounds} | \u0634\u0627\u0646\u0633 \u0645\u0647\u0627\u062C\u0645 ${percent(w.attackerWinChance)}${w.outcomeSummary ? `
   ${escapeHtml(w.outcomeSummary).slice(0, 120)}` : ""}`;
}
function renderWarDetail(detail) {
  const w = detail.war;
  const attackPlan = detail.attackPlan;
  const reports = detail.reports.slice(0, 3).map(
    (r) => `\u2022 \u0646\u0648\u0628\u062A ${r.roundNo}: \u0628\u0631\u0646\u062F\u0647 <b>${r.winner === "attacker" ? w.attackerName : r.winner === "defender" ? w.defenderName : "\u062A\u0633\u0627\u0648\u06CC"}</b> \u2014 \u0634\u0627\u0646\u0633 \u0645\u0647\u0627\u062C\u0645 ${percent(r.attackerWinChance)}`
  );
  return [
    `\u2694\uFE0F <b>\u062C\u0646\u06AF #${w.id}</b>`,
    `${w.attackerFlag} ${w.attackerName} \u27F7 ${w.defenderFlag} ${w.defenderName}`,
    "",
    statLine("\u0648\u0636\u0639\u06CC\u062A", w.statusLabelFa),
    statLine("\u0642\u062F\u0631\u062A \u0645\u0647\u0627\u062C\u0645", formatNumber(w.attackerPower)),
    statLine("\u0642\u062F\u0631\u062A \u0645\u062F\u0627\u0641\u0639", formatNumber(w.defenderPower)),
    statLine("\u0646\u0648\u0628\u062A\u200C\u0647\u0627", `${w.roundsPlayed}/${w.maxRounds}`),
    statLine("\u063A\u0631\u0627\u0645\u062A \u067E\u0631\u062F\u0627\u062E\u062A\u06CC", coins(w.indemnityPaid)),
    w.outcomeSummary ? statLine("\u0646\u062A\u06CC\u062C\u0647", w.outcomeSummary) : "",
    "",
    ...attackPlan && attackPlan.length ? ["", "\u{1F3AF} \u0622\u0631\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647:", ...attackPlan.map((e) => `\u2022 ${e.emoji} ${escapeHtml(e.nameFa)} \xD7 ${e.quantity.toLocaleString("en-US")}`)] : [],
    ...reports.length ? ["\u06AF\u0632\u0627\u0631\u0634 \u0646\u0628\u0631\u062F\u0647\u0627:", ...reports] : ["\u0647\u0646\u0648\u0632 \u06AF\u0632\u0627\u0631\u0634\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A."]
  ].filter(Boolean).join("\n");
}
async function renderWarList(ctx, chatId, messageId, userId) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const { text, inline } = await renderFor(ctx, nation, "war");
  await ctx.tg.editMessageText(chatId, messageId, text, inline);
}
async function renderWarTargets(ctx, chatId, messageId, userId, offset) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const list = await listNations(ctx.db, { limit: 8, offset, excludeNationId: nation.id });
  const buttons = list.map((n) => ({ text: `${n.flag} ${n.name} (#${n.worldRank})`, callback_data: `war:ask:${n.id}` }));
  const rows = [];
  for (let i = 0; i < buttons.length; i += 1) rows.push([buttons[i]]);
  rows.push(...pager("war:targets", offset, list.length < 8 ? offset + list.length : offset + 8, 8));
  rows.push([{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A", callback_data: "nav:war" }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    ["\u{1F3AF} <b>\u0627\u0646\u062A\u062E\u0627\u0628 \u0647\u062F\u0641</b>", "", "\u0627\u062D\u062A\u0645\u0627\u0644 \u067E\u06CC\u0631\u0648\u0632\u06CC \u0648 \u062E\u0633\u0627\u0631\u062A \u0642\u0628\u0644 \u0627\u0632 \u0627\u0631\u0633\u0627\u0644 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0645\u062D\u0627\u0633\u0628\u0647 \u0648 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.", ...list.length === 0 ? ["\u06A9\u0634\u0648\u0631 \u062F\u06CC\u06AF\u0631\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F."] : []].join("\n"),
    rows
  );
}
async function loadAttackDraft(db, userId) {
  const row = await db.first(
    sql`SELECT state, data FROM bot_flow_states WHERE user_id = ${userId}`
  );
  if (row?.state !== "atk:plan") return null;
  const data = safeJson3(row.data);
  const targetNationId = Number(data.targetNationId);
  const rawPlan = Array.isArray(data.plan) ? data.plan : [];
  const plan = rawPlan.map((e) => {
    const entry = e;
    return { templateId: Number(entry?.templateId), quantity: Number(entry?.quantity) };
  }).filter((e) => Number.isFinite(e.templateId) && e.templateId > 0 && Number.isFinite(e.quantity) && e.quantity > 0);
  if (!Number.isFinite(targetNationId) || targetNationId <= 0) return null;
  return { targetNationId, plan };
}
async function saveAttackDraft(db, userId, nationId, draft) {
  if (draft.plan.length === 0) {
    await db.run(sql`DELETE FROM bot_flow_states WHERE user_id = ${userId} AND state = 'atk:plan'`);
    return;
  }
  await db.run(
    sql`INSERT INTO bot_flow_states (user_id, state, nation_id, data, updated_at, expires_at)
        VALUES (${userId}, 'atk:plan', ${nationId}, ${JSON.stringify(draft)}, ${nowSeconds()}, ${nowSeconds() + 3600})
        ON CONFLICT (user_id) DO UPDATE SET state = 'atk:plan', nation_id = excluded.nation_id, data = excluded.data, updated_at = excluded.updated_at, expires_at = excluded.expires_at`
  );
}
async function ownedOffenseUnits(db, nationId) {
  const rows = await db.all(
    sql`SELECT t.id AS templateId, t.name_fa AS nameFa, c.emoji AS emoji, t.unit_fa AS unitFa,
               c.key AS categoryKey, c.label_fa AS categoryLabelFa,
               COALESCE(t.attack_points, c.power_weight) AS attackPoints, COALESCE(i.quantity, 0) AS quantity
        FROM equipment_templates t
        JOIN equipment_categories c ON c.id = t.category_id
        LEFT JOIN nation_inventory i ON i.template_id = t.id AND i.nation_id = ${nationId}
        WHERE c.is_active = 1 AND c.role = 'offense' AND t.is_active = 1 AND COALESCE(i.quantity, 0) > 0
        ORDER BY c.sort_order, t.name_fa`
  );
  return rows.map((r) => ({
    templateId: Number(r.templateId),
    nameFa: String(r.nameFa),
    emoji: String(r.emoji),
    unitFa: String(r.unitFa),
    categoryKey: String(r.categoryKey),
    categoryLabelFa: String(r.categoryLabelFa),
    quantity: Number(r.quantity),
    attackPoints: Number(r.attackPoints ?? 0)
  }));
}
function summarizePlan(units, plan) {
  const byId = new Map(units.map((u) => [u.templateId, u]));
  const lines = [];
  let totalAp = 0;
  let totalUnits = 0;
  for (const e of plan) {
    const u = byId.get(e.templateId);
    const each = u?.attackPoints ?? 0;
    totalAp += each * e.quantity;
    totalUnits += e.quantity;
    lines.push(`\u2022 ${u ? `${u.emoji} ${u.nameFa}` : `#${e.templateId}`} \xD7 ${e.quantity.toLocaleString("en-US")}`);
  }
  return { lines, totalUnits, totalAp: Math.round(totalAp) };
}
async function renderAttackPlanPicker(ctx, chatId, messageId, userId, nation, targetId) {
  const target = await ctx.db.first(sql`SELECT flag, name FROM nations WHERE id = ${targetId}`);
  if (!target) throw ApiError.notFound("\u06A9\u0634\u0648\u0631 \u0647\u062F\u0641 \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const units = await ownedOffenseUnits(ctx.db, nation.id);
  const draft = await loadAttackDraft(ctx.db, userId);
  const plan = draft && draft.targetNationId === targetId ? draft.plan : [];
  const sum = summarizePlan(units, plan);
  const catTotals = await ctx.db.all(
    sql`SELECT c.key AS key, c.label_fa AS labelFa, c.emoji AS emoji, COALESCE(SUM(COALESCE(i.quantity, 0)), 0) AS total
          FROM equipment_categories c
          JOIN equipment_templates t ON t.category_id = c.id AND t.is_active = 1
          LEFT JOIN nation_inventory i ON i.template_id = t.id AND i.nation_id = ${nation.id}
         WHERE c.is_active = 1 AND c.role = 'offense'
         GROUP BY c.id
         ORDER BY c.sort_order`
  );
  const grandTotal = catTotals.reduce((sumAcc, c) => sumAcc + Number(c.total), 0);
  const rows = [];
  const catButtons = catTotals.map((c) => ({
    text: `${String(c.emoji)} ${String(c.labelFa)} (${Number(c.total).toLocaleString("en-US")})`,
    callback_data: `atk:cat:${targetId}:${String(c.key)}`
  }));
  for (let i = 0; i < catButtons.length; i += 2) rows.push(catButtons.slice(i, i + 2));
  if (plan.length > 0) {
    rows.push([{ text: "\u2705 \u0627\u062F\u0627\u0645\u0647 \u0648 \u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647", callback_data: `atk:preview:${targetId}` }]);
    rows.push([{ text: "\u{1F5D1} \u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u0622\u0631\u0627\u06CC\u0634", callback_data: `atk:clear:${targetId}` }]);
  }
  rows.push([{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "nav:war" }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      "\u{1F3AF} <b>\u0622\u0631\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647</b>",
      `\u0647\u062F\u0641: ${String(target.flag)} ${escapeHtml(String(target.name))}`,
      "",
      `<b>\u0646\u06CC\u0631\u0648\u0647\u0627\u06CC \u0645\u062A\u0639\u0647\u062F (${sum.totalUnits.toLocaleString("en-US")} \u0648\u0627\u062D\u062F):</b>`,
      ...sum.lines.length ? sum.lines : ["\u2014 \u0647\u0646\u0648\u0632 \u0648\u0627\u062D\u062F\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A \u2014"],
      `\u0642\u062F\u0631\u062A \u062D\u0645\u0644\u0647 \u06A9\u0644: <b>${formatNumber(sum.totalAp)}</b>`,
      "",
      grandTotal === 0 ? "\u0634\u0645\u0627 \u0647\u0646\u0648\u0632 \u0647\u06CC\u0686 \u0648\u0627\u062D\u062F \u062A\u0647\u0627\u062C\u0645\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F\u061B \u0627\u0628\u062A\u062F\u0627 \u0627\u0632 \xAB\u{1F6D2} \u0641\u0631\u0648\u0634\u06AF\u0627\u0647\xBB \u0628\u062E\u0631\u06CC\u062F." : "\u2460 \u062F\u0633\u062A\u0647 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u060C \u2461 \u0648\u0627\u062D\u062F \u0648 \u062A\u0639\u062F\u0627\u062F \u0631\u0627 \u0628\u0632\u0646.\n\u062D\u0645\u0644\u0647 \u0641\u0642\u0637 \u0628\u0627 \u0647\u0645\u06CC\u0646 \u0648\u0627\u062D\u062F\u0647\u0627 \u0627\u0646\u062C\u0627\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F\u061B \u0628\u0642\u06CC\u0647\u0654 \u0627\u0631\u062A\u0634 \u062F\u0631 \u062E\u0627\u0646\u0647 \u0645\u06CC\u200C\u0645\u0627\u0646\u064E\u062F."
    ].join("\n"),
    rows
  );
}
async function renderAttackPlanCategory(ctx, chatId, messageId, nation, targetId, categoryKey) {
  const units = (await ownedOffenseUnits(ctx.db, nation.id)).filter((u) => u.categoryKey === categoryKey);
  const label = units[0]?.categoryLabelFa;
  const rows = units.map((u) => [
    { text: `${u.emoji} ${u.nameFa} \u2014 ${u.quantity.toLocaleString("en-US")} ${u.unitFa}`, callback_data: `atk:tpl:${targetId}:${u.templateId}` }
  ]);
  rows.push([{ text: "\u2B05\uFE0F \u062F\u0633\u062A\u0647\u200C\u0647\u0627", callback_data: `atk:back:${targetId}` }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      `\u{1F3AF} <b>${label ? escapeHtml(label) : escapeHtml(categoryKey)}</b>`,
      "",
      ...units.length ? ["\u06A9\u062F\u0627\u0645 \u0648\u0627\u062D\u062F\u061F"] : ["\u062F\u0631 \u0627\u06CC\u0646 \u062F\u0633\u062A\u0647 \u0645\u0648\u062C\u0648\u062F\u06CC \u0646\u062F\u0627\u0631\u06CC\u062F."]
    ].join("\n"),
    rows
  );
}
async function renderAttackPlanItem(ctx, chatId, messageId, userId, nation, targetId, templateId) {
  const units = await ownedOffenseUnits(ctx.db, nation.id);
  const item = units.find((u) => u.templateId === templateId);
  if (!item) {
    await ctx.tg.editMessageText(
      chatId,
      messageId,
      "\u26A0\uFE0F \u0627\u06CC\u0646 \u0648\u0627\u062D\u062F \u062F\u0631 \u0627\u0646\u0628\u0627\u0631 \u0634\u0645\u0627 \u0646\u06CC\u0633\u062A \u06CC\u0627 \u0642\u0627\u0628\u0644 \u062A\u0639\u0647\u062F \u062F\u0631 \u062D\u0645\u0644\u0647 \u0646\u06CC\u0633\u062A.",
      [[{ text: "\u2B05\uFE0F \u062F\u0633\u062A\u0647\u200C\u0647\u0627", callback_data: `atk:back:${targetId}` }]]
    );
    return;
  }
  const draft = await loadAttackDraft(ctx.db, userId);
  const current = draft && draft.targetNationId === targetId ? draft.plan.find((e) => e.templateId === templateId)?.quantity ?? 0 : 0;
  const base = [1, 5, 10, 20].filter((q) => q < item.quantity);
  const presets = [...base, item.quantity];
  const qtyButtons = presets.map((q, idx) => ({
    text: idx === presets.length - 1 && ![1, 5, 10, 20].includes(item.quantity) ? `\u0647\u0645\u0647 (${item.quantity.toLocaleString("en-US")})` : q.toLocaleString("en-US"),
    callback_data: `atk:qty:${targetId}:${templateId}:${q}`
  }));
  const rows = [];
  for (let i = 0; i < qtyButtons.length; i += 3) rows.push(qtyButtons.slice(i, i + 3));
  if (current > 0) rows.push([{ text: `\u274C \u062D\u0630\u0641 \u0627\u0632 \u0622\u0631\u0627\u06CC\u0634 (\u0641\u0639\u0644\u0627\u064B ${current.toLocaleString("en-US")})`, callback_data: `atk:del:${targetId}:${templateId}` }]);
  rows.push([{ text: "\u2B05\uFE0F \u062F\u0633\u062A\u0647\u200C\u0647\u0627", callback_data: `atk:cat:${targetId}:${item.categoryKey}` }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      `${item.emoji} <b>${escapeHtml(item.nameFa)}</b>`,
      statLine("\u0645\u0648\u062C\u0648\u062F\u06CC", `${item.quantity.toLocaleString("en-US")} ${escapeHtml(item.unitFa)}`),
      statLine("\u0642\u062F\u0631\u062A \u062D\u0645\u0644\u0647 \u0647\u0631 \u0648\u0627\u062D\u062F", formatNumber(item.attackPoints)),
      statLine("\u062F\u0631 \u0622\u0631\u0627\u06CC\u0634 \u0641\u0639\u0644\u06CC", current > 0 ? `${current.toLocaleString("en-US")} \u0639\u062F\u062F` : "\u2014"),
      "",
      "\u0686\u0646\u062F \u0648\u0627\u062D\u062F \u0645\u062A\u0639\u0647\u062F \u0645\u06CC\u200C\u06A9\u0646\u06CC\u062F\u061F"
    ].join("\n"),
    rows
  );
}
async function renderAttackPlanPreview(ctx, chatId, messageId, userId, nation, targetId) {
  const draft = await loadAttackDraft(ctx.db, userId);
  const plan = draft && draft.targetNationId === targetId ? draft.plan : [];
  if (plan.length === 0) {
    await ctx.tg.editMessageText(
      chatId,
      messageId,
      "\u26A0\uFE0F \u0647\u0646\u0648\u0632 \u0648\u0627\u062D\u062F\u06CC \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F.",
      [[{ text: "\u2B05\uFE0F \u0627\u0646\u062A\u062E\u0627\u0628 \u0648\u0627\u062D\u062F\u0647\u0627", callback_data: `atk:back:${targetId}` }]]
    );
    return;
  }
  const { previewForWarTarget: previewForWarTarget2 } = await Promise.resolve().then(() => (init_botActions(), botActions_exports));
  const p = await previewForWarTarget2(ctx.db, nation, targetId, ctx.settings, plan);
  const units = await ownedOffenseUnits(ctx.db, nation.id);
  const sum = summarizePlan(units, plan);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      "\u2694\uFE0F <b>\u067E\u06CC\u0634\u200C\u0646\u0645\u0627\u06CC\u0634 \u062D\u0645\u0644\u0647</b>",
      "",
      `${nation.flag} ${escapeHtml(nation.name)} \u2192 ${p.targetFlag} ${escapeHtml(p.targetName)}`,
      "",
      ...sum.lines,
      statLine("\u0648\u0627\u062D\u062F\u0647\u0627\u06CC \u0645\u062A\u0639\u0647\u062F", sum.totalUnits.toLocaleString("en-US")),
      statLine("\u0642\u062F\u0631\u062A \u0634\u0645\u0627 (\u062A\u0647\u0627\u062C\u0645)", formatNumber(p.attackerPower)),
      statLine("\u0642\u062F\u0631\u062A \u062F\u0641\u0627\u0639 \u062D\u0631\u06CC\u0641", formatNumber(p.defenderPower)),
      statLine("\u0627\u062D\u062A\u0645\u0627\u0644 \u067E\u06CC\u0631\u0648\u0632\u06CC \u0634\u0645\u0627", percent(p.attackerWinChance)),
      statLine("\u0647\u0632\u06CC\u0646\u0647 \u0648\u0631\u0648\u062F", coins(p.entryCost)),
      statLine("\u0646\u0648\u0628\u062A\u200C\u0647\u0627\u06CC \u062D\u062F\u0627\u06A9\u062B\u0631\u06CC", String(p.maxRounds)),
      "",
      "\u067E\u0633 \u0627\u0632 \u0627\u0631\u0633\u0627\u0644\u060C \u0641\u0642\u0637 \u0647\u0645\u06CC\u0646 \u0648\u0627\u062D\u062F\u0647\u0627 \u0648\u0627\u0631\u062F \u062C\u0646\u06AF \u0645\u06CC\u200C\u0634\u0648\u0646\u062F \u0648 \u0641\u0642\u0637 \u0647\u0645\u06CC\u0646\u200C\u0647\u0627 \u062E\u0633\u0627\u0631\u062A \u0645\u06CC\u200C\u0628\u06CC\u0646\u0646\u062F."
    ].join("\n"),
    [
      [{ text: "\u2694\uFE0F \u0627\u0631\u0633\u0627\u0644 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0646\u06AF", callback_data: `war:go:${targetId}` }],
      [{ text: "\u270F\uFE0F \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0622\u0631\u0627\u06CC\u0634", callback_data: `atk:back:${targetId}` }],
      [{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: "nav:war" }]
    ]
  );
}
async function renderDiplomacyInbox(ctx, chatId, messageId, nationId) {
  const incoming = await listIncoming(ctx.db, nationId);
  const rows = [];
  for (const r of incoming.slice(0, 8)) {
    const id = Number(r.id);
    rows.push([{ text: `${r.from_flag} ${String(r.from_name)} \u2014 ${kindFa(String(r.kind))}`, callback_data: "noop" }]);
    rows.push([
      { text: "\u2705 \u067E\u0630\u06CC\u0631\u0634", callback_data: `d:acc:${id}` },
      { text: "\u274C \u0631\u062F", callback_data: `d:rej:${id}` }
    ]);
  }
  rows.push([{ text: "\u{1F91D} \u0631\u0648\u0627\u0628\u0637 \u0645\u0646", callback_data: "d:rel" }]);
  rows.push([{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A", callback_data: "nav:diplomacy" }]);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    ["\u{1F4E5} <b>\u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627\u06CC \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9</b>", "", ...incoming.length ? incoming.slice(0, 8).map((r) => `${r.from_flag} ${String(r.from_name)}: ${kindFa(String(r.kind))}`) : ["\u062F\u0631\u062E\u0648\u0627\u0633\u062A\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F."]].join("\n"),
    rows
  );
}
async function renderRelations(ctx, chatId, messageId, nationId) {
  const rel = await listRelations(ctx.db, nationId);
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    ["\u{1F91D} <b>\u0631\u0648\u0627\u0628\u0637 \u062F\u06CC\u067E\u0644\u0645\u0627\u062A\u06CC\u06A9</b>", "", ...rel.length ? rel.slice(0, 12).map((r) => `${r.otherFlag} ${r.otherNationName} \u2014 <b>${r.statusLabelFa}</b>${r.allianceName ? ` (${r.allianceName})` : ""}`) : ["\u0631\u0648\u0627\u0628\u0637\u06CC \u062B\u0628\u062A \u0646\u0634\u062F\u0647 \u0627\u0633\u062A."]].join("\n"),
    [[{ text: "\u{1F4E5} \u062F\u0631\u062E\u0648\u0627\u0633\u062A\u200C\u0647\u0627", callback_data: "d:in" }], [{ text: "\u2B05\uFE0F \u0628\u0627\u0632\u06AF\u0634\u062A", callback_data: "nav:diplomacy" }]]
  );
}
function kindFa(kind) {
  return { friendship: "\u062F\u0648\u0633\u062A\u06CC", alliance: "\u0627\u062A\u062D\u0627\u062F", peace: "\u0635\u0644\u062D", non_aggression: "\u0639\u062F\u0645 \u062A\u062C\u0627\u0648\u0632", war: "\u062C\u0646\u06AF", message: "\u067E\u06CC\u0627\u0645", dissolve: "\u0644\u063A\u0648 \u0631\u0648\u0627\u0628\u0637" }[kind] ?? kind;
}
async function renderStatements(ctx, chatId, messageId, userId) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const { text, inline } = await renderStatementsBody(ctx, nation);
  await ctx.tg.editMessageText(chatId, messageId, text, inline);
}
async function renderStatementsBody(ctx, nation) {
  const list = await listMyStatements(ctx.db, [nation.id], 6);
  return {
    text: [
      "\u{1F4DC} <b>\u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0647\u0627\u06CC \u0631\u0633\u0645\u06CC</b>",
      "",
      ...list.length ? list.map((s) => `${s.statusLabelFa} | ${escapeHtml(s.text.slice(0, 110))}`) : ["\u0647\u0646\u0648\u0632 \u0628\u06CC\u0627\u0646\u06CC\u0647\u200C\u0627\u06CC \u0645\u0646\u062A\u0634\u0631 \u0646\u06A9\u0631\u062F\u0647\u200C\u0627\u06CC\u062F."],
      "",
      "\u0628\u06CC\u0627\u0646\u06CC\u0647 \u067E\u0633 \u0627\u0632 \u062B\u0628\u062A \u0628\u0647 \u0639\u0646\u0648\u0627\u0646 \u0645\u0648\u0636\u0639 \u0631\u0633\u0645\u06CC \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0645\u0646\u062A\u0634\u0631 \u0645\u06CC\u200C\u0634\u0648\u062F."
    ].join("\n"),
    inline: [[{ text: "\u270D\uFE0F \u0635\u062F\u0648\u0631 \u0628\u06CC\u0627\u0646\u06CC\u0647 \u062C\u062F\u06CC\u062F", callback_data: "st:new" }], ...backButton()]
  };
}
async function renderShopCategory(ctx, chatId, messageId, userId, categoryKey, offset) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const body = await shopCategoryBody(ctx, nation, categoryKey, offset);
  await ctx.tg.editMessageText(chatId, messageId, body.text, body.rows);
}
async function sendShopCategoryCard(ctx, chatId, userId, categoryKey) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const body = await shopCategoryBody(ctx, nation, categoryKey, 0);
  await ctx.tg.sendMessage(chatId, body.text, { inline: body.rows });
}
async function shopCategoryBody(ctx, nation, categoryKey, offset) {
  const { items } = await listCategoryItems(ctx.db, nation, categoryKey, ctx.settings);
  const page = items.slice(offset, offset + 10);
  const rows = page.map((item) => [
    {
      text: item.purchasable ? `${item.nameFa} \u2014 ${formatNumber(item.price ?? 0)}` : `${item.nameFa} \u2014 \u{1F512} ${item.disabledReason ?? ""}`,
      callback_data: item.purchasable ? `item:${item.templateId}:0` : "noop"
    }
  ]);
  rows.push(...pager(`cat:${categoryKey}`, offset, items.length, 10));
  rows.push([{ text: "\u{1F519} \u062F\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC\u200C\u0647\u0627", callback_data: "nav:marketplace" }, { text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]);
  const text = [
    `\u{1F6D2} <b>${items.length} \u062A\u062C\u0647\u06CC\u0632 \u062F\u0631 \u0627\u06CC\u0646 \u062F\u0633\u062A\u0647</b>`,
    "",
    statLine("\u062E\u0632\u0627\u0646\u0647", coins(nation.treasury)),
    "\u062A\u0639\u062F\u0627\u062F \u062E\u0631\u06CC\u062F\u0627\u0631\u06CC\u200C\u0634\u062F\u0647 \u062F\u0631 \u067E\u0631\u0627\u0646\u062A\u0632 \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.",
    ...page.map((i) => `\u2022 ${i.nameFa} (\u0645\u0648\u062C\u0648\u062F\u06CC \u0641\u0639\u0644\u06CC: ${formatNumber(i.ownedQuantity)})`)
  ].join("\n");
  return { text, rows };
}
async function renderShopItem(ctx, chatId, messageId, userId, templateId, _offset) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (!templateId) {
    const groups = await inventoryView(ctx.db, nation.id, ctx.settings);
    await ctx.tg.editMessageText(
      chatId,
      messageId,
      ["\u{1F396}\uFE0F <b>\u0645\u0648\u062C\u0648\u062F\u06CC \u06A9\u0634\u0648\u0631</b>", "", ...groups.map((g) => `${g.emoji} ${g.labelFa}: ${formatNumber(g.total)}`)].join("\n"),
      backButton()
    );
    return;
  }
  const item = await ctx.db.first(
    sql`SELECT t.id, t.name_fa, t.unit_fa, t.price, t.description, c.key AS cat, c.label_fa AS cat_label, c.emoji,
               COALESCE(i.quantity, 0) AS owned
          FROM equipment_templates t JOIN equipment_categories c ON c.id = t.category_id
          LEFT JOIN nation_inventory i ON i.template_id = t.id AND i.nation_id = ${nation.id}
         WHERE t.id = ${templateId}`
  );
  if (!item) throw ApiError.notFound("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const price = item.price === null ? null : Number(item.price);
  const qtyButtons = [1, 5, 10, 25, 100].filter((q) => price !== null && q * price <= nation.treasury).map((q) => ({ text: `${q}`, callback_data: `buy:${templateId}:${q}` }));
  await ctx.tg.editMessageText(
    chatId,
    messageId,
    [
      `${item.emoji} <b>${escapeHtml(String(item.name_fa))}</b> (${item.cat_label})`,
      "",
      price === null ? "\u{1F512} \u0642\u06CC\u0645\u062A \u062A\u0648\u0633\u0637 \u0645\u062F\u06CC\u0631 \u062A\u0639\u06CC\u06CC\u0646 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A\u061B \u062E\u0631\u06CC\u062F \u063A\u06CC\u0631\u0641\u0639\u0627\u0644 \u0627\u0633\u062A." : statLine("\u0642\u06CC\u0645\u062A \u0647\u0631 \u0639\u062F\u062F", coins(price)),
      statLine("\u0645\u0648\u062C\u0648\u062F\u06CC \u0634\u0645\u0627", `${formatNumber(Number(item.owned))} ${item.unit_fa}`),
      item.description ? `
${escapeHtml(String(item.description))}` : "",
      "",
      "\u062A\u0639\u062F\u0627\u062F \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F:"
    ].join("\n"),
    [qtyButtons.length ? qtyButtons : [{ text: "\u26A0\uFE0F \u0642\u0627\u0628\u0644 \u062E\u0631\u06CC\u062F \u0646\u06CC\u0633\u062A", callback_data: "noop" }], [{ text: "\u{1F519} \u0628\u0627\u0632\u06AF\u0634\u062A", callback_data: `cat:${String(item.cat)}:0` }]]
  );
}
async function confirmPurchaseAsk(ctx, chatId, messageId, userId, templateId, quantity) {
  const nation = await currentNation(ctx, userId);
  if (!nation) throw ApiError.forbidden("\u06A9\u0634\u0648\u0631\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  const item = await ctx.db.first(
    sql`SELECT name_fa, price, unit_fa FROM equipment_templates WHERE id = ${templateId}`
  );
  if (!item) throw ApiError.notFound("\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
  if (item.price === null) throw ApiError.validation("\u0642\u06CC\u0645\u062A \u0627\u06CC\u0646 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0647\u0646\u0648\u0632 \u062A\u0639\u06CC\u06CC\u0646 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
  const total = item.price * quantity;
  if (total > nation.treasury) throw ApiError.insufficientFunds(`\u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 \u06A9\u0627\u0641\u06CC \u0646\u06CC\u0633\u062A (\u0646\u06CC\u0627\u0632: ${coins(total)}).`);
  const summary = [
    "\u{1F9FE} <b>\u062E\u0644\u0627\u0635\u0647 \u0633\u0641\u0627\u0631\u0634</b>",
    "",
    statLine("\u062A\u062C\u0647\u06CC\u0632", String(item.name_fa)),
    statLine("\u062A\u0639\u062F\u0627\u062F", `${formatNumber(quantity)} ${item.unit_fa}`),
    statLine("\u0642\u06CC\u0645\u062A \u0648\u0627\u062D\u062F", coins(item.price)),
    statLine("\u0645\u0628\u0644\u063A \u06A9\u0644", coins(total)),
    statLine("\u062E\u0632\u0627\u0646\u0647 \u0641\u0639\u0644\u06CC", coins(nation.treasury)),
    statLine("\u062E\u0632\u0627\u0646\u0647 \u067E\u0633 \u0627\u0632 \u062E\u0631\u06CC\u062F", coins(nation.treasury - total)),
    "",
    "\u0628\u0627 \u062A\u0623\u06CC\u06CC\u062F\u060C \u0645\u0628\u0644\u063A \u0627\u0632 \u062E\u0632\u0627\u0646\u0647 \u06A9\u0633\u0631 \u0648 \u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0628\u0647 \u0627\u0646\u0628\u0627\u0631 \u0627\u0636\u0627\u0641\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F."
  ].join("\n");
  await ctx.tg.editMessageText(chatId, messageId, summary, [
    [{ text: "\u2705 \u062A\u0623\u06CC\u06CC\u062F \u0648 \u067E\u0631\u062F\u0627\u062E\u062A", callback_data: `bought:${templateId}:${quantity}` }],
    [{ text: "\u274C \u0627\u0646\u0635\u0631\u0627\u0641", callback_data: `item:${templateId}:0` }]
  ]);
}
var ALL_DEFENSE_KEYS = DEFENSE_ARRANGEMENT.map((t) => t.key);
async function defenseStatsText(ctx, nation) {
  const d = await buildDefenseView(ctx.db, nation, ctx.settings);
  return [
    `\u{1F6E1}\uFE0F <b>\u0648\u0636\u0639\u06CC\u062A \u062F\u0641\u0627\u0639\u06CC ${nation.flag} ${escapeHtml(nation.name)}</b>`,
    "",
    statLine("\u0648\u0636\u0639\u06CC\u062A", d.statusLabelFa),
    statLine("\u0627\u0645\u062A\u06CC\u0627\u0632 \u062F\u0641\u0627\u0639", formatNumber(d.defenseScore)),
    statLine("\u0627\u0645\u062A\u06CC\u0627\u0632 \u06A9\u0644\u06CC", formatNumber(d.overallScore)),
    statLine("\u0646\u06CC\u0631\u0648\u0647\u0627", formatNumber(d.troopsCount)),
    statLine("\u0631\u0627\u062F\u0627\u0631\u0647\u0627", formatNumber(d.radarCount)),
    statLine("\u0648\u0627\u062D\u062F\u0647\u0627\u06CC \u067E\u062F\u0627\u0641\u0646\u062F\u06CC", formatNumber(d.airDefenseUnits)),
    statLine("\u0633\u0637\u062D \u0627\u0633\u062A\u062D\u06A9\u0627\u0645\u0627\u062A", String(d.fortificationLevel)),
    "",
    "\u0633\u0647\u0645 \u062F\u0633\u062A\u0647\u200C\u0647\u0627 \u062F\u0631 \u062F\u0641\u0627\u0639:",
    ...d.breakdown.slice(0, 8).map((b) => `${b.emoji} ${b.labelFa}: ${formatNumber(b.contribution)}`),
    ...d.activeThreats.length ? ["", `\u26A0\uFE0F \u062A\u0647\u062F\u06CC\u062F \u0641\u0639\u0627\u0644: ${d.activeThreats.map((t) => t.attackerName).join("\u060C ")}`] : []
  ].join("\n");
}
async function loadDefenseDraft(db, userId) {
  const row = await db.first(
    sql`SELECT state, data FROM bot_flow_states WHERE user_id = ${userId}`
  );
  if (row?.state !== "def:plan") return null;
  const data = safeJson3(row.data);
  if (!Array.isArray(data.selected)) return null;
  const valid = data.selected.filter((k) => typeof k === "string" && ALL_DEFENSE_KEYS.includes(k));
  return valid;
}
async function saveDefenseDraft(db, userId, nationId, selected) {
  await db.run(
    sql`INSERT INTO bot_flow_states (user_id, state, nation_id, data, updated_at, expires_at)
        VALUES (${userId}, 'def:plan', ${nationId}, ${JSON.stringify({ selected })}, ${nowSeconds()}, ${nowSeconds() + 3600})
        ON CONFLICT (user_id) DO UPDATE SET state = 'def:plan', nation_id = excluded.nation_id, data = excluded.data, updated_at = excluded.updated_at, expires_at = excluded.expires_at`
  );
}
async function clearDefenseDraft(db, userId) {
  await db.run(sql`DELETE FROM bot_flow_states WHERE user_id = ${userId} AND state = 'def:plan'`);
}
async function renderDefenseArranger(ctx, chatId, messageId, userId, nation) {
  const saved = await loadDefensePlan(ctx.db, nation.id);
  const draft = await loadDefenseDraft(ctx.db, userId);
  const selected = draft ?? saved ?? ALL_DEFENSE_KEYS;
  const tileButtons = DEFENSE_ARRANGEMENT.map((t) => ({
    text: `${selected.includes(t.key) ? "\u2705" : "\u2B1C"} ${t.emoji} ${t.labelFa}`,
    callback_data: `def:toggle:${t.key}`
  }));
  const rows = [];
  for (let i = 0; i < tileButtons.length; i += 2) rows.push(tileButtons.slice(i, i + 2));
  rows.push([{ text: "\u2705 \u062A\u0623\u06CC\u06CC\u062F \u0622\u0631\u0627\u06CC\u0634 \u062F\u0641\u0627\u0639\u06CC", callback_data: "def:apply" }]);
  rows.push([{ text: "\u267B\uFE0F \u0628\u0627\u0632\u0646\u0634\u0627\u0646\u06CC (\u0647\u0645\u0647 \u0646\u06CC\u0631\u0648\u0647\u0627)", callback_data: "def:reset" }, { text: "\u{1F4CA} \u062C\u0632\u0626\u06CC\u0627\u062A \u062F\u0641\u0627\u0639", callback_data: "def:stats" }]);
  rows.push([{ text: "\u{1F3E0} \u0645\u0646\u0648", callback_data: "m" }]);
  const text = [
    "\u{1F6E1}\uFE0F <b>\u0645\u0631\u06A9\u0632 \u0641\u0631\u0645\u0627\u0646\u062F\u0647\u06CC \u062F\u0641\u0627\u0639</b>",
    "",
    "\u062A\u062C\u0647\u06CC\u0632\u0627\u062A \u0645\u0648\u0631\u062F\u0646\u0638\u0631 \u0631\u0627 \u0628\u0631\u0627\u06CC \u062F\u0641\u0627\u0639 \u0627\u0632 \u06A9\u0634\u0648\u0631 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646:",
    "",
    `\u062A\u0639\u062F\u0627\u062F \u062F\u0633\u062A\u0647\u200C\u0647\u0627\u06CC \u0645\u062A\u0639\u0647\u062F: <b>${selected.length}</b> \u0627\u0632 ${ALL_DEFENSE_KEYS.length}`,
    selected.includes(DEFENSE_FORTIFICATION_TOKEN) ? "\u{1F3F0} \u0627\u0633\u062A\u062D\u06A9\u0627\u0645\u0627\u062A \u062F\u0631 \u0646\u0628\u0631\u062F \u0627\u062D\u062A\u0633\u0627\u0628 \u0645\u06CC\u200C\u0634\u0648\u062F." : "\u{1F3F0} \u0627\u0633\u062A\u062D\u06A9\u0627\u0645\u0627\u062A \u062F\u0631 \u0646\u0628\u0631\u062F \u0627\u062D\u062A\u0633\u0627\u0628 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.",
    "",
    "\u0641\u0642\u0637 \u0647\u0645\u06CC\u0646 \u062F\u0633\u062A\u0647\u200C\u0647\u0627 \u062F\u0631 \u062C\u0646\u06AF \u062F\u0641\u0627\u0639 \u0645\u06CC\u200C\u06A9\u0646\u0646\u062F \u0648 \u0641\u0642\u0637 \u0647\u0645\u06CC\u0646\u200C\u0647\u0627 \u062E\u0633\u0627\u0631\u062A \u0645\u06CC\u200C\u0628\u06CC\u0646\u0646\u062F."
  ].join("\n");
  if (messageId === null) await ctx.tg.sendMessage(chatId, text, { inline: rows });
  else await ctx.tg.editMessageText(chatId, messageId, text, rows);
}
async function sendPrizesCard(ctx, chatId, userId) {
  const nation = await currentNation(ctx, userId);
  if (!nation) {
    await ctx.tg.sendMessage(chatId, "\u0627\u0628\u062A\u062F\u0627 \u06A9\u0634\u0648\u0631 \u0628\u0633\u0627\u0632\u06CC\u062F.", { inline: [[{ text: "\u{1F3F3}\uFE0F \u0633\u0627\u062E\u062A \u06A9\u0634\u0648\u0631", callback_data: "new" }]] });
    return;
  }
  const state = await prizeState(ctx.db, nation.id);
  const lines = [
    "\u{1F381} <b>\u062C\u0627\u06CC\u0632\u0647 \u0634\u0627\u0646\u0633\u06CC \u0631\u0648\u0632\u0627\u0646\u0647</b>",
    "",
    "\u06CC\u06A9\u06CC \u0627\u0632 \u062C\u0648\u0627\u06CC\u0632 \u0632\u06CC\u0631 \u0628\u0647\u200C\u0635\u0648\u0631\u062A \u062A\u0635\u0627\u062F\u0641\u06CC \u0628\u0647 \u0634\u0645\u0627 \u062A\u0639\u0644\u0642 \u0645\u06CC\u200C\u06AF\u06CC\u0631\u062F:",
    "",
    ...DAILY_PRIZES.map((p) => `${p.emoji} ${p.labelFa}`),
    "",
    state.claimed && state.prize ? `\u2705 \u062C\u0627\u06CC\u0632\u0647\u0654 \u0627\u0645\u0631\u0648\u0632 \u0634\u0645\u0627: ${state.prize.emoji} ${state.prize.labelFa}
\u0641\u0631\u062F\u0627 (\u0628\u0647 \u0648\u0642\u062A UTC) \u0628\u0631\u06AF\u0631\u062F\u06CC\u062F!` : "\u0628\u0631\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u062F\u06A9\u0645\u0647\u0654 \u0632\u06CC\u0631 \u0631\u0627 \u0628\u0632\u0646:"
  ];
  const inline = state.claimed && state.prize ? [[{ text: "\u2705 \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F", callback_data: "noop" }], ...backButton()] : [[{ text: "\u{1F381} \u062F\u0631\u06CC\u0627\u0641\u062A \u062C\u0627\u06CC\u0632\u0647 \u0634\u0627\u0646\u0633\u06CC", callback_data: "prize:claim" }], ...backButton()];
  await ctx.tg.sendMessage(chatId, lines.join("\n"), { inline });
}
function bankHomeText(state) {
  const lines = ["\u{1F3E6} <b>\u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC \u06A9\u0634\u0648\u0631</b>", "", "\u{1F3E6} \u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647 \u0645\u0644\u06CC \u{1F4B0}", `<b>${formatNumber(state.treasury)} \u0633\u06A9\u0647</b>`];
  const loan = state.activeLoan;
  if (loan) {
    lines.push("", `\u{1F512} \u0648\u0627\u0645 \u0641\u0639\u0627\u0644: ${formatNumber(loan.principal)} \u0633\u06A9\u0647 \u2014 \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A ${formatNumber(loan.repayAmount)} \u0633\u06A9\u0647`);
    if (loan.daysLeft !== null && loan.daysLeft < 0) lines.push("\u26A0\uFE0F \u0633\u0631\u0631\u0633\u06CC\u062F \u0648\u0627\u0645 \u06AF\u0630\u0634\u062A\u0647 \u0627\u0633\u062A. \u0647\u0631 \u0686\u0647 \u0632\u0648\u062F\u062A\u0631 \u062A\u0633\u0648\u06CC\u0647 \u06A9\u0646\u06CC\u062F.");
    else if (loan.daysLeft !== null) lines.push(`\u0633\u0631\u0631\u0633\u06CC\u062F: ${loan.daysLeft} \u0631\u0648\u0632 \u062F\u06CC\u06AF\u0631`);
  }
  return lines.join("\n");
}
function bankHomeRows() {
  return [
    [
      { text: "\u062F\u0631\u06CC\u0627\u0641\u062A \u062F\u0631\u0622\u0645\u062F \u{1F4B5}", callback_data: "bank:income" },
      { text: "\u0648\u0627\u0645 \u0628\u0627\u0646\u06A9\u06CC \u{1F4B3}", callback_data: "bank:loan" }
    ],
    [{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC \u2B05 BACK", callback_data: "m" }]
  ];
}
async function freshBankState(ctx, nation) {
  const fresh = await loadNationOwnedBy(ctx.db, Number(nation.owner_user_id), nation.id);
  return bankState(ctx.db, fresh ?? nation, ctx.settings);
}
async function sendBankHome(ctx, chatId, userId, nation) {
  const state = await freshBankState(ctx, nation);
  await ctx.tg.sendMessage(chatId, bankHomeText(state), { inline: bankHomeRows() });
}
async function editBankHome(ctx, chatId, messageId, nation) {
  const state = await freshBankState(ctx, nation);
  await ctx.tg.editMessageText(chatId, messageId, bankHomeText(state), bankHomeRows());
}
function bankIncomeLines(state) {
  return [
    "\u{1F4B4} <b>\u062F\u0631\u0622\u0645\u062F \u06A9\u0634\u0648\u0631</b>",
    "",
    "\u062F\u0631\u0622\u0645\u062F \u0622\u0645\u0627\u062F\u0647 \u062F\u0631\u06CC\u0627\u0641\u062A",
    `\u{1F4B0} <b>${formatNumber(state.pendingIncome.amount)} \u0633\u06A9\u0647</b>`,
    "",
    "\u0641\u0631\u0645\u0627\u0646\u062F\u0647\u060C \u062F\u0631\u0622\u0645\u062F \u0627\u0642\u062A\u0635\u0627\u062F\u06CC \u06A9\u0634\u0648\u0631 \u0634\u0645\u0627 \u0622\u0645\u0627\u062F\u0647 \u062F\u0631\u06CC\u0627\u0641\u062A \u0627\u0633\u062A."
  ].join("\n");
}
function bankIncomeRows(state) {
  const amount = state.pendingIncome.amount;
  const claimRow = amount > 0 ? [{ text: `\u062F\u0631\u06CC\u0627\u0641\u062A ${formatNumber(amount)} \u0633\u06A9\u0647 \u{1F4B0}`, callback_data: "bank:claim_income" }] : [{ text: "\u2705 \u062F\u0631\u0622\u0645\u062F\u06CC \u0622\u0645\u0627\u062F\u0647 \u0646\u06CC\u0633\u062A", callback_data: "noop" }];
  return [claimRow, [{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "bank:home" }]];
}
async function editBankIncome(ctx, chatId, messageId, nation) {
  const state = await freshBankState(ctx, nation);
  await ctx.tg.editMessageText(chatId, messageId, bankIncomeLines(state), bankIncomeRows(state));
}
function bankLoanLines(state) {
  const loan = state.activeLoan;
  if (loan) {
    const due = (loan.dueAt ?? "").slice(0, 10);
    const daysLeft = loan.daysLeft;
    const dueLabel = daysLeft === null ? "" : daysLeft < 0 ? " \u2014 \u0633\u0631\u0631\u0633\u06CC\u062F \u06AF\u0630\u0634\u062A\u0647 \u0627\u0633\u062A \u26A0\uFE0F" : ` \u2014 ${daysLeft} \u0631\u0648\u0632 \u062F\u06CC\u06AF\u0631`;
    return [
      "\u{1F3E6} <b>\u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC \u06A9\u0634\u0648\u0631</b>",
      "",
      "\u0641\u0631\u0645\u0627\u0646\u062F\u0647\u060C \u0634\u0645\u0627 \u06CC\u06A9 \u0648\u0627\u0645 \u0641\u0639\u0627\u0644 \u062F\u0627\u0631\u06CC\u062F:",
      "",
      `\u{1F512} \u0627\u0635\u0644 \u0648\u0627\u0645: <b>${formatNumber(loan.principal)} \u0633\u06A9\u0647</b>`,
      `\u0645\u0628\u0644\u063A \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A (\u0633\u0648\u062F \u06F1\u06F0\u066A): <b>${formatNumber(loan.repayAmount)} \u0633\u06A9\u0647</b>`,
      `\u0633\u0631\u0631\u0633\u06CC\u062F: ${due}${dueLabel}`,
      "",
      "\u062A\u0627 \u062A\u0633\u0648\u06CC\u0647 \u0627\u06CC\u0646 \u0648\u0627\u0645\u060C \u0627\u0645\u06A9\u0627\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u062C\u062F\u06CC\u062F \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F."
    ].join("\n");
  }
  return [
    "\u{1F3E6} <b>\u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC \u06A9\u0634\u0648\u0631</b>",
    "",
    "\u0641\u0631\u0645\u0627\u0646\u062F\u0647\u060C \u0645\u06CC\u200C\u062A\u0648\u0646\u06CC \u0627\u0632 \u0628\u0627\u0646\u06A9 \u0645\u0631\u06A9\u0632\u06CC \u0648\u0627\u0645 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0646\u06CC.",
    "",
    "\u{1F4B0} \u0645\u0628\u0644\u063A \u0648\u0627\u0645 \u0642\u0627\u0628\u0644 \u062F\u0631\u06CC\u0627\u0641\u062A:",
    "",
    "\u2022 \u0648\u0627\u0645 \u06A9\u0648\u0686\u06A9: \u06F5\u066C\u06F0\u06F0\u06F0 \u0633\u06A9\u0647",
    "\u2022 \u0648\u0627\u0645 \u0645\u062A\u0648\u0633\u0637: \u06F1\u06F0\u066C\u06F0\u06F0\u06F0 \u0633\u06A9\u0647",
    "\u2022 \u0648\u0627\u0645 \u0628\u0632\u0631\u06AF: \u06F2\u06F0\u066C\u06F0\u06F0\u06F0 \u0633\u06A9\u0647",
    "",
    "\u{1F4CC} \u0634\u0631\u0627\u06CC\u0637 \u0648\u0627\u0645:",
    "",
    "\u2022 \u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0628\u0639\u062F \u0627\u0632 \u06F7 \u0631\u0648\u0632",
    "\u2022 \u0633\u0648\u062F \u0648\u0627\u0645: \u06F1\u06F0\u066A",
    "\u2022 \u062A\u0627 \u062A\u0633\u0648\u06CC\u0647 \u0648\u0627\u0645 \u0642\u0628\u0644\u06CC\u060C \u0627\u0645\u06A9\u0627\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 \u062C\u062F\u06CC\u062F \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F."
  ].join("\n");
}
function bankLoanRows(state) {
  const loan = state.activeLoan;
  if (loan) {
    return [
      [{ text: `\u0628\u0627\u0632\u067E\u0631\u062F\u0627\u062E\u062A \u0648\u0627\u0645 (${formatNumber(loan.repayAmount)} \u0633\u06A9\u0647) \u{1F4B5}`, callback_data: "bank:repay" }],
      [{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "bank:home" }]
    ];
  }
  return [
    [{ text: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 5,000 \u0633\u06A9\u0647 \u{1F4B5}", callback_data: "bank:take:5000" }],
    [{ text: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 10,000 \u0633\u06A9\u0647 \u{1F4B5}", callback_data: "bank:take:10000" }],
    [{ text: "\u062F\u0631\u06CC\u0627\u0641\u062A \u0648\u0627\u0645 20,000 \u0633\u06A9\u0647 \u{1F4B5}", callback_data: "bank:take:20000" }],
    [{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "bank:home" }]
  ];
}
async function editBankLoan(ctx, chatId, messageId, nation) {
  const state = await freshBankState(ctx, nation);
  await ctx.tg.editMessageText(chatId, messageId, bankLoanLines(state), bankLoanRows(state));
}
function buildingsScreenText(state) {
  const projectLines = state.projects.length ? ["", "\u{1F6A7} <b>\u067E\u0631\u0648\u0698\u0647\u200C\u0647\u0627\u06CC \u062F\u0631 \u062D\u0627\u0644 \u0633\u0627\u062E\u062A:</b>", ...state.projects.map((p) => `${p.emoji} ${escapeHtml(p.nameFa)} \u2014 ${p.kind === "build" ? "\u0633\u0627\u062E\u062A" : "\u0627\u0631\u062A\u0642\u0627 \u0628\u0647 \u0633\u0637\u062D " + p.targetLevel} \xB7 ${p.progressPercent}\u066A \xB7 ${escapeHtml(p.remainingFa)} \u0628\u0627\u0642\u06CC\u200C\u0645\u0627\u0646\u062F\u0647`)] : [];
  return [
    "\u{1F3D7}\uFE0F <b>\u0648\u0632\u0627\u0631\u062A \u0633\u0627\u062E\u062A\u200C\u0648\u0633\u0627\u0632</b>",
    "",
    "\u0641\u0631\u0645\u0627\u0646\u062F\u0647\u060C \u0628\u0631\u0627\u06CC \u062A\u0648\u0633\u0639\u0647 \u06A9\u0634\u0648\u0631 \u062E\u0648\u062F \u0633\u0627\u0632\u0647\u200C\u0647\u0627\u06CC \u062C\u062F\u06CC\u062F \u0628\u0633\u0627\u0632.",
    "",
    `\u{1F4B0} \u0645\u0648\u062C\u0648\u062F\u06CC \u062E\u0632\u0627\u0646\u0647: <b>${formatNumber(state.treasury)} \u0633\u06A9\u0647</b>`,
    `\u0633\u0627\u0632\u0647\u200C\u0647\u0627\u06CC \u0633\u0627\u062E\u062A\u0647\u200C\u0634\u062F\u0647: <b>${state.builtCount}</b> \u0627\u0632 ${state.totalCount} \xB7 \u067E\u0631\u0648\u0698\u0647\u200C\u0647\u0627\u06CC \u0628\u0627\u0632: <b>${state.activeProjectCount}</b> \u0627\u0632 ${state.maxConcurrent}`,
    ...projectLines,
    "",
    "\u0628\u0631\u0627\u06CC \u0633\u0627\u062E\u062A \u06CC\u0627 \u0627\u0631\u062A\u0642\u0627\u06CC \u06CC\u06A9 \u0633\u0627\u0632\u0647\u060C \u062F\u06A9\u0645\u0647\u0654 \u0622\u0646 \u0631\u0627 \u0628\u0632\u0646\u06CC\u062F:"
  ].join("\n");
}
function buildingsRows(state) {
  const rows = state.buildings.map((b) => [
    b.activeProjectId ? { text: `${b.emoji} ${b.nameFa} \u2014 \u{1F6A7} \u062F\u0631 \u062D\u0627\u0644 \u0633\u0627\u062E\u062A`, callback_data: "noop" } : {
      text: b.built ? b.nextAction === "upgrade" ? `${b.emoji} ${b.nameFa} \u2705 \u0633\u0637\u062D ${b.level} \u2014 \u0627\u0631\u062A\u0642\u0627 ${formatNumber(b.nextCost)} \u0633\u06A9\u0647` : `${b.emoji} ${b.nameFa} \u2705 \u062D\u062F\u0627\u06A9\u062B\u0631 \u0633\u0637\u062D` : `${b.emoji} ${b.nameFa} \u2014 ${formatNumber(b.cost)} \u0633\u06A9\u0647`,
      callback_data: b.nextAction === "max" ? "noop" : `build:ask:${b.key}`
    }
  ]);
  rows.push([{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u0647 \u0645\u0646\u0648\u06CC \u0627\u0635\u0644\u06CC \u2B05 BACK", callback_data: "m" }]);
  return rows;
}
async function sendBuildingsHome(ctx, chatId, nation) {
  const state = await buildState(ctx.db, nation);
  await ctx.tg.sendMessage(chatId, buildingsScreenText(state), { inline: buildingsRows(state) });
}
async function editBuildingsHome(ctx, chatId, messageId, nation) {
  const fresh = await loadNationOwnedBy(ctx.db, Number(nation.owner_user_id), nation.id);
  const state = await buildState(ctx.db, fresh ?? nation);
  await ctx.tg.editMessageText(chatId, messageId, buildingsScreenText(state), buildingsRows(state));
}
var RANKING_TABS = [
  { key: "military", label: "\u2694\uFE0F \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u0642\u062F\u0631\u062A \u0646\u0638\u0627\u0645\u06CC", scoreLabel: "\u0642\u062F\u0631\u062A \u0646\u0638\u0627\u0645\u06CC" },
  { key: "economic", label: "\u{1F4B0} \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u0627\u0642\u062A\u0635\u0627\u062F\u06CC", scoreLabel: "\u0627\u0645\u062A\u06CC\u0627\u0632 \u0627\u0642\u062A\u0635\u0627\u062F\u06CC" },
  { key: "global", label: "\u{1F30D} \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u0642\u062F\u0631\u062A \u062C\u0647\u0627\u0646\u06CC", scoreLabel: "\u0627\u0645\u062A\u06CC\u0627\u0632 \u06A9\u0644" },
  { key: "development", label: "\u{1F3ED} \u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u062A\u0648\u0633\u0639\u0647 \u06A9\u0634\u0648\u0631\u0647\u0627", scoreLabel: "\u0633\u0627\u0632\u0647\u200C\u0647\u0627\u06CC \u0633\u0627\u062E\u062A\u0647\u200C\u0634\u062F\u0647" }
];
var RANK_WORDS = ["\u0627\u0648\u0644", "\u062F\u0648\u0645", "\u0633\u0648\u0645", "\u0686\u0647\u0627\u0631\u0645", "\u067E\u0646\u062C\u0645"];
var RANK_MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}", "4\uFE0F\u20E3", "5\uFE0F\u20E3"];
async function rankingsCard(ctx, nation, metric) {
  const apiMetric = metric === "military" ? "military_power" : metric === "economic" ? "economic_score" : metric === "development" ? "development" : void 0;
  const rows = await listRankings(ctx.db, ctx.settings, { metric: apiMetric, limit: 5 });
  const tab = RANKING_TABS.find((t) => t.key === metric) ?? RANKING_TABS[2];
  const lines = ["\u{1F3C6} <b>\u0631\u062A\u0628\u0647\u200C\u0628\u0646\u062F\u06CC \u0642\u062F\u0631\u062A\u200C\u0647\u0627\u06CC \u062C\u0647\u0627\u0646</b>", "", "\u0628\u0631\u062A\u0631\u06CC\u0646 \u06A9\u0634\u0648\u0631\u0647\u0627\u06CC \u062C\u0647\u0627\u0646 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0639\u0645\u0644\u06A9\u0631\u062F \u0648 \u0642\u062F\u0631\u062A", ""];
  const top = rows[0];
  if (top) {
    lines.push(`\u{1F947} \u0631\u062A\u0628\u0647 \u0627\u0648\u0644 \u{1F396}\uFE0F \u0627\u0628\u0631\u0642\u062F\u0631\u062A`);
    lines.push(`${top.flag} <b>${escapeHtml(top.name)}</b>`);
    lines.push(`${tab.scoreLabel}: <b>${formatNumber(top.score)}</b>`);
    lines.push("");
  }
  for (let i = 1; i < Math.min(5, rows.length); i++) {
    const r = rows[i];
    lines.push(`${RANK_MEDALS[i]} \u0631\u062A\u0628\u0647 ${RANK_WORDS[i]} ${r.flag} ${escapeHtml(r.name)} \u2014 ${formatNumber(r.score)}`);
  }
  if (rows.length === 0) lines.push("\u0647\u0646\u0648\u0632 \u0647\u06CC\u0686 \u06A9\u0634\u0648\u0631\u06CC \u062F\u0631 \u0641\u0647\u0631\u0633\u062A \u0646\u06CC\u0633\u062A.");
  const mine = nation ? rows.find((r) => r.nationId === nation.id) : void 0;
  lines.push("");
  lines.push(mine ? `\u0631\u062A\u0628\u0647 \u0634\u0645\u0627: <b>#${mine.rank}</b> \u0627\u0632 ${RANK_WORDS[Math.min(4, mine.rank - 1)] ?? mine.rank}` : "\u0634\u0645\u0627 \u0647\u0646\u0648\u0632 \u062F\u0631 \u0641\u0647\u0631\u0633\u062A \u0628\u0631\u062A\u0631 \u0646\u06CC\u0633\u062A\u06CC\u062F.");
  const inline = RANKING_TABS.map((t) => [
    { text: `${t.label}${metric === t.key ? " \u2705" : ""}`, callback_data: `rank:tab:${t.key}` }
  ]);
  inline.push([{ text: "\u0628\u0627\u0632\u06AF\u0634\u062A \u2B05 BACK", callback_data: "m" }]);
  return { text: lines.join("\n"), inline };
}
async function sendRankingsCard(ctx, chatId, userId, metric) {
  const nation = await currentNation(ctx, userId) ?? null;
  const card = await rankingsCard(ctx, nation, metric);
  await ctx.tg.sendMessage(chatId, card.text, { inline: card.inline });
}

// apps/worker/src/app.ts
function createApp() {
  const app2 = new Hono3();
  app2.use("*", errorHandler2);
  app2.use("*", createContext);
  app2.use(
    "/api/*",
    cors({
      // the Mini App is always served from the same origin (Workers Static Assets);
      // CORS is only opened for local development (vite on :5173)
      origin: (origin) => !origin || origin.includes("localhost") || origin.includes("127.0.0.1") ? origin : null,
      allowHeaders: ["content-type", "authorization"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 600
    })
  );
  app2.get("/api/health", async (c) => {
    const db = new Db(c.env.DB);
    const row = await db.first(
      sql`SELECT (SELECT COUNT(*) FROM nations) AS nations, (SELECT COUNT(*) FROM users) AS users`
    );
    return c.json({
      ok: true,
      service: "world-war",
      time: (/* @__PURE__ */ new Date()).toISOString(),
      env: c.env.APP_ENV ?? "production",
      counters: { nations: Number(row?.nations ?? 0), users: Number(row?.users ?? 0) },
      telegramBotConfigured: Boolean(c.env.BOT_TOKEN),
      webhookSecretConfigured: Boolean(c.env.TELEGRAM_WEBHOOK_SECRET)
    });
  });
  app2.get("/api/config", async (c) => {
    const settings = await loadSettings(new Db(c.env.DB));
    return c.json({
      gameName: settings.branding.gameName,
      welcomeTitle: settings.branding.welcomeTitle,
      features: settings.features,
      cycleSeconds: settings.economy.incomeCycleSeconds,
      webAppPath: ROUTES.playerRoot,
      adminPath: ROUTES.adminRoot,
      /** the UI must not offer the dev-login shortcut when the server refuses it anyway */
      devLoginEnabled: DEV_LOGIN_ENVS.has(c.env.APP_ENV ?? "production")
    });
  });
  app2.post(ROUTES.webhook, async (c) => {
    if (!checkWebhookSecret(c.req.header("x-telegram-bot-api-secret-token"), c.env.TELEGRAM_WEBHOOK_SECRET)) {
      return c.json({ error: { code: "unauthorized", message: "invalid secret token" } }, 401);
    }
    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== "object") return c.json({ ok: true, skipped: "empty" });
    const db = new Db(c.env.DB);
    const settings = await loadSettings(db);
    const ctx = { ...createBotCtx(c.env, db), settings, webAppUrl: appUrl(c.env) + ROUTES.playerRoot };
    record({ botUpdates: 1 });
    c.executionCtx.waitUntil(
      (async () => {
        try {
          await handleUpdate(ctx, body);
        } catch (err) {
          console.error("[webhook]", err instanceof Error ? err.message : err);
          record({ errors: 1 });
        }
      })()
    );
    return c.json({ ok: true });
  });
  app2.post("/bot/webhook", async (c) => {
    const url = new URL(c.req.url);
    return c.redirect(`${url.origin}${ROUTES.webhook}`, 307);
  });
  app2.post("/api/telegram/poll", async (c) => {
    if (!c.env.BOT_TOKEN) throw ApiError.internal("BOT_TOKEN \u062A\u0646\u0638\u06CC\u0645 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A.");
    const secret = c.req.header("x-admin-secret");
    if (!c.env.APP_SECRET || secret !== c.env.APP_SECRET) throw ApiError.forbidden("x-admin-secret \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A.");
    const db = new Db(c.env.DB);
    const settings = await loadSettings(db);
    const { TelegramApi: TelegramApi2 } = await Promise.resolve().then(() => (init_telegram(), telegram_exports));
    const api = new TelegramApi2(c.env.BOT_TOKEN, c.env.TELEGRAM_API_BASE);
    const offset = Number(c.req.query("offset") ?? 0);
    const updates = await api.getUpdates(offset, 25);
    const ctx = { ...createBotCtx(c.env, db), settings, webAppUrl: appUrl(c.env) + ROUTES.playerRoot };
    let last = offset;
    for (const u of updates) {
      await handleUpdate(ctx, u);
      last = Math.max(last, u.update_id + 1);
    }
    return c.json({ received: updates.length, offset: last, help: helpText() });
  });
  mountAuth(app2);
  mountPlayer(app2);
  mountShop(app2);
  mountDiplomacy(app2);
  mountStatements(app2);
  mountSocial(app2);
  mountAdmin(app2);
  app2.get("/api", (c) => c.json({ name: "World War API", version: 1, docs: "/api/health" }));
  app2.notFound(async (c) => {
    const url = new URL(c.req.url);
    if (url.pathname.startsWith("/api") || url.pathname.startsWith("/bot")) {
      return c.json({ error: { code: "not_found", message: "\u0645\u0633\u06CC\u0631 API \u06CC\u0627\u0641\u062A \u0646\u0634\u062F." } }, 404);
    }
    if (!c.env.ASSETS) return c.text("World War \u2014 \u0627\u06CC\u0646 \u0622\u062F\u0631\u0633 \u0641\u0642\u0637 API \u0633\u0631\u0648 \u0645\u06CC\u200C\u06A9\u0646\u062F\u061B \u0645\u06CC\u0646\u06CC\u200C\u0627\u067E \u0627\u0632 Static Assets \u062E\u0648\u0627\u0646\u062F\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F.", 404);
    const asset = await c.env.ASSETS.fetch(c.req.raw);
    if (asset.status !== 404) return asset;
    return c.env.ASSETS.fetch(new Request(new URL("/index.html", url).toString(), c.req.raw));
  });
  app2.onError((err, c) => {
    const api = err instanceof ApiError ? err : ApiError.internal("\u062E\u0637\u0627\u06CC \u062F\u0627\u062E\u0644\u06CC \u0633\u0631\u0648\u0631.", err instanceof Error ? err.message : String(err));
    if (!(err instanceof ApiError)) console.error("[onError]", err);
    return c.json({ error: { code: api.code, message: api.message, ...api.details === void 0 ? {} : { details: api.details } } }, api.status);
  });
  return app2;
}
function appUrl(env) {
  return (env.WEBAPP_URL || env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
}
var app = createApp();

// apps/worker/src/index.ts
var handler = {
  fetch: (request, env, ctx) => app.fetch(request, env, ctx),
  async scheduled(event, env, ctx) {
    const db = new Db(env.DB);
    ctx.waitUntil(
      (async () => {
        try {
          const result = await runScheduled(env, db, event.cron);
          const failed = result.jobs.filter((j) => !j.ok);
          console.log(
            JSON.stringify({
              type: "cron",
              cron: event.cron,
              skipped: result.skipped ?? null,
              jobs: result.jobs.map((j) => `${j.job}:${j.processed}${j.ok ? "" : ":FAILED"}`),
              at: (/* @__PURE__ */ new Date()).toISOString()
            })
          );
          if (failed.length) {
            console.error("[cron] failed jobs", JSON.stringify(failed));
          }
        } catch (err) {
          console.error("[cron] fatal", err instanceof Error ? err.message : String(err));
        } finally {
          await flushQuota(db).catch(() => void 0);
        }
      })()
    );
  }
};
var src_default = handler;
export {
  src_default as default
};
