import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';

export default function DoctorOfferScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lang } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-8xl mb-6">👨‍⚕️</Text>
        <Text className="text-2xl font-bold text-slate-800 text-center mb-3">
          {t(lang, 'doctorOfferTitle')}
        </Text>
        <Text className="text-base text-slate-500 text-center mb-8">
          {t(lang, 'doctorOfferSub')}
        </Text>

        <Pressable
          onPress={() => setShowModal(true)}
          className="bg-teal-600 rounded-xl py-3.5 px-8 items-center w-full mb-3"
        >
          <Text className="text-white font-bold text-base">{t(lang, 'doctorYes')}</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/searching')}
          className="border border-teal-600 rounded-xl py-3.5 px-8 items-center w-full mb-6"
        >
          <Text className="text-teal-700 font-bold text-base">{t(lang, 'doctorNo')}</Text>
        </Pressable>

        <View className="bg-amber-50 rounded-xl p-4 w-full">
          <Text className="text-sm text-amber-700">{t(lang, 'doctorNote')}</Text>
        </View>
      </View>

      {/* Coming Soon Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-6" style={{ paddingBottom: insets.bottom + 16 }}>
            <Text className="text-xl font-bold text-slate-800 mb-2">{t(lang, 'doctorComingTitle')}</Text>
            <Text className="text-base text-slate-500 mb-6">{t(lang, 'doctorComingSub')}</Text>
            <Pressable
              onPress={() => setShowModal(false)}
              className="bg-teal-600 rounded-xl py-3.5 items-center"
            >
              <Text className="text-white font-bold">{t(lang, 'doctorClose')}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
