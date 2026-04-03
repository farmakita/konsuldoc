import { Courier } from '../../shared/types';

export const COURIERS: Courier[] = [
  { id: 'jne_reg',      group: 'regular',  name: 'JNE REG',        badge: 'JNE',  price: 15000, est_id: '2\u20133 hari',  est_en: '2\u20133 days' },
  { id: 'jnt_reg',      group: 'regular',  name: 'J&T Express',    badge: 'J&T',  price: 13000, est_id: '2\u20134 hari',  est_en: '2\u20134 days' },
  { id: 'sicepat_reg',  group: 'regular',  name: 'SiCepat REG',    badge: 'SC',   price: 14000, est_id: '2\u20133 hari',  est_en: '2\u20133 days' },
  { id: 'pos',          group: 'regular',  name: 'Pos Indonesia',  badge: 'POS',  price: 10000, est_id: '3\u20135 hari',  est_en: '3\u20135 days' },
  { id: 'jne_yes',      group: 'express',  name: 'JNE YES',        badge: 'JNE',  price: 35000, est_id: '1 hari',    est_en: '1 day' },
  { id: 'sicepat_best', group: 'express',  name: 'SiCepat BEST',   badge: 'SC',   price: 32000, est_id: '1 hari',    est_en: '1 day' },
  { id: 'jnt_same',     group: 'express',  name: 'J&T Same Day',   badge: 'J&T',  price: 45000, est_id: 'Hari ini',  est_en: 'Today' },
  { id: 'gosend',       group: 'instant',  name: 'GoSend Instant', badge: '\uD83D\uDFE2',   price: 25000, est_id: '1\u20132 jam',   est_en: '1\u20132 hours' },
  { id: 'grab',         group: 'instant',  name: 'Grab Express',   badge: '\uD83D\uDFE2',   price: 27000, est_id: '1\u20132 jam',   est_en: '1\u20132 hours' },
  { id: 'shopee_inst',  group: 'instant',  name: 'ShopeeExpress',  badge: '\uD83D\uDFE0',   price: 20000, est_id: '2\u20133 jam',   est_en: '2\u20133 hours' },
  { id: 'pickup',       group: 'pickup',   name: 'Ambil Sendiri',  badge: '\uD83C\uDFEA',   price: 0,     est_id: 'Di Apotek', est_en: 'In-store' },
];
