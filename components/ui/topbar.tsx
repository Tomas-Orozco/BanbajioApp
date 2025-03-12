import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/loginlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,               
    backgroundColor: '#9400EE', 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  logo: {
    width: 150,
    height: 40,
  },
});

export default TopBar;