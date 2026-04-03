import React from 'react';
import { View, Text } from 'react-native';
import { t } from '../i18n';
import { DrugCategory, Lang } from '../../shared/types';

interface CategoryBadgeProps {
  category: DrugCategory;
  lang: Lang;
}

const BADGE_STYLES: Record<string, { bg: string; text: string; labelKey: string }> = {
  bebas: { bg: 'bg-green-100', text: 'text-green-700', labelKey: 'catLabelBebas' },
  bebas_terbatas: { bg: 'bg-blue-100', text: 'text-blue-700', labelKey: 'catLabelBebasTerbatas' },
  herbal: { bg: 'bg-amber-100', text: 'text-amber-700', labelKey: 'catLabelHerbal' },
};

export function CategoryBadge({ category, lang }: CategoryBadgeProps) {
  const style = BADGE_STYLES[category];
  if (!style) return null;

  return (
    <View className={`px-2 py-0.5 rounded-full ${style.bg}`}>
      <Text className={`text-xs font-semibold ${style.text}`}>
        {t(lang, style.labelKey)}
      </Text>
    </View>
  );
}
