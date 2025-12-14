import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { ApiService } from '../../services/api';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert("Error", "Se requiere permiso de cámara");
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5, allowsEditing: true });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const getLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Aviso", "Ubicación denegada, usando default.");
      setLocation({ latitude: 0, longitude: 0 });
    } else {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title || !imageUri) return Alert.alert("Falta información", "Título y foto son obligatorios");
    
    setLoading(true);
    try {
      // 1. Subir imagen
      const cloudUrl = await ApiService.uploadImage(imageUri);
      // 2. Crear tarea con la URL de la nube
      const finalLocation = location || { latitude: 0, longitude: 0 };
      await ApiService.createTodo(title, cloudUrl, finalLocation);
      
      Alert.alert("¡Listo!", "Tarea creada");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.form} elevation={2}>
        <TextInput label="Título" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
        
        <Text style={styles.label}>Evidencia:</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <Button icon="camera" mode="outlined" onPress={takePhoto}>Tomar Foto</Button>
        )}

        <Text style={styles.label}>Ubicación:</Text>
        {location ? (
          <Text style={{color:'green', marginBottom: 10}}>📍 {location.latitude}, {location.longitude}</Text>
        ) : (
          <Button icon="crosshairs-gps" mode="outlined" loading={loading} onPress={getLocation}>Obtener GPS</Button>
        )}

        <Button mode="contained" onPress={handleSave} loading={loading} style={styles.saveBtn} disabled={loading}>
          Guardar Tarea
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  form: { padding: 20, backgroundColor: 'white', borderRadius: 15 },
  input: { marginBottom: 20, backgroundColor: 'white' },
  label: { marginTop: 15, marginBottom: 5, fontWeight: 'bold', color: '#555' },
  preview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  saveBtn: { marginTop: 30, backgroundColor: '#4F46E5' },
});