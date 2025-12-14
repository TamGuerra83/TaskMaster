import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Avatar, Surface, Divider } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext'; 

export default function ProfileScreen() {
  const { signOut } = useAuth(); 
  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Avatar.Icon size={80} icon="account" style={{ backgroundColor: '#4F46E5' }} />
        <Text variant="headlineSmall" style={styles.name}>Usuario</Text>
        <Text variant="bodyMedium" style={styles.email}>Sesión Activa</Text>
      </Surface>

      <View style={styles.content}>
        <Button 
          mode="contained" 
          onPress={signOut} 
          icon="logout" 
          buttonColor="#EF4444"
          contentStyle={{ height: 50 }}
        >
          Cerrar Sesión
        </Button>
        
        <Divider style={{ marginVertical: 20 }} />
        <Text style={{ textAlign: 'center', color: '#94A3B8' }}>TaskMaster v2.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { alignItems: 'center', padding: 40, backgroundColor: 'white', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  name: { marginTop: 10, fontWeight: 'bold' },
  email: { color: '#64748B' },
  content: { padding: 20, marginTop: 20 },
});