import React, { useRef, useState, useEffect } from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import { io } from 'socket.io-client';
import { clearLogEntriesAsync } from 'expo-updates';
import { EngineIcon } from '../assets/icons/icon';

// import {GOOGLE_API_KEY} from '@env'

const socket = io.connect('https://wakemex.azurewebsites.net');

const {width, height} = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 40.767110,
  longitude: -73.979704,
  latitiudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

export default function Map() {
  const [permissionStatus, setPermissionStatus] = useState()
  const [origin, setOrigin] = useState()
  const [destination, setDestination] = useState(
  //   {
  //   latitude: 40.226650,
  //   longitude: 49.575770
  // }
  )
  const [showDirections, setShowDirections] = useState(false)
  const [initialState, setInitialState] = useState({
    region: {
      latitude: '',
      longitude: '',
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  })
  const mapRef = useRef()
  const edgePaddingValue = 70
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };
  
  const traceRouteOnReady = (args) => {
    if(args) {
      //args.distance
      //args.duration
      setDistance(args.distance)
      setDuration(args.duration)
    }
  }

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera()
    if(camera) {
      camera.center = position;
      mapRef.current.animateCamera(camera, {duration: 10})
    }
  }

  const traceRoute = () => {
    if(origin && destination) {
      setShowDirections(true)
      mapRef.current.fitToCoordinates([origin, destination], {edgePadding})
    }
  }

  const sendData = () => {
    socket.emit("location", origin)
  }

  // 3 step
  const getData = async () => {
    console.log('get data step');
    const data = await socket.on("address", (data) => {
      setDestination(
        data ?
        {
        latitude: data.lat,
        longitude: data.lng
        } : null )
    })
  }

  // 1 step
  const getPermissions = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted') {
        return; 
      }
      setPermissionStatus(status)
      getCurrentLoc()
  }
  const getCurrentLoc = async () => {
    let currentLoc = await Location.getCurrentPositionAsync({});
    setOrigin({
      latitude: currentLoc.coords.latitude,
      longitude: currentLoc.coords.longitude
      })
    setInitialState({
      region: {
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    })
    setTimeout(() => {
        setInterval(() => {
          // console.log('interval');
          if(origin) {
            sendData()
            getOrigin()
          } else {
            return;
          }
        }, 5000)
      }, 5000)
  }
  // 2 step
  const getOrigin = async  () => {

    if(permissionStatus === 'granted') {
      let currentLoc = await Location.getCurrentPositionAsync({})
      setOrigin({
        latitude: currentLoc.coords.latitude,
        longitude: currentLoc.coords.longitude
        })
    } else {
      return;
    }
  }


  useEffect(() => {
    if( permissionStatus !== 'granted') {
      getPermissions();
    } else {
      getCurrentLoc()
    }
  },[])


  // 5 step
  useEffect(() => {
    console.log('no dest');
    if(destination) {
      console.log('yes dest');
    console.log(destination);

      traceRoute()
    }
  }, [destination])

 


  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        region={initialState.region}
        // onRegionChange={() => setInitialState()}
      >
        {origin && <Marker coordinate={origin} pinColor='green'>
          <View></View>
          <EngineIcon />            
        </Marker> }
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination ?  <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={'AIzaSyDFave-hQPrKugZTnAQ-lXf7ejukC0JPNw'}
          strokeColor="#6644ff"
          strokeWidth={4}
          // onReady={traceRouteOnReady}
          />
          :
        null}
      </MapView>
        {
          origin && destination ? 
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Trace route</Text>
          </TouchableOpacity>
          : null
        }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#000', 
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
  newRouteBtn: {
    backgroundColor: '#90be6d', 
    padding: 5,
    borderRadius: 4,
  },
});