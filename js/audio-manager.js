class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;

        // Repulsor Loop Nodes
        this.repulsorOsc = null;
        this.repulsorGain = null;
        this.repulsorFilter = null;
        this.repulsorLFO = null;
        this.isPlayingRepulsor = false;

        // Drone Nodes (Background)
        this.droneOsc = null;
        this.droneGain = null;

        // Master Volume
        this.masterGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            // Master Gain for Muting
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            console.log("Audio System Initialized");
            this.startDrone();
        } else if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        if (!this.ctx) return this.isMuted;

        this.isMuted = !this.isMuted;
        const targetGain = this.isMuted ? 0 : 1;
        const t = this.ctx.currentTime;

        // Use ramp to prevent clicking
        this.masterGain.gain.setTargetAtTime(targetGain, t, 0.05);

        return this.isMuted;
    }

    // --- Sound Generators ---

    // UI Hover: High-pitch tech chirp
    playHover() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, t);
        osc.frequency.exponentialRampToValueAtTime(4000, t + 0.1);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.1);
    }

    // UI Click: Mechanical thud
    playClick() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.15);
    }

    // Startup: Power up sweep
    playStartup() {
        if (!this.ctx) this.init(); // Auto init if needed (user action context)
        const t = this.ctx.currentTime;

        // 1. Low Bass Sweep
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.frequency.setValueAtTime(50, t);
        osc1.frequency.exponentialRampToValueAtTime(800, t + 2.0);
        gain1.gain.setValueAtTime(0.2, t);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(t);
        osc1.stop(t + 2.0);

        // 2. High Sparkle
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(2000, t);
        osc2.frequency.exponentialRampToValueAtTime(6000, t + 1.0);
        gain2.gain.setValueAtTime(0.05, t);
        gain2.gain.linearRampToValueAtTime(0, t + 0.5);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(t);
        osc2.stop(t + 1.0);
    }

    // Hand Power Up (Repulsor Activate)
    playPowerUp() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.4);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
    }

    // Hand Power Down
    playPowerDown() {
        if (!this.ctx || this.isMuted) return;
        const t = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';

        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.3);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.3);
    }

    // --- Continuous Loops ---

    startDrone() {
        // Deep Space Drone
        if (this.droneOsc) return;
        const t = this.ctx.currentTime;

        this.droneOsc = this.ctx.createOscillator();
        this.droneOsc.type = 'triangle';
        this.droneOsc.frequency.setValueAtTime(55, t); // Low A

        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.setValueAtTime(0.02, t); // Very quiet

        this.droneOsc.connect(this.droneGain);
        this.droneGain.connect(this.masterGain);
        this.droneOsc.start(t);
    }

    startRepulsorHum() {
        if (this.isPlayingRepulsor || !this.ctx) return;
        const t = this.ctx.currentTime;

        // "Repulsor" is a filtered sawtooth with LFO
        this.repulsorOsc = this.ctx.createOscillator();
        this.repulsorOsc.type = 'sawtooth';
        this.repulsorOsc.frequency.setValueAtTime(100, t);

        // Lowpass filter for "hum"
        this.repulsorFilter = this.ctx.createBiquadFilter();
        this.repulsorFilter.type = 'lowpass';
        this.repulsorFilter.frequency.setValueAtTime(200, t);

        // Gain envelope
        this.repulsorGain = this.ctx.createGain();
        this.repulsorGain.gain.setValueAtTime(0, t);
        this.repulsorGain.gain.linearRampToValueAtTime(0.15, t + 0.5); // Fade in

        // Connect
        this.repulsorOsc.connect(this.repulsorFilter);
        this.repulsorFilter.connect(this.repulsorGain);
        this.repulsorGain.connect(this.masterGain);

        this.repulsorOsc.start(t);
        this.isPlayingRepulsor = true;
    }

    stopRepulsorHum() {
        if (!this.isPlayingRepulsor || !this.ctx) return;
        const t = this.ctx.currentTime;

        // Fade out
        this.repulsorGain.gain.cancelScheduledValues(t);
        this.repulsorGain.gain.setValueAtTime(this.repulsorGain.gain.value, t);
        this.repulsorGain.gain.linearRampToValueAtTime(0, t + 0.2);

        this.repulsorOsc.stop(t + 0.2);

        setTimeout(() => {
            this.isPlayingRepulsor = false;
        }, 200);
    }

    // Modulate Hum based on Intensity (0-1) or Distance
    modulateRepulsor(intensityFactor) {
        if (!this.isPlayingRepulsor || !this.ctx) return;
        const t = this.ctx.currentTime;

        // Intensity increases pitch and filter opening
        // intensityFactor: 0 (weak/far) to 1 (strong/close)

        // Pitch: 80Hz -> 200Hz
        const targetFreq = 80 + (intensityFactor * 120);
        this.repulsorOsc.frequency.setTargetAtTime(targetFreq, t, 0.1);

        // Filter: 150Hz -> 2000Hz (Opens up "growl")
        const targetFilter = 150 + (intensityFactor * 1850);
        this.repulsorFilter.frequency.setTargetAtTime(targetFilter, t, 0.1);

        // Tremolo LFO rate could also increase... simplistic for now
    }
}
