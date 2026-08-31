import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ref, get } from 'firebase/database';
import { database, auth } from '../../firebaseConfig';
import { TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';


export default function MascotasScreen() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
    async function cargarMascotas() {
      try {
        const uid = auth.currentUser.uid;
         console.log('UID en mascotas:', uid);
        const snapshot = await get(ref(database, `mascotas/${uid}`));

        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convertimos el objeto de Firebase en un array, guardando la key como id
          const lista = Object.entries(data).map(([id, valores]) => ({ id, ...valores }));
          setMascotas(lista);
        } else {
          setMascotas([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarMascotas();
  }, [])
  );


  if (loading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
  <Text style={styles.titulo}>Mis Mascotas</Text>
  <TouchableOpacity onPress={() => router.push('/mascota/agregar')}>
    <Ionicons name="add-circle" size={32} color="#F97316" />
  </TouchableOpacity>
</View>
      {mascotas.length === 0 ? (
        <Text style={styles.vacio}>Todavía no tenés mascotas cargadas.</Text>
      ) : (
        <FlatList
          data={mascotas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/mascota/${item.id}`)}>
              {item.foto && (
                <Image source={{ uri: item.foto }} style={styles.foto} />
              )}
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.detalle}>{item.especie} · {item.raza}</Text>
              </View>
            </TouchableOpacity>
       )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#F97316' },
  vacio: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 40 },
  error: { color: '#c0392b' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  foto: { width: 64, height: 64, borderRadius: 32, marginRight: 14 },
  info: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  detalle: { fontSize: 13, color: '#888' },
});