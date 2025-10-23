
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useAudio } from '../context/AudioProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

export default function PlayerScreen() {
  const {
    currentSong, isPlaying, togglePlayPause, 
    duration, position, playNext, playPrevious,
    seekTo, onSeekStart,
    handleFavorite, isFavorite,
    repeatMode, isShuffled, toggleRepeatMode, toggleShuffle, setVolume
  } = useAudio();
  
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Đang tải bài hát...</Text>
      </SafeAreaView>
    );
  }

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
  
  const isSongFavorite = isFavorite(currentSong);

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return 'repeat-one';
    if (repeatMode === 'all') return 'repeat';
    return 'repeat';
  };
  
  const getActiveColor = (isActive) => {
    return isActive ? '#1DB954' : '#333';
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.volumeButton} 
        onPress={() => setShowVolumeSlider(!showVolumeSlider)}
      >
        <Icon name="volume-medium-outline" size={26} color="#333" />
      </TouchableOpacity>
      
      {showVolumeSlider && (
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={1} 
          minimumTrackTintColor="#333333"
          maximumTrackTintColor="#AAAAAA"
          thumbTintColor="#333333"
          onValueChange={setVolume}
        />
      )}

      <Image source={currentSong.cover} style={styles.coverImage} />
      
      <View style={styles.titleContainer}>
        <View style={styles.titleInfo}>
          <Text style={styles.title} numberOfLines={2}>{currentSong.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentSong.artist}</Text>
        </View>
        <TouchableOpacity onPress={() => handleFavorite(currentSong)}>
          <Icon 
            name={isSongFavorite ? "heart" : "heart-outline"} 
            size={30} 
            color={getActiveColor(isSongFavorite)} 
          />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0} 
        maximumValue={1}
        value={getSliderValue()}
        minimumTrackTintColor="#333333"
        maximumTrackTintColor="#AAAAAA"
        thumbTintColor="#333333"
        onSlidingStart={onSeekStart}
        onSlidingComplete={(value) => { if (duration) seekTo(value * duration); }}
      />
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle} style={styles.subControlButton}>
            <Icon 
              name="shuffle" 
              size={30} 
              color={getActiveColor(isShuffled)} 
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPrevious} style={styles.mainControlButton}>
            <Icon name="play-skip-back" size={40} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainControlButton} onPress={togglePlayPause}>
          <Icon name={isPlaying ? "pause-circle" : "play-circle"} size={80} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext} style={styles.mainControlButton}>
            <Icon name="play-skip-forward" size={40} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeatMode} style={styles.subControlButton}>
            <Icon 
              name={getRepeatIcon()}
              size={30} 
              color={getActiveColor(repeatMode !== 'off')} 
            />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  titleInfo: { flex: 1, marginRight: 15 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'left' },
  artist: { fontSize: 16, color: 'gray', textAlign: 'left', marginTop: 5 },
  slider: { width: '100%', height: 40 },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20, 
  },
  timeText: { color: 'gray' },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20, 
  },
  mainControlButton: {
    padding: 10,
  },
  subControlButton: {
    padding: 10,
  },
  volumeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  volumeSlider: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    zIndex: 10,
  },
});