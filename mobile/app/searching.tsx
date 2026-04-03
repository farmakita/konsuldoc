import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { getRecommendations, getAgeGroup } from '../data/medications';
import { ProgressBar } from '../components/ProgressBar';

function BouncingDots() {
  const anims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, { toValue: -10, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((2 - i) * 200),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View className="flex-row justify-center mt-6">
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          className="w-3 h-3 rounded-full bg-teal-600 mx-1"
          style={{ transform: [{ translateY: anim }] }}
        />
      ))}
    </View>
  );
}

export default function SearchingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang, patient, symptoms, setRecommendations } = useAppStore();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    t(lang, 'searchSub1'),
    t(lang, 'searchSub2'),
    t(lang, 'searchSub3'),
    t(lang, 'searchSub4'),
  ];

  useEffect(() => {
    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start();

    // Cycle messages
    const msgInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 700);

    // Auto-advance
    const timer = setTimeout(() => {
      const recs = getRecommendations(symptoms, parseFloat(patient.age), patient.allergies);
      setRecommendations(recs);
      router.replace('/recommendations');
    }, 2800);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(timer);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="bg-white">
        <ProgressBar currentStep={2} lang={lang} />
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-xl font-bold text-slate-800 mb-6">{t(lang, 'searchTitle')}</Text>

        {/* Progress bar */}
        <View className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <Animated.View
            className="h-full bg-teal-600 rounded-full"
            style={{ width: progressWidth }}
          />
        </View>

        <Text className="text-sm text-slate-500 text-center">{messages[msgIndex]}</Text>

        <BouncingDots />
      </View>
    </View>
  );
}
