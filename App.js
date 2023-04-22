import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Map from './components/Map'
import CurrentLoc from './components/CurrentLoc';
import CameraAccess from './components/CameraAccess';
import Constants from "expo-constants";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Map /> */}
      {/* <CurrentLoc /> */}
      <CameraAccess />
      <Map />
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