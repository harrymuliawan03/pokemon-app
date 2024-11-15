/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import axios from 'axios';
import {BarChart} from 'react-native-gifted-charts';
import {Dimensions} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SvgUri} from 'react-native-svg';
import {RootStackParamList} from '../../types/navigation';
import {Ability, PokemonDataModel} from '../../models/pokemon.model';
import {typeColorMap} from '../../constants/background_color';
import {fontFamilies} from '../../constants/font';
import {abbreviateLabel} from '../../shared/helpers/abbreviate-label';
import {capitalizeName} from '../../shared/helpers/capitalize-name';

type PokemonDetailRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;

interface PokemonDetailProps {
  route: PokemonDetailRouteProp;
  navigation: any;
}

const PokemonDetailScreen: React.FC<PokemonDetailProps> = ({navigation}) => {
  const {pokemonUrl} = useRoute<PokemonDetailRouteProp>().params;
  const [data, setData] = useState<PokemonDataModel | null>(null);
  const [loading, setLoading] = useState(true);

  const scaleAnimImage = useRef(new Animated.Value(0)).current;
  const scaleAnimSvg = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPokemonDetail();
  }, []);

  const fetchPokemonDetail = async () => {
    try {
      const response = await axios.get(pokemonUrl);

      const abilitiesData = await Promise.all(
        response.data.abilities.map(async (item: Ability) => {
          const fetchAbility = await fetch(item.ability.url);
          const abilityData = await fetchAbility.json();
          const description = abilityData.effect_entries.find((entry: any) => {
            return entry.language.name === 'en';
          })?.effect;

          return {
            name: capitalizeName(item.ability.name),
            description: description || 'No description available.',
          };
        }),
      );

      response.data.abilities = abilitiesData;
      setData(response.data);
      setLoading(false);
      Animated.spring(scaleAnimImage, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();

      Animated.spring(scaleAnimSvg, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff0000" />;
  }

  if (!data) {
    return <Text>Error loading data</Text>;
  }

  const {name, height, weight, types, stats, abilities, sprites} = data;

  const backgroundColor =
    typeColorMap[types[0].type.name] || typeColorMap.default;

  // Stats data for bar chart
  const statsData = stats.map(stat => ({
    value: stat.base_stat,
    label: abbreviateLabel(stat.stat.name),
    frontColor: backgroundColor,
    labelColor: '#ffffff',
  }));

  return (
    <ScrollView contentContainerStyle={[styles.container, {backgroundColor}]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../assets/images/back-icon.png')}
          // style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Text>

      <View style={styles.contentContainer}>
        {/* Pokemon Sprites */}
        <Animated.Image
          source={{uri: sprites.front_default}}
          style={[styles.spriteImage, {transform: [{scale: scaleAnimImage}]}]}
        />
        <Animated.View
          style={[
            {
              transform: [{scale: scaleAnimSvg}],
            },
            styles.spriteSvg,
          ]}>
          <SvgUri
            uri={sprites.other.dream_world.front_default}
            width={170}
            height={170}
          />
        </Animated.View>

        {/* Pokemon Information */}
        <Text style={[styles.sectionTitle, {color: backgroundColor}]}>
          Information
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <Text style={styles.infoSubtitle}>{height / 10} M</Text>
            <Text style={styles.infoTitle}>Height</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Types</Text>
            <View
              style={{flexDirection: 'column', alignItems: 'center', gap: 5}}>
              {types.map((type, index) => {
                const backgroundColorType = typeColorMap[type.type.name];
                const typeName =
                  type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1);
                return (
                  <Text
                    key={index}
                    style={[
                      styles.typeText,
                      {backgroundColor: backgroundColorType},
                    ]}>
                    {typeName}
                  </Text>
                );
              })}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoCard}>
            <Text style={styles.infoSubtitle}>{weight} Kg</Text>
            <Text style={styles.infoTitle}>Weight</Text>
          </View>
        </View>

        {/* Pokemon Stats */}
        <Text style={[styles.sectionTitle, {color: backgroundColor}]}>
          Stats
        </Text>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-start',
            overflow: 'hidden',
          }}>
          <BarChart
            data={statsData}
            width={Dimensions.get('window').width - 40}
            height={220}
            barWidth={30}
            spacing={20}
            yAxisThickness={2}
            xAxisLabelTextStyle={{
              fontSize: 12,
              fontWeight: 'bold',
              color: 'black',
              lineHeight: 14,
            }}
            yAxisTextStyle={{
              fontSize: 12,
              fontWeight: 'bold',
              color: 'black',
              lineHeight: 14,
            }}
            pointerConfig={{
              strokeDashArray: [2, 5],
              pointerColor: 'lightgray',
              radius: 0,
              pointerLabelWidth: 50,
              pointerLabelHeight: 120,
              pointerLabelComponent: (items: any) => {
                let typeName;
                switch (items[0].label) {
                  case 'H':
                    typeName = 'HP';
                    break;
                  case 'A':
                    typeName = 'Attack';
                    break;
                  case 'D':
                    typeName = 'Defense';
                    break;
                  case 'SA':
                    typeName = 'Sp. Attack';
                    break;
                  case 'SD':
                    typeName = 'Sp. Defense';
                    break;
                  case 'S':
                    typeName = 'Speed';
                    break;
                  default:
                    break;
                }
                return (
                  <View
                    style={{
                      height: 'auto',
                      width: 80,
                      zIndex: 9999,
                      backgroundColor: 'purple',
                      // position: 'absolute',
                      borderRadius: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}>
                    <Text style={{color: 'white', fontSize: 12}}>
                      {typeName}
                    </Text>
                    <Text style={{color: 'white', fontSize: 12}}>
                      {items[0].value}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Stat Abbreviations:</Text>
          <Text style={styles.noteText}>
            <Text style={styles.noteAbbreviation}>H</Text> = HP (Health Points){' '}
            {'\n'}
            <Text style={styles.noteAbbreviation}>A</Text> = Attack {'\n'}
            <Text style={styles.noteAbbreviation}>D</Text> = Defense {'\n'}
            <Text style={styles.noteAbbreviation}>SA</Text> = Special Attack{' '}
            {'\n'}
            <Text style={styles.noteAbbreviation}>SD</Text> = Special Defense{' '}
            {'\n'}
            <Text style={styles.noteAbbreviation}>S</Text> = Speed {'\n'}
          </Text>
        </View>

        {/* Pokemon Abilities */}
        <Text style={[styles.sectionTitle, {color: backgroundColor}]}>
          Abilities
        </Text>
        <View style={styles.abilitiesContainer}>
          {abilities?.map((ability, index) => (
            <View
              key={index}
              style={[styles.abilityContainer, {backgroundColor}]}>
              <Text style={styles.abilityName}>{ability.name}</Text>
              <View style={styles.divider} />
              <Text style={styles.abilityDesc}>{ability.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 120,
    marginHorizontal: 20,
    // maxWidth: Dimensions.get('window').width - 40,
    paddingVertical: 50,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spriteImage: {
    width: 170,
    height: 170,
    left: 10,
    top: -100,
    position: 'absolute',
  },
  spriteSvg: {
    position: 'absolute',
    right: 10,
    top: -110,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: fontFamilies.p2p,
    marginVertical: 10,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  infoSubtitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: 12,
  },
  divider: {height: '70%', borderWidth: 0.5, borderColor: '#a0a0a0'},
  noteContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noteAbbreviation: {
    fontWeight: 'bold',
    color: '#3B4CCA',
  },
  abilitiesContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  abilityContainer: {
    flexDirection: 'row',
    gap: 10,
    maxWidth: '100%',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  abilityName: {
    color: '#fff',
    width: '20%',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  abilityDesc: {
    color: '#fff',
    width: '70%',
    maxWidth: '70%',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

export default PokemonDetailScreen;
