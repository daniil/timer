const textEl = document.querySelector(".timer-text");
const ringEl = document.querySelector(".timer-ring__circle");
const ringElBackground = document.querySelector(".timer-ring__background");

// From URL dark=true
const darkMode = new URLSearchParams(window.location.search).get("theme") === "dark";

if (darkMode) {
    ringEl.classList.add("dark");
    ringElBackground.classList.add("dark");
    document.body.classList.add("dark");
}

// From URL ?t=[minutes] or 5 minutes by default
const duration = new URLSearchParams(window.location.search).get("t") * 60000 || 300000;
const endTime = Date.now() + duration;

function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
}

function setText(timeRemaining) {
    const secondsRemaining = Math.ceil(timeRemaining / 1000);

    const clockMinutes = Math.floor(secondsRemaining / 60);
    const clockSeconds = secondsRemaining % 60;

    const strMinutes = String(clockMinutes).padStart(1, "0");
    const strSeconds = String(clockSeconds).padStart(2, "0");

    const strClock = strMinutes + ":" + strSeconds;

    textEl.innerText = strClock;
    document.title = `Break Timer - ${strClock}`;
}

function setRing(progress) {
    const circumference = ringEl.getBBox().width * Math.PI;

    ringEl.style.strokeDasharray = `${circumference} ${circumference}`;
    ringEl.style.strokeDashoffset = circumference - progress * circumference;
}

function animate() {
    const timeRemaining = endTime - Date.now();
    const timeElapsed = duration - timeRemaining;

    // End animation when the time is over
    if (timeRemaining <= 0) {
        setText(0);
        setRing(1);
        return;
    }

    // Intro animation for one second
    if (timeElapsed <= 1000) {
        setText(timeRemaining);
        setRing(easeInOutCubic(timeElapsed, 1, 1 + timeElapsed / duration, 1000));
        requestAnimationFrame(animate);
        return;
    }

    setText(timeRemaining);
    setRing(timeElapsed / duration);

    requestAnimationFrame(animate);
}

function handleVisibilityChange() {
    if (document.hidden) {
        setTimeout(() => {
            animate();
            handleVisibilityChange();
        }, 60);
    }
}

animate();

// Fullscreen mode
window.addEventListener("dblclick", () => {
    document.body.requestFullscreen();
});

// Running the loop when the tab is inactive
document.addEventListener("visibilitychange", handleVisibilityChange, false);