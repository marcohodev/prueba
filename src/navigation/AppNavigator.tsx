import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AccountsScreen } from '../screens/AccountsScreen';
import { AccountDetail } from '../screens/AccountDetail';
import { Account } from '../models/Account';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_KEY = 'selected_account_v1';

export default function AppNavigator() {
  const [selected, setSelected] = useState<Account | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SELECTED_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Account;
          setSelected(parsed);
        }
      } catch {
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (selected) {
          await AsyncStorage.setItem(SELECTED_KEY, JSON.stringify(selected));
        } else {
          await AsyncStorage.removeItem(SELECTED_KEY);
        }
      } catch {
      }
    })();
  }, [selected]);

  return (
    <View style={styles.container}>
      {selected ? (
        <AccountDetail account={selected} onBack={() => setSelected(null)} />
      ) : (
        <AccountsScreen onSelectAccount={(a) => setSelected(a)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
