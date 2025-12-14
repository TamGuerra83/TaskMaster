// theme.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4F46E5',       // Azul Indigo moderno
    onPrimary: '#FFFFFF',     // Texto sobre azul
    secondary: '#10B981',     // Verde Esmeralda (para éxitos/completado)
    tertiary: '#F59E0B',      // Naranja (para pendientes/alertas)
    background: '#F1F5F9',    // Gris muy claro para el fondo (no blanco puro)
    surface: '#FFFFFF',       // Blanco puro para las tarjetas
    surfaceVariant: '#E2E8F0', // Gris suave para inputs
    error: '#EF4444',
  },
  roundness: 16, // Bordes más redondeados en toda la app
};