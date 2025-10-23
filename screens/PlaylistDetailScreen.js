

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudio } from '../context/AudioProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native'; 

export default function PlaylistDetailScreen() {
  const route = useRoute(); 
  const { playlistId } = route.params; // Lấy ID của playlist
  
  const { playlists, playSong, currentSong } = useAudio();
  const [playlist, setPlaylist] = useState(null); // State cho playlist cụ thể

  // Tìm playlist dựa trên ID
  useEffect(() => {
    const foundPlaylist = playlists.find(p => p.id === playlistId);
    setPlaylist(foundPlaylist);
  }, [playlistId, playlists]); // Cập nhật khi playlists thay đổi

  const handleSongPress = (song) => {
    // Phát bài hát và truyền danh sách bài hát của playlist này
    if (playlist && playlist.songs.length > 0) {
      playSong(song, playlist.songs);
    }
  };

  const renderSong = ({ item }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
      <Image source={item.cover} style={styles.coverImage} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      {currentSong?.id === item.id && (
        <Icon name="pulse-outline" size={24} color="#1DB954" />
      )}
    </TouchableOpacity>
  );

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>Không tìm thấy playlist...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.headerTitle}>{playlist.name}</Text>
      
      <FlatList
        data={playlist.songs}
        keyExtractor={(item) => item.id}
        renderItem={renderSong}
        ListEmptyComponent={<Text style={styles.empty}>Playlist này chưa có bài hát nào</Text>}
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
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  artist: { fontSize: 14, color: "gray" },
  empty: { textAlign: "center", marginTop: 50, color: "gray" },
}); 