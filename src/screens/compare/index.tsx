import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PokemonDataModel, PokemonModel} from '../../models/pokemon.model';
import {pokemonStore} from '../../store/PokemonStore';
import axios from 'axios';
import {abbreviateLabel} from '../../shared/helpers/abbreviate-label';
import {useFocusEffect} from '@react-navigation/native';
import {capitalizeName} from '../../shared/helpers/capitalize-name';
import {useSharedValue} from 'react-native-reanimated';
import NotesStat from '../../shared/components/NotesStat';
import ModalPokemonList from '../../modules/compare/components/ModalPokemonList';

const CompareScreen = () => {
  const [selectedPokemon1, setSelectedPokemon1] =
    useState<PokemonDataModel | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] =
    useState<PokemonDataModel | null>(null);
  const [triggerFetchData, setTriggerFetchData] = useState<boolean | null>(
    null,
  );

  // State for modal bottom sheet
  const [currentDialog, setCurrentDialog] = useState<number>(1);
  const [isOpen, setOpen] = useState(false);
  const flatListRef = useRef<any>(null);
  const offset = useSharedValue(0);
  let currentOffsetModal = 0;

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

  const handleLoadMore = () => {
    setTriggerFetchData(!triggerFetchData);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: Math.max(currentOffsetModal - 20, 0),
        animated: true,
      });

      setTimeout(() => {
        flatListRef.current.scrollToOffset({
          offset: Math.max(currentOffsetModal + 20, 0),
          animated: true,
        });
      }, 300);
    }
  };

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
        width={Dimensions.get('window').width / 1.3}
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

  const toggleSheet = () => {
    setOpen(!isOpen);
    offset.value = 0;
  };

  return (
    <GestureHandlerRootView style={styles.scrollContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('./../../../assets/images/bg-pokemon-3.png')}
          style={{
            width: Dimensions.get('window').width,
            objectFit: 'contain',
          }}
        />
        <Text style={styles.title}>Compare</Text>

        <View style={styles.container}>
          <View style={styles.selectedContainer}>
            <TouchableOpacity
              style={[
                styles.pokemonCard,
                {backgroundColor: 'background-color: rgba(255, 0, 0, 0.5)'},
              ]}
              onPress={() => {
                setCurrentDialog(1);
                setSelectedPokemon1(null);
                setOpen(true);
              }}>
              {selectedPokemon1 ? (
                <>
                  <Image
                    style={styles.pokemonImage}
                    source={{uri: selectedPokemon1.imageUrl}}
                  />
                  <Text style={styles.pokemonName}>
                    {selectedPokemon1.name}
                  </Text>
                </>
              ) : (
                <Text style={styles.pokemonSelect}>Select Pokemon 1</Text>
              )}

              {/* Pointer */}
              {selectedPokemon1 && selectedPokemon2 && (
                <View style={[styles.pointer, {backgroundColor: 'red'}]} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pokemonCard,
                {backgroundColor: 'rgba(0, 0, 255, 0.6)'},
              ]}
              onPress={() => {
                setCurrentDialog(2);
                setSelectedPokemon2(null);
                setOpen(true);
              }}>
              {selectedPokemon2 ? (
                <>
                  <Image
                    style={styles.pokemonImage}
                    source={{uri: selectedPokemon2.imageUrl}}
                  />
                  <Text style={styles.pokemonName}>
                    {selectedPokemon2.name}
                  </Text>
                </>
              ) : (
                <Text style={styles.pokemonSelect}>Select Pokemon 2</Text>
              )}

              {/* Pointer */}
              {selectedPokemon1 && selectedPokemon2 && (
                <View style={[styles.pointer, {backgroundColor: 'blue'}]} />
              )}
            </TouchableOpacity>
          </View>

          {/* Bar Chart Comparison */}
          {renderBarChart()}

          {/* Notes */}
          {selectedPokemon1 && selectedPokemon2 && <NotesStat />}
        </View>
      </ScrollView>

      {/* Modal Pokemon List */}
      {isOpen && (
        <ModalPokemonList
          flatListRef={flatListRef}
          toggleSheet={toggleSheet}
          handlePokemonSelect={item => handlePokemonSelect(item, currentDialog)}
          handleLoadMore={handleLoadMore}
          handleScroll={event =>
            (currentOffsetModal = event.nativeEvent.contentOffset.y)
          }
          offset={offset}
        />
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 209, 29, 0.1)',
  },
  container: {
    maxWidth: Dimensions.get('window').width,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -10,
  },
  selectedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
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
  pointer: {
    height: 13,
    width: 13,
    borderRadius: 13,
    position: 'absolute',
    bottom: -25,
    borderWidth: 2,
    borderColor: 'black',
  },
  pokemonCard: {
    width: '45%',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  pokemonSelect: {fontWeight: 'bold', color: 'white'},
  pokemonImage: {width: 100, height: 100},
  pokemonName: {
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white',
    fontSize: 16,
  },
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
