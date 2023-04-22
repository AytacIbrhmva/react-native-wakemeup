import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text,  TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';

export default function CurrentLoc() {
    const [location, setLocation] = useState();
    const [address, setAddress] = useState();
    const [currentLocation, setCurrentLocation] = useState()


    
    useEffect(() => {
        const getPermissions = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
            //   console.log('Please grant location permission'); 
              return; 
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation)
            // console.log('Location');
            // console.log(currentLocation);
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

        console.log('Reverse Geocoded:');
        // console.log(location);
        setCurrentLocation(location.coords)
    };

  return (
    <View style={styles.container}>
        <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
        <Button title='Geocode Address' onPress={geocode} />
        <Button title='Reverse Geocode Current Location' onPress={reverseGeocode} />

        <Text>Current location longitude: {currentLocation.longitude ? currentLocation.longitude : null}</Text>
        <Text>Current location longitude: {currentLocation.latitude ? currentLocation.latitude : null}</Text>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
