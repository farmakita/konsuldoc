import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, toggleLang } = useAppStore();

  const features = [
    { emoji: '⚡', title: t(lang, 'feat1'), sub: t(lang, 'feat1Sub') },
    { emoji: '🎯', title: t(lang, 'feat2'), sub: t(lang, 'feat2Sub') },
    { emoji: '🚚', title: t(lang, 'feat3'), sub: t(lang, 'feat3Sub') },
  ];

  return (
    <LinearGradient colors={['#0d9488', '#0f766e']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
        className="px-6"
      >
        {/* Language toggle */}
        <View className="items-end mb-8">
          <Pressable onPress={toggleLang} className="border border-white/60 rounded-lg px-3 py-1.5">
            <Text className="text-white text-sm font-semibold">{t(lang, 'langToggle')}</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-extrabold text-white mb-2">Konsuldoc</Text>
          <Text className="text-lg text-teal-100 text-center">{t(lang, 'tagline')}</Text>
        </View>

        {/* Welcome text */}
        <Text className="text-2xl font-bold text-white text-center mb-2">{t(lang, 'welcomeHero')}</Text>
        <Text className="text-base text-teal-100 text-center mb-8">{t(lang, 'welcomeSubHero')}</Text>

        {/* Features */}
        <View className="mb-8">
          {features.map((f, i) => (
            <View key={i} className="flex-row items-center bg-white/10 rounded-2xl p-4 mb-3">
              <Text className="text-3xl mr-4">{f.emoji}</Text>
              <View className="flex-1">
                <Text className="text-white font-bold text-base">{f.title}</Text>
                <Text className="text-teal-100 text-sm">{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.push('/consultation')}
          className="bg-white rounded-xl py-4 items-center shadow-lg"
        >
          <Text className="text-teal-700 font-bold text-lg">{t(lang, 'startBtn')}</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
