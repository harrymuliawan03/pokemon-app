import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './src/screens/home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CompareScreen from './src/screens/compare';
import {Image, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PokemonDetailScreen from './src/screens/detail-pokemon';
import {RootStackParamList} from './src/types/navigation';
import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const PokemonStack = () => {
  return (
    <Stack.Navigator initialRouteName="PokemonList">
      <Stack.Screen
        name="PokemonList"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
enableScreens();

AppRegistry.registerComponent('PokemonApps', () => App);
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconSource;

            if (route.name === 'Home') {
              iconSource = focused
                ? require('./assets/images/home-icon-active.png')
                : require('./assets/images/home-icon.png');
            } else if (route.name === 'Compare') {
              return (
                <View style={{flexDirection: 'row', gap: 3}}>
                  <Image
                    source={require('./assets/images/pokemon-icon.png')}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                  />
                  <Image
                    source={require('./assets/images/pokemon-icon.png')}
                    style={{width: 24, height: 24}}
                    resizeMode="contain"
                  />
                </View>
              );
            }

            return (
              <Image
                source={iconSource}
                style={{width: 24, height: 24}}
                resizeMode="contain"
              />
            );
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
          headerShown: false,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen
          name="Home"
          component={PokemonStack}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('PokemonList');
            },
          })}
        />
        <Tab.Screen name="Compare" component={CompareScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
