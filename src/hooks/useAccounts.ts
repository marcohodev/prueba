import { useEffect, useState, useCallback } from 'react';
import { Account } from '../models/Account';
import { fetchAccounts } from '../services/accountService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'accounts_cache_v1';
const CACHE_TTL = 1000 * 60 * 5;

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [fromCache, setFromCache] = useState<boolean>(false);

  const saveCache = async (data: Account[]) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch {
    }
  };

  const readCache = async (): Promise<Account[] | null> => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed?.data) return null;
      return parsed.data as Account[];
    } catch {
      return null;
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFromCache(false);
    try {
      const data = await fetchAccounts();
      setAccounts(data);
      saveCache(data);
    } catch (e: any) {
      const cached = await readCache();
      if (cached) {
        setAccounts(cached);
        setFromCache(true);
        setError('Error fetching fresh data, showing cached values: ' + (e.message ?? ''));
      } else {
        setError(e.message ?? 'Unknown error');
        setAccounts(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    setFromCache(false);
    try {
      const data = await fetchAccounts();
      setAccounts(data);
      await saveCache(data);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const cached = await readCache();
      if (cached) {
        setAccounts(cached);
        setFromCache(true);
      }
      await load();
    })();
  }, [load]);

  return { accounts, loading, error, refreshing, refresh, reload: load, fromCache };
}
