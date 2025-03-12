import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.97:4000/inicio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });
  
      const data = await response.json();
  
      console.log("Respuesta del servidor:", data);
  
      if (response.ok && data.usuario && data.usuario.id && data.usuario.nombre) {
        await AsyncStorage.setItem('userId', String(data.usuario.id));
        await AsyncStorage.setItem('userName', data.usuario.nombre);
  
        Alert.alert("Éxito", "Inicio de sesión exitoso");
        router.replace("/(tabs)/seguimiento-credito");
      } else {
        setError(data.mensaje || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setError('Error al conectar con el servidor.');
    }
  };
  

  return (
    <LinearGradient colors={['#ECE9F0', '#9400EE']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/loginlogo.png')} style={styles.logoImage} />
      </View>

      <Text style={styles.subtitle}>
        Seguir tu crédito nunca fue tan fácil como hacerlo con Ban Bajío
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#999"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 20,
    color: '#433',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '70%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 24,
    marginTop: 20,
  },
  buttonText: {
    color: '#B93A9C',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});