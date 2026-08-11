import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { router } from 'expo-router';


const API_URL = 'http://192.168.100.73:8000/api/login';

export default function LoginScreen() {
  const [email, setEmail] = useState('b@b');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);

 async function handleLogin() {
   console.log('1. Boton tocado');
   setLoading(true);
   setResultado(null);

   try {
     const response = await fetch(API_URL, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ email, password }),
     });
     console.log('2. Respuesta recibida, status:', response.status);

     const data = await response.json();
     console.log('3. Data parseada:', data);

     if (!response.ok) {
       setResultado({ tipo: 'error', mensaje: data.message || 'Error desconocido' });
       return;
     }

     console.log('4. Antes de signInWithCustomToken');
     const credencial = await signInWithCustomToken(auth, data.token);
     console.log('5. Logueado en Firebase, UID:', credencial.user.uid);

     router.push('/mascotas');
     console.log('6. Despues de router.push');

   } catch (error) {
     console.log('ERROR CAPTURADO:', error.message);
     setResultado({ tipo: 'error', mensaje: `Error: ${error.message}` });
   } finally {
     setLoading(false);
   }
 }


  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PetCare</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Ingresar</Text>
        )}
      </TouchableOpacity>

      {resultado && (
        <Text style={[styles.resultado, resultado.tipo === 'error' && styles.resultadoError]}>
          {resultado.mensaje}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fafafa',
  },
  titulo: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: '#F97316',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultado: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#e6f7e6',
    borderRadius: 12,
    fontSize: 13,
  },
  resultadoError: {
    backgroundColor: '#fce8e8',
    color: '#c0392b',
  },
});
