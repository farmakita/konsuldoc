import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Medication, Lang } from '../../shared/types';
import { CategoryBadge } from './CategoryBadge';
import { t } from '../i18n';

interface MedicationCardProps {
  medication: Medication;
  lang: Lang;
  inCart: boolean;
  onAddToCart: () => void;
}

function formatPrice(price: number): string {
  return 'Rp ' + price.toLocaleString('id-ID');
}

export function MedicationCard({ medication, lang, inCart, onAddToCart }: MedicationCardProps) {
  const generic = lang === 'id' ? medication.generic_id : medication.generic_en;
  const form = lang === 'id' ? medication.form_id : medication.form_en;
  const dosage = lang === 'id' ? medication.dosage_id : medication.dosage_en;
  const warning = lang === 'id' ? medication.warning_id : medication.warning_en;

  if (medication.isConsult) {
    return (
      <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
        <View className="flex-row items-center mb-2">
          <Text className="text-2xl mr-2">{medication.emoji}</Text>
          <Text className="text-base font-bold text-amber-800">{t(lang, 'isConsult')}</Text>
        </View>
        <Text className="text-sm text-amber-700 mb-2">{t(lang, 'consultNote')}</Text>
        <View className="bg-amber-100/50 rounded-xl p-3">
          <Text className="text-xs font-semibold text-amber-700 mb-1">{t(lang, 'dosageTitle')}</Text>
          <Text className="text-sm text-amber-800">{dosage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-xl mr-2">{medication.emoji}</Text>
            <Text className="text-base font-bold text-slate-800">{medication.brand}</Text>
          </View>
          <Text className="text-sm text-slate-500 ml-8">{generic}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3 ml-8">
        <Text className="text-xs text-slate-400 mr-2">{form}</Text>
        <CategoryBadge category={medication.category} lang={lang} />
      </View>

      <Text className="text-lg font-bold text-teal-700 mb-3 ml-8">
        {formatPrice(medication.price)}
      </Text>

      <View className="bg-slate-50 rounded-xl p-3 mb-2">
        <Text className="text-xs font-semibold text-slate-500 mb-1">{t(lang, 'dosageTitle')}</Text>
        <Text className="text-sm text-slate-700">{dosage}</Text>
      </View>

      <View className="bg-red-50 rounded-xl p-3 mb-3">
        <Text className="text-xs font-semibold text-red-600 mb-1">{t(lang, 'warningTitle')}</Text>
        <Text className="text-sm text-red-700">{warning}</Text>
      </View>

      <Pressable
        onPress={onAddToCart}
        disabled={inCart}
        className={`rounded-xl py-3 items-center ${
          inCart ? 'bg-slate-200' : 'bg-teal-600'
        }`}
      >
        <Text className={`font-bold ${inCart ? 'text-slate-500' : 'text-white'}`}>
          {inCart ? t(lang, 'added') : t(lang, 'addToCart')}
        </Text>
      </Pressable>
    </View>
  );
}
