// context/AudioProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const AudioContext = createContext();
const FAVORITES_KEY = 'favorites_list';
const PLAYLISTS_KEY = 'playlists_list';

export const AudioProvider = ({ children }) => {

  const [sound, setSound] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);
  const [position, setPosition] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [songList, setSongList] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);


  const [repeatMode, setRepeatMode] = useState('off'); 
  const [isShuffled, setIsShuffled] = useState(false);
  // Danh sách đã xáo trộn (để dùng khi Next/Prev)
  const [shuffledList, setShuffledList] = useState([]); 

  useEffect(() => {
    loadAudioData();
  }, []);

  const loadAudioData = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson !== null) setFavorites(JSON.parse(favoritesJson));
      const playlistsJson = await AsyncStorage.getItem(PLAYLISTS_KEY);
      if (playlistsJson !== null) setPlaylists(JSON.parse(playlistsJson));
    } catch (e) { console.error('Lỗi khi tải dữ liệu âm thanh:', e); }
  };
  const handleFavorite = async (song) => {
    const existingIndex = favorites.findIndex(item => item.id === song.id);
    let newFavorites = [];
    if (existingIndex !== -1) {
      newFavorites = favorites.filter(item => item.id !== song.id);
    } else { newFavorites = [...favorites, song]; }
    setFavorites(newFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };
  const isFavorite = (song) => {
    if (!song) return false;
    return favorites.some(item => item.id === song.id);
  };
  const createPlaylist = async (playlistName) => {
    const newPlaylist = { id: uuidv4(), name: playlistName, songs: [] };
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updatedPlaylists));
  };
  const addSongToPlaylist = async (song, playlistId) => {
    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        const songExists = playlist.songs.some(s => s.id === song.id);
        if (!songExists) return { ...playlist, songs: [...playlist.songs, song] };
      }
      return playlist;
    });
    setPlaylists(updatedPlaylists);
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(updatedPlaylists));
  };


  //Phát nhạc

  const onPlaybackStatusUpdate = async (status) => {
    if (status.isLoaded) {
      if (!isSeeking) setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsPlaying(status.isPlaying);
      
 
      if (status.didJustFinish) {
        if (repeatMode === 'one') {
          // Phát lại bài hiện tại
          await sound.replayAsync();
        } else {
          // Phát bài tiếp theo 
          playNext();
        }
      }
    }
  };

  // Hàm playSong gần như giữ nguyên, chỉ thêm logic cập nhật list
  const playSong = async (song, list = []) => {
    let listToUse = songList;

    // Nếu có danh sách mới được truyền vào (ví dụ: nhấn từ HomeScreen)
    if (list.length > 0 && JSON.stringify(list) !== JSON.stringify(songList)) {
      setSongList(list); // Lưu danh sách gốc
      listToUse = list;
      // Nếu shuffle đang bật, tạo ngay list xáo trộn
      if (isShuffled) {
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setShuffledList(shuffled);
      }
    }

    // Tìm index
    const listForIndex = isShuffled ? shuffledList : listToUse;
    const index = listForIndex.findIndex(item => item.id === song.id);
    setCurrentSongIndex(index);
    
    // Tải và phát nhạc
    if (sound) await sound.unloadAsync();
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        song.uri, { shouldPlay: true }
      );
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setSound(newSound);
      setCurrentSong(song);
    } catch (error) { console.error("Lỗi khi tải bài hát:", error); }
  };

  // playNext 
  const playNext = () => {
    const listToUse = isShuffled ? shuffledList : songList;
    if (listToUse.length === 0 || currentSongIndex === -1) return;

    let nextIndex = currentSongIndex + 1;
    
    // Nếu đến cuối danh sách
    if (nextIndex >= listToUse.length) {
      if (repeatMode === 'all') {
        nextIndex = 0; // Quay về bài đầu tiên
      } else {
        // Dừng phát, reset
        setPosition(0);
        setDuration(0);
        setIsPlaying(false);
        // Tùy chọn: unloadAsync()
        return; 
      }
    }

    const nextSong = listToUse[nextIndex];
    playSong(nextSong); // Không cần truyền list
  };

  // playPrevious 
  const playPrevious = () => {
    const listToUse = isShuffled ? shuffledList : songList;
    if (listToUse.length === 0 || currentSongIndex === -1) return;

    let prevIndex = currentSongIndex - 1;
    
    if (prevIndex < 0) {
      // Nếu đang ở bài đầu, quay về bài cuối
      prevIndex = listToUse.length - 1; 
    }

    const prevSong = listToUse[prevIndex];
    playSong(prevSong); // Không cần truyền list
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) await sound.pauseAsync();
    else await sound.playAsync();
  };
  const seekTo = async (millis) => {
    if (sound) {
      await sound.setPositionAsync(millis);
      setIsSeeking(false);
    }
  };
  const onSeekStart = () => setIsSeeking(true);

  // Hàm FR-7.1
  const toggleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else if (repeatMode === 'one') setRepeatMode('off');
  };

  // FR-7.2
  const toggleShuffle = () => {
    const newShuffleState = !isShuffled;
    setIsShuffled(newShuffleState);
    
    if (newShuffleState) {
      // Bật shuffle: Tạo danh sách xáo trộn mới
      // Đảm bảo bài hát hiện tại vẫn là bài đầu tiên
      const current = songList[currentSongIndex];
      const rest = songList.filter(s => s.id !== current.id);
      const shuffled = [current, ...rest.sort(() => Math.random() - 0.5)];
      
      setShuffledList(shuffled);
      setCurrentSongIndex(0); // Đặt index về 0 (vì bài hiện tại đã ở đầu)
    } else {
      // Tắt shuffle: Tìm lại index của bài hiện tại trong danh sách gốc
      const originalIndex = songList.findIndex(s => s.id === currentSong.id);
      setCurrentSongIndex(originalIndex);
    }
  };

  // Hàm FR-7.3
  const setVolume = async (value) => {
    if (sound) {
      await sound.setVolumeAsync(value); // value từ 0.0 đến 1.0
    }
  };


  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const value = {
    // state & hàm cũ
    sound, currentSong, isPlaying, duration, position, songList,
    playSong, togglePlayPause, playNext, playPrevious, seekTo, onSeekStart,
    favorites, handleFavorite, isFavorite,
    playlists, createPlaylist, addSongToPlaylist,

  
    repeatMode,
    isShuffled,
    toggleRepeatMode,
    toggleShuffle,
    setVolume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);

export default AudioContext;