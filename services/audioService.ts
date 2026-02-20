class AudioService {
  private bgm: HTMLAudioElement | null = null;
  private sfx: {[key: string]: string} = {};
  private isMuted: boolean = false;
  private currentTrack: string | null = null;

  constructor() {
    // Sound Effects Map (Royalty Free Previews)
    this.sfx = {
      correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', // Ding
      wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',   // Buzz
      click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',   // Click
      win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',     // Victory Fanfare
      lose: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',    // Defeat
    };
  }

  // Determine which BGM to play based on difficulty or mode
  playBGM(type: 'MENU' | 'SOLO' | 'BATTLE_EASY' | 'BATTLE_MEDIUM' | 'BATTLE_HARD' | 'OFFLINE') {
    if (this.currentTrack === type) return; // Don't restart if already playing
    
    this.stopBGM();
    this.currentTrack = type;

    let url = '';

    // Cyberpunk / Sci-Fi Themed Music URLs
    switch(type) {
      case 'MENU': 
        url = 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3?filename=future-technology-113364.mp3'; // Chill futuristic
        break;
      case 'SOLO': 
        url = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=coding-night-118749.mp3'; // Focus electronic
        break;
      case 'OFFLINE': 
        url = 'https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1e65.mp3?filename=game-music-7408.mp3'; // Funky/Arcade
        break;
      case 'BATTLE_EASY': 
        url = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_65d565a0b7.mp3?filename=cyberpunk-city-110452.mp3'; // Upbeat
        break;
      case 'BATTLE_MEDIUM': 
        url = 'https://cdn.pixabay.com/download/audio/2021/04/07/audio_6c28f3096b.mp3?filename=action-strike-18459.mp3'; // Tenser
        break;
      case 'BATTLE_HARD': 
        url = 'https://cdn.pixabay.com/download/audio/2020/09/14/audio_7e44a1042c.mp3?filename=powerful-beat-1200.mp3'; // High Intensity
        break;
    }

    if (url) {
        this.bgm = new Audio(url);
        this.bgm.loop = true;
        this.bgm.volume = 0.3; // Lower volume for background
        
        if (!this.isMuted) {
            // User interaction is usually required for auto-play, 
            // but we assume this is called after a click event in the app.
            this.bgm.play().catch(e => console.warn("Audio autoplay blocked by browser:", e));
        }
    }
  }

  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
      this.bgm = null;
    }
  }

  playSFX(type: 'correct' | 'wrong' | 'click' | 'win' | 'lose') {
    if (this.isMuted || !this.sfx[type]) return;
    
    const audio = new Audio(this.sfx[type]);
    audio.volume = 0.6;
    audio.play().catch(e => console.warn("SFX play failed:", e));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
        if (this.bgm) this.bgm.pause();
    } else {
        if (this.bgm) this.bgm.play().catch(e => console.warn("Resume failed:", e));
    }
    
    return this.isMuted;
  }

  getMuteStatus() {
    return this.isMuted;
  }
}

export const audioManager = new AudioService();
