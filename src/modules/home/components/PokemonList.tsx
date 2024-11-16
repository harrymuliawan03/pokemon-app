import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {pokemonStore} from '../../../store/PokemonStore';
import {RootStackParamList} from '../../../types/navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import PokemonCard from '../../../shared/components/PokemonCard';

const PokemonList = observer(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    setLoading(true);
    pokemonStore.fetchPokemon().then(() => {
      setLoading(false);
    });
  }, []);

  const renderFooter = () => {
    if (pokemonStore.loading) {
      return <ActivityIndicator size="large" color="#ff0000" />;
    } else {
      return null;
    }
  };

  const handleLoadMore = () => {
    pokemonStore.fetchPokemon();
  };

  const handlePress = (pokemon: string) => {
    navigation.navigate('PokemonDetail', {pokemonUrl: pokemon});
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#ff0000" />
      </View>
    );
  }

  return (
    <FlatList
      data={pokemonStore.pokemonData}
      renderItem={({item}) => (
        <PokemonCard item={item} handlePress={() => handlePress(item.url!)} />
      )}
      ListFooterComponent={renderFooter}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={styles.row}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );
});

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
});

export default PokemonList;
