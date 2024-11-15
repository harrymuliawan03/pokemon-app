import React from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector, FlatList} from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {pokemonStore} from '../../../store/PokemonStore';
import PokemonCard from '../../../shared/components/PokemonCard';
import {PokemonModel} from '../../../models/pokemon.model';

type ModalPokemonListProps = {
  toggleSheet: () => void;
  handlePokemonSelect: (pokemon: PokemonModel) => void;
  flatListRef: any;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleLoadMore: () => void;
  offset: Animated.SharedValue<number>;
};

const ModalPokemonList: React.FC<ModalPokemonListProps> = ({
  toggleSheet,
  handlePokemonSelect,
  flatListRef,
  handleScroll,
  handleLoadMore,
  offset,
}) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const pan = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value;

      const clamp = Math.max(-20, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < 500 / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(500, {}, () => {
          runOnJS(toggleSheet)();
        });
      }
    });

  const renderFooter = () => {
    if (pokemonStore.loading) {
      return <ActivityIndicator size="large" color="#ff0000" />;
    } else {
      return null;
    }
  };

  const renderItem = ({item}: {item: PokemonModel}) => (
    <PokemonCard item={item} handlePress={() => handlePokemonSelect(item)} />
  );

  const translateY = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));
  return (
    <>
      <AnimatedPressable
        style={styles.backdrop}
        entering={FadeIn}
        exiting={FadeOut}
        onPress={toggleSheet}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.sheet, translateY]}
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown}>
          <View style={styles.dialogHeader}>
            <Text style={styles.dialogTitle}>Choose Pokemon</Text>
            <TouchableOpacity onPress={toggleSheet}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={pokemonStore.pokemonData}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onScroll={handleScroll}
            contentContainerStyle={{zIndex: 2}}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
          />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
  pokemonCard: {
    width: '45%',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  pokemonImage: {width: 50, height: 50},
  pokemonName: {fontWeight: 'bold', marginTop: 10},
  bottomSheetContainer: {padding: 20, backgroundColor: '#f0f0f0'},
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  dialogTitle: {fontSize: 18, fontWeight: 'bold'},
  closeButton: {color: 'blue'},
  pokemonList: {marginTop: 10},
  pokemonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
  },
  sheet: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    height: 500,
    width: '100%',
    position: 'absolute',
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
});

export default ModalPokemonList;
