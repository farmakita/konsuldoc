// Web shim for react-native-maps (not supported on web)
import React from 'react';
import { View, Text } from 'react-native';

const MapView = React.forwardRef(({ style, children, ...props }, ref) => (
  <View ref={ref} style={[{ backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', minHeight: 200 }, style]}>
    <Text style={{ color: '#6b7280' }}>Map not available on web</Text>
    {children}
  </View>
));

MapView.displayName = 'MapView';

const Marker = () => null;

export default MapView;
export { Marker };
