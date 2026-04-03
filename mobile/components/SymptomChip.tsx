import React from 'react';
import { Pressable, Text } from 'react-native';

interface SymptomChipProps {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SymptomChip({ emoji, label, selected, onPress }: SymptomChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-3 py-2.5 rounded-xl border ${
        selected
          ? 'bg-teal-50 border-teal-500'
          : 'bg-white border-slate-200'
      }`}
    >
      <Text className="text-base mr-1.5">{emoji}</Text>
      <Text
        className={`text-sm ${selected ? 'text-teal-700 font-semibold' : 'text-slate-700'}`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
