import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Map from './components/Map'
import MapNew from './components/MapNew';
import CurrentLoc from './components/CurrentLoc';
import CameraAccess from './components/CameraAccess';
import Constants from "expo-constants";
import Camera from './components/CameraNew';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <CurrentLoc setGetCurrentLocation={setGetCurrentLocation} /> */}
      {/* <CameraAccess /> */}
      {/* <Map /> */}
      <Camera />
      <MapNew />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#90be6d',
      top: Constants.statusBarHeight + 10,
      gap: 40,
  },
})