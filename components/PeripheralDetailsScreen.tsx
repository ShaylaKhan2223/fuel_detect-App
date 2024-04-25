import React, {useEffect,useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import BleManager, {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

// Define interfaces for your peripheral's properties
interface Characteristic {
  characteristic: string;
  // Add any other characteristic properties you need
}

// interface Service {
//   uuid: string;
//   characteristics: Characteristic[];
//   // Add any other service properties you need
// }

// Props expected by PeripheralDetails component
interface PeripheralDetailsProps {
  route: {
    params: {
      peripheralData: PeripheralInfo;
    };
  };
}

const PeripheralDetailsScreen = ({route}: PeripheralDetailsProps) => {
  const peripheralData = route.params.peripheralData;

  const [data,setData]=useState({});


  function bytesToString(bytes: ArrayBuffer): string {
    const byteArray = new Uint8Array(bytes);
    const byteNumbers = Array.from(byteArray);
    return String.fromCharCode.apply(null, byteNumbers);
  }

  useEffect(() => {
    BleManager.startNotification(
      peripheralData.id,
      '0000FFE0-0000-1000-8000-00805F9B34FB',
      '0000FFE1-0000-1000-8000-00805F9B34FB',
      // 'FFE0',
      // 'FFE1',
    )
      .then(data => {
        console.log('Started notifications', data);
      })
      .catch(error => {
        console.error('Failed to start notifications:', error);
      });

    BleManager.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({value}) => {
        // Convert bytes array to string
        // const data = bytesToString(value);
        const inputString = bytesToString(value);
        const flows = inputString.split(',');

        const obj = {
          flow1: flows[0],
          flow2: flows[1],
          time: flows[2]/1000,
          

        };
        setData(obj)

        console.log(`Received`, 'oooRec', bytesToString(value),obj);
      },
    );
    
  }, []);

  // function bytesToString(bytes: any) {
  //   return String.fromCharCode.apply(null, new Uint8Array(bytes));
  // }
  // Function to render characteristics for a given service

  const renderCharacteristicsForService = (serviceUUID: string) => {
    const characteristics = peripheralData.characteristics ?? [];
    return characteristics
      .filter(char => char.service === serviceUUID)
      .map((char, index) => (
        <View key={index} style={styles.characteristicContainer}>
          <Text style={styles.characteristicTitle}>
            Characteristic: {char.characteristic}
          </Text>
          <Text>Properties: {Object.values(char.properties).join(', ')}</Text>
        </View>
      ));
  };

  return (
    <ScrollView
      style={styles.scrollViewStyle}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Bluetooth Details</Text>
      <Text style={styles.detail}>name: {peripheralData.name}</Text>
      <Text style={styles.detail}>id: {peripheralData.id}</Text>
      {/* <Text style={styles.detail}>rssi: {peripheralData.rssi}</Text> */}

      {/* <Text style={[styles.title, styles.titleWithMargin]}>Advertising</Text> */}
      <Text style={styles.detail}>
        localName: {peripheralData.advertising.localName}
      </Text>
      {/* <Text style={styles.detail}>
        txPowerLevel: {peripheralData.advertising.txPowerLevel}
      </Text>
      <Text style={styles.detail}>
        isConnectable:{' '}
        {peripheralData.advertising.isConnectable ? 'true' : 'false'}
      </Text>
      <Text style={styles.detail}>
        serviceUUIDs: {peripheralData.advertising.serviceUUIDs}
      </Text> */}

      <Text style={[styles.title, styles.titleWithMargin]}>
        Fuel Data
      </Text>
      <View>
        <View>
          <Text>Flow1 : {data?.flow1 ||""}ml </Text>
          <Text>Flow2 :{data?.flow2 ||""}ml  </Text>
          <Text>Time : {data?.time ||""}s </Text>
          {/* <Text>Fuel:{ ||""}  </Text> */}
        </View>
      </View>

      {/* <Text style={[styles.title, styles.titleWithMargin]}>
        Services && Characteristics
      </Text>
      <View>
        <View>
          <Text>Fuel value1 : </Text>
          <Text>Fuel value2 : </Text>
        </View>
      </View> */}
      {/* {peripheralData.services?.map((service, index) => (
        <View key={index} style={styles.serviceContainer}>
          <Text style={styles.serviceTitle}>Service: {service.uuid}</Text>
          {renderCharacteristicsForService(service.uuid)}
        </View>
      ))} */}
    </ScrollView>
  );
};

// Add some basic styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor:'red'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleWithMargin: {
    marginTop: 20, // Adjust this value as needed
  },
  detail: {
    marginTop: 5,
    fontSize: 16,
  },
  serviceContainer: {
    marginTop: 15,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  characteristic: {
    fontSize: 16,
  },
  scrollViewStyle: {
    flex: 1,
    backgroundColor: '#333',
  },
  contentContainer: {
    padding: 20,
  },
  characteristicContainer: {
    marginTop: 10,
  },
  characteristicTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  propertyText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default PeripheralDetailsScreen;
