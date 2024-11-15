import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PokemonCard from '../../../shared/components/PokemonCard';
import {PokemonModel} from '../../../models/pokemon.model';
import {pokemonStore} from '../../../store/PokemonStore';

type ModalPokemonListProps = {
  modalRef: React.MutableRefObject<any>;
  onClose: () => void;
  doClose: () => void;
  doSelect: (item: PokemonModel) => void;
};

const ModalPokemonList: React.FC<ModalPokemonListProps> = ({
  doSelect,
  modalRef,
  doClose,
  onClose,
}) => {
  const renderFooter = () => {
    if (pokemonStore.loading) {
      return <ActivityIndicator size="large" color="#ff0000" />;
    } else {
      return null;
    }
  };
  console.log('rebuild2');

  const handleLoadMore = () => {
    pokemonStore.fetchPokemon();
  };
  return (
    <GestureHandlerRootView>
      <BottomSheet
        ref={modalRef}
        snapPoints={['50%', '90%']}
        enablePanDownToClose
        onClose={onClose}>
        <View style={styles.dialogHeader}>
          <Text style={styles.dialogTitle}>Choose Pokemon</Text>
          <TouchableOpacity onPress={doClose}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
        <BottomSheetFlatList
          data={pokemonStore.pokemonData}
          style={{height: '100%', maxHeight: '100%'}}
          renderItem={({item}) => (
            <PokemonCard item={item} handlePress={() => doSelect(item)} />
          )}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  dialogTitle: {fontSize: 18, fontWeight: 'bold'},
  closeButton: {color: 'blue'},
});

export default ModalPokemonList;
