import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from './src/constants/colors';

// Screens
import HomeScreen from './src/Screens/HomeScreen';
import ChatScreen from './src/Screens/ChatScreen';
import VoiceScreen from './src/Screens/VoiceScreen';
import FaceScreen from './src/Screens/FaceScreen';
import SmartHomeScreen from './src/Screens/SmartHomeScreen';

const Tab = createBottomTabNavigator();

// Tab bar icon component
const TabIcon = ({ label, focused }) => (
  <View style={styles.tabItem}>
    <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>
      {label === 'Home' ? '⬡' :
       label === 'Chat' ? '◈' :
       label === 'Voice' ? '◎' :
       label === 'Face' ? '⬟' : '⌘'}
    </Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
      {label.toUpperCase()}
    </Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={Colors.bg} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Chat" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Voice"
          component={VoiceScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Voice" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Face"
          component={FaceScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Face" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="SmartHome"
          component={SmartHomeScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon label="Home ⌘" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(2,11,20,0.97)',
    borderTopColor: 'rgba(0,212,255,0.2)',
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
    color: 'rgba(0,212,255,0.3)',
  },
  tabIconActive: {
    color: '#00d4ff',
    textShadowColor: 'rgba(0,212,255,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tabLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: 'rgba(0,212,255,0.3)',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#00d4ff',
  },
});