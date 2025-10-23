// screens/HomeScreen.js
import React, { useState } from "react";
import {
  View, Text, FlatList, Image, TextInput, StyleSheet,
  TouchableOpacity, 
  SectionList // Import SectionList
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";
import { useAudio } from '../context/AudioProvider';

// Dữ liệu bài hát
const songsData = [
  {
    id: "1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    genre: "Pop",
    cover: { uri: "https://tse2.mm.bing.net/th/id/OIP.J-z8JrhX2EhcIfugldA8sQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    uri: require('../assets/music/Shape_Of_You.mp3')
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Synth-pop",
    cover: { uri: "https://tse4.mm.bing.net/th/id/OIP.aESN9ZbNP7ugzKm65zK3ZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    uri: require('../assets/music/Blinding_Lights.mp3')
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia", 
    genre: "Nu-disco", 
    cover: { uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e406c545-2ff1-4c83-ae0b-fdac1dd62a8d/dfu483b-e23f518f-f3ae-42c5-b886-ce70d57c40ed.jpg/v1/fill/w_1280,h_1280,q_75,strp/cover_art_for_levitating_by_dua_lipa_by_studiorinagraphic_dfu483b-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiJcL2ZcL2U0MDZjNTQ1LTJmZjEtNGM4My1hZTBiLWZkYWMxZGQ2MmE4ZFwvZGZ1NDgzYi1lMjNmNTE4Zi1mM2FlLTQyYzUtYjg4Ni1jZTcwZDU3YzQwZWQuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.KoA_7EMfnfFAl_fI_-QiCx6eWurRYLvtugQp8HFg16M" },
    uri: require('../assets/music/Levitating.mp3')
  },
  { 
    id: "4", 
    title: "Someone You Loved", 
    artist: "Lewis Capaldi", 
    album: "Divinely Uninspired...", 
    genre: "Ballad", 
    cover: { uri: "https://d1e4pidl3fu268.cloudfront.net/5316cf6b-4230-4ade-945d-38ed1ff3a6a0/SharedImage91162.jpg" }, 
    uri: require('../assets/music/Someone_You_Loved.mp3')  
  },
  { 
    id: "5", 
    title: "E là không thể", 
    artist: "Anh Quân Idol", 
    album: "Single", 
    genre: "V-Pop", 
    cover: { uri: "https://tse2.mm.bing.net/th/id/OIP.5UoN-HtmKKYRf5j0GDgdTwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" }, 
    uri: require('../assets/music/E_La_Khong_The.mp3') 
  },
  { 
    id: "6", 
    title: "Như Anh Mơ", 
    artist: "PC FeelingSoundz", 
    album: "Single", 
    genre: "V-Pop", 
    cover: { uri: "https://tse4.mm.bing.net/th/id/OIP.9ToE1A_k9qbEHzsEm3qjXQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" }, 
    uri: require('../assets/music/Nhu_Anh_Mo.mp3') 
  },
  { 
    id: "7", 
    title: "No One Noticed", 
    artist: "The Marías", 
    album: "Submarine", 
    genre: "Indie Pop", 
    cover: { uri: "https://tse3.mm.bing.net/th/id/OIP.9-bhN13xeCeTNzGaaNU_3gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" }, 
    uri: require('../assets/music/No_One_Noticed.mp3') 
  },
  { 
    id: "8", 
    title: "Watermelon Sugar", 
    artist: "Harry Styles", 
    album: "Fine Line",
    genre: "Pop",
    cover: { uri: "https://i.ytimg.com/vi/E07s5ZYygMg/maxresdefault.jpg" }, 
    uri: require('../assets/music/Watermelon_Sugar.mp3') 
  },
  { 
    id: "9", 
    title: "Bad Guy", 
    artist: "Billie Eilish", 
    album: "When We All Fall Asleep...",
    genre: "Electro-pop",
    cover: { uri: "https://tse1.mm.bing.net/th/id/OIP.Qnwc5UwaRcPDQdh0INIjJAHaHa?cb=12&w=600&h=600&rs=1&pid=ImgDetMain&o=7&rm=3" }, 
    uri: require('../assets/music/Bad_Guy.mp3')  
  },
  { 
    id: "10", 
    title: "Chúng ta của hiện tại", 
    artist: "Sơn Tùng M-TP", 
    album: "Single",
    genre: "V-Pop",
    cover: { uri: "https://i.scdn.co/image/ab67616d0000b2735888c34015bebbf123957f6d" }, 
    uri: require('../assets/music/Chung_Ta_Cua_Hien_Tai.mp3')
  },
];

// Dữ liệu categories
const categories = [
  { id: "1", name: "Thịnh hành" },
  { id: "2", name: "Pop" },
  { id: "3", name: "Hip-hop" },
  { id: "4", name: "EDM" },
  { id: "5", name: "Acoustic" },
  { id: "6", name: "Ballad" },
];

// Custom Header 
function CustomHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: "https://congdankhuyenhoc.qltns.mediacdn.vn/449484899827462144/2022/12/23/de07be069015484b1104-1671783880835863012341.jpg" }}
        style={styles.logo}
      />
      <View style={styles.headerRight}>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color="#000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/451873311_1251835142474975_5957496191698132790_n.jpg?..." }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Component Categories 
function CategoriesList() {
   return (
      <View style={{ paddingVertical: 8 }}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      </View>
   );
}


// Màn hình chính
export default function HomeScreen() {
  const { playSong } = useAudio(); 
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState(songsData); // state 'songs' dùng để lọc tìm kiếm

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = songsData.filter(
      (s) =>
        s.title.toLowerCase().includes(text.toLowerCase()) ||
        s.artist.toLowerCase().includes(text.toLowerCase())
    );
    // Cập nhật danh sách 'songs' đã lọc
    setSongs(filtered.length > 0 ? filtered : (text === "" ? songsData : []));
  };

  //Xử lý khi nhấn vào bài hát 
  const handleSongPress = (song) => {
    // Luôn truyền 'songsData' (danh sách GỐC) để Next/Previous
    // hoạt động trên toàn bộ danh sách, ngay cả khi đang tìm kiếm.
    playSong(song, songsData); 
  };

  // Nhóm dữ liệu cho SectionList (FR-6.4)
  const getGroupedData = () => {
    // Nhóm các bài hát từ state 'songs' (đã lọc)
    const grouped = songs.reduce((acc, song) => {
      const genre = song.genre || "Chưa phân loại";
      if (!acc[genre]) {
        acc[genre] = [];
      }
      acc[genre].push(song);
      return acc;
    }, {});

    // Chuyển đổi thành định dạng SectionList yêu cầu
    return Object.keys(grouped).map(genre => ({
      title: genre,
      data: grouped[genre],
    }));
  };
  
  const formattedData = getGroupedData(); // Dữ liệu đã được nhóm

  // renderSong giữ nguyên
  const renderSong = ({ item }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => handleSongPress(item)}>
      <Image source={item.cover} style={styles.coverImage} />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <CategoriesList />

      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài hát hoặc ca sĩ..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/*NÂNG CẤP: Dùng SectionList (FR-6.4) */}
      <SectionList
        sections={formattedData} // Dùng dữ liệu đã nhóm
        keyExtractor={(item) => item.id}
        renderItem={renderSong}
        // Render tiêu đề cho mỗi nhóm (Genre)
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy bài hát</Text>}
        contentContainerStyle={{ paddingBottom: 150 }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  logo: { width: 120, height: 30, resizeMode: "contain" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 8 },
  avatar: { width: 30, height: 30, borderRadius: 15, marginLeft: 8 },
  categoryItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  categoryText: { fontSize: 14, color: "#333" },
  searchContainer: { paddingHorizontal: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 12,
  },
  songItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12, 
    paddingHorizontal: 10 
  },
  coverImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "bold" },
  artist: { fontSize: 14, color: "gray" },
  empty: { textAlign: "center", marginTop: 20, color: "gray" },


  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray',
    backgroundColor: '#f5f5f5', 
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});