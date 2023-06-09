import { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from "./Button";
import Constants from "expo-constants";

export default function CameraAccess() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted')
    })();
  }, [])

  const takePicture = async () => {
    if(cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri)
      } catch(e) {
        console.log(e);
      }
    }
  }

  const saveImage = async () => {
    if(image) {
      try{
        await MediaLibrary.createAssetAsync(image);
        alert('Picture save!')
        setImage(null)
      } catch(e) {
        console.log(e);
      }
    }
  }

  if(hasCameraPermission === false) {
    return <Text>No access to camera</Text>
  } 


  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera}
        type={type}
        flashMode={flash}
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