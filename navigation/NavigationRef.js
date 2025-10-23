// navigation/NavigationRef.js
import { createNavigationContainerRef } from '@react-navigation/native';

// Tạo một ref cho NavigationContainer
export const navigationRef = createNavigationContainerRef();


export function navigateToPlayer() {
  if (navigationRef.isReady()) {

    navigationRef.navigate('Trang chủ', { screen: 'Player' });
  }
}