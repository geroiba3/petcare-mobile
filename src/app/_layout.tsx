import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="mascota/agregar" />
      <Stack.Screen name="mascota/[id]/index" />
      <Stack.Screen name="mascota/[id]/editar" />
    </Stack>
  );
}