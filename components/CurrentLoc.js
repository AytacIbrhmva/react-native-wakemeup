import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,  TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';

export default function CurrentLoc({setGetCurrentLocation}) {
    const [location, setLocation] = useState();
    const [address, setAddress] = useState();
    const [currentLocation, setCurrentLocation] = useState()


    
    useEffect(() => {
        const getPermissions = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
              return; 
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation)
            setGetCurrentLocation(currentLocation)
            // console.log(currentLocation.coords);
        };

        getPermissions();
    },[])

    const geocode = async () => {
        const geocodedLocation = await Location.geocodeAsync(address);
        // console.log("Geocoded Address:");
        // console.log(geocodedLocation);
    };

    const reverseGeocode = async () => {
        const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
        })

        // console.log('Reverse Geocoded:');
        // console.log(location);
        // setCurrentLocation(location.coords)
    };

  return (
    <View style={styles.container}>
        {/* <TextInput placeholder="Address" value={address} onChangeText={setAddress} /> */}
        {/* <Button title='Geocode Address' onPress={geocode} /> */}
        <Button title='Reverse Geocode Current Location' onPress={reverseGeocode} />
        {/* <Text>{currentLocation}</Text> */}

        {/* <Text>Current location longitude: {currentLocation.longitude ? currentLocation.longitude : null}</Text> */}
        {/* <Text>Current location longitude: {currentLocation.latitude ? currentLocation.latitude : null}</Text> */}
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 130,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
