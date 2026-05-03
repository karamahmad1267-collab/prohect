س// أصوات مختلفة لكل لون - باستخدام Web Audio API
const sounds = {
    'a': { text: 'لون أحمر جميل', freq: 261.63 }, // C4
    's': { text: 'برتقالي زاهي', freq: 293.66 }, // D4
    'd': { text: 'أصفر مضيء', freq: 329.63 }, // E4
    'f': { text: 'أخضر منعش', freq: 349.23 }, // F4
    'g': { text: 'أزرق سماوي', freq: 392.00 }, // G4
    'h': { text: 'بنفسجي ملكي', freq: 440.00 }, // A4
    'j': { text: 'وردي شهي', freq: 493.88 }, // B4
    'k': { text: 'أسود أنيق', freq: 523.25 }  // C5
};

// متغير لتتبع حالة الصوت
let audioEnabled = false;
let audioCtx = null;

// إنشاء Audio Context
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// زر تفعيل الصوت
const enableBtn = document.getElementById('enableAudio');
if (enableBtn) {
    enableBtn.addEventListener('click', function() {
        audioEnabled = true;
        this.textContent = '✅ الصوت مفعل';
        this.classList.add('enabled');
        
        // تشغيل صوت تجريبي
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    });
}


function playTone(freq) {
    if (!audioEnabled) return;
    
    const ctx = getAudioContext();
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
}

function speak(text) {
    if (!audioEnabled) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    window.speechSynthesis.speak(utterance);
}


function playSound(element) {
    const key = element.getAttribute('data-key');
    const soundData = sounds[key];
    
    // تأثير بصري
    element.classList.add('playing');
    setTimeout(() => {
        element.classList.remove('playing');
    }, 400);
    
    if (soundData) {
        // تشغيل النغمة
        playTone(soundData.freq);
        
        // التحدث
        setTimeout(() => {
            speak(soundData.text);
        }, 100);
    }
}

// مستمع للألوان عند الضغط
document.querySelectorAll('.color-box').forEach(box => {
    box.addEventListener('click', function() {
        playSound(this);
    });
});


document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    const box = document.querySelector(`.color-box[data-key="${key}"]`);
    
    if (box) {
        playSound(box);
    }
});
