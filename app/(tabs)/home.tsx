// app/(tabs)/home.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, Image } from 'react-native';
import { Text, FAB, IconButton, Checkbox, Surface, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ApiService } from '../../services/api'; 
import { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllTodos();
      const sorted = data.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
      setTasks(sorted);
    } catch (error) { Alert.alert("Error", "No se cargaron las tareas"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleToggle = async (task: Task) => {
    const original = [...tasks];
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));
    try { await ApiService.toggleTodo(task.id, task.completed); } 
    catch { setTasks(original); }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar", "¿Seguro?", [
      { text: "Cancelar" },
      { text: "Sí", style: 'destructive', onPress: async () => {
          await ApiService.deleteTodo(id);
          setTasks(prev => prev.filter(t => t.id !== id));
      }}
    ]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <Surface style={styles.card} elevation={2}>
      <View style={[styles.indicatorStrip, { backgroundColor: item.completed ? '#10B981' : '#F59E0B' }]} />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <IconButton
            icon={item.completed ? "check-circle" : "circle-outline"}
            iconColor={item.completed ? '#10B981' : '#CBD5E1'}
            size={24}
            onPress={() => handleToggle(item)}
            style={{ margin: 0 }}
          />
          <Text variant="titleMedium" style={[styles.taskTitle, item.completed && styles.taskTitleDone]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        {(item.photoUri || item.location) && (
          <View style={styles.metaRow}>
            {item.photoUri && <IconButton icon="image" size={12} style={{margin:0}} />}
            {item.location && <IconButton icon="map-marker" size={12} style={{margin:0}} />}
          </View>
        )}
      </View>
      {item.photoUri && <Image source={{ uri: item.photoUri }} style={styles.thumbnail} />}
      <IconButton icon="trash-can-outline" iconColor="#EF4444" size={20} onPress={() => handleDelete(item.id)}/>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{fontWeight: 'bold', color: '#1E293B'}}>Mis Tareas</Text>
        <IconButton icon="logout" onPress={signOut} />
      </View>

      {loading && tasks.length === 0 ? <ActivityIndicator style={{marginTop: 50}} /> : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={loading}
          onRefresh={loadTasks}
          ListEmptyComponent={<Text style={styles.emptyText}>No tienes tareas pendientes 🎉</Text>}
        />
      )}
      
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/create-task')} label="Nueva" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, marginBottom: 12, overflow: 'hidden' },
  indicatorStrip: { width: 6, height: '100%' },
  cardContent: { flex: 1, paddingVertical: 12, paddingHorizontal: 5 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  taskTitle: { flex: 1, fontWeight: '600', color: '#1E293B', marginLeft: 4 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#94A3B8' },
  metaRow: { flexDirection: 'row', marginLeft: 10, marginTop: 4 },
  thumbnail: { width: 50, height: 50, borderRadius: 8, marginRight: 10, backgroundColor: '#eee' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94A3B8' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#4F46E5' },
});