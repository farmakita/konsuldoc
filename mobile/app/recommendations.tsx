import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { getAgeGroup } from '../data/medications';
import { ProgressBar } from '../components/ProgressBar';
import { PatientSummary } from '../components/PatientSummary';
import { MedicationCard } from '../components/MedicationCard';
import { BottomBar } from '../components/BottomBar';

export default function RecommendationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, patient, symptoms, recommendations, cart, addToCart } = useAppStore();
  const cartCount = useAppStore(s => s.cartItemCount());
  const ageGroup = getAgeGroup(parseFloat(patient.age));
  const cartMedIds = new Set(cart.map(c => c.medication.id));

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="bg-white">
        <ProgressBar currentStep={2} lang={lang} />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: cartCount > 0 ? 100 : 32 }}>
        <Text className="text-xl font-bold text-slate-800 mt-4 mb-1">{t(lang, 'recomTitle')}</Text>
        <Text className="text-sm text-slate-500 mb-4">{t(lang, 'recomSub')}</Text>

        <PatientSummary
          age={patient.age}
          weight={patient.weight}
          ageGroup={ageGroup}
          symptoms={symptoms}
          lang={lang}
        />

        {recommendations.length === 0 ? (
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <Text className="text-sm text-amber-700">{t(lang, 'noRec')}</Text>
          </View>
        ) : (
          <>
            {recommendations.map(med => (
              <MedicationCard
                key={med.id}
                medication={med}
                lang={lang}
                inCart={cartMedIds.has(med.id)}
                onAddToCart={() => addToCart(med)}
              />
            ))}

            {/* Disclaimer */}
            <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-2">
              <Text className="text-sm font-bold text-amber-800 mb-1">{t(lang, 'disclaimerTitle')}</Text>
              <Text className="text-sm text-amber-700">{t(lang, 'disclaimer')}</Text>
            </View>
          </>
        )}
      </ScrollView>

      {cartCount > 0 && (
        <BottomBar>
          <Pressable
            onPress={() => router.push('/cart')}
            className="bg-teal-600 rounded-xl py-3.5 items-center"
          >
            <Text className="text-white font-bold text-base">
              {t(lang, 'viewCart')} ({t(lang, 'cartCount', cartCount)})
            </Text>
          </Pressable>
        </BottomBar>
      )}
    </View>
  );
}
