// components/MiniPlayer.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAudio } from '../context/AudioProvider';
import { navigateToPlayer } from '../navigation/NavigationRef';
import Slider from '@react-native-community/slider';

export default function MiniPlayer() {
  const {
    currentSong, isPlaying, togglePlayPause,
    playNext, playPrevious, duration, position,
    seekTo, onSeekStart,
    // Tính năng yêu thích
    handleFavorite, isFavorite,
  } = useAudio();

  if (!currentSong) return null;

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getSliderValue = () => {
    if (!position || !duration) return 0;
    return position / duration;
  };

  // Kiểm tra trạng thái yêu thích
  const isSongFavorite = isFavorite(currentSong);

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={getSliderValue()}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#AAAAAA"
        thumbTintColor="#FFFFFF"
        onSlidingStart={onSeekStart}
        onSlidingComplete={(value) => { if (duration) seekTo(value * duration); }}
      />

      <View style={styles.content}>
        <TouchableOpacity onPress={navigateToPlayer}>
          <Image source={currentSong.cover} style={styles.cover} />
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToPlayer} style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
        </TouchableOpacity>
        <View style={styles.controls}>

          <TouchableOpacity onPress={() => handleFavorite(currentSong)} style={styles.controlButton}>
            <Icon 
              name={isSongFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isSongFavorite ? "#1DB954" : "#fff"} // Màu xanh (giống Spotify) khi thích
            />
          </TouchableOpacity>


          <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
            <Icon name={isPlaying ? "pause" : "play"} size={36} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={playNext} style={styles.controlButton}>
            <Icon name="play-skip-forward" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

// style
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 83 : 56,
    left: 8,
    right: 8,
    backgroundColor: '#282828',
    borderRadius: 10,
    height: 75,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 10,
  },
  slider: {
    position: 'absolute',
    top: -5,
    left: 5,
    right: 5,
    height: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cover: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  info: {
    flex: 1, // Co giãn để đẩy các nút control sang phải
    marginLeft: 10,
    marginRight: 5, // Giảm margin
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  artist: {
    color: '#ccc',
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 5,
    marginHorizontal: 4, // Giảm khoảng cách
  },
  timeContainer: {
    position: 'absolute',
    top: 6,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#ccc',
    fontSize: 11,
  },
});