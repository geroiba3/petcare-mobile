import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ref, get } from 'firebase/database';
import { database, auth } from '../../firebaseConfig';
import { TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';


export default function turnoScreen() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
    async function cargarTurnos() {
      try {
        const uid = auth.currentUser.uid;
         console.log('UID en turno:', uid);
            const snapshot = await get(ref(database, `turnos/${uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convertimos el objeto de Firebase en un array, guardando la key como id
          const lista = Object.entries(data).map(([id, valores]) => ({ id, ...valores }));
          setTurnos(lista);
        } else {
          setTurnos([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarTurnos();
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
        <Text style={styles.titulo}>Mis Turnos</Text>
      {turnos.length === 0 ? (
        <Text style={styles.vacio}>Todavía no tenés turnos activos.</Text>
      ) : (
        <FlatList
          data={turnos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.mascota_nombre}</Text>
                <Text style={styles.detalle}>{item.fecha} · {item.hora}</Text>
                <Text style={styles.detalle}>{item.veterinaria_nombre}</Text>
                <Text style={styles.detalle}>{item.estado}</Text>
              </View>
            </View>
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