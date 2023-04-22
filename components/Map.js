import React, { useRef, useState } from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_API_KEY} from '@env'


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

function InputAutocomplete({ label, placeholder, onPlaceSelected }) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "pt-BR",
        }}
      />
    </>
  );
}

export default function Map() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('')
  const [showDirections, setShowDirections] = useState(false)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0)
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

  const onPlaceSelected = (GooglePlaceDetail, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: GooglePlaceDetail?.geometry.location.lat || 0,
      longitude: GooglePlaceDetail?.geometry.location.lng || 0
    }

    set(position)
    moveTo(position)
  }

  const [initialState, setInitialState] = useState({
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  })
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
        {showDirections && origin && destination && (
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_API_KEY}
          strokeColor="#6644ff"
          strokeWidth={4}
          onReady={traceRouteOnReady}
      />)}
      </MapView>
      <View style={styles.searchContainer}>
        {
          openInput ? 
        <View>
          <InputAutocomplete label="Origin" onPlaceSelected={(details) => {
            onPlaceSelected(details, 'origin')
          }} />
          <InputAutocomplete label="Destination" onPlaceSelected={(details) => {
            onPlaceSelected(details, destination)
          }} />
          <TouchableOpacity style={styles.button} onPress={traceRoute}>
            <Text style={styles.buttonText}>Trace route</Text>
          </TouchableOpacity>
        </View>
        : null
        }


        { !openInput ?
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text>Distance: {distance.toFixed(2)} km</Text>
              <Text>Duration: {Math.ceil(duration)} min</Text>
            </View>
          
            <TouchableOpacity onPress={() => setOpenInput(true)} style={styles.newRouteBtn} >
              <Text style={styles.buttonText}>New route</Text>
            </TouchableOpacity>
          </View> : null
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '70%',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    // top: Constants.statusBarHeight + 10,
    top: 10,
  },
  input: {
    borderColor: '#90be6d',
    borderWidth: 1,
    marginTop: 5,
    height: 33
  },
  button: {
   backgroundColor: '#90be6d', 
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