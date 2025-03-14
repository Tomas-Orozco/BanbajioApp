import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface HistorialItem {
  id: number;
  trimestre_id: number;
  trimestre_nombre: string;
  descripcion: string;
  total_credito_asignado: number;
  monto_gastado: number;
  porcentaje: number;
}

export default function HistorialComprobantes() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [creditoAsignado, setCreditoAsignado] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const BACKEND_URL = 'http://192.168.68.117:4000';
  const router = useRouter();

  useEffect(() => {
    const obtenerUsuarioId = async () => {
      const id = await AsyncStorage.getItem('userId');
      if (id) {
        setUsuarioId(Number(id));
      } else {
        Alert.alert('Error', 'No se encontró el ID de usuario. Inicia sesión nuevamente.');
        router.replace('/');
      }
    };

    obtenerUsuarioId();
  }, []);

  const fetchHistorial = async () => {
    if (!usuarioId) return;

    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/comprobantes/${usuarioId}`);
      const data = await response.json();
      setHistorial(data);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditoAsignado = async () => {
    if (!usuarioId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/usuarios/user/${usuarioId}`);
      const data = await response.json();
      setCreditoAsignado(data.credito_asignado);
    } catch (error) {
      console.error('Error al obtener el crédito asignado:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistorial();
      fetchCreditoAsignado();
    }, [usuarioId])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Historial de tus Comprobantes</Text>
        <TouchableOpacity onPress={showLogoutOption}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.creditoContainer}>
        <Text style={styles.creditoLabel}>Crédito Asignado:</Text>
        <Text style={styles.creditoValor}>
          {creditoAsignado !== null ? `$${creditoAsignado.toLocaleString()}` : 'Cargando...'}
        </Text>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando historial...</Text>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.trimestre_id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay comprobantes disponibles.</Text>}
          renderItem={({ item }) => {
            const montoGastado = item.monto_gastado || 0;
            const totalCredito = item.total_credito_asignado || 0
            const porcentajeCalculado = ((montoGastado / 100000 ) * 100).toFixed(2);
            
            return (
              <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <Text style={styles.trimestreTitle}>Trimestre {item.trimestre_nombre}</Text>
                  <Text style={styles.montoGastado}>{montoGastado.toLocaleString()}$</Text>
                </View>
                <Text style={styles.descripcionText}>{item.descripcion}</Text>
                <View style={styles.rowInfo}>
                  <View>
                    <Text style={styles.infoLabel}>Total</Text>
                    <Text style={styles.infoValue}>{totalCredito.toLocaleString()} crédito</Text>
                  </View>
                  <View style={styles.porcentajeContainer}>
                    <Text style={styles.porcentajeText}>{porcentajeCalculado}%</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Number(porcentajeCalculado)}%` }]} />


                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  creditoContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  creditoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trimestreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  montoGastado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  descripcionText: {
    color: '#555',
    marginTop: 4,
    marginBottom: 10,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#777',
    fontSize: 13,
  },
  infoValue: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  porcentajeContainer: {
    backgroundColor: '#E8FFF1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  porcentajeText: {
    color: 'green',
    fontWeight: '600',
  },
  progressBar: {
    backgroundColor: '#EEE',
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 2,
  },
});
