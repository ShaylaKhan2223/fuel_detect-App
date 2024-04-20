import {
  NativeEventEmitter,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {PureComponent, useState} from 'react';
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';

const SECONDS_TO_SCAN_FOR = 3;
const SERVICE_UUIDS= [];
const ALLOW_DUPLICATES = true;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Ble = () => {
  const [isScanning, setIsScanning] = useState(false);
  // Initialize state for peripherals    
  const [peripherals, setPeripherals] = useState(new Map());

  // Define startScan function
  const startScan = () => {
    if (!isScanning) {
      // Reset found peripherals before scan
      setPeripherals(new Map());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: 'Sticky', // Assuming BleScanMatchMode.Sticky is a string enum
          scanMode: 'LowLatency', // Assuming BleScanMode.LowLatency is a string enum
          callbackType: 'AllMatches', // Assuming BleScanCallbackType.AllMatches is a string enum
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  return (
    <View>
      <Pressable style={styles.scanButton} onPress={startScan}>
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
        </Text>
      </Pressable>
      <Text>Ble</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    // color: Colors.black,
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    flex: 1,
    // ...boxShadow,
  },
  scanButtonText: {
    fontSize: 16,
    letterSpacing: 0.25,
    // color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    // color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    // color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    // color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    // ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    // color: Colors.white,
  },
});
export default Ble;
