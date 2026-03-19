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

    // --- Calendar Modal Logic ---
    const calendarModal = document.getElementById('calendar-modal');
    const viewCalendarBtn = document.getElementById('view-calendar-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const calendarDays = document.getElementById('calendar-days');

    viewCalendarBtn.addEventListener('click', () => {
        calendarModal.classList.remove('hidden-state');
        generateCalendar();
    });

    closeModalBtn.addEventListener('click', () => {
        calendarModal.classList.add('hidden-state');
    });

    // Close on overlay click
    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            calendarModal.classList.add('hidden-state');
        }
    });

    const employees = ["Alex M.", "Sarah J.", "David K.", "Emma W.", "Michael T.", "Olivia L.", "James R.", "Sophia B."];
    
    function getRandomWorkers(count) {
        let shuffled = [...employees].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function generateCalendar() {
        calendarDays.innerHTML = '';
        
        // Let's hardcode to March 2026 for demonstration
        // March 2026 starts on a Sunday (0) and has 31 days
        const startDayIndex = 0; 
        const totalDays = 31;
        const todayDate = 16; // March 16th, 2026 to match context
        
        // Add empty cells for padding start of month
        for(let i = 0; i < startDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-cell empty';
            calendarDays.appendChild(emptyCell);
        }

        // Add days
        for(let day = 1; day <= totalDays; day++) {
            const cell = document.createElement('div');
            cell.className = `cal-cell ${day === todayDate ? 'today' : ''}`;
            
            const dateNum = document.createElement('div');
            dateNum.className = 'cal-date';
            dateNum.innerText = day;
            cell.appendChild(dateNum);

            // Determine day of week (0 = Sun, 6 = Sat)
            const dayOfWeek = (startDayIndex + day - 1) % 7;
            
            // Only add workers on weekdays
            if(dayOfWeek !== 0 && dayOfWeek !== 6) {
                const officeList = document.createElement('div');
                officeList.className = 'office-list';
                
                // Randomly add 2-4 workers to office
                const numWorkers = Math.floor(Math.random() * 3) + 2;
                const workers = getRandomWorkers(numWorkers);
                
                workers.forEach(w => {
                    const wSpan = document.createElement('span');
                    wSpan.className = 'worker-name';
                    wSpan.innerText = w;
                    officeList.appendChild(wSpan);
                });
                
                cell.appendChild(officeList);
            }

            calendarDays.appendChild(cell);
        }
        
        // Add empty cells for grid padding at end
        const totalCells = startDayIndex + totalDays;
        const remainder = totalCells % 7;
        if(remainder !== 0) {
            for(let i = 0; i < (7 - remainder); i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'cal-cell empty';
                calendarDays.appendChild(emptyCell);
            }
        }
    }

    // --- Staff Management Logic ---
    const startAdminBtn = document.getElementById('start-admin-btn');
    const managerLoginModal = document.getElementById('manager-login-modal');
    const staffManagementModal = document.getElementById('staff-management-modal');
    
    const closeLoginBtn = document.getElementById('close-login-btn');
    const closeStaffBtn = document.getElementById('close-staff-btn');
    
    const secretInput = document.getElementById('secret-phrase-input');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const loginError = document.getElementById('login-error');
    
    const staffEmailInput = document.getElementById('staff-email-input');
    const staffLocationInput = document.getElementById('staff-location-input');
    const addStaffBtn = document.getElementById('add-staff-btn');
    const staffEmailListEl = document.getElementById('staff-email-list');
    const staffAddSuccess = document.getElementById('staff-add-success');
    const staffEmailError = document.getElementById('staff-email-error');

    let staffMembers = [];

    // Load initial staff
    async function loadStaff() {
        try {
            const res = await fetch('/api/staff');
            staffMembers = await res.json();
            renderStaffList();
        } catch (err) {
            console.error("Failed to load staff:", err);
        }
    }

    // Open Login
    startAdminBtn.addEventListener('click', () => {
        managerLoginModal.classList.remove('hidden-state');
        secretInput.value = '';
        loginError.classList.add('hidden-state');
    });

    // Handle Login
    loginSubmitBtn.addEventListener('click', () => {
        if (secretInput.value === "Iamthemanager") {
            managerLoginModal.classList.add('hidden-state');
            staffManagementModal.classList.remove('hidden-state');
            loadStaff();
        } else {
            loginError.classList.remove('hidden-state');
        }
    });

    // Submit on Enter
    secretInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginSubmitBtn.click();
    });

    // Close Modals
    closeLoginBtn.addEventListener('click', () => managerLoginModal.classList.add('hidden-state'));
    closeStaffBtn.addEventListener('click', () => staffManagementModal.classList.add('hidden-state'));

    // Handle Add Staff
    addStaffBtn.addEventListener('click', async () => {
        const email = staffEmailInput.value.trim();
        const location = staffLocationInput.value;
        
        // Hide previous messages
        staffEmailError.classList.add('hidden-state');
        staffAddSuccess.classList.add('hidden-state');

        if (email && email.includes('@')) {
            try {
                const res = await fetch('/api/staff', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, location })
                });
                staffMembers = await res.json();
                staffEmailInput.value = '';
                renderStaffList();
                
                // Show success feedback
                staffAddSuccess.classList.remove('hidden-state');
                setTimeout(() => {
                    staffAddSuccess.classList.add('hidden-state');
                }, 3000);
            } catch (err) {
                console.error("Failed to add staff:", err);
            }
        } else {
            // Show validation error
            staffEmailError.classList.remove('hidden-state');
        }
    });

    staffEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addStaffBtn.click();
    });

    function renderStaffList() {
        staffEmailListEl.innerHTML = '';
        staffMembers.forEach((member) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="staff-info">
                    <span class="staff-email">${member.email}</span>
                    <span class="location-badge ${member.location.toLowerCase()}">${member.location}</span>
                </div>
                <button class="remove-staff-btn" data-email="${member.email}">Remove</button>
            `;
            staffEmailListEl.appendChild(li);
        });

        // Add remove listeners
        document.querySelectorAll('.remove-staff-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const email = e.target.dataset.email;
                try {
                    const res = await fetch('/api/staff', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    staffMembers = await res.json();
                    renderStaffList();
                } catch (err) {
                    console.error("Failed to remove staff:", err);
                }
            });
        });
    }

    // Modal overlay closes
    [managerLoginModal, staffManagementModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden-state');
            }
        });
    });
});
