import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { ProgressBar } from '../components/ProgressBar';
import { BottomBar } from '../components/BottomBar';

function fmt(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

const PAYMENT_GROUPS = [
  {
    key: 'card',
    labelKey: 'groupCard',
    icon: '💳',
    methods: [
      { id: 'credit', labelKey: 'payCredit' },
      { id: 'debit', labelKey: 'payDebit' },
    ],
  },
  {
    key: 'ewallet',
    labelKey: 'groupEwallet',
    icon: '📱',
    methods: [
      { id: 'gopay', labelKey: 'payGopay' },
      { id: 'ovo', labelKey: 'payOvo' },
      { id: 'dana', labelKey: 'payDana' },
      { id: 'linkaja', labelKey: 'payLinkaja' },
    ],
  },
  {
    key: 'qris',
    labelKey: 'groupQRIS',
    icon: '📷',
    methods: [
      { id: 'qris', labelKey: 'payQRIS' },
    ],
  },
  {
    key: 'bank',
    labelKey: 'groupBank',
    icon: '🏦',
    methods: [
      { id: 'bca', labelKey: 'payBca' },
      { id: 'bni', labelKey: 'payBni' },
      { id: 'bri', labelKey: 'payBri' },
    ],
  },
];

const VA_NUMBERS: Record<string, string> = {
  bca: '8801 0812 3456 7890',
  bni: '8802 0812 3456 7890',
  bri: '8803 0812 3456 7890',
};

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, cart, selectedPayment, setSelectedPayment, paymentSubData, setPaymentSubData, selectedDelivery, setOrder } = useAppStore();
  const cartTotal = useAppStore(s => s.cartTotal());
  const [showSummary, setShowSummary] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const shippingCost = selectedDelivery?.price ?? 0;
  const grandTotal = cartTotal + shippingCost;

  const getGroupForMethod = (methodId: string): string | null => {
    for (const g of PAYMENT_GROUPS) {
      if (g.methods.some(m => m.id === methodId)) return g.key;
    }
    return null;
  };

  const handlePay = () => {
    if (!selectedPayment) {
      Alert.alert('', t(lang, 'selectPayFirst'));
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const orderNum = 'APK-' + Array.from({ length: 8 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('');
      setOrder(orderNum, new Date());
      router.replace('/confirmation');
    }, 1500);
  };

  const renderSubForm = () => {
    if (!selectedPayment) return null;
    const group = getGroupForMethod(selectedPayment);

    if (group === 'card') {
      return (
        <View className="bg-slate-50 rounded-xl p-4 mt-2">
          <TextInput placeholder={t(lang, 'cardNumber')} keyboardType="numeric" className="border border-slate-200 rounded-xl px-4 py-3 bg-white mb-2" placeholderTextColor="#94a3b8" value={paymentSubData.cardNumber || ''} onChangeText={v => setPaymentSubData('cardNumber', v)} />
          <View className="flex-row">
            <TextInput placeholder={t(lang, 'cardExpiry')} className="flex-1 border border-slate-200 rounded-xl px-4 py-3 bg-white mr-2" placeholderTextColor="#94a3b8" value={paymentSubData.cardExpiry || ''} onChangeText={v => setPaymentSubData('cardExpiry', v)} />
            <TextInput placeholder={t(lang, 'cardCVV')} keyboardType="numeric" secureTextEntry className="w-24 border border-slate-200 rounded-xl px-4 py-3 bg-white" placeholderTextColor="#94a3b8" value={paymentSubData.cardCVV || ''} onChangeText={v => setPaymentSubData('cardCVV', v)} />
          </View>
          <TextInput placeholder={t(lang, 'cardName')} className="border border-slate-200 rounded-xl px-4 py-3 bg-white mt-2" placeholderTextColor="#94a3b8" value={paymentSubData.cardName || ''} onChangeText={v => setPaymentSubData('cardName', v)} />
        </View>
      );
    }

    if (group === 'ewallet') {
      return (
        <View className="bg-slate-50 rounded-xl p-4 mt-2">
          <TextInput placeholder={t(lang, 'phoneWallet')} keyboardType="phone-pad" className="border border-slate-200 rounded-xl px-4 py-3 bg-white" placeholderTextColor="#94a3b8" value={paymentSubData.phone || ''} onChangeText={v => setPaymentSubData('phone', v)} />
        </View>
      );
    }

    if (group === 'qris') {
      return (
        <View className="bg-slate-50 rounded-xl p-4 mt-2 items-center">
          <View className="w-48 h-48 bg-slate-200 rounded-2xl items-center justify-center">
            <Text className="text-slate-400 text-lg font-bold">QR Code</Text>
          </View>
        </View>
      );
    }

    if (group === 'bank') {
      const va = VA_NUMBERS[selectedPayment] || '—';
      return (
        <View className="bg-slate-50 rounded-xl p-4 mt-2">
          <Text className="text-sm text-slate-500 mb-2">Virtual Account</Text>
          <View className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 border border-slate-200">
            <Text className="text-base font-mono font-bold text-slate-800">{va}</Text>
            <Pressable onPress={() => Clipboard.setStringAsync(va.replace(/\s/g, ''))}>
              <Text className="text-teal-600 font-semibold text-sm">Copy</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-50">
      <View style={{ paddingTop: insets.top }} className="bg-white">
        <ProgressBar currentStep={5} lang={lang} />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-xl font-bold text-slate-800 mt-4 mb-1">{t(lang, 'payTitle')}</Text>
        <Text className="text-sm text-slate-500 mb-4">{t(lang, 'paySub')}</Text>

        {/* Collapsible order summary */}
        <Pressable
          onPress={() => setShowSummary(!showSummary)}
          className="bg-white border border-slate-100 rounded-2xl p-4 mb-4"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-semibold text-slate-700">{t(lang, 'orderSummary')}</Text>
            <Text className="text-slate-400">{showSummary ? '▲' : '▼'}</Text>
          </View>
          {showSummary && (
            <View className="mt-3">
              {cart.map(item => (
                <View key={item.medication.id} className="flex-row justify-between mb-1">
                  <Text className="text-sm text-slate-600">{item.medication.brand} x{item.quantity}</Text>
                  <Text className="text-sm text-slate-700">{fmt(item.medication.price * item.quantity)}</Text>
                </View>
              ))}
              <View className="h-px bg-slate-100 my-2" />
              <View className="flex-row justify-between">
                <Text className="text-sm text-slate-500">{t(lang, 'subtotal')}</Text>
                <Text className="text-sm font-semibold">{fmt(cartTotal)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-slate-500">{t(lang, 'shippingEst')}</Text>
                <Text className="text-sm font-semibold">{fmt(shippingCost)}</Text>
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-base font-bold">{t(lang, 'total')}</Text>
                <Text className="text-base font-bold text-teal-700">{fmt(grandTotal)}</Text>
              </View>
            </View>
          )}
        </Pressable>

        {/* Payment groups */}
        {PAYMENT_GROUPS.map(group => (
          <View key={group.key} className="mb-3">
            <Pressable
              onPress={() => setExpandedGroup(expandedGroup === group.key ? null : group.key)}
              className="bg-white border border-slate-100 rounded-2xl p-4"
            >
              <View className="flex-row items-center">
                <Text className="text-xl mr-3">{group.icon}</Text>
                <Text className="text-base font-semibold text-slate-800 flex-1">{t(lang, group.labelKey)}</Text>
                <Text className="text-slate-400">{expandedGroup === group.key ? '▲' : '▼'}</Text>
              </View>
            </Pressable>

            {expandedGroup === group.key && (
              <View className="mt-1 pl-2">
                {group.methods.map(method => (
                  <Pressable
                    key={method.id}
                    onPress={() => setSelectedPayment(method.id)}
                    className={`flex-row items-center p-3 rounded-xl border mb-1 ${
                      selectedPayment === method.id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <View className={`w-5 h-5 rounded-full border mr-3 items-center justify-center ${
                      selectedPayment === method.id ? 'bg-teal-600 border-teal-600' : 'border-slate-300'
                    }`}>
                      {selectedPayment === method.id && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                    <Text className="text-sm text-slate-700">{t(lang, method.labelKey)}</Text>
                  </Pressable>
                ))}
                {renderSubForm()}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <BottomBar>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-slate-500">{t(lang, 'total')}</Text>
          <Text className="text-lg font-bold text-teal-700">{fmt(grandTotal)}</Text>
        </View>
        <Pressable
          onPress={handlePay}
          disabled={processing}
          className={`rounded-xl py-3.5 items-center ${processing ? 'bg-slate-300' : 'bg-teal-600'}`}
        >
          <Text className="text-white font-bold text-base">
            {processing ? t(lang, 'processingPay') : t(lang, 'payNow')}
          </Text>
        </Pressable>
      </BottomBar>
    </KeyboardAvoidingView>
  );
}
