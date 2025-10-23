// screens/LibraryScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAudio } from '../context/AudioProvider'; // 💡 Import useAudio

export default function LibraryScreen() {
  const navigation = useNavigation();
  // 💡 Lấy danh sách playlists và hàm tạo playlist
  const { playlists, createPlaylist } = useAudio();

  // 💡 Hàm xử lý tạo playlist mới
  const handleCreatePlaylist = () => {
    Alert.prompt(
      "Playlist Mới",
      "Nhập tên cho playlist của bạn:",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Tạo",
          onPress: (playlistName) => {
            if (playlistName) {
              createPlaylist(playlistName);
            }
          },
        },
      ],
      "plain-text" // Kiểu nhập liệu
    );
  };

  // 💡 Hàm render mỗi mục playlist
  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      // 💡 Điều hướng đến màn hình chi tiết
      onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item.id })}
    >
      <Icon name="musical-notes-outline" size={26} color="#333" style={styles.icon} />
      <Text style={styles.menuText}>{item.name}</Text>
      <Text style={styles.songCount}>{item.songs.length} bài</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Thư viện</Text>
      
      {/* Nút Bài hát Yêu thích (Giữ nguyên) */}
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('FavoriteSongs')}
      >
        <Icon name="heart-outline" size={26} color="#333" style={styles.icon} />
        <Text style={styles.menuText}>Bài hát Yêu thích</Text>
      </TouchableOpacity>
      
      {/* 💡 Nút tạo Playlist mới (FR-3.2) */}
      <TouchableOpacity 
        style={styles.menuItem}
        onPress={handleCreatePlaylist}
      >
        <Icon name="add-outline" size={26} color="#333" style={styles.icon} />
        <Text style={styles.menuText}>Tạo playlist mới</Text>
      </TouchableOpacity>

      {/* 💡 Danh sách các playlist đã tạo (FR-3.4) */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylistItem}
        ListHeaderComponent={<Text style={styles.listHeader}>PLAYLISTS</Text>}
        ListEmptyComponent={<Text style={styles.empty}>Bạn chưa tạo playlist nào</Text>}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  icon: { marginRight: 15 },
  menuText: {
    fontSize: 18,
    color: '#333',
    flex: 1, // Để đẩy số lượng bài hát ra
  },
  songCount: {
    fontSize: 14,
    color: 'gray',
  },
  listHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
});