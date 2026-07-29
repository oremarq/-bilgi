/**
 * KÜLTÜR ATLASI - Premium Single Page Application Architecture
 * Pure Vanilla JavaScript Framework (ES6+)
 */

// --- REAL-TIME SOUND CONFIGURATION SYSTEM ---
class SoundController {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.ambientOsc = null;
        this.ambientGain = null;
    }

    init() {
        if (this.ctx) return;
        // Web Audio Context initialization on user interaction safety threshold
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            this.ctx = new AudioContext();
            this.startAmbientPad();
        }
    }

    setMute(state) {
        this.isMuted = state;
        if (this.ambientGain) {
            this.ambientGain.gain.setValueAtTime(state ? 0 : this.musicVolume * 0.15, this.ctx.currentTime);
        }
    }

    updateVolumes(music, sfx) {
        this.musicVolume = parseFloat(music);
        this.sfxVolume = parseFloat(sfx);
        if (this.ambientGain && !this.isMuted) {
            this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
        }
    }

    // Dynamic Cinematic Audio Generation without external assets
    playTone(frequency, type, duration, gainStart) {
        if (!this.ctx || this.isMuted) return;
        try {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
            
            gainNode.gain.setValueAtTime(gainStart * this.sfxVolume, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) { console.error("Audio trigger skipped:", e); }
    }

    startAmbientPad() {
        if (!this.ctx || this.isMuted) return;
        try {
            this.ambientOsc = this.ctx.createOscillator();
            this.ambientGain = this.ctx.createGain();
            
            this.ambientOsc.type = 'triangle';
            this.ambientOsc.frequency.setValueAtTime(110, this.ctx.currentTime); // Low A base tone
            
            this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
            
            this.ambientOsc.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            this.ambientOsc.start();
        } catch(e){}
    }

    playClick() { this.playTone(600, 'sine', 0.08, 0.4); }
    playLock() { this.playTone(220, 'triangle', 0.25, 0.6); }
    playTick() { this.playTone(800, 'sine', 0.03, 0.2); }
    
    playCorrect() {
        // Triumphant major chord sequence
        const now = this.ctx ? this.ctx.currentTime : 0;
        this.playTone(523.25, 'sine', 0.4, 0.5); // C5
        setTimeout(() => this.playTone(659.25, 'sine', 0.4, 0.5), 100); // E5
        setTimeout(() => this.playTone(783.99, 'sine', 0.4, 0.5), 200); // G5
        setTimeout(() => this.playTone(1046.50, 'sine', 0.6, 0.6), 300); // C6
    }

    playWrong() {
        // Flat dissonant drop
        this.playTone(180, 'sawtooth', 0.6, 0.7);
        setTimeout(() => this.playTone(130, 'sawtooth', 0.5, 0.7), 150);
    }
}

// --- LOCAL DATABANK COMPONENT (QUESTION MATRIX) ---
const QUESTION_POOL = [
    // --- EASY LEVEL QUESTIONS ---
    { id: 1, category: "Mitoloji", difficulty: "easy", question: "İskandinav mitolojisinde şimşek, yıldırım ve fırtına tanrısı olarak bilinen, m强势lnir adlı çekice sahip efsanevi figür kimdir?", options: ["Odin", "Loki", "Thor", "Balder"], correct: 2, hint: "Marvel sinematik evreninde de çekiciyle tanınır." },
    { id: 2, category: "Tarih", difficulty: "easy", question: "Cumhuriyetimizin kurucusu Mustafa Kemal Atatürk'ün nüfusa kayıtlı olduğu tarihi ve kültürel şehir hangisidir?", options: ["İstanbul", "Ankara", "Gaziantep", "Selanik"], correct: 2, hint: "Güneydoğu Anadolu bölgesinin sanayi ve gastronomi merkezidir." },
    { id: 3, category: "Coğrafya", difficulty: "easy", question: "Dünyanın en büyük yüzölçümüne sahip ülkesi hangisidir?", options: ["Rusya", "Kanada", "Çin", "Amerika Birleşik Devletleri"], correct: 0, hint: "Hem Asya hem de Avrupa kıtalarında toprakları bulunur." },
    { id: 4, category: "Bilim", difficulty: "easy", question: "Suyun deniz seviyesinde standart atmosfer basıncı altında kaynama noktası kaç santigrat derecedir?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1, hint: "Metrik sistemde sıcaklık ölçeği referanslarından biridir." },
    { id: 5, category: "Edebiyat", difficulty: "easy", question: "Ünlü 'Romeo ve Juliet' ile 'Hamlet' gibi ölümsüz tiyatro eserlerinin yazarı olan İngiliz edebiyatçı kimdir?", options: ["Charles Dickens", "William Shakespeare", "George Orwell", "Lord Byron"], correct: 1, hint: "Ona genellikle 'Avon'un Ozanı' denir." },
    
    // --- MEDIUM LEVEL QUESTIONS ---
    { id: 6, category: "Medeniyetler", difficulty: "medium", question: "Anadolu coğrafyasında kurulan ve tarihte bilinen ilk yazılı antlaşma olan Kadeş Antlaşması'nı Mısırlılar ile imzalayan devlet hangisidir?", options: ["Frigler", "Lidyalılar", "Hititler", "Urartular"], correct: 2, hint: "Başkentleri Hattuşaş (Çorum yakınları) olan antik güç." },
    { id: 7, category: "Uzay", difficulty: "medium", question: "Güneş sistemimizde yer alan, belirgin ve görkemli halka sistemleriyle tanınan gaz devi gezegen hangisidir?", options: ["Jüpiter", "Satürn", "Neptün", "Uranüs"], correct: 1, hint: "Güneş'e yakınlık sırasına göre altıncı gezegendir." },
    { id: 8, category: "Genel Kültür", difficulty: "medium", question: "İtalya'nın Paris olarak bilinen, Rönesans sanatının mimari kalbi sayılan ve ünlü Medici Ailesi'nin hüküm sürdüğü şehir hangisidir?", options: ["Roma", "Milano", "Floransa", "Venedik"], correct: 2, hint: "Uffizi Galerisi ve Santa Maria del Fiore bu şehirdedir." },
    { id: 9, category: "Felsefe", difficulty: "medium", question: "'Düşünüyorum, öyleyse varım' (Cogito, ergo sum) önermesiyle rasyonalist felsefenin temelini atan düşünür kimdir?", options: ["John Locke", "Immanuel Kant", "René Descartes", "Baruch Spinoza"], correct: 2, hint: "Analitik geometrinin de kurucusu olan Fransız filozof." },
    { id: 10, category: "Sanat", difficulty: "medium", question: "Dünyaca ünlü 'Belleğin Azmi' (Eriyen Saatler) adlı sürrealist tablonun sahibi İspanyol ressam kimdir?", options: ["Pablo Picasso", "Salvador Dalí", "Joan Miró", "Francisco Goya"], correct: 1, hint: "Eksantrik bıyıkları ve gerçeküstü düşsel dünyasıyla tanınır." },

    // --- HARD LEVEL QUESTIONS ---
    { id: 11, category: "Sanat Tarihi", difficulty: "hard", question: "17. yüzyıl Hollanda Altın Çağı'nın en önemli ressamlarından olan, 'Gece Devriyesi' tablosunun sahibi ışık ve gölge ustası kimdir?", options: ["Johannes Vermeer", "Rembrandt van Rijn", "Vincent van Gogh", "Frans Hals"], correct: 1, hint: "Kendi otoportreleri ve dramatik chiaroscuro kullanımıyla bilinir." },
    { id: 12, category: "Fizik", difficulty: "hard", question: "Kuantum mekaniğinde, gözlem yapılana kadar bir parçacığın aynı anda birden fazla durumda bulunabileceğini açıklayan ünlü düşünce deneyinin sahibi fizikçi kimdir?", options: ["Max Planck", "Werner Heisenberg", "Erwin Schrödinger", "Niels Bohr"], correct: 2, hint: "Bu teorik paradoks popüler kültürde bir kutunun içindeki kediyle tasvir edilir." },
    { id: 13, category: "Cumhuriyet Tarihi", difficulty: "hard", question: "Türkiye Cumhuriyeti'nin ilk Başbakanı ve ikinci Cumhurbaşkanı unvanlarına sahip, Lozan Barış Konferansı delegasyonu başkanı devlet adamı kimdir?", options: ["İsmet İnönü", "Fethi Okyar", "Celâl Bayar", "Adnan Menderes"], correct: 0, hint: "Garp Cephesi Komutanı olarak da görev yapmış milli mücadele kahramanı." },
    { id: 14, category: "Osmanlı", difficulty: "hard", question: "1453 yılında İstanbul'un fethi sırasında Osmanlı ordusunun amiral gemilerini ve donanmasını Haliç'e indirmek için karadan yürüttüğü güzergah hangi noktalar arasındadır?", options: ["Beşiktaş - Kasımpaşa", "Üsküdar - Kadıköy", "Eminönü - Balat", "Ortaköy - Galata"], correct: 0, hint: "Tophane sırtlarından geçilerek bugünkü Kasımpaşa koyuna ulaşılmıştır." },
    { id: 15, category: "Edebiyat Teorisi", difficulty: "hard", question: "Distopik edebiyatın mihenk taşlarından olan 'Cesur Yeni Dünya' (Brave New World) adlı başyapıtın yazarı kimdir?", options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"], correct: 0, hint: "Fordizm ve yapay üreme teknolojilerinin eleştirildiği bir gelecek kurgulamıştır." }
];
// Kalan 5000 JSON sorusunu buraya ekleyin.

// --- CORE APPLICATION ARCHITECTURE ---
class KutluAtlasEngine {
    constructor() {
        this.sound = new SoundController();
        this.questions = [];
        this.currentStageIndex = 0; // 0 to 19 (Total 20 questions target)
        this.activeQuestion = null;
        
        // Timer elements
        this.timerVal = 60;
        this.timerInterval = null;
        
        // Performance metrics tracking arrays
        this.score = 0;
        this.startTime = null;
        this.totalDurationSeconds = 0;
        this.jokersUsed = { fifty: false, hint: false, divine: false };
        
        this.isUIFrozen = false;
        
        // Cache DOM selectors
        this.dom = {
            themeBtn: document.getElementById('themeToggleBtn'),
            soundBtn: document.getElementById('toggleSoundBtn'),
            musicVol: document.getElementById('musicVol'),
            sfxVol: document.getElementById('sfxVol'),
            welcome: document.getElementById('welcomeState'),
            countdown: document.getElementById('countdownState'),
            gameplay: document.getElementById('gameplayState'),
            results: document.getElementById('resultsState'),
            startBtn: document.getElementById('startGameBtn'),
            restartBtn: document.getElementById('restartGameBtn'),
            qNum: document.getElementById('currentQuestionNum'),
            progressFill: document.getElementById('progressBarFill'),
            timer: document.getElementById('timerDisplay'),
            category: document.getElementById('questionCategory'),
            difficulty: document.getElementById('questionDifficulty'),
            questionText: document.getElementById('questionText'),
            optionsGrid: document.getElementById('optionsGrid'),
            j50: document.getElementById('jokerFifty'),
            jHint: document.getElementById('jokerHint'),
            jDivine: document.getElementById('jokerDivine'),
            resTitle: document.getElementById('resultTitle'),
            resAccuracy: document.getElementById('metricAccuracy'),
            resScore: document.getElementById('metricScore'),
            resTime: document.getElementById('metricTime'),
            resHigh: document.getElementById('metricHighScore'),
            badgeContainer: document.getElementById('badgeContainer'),
            modal: document.getElementById('globalModal'),
            modalTitle: document.getElementById('modalTitle'),
            modalBody: document.getElementById('modalBody'),
            modalClose: document.getElementById('modalCloseBtn')
        };
    }

    init() {
        this.bindEvents();
        this.initCanvasBackground();
        this.syncThemeIcon();
    }

    bindEvents() {
        this.dom.startBtn.addEventListener('click', () => { this.sound.init(); this.runCinematicSequence(); });
        this.dom.restartBtn.addEventListener('click', () => this.resetGameSession());
        this.dom.themeBtn.addEventListener('click', () => this.toggleTheme());
        
        this.dom.soundBtn.addEventListener('click', () => {
            this.sound.setMute(!this.sound.isMuted);
            this.dom.soundBtn.querySelector('.sound-on-icon').classList.toggle('hidden', this.sound.isMuted);
            this.dom.soundBtn.querySelector('.sound-off-icon').classList.toggle('hidden', !this.sound.isMuted);
        });

        const handleVolumeChange = () => {
            this.sound.updateVolumes(this.dom.musicVol.value, this.dom.sfxVol.value);
        };
        this.dom.musicVol.addEventListener('input', handleVolumeChange);
        this.dom.sfxVol.addEventListener('input', handleVolumeChange);

        // Lifeline bindings
        this.dom.j50.addEventListener('click', () => this.applyFiftyFifty());
        this.dom.jHint.addEventListener('click', () => this.applyHintJoker());
        this.dom.jDivine.addEventListener('click', () => this.applyDivineJoker());
        
        this.dom.modalClose.addEventListener('click', () => this.dom.modal.classList.add('hidden'));

        // Keyboard navigation setup
        window.addEventListener('keydown', (e) => {
            if (this.dom.gameplay.classList.contains('visible') && !this.isUIFrozen) {
                const key = e.key.toUpperCase();
                if (['A', 'B', 'C', 'D'].includes(key)) {
                    const idx = key.charCodeAt(0) - 65;
                    const btn = this.dom.optionsGrid.children[idx];
                    if (btn && !btn.classList.contains('eliminated-fifty')) {
                        this.handleOptionSelection(idx);
                    }
                }
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        this.syncThemeIcon();
        this.sound.playClick();
    }

    syncThemeIcon() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        this.dom.themeBtn.querySelector('.sun-icon').classList.toggle('hidden', !isLight);
        this.dom.themeBtn.querySelector('.moon-icon').classList.toggle('hidden', isLight);
    }

    // Modern HTML5 High-Performance Background System
    initCanvasBackground() {
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            ctx.fillStyle = isLight ? 'rgba(0, 143, 90, 0.3)' : 'rgba(0, 168, 107, 0.4)';

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                p.y -= p.speed;
                if (p.y < 0) {
                    p.y = canvas.height;
                    p.x = Math.random() * canvas.width;
                }
            });
            ctx.globalAlpha = 1.0;
            requestAnimationFrame(loop);
        };
        loop();
    }

    switchStateView(targetKey) {
        const states = ['welcome', 'countdown', 'gameplay', 'results'];
        states.forEach(k => {
            this.dom[k].classList.remove('visible');
            this.dom[k].classList.add('hidden');
        });
        this.dom[targetKey].classList.remove('hidden');
        // Force rendering lifecycle trigger
        setTimeout(() => this.dom[targetKey].classList.add('visible'), 50);
    }

    // Welcome Screen Transition Countdown Animation Loop
    runCinematicSequence() {
        this.sound.playClick();
        this.switchStateView('countdown');
        let counter = 3;
        const countElement = document.getElementById('countdownNumber');
        
        const tick = () => {
            if (counter > 0) {
                countElement.innerText = counter;
                this.sound.playTone(440, 'sine', 0.15, 0.5);
                counter--;
                setTimeout(tick, 1000);
            } else {
                this.assembleSessionQuestions();
                this.startTime = Date.now();
                this.currentStageIndex = 0;
                this.switchStateView('gameplay');
                this.renderActiveQuestion();
            }
        };
        tick();
    }

    // Filter, shuffle and parse question assets cleanly based on dynamic run constraints
    assembleSessionQuestions() {
        const pool = [...QUESTION_POOL];
        // Adaptive sorting tier extraction
        const easyQ = pool.filter(q => q.difficulty === 'easy').sort(() => 0.5 - Math.random());
        const medQ = pool.filter(q => q.difficulty === 'medium').sort(() => 0.5 - Math.random());
        const hardQ = pool.filter(q => q.difficulty === 'hard').sort(() => 0.5 - Math.random());

        // Target length 20 selection logic framework wrapper
        // Taking available mock items natively to safely assemble active deck
        this.questions = [
            ...easyQ.slice(0, 6),
            ...medQ.slice(0, 10),
            ...hardQ.slice(0, 4)
        ];
    }

    renderActiveQuestion() {
        this.isUIFrozen = false;
        this.activeQuestion = this.questions[this.currentStageIndex];
        
        // Track visual configurations
        this.dom.qNum.innerText = this.currentStageIndex + 1;
        const progressPercentage = ((this.currentStageIndex + 1) / 20) * 100;
        this.dom.progressFill.style.width = `${progressPercentage}%`;
        
        this.dom.category.innerText = this.activeQuestion.category;
        this.dom.difficulty.innerText = `Zorluk: ${this.activeQuestion.difficulty}`;
        this.dom.questionText.innerText = this.activeQuestion.question;
        
        // Build Option DOM structure dynamically
        this.dom.optionsGrid.innerHTML = '';
        this.activeQuestion.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-node';
            btn.innerHTML = `<span class="option-prefix">${String.fromCharCode(65 + index)}:</span> ${optText}`;
            btn.addEventListener('click', () => this.handleOptionSelection(index));
            this.dom.optionsGrid.appendChild(btn);
        });

        this.syncJokerUnlockStates();
        this.startTimerLoop();
    }

    syncJokerUnlockStates() {
        const round = this.currentStageIndex + 1;
        
        if (this.jokersUsed.fifty) this.dom.j50.classList.add('used');
        
        if (round > 10 && !this.jokersUsed.hint) {
            this.dom.jHint.classList.remove('locked');
            this.dom.jHint.removeAttribute('disabled');
        } else if (this.jokersUsed.hint || round <= 10) {
            this.dom.jHint.classList.add('locked');
            this.dom.jHint.setAttribute('disabled', 'true');
        }

        if (round > 15 && !this.jokersUsed.divine) {
            this.dom.jDivine.classList.remove('locked');
            this.dom.jDivine.removeAttribute('disabled');
        } else if (this.jokersUsed.divine || round <= 15) {
            this.dom.jDivine.classList.add('locked');
            this.dom.jDivine.setAttribute('disabled', 'true');
        }
    }

    startTimerLoop() {
        clearInterval(this.timerInterval);
        this.timerVal = 60;
        this.dom.timer.innerText = this.timerVal;
        this.dom.timer.classList.remove('timer-panic');

        this.timerInterval = setInterval(() => {
            this.timerVal--;
            this.dom.timer.innerText = this.timerVal;
            
            if (this.timerVal <= 15) {
                this.dom.timer.classList.add('timer-panic');
                this.sound.playTick();
            }

            if (this.timerVal <= 0) {
                clearInterval(this.timerInterval);
                this.executeTimeoutElimination();
            }
        }, 1000);
    }

    // Handles the 3-Second Suspension state logic
    handleOptionSelection(selectedIndex) {
        if (this.isUIFrozen) return;
        this.isUIFrozen = true;
        clearInterval(this.timerInterval);
        this.sound.playLock();

        const children = this.dom.optionsGrid.children;
        // Lock visual rendering feedback
        children[selectedIndex].classList.add('selected-lock');

        // Continuous suspense audio ticks during the 3-second delay period
        let ticks = 0;
        const suspenseInterval = setInterval(() => {
            this.sound.playTick();
            ticks++;
            if (ticks >= 3) {
                clearInterval(suspenseInterval);
                this.evaluateJudgment(selectedIndex);
            }
        }, 1000);
    }

    evaluateJudgment(selectedIndex) {
        const correctIdx = this.activeQuestion.correct;
        const children = this.dom.optionsGrid.children;

        if (selectedIndex === correctIdx) {
            // Success Matrix
            children[selectedIndex].classList.remove('selected-lock');
            children[selectedIndex].classList.add('reveal-correct');
            this.sound.playCorrect();
            
            // Score weight allocation calculations
            const difficultyMultiplier = this.activeQuestion.difficulty === 'easy' ? 100 : (this.activeQuestion.difficulty === 'medium' ? 200 : 400);
            this.score += difficultyMultiplier + (this.timerVal * 10);

            this.currentStageIndex++;
            
            setTimeout(() => {
                if (this.currentStageIndex >= 20 || this.currentStageIndex >= this.questions.length) {
                    this.terminateSession(true); // Complete Victory
                } else {
                    this.checkAndTriggerMilestoneModals();
                }
            }, 3000); // 4-second immersive soundscape allocation balance block
        } else {
            // Failure Routing
            children[selectedIndex].classList.remove('selected-lock');
            children[selectedIndex].classList.add('reveal-wrong');
            children[correctIdx].classList.add('reveal-correct');
            this.sound.playWrong();
            
            setTimeout(() => {
                this.terminateSession(false);
            }, 3000);
        }
    }

    executeTimeoutElimination() {
        this.isUIFrozen = true;
        this.sound.playWrong();
        const correctIdx = this.activeQuestion.correct;
        this.dom.optionsGrid.children[correctIdx].classList.add('reveal-correct');
        
        setTimeout(() => {
            this.terminateSession(false);
        }, 3000);
    }

    checkAndTriggerMilestoneModals() {
        const nextRoundNum = this.currentStageIndex + 1;
        if (nextRoundNum === 11) {
            this.triggerModal("KÜLTÜRLÜ Unvanı Kazanıldı!", "Tebrikler, 10. soruyu başarıyla geçerek entelektüel güvenli bölge barajına ulaştınız. 'Sezgisel İpucu' jokeri kullanıma açıldı!");
        } else if (nextRoundNum === 16) {
            this.triggerModal("BİLGİN Unvanı Kazanıldı!", "İnanılmaz! 15 kritik barajını aştınız ve zihin sınırlarını zorluyorsunuz. 'Tanrısal Müdahale' jokeri aktif edildi!");
        }
        this.renderActiveQuestion();
    }

    triggerModal(title, text) {
        this.dom.modalTitle.innerText = title;
        this.dom.modalBody.innerText = text;
        this.dom.modal.classList.remove('hidden');
    }

    // --- LIFELINE IMPLEMENTATIONS ---
    applyFiftyFifty() {
        if (this.isUIFrozen || this.jokersUsed.fifty) return;
        this.jokersUsed.fifty = true;
        this.sound.playClick();
        
        const correctIdx = this.activeQuestion.correct;
        let eliminatedCount = 0;
        let indices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());

        for (let idx of indices) {
            if (idx !== correctIdx && eliminatedCount < 2) {
                this.dom.optionsGrid.children[idx].classList.add('eliminated-fifty');
                eliminatedCount++;
            }
        }
        this.syncJokerUnlockStates();
    }

    applyHintJoker() {
        if (this.isUIFrozen || this.jokersUsed.hint || (this.currentStageIndex + 1) <= 10) return;
        this.jokersUsed.hint = true;
        this.sound.playClick();
        
        this.triggerModal("Sezgisel İpucu", this.activeQuestion.hint || "Bu soru için ipucu bulunmuyor.");
        this.syncJokerUnlockStates();
    }

    applyDivineJoker() {
        if (this.isUIFrozen || this.jokersUsed.divine || (this.currentStageIndex + 1) <= 15) return;
        this.jokersUsed.divine = true;
        this.sound.playClick();

        const correctIdx = this.activeQuestion.correct;
        const targetBtn = this.dom.optionsGrid.children[correctIdx];
        targetBtn.style.borderWidth = "3px";
        targetBtn.style.borderColor = "gold";
        targetBtn.style.boxShadow = "0 0 20px rgba(255,215,0,0.6)";
        
        this.syncJokerUnlockStates();
    }

    // --- SCREEN MATRIX TERMINATION & RESET ---
    terminateSession(isVictory) {
        clearInterval(this.timerInterval);
        this.totalDurationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        this.switchStateView('results');

        // Parse Dynamic Badges based on structural milestones reached
        let badgeText = "ÇIRAK";
        const roundReached = this.currentStageIndex + 1;

        if (isVictory || roundReached > 20) {
            this.dom.resTitle.innerText = "SİZ BİR FİLOZOFSUNUZ";
            badgeText = "🏆 FİLOZOF BADGE 🏆";
        } else if (roundReached >= 16) {
            this.dom.resTitle.innerText = "BİLGİN BİR İNSANSINIZ";
            badgeText = "🎖️ BİLGİN BADGE 🎖️";
        } else if (roundReached >= 11) {
            this.dom.resTitle.innerText = "KÜLTÜRLÜ BİR İNSANSINIZ";
            badgeText = "📜 KÜLTÜRLÜ BADGE 📜";
        } else {
            this.dom.resTitle.innerText = "OYUN BİTTİ";
            badgeText = "💡 YOLUN BAŞINDAKİ GEZGİN 💡";
        }

        this.dom.badgeContainer.innerText = badgeText;
        this.dom.resAccuracy.innerText = `${this.currentStageIndex} / 20`;
        this.dom.resScore.innerText = this.score;
        this.dom.resTime.innerText = `${this.totalDurationSeconds} saniye`;

        // LocalStorage Engine Persistence Layer
        let currentHighScore = localStorage.getItem('atlas_highscore') || 0;
        if (this.score > currentHighScore) {
            currentHighScore = this.score;
            localStorage.setItem('atlas_highscore', currentHighScore);
        }
        this.dom.resHigh.innerText = currentHighScore;
    }

    resetGameSession() {
        this.sound.playClick();
        this.currentStageIndex = 0;
        this.score = 0;
        this.jokersUsed = { fifty: false, hint: false, divine: false };
        this.dom.j50.classList.remove('used');
        this.runCinematicSequence();
    }
}

// Instantiate Runtime Core Instance Engine
document.addEventListener('DOMContentLoaded', () => {
    const app = new KutluAtlasEngine();
    app.init();
});