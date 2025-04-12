import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import TimerScreen from '../screens/TimerScreen';
import FinancesScreen from '../screens/FinancesScreen';
import DebtsScreen from '../screens/DebtsScreen';
import StatsScreen from '../screens/StatsScreen';

// Define the tab param list
export type MainTabParamList = {
  Dashboard: undefined;
  Timer: undefined;
  Finances: undefined;
  Debts: undefined;
  Stats: undefined;
};

// Create the tab navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Timer') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Finances') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Debts') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Stats') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6', // blue-500 from tailwind
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Přehled' }}
      />
      <Tab.Screen 
        name="Timer" 
        component={TimerScreen} 
        options={{ title: 'Časovač' }}
      />
      <Tab.Screen 
        name="Finances" 
        component={FinancesScreen} 
        options={{ title: 'Finance' }}
      />
      <Tab.Screen 
        name="Debts" 
        component={DebtsScreen} 
        options={{ title: 'Dluhy' }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen} 
        options={{ title: 'Statistiky' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;