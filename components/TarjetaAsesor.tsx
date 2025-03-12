import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AsesorCard = ({ nombre = "Asesor", cargo = "Gerente de crédito", telefono = "6141088379", imagenUrl = "https://randomuser.me/api/portraits/men/32.jpg" }) => {
  
  const handleLlamada = () => {
    Linking.openURL(`tel:${telefono}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={{ uri: imagenUrl }} 
          style={styles.avatar} 
        />
        <View style={styles.info}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.cargo}>{cargo}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.callButton}
        onPress={handleLlamada}
      >
        <Feather name="phone" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  info: {
    justifyContent: 'center',
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  cargo: {
    fontSize: 14,
    color: '#888',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default AsesorCard;