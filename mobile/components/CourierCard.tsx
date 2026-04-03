import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Courier, Lang } from '../../shared/types';
import { t } from '../i18n';

interface CourierCardProps {
  courier: Courier;
  lang: Lang;
  selected: boolean;
  onPress: () => void;
}

function formatPrice(price: number): string {
  return 'Rp ' + price.toLocaleString('id-ID');
}

export function CourierCard({ courier, lang, selected, onPress }: CourierCardProps) {
  const est = lang === 'id' ? courier.est_id : courier.est_en;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center p-3 rounded-xl border mb-2 ${
        selected ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'
      }`}
    >
      <View className="w-10 h-10 rounded-lg bg-slate-100 items-center justify-center mr-3">
        <Text className="text-sm font-bold">{courier.badge}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-800">{courier.name}</Text>
        <Text className="text-xs text-slate-500">{t(lang, 'estArrival')}: {est}</Text>
      </View>
      <Text className="text-sm font-bold text-teal-700">
        {courier.price === 0 ? t(lang, 'free') : formatPrice(courier.price)}
      </Text>
      {selected && (
        <Text className="ml-2 text-teal-600 text-lg">✓</Text>
      )}
    </Pressable>
  );
}
