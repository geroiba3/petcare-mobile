import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ref, get } from 'firebase/database';
import { useLocalSearchParams } from 'expo-router';
import { database, auth } from '../../../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DetalleMascotaScreen() {
 const {id} = useLocalSearchParams();
  const [mascota, setMascota] = useState(null);S
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarMascota() {
      try {
        const uid = auth.currentUser.uid;
        const snapshot = await get(ref(database, `mascotas/${uid}/${id}`));
        if (snapshot.exists()){
            setMascota(snapshot.val());
            }else {
                setError }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }


    cargarMascota();
  }, [id]);

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
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.volver} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#F97316" />
        <Text style={styles.volverTexto}>Volver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editarBoton} onPress={() => router.push(`/mascota/${id}/editar`)}>
        <Text style={styles.editarTexto}>Editar</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        {mascota.foto && (
          <Image source={{ uri: mascota.foto }} style={styles.foto} />
        )}

        <Text style={styles.nombre}>{mascota.nombre}</Text>

        <View style={styles.fila}>
          <Text style={styles.label}>Especie</Text>
          <Text style={styles.valor}>{mascota.especie}</Text>
        </View>

        {mascota.sexo && (
          <View style={styles.fila}>
            <Text style={styles.label}>Sexo</Text>
            <Text style={styles.valor}>{mascota.sexo === 'macho' ? 'Macho' : 'Hembra'}</Text>
          </View>
        )}

        {mascota.raza && (
          <View style={styles.fila}>
            <Text style={styles.label}>Raza</Text>
            <Text style={styles.valor}>{mascota.raza}</Text>
          </View>
        )}

        {mascota.fecha_nacimiento && (
          <View style={styles.fila}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <Text style={styles.valor}>{mascota.fecha_nacimiento}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#c0392b', fontSize: 15 },
  volver: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  volverTexto: { color: '#F97316', fontSize: 16, marginLeft: 6, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  foto: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  nombre: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: { color: '#888', fontSize: 14 },
  valor: { fontWeight: '600', fontSize: 14 },
  editarBoton: {
    backgroundColor: '#F97316',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  editarTexto: { color: '#fff', fontWeight: '700' },
});