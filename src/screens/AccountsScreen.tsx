import React from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useAccounts } from '../hooks/useAccounts';
import { Account } from '../models/Account';
import { AccountCard } from '../components/AccountCard';

type Props = {
  onSelectAccount: (a: Account) => void;
};

export const AccountsScreen: React.FC<Props> = ({ onSelectAccount }) => {
  const { accounts, loading, error, refreshing, refresh, fromCache } = useAccounts();

  if (loading && !accounts) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading accounts...</Text>
      </View>
    );
  }

  if (error && !accounts) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
        <Text onPress={refresh} style={{ color: 'blue', marginTop: 8 }}>Tap to retry</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fromCache ? (
        <View style={styles.cacheBanner}>
          <Text style={{ color: '#444' }}>Mostrando datos en caché</Text>
        </View>
      ) : null}

      <FlatList
        data={accounts ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AccountCard account={item} onPress={onSelectAccount} />}
        refreshing={refreshing}
        onRefresh={refresh}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text>No accounts available.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f3f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cacheBanner: { padding: 8, alignItems: 'center' },
});
