import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


interface Alerta {
  id: number;
  descripcion: string;
  asesor_id: number;
  usuario_id: number;
  trimestre_id: number;
  fecha_creacion: string;
  asesor_nombre: string;
}

const AlertasScreen = () => {

  const [alertas, setAlertas] = useState<Alerta[]>([]);


  const bellShakeValue = useRef(new Animated.Value(0)).current;


  const BACKEND_URL = 'http://192.168.1.97:4000';
  

  const usuarioId = 1; 


  useEffect(() => {
    const bellShakeAnimation = Animated.sequence([
      Animated.timing(bellShakeValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(bellShakeValue, {
        toValue: -1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(bellShakeValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(bellShakeValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(bellShakeAnimation, { iterations: -1 }).start();
    return () => bellShakeAnimation.stop();
  }, []);

  const bellRotation = bellShakeValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  // =======================================================
  // 3) USEEFFECT PARA OBTENER ALERTAS (fetch)
  // =======================================================
  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const resp = await fetch(`${BACKEND_URL}/alertas/${usuarioId}`);
        const data = await resp.json();
        setAlertas(data);
      } catch (error) {
        console.error('🔥 Error al obtener alertas:', error);
      }
    };

    fetchAlertas();
  }, []);

  const handleLogout = () => {
    router.replace('/');
  };

  const showLogoutOption = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', onPress: handleLogout },
      ]
    );
  };


  const renderItem = ({ item }: { item: Alerta }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertCardContent}>
        <Ionicons name="alert-circle-outline" size={24} color="#666" style={styles.alertIcon} />
        <View style={styles.alertTextContainer}>
          <Text style={styles.alertTitle}>{`ID Alerta: ${item.id}`}</Text>
          <Text style={styles.alertSubtitle}>Descripción: {item.descripcion}</Text>
          <Text style={styles.alertSubtitle}>Asesor: {item.asesor_nombre}</Text>
          <Text style={styles.alertSubtitle}>Fecha: {item.fecha_creacion}</Text>
        </View>
      </View>
    </View>
  );

  // =======================================================
  // 6) RENDER PRINCIPAL
  // =======================================================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Sección de perfiles: al tocar la imagen se dispara el logout */}
      <View style={styles.profilesSection}>
        <TouchableOpacity 
          style={styles.profileContainer} 
          onPress={showLogoutOption}
        >
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Header con campana animada */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ rotate: bellRotation }] }}>
          <Ionicons name="notifications-outline" size={32} color="#000" />
        </Animated.View>
        <Text style={styles.alertasTitle}>Alertas</Text>
      </View>

      {/* Lista de Alertas */}
      <FlatList
        data={alertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ margin: 20, textAlign: 'center', color: '#666' }}>
            No hay alertas disponibles.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default AlertasScreen;

// =======================================================
// 7) ESTILOS
// =======================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  profilesSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  profileContainer: {
    marginLeft: 10,
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  alertasTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  alertCard: {
    backgroundColor: '#F9F9F9',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 12,
  },
  alertCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    marginRight: 10,
  },
  alertTextContainer: {
    flexShrink: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
