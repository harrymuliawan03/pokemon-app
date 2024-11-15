import React from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../../modules/home/components/Header';
import PokemonList from '../../modules/home/components/PokemonList';

const HomeScreen = () => (
  <View style={styles.container}>
    <Header />
    <PokemonList />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
