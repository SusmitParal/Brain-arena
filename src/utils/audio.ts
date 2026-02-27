class SoundManager {
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxAudio: HTMLAudioElement;
  private isMuted: boolean = false;
  private userHasInteracted: boolean = false;
  private queuedBgm: keyof typeof this.BGM_ASSETS | null = null;
  private bgmPromise: Promise<void> | null = null;

  private readonly SFX_VOLUME = 0.5;
  private readonly BGM_VOLUME = 0.3;

  private readonly SFX_ASSETS = {
    click: 'https://storage.googleapis.com/interactive-media/brain-arena/click.mp3',
    correct: 'https://storage.googleapis.com/interactive-media/brain-arena/correct.mp3',
    wrong: 'https://storage.googleapis.com/interactive-media/brain-arena/wrong.mp3',
    win: 'https://storage.googleapis.com/interactive-media/brain-arena/win.mp3',
    lose: 'https://storage.googleapis.com/interactive-media/brain-arena/lose.mp3',
    chest_open: 'https://storage.googleapis.com/interactive-media/brain-arena/chest_open.mp3',
    level_up: 'https://storage.googleapis.com/interactive-media/brain-arena/level_up.mp3',
    countdown: 'https://storage.googleapis.com/interactive-media/brain-arena/countdown.mp3',
    collect: 'https://storage.googleapis.com/interactive-media/brain-arena/collect.mp3',
    taunt: 'https://storage.googleapis.com/interactive-media/brain-arena/taunt.mp3',
  };

  private readonly BGM_ASSETS = {
    bgm_menu: 'https://storage.googleapis.com/interactive-media/brain-arena/bgm_menu.mp3',
    bgm_game_solo: 'https://storage.googleapis.com/interactive-media/brain-arena/bgm_game_solo.mp3',
    bgm_game_pvp: 'https://storage.googleapis.com/interactive-media/brain-arena/bgm_game_pvp.mp3',
    bgm_game_events: 'https://storage.googleapis.com/interactive-media/brain-arena/bgm_game_events.mp3',
    bgm_game_friends: 'https://storage.googleapis.com/interactive-media/brain-arena/bgm_game_friends.mp3',
    bgm_game_settings: 'https://storage.googleapis.com/interactive-media/brain-arena/bgm_game_settings.mp3',
  };

  constructor() {
    this.sfxAudio = new Audio();
    this.sfxAudio.volume = this.SFX_VOLUME;
  }

  handleFirstInteraction = () => {
    if (this.userHasInteracted) return;
    this.userHasInteracted = true;
    if (this.queuedBgm) {
      this.playBgm(this.queuedBgm);
    }
  }

  playSfx(sfxName: keyof typeof this.SFX_ASSETS) {
    if (this.isMuted || !this.userHasInteracted) return;
    
    // Create a new audio instance for each SFX to allow overlapping sounds
    const sfx = new Audio(this.SFX_ASSETS[sfxName]);
    sfx.volume = this.SFX_VOLUME;
    sfx.play().catch(e => {
      if (e.name !== 'AbortError') {
        console.error("SFX play failed:", e);
      }
    });
  }

  async playBgm(bgmName: keyof typeof this.BGM_ASSETS) {
    if (this.isMuted) return;
    if (!this.userHasInteracted) {
      this.queuedBgm = bgmName;
      return;
    }

    if (this.bgmAudio && this.bgmAudio.src.includes(this.BGM_ASSETS[bgmName])) {
      if (this.bgmAudio.paused) this.bgmAudio.play().catch(e => console.error("BGM play failed:", e));
      return;
    }

    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }

    this.bgmAudio = new Audio(this.BGM_ASSETS[bgmName]);
    this.bgmAudio.volume = this.BGM_VOLUME;
    this.bgmAudio.loop = true;
    this.bgmPromise = this.bgmAudio.play();
    this.bgmPromise.catch(e => {
      if (e.name !== 'AbortError') {
        console.error("BGM play failed:", e);
      }
    });
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgmAudio) {
      this.bgmAudio.muted = this.isMuted;
    }
    this.sfxAudio.muted = this.isMuted;
  }

  getIsMuted() {
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
