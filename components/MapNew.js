import React, { useRef, useState, useEffect } from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import { io } from 'socket.io-client';
import { clearLogEntriesAsync } from 'expo-updates';

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
  const [origin, setOrigin] = useState()
  const [destination, setDestination] = useState()

  const [showDirections, setShowDirections] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)

  // console.log(currentLocation);
  const mapRef = useRef()

  const [openInput, setOpenInput] = useState(true)

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera()
    if(camera) {
      camera.center = position;
      mapRef.current.animateCamera(camera, {duration: 10})
    }
  }

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

  const traceRoute = () => {
    if(origin && destination) {
      setShowDirections(true)
      mapRef.current.fitToCoordinates([origin, destination], {edgePadding})
    }
    setOpenInput(false)
  }

  const [initialState, setInitialState] = useState({
    region: {
      latitude: currentLocation ? currentLocation.coords.latitue : null,
      longitude: currentLocation ? currentLocation.coords.longitude : null,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  })

  const sendData = () => {
    socket.emit("location", origin)
  }

  const getData = () => {
    socket.on("address", (data) => {
      setDestination( data ?
        {
        latitude: data.lat,
        longitude: data.lng
      }
      : null
      )
    })
  }

  const getPermissions = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      return; 
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentLocation(currentLocation)
    setOrigin(
      currentLocation ?
      {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    }
    : null
    )
    moveTo({
      latitude: currentLocation ? currentLocation.coords.latitude : null,
      longitude: currentLocation ? currentLocation.coords.longitude : null
    })
    setInitialState({
      region: {
        latitude: currentLocation ? currentLocation.coords.latitude : null,
        longitude: currentLocation ? currentLocation.coords.longitude : null,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    })
    
  };

  useEffect(() => {
    getPermissions();
    // getData()
  },[])

  useEffect(() => {
    if(destination) {
      traceRoute()
      console.log('lat useffect');
      console.log(destination);
    }
  }, [destination])

  useEffect(() => {
      setInterval(() => {
        sendData()
        // console.log('send');
      }, 10000)
  }, [origin])


  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        provider={PROVIDER_GOOGLE} 
        region={initialState.region}
        // onRegionChange={() => setInitialState()}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination ?  <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={'AIzaSyDFave-hQPrKugZTnAQ-lXf7ejukC0JPNw'}
          strokeColor="#6644ff"
          strokeWidth={4}
          onReady={traceRouteOnReady}
          />
          :
        null}
      </MapView>

        <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Trace route</Text>
        </TouchableOpacity>
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
  }
});