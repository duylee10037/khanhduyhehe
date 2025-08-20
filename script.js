// Clear, readable audio controller for page music
// - Autoplays after first user gesture (required by browsers)
// - Loops, plays inline, preload=auto, default volume 0.7
// - Toggles with button #toggle-audio and updates #audio-icon

(function () {
	const AUDIO_SRC = './songs/Ly.mp3';

	function createAudioElement() {
		const audio = new Audio(AUDIO_SRC);
		audio.loop = true;
		audio.volume = 0.7;
		audio.preload = 'auto';
		audio.setAttribute('playsinline', '');
		return audio;
	}

	const musicManager = {
		audio: null,
		isPlaying: false,

		init() {
			this.audio = createAudioElement();

			this.audio.onplay = () => {
				this.isPlaying = true;
				this.updateUI();
			};

			this.audio.onpause = () => {
				this.isPlaying = false;
				this.updateUI();
			};

			// Kick off playback on first user gesture
			document.addEventListener(
				'click',
				() => {
					if (!this.isPlaying) {
						this.audio
							.play()
							.catch((err) => console.warn('Không thể phát nhạc:', err));
					}
				},
				{ once: true }
			);

			this.updateUI();
		},

		togglePlayback() {
			if (!this.audio) return;
			if (this.audio.paused) {
				this.audio.play().catch((err) => console.warn('Lỗi phát nhạc:', err));
			} else {
				this.audio.pause();
			}
		},

		updateUI() {
			const icon = document.getElementById('audio-icon');
			if (!icon) return;
			if (this.isPlaying) {
				icon.classList.remove('fa-volume-xmark');
				icon.classList.add('fa-volume-high');
			} else {
				icon.classList.remove('fa-volume-high');
				icon.classList.add('fa-volume-xmark');
			}
		},
	};

	// Chỉ khởi tạo sau khi ứng dụng thực sự bắt đầu (sau màn PIN và loading)
	window.addEventListener('app:started', () => {
		musicManager.init();
		const toggleBtn = document.getElementById('toggle-audio');
		if (toggleBtn) {
			toggleBtn.addEventListener('click', () => musicManager.togglePlayback());
		}
	});
})();
