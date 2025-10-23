// App.js
import { View } from "react-native"; // 💡 Import View
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

// 💡 Import các màn hình và stack
import HomeStack from "./navigation/HomeStack";
import ShortsScreen from "./screens/ShortsScreen";
import ExploreScreen from "./screens/ExploreScreen";
import LibraryStack from './navigation/LibraryStack';

// 💡 Import Provider, Ref, và Component mới
import { AudioProvider, useAudio } from './context/AudioProvider';
import { navigationRef } from './navigation/NavigationRef'; // 💡 Import ref
import MiniPlayer from './components/MiniPlayer'; // 💡 Import MiniPlayer

const Tab = createBottomTabNavigator();

/**
 * Component Tab Navigator
 * Chúng ta tách ra để MainApp có thể render nó và MiniPlayer
 */
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Trang chủ") iconName = "home-outline";
          else if (route.name === "Đoạn nhạc") iconName = "musical-note-outline";
          else if (route.name === "Khám phá") iconName = "compass-outline";
          else if (route.name === "Thư viện") iconName = "library-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        // 💡 Ẩn tab bar khi vào màn hình Player (cho đẹp hơn)
        tabBarStyle: ((route) => {
            const routeName = route.state?.routes[route.state.index]?.name;
            if (routeName === 'Player') {
                return { display: 'none' };
            }
            return {};
        })(route),
      })}
    >
      <Tab.Screen name="Trang chủ" component={HomeStack} />
      <Tab.Screen name="Đoạn nhạc" component={ShortsScreen} />
      <Tab.Screen name="Khám phá" component={ExploreScreen} />
      <Tab.Screen name="Thư viện" component={LibraryStack} />
    </Tab.Navigator>
  );
}

/**
 * Component MainApp
 * Đã nằm trong AudioProvider nên có thể dùng hook useAudio()
 */
function MainApp() {
  const { currentSong } = useAudio(); // 💡 Lấy currentSong

  return (
    <View style={{ flex: 1 }}>
      {/* Tab Navigator chiếm toàn bộ không gian */}
      <TabNavigator />
      
      {/* 💡 Render MiniPlayer có điều kiện */}
      {/* Nếu có currentSong, MiniPlayer sẽ tự động hiện lên */}
      {currentSong && <MiniPlayer />}
    </View>
  );
}


// Component App chính
export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer ref={navigationRef}> {/* 💡 Gắn ref vào đây */}
        <MainApp />
      </NavigationContainer>
    </AudioProvider>
  );
}