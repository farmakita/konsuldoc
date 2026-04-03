import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { ProgressBar } from '../components/ProgressBar';
import { BottomBar } from '../components/BottomBar';

function fmt(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, cart, updateQuantity, removeFromCart } = useAppStore();
  const cartTotal = useAppStore(s => s.cartTotal());

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="bg-white">
        <ProgressBar currentStep={3} lang={lang} />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-xl font-bold text-slate-800 mt-4 mb-4">{t(lang, 'cartTitle')}</Text>

        {cart.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-6xl mb-4">🛒</Text>
            <Text className="text-lg font-semibold text-slate-600 mb-2">{t(lang, 'emptyCart')}</Text>
            <Text className="text-sm text-slate-400 mb-6">{t(lang, 'emptyCartSub')}</Text>
            <Pressable
              onPress={() => router.back()}
              className="border border-teal-600 rounded-xl py-3 px-6"
            >
              <Text className="text-teal-700 font-bold">{t(lang, 'backToRec')}</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {cart.map(item => (
              <View key={item.medication.id} className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-start">
                  <Text className="text-2xl mr-3">{item.medication.emoji}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-slate-800">{item.medication.brand}</Text>
                    <Text className="text-sm text-teal-700 font-semibold mt-1">{fmt(item.medication.price)}</Text>
                  </View>
                  <Pressable onPress={() => removeFromCart(item.medication.id)}>
                    <Text className="text-red-400 text-sm font-semibold">{t(lang, 'remove')}</Text>
                  </Pressable>
                </View>

                <View className="flex-row items-center justify-end mt-3">
                  <Pressable
                    onPress={() => updateQuantity(item.medication.id, -1)}
                    className="w-9 h-9 rounded-lg bg-slate-100 items-center justify-center"
                  >
                    <Text className="text-lg font-bold text-slate-600">−</Text>
                  </Pressable>
                  <Text className="mx-4 text-base font-bold text-slate-800">{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.medication.id, 1)}
                    className="w-9 h-9 rounded-lg bg-teal-100 items-center justify-center"
                  >
                    <Text className="text-lg font-bold text-teal-700">+</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Price summary */}
            <View className="bg-white border border-slate-100 rounded-2xl p-4 mt-2">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-slate-500">{t(lang, 'subtotal')}</Text>
                <Text className="text-sm font-semibold text-slate-800">{fmt(cartTotal)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-slate-500">{t(lang, 'shippingEst')}</Text>
                <Text className="text-sm text-slate-400">—</Text>
              </View>
              <View className="h-px bg-slate-100 my-2" />
              <View className="flex-row justify-between">
                <Text className="text-base font-bold text-slate-800">{t(lang, 'total')}</Text>
                <Text className="text-base font-bold text-teal-700">{fmt(cartTotal)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {cart.length > 0 && (
        <BottomBar>
          <Pressable
            onPress={() => router.push('/delivery')}
            className="bg-teal-600 rounded-xl py-3.5 items-center"
          >
            <Text className="text-white font-bold text-base">{t(lang, 'checkoutBtn')}</Text>
          </Pressable>
        </BottomBar>
      )}
    </View>
  );
}
