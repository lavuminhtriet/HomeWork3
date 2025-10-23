// navigation/NavigationRef.js
import { createNavigationContainerRef } from '@react-navigation/native';

// Tạo một ref cho NavigationContainer
export const navigationRef = createNavigationContainerRef();

/**
 * Hàm này cho phép ta điều hướng từ bất cứ đâu,
 * ngay cả bên ngoài một component màn hình.
 */
export function navigateToPlayer() {
  if (navigationRef.isReady()) {
    // 'Trang chủ' là tên của Tab
    // 'Player' là tên của màn hình bên trong HomeStack
    navigationRef.navigate('Trang chủ', { screen: 'Player' });
  }
}