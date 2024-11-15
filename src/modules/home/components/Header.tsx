import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Header = () => (
  <LinearGradient colors={['#3B4CCA', '#1A237E']} style={styles.header}>
    <View style={styles.headerContent}>
      <Image
        source={require('../../../../assets/images/pokemon-icon.png')}
        style={styles.icon}
      />
      <Text style={styles.title}>PokeApp - Harry Muliawan</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 1.5,
  },
});

export default Header;
