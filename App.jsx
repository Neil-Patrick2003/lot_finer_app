import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Entypo from '@expo/vector-icons/Entypo';
import CustomDrawerContent from './components/CustomDrawerContent';
import Ionicons from '@expo/vector-icons/Ionicons';
import PropertyListingScreen from './components/ListProperty';


// Screens
import Login from './screens/Login';
import Home from './screens/Home';
import Me from './screens/Me';
import NewScreen from './screens/NewScreen';
import Tripping from './screens/Tripping';
import PropertyDetails from './screens/Properties/PropertyDetails';
import EditProfile from './screens/Me/EditProfile';
import MyInquiries from './screens/Me/MyInquiries';
import Notifications from './screens/Me/Notifications';
import PrivacyPolicy from './screens/Me/PrivacyPolicy'; 
import SavedProperties from './screens/Me/SavedProperties';
import Handle from './screens/Handle'; // Import the new Handle screen


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ActivityIndicator, View } from 'react-native';
import Inquiries from './screens/Tripping/Inquiries';
import ShowProperty from './screens/HandleProperty/ShowProperty';
import Chat from './screens/Chat/Chat';
import SingleChat from './screens/Chat/SingleChat';


const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HomeNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    <Stack.Screen name="NewScreen" component={NewScreen} />
    <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
    <Stack.Screen name="Inquiries" component={Inquiries} />
    <Stack.Screen name="ShowProperty" component={ShowProperty} />
    <Stack.Screen name="PropertyListing" component={PropertyListingScreen} />
    <Stack.Screen name="EditProfile" component={EditProfile} />  
    <Stack.Screen name="MyInquiries" component={MyInquiries} /> 
    <Stack.Screen name="Notifications" component={Notifications} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <Stack.Screen name="SavedProperties" component={SavedProperties} />     
    {/* <Stack.Screen name="SingleChat" component={SingleChat} /> */}

  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#5B7931', // Set the active tab color to your main color
      tabBarInactiveTintColor: '#555', // Optional: Set the inactive tab color
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tripping" // Corrected from "Triping" to "Tripping"
      component={Tripping}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="calendar" size={size} color={color} />
        ),
      }}
    />
    {/* <Tab.Screen
      name="Chat" // Corrected from "Triping" to "Tripping"
      component={Chat}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-ellipses" size={size} color={color} />
        ),
      }}
    /> */}
    <Tab.Screen
      name="Handle" // New Handle tab
      component={Handle}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="tools" size={size} color={color} /> // You can choose an appropriate icon
        ),
      }}
    />
    <Tab.Screen
      name="Me"
      component={Me}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="user" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const MainAppNavigator = () => (
  <Drawer.Navigator
    screenOptions={{ headerShown: true }}
  >
    <Drawer.Screen name="Home" component={HomeNavigator} />
    {/* Add more drawer screens if needed */}
  </Drawer.Navigator>
);

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setInitialRoute('MainApp');
        } else {
          setInitialRoute('Login');
        }
      } catch (err) {
        console.error('Error checking auth token', err);
        setInitialRoute('Login');
      }
    };

    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B7931" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
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
