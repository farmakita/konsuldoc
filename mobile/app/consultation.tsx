import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { SYMPTOMS, ALLERGIES } from '../data/medications';
import { ProgressBar } from '../components/ProgressBar';
import { SymptomChip } from '../components/SymptomChip';
import { BottomBar } from '../components/BottomBar';

export default function ConsultationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, patient, setPatient, symptoms, toggleSymptom, customSymptoms, setCustomSymptoms, profileLoadedFromStorage } = useAppStore();

  const [age, setAge] = useState(patient.age);
  const [weight, setWeight] = useState(patient.weight);
  const [allergies, setAllergies] = useState<string[]>(patient.allergies);
  const [noAllergy, setNoAllergy] = useState(patient.allergies.length === 0);

  const handleAllergyToggle = (id: string) => {
    setNoAllergy(false);
    setAllergies(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleNoAllergy = () => {
    setNoAllergy(true);
    setAllergies([]);
  };

  const handleSubmit = () => {
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);

    if (!ageNum || ageNum < 1 || ageNum > 120) {
      Alert.alert('', t(lang, 'errAge'));
      return;
    }
    if (!weightNum || weightNum < 1 || weightNum > 300) {
      Alert.alert('', t(lang, 'errWeight'));
      return;
    }
    if (symptoms.length === 0) {
      Alert.alert('', t(lang, 'errSymptoms'));
      return;
    }

    setPatient({ age, weight, allergies });
    router.push('/doctor-offer');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-50">
      <View style={{ paddingTop: insets.top }} className="bg-white">
        <ProgressBar currentStep={1} lang={lang} />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="text-xl font-bold text-slate-800 mt-4 mb-1">{t(lang, 'consultTitle')}</Text>
        <Text className="text-sm text-slate-500 mb-4">{t(lang, 'consultSub')}</Text>

        {profileLoadedFromStorage && (
          <View className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <Text className="text-sm text-green-700">{t(lang, 'profileLoaded')}</Text>
          </View>
        )}

        {/* Age */}
        <Text className="text-sm font-semibold text-slate-700 mb-1">{t(lang, 'ageLabel')}</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder={t(lang, 'agePlaceholder')}
          keyboardType="numeric"
          className="border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-white mb-4"
          placeholderTextColor="#94a3b8"
        />

        {/* Weight */}
        <Text className="text-sm font-semibold text-slate-700 mb-1">{t(lang, 'weightLabel')}</Text>
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder={t(lang, 'weightPlaceholder')}
          keyboardType="numeric"
          className="border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-white mb-4"
          placeholderTextColor="#94a3b8"
        />

        {/* Allergies */}
        <Text className="text-sm font-semibold text-slate-700 mb-2">{t(lang, 'allergyLabel')}</Text>
        <View className="mb-4">
          {ALLERGIES.map(a => (
            <Pressable
              key={a.id}
              onPress={() => handleAllergyToggle(a.id)}
              className={`flex-row items-center p-3 rounded-xl border mb-2 ${
                allergies.includes(a.id) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'
              }`}
            >
              <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                allergies.includes(a.id) ? 'bg-teal-600 border-teal-600' : 'border-slate-300'
              }`}>
                {allergies.includes(a.id) && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="text-sm text-slate-700">{lang === 'id' ? a.id_label : a.en_label}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={handleNoAllergy}
            className={`flex-row items-center p-3 rounded-xl border ${
              noAllergy ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white'
            }`}
          >
            <View className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
              noAllergy ? 'bg-teal-600 border-teal-600' : 'border-slate-300'
            }`}>
              {noAllergy && <Text className="text-white text-xs">✓</Text>}
            </View>
            <Text className="text-sm text-slate-700">{t(lang, 'noAllergyKnown')}</Text>
          </Pressable>
        </View>

        {/* Symptoms */}
        <Text className="text-sm font-bold text-slate-800 mb-1">{t(lang, 'symptomsTitle')}</Text>
        <Text className="text-sm text-slate-500 mb-3">{t(lang, 'symptomsSub')}</Text>
        <View className="flex-row flex-wrap mb-4">
          {SYMPTOMS.map(s => (
            <View key={s.id} className="w-1/3 p-1">
              <SymptomChip
                emoji={s.emoji}
                label={lang === 'id' ? s.id_label : s.en_label}
                selected={symptoms.includes(s.id)}
                onPress={() => toggleSymptom(s.id)}
              />
            </View>
          ))}
        </View>

        {/* Custom symptoms */}
        <Text className="text-sm font-semibold text-slate-700 mb-1">{t(lang, 'customSymptomsLabel')}</Text>
        <TextInput
          value={customSymptoms}
          onChangeText={setCustomSymptoms}
          placeholder={t(lang, 'customSymptomsPlaceholder')}
          multiline
          numberOfLines={3}
          className="border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-white mb-4"
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
        />
      </ScrollView>

      <BottomBar>
        <Pressable onPress={handleSubmit} className="bg-teal-600 rounded-xl py-3.5 items-center">
          <Text className="text-white font-bold text-base">{t(lang, 'submitConsult')}</Text>
        </Pressable>
      </BottomBar>
    </KeyboardAvoidingView>
  );
}
