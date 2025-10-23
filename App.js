
import { View } from "react-native"; 
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

//Import các màn hình và stack
import HomeStack from "./navigation/HomeStack";
import ShortsScreen from "./screens/ShortsScreen";
import ExploreScreen from "./screens/ExploreScreen";
import LibraryStack from './navigation/LibraryStack';

// Import Provider, Ref, và Component mới
import { AudioProvider, useAudio } from './context/AudioProvider';
import { navigationRef } from './navigation/NavigationRef'; 
import MiniPlayer from './components/MiniPlayer'; 

const Tab = createBottomTabNavigator();


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
        // Ẩn tab bar khi vào màn hình Player
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


function MainApp() {
  const { currentSong } = useAudio(); 

  return (
    <View style={{ flex: 1 }}>
      
      <TabNavigator />
      

      
      {currentSong && <MiniPlayer />}
    </View>
  );
}


// Component App chính
export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer ref={navigationRef}> 
        <MainApp />
      </NavigationContainer>
    </AudioProvider>
  );
}