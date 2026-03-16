document.addEventListener("DOMContentLoaded", () => {
  const revealSection = document.getElementById("reveal-section");
  const processingSection = document.getElementById("processing-section");
  const remoteSection = document.getElementById("remote-section");
  const officeSection = document.getElementById("office-section");

  const revealBtn = document.getElementById("reveal-btn");
  const scannerLine = document.querySelector(".scanner-line");
  const resetBtns = document.querySelectorAll(".reset-btn");
  const checkinToggle = document.getElementById("checkin-toggle");
  const actionInfoCheckin = document.querySelector(".action-info h3");

  function hideAll() {
    revealSection.classList.remove("visible");
    revealSection.classList.add("hidden");

    processingSection.classList.remove("visible");
    processingSection.classList.add("hidden");

    remoteSection.classList.remove("visible");
    remoteSection.classList.add("hidden");

    officeSection.classList.remove("visible");
    officeSection.classList.add("hidden");
  }

  revealBtn.addEventListener("click", () => {
    // Start scanner animation
    revealBtn.style.opacity = "0.5";
    revealBtn.innerText = "Scanning...";
    revealBtn.disabled = true;
    scannerLine.style.display = "block";

    setTimeout(() => {
      hideAll();
      processingSection.classList.remove("hidden");
      processingSection.classList.add("visible");

      // Simulate 'algorithm' processing
      setTimeout(() => {
        hideAll();

        // Randomly decide (50% chance for demonstration)
        const isRemote = Math.random() > 0.5;

        if (isRemote) {
          remoteSection.classList.remove("hidden");
          remoteSection.classList.add("visible");
          // Reset checkin
          checkinToggle.checked = false;
          if (actionInfoCheckin)
            actionInfoCheckin.innerText = "Online Check-in";
        } else {
          officeSection.classList.remove("hidden");
          officeSection.classList.add("visible");
        }

        // Reset main button state for next time
        setTimeout(() => {
          revealBtn.style.opacity = "1";
          revealBtn.innerText = "Reveal Today's Status";
          revealBtn.disabled = false;
          scannerLine.style.display = "none";
        }, 500);
      }, 2000); // 2 seconds processing
    }, 1000); // 1 second initial scan
  });

  // Reset buttons logic for demo purposes
  resetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      hideAll();
      revealSection.classList.remove("hidden");
      revealSection.classList.add("visible");
    });
  });

  // Check-in toggle logic
  checkinToggle.addEventListener("change", (e) => {
    const pTag = e.target.closest(".action-item").querySelector("p");

    if (e.target.checked) {
      actionInfoCheckin.innerText = "Checked In!";
      actionInfoCheckin.style.color = "var(--success)";
      pTag.innerText = "Team notified. Enjoy your day.";
    } else {
      actionInfoCheckin.innerText = "Online Check-in";
      actionInfoCheckin.style.color = ""; // reset to default
      pTag.innerText = "Let the team know you're online.";
    }
  });

  // Simple countdown logic for standup
  let minutes = 30;
  const countdownEl = document.getElementById("standup-countdown");
  if (countdownEl) {
    setInterval(() => {
      if (minutes > 0) {
        minutes--;
        countdownEl.innerText = `${minutes}m`;
      }
    }, 60000);
  }
});
