import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {PokemonModel} from '../../models/pokemon.model';
import {fontFamilies} from '../../constants/font';

type PokemonCardProps = {
  item: PokemonModel;
  handlePress: () => void;
};

const PokemonCard: React.FC<PokemonCardProps> = ({item, handlePress}) => {
  return (
    <TouchableOpacity onPress={handlePress} style={styles.itemContainer}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: fontFamilies.p2p,
    textAlign: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
});

export default PokemonCard;
