import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, CartItem, Courier, Lang } from '../../shared/types';

interface AppState {
  // Language
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;

  // Patient
  patient: { age: string; weight: string; allergies: string[] };
  setPatient: (patient: { age: string; weight: string; allergies: string[] }) => void;

  // Symptoms
  symptoms: string[];
  toggleSymptom: (id: string) => void;
  customSymptoms: string;
  setCustomSymptoms: (text: string) => void;

  // Recommendations
  recommendations: Medication[];
  setRecommendations: (meds: Medication[]) => void;

  // Cart
  cart: CartItem[];
  addToCart: (med: Medication) => void;
  removeFromCart: (medId: string) => void;
  updateQuantity: (medId: string, delta: number) => void;
  cartTotal: () => number;
  cartItemCount: () => number;

  // Payment
  selectedPayment: string | null;
  setSelectedPayment: (method: string | null) => void;
  paymentSubData: Record<string, string>;
  setPaymentSubData: (key: string, value: string) => void;

  // Delivery
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
  selectedDelivery: Courier | null;
  setSelectedDelivery: (courier: Courier | null) => void;
  deliveryLat: number | null;
  deliveryLng: number | null;
  setDeliveryLocation: (lat: number, lng: number) => void;

  // Order
  orderNumber: string | null;
  orderTime: Date | null;
  setOrder: (orderNumber: string, orderTime: Date) => void;

  // Profile persistence
  profileLoadedFromStorage: boolean;
  setProfileLoaded: (loaded: boolean) => void;

  // Reset (keeps lang and patient)
  resetOrder: () => void;
}

const initialOrderState = {
  symptoms: [] as string[],
  customSymptoms: '',
  recommendations: [] as Medication[],
  cart: [] as CartItem[],
  selectedPayment: null as string | null,
  paymentSubData: {} as Record<string, string>,
  deliveryAddress: '',
  selectedDelivery: null as Courier | null,
  deliveryLat: null as number | null,
  deliveryLng: null as number | null,
  orderNumber: null as string | null,
  orderTime: null as Date | null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Language
      lang: 'id' as Lang,
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'id' ? 'en' : 'id' })),

      // Patient
      patient: { age: '', weight: '', allergies: [] },
      setPatient: (patient) => set({ patient }),

      // Symptoms
      symptoms: [],
      toggleSymptom: (id) =>
        set((state) => ({
          symptoms: state.symptoms.includes(id)
            ? state.symptoms.filter((s) => s !== id)
            : [...state.symptoms, id],
        })),
      customSymptoms: '',
      setCustomSymptoms: (text) => set({ customSymptoms: text }),

      // Recommendations
      recommendations: [],
      setRecommendations: (meds) => set({ recommendations: meds }),

      // Cart
      cart: [],
      addToCart: (med) =>
        set((state) => {
          const existing = state.cart.find((item) => item.medication.id === med.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.medication.id === med.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { medication: med, quantity: 1 }] };
        }),
      removeFromCart: (medId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.medication.id !== medId),
        })),
      updateQuantity: (medId, delta) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.medication.id === medId
                ? { ...item, quantity: item.quantity + delta }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),
      cartTotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.medication.price * item.quantity, 0);
      },
      cartItemCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Payment
      selectedPayment: null,
      setSelectedPayment: (method) => set({ selectedPayment: method }),
      paymentSubData: {},
      setPaymentSubData: (key, value) =>
        set((state) => ({
          paymentSubData: { ...state.paymentSubData, [key]: value },
        })),

      // Delivery
      deliveryAddress: '',
      setDeliveryAddress: (addr) => set({ deliveryAddress: addr }),
      selectedDelivery: null,
      setSelectedDelivery: (courier) => set({ selectedDelivery: courier }),
      deliveryLat: null,
      deliveryLng: null,
      setDeliveryLocation: (lat, lng) => set({ deliveryLat: lat, deliveryLng: lng }),

      // Order
      orderNumber: null,
      orderTime: null,
      setOrder: (orderNumber, orderTime) => set({ orderNumber, orderTime }),

      // Profile persistence
      profileLoadedFromStorage: false,
      setProfileLoaded: (loaded) => set({ profileLoadedFromStorage: loaded }),

      // Reset
      resetOrder: () => set(initialOrderState),
    }),
    {
      name: 'konsuldoc-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lang: state.lang,
        patient: state.patient,
      }),
    }
  )
);
