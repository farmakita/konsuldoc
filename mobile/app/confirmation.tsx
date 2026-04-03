import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';

function fmt(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function getEstimatedArrival(group: string | undefined): string {
  const now = new Date();
  if (group === 'instant') {
    return now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (group === 'express') {
    now.setDate(now.getDate() + 1);
    return now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  // regular or pickup
  now.setDate(now.getDate() + 3);
  return now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, orderNumber, cart, selectedPayment, selectedDelivery, resetOrder } = useAppStore();
  const cartTotal = useAppStore(s => s.cartTotal());
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: 300,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const shippingCost = selectedDelivery?.price ?? 0;
  const grandTotal = cartTotal + shippingCost;
  const estimatedArrival = getEstimatedArrival(selectedDelivery?.group);

  const paymentLabels: Record<string, string> = {
    credit: 'Credit Card', debit: 'Debit Card',
    gopay: 'GoPay', ovo: 'OVO', dana: 'DANA', linkaja: 'LinkAja',
    qris: 'QRIS', bca: 'BCA Virtual Account', bni: 'BNI Virtual Account', bri: 'BRI Virtual Account',
  };

  const handleTrack = () => {
    Alert.alert('', t(lang, 'trackMsg'));
  };

  const handleHome = () => {
    resetOrder();
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        {/* Animated checkmark */}
        <View className="items-center mt-8 mb-6">
          <Animated.View
            className="w-24 h-24 rounded-full bg-green-500 items-center justify-center"
            style={{ transform: [{ scale: scaleAnim }] }}
          >
            <Text className="text-5xl text-white">✓</Text>
          </Animated.View>
        </View>

        <Text className="text-2xl font-bold text-slate-800 text-center mb-1">{t(lang, 'confTitle')}</Text>
        <Text className="text-base text-slate-500 text-center mb-6">{t(lang, 'confSub')}</Text>

        {/* Order number */}
        <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-3">
          <Text className="text-sm text-slate-500 mb-1">{t(lang, 'orderNum')}</Text>
          <Text className="text-lg font-bold text-teal-700">{orderNumber}</Text>
        </View>

        {/* Estimated arrival */}
        <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-3">
          <Text className="text-sm text-slate-500 mb-1">{t(lang, 'estimatedDel')}</Text>
          <Text className="text-base font-semibold text-slate-800">{estimatedArrival}</Text>
        </View>

        {/* Order items */}
        <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-3">
          <Text className="text-sm font-semibold text-slate-700 mb-2">{t(lang, 'orderItems')}</Text>
          {cart.map(item => (
            <View key={item.medication.id} className="flex-row justify-between mb-1">
              <Text className="text-sm text-slate-600">{item.medication.emoji} {item.medication.brand} x{item.quantity}</Text>
              <Text className="text-sm font-semibold text-slate-800">{fmt(item.medication.price * item.quantity)}</Text>
            </View>
          ))}
          <View className="h-px bg-slate-100 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-base font-bold text-slate-800">{t(lang, 'total')}</Text>
            <Text className="text-base font-bold text-teal-700">{fmt(grandTotal)}</Text>
          </View>
        </View>

        {/* Payment & courier */}
        <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-6">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-slate-500">{t(lang, 'payMethod')}</Text>
            <Text className="text-sm font-semibold text-slate-800">{paymentLabels[selectedPayment || ''] || selectedPayment}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-slate-500">{t(lang, 'delivMethod')}</Text>
            <Text className="text-sm font-semibold text-slate-800">{selectedDelivery?.name || '—'}</Text>
          </View>
        </View>

        {/* Buttons */}
        <Pressable onPress={handleTrack} className="bg-teal-600 rounded-xl py-3.5 items-center mb-3">
          <Text className="text-white font-bold text-base">{t(lang, 'trackBtn')}</Text>
        </Pressable>

        <Pressable onPress={handleHome} className="border border-teal-600 rounded-xl py-3.5 items-center">
          <Text className="text-teal-700 font-bold text-base">{t(lang, 'homeBtn')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
