export interface Symptom {
  id: string;
  emoji: string;
  id_label: string;
  en_label: string;
}

export interface Allergy {
  id: string;
  id_label: string;
  en_label: string;
}

export type DrugCategory = 'bebas' | 'bebas_terbatas' | 'herbal' | 'keras';
export type AgeGroup = 'infant' | 'child' | 'adult';
export type Lang = 'id' | 'en';

export interface Medication {
  id: string;
  symptoms: string[];
  ageGroups: AgeGroup[];
  brand: string;
  generic_id: string;
  generic_en: string;
  form_id: string;
  form_en: string;
  emoji: string;
  category: DrugCategory;
  dosage_id: string;
  dosage_en: string;
  warning_id: string;
  warning_en: string;
  price: number;
  allergies: string[];
  isConsult?: boolean;
  matchedSymptom?: string;
}

export interface CartItem {
  medication: Medication;
  quantity: number;
}

export type CourierGroup = 'regular' | 'express' | 'instant' | 'pickup';

export interface Courier {
  id: string;
  group: CourierGroup;
  name: string;
  badge: string;
  price: number;
  est_id: string;
  est_en: string;
}

export interface Patient {
  age: string;
  weight: string;
  allergies: string[];
}

export interface OrderItem {
  medicationId: string;
  brand: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  deviceId: string;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryLat: number | null;
  deliveryLng: number | null;
  courierId: string;
  courierPrice: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Profile {
  deviceId: string;
  ageYears: number;
  weightKg: number;
  allergies: string[];
  lang: Lang;
}
