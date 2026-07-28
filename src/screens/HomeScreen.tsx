import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { fetchPosts } from '../services/api';

type Post = { id: number; title: string; body: string };

export function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async (isRefresh = false, signal?: AbortSignal) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const result = await fetchPosts({ signal });
      setPosts(result as Post[]);
    } catch (requestError: any) {
      if (requestError.name !== 'AbortError') {
        setError('No se pudieron cargar los datos.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadPosts(false, controller.signal);

    return () => controller.abort();
  }, [loadPosts]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadPosts(true)} tintColor={'#38bdf8'} />}
    >
      <View style={styles.hero}>
        <Text style={styles.kicker}>Expo starter</Text>
        <Text style={styles.title}>Base visual + peticiones</Text>
        <Text style={styles.subtitle}>
          Pantalla inicial simple, estado de carga, manejo de error y un helper reutilizable para requests.
        </Text>

        <Pressable style={styles.button} onPress={() => loadPosts(true)}>
          <Text style={styles.buttonText}>Recargar datos</Text>
        </Pressable>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{posts.length}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{loading ? '...' : 'OK'}</Text>
          <Text style={styles.statLabel}>Estado</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color={'#38bdf8'} />
          <Text style={styles.stateText}>Cargando contenido...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.stateCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.secondaryButton} onPress={() => loadPosts()}>
            <Text style={styles.secondaryButtonText}>Intentar otra vez</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error
        ? posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postBody}>{post.body}</Text>
            </View>
          ))
        : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  hero: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#243244',
    gap: 12,
  },
  kicker: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0ea5e9',
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#1f2937',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 4,
    color: '#94a3b8',
  },
  stateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#111827',
    gap: 12,
  },
  stateText: {
    color: '#f8fafc',
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#243244',
  },
  secondaryButtonText: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  postCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#243244',
    gap: 8,
  },
  postTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  postBody: {
    color: '#94a3b8',
    lineHeight: 21,
  },
});
