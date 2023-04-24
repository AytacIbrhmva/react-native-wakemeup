import { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from "./Button";
import Constants from "expo-constants";

export default function CameraAccess() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.front)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted')
    })();
  }, [])

  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>
  } 


  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera}
        type={type}
        ref={cameraRef}
        ratio={'1:1'}
      >
      </Camera>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    width: 150,
    height: 150
  },
})