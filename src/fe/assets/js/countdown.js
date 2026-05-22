/* =========================================
   RESET
========================================= */

if (typeof backendTargetTimestamp === 'undefined') {
    fetch('/fe/count-down/countdown-error.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(html => {
            document.open();
            document.write(html);
            document.close();
        })
        .catch((err) => {
            console.error('Error loading error page:', err);
            document.body.innerHTML = '<div style="color: #ff7d7d; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Courier New, monospace; text-align: center; padding: 20px;">[CRITICAL ERROR] FAILED TO ESTABLISH CONNECTION</div>';
        });
    throw new Error("Target date must be provided by backend.");
}

const targetDate = new Date(backendTargetTimestamp);

/* =========================================
   ELEMENTS
========================================= */

const countdown =
    document.getElementById("countdown");

const ghost =
    document.getElementById("ghost");

const message =
    document.querySelector(".message");

const subtext =
    document.querySelector(".subtext");

const door =
    document.getElementById("door");

const light =
    document.getElementById("light");

const voidCore =
    document.getElementById("voidCore");

const shadowFog =
    document.getElementById("shadowFog");

const symbols = [

    document.getElementById("symbol1"),
    document.getElementById("symbol2"),
    document.getElementById("symbol3")
];

/* =========================================
   FORMAT TIME
========================================= */

function formatTime(ms){

    const totalSeconds =
        Math.floor(ms / 1000);

    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    return {

        days,
        hours,
        minutes,
        seconds
    };
}

/* =========================================
   UNLOCK SEQUENCE
========================================= */

let unlocked = false;

async function fetchUnlockedMessage() {
    try {
        const response = await fetch('/v1/api/countdown');
        const result = await response.json();
        if (result.success && result.data.message) {
            return result.data.message;
        }
    } catch (e) {
        console.error("Failed to fetch combined countdown data", e);
    }
    return "UNLOCKED"; // Fallback
}

async function unlockDoor(){

    if(unlocked) return;

    unlocked = true;

    const backendMessage = await fetchUnlockedMessage();
    countdown.textContent = backendMessage;
    ghost.textContent = backendMessage;

    countdown.classList.add("final");

    message.textContent =
        "THE SEAL HAS BEEN BROKEN";

    subtext.textContent =
        "SOMETHING IS COMING THROUGH";

    /* Initial darkness pulse */

    document.body.style.filter =
        "brightness(0.3)";

    /* Shake begins */

    setTimeout(() => {

        document.body.classList.add(
            "screen-shake"
        );

    }, 1200);

    /* Door opens */

    setTimeout(() => {

        door.classList.add("open");

    }, 2500);

    /* Fog emerges */

    setTimeout(() => {

        shadowFog.classList.add("active");

    }, 3000);

    /* Symbol flashes */

    let flashCount = 0;

    const flashInterval = setInterval(() => {

        const symbol =

            symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
            ];

        symbol.classList.add("show");

        setTimeout(() => {

            symbol.classList.remove("show");

        }, 180);

        flashCount++;

        if(flashCount > 12){

            clearInterval(flashInterval);
        }

    }, 350);

    /* Void expands */

    setTimeout(() => {

        light.classList.add("active");

        voidCore.classList.add("active");

    }, 4200);

    /* Final atmosphere */

    setTimeout(() => {

        document.body.classList.add(
            "unlocked"
        );

        document.body.style.filter =
            "brightness(0.42) contrast(1.2) saturate(0.7)";

    }, 6000);

    /* Stop shaking */

    setTimeout(() => {

        document.body.classList.remove(
            "screen-shake"
        );

    }, 8000);

    /* Final message */

    setTimeout(() => {

        message.textContent =
            "IT KNOWS YOU ARE HERE";

    }, 9000);
}

/* =========================================
   UPDATE LOOP
========================================= */

function updateCountdown(){

    const now = new Date();

    const difference =
        targetDate - now;

    /* Unlock */

    if(difference <= 0){

        unlockDoor();

        return;
    }

    /* Time */

    const time =
        formatTime(difference);

    const formatted =

        `${String(time.days).padStart(2,"0")}:`

        +

        `${String(time.hours).padStart(2,"0")}:`

        +

        `${String(time.minutes).padStart(2,"0")}:`

        +

        `${String(time.seconds).padStart(2,"0")}`;

    countdown.textContent =
        formatted;

    ghost.textContent =
        formatted;

    /* Subtle ghost movement */

    ghost.style.transform =

        `translate(
            ${Math.random() * 2 - 1}px,
            ${Math.random() * 2 - 1}px
        )`;

    /* Rare screen pulse */

    if(Math.random() > 0.996){

        document.body.style.filter =
            "brightness(1.04)";

        setTimeout(() => {

            document.body.style.filter =
                "brightness(1)";

        }, 120);
    }

    /* Final hour instability */

    if(difference < 3600000){

        countdown.style.animation =

            "softGlow 2s infinite, softFlicker 0.7s infinite";
    }
}

/* =========================================
   START
========================================= */

updateCountdown();

setInterval(updateCountdown, 1000);
