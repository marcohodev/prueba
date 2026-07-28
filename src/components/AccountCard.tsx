import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Account } from '../models/Account';

type Props = {
  account: Account;
  onPress?: (a: Account) => void;
};

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  } catch {
    return 'MX$' + value.toFixed(2);
  }
}

export const AccountCard: React.FC<Props> = ({ account, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress && onPress(account)}>
      <View>
        <Text style={styles.number}>{account.number}</Text>
        <Text style={styles.type}>{account.type}</Text>
      </View>
      <View>
        <Text style={styles.balance}>{formatCurrency(account.balance)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
  },
  number: { fontSize: 16, fontWeight: '600' },
  type: { fontSize: 13, color: '#666' },
  balance: { fontSize: 16, fontWeight: '700' },
});
