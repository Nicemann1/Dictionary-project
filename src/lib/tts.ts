// Text-to-speech utility using Web Speech API
interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
}

// Language-specific configurations for optimal voice settings
const languageConfigs: Record<string, VoiceConfig> = {
  'en-US': {
    rate: 0.9,
    pitch: 1,
    volume: 1
  },
  'de-DE': {
    rate: 0.85,
    pitch: 1,
    volume: 1
  },
  'tr-TR': {
    rate: 0.95,
    pitch: 1.1,
    volume: 1
  },
  'zh-CN': {
    rate: 0.8,
    pitch: 1.2,
    volume: 1
  },
  'ja-JP': {
    rate: 0.85,
    pitch: 1.1,
    volume: 1
  }
};

// Preferred voices for each language for better quality
const preferredVoices: Record<string, string[]> = {
  'en-US': ['Samantha', 'Karen', 'Daniel'],
  'en-GB': ['Daniel', 'Moira', 'Arthur'],
  'de-DE': ['Anna', 'Viktor', 'Helena'],
  'tr-TR': ['Yelda', 'Mehmet'],
  'zh-CN': ['Tingting', 'Meijia'],
  'ja-JP': ['Kyoko', 'Otoya', 'Hina']
};

export async function speak(
  text: string,
  lang: string = 'en-US',
  options: { gender?: 'male' | 'female' } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map language codes
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'de': 'de-DE',
      'tr': 'tr-TR',
      'zh': 'zh-CN',
      'ja': 'ja-JP'
    };

    let voices = window.speechSynthesis.getVoices();
    const targetLang = langMap[lang.split('-')[0]] || lang;

    // Handle voice loading
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        setVoiceAndSpeak();
      };
    } else {
      setVoiceAndSpeak();
    }

    function setVoiceAndSpeak() {
      const selectBestVoice = () => {
        const preferredVoiceNames = preferredVoices[targetLang] || [];
        
        // Try to match gender preference with high-quality voices
        const genderVoices = voices.filter(v => {
          const isTargetGender = options.gender === 'male' 
            ? v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david')
            : v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha');
          return v.lang === targetLang && isTargetGender && v.localService;
        });

        if (genderVoices.length > 0) return genderVoices[0];

        // Try preferred voices
        const premiumVoice = voices.find(v => 
          v.lang === targetLang && 
          preferredVoiceNames.includes(v.name) &&
          v.localService
        );
        if (premiumVoice) return premiumVoice;

        // Fallback to any local voice for the language
        const localVoice = voices.find(v => 
          v.lang === targetLang && v.localService
        );
        if (localVoice) return localVoice;

        // Final fallback to any voice for the language
        return voices.find(v => v.lang === targetLang) ||
               voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
      };

      const selectedVoice = selectBestVoice();
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        
        // Apply optimal settings for the language
        const config = languageConfigs[targetLang] || languageConfigs['en-US'];
        utterance.rate = config.rate;
        utterance.pitch = config.pitch;
        utterance.volume = config.volume;

        console.debug('Selected voice:', {
          name: selectedVoice.name,
          lang: selectedVoice.lang,
          isLocal: selectedVoice.localService
        });
      } else {
        console.warn(`No voice found for language ${targetLang}, using default`);
        utterance.lang = targetLang;
        
        const config = languageConfigs['en-US'];
        utterance.rate = config.rate;
        utterance.pitch = config.pitch;
        utterance.volume = config.volume;
      }

      // Split text into natural chunks for better flow
      const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];
      let currentChunk = 0;

      utterance.text = chunks[currentChunk];

      utterance.onend = () => {
        currentChunk++;
        if (currentChunk < chunks.length) {
          utterance.text = chunks[currentChunk];
          window.speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      };

      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        reject(new Error(`Speech synthesis failed: ${error.message}`));
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        reject(new Error('Failed to start speech synthesis'));
      }
    }
  });
}