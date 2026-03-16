document.addEventListener('DOMContentLoaded', () => {
    // --- Roulette Logic ---
    const revealCard = document.getElementById('reveal-card');
    const processingCard = document.getElementById('processing-card');
    const remoteCard = document.getElementById('remote-card');
    const officeCard = document.getElementById('office-card');
    
    const revealBtn = document.getElementById('reveal-btn');
    const resetBtns = document.querySelectorAll('.reset-btn');

    function hideAllCards() {
        revealCard.classList.remove('active-state');
        revealCard.classList.add('hidden-state');
        
        processingCard.classList.remove('active-state');
        processingCard.classList.add('hidden-state');
        
        remoteCard.classList.remove('active-state');
        remoteCard.classList.add('hidden-state');
        
        officeCard.classList.remove('active-state');
        officeCard.classList.add('hidden-state');
    }

    revealBtn.addEventListener('click', () => {
        revealBtn.innerText = 'Calculating...';
        revealBtn.disabled = true;
        
        const dice = document.getElementById('dice');
        dice.classList.add('spinning');

        // Spin for 2.5 seconds directly on the reveal card without showing processing card
        setTimeout(() => {
            hideAllCards();
            dice.classList.remove('spinning');
            
            // Randomly decide (50% chance for demonstration)
            const isRemote = Math.random() > 0.5;

            if (isRemote) {
                remoteCard.classList.remove('hidden-state');
                remoteCard.classList.add('active-state');
                resetCheckinForm();
            } else {
                officeCard.classList.remove('hidden-state');
                officeCard.classList.add('active-state');
            }

            setTimeout(() => {
                revealBtn.innerText = "Reveal Today's Status";
                revealBtn.disabled = false;
            }, 500);

        }, 2000); 
    });

    resetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllCards();
            revealCard.classList.remove('hidden-state');
            revealCard.classList.add('active-state');
        });
    });

    // --- Voting Logic ---
    const dayVotes = document.querySelectorAll('.day-votes .vote-btn');
    dayVotes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            dayVotes.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    const satVotes = document.querySelectorAll('.satisfaction-votes .sat-btn');
    satVotes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            satVotes.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
        });
    });

    // --- Check-in Radio ---
    const checkinRadio = document.getElementById('checkin-radio');
    const checkinStatusText = document.getElementById('checkin-status-text');

    checkinRadio.addEventListener('change', (e) => {
        if (e.target.checked) {
            checkinStatusText.innerText = "Morning check-in confirmed.";
            checkinStatusText.style.color = "var(--success-green)";
            checkinStatusText.style.fontWeight = "500";
        }
    });

    // --- Voice Note Check-out ---
    const micBtn = document.getElementById('mic-btn');
    const recordingTime = document.getElementById('recording-time');
    const submitVoiceBtn = document.getElementById('submit-voice');
    const checkoutStatusText = document.getElementById('checkout-status-text');

    let isRecording = false;
    let timerInterval;
    let seconds = 0;

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    micBtn.addEventListener('click', () => {
        if (!isRecording) {
            // Start recording demo
            isRecording = true;
            micBtn.classList.add('recording');
            micBtn.innerText = "Stop";
            submitVoiceBtn.disabled = true;
            
            seconds = 0;
            recordingTime.innerText = formatTime(seconds);
            checkoutStatusText.innerText = "Recording...";
            checkoutStatusText.style.color = "var(--danger-red)";
            
            timerInterval = setInterval(() => {
                seconds++;
                recordingTime.innerText = formatTime(seconds);
            }, 1000);
        } else {
            // Stop recording demo
            isRecording = false;
            clearInterval(timerInterval);
            micBtn.classList.remove('recording');
            micBtn.innerText = "Record";
            submitVoiceBtn.disabled = false;
            checkoutStatusText.innerText = "Voice note ready. Click Submit.";
            checkoutStatusText.style.color = "var(--text-secondary)";
        }
    });

    submitVoiceBtn.addEventListener('click', () => {
        checkoutStatusText.innerText = "Check-out completed successfully!";
        checkoutStatusText.style.color = "var(--success-green)";
        checkoutStatusText.style.fontWeight = "600";
        submitVoiceBtn.disabled = true;
        
        // Disable mic after submission
        micBtn.disabled = true;
        micBtn.style.opacity = "0.5";
    });

    function resetCheckinForm() {
        // Reset radio
        checkinRadio.checked = false;
        checkinStatusText.innerText = "Confirm you are at your desk.";
        checkinStatusText.style.color = "";
        checkinStatusText.style.fontWeight = "normal";

        // Reset voice note
        isRecording = false;
        clearInterval(timerInterval);
        seconds = 0;
        recordingTime.innerText = "00:00";
        micBtn.classList.remove('recording');
        micBtn.innerText = "Record";
        micBtn.disabled = false;
        micBtn.style.opacity = "1";
        submitVoiceBtn.disabled = true;
        checkoutStatusText.innerText = "Required voice note: What did you do today?";
        checkoutStatusText.style.color = "var(--text-secondary)";
        checkoutStatusText.style.fontWeight = "normal";
    }

    // --- Standup Countdown ---
    let minutes = 30;
    const countdownEl = document.getElementById('standup-countdown');
    if (countdownEl) {
        setInterval(() => {
            if(minutes > 0) {
                minutes--;
                countdownEl.innerText = `${minutes}m`;
            }
        }, 60000);
    }
});
