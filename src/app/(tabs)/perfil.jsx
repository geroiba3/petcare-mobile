import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, get } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { database, auth } from '../../firebaseConfig';

export default function PerfilScreen() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const uid = auth.currentUser.uid;
        const snapshot = await get(ref(database, `usuarios/${uid}`));

        if (snapshot.exists()) {
          setUsuario(snapshot.val());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarUsuario();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    router.replace('/');
  }

  if (loading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Mi Perfil</Text>

      {error && <Text style={styles.error}>Error: {error}</Text>}

      {usuario && (
        <View style={styles.card}>
          {usuario.foto && (
            <Image source={{ uri: usuario.foto }} style={styles.foto} />
          )}
          <Text style={styles.nombre}>{usuario.name}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.boton} onPress={handleLogout}>
        <Text style={styles.botonTexto}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#F97316' },
  error: { color: '#c0392b', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  foto: { width: 90, height: 90, borderRadius: 45, marginBottom: 14 },
  nombre: { fontSize: 18, fontWeight: '700' },
  email: { fontSize: 14, color: '#888', marginTop: 4 },
  boton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#c0392b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#c0392b',
    fontWeight: '700',
    fontSize: 16,
  },
});