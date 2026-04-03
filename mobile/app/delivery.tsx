import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n';
import { COURIERS } from '../data/couriers';
import { ProgressBar } from '../components/ProgressBar';
import { CourierCard } from '../components/CourierCard';
import { BottomBar } from '../components/BottomBar';
import { Courier, CourierGroup } from '../../shared/types';

function fmt(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

const COURIER_GROUPS: { key: CourierGroup; labelKey: string }[] = [
  { key: 'regular', labelKey: 'regularGroup' },
  { key: 'express', labelKey: 'expressGroup' },
  { key: 'instant', labelKey: 'instantGroup' },
];

export default function DeliveryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    lang, deliveryAddress, setDeliveryAddress, selectedDelivery, setSelectedDelivery,
    deliveryLat, deliveryLng, setDeliveryLocation,
  } = useAppStore();
  const cartTotal = useAppStore(s => s.cartTotal());
  const [mapSearch, setMapSearch] = useState('');

  const shippingCost = selectedDelivery?.price ?? 0;
  const grandTotal = cartTotal + shippingCost;

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setDeliveryLocation(latitude, longitude);
  };

  const handleConfirm = () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('', t(lang, 'errAddress'));
      return;
    }
    if (!selectedDelivery) {
      Alert.alert('', t(lang, 'errDelivery'));
      return;
    }
    router.push('/payment');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-slate-50">
      <View style={{ paddingTop: insets.top }} className="bg-white">
        <ProgressBar currentStep={4} lang={lang} />
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-xl font-bold text-slate-800 mt-4 mb-1">{t(lang, 'delivTitle')}</Text>
        <Text className="text-sm text-slate-500 mb-4">{t(lang, 'delivSub')}</Text>

        {/* Address */}
        <Text className="text-sm font-semibold text-slate-700 mb-1">{t(lang, 'addressLabel')}</Text>
        <TextInput
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder={t(lang, 'addressPlaceholder')}
          multiline
          numberOfLines={3}
          className="border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-800 bg-white mb-4"
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
        />

        {/* Map */}
        <Text className="text-sm font-semibold text-slate-700 mb-1">{t(lang, 'mapLabel')}</Text>
        <Text className="text-xs text-slate-400 mb-2">{t(lang, 'mapHint')}</Text>
        <View className="rounded-xl overflow-hidden border border-slate-200 mb-4" style={{ height: 200 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: -6.2088,
              longitude: 106.8456,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={handleMapPress}
          >
            {deliveryLat !== null && deliveryLng !== null && (
              <Marker coordinate={{ latitude: deliveryLat, longitude: deliveryLng }} />
            )}
          </MapView>
        </View>

        {/* Courier groups */}
        {COURIER_GROUPS.map(group => {
          const groupCouriers = COURIERS.filter(c => c.group === group.key);
          if (groupCouriers.length === 0) return null;
          return (
            <View key={group.key} className="mb-4">
              <Text className="text-sm font-bold text-slate-700 mb-2">{t(lang, group.labelKey)}</Text>
              {groupCouriers.map(courier => (
                <CourierCard
                  key={courier.id}
                  courier={courier}
                  lang={lang}
                  selected={selectedDelivery?.id === courier.id}
                  onPress={() => setSelectedDelivery(courier)}
                />
              ))}
            </View>
          );
        })}

        {/* Pickup option */}
        {(() => {
          const pickup = COURIERS.find(c => c.group === 'pickup');
          if (!pickup) return null;
          return (
            <View className="mb-4">
              <Text className="text-sm font-bold text-slate-700 mb-2">{t(lang, 'pickupGroup')}</Text>
              <CourierCard
                courier={pickup}
                lang={lang}
                selected={selectedDelivery?.id === pickup.id}
                onPress={() => setSelectedDelivery(pickup)}
              />
              <Text className="text-xs text-slate-400 mt-1">{t(lang, 'pickupNote')}</Text>
            </View>
          );
        })()}
      </ScrollView>

      <BottomBar>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-slate-500">{t(lang, 'total')}</Text>
          <Text className="text-lg font-bold text-teal-700">{fmt(grandTotal)}</Text>
        </View>
        <Pressable
          onPress={handleConfirm}
          className="bg-teal-600 rounded-xl py-3.5 items-center"
        >
          <Text className="text-white font-bold text-base">{t(lang, 'continueToPayment')}</Text>
        </Pressable>
      </BottomBar>
    </KeyboardAvoidingView>
  );
}
