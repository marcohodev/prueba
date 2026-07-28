import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Account } from '../models/Account';

type Props = {
  account: Account;
  onBack: () => void;
};

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  } catch {
    return 'MX$' + value.toFixed(2);
  }
}

export const AccountDetail: React.FC<Props> = ({ account, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={{ color: 'blue' }}>{'<'} Back</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.label}>Número</Text>
        <Text style={styles.value}>{account.number}</Text>

        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.value}>{account.type}</Text>

        <Text style={styles.label}>Saldo</Text>
        <Text style={styles.value}>{formatCurrency(account.balance)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: '#f2f3f5' },
  back: { paddingHorizontal: 12, paddingVertical: 6 },
  card: { margin: 12, padding: 16, backgroundColor: 'white', borderRadius: 8 },
  label: { color: '#666', marginTop: 12 },
  value: { fontSize: 16, fontWeight: '700' },
});
