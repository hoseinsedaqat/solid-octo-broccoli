/**
 * Generates apps/worker/seeds/catalog.sql (run AFTER seed.sql — see package.json db:seed:*)
 * Fixture data is embedded here (single source) — prices in coins.
 * Run: node apps/worker/scripts/gen-catalog.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'seeds', 'catalog.sql');

const M = 1_000_000, K = 1_000;
const catId = { tanks: 1, ground_air_defense: 2, air_air_defense: 3, naval_air_defense: 4, factories: 5, mines: 6, apc: 7, rockets: 8, helicopters: 9, radars: 10, submarines: 11, drones: 12, soldiers: 13, artillery: 14, ships: 15, transport_aircraft: 16, fighters: 17, missiles: 18, fuel: 19 };
const unit = { missiles: 'فروند', fighters: 'فروند', transport_aircraft: 'فروند', ships: 'فروند', tanks: 'عدد', artillery: 'عدد', ground_air_defense: 'واحد', naval_air_defense: 'واحد', air_air_defense: 'فروند', drones: 'فروند', submarines: 'فروند', radars: 'دستگاه', rockets: 'عدد', soldiers: 'نفر', factories: 'عدد', mines: 'عدد', apc: 'عدد', fuel: 'بشکه' };
const desc = { missiles: 'موشک هدایت‌شونده — بازار نظامی', fighters: 'جنگنده — بازار نظامی', transport_aircraft: 'هواپیمای ترابری نظامی', ships: 'ناو جنگی و پشتیبانی', tanks: 'زرهی — فروشگاه نظامی', artillery: 'توپخانه و راکت‌انداز', ground_air_defense: 'پدافند زمینی — فروشگاه نظامی', naval_air_defense: 'پدافند دریایی — فروشگاه نظامی', air_air_defense: 'پدافند هوایی — فروشگاه نظامی', drones: 'پهپاد — فروشگاه نظامی', submarines: 'زیردریایی — فروشگاه نظامی', radars: 'رادار — فروشگاه نظامی', rockets: 'راکت — فروشگاه نظامی', soldiers: 'نیروی انسانی — فروشگاه نظامی', factories: 'تولید درآمد روزانه', mines: 'تولید درآمد روزانه', apc: 'نفربر زرهی — بازار نفربرها', fuel: 'سوخت نظامی' };

/** existing codes whose price/name get UPDATED instead of inserted */
const UPDATED = new Set(['tomahawk','brahmos','df41','su57','f22_raptor','f35_lightning2','c17_globemaster','c130j_super_hercules','gerald_r_ford','nimitz','m1_abrams','leopard_2a7','pzh2000','k9_thunder','patriot','s400','aegis','aster_30','f35_ad','f22_ad','mq9_reaper','bayraktar_tb2','virginia_class','kilo_class','an_tpy2','an_spy6','hydra_70','s8_rocket','infantry','rangers','special_forces','snipers','m113_apc','stryker_icv','steel_plant','aircraft_plant','gold_mine','iron_mine']);

// [code, nameFa, price, incomePerCycle?]
const catalogs = {
  missiles: [
    ['tomahawk','Tomahawk تاماهاوک',8*M],['brahmos','BrahMos برهموس',9*M],['df41','DF-41 دونگ‌فنگ',12*M],
    ['kalibr','Kalibr کالیبر',7*M],['kh101','Kh-101',8_500_000],['jassm_er','AGM-158 JASSM',6*M],['storm_shadow','Storm Shadow',7_500_000],
    ['iskander_m','Iskander-M اسکندر',6_500_000],['iskander_k','Iskander-K',5_500_000],['atacms','MGM-140 ATACMS',4*M],['prsm','PrSM',5*M],
    ['fateh110','فاتح-۱۱۰',2_500_000],['zolfaghar','ذوالفقار',2*M],['khalij_fars','خلیج فارس',3_500_000],['sejjil','سجیل',5*M],['shahab3','شهاب-۳',4_500_000],
    ['noor','نور',3*M],['qader','قادر',4*M],['abu_mahdi','ابومهدی',6*M],['nasr1','نصر-۱',1_200_000],['kosar','کوثر',1_800_000],['lora','LORA',3_500_000],
    ['hyunmoo2','Hyunmoo-2 هیونمو',3*M],['kh59m2','Kh-59M2 Ovod',3_800_000],['yj18','YJ-18 Yingji',8*M],
  ],
  fighters: [
    ['su57','Su-57',12*M],['f22_raptor','F-22 Raptor',13*M],['f35_lightning2','F-35 Lightning II',12*M],
    ['su35s','Su-35S',10*M],['su30mkm','Su-30MKM',9*M],['mig35','MiG-35',7*M],['j20','J-20 Mighty Dragon',12_500_000],['j10c','J-10C',6*M],
    ['jf17','JF-17 Thunder',4*M],['tejas_mk1a','Tejas MK1A',5_500_000],['rafale','Rafale رفال',11*M],['typhoon','Eurofighter Typhoon',11_500_000],
    ['f15ex','F-15EX',11*M],['fa18e','F/A-18E Super Hornet',9*M],['f16v','F-16V Viper',7_500_000],['gripen_e','Gripen E',8*M],['mirage2000_5','Mirage 2000-5',6_500_000],
    ['tornado_gr4','Tornado GR4',5*M],['a10c','A-10C Warthog',4_500_000],['su25tm','Su-25TM',4*M],['fa50','FA-50',3_500_000],['yak130','Yak-130',3*M],
    ['f14','F-14 Tomcat',8*M],['harrier_ii','Harrier II',6*M],['j31','J-31 Gyrfalcon',9_500_000],
  ],
  transport_aircraft: [
    ['c17_globemaster','C-17 Globemaster III',11*M],['c130j_super_hercules','C-130J Super Hercules',8*M],['a400m','A400M Atlas',9*M],['il76','Il-76MD-90A',10*M],['an124','An-124 Ruslan',14*M],
    ['an178','An-178',2_500_000],['an72','An-72',5*M],['an32','An-32',1_500_000],['c295','C-295MW',3*M],['cn235','CN-235',2*M],
    ['kc135','KC-135 Stratotanker',7*M],['kc46','KC-46 Pegasus',9_500_000],['il78','Il-78 Midas',8_500_000],['c27j','C-27J Spartan',4*M],['y20','Y-20 Kunpeng',10*M],['y9','Y-9',6*M],
    ['c2_kawasaki','Kawasaki C-2',6_500_000],['kc390','KC-390 Millennium',7_500_000],['c160','C-160 Transall',3*M],['atr72mp','ATR 72 MP',1_500_000],
    ['kingair350','Beechcraft King Air 350ER',1*M],['falcon900lx','Falcon 900LX',4*M],['p8','P-8 Poseidon',12*M],['e2','E-2 Hawkeye',11*M],['a100','A-100 Premier',13*M],
  ],
  ships: [
    ['gerald_r_ford','Gerald R. Ford',25*M],['nimitz','Nimitz-class',24*M],['arleigh_burke','Arleigh Burke-class',18*M],['type055','Type 055 Renhai',20*M],['zumwalt','Zumwalt-class',19*M],
    ['ticonderoga','Ticonderoga-class',14*M],['type052d','Type 052D',15*M],['type45','Type 45 Daring',13*M],['horizon','Horizon-class',11*M],['fremm','FREMM',10*M],
    ['hyuga','Hyuga-class',16*M],['type071','Type 071',16_500_000],['mistral','Mistral LHD',17*M],['cavour','Cavour',22*M],['wasp','Wasp-class LHD',21*M],
    ['galicia','Galicia-class LPD',15*M],['perry','Oliver Hazard Perry',6*M],['lafayette','La Fayette',7*M],['brandenburg','Brandenburg-class',8*M],['iver_huitfeldt','Iver Huitfeldt',8_500_000],
    ['istif','İstif-class',5*M],['damavand','Damavand-class دماوند',4*M],['moudge','Moudge-class موج',3*M],['alborz','Alborz البرز',3_500_000],['makran','Makran (پایگاه شناور)',2_500_000],
  ],
  tanks: [
    ['m1_abrams','M1A2 Abrams',6*M],['leopard_2a7','Leopard 2A7',6_500_000],['challenger2','Challenger 2',6*M],['t14_armata','T-14 Armata',7*M],['t90ms','T-90MS',5*M],
    ['merkava_mk4','Merkava Mk.4',5_500_000],['leclerc','Leclerc',6_200_000],['type99a','Type 99A',6*M],['k2_black_panther','K2 Black Panther',6_500_000],['altay','Altay',6*M],
    ['ariete_c1','Ariete C1',4_500_000],['namer','Namer نمر',5*M],['centauro2','Centauro II',3_800_000],['zulfiqar3','ذوالفقار ۳',2_500_000],['karrar','کرار',3*M],
    ['safir74','سفیر-۷۴',1_800_000],['t72b3','T-72B3',3_500_000],['t64bv','T-64BV',2*M],['type96','Type 96',3*M],['arjun_mk1a','Arjun Mk.1A',3_200_000],
    ['pt91','PT-91 Twardy',2_500_000],['leopard_2a4','Leopard 2A4',4*M],['m60a3','M60A3',1_200_000],['chieftain','Chieftain',1_500_000],['type74','Type 74',2_800_000],
  ],
  artillery: [
    ['pzh2000','PzH 2000',5*M],['k9_thunder','K9 Thunder',4_500_000],['m109a7','M109A7 Paladin',4*M],['caesar','CAESAR',3_500_000],['archer','Archer FH77BW L52',4_200_000],
    ['m777a2','M777A2',2*M],['msta_s','2S19 Msta-S',3*M],['akatsiya','2S3 Akatsiya',1_500_000],['type05_sph','Type 05 SPH',4*M],['pcl181','PCL-181',2_800_000],
    ['dana','Dana vz.77',2_200_000],['atags','ATAGS',3_800_000],['msta_b','Msta-B',1*M],['d30','D-30 ۱۲۲mm',300_000],['d20','D-20 ۱۵۲mm',250_000],
    ['m46','M46 ۱۳۰mm',200_000],['podnos','2B14 Podnos',120_000],['nona_k','2B16 NONA-K',180_000],['trf1','Obusier 155 TRF1',1_500_000],['m198','M198 howitzer',450_000],
    ['m109a5','M109A5',2_800_000],['g5','G5 ۱۵۵mm',1_800_000],['g6','G6 Rhino',2_500_000],['koksan','M-1978 Koksan',1_500_000],['type83','Type 83 ۱۵۲mm',350_000],
  ],
  ground_air_defense: [
    ['s400','S-400',10*M],['patriot','Patriot PAC-3',8*M],['s300pmu2','S-300PMU2',7*M],['samp_t','SAMP/T (Mamba)',6_500_000],['barak8mx','Barak-8MX',7_500_000],
    ['iron_dome','Iron Dome',6_500_000],['davids_sling',"David's Sling",7*M],['arrow3','Arrow-3',12*M],['hq22','HQ-22',6*M],['buk_m3','Buk-M3',5*M],
    ['pantsir_s1','Pantsir-S1',4_500_000],['tor_m2','Tor-M2',4*M],['bavar373','باور-۳۷۳',5_500_000],['khordad15','خرداد-۱۵',3*M],['khordad3','خرداد-۳',2_500_000],
    ['mersad','مرصاد',1_500_000],['raad','رعد',1*M],['s125_pechora','S-125 Pechora-2M',2*M],['hq7b','HQ-7B',2_200_000],['crotale_ng','Crotale NG',4_500_000],
    ['nasams','NASAMS',5*M],['iris_t_slm','IRIS-T SLM',6*M],['spyder_mr','Spyder-MR',4*M],['mistral_sp','Mistral SP',3*M],['s500','S-500 Prometey',14*M],
  ],
  naval_air_defense: [
    ['aegis','Aegis (SM-2/SM-6)',6*M],['aster_30','Aster 30',5_500_000],['sea_sparrow','Sea Sparrow',2*M],['essm','ESSM',2_800_000],['phalanx','Phalanx CIWS',2_500_000],
    ['ram','RAM',1_500_000],['goalkeeper','Goalkeeper',2_500_000],['barak8_sea','Barak-8 (naval)',5*M],['mica_vl','Mica VL',3*M],['shtil1','Shtil-1',4*M],
    ['tor_naval','Tor-M2KM (naval)',3*M],['pantsir_me','Pantsir-ME',4_500_000],['sea_wolf','Sea Wolf',2*M],['sea_cat','Sea Cat',800_000],['type730','Type 730 CIWS',2_200_000],
    ['type1130','Type 1130 CIWS',2_500_000],['hhq16','HHQ-16',3_500_000],['rif_m','Rif-M (S-300F)',7*M],['crotale_naval','Crotale naval',3_500_000],['sea_ceptor','Sea Ceptor',3_200_000],
    ['camm','CAMM',3_500_000],['buk_naval','Buk-M3 (naval)',4_800_000],['nulka','Nulka',1*M],['m317_naval','9M317 (naval)',4_200_000],['kmsam_naval','KM-SAM (naval)',3_800_000],
  ],
  air_air_defense: [
    ['f22_ad','F-22 (پدافند هوایی)',13*M],['f35_ad','F-35 (پدافند هوایی)',12*M],['su57_ad','Su-57 (پدافند هوایی)',13*M],['su35_ad','Su-35S (پدافند هوایی)',10*M],['mig31bm','MiG-31BM',9*M],
    ['j20_ad','J-20 (پدافند هوایی)',12_500_000],['typhoon_ad','Typhoon (پدافند هوایی)',11_500_000],['rafale_ad','Rafale (پدافند هوایی)',11_500_000],['su30sm','Su-30SM',9_500_000],['f15c','F-15C Eagle',8_500_000],
    ['fa18_ad','F/A-18 (پدافند هوایی)',9*M],['f16am','F-16AM (پدافند هوایی)',6_500_000],['gripen_c','Gripen C',7*M],['mirage_ad','Mirage 2000-5 (پدافند هوایی)',6_500_000],['j10c_ad','J-10C (پدافند هوایی)',6_500_000],
    ['jf17_ad','JF-17 (پدافند هوایی)',4*M],['tejas_ad','Tejas (پدافند هوایی)',5_500_000],['a50','A-50 AEW&C',14*M],['su27sk','Su-27SK',7*M],['av8b','AV-8B Harrier II',7_500_000],
    ['harrier_gr9','Harrier GR9',6*M],['fa50_ad','FA-50 (پدافند هوایی)',3_500_000],['yak130_ad','Yak-130 (پدافند هوایی)',3*M],['karrar_ad','کرار (پدافند هوایی)',1_500_000],['dornier228','Dornier Do 228',2_500_000],
  ],
  drones: [
    ['mq9_reaper','MQ-9 Reaper',8*M],['rq4','RQ-4 Global Hawk',15*M],['mq25','MQ-25 Stingray',12*M],['skyguardian','SkyGuardian',9*M],['x47b','X-47B',10*M],
    ['akinci','Akıncı (Bayraktar)',6*M],['aksungur','Aksungur',5*M],['heron_tp','Heron TP',5*M],['bayraktar_tb2','Bayraktar TB2',3*M],['anka','Anka',3*M],
    ['forpost','Forpost',1_000_000],['orion','Orion',4*M],['altius_m','Altius-M',3*M],['eitan','Eitan',5_500_000],['hermes900','Hermes 900',4_500_000],
    ['predator_xp','Predator XP',2_500_000],['shahed129','شاهد-۱۲۹',2*M],['shahed136','شاهد-۱۳۶',500_000],['shahed191','شاهد-۱۹۱',1_500_000],['harop','Harop',1_500_000],
    ['forpost_r','Forpost-R',1_200_000],['ababil5','ابابیل-۵',800_000],['ababil3','ابابیل-۳',100_000],['scaneagle','ScanEagle',300_000],['geran2','Geran-2',400_000],
  ],
  submarines: [
    ['virginia_class','Virginia-class',16*M],['seawolf','Seawolf-class',14*M],['yasen_m','Yasen-M (K-561)',15*M],['astute','Astute-class',14*M],['soryu','Sōryū',13*M],
    ['taigei','Taigei',13_500_000],['type212a','Type 212A',12*M],['barracuda','Barracuda',11*M],['dolphin','Dolphin-class',10*M],['collins','Collins-class',9*M],
    ['type214','Type 214',8*M],['kilo_class','Kilo-class',5*M],['varshavyanka','636.3 Varshavyanka',7*M],['yuan039a','Type 039A Yuan',6_500_000],['yuan039b','Type 039B Yuan II',7_500_000],
    ['ula','Ula-class',6*M],['walrus','Walrus',4_500_000],['sindhughosh','Sindhughosh (Kilo India)',4*M],['vastergotland','Västergötland',3*M],['fateh_sub','فاتح (زیردsریایی)',2*M],
    ['tareq_sub','طارق (زیردریایی)',2_500_000],['qaem_sub','قائم (مینی)',1_500_000],['type206','Type 206',1_200_000],['ghadir','غدیر',800_000],['type207_midget','Type 207 (مینی)',900_000],
  ],
  radars: [
    ['an_spy6','AN/SPY-6',10*M],['an_tpy2','AN/TPY-2',9*M],['gm400','Ground Master 400',9*M],['gm200','Ground Master 200',6*M],['elm2084','ELM-2084',12*M],
    ['elm2080','ELM-2080 Green Pine',10*M],['96l6','96L6 Cheese Board',4*M],['91n6','91N6 Grill Pan',10*M],['rezonans_ne','Rezonans-NE',9*M],['nebo_m','Nebo-M',13*M],
    ['tps77','Skymaster TPS-77',7*M],['tps43','AN/TPS-43',8*M],['fps117','AN/FPS-117',12*M],['sentinel','AN/MPQ-64 Sentinel',5*M],['jy29','JY-29',11*M],
    ['jyl1','JYL-1',5*M],['ylc120b','YLC-120B',10*M],['kasta2e2','Kasta 2E2',2*M],['podlet','48Ya6 Podlet',2_500_000],['avtobaza','1L222 Avtobaza',6*M],
    ['prw13','PRW-13',1*M],['casta2e1','Casta 2E1',1_500_000],['ad200','AD-200',4*M],['jy27a','JY-27A',12*M],['smart_n','SMART-N',7*M],
  ],
  rockets: [
    ['hydra_70','Hydra 70',150_000],['s8_rocket','S-8 Rocket',120_000],['bm21','BM-21 Grad',200_000],['grad_k','Grad-K 122mm',250_000],['smerch','BM-30 Smerch 300mm',2*M],
    ['tornado_s','Tornado-S 9M544',2_500_000],['gmlrs','GMLRS',1*M],['er_gmlrs','ER GMLRS',1_500_000],['orkan','M-87 Orkan',1_200_000],['ar3','AR-3',1_800_000],
    ['ws1','WS-1',1_500_000],['ws1b','WS-1B',2*M],['sakr24','صقر-۲۴',200_000],['sakr30','صقر-۳۰',350_000],['fajr3','فجر-۳',500_000],
    ['fajr5','فجر-۵',800_000],['zilzal2','زلزال-۲',400_000],['tondar69','تندر-۶۹',350_000],['nazeat6','نازعات-۶',600_000],['nazeat10','نازعات-۱۰',900_000],
    ['falaq2','فلاق-۲',120_000],['oghab','عقاب',300_000],['raad330','رعد-۳۳۰',1*M],['bureviy','Bureviy ۲۲۰mm',900_000],['kassam','قسام',10_000],
  ],
  soldiers: [
    ['infantry','سرباز پیاده',200_000],['border_guard','مرزبان',210_000],['signals','مخابراتی',220_000],['combat_medic','امدادگر رزمی',230_000],['pasdar','پاسدار',250_000],
    ['rifleman','تفنگدار',250_000],['artilleryman','توپخانه‌چی',280_000],['armored_infantry','پیاده‌نظام زرهی',300_000],['naval_rifleman','تفنگدار دریایی',300_000],['combat_engineer','مهندس رزمی',320_000],
    ['commando','کماندو',350_000],['anti_air','ضدهوایی‌چی',350_000],['mountain_infantry','کوهنورد رزمی',380_000],['rangers','تکاور',400_000],['snipers','تک‌تیرانداز',450_000],
    ['combat_diver','غواص رزمی',480_000],['tank_hunter','شکارچی تانک',500_000],['senior_sniper','تک‌تیرانداز ارشد',520_000],['paratrooper','چترباز',550_000],['naval_commando','تکاور دریایی',580_000],
    ['counter_terror','نیروهای ضدتروریسم',620_000],['rapid_reaction','نیروهای واکنش سریع',650_000],['platoon_commander','فرمانده دسته',680_000],['special_forces','نیروهای ویژه',700_000],['special_guard','گارد ویژه',700_000],
  ],
  factories: [
    ['steel_plant','کارخانه فولاد',5*M,3*M],['car_factory','کارخانه خودروسازی',7*M,4*M],['cement_factory','کارخانه سیمان',3*M,2*M],['glass_factory','کارخانه شیشه‌سازی',2_500_000,1_500_000],['plastic_factory','کارخانه پلاستیک',2*M,1*M],
    ['textile_factory','کارخانه نساجی',2*M,1*M],['paper_factory','کارخانه کاغذسازی',2_500_000,1_500_000],['pharma_factory','کارخانه داروسازی',5*M,3*M],['food_factory','کارخانه مواد غذایی',3*M,2*M],['appliance_factory','کارخانه لوازم خانگی',4*M,2_500_000],
    ['parts_factory','کارخانه قطعه‌سازی',3_500_000,2*M],['electronics_factory','کارخانه الکترونیک',5*M,3*M],['battery_factory','کارخانه باتری‌سازی',4*M,2_500_000],['shipyard_factory','کارخانه کشتی‌سازی',8*M,5*M],['aircraft_plant','کارخانه هواپیماسازی',10*M,6*M],
    ['machinery_factory','کارخانه ماشین‌آلات',5*M,3*M],['fertilizer_factory','کارخانه کود شیمیایی',3*M,2*M],['paint_factory','کارخانه رنگ‌سازی',2*M,1*M],['rubber_factory','کارخانه لاستیک‌سازی',3*M,2*M],['brick_factory','کارخانه آجرسازی',1_500_000,800_000],
    ['stainless_factory','کارخانه فولاد ضدزنگ',6*M,3_500_000],['medical_devices_factory','کارخانه تجهیزات پزشکی',4*M,2_500_000],['recycling_factory','کارخانه بازیافت',2*M,1*M],['solar_factory','کارخانه پنل خورشیدی',4*M,2_500_000],['rail_factory','کارخانه قطار و واگن',7*M,4*M],
  ],
  mines: [
    ['gold_mine','معدن طلا',5*M,3*M],['silver_mine','معدن نقره',3*M,2*M],['iron_mine','معدن آهن',2*M,1*M],['copper_mine','معدن مس',2_500_000,1_500_000],['diamond_mine','معدن الماس',7*M,4*M],
    ['coal_mine','معدن زغال‌سنگ',1_500_000,800_000],['lead_mine','معدن سرب',1_500_000,800_000],['uranium_mine','معدن اورانیوم',6*M,3_500_000],['nickel_mine','معدن نیکل',3*M,2*M],['zinc_mine','معدن روی',2*M,1*M],
    ['lithium_mine','معدن لیتیوم',4*M,2_500_000],['cobalt_mine','معدن کبالت',3_500_000,2*M],['manganese_mine','معدن منگنز',2*M,1*M],['chromite_mine','معدن کرومیت',2_500_000,1_500_000],['tin_mine','معدن قلع',2_500_000,1_500_000],
    ['bauxite_mine','معدن بوکسیت',2*M,1*M],['platinum_mine','معدن پلاتین',5*M,3_500_000],['titanium_mine','معدن تیتانیوم',4*M,2_500_000],['sulfur_mine','معدن گوگرد',1_500_000,800_000],['phosphate_mine','معدن فسفات',1_500_000,800_000],
    ['gypsum_mine','معدن گچ',1*M,500_000],['salt_mine','معدن نمک',1*M,500_000],['marble_mine','معدن مرمر',3*M,2*M],['limestone_mine','معدن سنگ‌آهک',1_500_000,800_000],['turquoise_mine','معدن فیروزه',3_500_000,2*M],
  ],
  apc: [
    ['m113_apc','M113 APC',1_500_000],['stryker_icv','Stryker ICV',2_500_000],['btr80','BTR-80',2*M],['boxer_apc','Boxer APC',2_500_000],['btr4','BTR-4',2*M],
    ['btr82a','BTR-82A',2*M],['piranha_v','Piranha V',2_500_000],['patria_amv','Patria AMV',2_500_000],['vbci','VBCI',2_500_000],['vab_apc','VAB APC',1_500_000],
    ['terrex','Terrex',2*M],['pandur_ii','Pandur II',2*M],['zbl09','ZBL-09',2_500_000],['type96_apc','Type 96 APC',2*M],['kto_rosomak','KTO Rosomak',2*M],
    ['vn1','VN-1',2*M],['aav7','AAV7',2_500_000],['bvs10','BvS 10',2*M],['arma_8x8','Arma 8x8',2*M],['acv15','ACV-15',2*M],
    ['otokar_cobra_ii','Otokar Cobra II',1_500_000],['ejder_yalcin','Ejder Yalçın',1_500_000],['rg33','RG-33',2*M],['titus','TITUS',2_500_000],['bushmaster_pmv','Bushmaster PMV',2*M],
  ],
  fuel: [
    ['jp8','سوخت جت (JP-8)',150_000],['diesel_mil','دیزل نظامی',110_000],['avgas','بنزین هوایی',140_000],['udmh','سوخت موشکی (UDMH)',300_000],
    ['armored_diesel','گازوئیل زرهی',90_000],['atf','سوخت ATF',160_000],['kerosene','نفت سفید',70_000],['heavy_oil','نفت سنگین',80_000],
  ],
};

const lines = [];
lines.push('-- کاتالوگ بازار — بعد از seed.sql اجرا شود (db:seed:*); تکرار اجرا امن (idempotent)');
lines.push("INSERT OR IGNORE INTO equipment_categories (id, key, label_fa, shop_label_fa, emoji, role, power_weight, sort_order, is_active) VALUES (19, 'fuel', 'سوخت نظامی', 'خرید سوخت نظامی', '⛽', 'support', 0, 19, 1);");
lines.push('');

const esc = (s) => s.replace(/'/g, "''");
let updated = 0, inserted = 0;
for (const [key, items] of Object.entries(catalogs)) {
  if (items.length !== 25 && key !== 'fuel') throw new Error(`${key}: ${items.length} items, expected 25`);
  const cid = catId[key];
  lines.push(`-- ═══════════ ${key} (${catId[key]}) ═══════════`);
  const codes = new Set();
  for (const [code, nameFa, price, income] of items) {
    if (codes.has(code)) throw new Error(`dup code ${code} in ${key}`);
    codes.add(code);
    const inc = income === undefined ? 'NULL' : String(income);
    if (UPDATED.has(code)) {
      lines.push(`UPDATE equipment_templates SET name_fa='${esc(nameFa)}', price=${price}, income_per_cycle=${inc}, is_for_sale=1, is_active=1, unit_fa='${unit[key]}', description='${esc(desc[key])}' WHERE code='${code}';`);
      updated++;
    } else {
      lines.push(`INSERT OR IGNORE INTO equipment_templates (category_id, code, name_fa, unit_fa, price, income_per_cycle, attack_points, defense_points, description, is_active, is_for_sale) VALUES (${cid}, '${code}', '${esc(nameFa)}', '${unit[key]}', ${price}, ${inc}, NULL, NULL, '${esc(desc[key])}', 1, 1);`);
      inserted++;
    }
  }
  lines.push('');
}
// helicopters: hide from shop (outside the user's 14-market scope)
lines.push("UPDATE equipment_templates SET is_for_sale=0 WHERE category_id=9;");
writeFileSync(OUT, lines.join('\n') + '\n');
console.log(`written ${OUT}: ${updated} updated, ${inserted} inserted`);
