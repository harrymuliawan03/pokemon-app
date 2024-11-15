import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  FlatList,
} from 'react-native-gesture-handler';
import {PokemonDataModel, PokemonModel} from '../../models/pokemon.model';
import PokemonCard from '../../shared/components/PokemonCard';
import {pokemonStore} from '../../store/PokemonStore';
import axios from 'axios';
import {abbreviateLabel} from '../../shared/helpers/abbreviate-label';
import {useFocusEffect} from '@react-navigation/native';
import {capitalizeName} from '../../shared/helpers/capitalize-name';
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

const CompareScreen = () => {
  const [selectedPokemon1, setSelectedPokemon1] =
    useState<PokemonDataModel | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] =
    useState<PokemonDataModel | null>(null);
  const [triggerFetchData, setTriggerFetchData] = useState<boolean | null>(
    null,
  );
  const [currentDialog, setCurrentDialog] = useState<number>(1);
  const bottomSheetRef = useRef<any>(null);
  const [isOpen, setOpen] = useState(false);
  const flatListRef = useRef<any>(null);

  let currentOffset = 0;

  const handleScroll = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setCurrentOffset(offsetY);
  };

  const handlePokemonSelect = async (pokemon: PokemonModel, index: number) => {
    const completePokemonData = await axios.get(pokemon.url!);
    completePokemonData.data.imageUrl = pokemon.imageUrl;
    completePokemonData.data.name = capitalizeName(
      completePokemonData.data.name,
    );
    if (index === 1) {
      setSelectedPokemon1(completePokemonData.data);
    } else {
      setSelectedPokemon2(completePokemonData.data);
    }
    toggleSheet();
  };

  const renderFooter = () => {
    if (pokemonStore.loading) {
      return <ActivityIndicator size="large" color="#ff0000" />;
    } else {
      return null;
    }
  };

  const handleLoadMore = () => {
    setTriggerFetchData(!triggerFetchData);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: Math.max(currentOffset - 20, 0),
        animated: true,
      });

      setTimeout(() => {
        flatListRef.current.scrollToOffset({
          offset: Math.max(currentOffset + 20, 0),
          animated: true,
        });
      }, 300);
    }
  };

  const renderItem = ({item}: {item: PokemonModel}) => (
    <PokemonCard
      item={item}
      handlePress={() => handlePokemonSelect(item, currentDialog)}
    />
  );

  const renderBarChart = () => {
    let data;
    if (selectedPokemon1 && selectedPokemon2) {
      const choosenOne = selectedPokemon1.stats.map(stat => {
        return {
          value: stat.base_stat,
          label: stat.stat.name,
          frontColor: 'red',
        };
      });
      const choosenTwo = selectedPokemon2.stats.map(stat => {
        return {
          value: stat.base_stat,
          label: stat.stat.name,
          frontColor: 'blue',
        };
      });

      data = choosenOne.flatMap((stat1, index) => [
        {
          value: stat1.value,
          label: abbreviateLabel(stat1.label),
          spacing: 2,
          // labelWidth: 30,
          labelTextStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: 'black',
            lineHeight: 14,
          },
          frontColor: stat1.frontColor,
        },
        {
          value: choosenTwo[index].value,
          frontColor: choosenTwo[index].frontColor,
        },
      ]);
    }
    return (
      <BarChart
        data={data}
        width={Dimensions.get('window').width}
        height={220}
        barWidth={20}
        yAxisTextStyle={{
          fontSize: 12,
          fontWeight: 'bold',
          color: 'black',
          lineHeight: 14,
        }}
        stepValue={10}
        spacing={15}
        isAnimated
      />
    );
  };

  useFocusEffect(
    useCallback(() => {
      setSelectedPokemon1(null);
      setSelectedPokemon2(null);
      setCurrentDialog(1);
      setOpen(false);
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (triggerFetchData != null) {
      pokemonStore.fetchPokemon();
    }
  }, [triggerFetchData]);

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const accent = useSharedValue('#ff0000');
  const offset = useSharedValue(0);

  const toggleSheet = () => {
    setOpen(!isOpen);
    offset.value = 0;
  };

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

  const translateY = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));

  return (
    <GestureHandlerRootView style={styles.scrollContainer}>
      <View style={styles.selectedContainer}>
        <TouchableOpacity
          style={styles.pokemonCard}
          onPress={() => {
            setCurrentDialog(1);
            setSelectedPokemon1(null);
            setOpen(true);
            bottomSheetRef.current?.expand();
          }}>
          {selectedPokemon1 ? (
            <>
              <Image
                style={styles.pokemonImage}
                source={{uri: selectedPokemon1.imageUrl}}
              />
              <Text style={styles.pokemonName}>{selectedPokemon1.name}</Text>
            </>
          ) : (
            <Text>Select Pokemon 1</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pokemonCard}
          onPress={() => {
            setCurrentDialog(2);
            setSelectedPokemon2(null);
            setOpen(true);
            bottomSheetRef.current?.expand();
          }}>
          {selectedPokemon2 ? (
            <>
              <Image
                style={styles.pokemonImage}
                source={{uri: selectedPokemon2.imageUrl}}
              />
              <Text style={styles.pokemonName}>{selectedPokemon2.name}</Text>
            </>
          ) : (
            <Text>Select Pokemon 2</Text>
          )}
        </TouchableOpacity>
      </View>

      {renderBarChart()}
      {isOpen && (
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
                onScroll={event => {
                  currentOffset = event.nativeEvent.contentOffset.y;
                }}
                contentContainerStyle={{zIndex: 2}}
                onEndReached={handleLoadMore}
                ListFooterComponent={renderFooter}
              />
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  scrollContainer: {flexGrow: 1, justifyContent: 'center'},
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
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
    paddingVertical: 50,
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

export default CompareScreen;
