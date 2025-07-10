import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Entypo from '@expo/vector-icons/Entypo';

// Screens
import Login from './screens/Login';
import Home from './screens/Home';
import Freind from './screens/Freind';
import NewScreen from './screens/NewScreen';
import Tripping from './screens/Tripping';
import PropertyDetails from './screens/Properties/PropertyDetails';

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    <Stack.Screen name="NewScreen" component={NewScreen} />
    <Stack.Screen name="PropertyDetails" component={PropertyDetails} />

  </Stack.Navigator>
);





const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen name="Triping" component={Tripping} />

    <Tab.Screen name="Freind" component={Freind} />
  </Tab.Navigator>
);

const MainAppNavigator = () => (
  <Drawer.Navigator screenOptions={{ headerShown: true }}>
    <Drawer.Screen name="Home" component={HomeNavigator} />
  </Drawer.Navigator>
);




export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="MainApp" component={MainAppNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

