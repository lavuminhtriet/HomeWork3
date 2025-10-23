// navigation/LibraryStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryScreen from '../screens/LibraryScreen';
import FavoriteSongsScreen from '../screens/FavoriteSongsScreen';
import PlaylistDetailScreen from '../screens/PlaylistDetailScreen';

const Stack = createStackNavigator();

export default function LibraryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LibraryHome"
        component={LibraryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavoriteSongs"
        component={FavoriteSongsScreen}
        options={{ title: 'Bài hát Yêu thích' }} // Hiện header cho màn hình này
      />
      <Stack.Screen
        name="PlaylistDetail"
        component={PlaylistDetailScreen}
        options={({ route }) => ({ 
          // Ẩn tên, vì màn hình detail đã tự có tên
          headerShown: false,
        })} 
      />
    </Stack.Navigator>
  );
}