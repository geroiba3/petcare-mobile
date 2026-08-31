import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, push } from 'firebase/database';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { database, auth } from '../../firebaseConfig';

export default function AgregarMascotaScreen() {


  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [sexo, setSexo] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);



  async function handleGuardar() {
    setGuardando(true);
    setError(null);

    try {
      const uid = auth.currentUser.uid;
      await push(ref(database, `mascotas/${uid}`), {
        nombre,
        especie,
        sexo,
        raza,
        fecha_nacimiento: fechaNacimiento,
      });

      router.back();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TouchableOpacity style={styles.volver} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F97316" />
          <Text style={styles.volverTexto}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Agregar mascota</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" />

        <Text style={styles.label}>Especie</Text>
        <TextInput style={styles.input} value={especie} onChangeText={setEspecie} placeholder="perro, gato, ave..." autoCapitalize="none" />

        <Text style={styles.label}>Sexo</Text>
        <View style={styles.opciones}>
          <TouchableOpacity
            style={[styles.opcion, sexo === 'macho' && styles.opcionActiva]}
            onPress={() => setSexo('macho')}
          >
            <Text style={[styles.opcionTexto, sexo === 'macho' && styles.opcionTextoActivo]}>Macho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.opcion, sexo === 'hembra' && styles.opcionActiva]}
            onPress={() => setSexo('hembra')}
          >
            <Text style={[styles.opcionTexto, sexo === 'hembra' && styles.opcionTextoActivo]}>Hembra</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Raza</Text>
        <TextInput style={styles.input} value={raza} onChangeText={setRaza} placeholder="Raza (opcional)" />

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TextInput
          style={styles.input}
          value={fechaNacimiento}
          onChangeText={setFechaNacimiento}
          placeholder="AAAA-MM-DD"
        />

        <TouchableOpacity style={styles.boton} onPress={handleGuardar} disabled={guardando}>
          {guardando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  volver: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  volverTexto: { color: '#F97316', fontSize: 16, marginLeft: 6, fontWeight: '600' },
  titulo: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  error: { color: '#c0392b', marginBottom: 12 },
  label: { fontSize: 13, color: '#888', marginBottom: 6, marginTop: 12, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  opciones: { flexDirection: 'row', gap: 10 },
  opcion: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  opcionActiva: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  opcionTexto: { color: '#333', fontWeight: '600' },
  opcionTextoActivo: { color: '#fff' },
  boton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  botonTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});