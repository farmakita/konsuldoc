import React from 'react';
import { View, Text } from 'react-native';
import { t } from '../i18n';
import { Lang } from '../../shared/types';
import { SYMPTOMS } from '../data/medications';

interface PatientSummaryProps {
  age: string;
  weight: string;
  ageGroup: string;
  symptoms: string[];
  lang: Lang;
}

export function PatientSummary({ age, weight, ageGroup, symptoms, lang }: PatientSummaryProps) {
  const categoryLabels: Record<string, string> = {
    infant: t(lang, 'catInfant'),
    child: t(lang, 'catChild'),
    adult: t(lang, 'catAdult'),
  };

  const symptomLabels = symptoms.map(id => {
    const s = SYMPTOMS.find(s => s.id === id);
    return s ? (lang === 'id' ? s.id_label : s.en_label) : id;
  });

  return (
    <View className="bg-teal-50 border border-teal-200 rounded-2xl p-4 mb-4">
      <Text className="text-sm font-bold text-teal-800 mb-2">{t(lang, 'patientSummary')}</Text>
      <View className="flex-row mb-1">
        <Text className="text-sm text-teal-700 w-20">{t(lang, 'ageLabel2')}</Text>
        <Text className="text-sm text-teal-800 font-semibold">{age} {t(lang, 'years')}</Text>
      </View>
      <View className="flex-row mb-1">
        <Text className="text-sm text-teal-700 w-20">{t(lang, 'weightLabel2')}</Text>
        <Text className="text-sm text-teal-800 font-semibold">{weight} {t(lang, 'kg')}</Text>
      </View>
      <View className="flex-row mb-2">
        <Text className="text-sm text-teal-700 w-20">{t(lang, 'categoryLabel')}</Text>
        <Text className="text-sm text-teal-800 font-semibold">{categoryLabels[ageGroup]}</Text>
      </View>
      <Text className="text-xs text-teal-600 font-semibold mb-0.5">{t(lang, 'symptomsFor')}</Text>
      <Text className="text-sm text-teal-700">{symptomLabels.join(', ')}</Text>
    </View>
  );
}
