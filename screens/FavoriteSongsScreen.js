// screens/FavoriteSongsScreen.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudio } from '../context/AudioProvider';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FavoriteSongsScreen() {
  const { favorites, playSong, currentSong } = useAudio();

  const handleSongPress = (song) => {
    // Khi nhấn vào 1 bài, phát bài đó VÀ truyền toàn bộ ds yêu thích làm playlist
    playSong(song, favorites);
  };

  const renderSong = ({ item }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
      <Image source={item.cover} style={styles.coverImage} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      {/* Hiển thị icon nếu bài này đang phát */}
      {currentSong?.id === item.id && (
        <Icon name="pulse-outline" size={24} color="#1DB954" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Bài hát Yêu thích</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderSong}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có bài hát yêu thích nào</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
  },
  songItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  coverImage: { width: 50, height: 50, borderRadius: 5, marginRight: 15 },
  info: {
    flex: 1,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  artist: { fontSize: 14, color: "gray" },
  empty: { textAlign: "center", marginTop: 50, color: "gray" },
});