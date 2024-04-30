// npx react-native run-android    ---- for android
// npx react-native run-ios    ---- for apple

//google sheet
// AIzaSyCRfouZjwTLS4pl91CUk9-No1fsXPbcTYU

import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet, ScrollView} from 'react-native';
import BleManager, {Peripheral, PeripheralInfo} from 'react-native-ble-manager';
// import accessSpreadsheet from '../service/googleSheet';

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

  const [data, setData] = useState({});

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
        // accessSpreadsheet();
        // Convert bytes array to string
        // const data = bytesToString(value);

        // const inputString = bytesToString(value);
        // const flows = inputString.split(',');

        // const flow1 = flows[0]; // ml
        // const flow2 = flows[1]; //ml
        // const time = flows[2] / 1000; // in seconds
        // const fuelUsed = flows[0] - flows[1]; // ml
        // const rate = fuelUsed / 1000 / (time / 3600); // liter per hour

        // // Check if any property of obj is different from the corresponding property in data
        // if (
        //   obj.flow1 !== data.flow1 &&
        //   obj.flow2 !== data.flow2 &&
        //   obj.time !== data.time &&
        //   obj.fuelUsed !== data.fuelUsed &&
        //   obj.rate !== data.rate
        // ) {
        //   setData(obj); // Update data with the new object
        // }

        // console.log(`Received`, 'oooRec', bytesToString(value),obj);

        const inputString = bytesToString(value);
        const flows = inputString.split(',');
    
        const flow1 = flows[0]; // ml
        const flow2 = flows[1]; // ml
        // const timeInSeconds = parseInt(flows[2], 10); // in seconds
        const timeInSeconds = flows[2] / 1000;  // in seconds
        const fuelUsed = flow1 - flow2; // ml
        const rate = (fuelUsed / 1000) / (timeInSeconds / 3600); // liters per hour
    
        // Create an object with the new values
        const newObj = {
          flow1 : flow1,
          flow2 : flow2,
          time : timeInSeconds,
          fuelUsed : fuelUsed,
          rate: rate,
        };
    
        // Update state with the new object
        setData(newObj);
    
        // Log the new values
        console.log('Received', newObj);


      },
    );
  }, []);

  return (
    <ScrollView
      style={styles.scrollViewStyle}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Bluetooth Details</Text>
      {/* <Text style={styles.detail}>Device name: {peripheralData.name}</Text> */}
      <Text style={styles.fuelDataText}>
        Device name :{' '}
        <Text style={styles.fuelDataTextValue}> {peripheralData.name} </Text>{' '}
      </Text>
      <Text style={[styles.title, styles.titleWithMargin]}>Fuel Data</Text>
      <View style={{marginTop: 20}}>
        <Text style={styles.fuelDataText}>
          Inflow :{' '}
          <Text style={styles.fuelDataTextValue}>{data?.flow1 || ''}ml </Text>{' '}
        </Text>
        <Text style={styles.fuelDataText}>
          Overflow :
          <Text style={styles.fuelDataTextValue}>{data?.flow2 || ''}ml </Text>{' '}
        </Text>
        <Text style={styles.fuelDataText}>
          Time Taken :{' '}
          <Text style={styles.fuelDataTextValue}>{data?.time || ''}s </Text>{' '}
        </Text>
        <Text style={styles.fuelDataText}>
          Fuel Used :
          <Text style={styles.fuelDataTextValue}>
            {data?.fuelUsed || ''}ml{' '}
          </Text>{' '}
        </Text>
        <Text style={styles.fuelDataText}>
          Fuel Consumption Rate :{' '}
          <Text style={styles.fuelDataTextValue}>
            {data?.rate?.toFixed(3) || ''}L/hr{' '}
          </Text>{' '}
        </Text>
      </View>
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
    color: 'black',
    // color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleWithMargin: {
    marginTop: 35, // Adjust this value as needed
  },
  detail: {
    marginTop: 5,
    fontSize: 16,
  },
  // serviceContainer: {
  //   marginTop: 15,
  // },
  // serviceTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  // characteristic: {
  //   fontSize: 16,
  // },
  scrollViewStyle: {
    flex: 1,
    // backgroundColor: 'red',
    // backgroundColor: '#8c34eb',
    // backgroundColor: '#41364d',
    backgroundColor: '#d6d1e3',
    // backgroundColor: '#F3F4F6'
  },
  contentContainer: {
    padding: 20,
    
    
  },
  // characteristicContainer: {
  //   marginTop: 10,
  // },
  // characteristicTitle: {
  //   fontSize: 20,
  //   fontWeight: '600',

  // },
  // propertyText: {
  //   fontSize: 16,
  //   marginLeft: 10,
  // },

  fuelDataContainer: {
    borderWidth: 2,
    borderColor: 'white',
    padding: 10,
    marginTop: 20,

    
  },
  fuelDataText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8, // Space below each text line
  },
  fuelDataTextValue: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'normal',
    fontWeight: 'bold',
    
  },
});

export default PeripheralDetailsScreen;



















// // npx react-native run-android    ---- for android
// // npx react-native run-ios    ---- for apple

// import React, {useEffect,useState} from 'react';
// // import './PeripheralDetailsScreen.css'; // Import the CSS file

// import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import BleManager, {Peripheral, PeripheralInfo} from 'react-native-ble-manager';

// // Define interfaces for your peripheral's properties
// interface Characteristic {
//   characteristic: string;
//   // Add any other characteristic properties you need
// }

// // interface Service {
// //   uuid: string;
// //   characteristics: Characteristic[];
// //   // Add any other service properties you need
// // }

// // Props expected by PeripheralDetails component
// interface PeripheralDetailsProps {
//   route: {
//     params: {
//       peripheralData: PeripheralInfo;
//     };
//   };
// }

// const PeripheralDetailsScreen = ({route}: PeripheralDetailsProps) => {
//   const peripheralData = route.params.peripheralData;

//   const [data,setData]=useState({});

//   function bytesToString(bytes: ArrayBuffer): string {
//     const byteArray = new Uint8Array(bytes);
//     const byteNumbers = Array.from(byteArray);
//     return String.fromCharCode.apply(null, byteNumbers);
//   }

//   useEffect(() => {
//     BleManager.startNotification(
//       peripheralData.id,
//       '0000FFE0-0000-1000-8000-00805F9B34FB',
//       '0000FFE1-0000-1000-8000-00805F9B34FB',
//       // 'FFE0',
//       // 'FFE1',
//     )
//       .then(data => {
//         console.log('Started notifications', data);
//       })
//       .catch(error => {
//         console.error('Failed to start notifications:', error);
//       });

//     BleManager.addListener(
//       'BleManagerDidUpdateValueForCharacteristic',
//       ({value}) => {
//         // Convert bytes array to string
//         // const data = bytesToString(value);
//         const inputString = bytesToString(value);
//         const flows = inputString.split(',');

//         const obj = {
//           flow1: flows[0],
//           flow2: flows[1],
//           time: flows[2]/1000,

//         };
//         setData(obj)

//         console.log(`Received`, 'oooRec', bytesToString(value),obj);
//       },
//     );

//   }, []);

//   // function bytesToString(bytes: any) {
//   //   return String.fromCharCode.apply(null, new Uint8Array(bytes));
//   // }
//   // Function to render characteristics for a given service

//   const renderCharacteristicsForService = (serviceUUID: string) => {
//     const characteristics = peripheralData.characteristics ?? [];
//     return characteristics
//       .filter(char => char.service === serviceUUID)
//       .map((char, index) => (
//         <View key={index} style={styles.characteristicContainer}>
//           <Text style={styles.characteristicTitle}>
//             Characteristic: {char.characteristic}
//           </Text>
//           <Text>Properties: {Object.values(char.properties).join(', ')}</Text>
//         </View>
//       ));
//   };

//   return (
//     <ScrollView
//       style={styles.scrollViewStyle}
//       contentContainerStyle={styles.contentContainer}>
//       <Text style={styles.title}>Bluetooth Details</Text>
//       <Text style={styles.detail}>name: {peripheralData.name}</Text>
//       <Text style={styles.detail}>id: {peripheralData.id}</Text>
//       {/* <Text style={styles.detail}>rssi: {peripheralData.rssi}</Text> */}

//       {/* <Text style={[styles.title, styles.titleWithMargin]}>Advertising</Text> */}
//       <Text style={styles.detail}>
//         localName: {peripheralData.advertising.localName}
//       </Text>
//       {/* <Text style={styles.detail}>
//         txPowerLevel: {peripheralData.advertising.txPowerLevel}
//       </Text>
//       <Text style={styles.detail}>
//         isConnectable:{' '}
//         {peripheralData.advertising.isConnectable ? 'true' : 'false'}
//       </Text>
//       <Text style={styles.detail}>
//         serviceUUIDs: {peripheralData.advertising.serviceUUIDs}
//       </Text> */}

//       <Text style={[styles.title, styles.titleWithMargin]}>
//         Fuel Data
//       </Text>
//       <View>
//         <View>
//           <Text>Flow1 : {data?.flow1 ||""}ml </Text>
//           <Text>Flow2 :{data?.flow2 ||""}ml  </Text>
//           <Text>Time : {data?.time ||""}s </Text>

//           {/* <Text>Fuel:{ ||""}  </Text> */}
//         </View>
//       </View>

//       {/* <Text style={[styles.title, styles.titleWithMargin]}>
//         Services && Characteristics
//       </Text>
//       <View>
//         <View>
//           <Text>Fuel value1 : </Text>
//           <Text>Fuel value2 : </Text>
//         </View>
//       </View> */}
//       {/* {peripheralData.services?.map((service, index) => (
//         <View key={index} style={styles.serviceContainer}>
//           <Text style={styles.serviceTitle}>Service: {service.uuid}</Text>
//           {renderCharacteristicsForService(service.uuid)}
//         </View>
//       ))} */}
//     </ScrollView>
//   );
// };

// // Add some basic styling
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     // backgroundColor:'red'
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   titleWithMargin: {
//     marginTop: 20, // Adjust this value as needed
//   },
//   detail: {
//     marginTop: 5,
//     fontSize: 16,
//   },
//   serviceContainer: {
//     marginTop: 15,
//   },
//   serviceTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   characteristic: {
//     fontSize: 16,
//   },
//   scrollViewStyle: {
//     flex: 1,
//     backgroundColor: '#333',
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   characteristicContainer: {
//     marginTop: 10,
//   },
//   characteristicTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   propertyText: {
//     fontSize: 14,
//     marginLeft: 10,
//   },
// });

// export default PeripheralDetailsScreen;

// npx react-native run-android    ---- for android
// npx react-native run-ios    ---- for apple
