import { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import {Camera, CameraType} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from "./Button";
import Constants from "expo-constants";

export default function CameraAccess() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
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
      {!image ?
      <Camera 
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
        ratio={'1:1'}
      >
        <View style={styles.camerHeader}>
          <Button icon={'retweet'} onPress={() => {
            setType(type === CameraType.back ? CameraType.front : CameraType.back)
          }} />
          <Button 
            icon={'flash'} 
            color={flash === Camera.Constants.FlashMode.off 
            ? '#000' : 'yellow' }
            onPress={() => {
              setFlash(flash === Camera.Constants.FlashMode.off 
                ? 
                Camera.Constants.FlashMode.on
                :
                Camera.Constants.FlashMode.off 
                )
            }} 
          />
        </View>
      </Camera>
      :
      <Image source={{uri: image}} style={styles.camera}  />
      }
      <View>
        {image ? 
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
        >
          <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} />
          {/* <Button title={"Save"} icon="check" onPress={saveImage} /> */}
        </View> 
        :
        <Button color={'#fff'} title={"Take a picture"} icon="camera" onPress={takePicture} />
        }
      </View>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '30%',
  },
  camera: {
    width: '100%',
    height: '100%'
  },
  camerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#fff',

  }
})