import React from 'react';
import { View, Text } from 'react-native';
import { t } from '../i18n';
import { Lang } from '../../shared/types';

interface ProgressBarProps {
  currentStep: number;
  lang: Lang;
}

export function ProgressBar({ currentStep, lang }: ProgressBarProps) {
  const steps = [
    t(lang, 'step1'), t(lang, 'step2'), t(lang, 'step3'),
    t(lang, 'step4'), t(lang, 'step5'),
  ];

  return (
    <View className="px-4 pt-3 pb-2">
      <View className="flex-row h-1.5 rounded-full overflow-hidden bg-slate-200">
        {steps.map((_, i) => (
          <View
            key={i}
            className={`flex-1 ${i <= currentStep - 1 ? 'bg-teal-600' : 'bg-slate-200'} ${i > 0 ? 'ml-0.5' : ''}`}
          />
        ))}
      </View>
      <View className="flex-row mt-1.5">
        {steps.map((label, i) => (
          <Text
            key={i}
            className={`flex-1 text-center text-[10px] ${
              i === currentStep - 1 ? 'text-teal-700 font-bold' : 'text-slate-400'
            }`}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
