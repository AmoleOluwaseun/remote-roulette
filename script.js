document.addEventListener('DOMContentLoaded', () => {
    // --- Roulette Logic ---
    const revealCard = document.getElementById('reveal-card');
    const processingCard = document.getElementById('processing-card');
    const remoteCard = document.getElementById('remote-card');
    const officeCard = document.getElementById('office-card');
    const holidayCard = document.getElementById('holiday-card');
    
    const revealBtn = document.getElementById('reveal-btn');
    const resetBtns = document.querySelectorAll('.reset-btn');

    function hideAllCards() {
        if (revealCard) {
            revealCard.classList.remove('active-state');
            revealCard.classList.add('hidden-state');
        }
        
        if (processingCard) {
            processingCard.classList.remove('active-state');
            processingCard.classList.add('hidden-state');
        }
        
        if (remoteCard) {
            remoteCard.classList.remove('active-state');
            remoteCard.classList.add('hidden-state');
        }
        
        if (officeCard) {
            officeCard.classList.remove('active-state');
            officeCard.classList.add('hidden-state');
        }

        if (holidayCard) {
            holidayCard.classList.remove('active-state');
            holidayCard.classList.add('hidden-state');
        }
    }

    revealBtn.addEventListener('click', () => {
        revealBtn.innerText = 'Calculating...';
        revealBtn.disabled = true;
        
        const dice = document.getElementById('dice');
        dice.classList.add('spinning');

        // Spin for 2.5 seconds directly on the reveal card without showing processing card
        const userEmail = localStorage.getItem('userEmail');
        const today = new Date().getDate(); // Dynamic system date
        const todaySchedule = currentSchedule[today] || [];
        const myAssignment = todaySchedule.find(s => s.email.toLowerCase() === (userEmail || "").toLowerCase());

        // Animation
        // Assuming dicePlaceholder and diceContainer are new elements for animation
        // and remoteState/officeState are new elements to display the result.
        // For now, I'll map them to existing elements or assume they will be defined.
        // Using existing dice for spinning animation.
        const dicePlaceholder = document.getElementById('dice-placeholder') || dice; // Placeholder for dice if it exists
        const diceContainer = document.getElementById('dice-container') || dice; // Container for dice if it exists
        const remoteState = remoteCard; // Map to existing remoteCard
        const officeState = officeCard; // Map to existing officeCard

        dicePlaceholder.classList.add('hidden-state');
        diceContainer.classList.remove('hidden-state');
        
        // Determine state from schedule or fallback to random
        let state = 'random';
        
        // Check if schedule for the week is empty
        const isScheduleEmpty = Object.keys(currentSchedule).filter(key => key !== '_weekStart').length === 0;

        // Check if user is a known staff member
        const isKnownStaff = staffMembers.some(s => s.email.toLowerCase() === (userEmail || '').toLowerCase());

        if (isScheduleEmpty) {
            state = 'NoSchedule';
        } else if (myAssignment && myAssignment.status === 'Holiday') {
            state = 'Holiday';
        } else if (myAssignment) {
            // On today's schedule = come into the office
            state = 'Onsite';
        } else if (isKnownStaff) {
            // On staff list but not scheduled today = work from home
            state = 'Offsite';
        } else {
            // Not on staff list at all
            state = 'NotFound';
        }
        
        setTimeout(() => {
            hideAllCards(); // Hide all cards first
            dice.classList.remove('spinning');

            if (state === 'Holiday') {
                const holidayCard = document.getElementById('holiday-card');
                const holidayMsg = document.getElementById('holiday-message');
                const messages = [
                    "Lucky you! Enjoy your celebration or have lots of rest today, don't you dare think about working today....",
                    "It's a public holiday! Time to unplug, unwind, and absolutely ignore your inbox. 🥳",
                    "The office is closed! Go outside, breath some fresh air, and forget your password for 24 hours.",
                    "Hooray! A well-deserved break. The only 'standup' you should do today is getting out of bed for snacks.",
                    "Enjoy the festivities! Working today is officially forbidden by the Remote Roulette laws. 🚫💻"
                ];
                holidayMsg.innerText = messages[Math.floor(Math.random() * messages.length)];
                holidayCard.classList.remove('hidden-state');
                holidayCard.classList.add('active-state');
            } else if (state === 'Offsite') {
                remoteCard.classList.remove('hidden-state');
                remoteCard.classList.add('active-state');
                resetCheckinForm();
            } else if (state === 'Onsite' || state === 'NoSchedule' || state === 'NotFound') {
                const title = officeCard.querySelector('.result-title');
                const desc = officeCard.querySelector('.result-desc');
                
                if (state === 'NoSchedule') {
                    title.innerText = "Schedule Pending";
                    desc.innerText = "The weekly schedule has not yet been generated. Please work from the office physically today, it's the same for everyone else until the manager creates the new schedule.";
                } else if (state === 'NotFound') {
                    title.innerText = "Check with Your Manager";
                    desc.innerText = "Your email was not found on today's schedule. Please speak to your manager for your assignment. In the meantime, please work from the office.";
                } else {
                    title.innerText = "See You at the Office!";
                    desc.innerText = "Head in and collaborate with the team today. Please complete your morning check-in.";
                }
                
                officeCard.classList.remove('hidden-state');
                officeCard.classList.add('active-state');
            }
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

    // --- Check-in Radio (Remote/WFH only) ---
    const checkinRadio = document.getElementById('checkin-radio');
    const checkinStatusText = document.getElementById('checkin-status-text');

    async function handleCheckin(radio, statusText, location) {
        if (radio.checked) {
            const userEmail = localStorage.getItem('userEmail');
            const time = new Date().toLocaleString();
            
            statusText.innerText = "Check-in confirmed.";
            statusText.style.color = "var(--success-green)";
            statusText.style.fontWeight = "500";

            try {
                await fetch('/api/checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, time: time, location: location })
                });
                console.log(`Check-in recorded for ${userEmail} at ${time}`);
            } catch (err) {
                console.error("Failed to record check-in:", err);
            }
        }
    }

    checkinRadio.addEventListener('change', () => handleCheckin(checkinRadio, checkinStatusText, 'Remote'));

    function resetCheckinForm() {
        checkinRadio.checked = false;
        checkinStatusText.innerText = "Confirm you are at your desk.";
        checkinStatusText.style.color = "";
        checkinStatusText.style.fontWeight = "normal";
    }

    // --- Calendar Modal Logic ---
    const calendarModal = document.getElementById('calendar-modal');
    const viewCalendarBtn = document.getElementById('view-calendar-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const calendarDays = document.getElementById('calendar-days');
    const downloadCalendarBtn = document.getElementById('download-calendar-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');

    // --- Date Helpers ---
    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 is Sunday
        const diff = d.getDate() - day;
        const weekStart = new Date(d.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function getWeekRangeString(startDate) {
        const start = new Date(startDate);
        const end = new Date(startDate);
        end.setDate(start.getDate() + 6);
        
        const options = { month: 'long', day: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' });
        return `Weekly Schedule: ${startStr} - ${endStr}`;
    }

    function downloadScheduleCSV() {
        if (!currentSchedule || Object.keys(currentSchedule).length <= 1) {
            alert("No schedule available to download.");
            return;
        }

        const weekStart = new Date(currentSchedule._weekStart);
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Day,Email,Location,Status\n";

        // Sort days numerically
        const days = Object.keys(currentSchedule)
            .filter(key => !isNaN(key))
            .sort((a, b) => parseInt(a) - parseInt(b));

        days.forEach(day => {
            const dayNum = parseInt(day);
            const date = new Date(weekStart);
            date.setDate(dayNum);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

            currentSchedule[day].forEach(item => {
                const row = [
                    dateStr,
                    dayName,
                    item.email,
                    item.location,
                    item.status
                ].map(v => `"${v}"`).join(",");
                csvContent += row + "\n";
            });
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `office_schedule_${currentSchedule._weekStart}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    viewCalendarBtn.addEventListener('click', () => {
        calendarModal.classList.remove('hidden-state');
        backToMenuFromSched.classList.add('hidden-state'); // Hide back button if accessed from main page
        generateCalendar();
    });

    closeModalBtn.addEventListener('click', () => {
        calendarModal.classList.add('hidden-state');
    });

    downloadCalendarBtn.addEventListener('click', downloadScheduleCSV);

    downloadPdfBtn.addEventListener('click', () => {
        window.print();
    });

    // Close on overlay click
    calendarModal.addEventListener('click', (e) => {
        if (e.target === calendarModal) {
            calendarModal.classList.add('hidden-state');
        }
    });

    const employees = ["Alex M.", "Sarah J.", "David K.", "Emma W.", "Michael T.", "Olivia L.", "James R.", "Sophia B."];
    
    let currentSchedule = {}; // Will hold the saved schedule { "16": [{email, location, status}, ...], ... }

    async function loadSchedule() {
        try {
            const res = await fetch('/api/schedule');
            currentSchedule = await res.json();
            // If empty, generateCalendar will still show random demo or nothing
        } catch (err) {
            console.error("Failed to load schedule:", err);
        }
    }

    function getRandomWorkers(count) {
        let shuffled = [...employees].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function generateCalendar() {
        calendarDays.innerHTML = '';
        const monthYearEl = document.getElementById('calendar-month-year');
        
        const today = new Date();
        const weekStart = getWeekStart(today);
        
        if (monthYearEl) {
            monthYearEl.innerText = getWeekRangeString(weekStart);
        }
        
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const todayDateNum = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();
        
        for(let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + i);
            
            const dayNum = currentDay.getDate();
            const dayName = dayNames[i];
            const isToday = dayNum === todayDateNum && currentDay.getMonth() === todayMonth && currentDay.getFullYear() === todayYear;
            
            const cell = document.createElement('div');
            cell.className = `cal-cell ${isToday ? 'today' : ''}`;
            
            // Date Box (Left side)
            const dateBox = document.createElement('div');
            dateBox.className = 'cal-date-box';
            
            const dayLabel = document.createElement('div');
            dayLabel.className = 'cal-day-name';
            dayLabel.innerText = dayName.substring(0, 3);
            
            const dateNum = document.createElement('div');
            dateNum.className = 'cal-date';
            dateNum.innerText = dayNum;
            
            dateBox.appendChild(dayLabel);
            dateBox.appendChild(dateNum);
            cell.appendChild(dateBox);

            // Office List (Right side)
            const officeList = document.createElement('div');
            officeList.className = 'office-list';
            
            // Check if we have generated schedule for this day
            const scheduledStaff = currentSchedule[dayNum] || [];

            // 0=Sun, 6=Sat
            if(i !== 0 && i !== 6) {
                // Determine display list
                let displayList = [];

                if (scheduledStaff.length > 0) {
                    // Filter for only 'Onsite' staff to show in 'Office List'
                    displayList = scheduledStaff.filter(s => s.status === 'Onsite');
                } else if (!currentSchedule._weekStart) {
                    // Fallback to demo names ONLY if no week is initialized at all (old data format)
                    const num = Math.floor(Math.random() * 3) + 2;
                    displayList = getRandomWorkers(num).map(name => ({ email: name, location: Math.random() > 0.5 ? 'Lagos' : 'Ibadan' }));
                }

                const userEmail = localStorage.getItem('userEmail');

                if (displayList.length === 0 && scheduledStaff.some(s => s.status === 'Holiday')) {
                    const holidayMsg = document.createElement('span');
                    holidayMsg.className = 'holiday-msg';
                    holidayMsg.innerText = "Public Holiday - Office Closed";
                    holidayMsg.style.color = "var(--danger-red)";
                    holidayMsg.style.fontWeight = "600";
                    officeList.appendChild(holidayMsg);
                } else {
                    displayList.forEach(staff => {
                        const badge = document.createElement('div');
                        const isMe = userEmail && staff.email.toLowerCase() === userEmail.toLowerCase();
                        badge.className = `worker-badge ${isMe ? 'highlight-me' : ''}`;
                        
                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'worker-name';
                        const displayName = staff.email.includes('@') ? staff.email.split('@')[0] : staff.email;
                        nameSpan.innerText = isMe ? `${displayName} (You)` : displayName;
                        
                        const locSpan = document.createElement('span');
                        locSpan.className = `worker-location ${staff.location.toLowerCase()}`;
                        locSpan.innerText = staff.location;
                        
                        badge.appendChild(nameSpan);
                        badge.appendChild(locSpan);
                        officeList.appendChild(badge);
                    });
                    
                    if (displayList.length === 0 && scheduledStaff.length > 0) {
                        const remoteMsg = document.createElement('span');
                        remoteMsg.innerText = "All Staff Remote";
                        remoteMsg.style.color = "var(--text-secondary)";
                        officeList.appendChild(remoteMsg);
                    }
                }
            } else {
                const weekendMsg = document.createElement('span');
                weekendMsg.className = 'weekend-msg';
                weekendMsg.innerText = "Weekend - No Office Coverage Required";
                weekendMsg.style.color = "var(--text-secondary)";
                weekendMsg.style.fontSize = "0.9rem";
                weekendMsg.style.fontStyle = "italic";
                officeList.appendChild(weekendMsg);
            }

            cell.appendChild(officeList);
            calendarDays.appendChild(cell);
        }
    }

    // --- Staff Management Logic ---
    const startAdminBtn = document.getElementById('start-admin-btn');
    const managerLoginModal = document.getElementById('manager-login-modal');
    const managerMenuModal = document.getElementById('manager-menu-modal');
    const staffManagementModal = document.getElementById('staff-management-modal');
    const createScheduleModal = document.getElementById('create-schedule-modal');
    
    const closeLoginBtn = document.getElementById('close-login-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const closeStaffBtn = document.getElementById('close-staff-btn');
    const closeCreateBtn = document.getElementById('close-create-btn');

    const backToMenuFromStaff = document.getElementById('back-to-menu-from-staff');
    const backToMenuFromSched = document.getElementById('back-to-menu-from-sched');
    const backToMenuFromCreate = document.getElementById('back-to-menu-from-create');

    const menuCreateBtn = document.getElementById('menu-create-btn');
    const menuAddStaffBtn = document.getElementById('menu-add-staff-btn');
    const menuViewSchedBtn = document.getElementById('menu-view-sched-btn');
    const menuClearSchedBtn = document.getElementById('menu-clear-sched-btn');
    
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

    // Load data functions
    async function loadStaff() {
        try {
            const res = await fetch('/api/staff');
            staffMembers = await res.json();
            renderStaffList();
        } catch (err) {
            console.error("Failed to load staff:", err);
        }
    }

    async function loadSchedule() {
        try {
            const res = await fetch('/api/schedule');
            const data = await res.json();
            
            const today = new Date();
            const currentWeekId = formatDate(getWeekStart(today));
            
            if (data._weekStart !== currentWeekId) {
                console.log("Schedule is outdated or new week started. Clearing...");
                currentSchedule = { _weekStart: currentWeekId };
                // Optionally save empty schedule back to server
                await fetch('/api/schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(currentSchedule)
                });
            } else {
                currentSchedule = data;
            }
        } catch (err) {
            console.error("Failed to load schedule:", err);
        }
    }

    // --- User Personalization ---
    const userEmailModal = document.getElementById('user-email-modal');
    const userEmailInput = document.getElementById('user-work-email-input');
    const saveUserEmailBtn = document.getElementById('save-user-email-btn');

    function checkUserEmail() {
        const savedEmail = localStorage.getItem('userEmail');
        if (!savedEmail) {
            userEmailModal.classList.remove('hidden-state');
        } else {
            console.log("Welcome back:", savedEmail);
        }
    }

    saveUserEmailBtn.addEventListener('click', () => {
        const email = userEmailInput.value.trim();
        if (email && email.includes('@')) {
            localStorage.setItem('userEmail', email);
            userEmailModal.classList.add('hidden-state');
            console.log("Email saved:", email);
        } else {
            alert("Please enter a valid work email address.");
        }
    });

    userEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveUserEmailBtn.click();
    });

    // Load initial staff and schedule
    async function loadData() {
        await loadStaff();
        await loadSchedule();
        checkUserEmail(); // Check for user email after data is ready
    }
    loadData();

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
            managerMenuModal.classList.remove('hidden-state');
        } else {
            loginError.classList.remove('hidden-state');
        }
    });

    // Menu Actions
    menuAddStaffBtn.addEventListener('click', () => {
        managerMenuModal.classList.add('hidden-state');
        staffManagementModal.classList.remove('hidden-state');
        loadStaff();
    });

    menuViewSchedBtn.addEventListener('click', () => {
        managerMenuModal.classList.add('hidden-state');
        calendarModal.classList.remove('hidden-state');
        backToMenuFromSched.classList.remove('hidden-state'); // Show back button here
        generateCalendar();
    });

    menuCreateBtn.addEventListener('click', () => {
        managerMenuModal.classList.add('hidden-state');
        createScheduleModal.classList.remove('hidden-state');
        populateHolidayChecklist();
    });

    menuClearSchedBtn.addEventListener('click', async () => {
        const confirmed = confirm("Are you sure you want to clear this week's schedule? This will reset everyone's assignments.");
        if (!confirmed) return;

        const today = new Date();
        const emptySchedule = { _weekStart: formatDate(getWeekStart(today)) };

        try {
            await fetch('/api/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emptySchedule)
            });
            currentSchedule = emptySchedule;
            managerMenuModal.classList.add('hidden-state');
            alert("Schedule cleared. Staff will be directed to the office until a new schedule is created.");
        } catch (err) {
            console.error("Failed to clear schedule:", err);
            alert("Something went wrong. Please try again.");
        }
    });

    function populateHolidayChecklist() {
        const checklist = document.getElementById('holiday-check-list');
        if (!checklist) return;
        checklist.innerHTML = '';
        
        const weekStart = getWeekStart(new Date());
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
        for (let i = 1; i <= 5; i++) { // Mon-Fri
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            const dayNum = d.getDate();
            const dayName = dayNames[i];
            const suffix = (dayNum) => {
                if (dayNum > 3 && dayNum < 21) return 'th';
                switch (dayNum % 10) {
                    case 1:  return "st";
                    case 2:  return "nd";
                    case 3:  return "rd";
                    default: return "th";
                }
            };

            const label = document.createElement('label');
            label.className = 'day-check-item';
            label.innerHTML = `
                <input type="checkbox" class="holiday-checkbox" value="${dayNum}">
                <span class="day-name">${dayName} (${dayNum}${suffix(dayNum)})</span>
            `;
            checklist.appendChild(label);
        }
    }

    // Back Buttons
    backToMenuFromStaff.addEventListener('click', () => {
        staffManagementModal.classList.add('hidden-state');
        managerMenuModal.classList.remove('hidden-state');
    });

    backToMenuFromSched.addEventListener('click', () => {
        calendarModal.classList.add('hidden-state');
        managerMenuModal.classList.remove('hidden-state');
    });

    backToMenuFromCreate.addEventListener('click', () => {
        createScheduleModal.classList.add('hidden-state');
        managerMenuModal.classList.remove('hidden-state');
    });

    // Handle Holiday Selection & Proceed
    const proceedToAlgBtn = document.getElementById('proceed-to-alg-btn');
    const processingModal = document.getElementById('processing-modal');
    let selectedHolidays = [];

    proceedToAlgBtn.addEventListener('click', async () => {
        selectedHolidays = Array.from(document.querySelectorAll('.holiday-checkbox:checked')).map(cb => parseInt(cb.value));
        
        createScheduleModal.classList.add('hidden-state');
        processingModal.classList.remove('hidden-state');

        // Delay for dramatic effect (and to simulate generation)
        setTimeout(async () => {
            await generateWeeklySchedule(selectedHolidays);
            processingModal.classList.add('hidden-state');
            
            // Show the calendar with new schedule
            calendarModal.classList.remove('hidden-state');
            backToMenuFromSched.classList.remove('hidden-state');
            generateCalendar();
        }, 2000);
    });

    async function generateWeeklySchedule(holidays) {
        const buddyPairs = [
            ['adio.omolola@pitasonandsmartpro.com', 'titilope.hamzat@pitasonandsmartpro.com'],
            ['ade.atoye@pitasonandsmartpro.com', 'iyanu.oluwatomisin@pitasonandsmartpro.com'],
            ['abdulfatai.taofeeq@pitasonandsmartpro.com', 'ayomide.gabriel@pitasonandsmartpro.com']
        ];

        const locations = ['Lagos', 'Ibadan'];
        const today = new Date();
        const weekStart = getWeekStart(today);
        
        const workingDays = [];
        for (let i = 1; i <= 5; i++) { // Mon-Fri
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            workingDays.push(d.getDate());
        }

        const newSchedule = { _weekStart: formatDate(weekStart) };
        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(weekStart.getDate() + i);
            newSchedule[d.getDate()] = [];
        }

        const monDate = workingDays[0];

        // Group staff
        const staffByLoc = {
            'Lagos': staffMembers.filter(s => s.location === 'Lagos'),
            'Ibadan': staffMembers.filter(s => s.location === 'Ibadan')
        };

        locations.forEach(loc => {
            const locStaff = staffByLoc[loc];
            if (locStaff.length === 0) return;

            let attempt = 0;
            let success = false;

            while (!success && attempt < 100) {
                attempt++;
                const trialAssignments = {}; // {email: [offsite_days]}
                locStaff.forEach(s => trialAssignments[s.email] = []);

                const currentLocSchedule = {};
                workingDays.forEach(d => currentLocSchedule[d] = []);

                // Rule 1: Monday (or any day) - check for holiday first
                if (holidays.includes(monDate)) {
                    locStaff.forEach(s => currentLocSchedule[monDate].push({ ...s, status: 'Holiday' }));
                } else {
                    locStaff.forEach(s => currentLocSchedule[monDate].push({ ...s, status: 'Onsite' }));
                }

                // Rule 4: Pick 2 Offsite days per staff from Tue-Fri
                const tueFri = workingDays.slice(1);
                const validTueFri = tueFri.filter(d => !holidays.includes(d));

                locStaff.forEach(s => {
                    if (validTueFri.length <= 2) {
                        // If only 1-2 days left, they have to be offsite on those? 
                        // User: "Every staff only has 2 days off site even in event of holiday"
                        // I'll pick up to 2.
                        const shuffled = [...validTueFri].sort(() => 0.5 - Math.random());
                        trialAssignments[s.email] = shuffled.slice(0, 2);
                    } else {
                        // Try to pick 2 non-consecutive
                        let picks = [];
                        let p_attempts = 0;
                        while(picks.length < 2 && p_attempts < 20) {
                            p_attempts++;
                            const d = validTueFri[Math.floor(Math.random() * validTueFri.length)];
                            if (!picks.includes(d)) {
                                // Rule 5: No consecutive offsite
                                const isConsec = picks.some(p => Math.abs(p - d) === 1);
                                if (!isConsec) picks.push(d);
                            }
                        }
                        trialAssignments[s.email] = picks;
                    }
                });

                // Assign statuses for Tue-Fri based on trial
                tueFri.forEach(d => {
                    if (holidays.includes(d)) {
                        locStaff.forEach(s => currentLocSchedule[d].push({ ...s, status: 'Holiday' }));
                    } else {
                        locStaff.forEach(s => {
                            const status = trialAssignments[s.email].includes(d) ? 'Offsite' : 'Onsite';
                            currentLocSchedule[d].push({ ...s, status });
                        });
                    }
                });

                // Rule 3: Min 2 onsite per day (for working days T-F)
                const rule3Broken = tueFri.some(d => {
                    if (holidays.includes(d)) return false;
                    const onsiteCount = currentLocSchedule[d].filter(s => s.status === 'Onsite').length;
                    return onsiteCount < 2 && locStaff.length >= 2;
                });

                // --- Buddy Pairs Constraint ---
                const buddyRuleBroken = tueFri.some(d => {
                    if (holidays.includes(d)) return false;
                    return buddyPairs.some(pair => {
                        const p1 = currentLocSchedule[d].find(s => s.email === pair[0]);
                        const p2 = currentLocSchedule[d].find(s => s.email === pair[1]);
                        if (p1 && p2) {
                            return p1.status === 'Offsite' && p2.status === 'Offsite';
                        }
                        return false;
                    });
                });
                if (!rule3Broken && !buddyRuleBroken) {
                    success = true;
                    // Merge into main schedule
                    Object.keys(currentLocSchedule).forEach(d => {
                        newSchedule[d] = [...newSchedule[d], ...currentLocSchedule[d]];
                    });
                }
            }
        });

        // Save to server
        await fetch('/api/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSchedule)
        });
        
        currentSchedule = newSchedule;
    }

    // Submit on Enter
    secretInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginSubmitBtn.click();
    });

    // Close Modals
    closeLoginBtn.addEventListener('click', () => managerLoginModal.classList.add('hidden-state'));
    closeMenuBtn.addEventListener('click', () => managerMenuModal.classList.add('hidden-state'));
    closeStaffBtn.addEventListener('click', () => staffManagementModal.classList.add('hidden-state'));
    closeCreateBtn.addEventListener('click', () => createScheduleModal.classList.add('hidden-state'));

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
    [managerLoginModal, managerMenuModal, staffManagementModal, createScheduleModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden-state');
            }
        });
    });
});
