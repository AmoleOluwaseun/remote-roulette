document.addEventListener('DOMContentLoaded', () => {
    const revealCard = document.getElementById('reveal-card');
    const processingCard = document.getElementById('processing-card');
    const remoteCard = document.getElementById('remote-card');
    const officeCard = document.getElementById('office-card');
    
    const revealBtn = document.getElementById('reveal-btn');
    const resetBtns = document.querySelectorAll('.reset-btn');
    const checkinToggle = document.getElementById('checkin-toggle');
    const checkinStatusText = document.getElementById('checkin-status-text');

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
        // Change button state
        revealBtn.innerText = 'Calculating...';
        revealBtn.disabled = true;

        setTimeout(() => {
            hideAllCards();
            processingCard.classList.remove('hidden-state');
            processingCard.classList.add('active-state');

            // Simulate 'algorithm' processing time
            setTimeout(() => {
                hideAllCards();
                
                // Randomly decide (50% chance for demonstration)
                const isRemote = Math.random() > 0.5;

                if (isRemote) {
                    remoteCard.classList.remove('hidden-state');
                    remoteCard.classList.add('active-state');
                    // Reset checkin
                    checkinToggle.checked = false;
                    checkinStatusText.innerText = 'Confirm you are online and working.';
                } else {
                    officeCard.classList.remove('hidden-state');
                    officeCard.classList.add('active-state');
                }

                // Restore button for next time
                setTimeout(() => {
                    revealBtn.innerText = "Reveal Today's Status";
                    revealBtn.disabled = false;
                }, 500);

            }, 2500); // 2.5 seconds processing
        }, 500); // short delay before showing processing
    });

    // Reset logic
    resetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllCards();
            revealCard.classList.remove('hidden-state');
            revealCard.classList.add('active-state');
        });
    });

    // Check-in logic
    checkinToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            checkinStatusText.innerText = "Checked in! Have a great remote day.";
            checkinStatusText.style.color = "var(--success-green)";
            checkinStatusText.style.fontWeight = "500";
        } else {
            checkinStatusText.innerText = "Confirm you are online and working.";
            checkinStatusText.style.color = "";
            checkinStatusText.style.fontWeight = "normal";
        }
    });

    // Countdown logic for standup
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
