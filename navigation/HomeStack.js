// navigation/HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeList" // Tên màn hình gốc trong stack
        component={HomeScreen}
        options={{ headerShown: false }} // Ẩn header của stack
      />
      <Stack.Screen
        name="Player" // Tên màn hình Player
        component={PlayerScreen}
        options={{
          title: 'Đang phát',
          headerBackTitleVisible: false,
          headerTransparent: true, // Header trong suốt
          headerTitleStyle: { color: 'transparent' } // Ẩn chữ
        }}
      />
    </Stack.Navigator>
  );
}