import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import mobileAds from 'react-native-google-mobile-ads';

import { AppProvider } from './src/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import { SettingsScreen, EditMemberScreen } from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Initialize AdMob SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized:', adapterStatuses);
      });
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home"       component={HomeScreen} />
          <Stack.Screen name="Tasks"      component={TasksScreen} />
          <Stack.Screen name="Settings"   component={SettingsScreen} />
          <Stack.Screen name="EditMember" component={EditMemberScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
