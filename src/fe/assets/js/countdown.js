/* =========================================
   RESET
========================================= */

if (typeof backendTargetTimestamp === "undefined") {
	document.body.innerHTML = `
        <div style="background: #000; color: #ff4d4d; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: 'Courier New', monospace; text-align: center; padding: 20px;">
            <div style="font-size: 2rem; margin-bottom: 10px; text-shadow: 0 0 10px #ff0000;">[CRITICAL ERROR]</div>
            <div style="font-size: 1.2rem; opacity: 0.8;">FAILED TO ESTABLISH CONNECTION</div>
            <div style="margin-top: 20px; font-size: 0.8rem; color: #555;">SYSTEMS UNRESPONSIVE : INJECTION FAILURE</div>
        </div>
    `;
	throw new Error("Target date must be provided by backend.");
}

/* =========================================
   ELEMENTS
========================================= */

const countdown = document.getElementById("countdown");
const ghost = document.getElementById("ghost");
const message = document.querySelector(".message");
const subtext = document.querySelector(".subtext");
const redirectButton = document.getElementById("redirectButton");
const door = document.getElementById("door");
const light = document.getElementById("light");
const voidCore = document.getElementById("voidCore");
const shadowFog = document.getElementById("shadowFog");
const symbols = [
	document.getElementById("symbol1"),
	document.getElementById("symbol2"),
	document.getElementById("symbol3"),
];

/* =========================================
   STATE
========================================= */

let unlocked = false;
let backendState =
	typeof backendInitialState !== "undefined" ? backendInitialState : null;
let currentTargetTimestamp =
	typeof backendTargetTimestamp !== "undefined" ? backendTargetTimestamp : 0;
let lastSyncTime = backendState ? Date.now() : 0;

/* =========================================
   SYNC WITH BACKEND
========================================= */

async function syncWithBackend() {
	try {
		const response = await fetch("/v1/api/countdown");
		const result = await response.json();
		if (result.success) {
			backendState = result.data;
			if (backendState.targetTimestamp) {
				currentTargetTimestamp = backendState.targetTimestamp;
			}
			return result.data;
		}
	} catch (e) {
		console.error("Failed to fetch countdown data", e);
	}
	return null;
}

/* =========================================
   UNLOCK SEQUENCE
========================================= */

async function unlockDoor() {
	if (unlocked) return;
	unlocked = true;

	// Dynamically load the unlocked CSS
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "/assets/css/unlocked.css";
	document.head.appendChild(link);

	const data = await syncWithBackend();

	// Authorization check: if backend says not reached, we shouldn't have been here.
	// We'll reset and wait if the backend disagrees with local time.
	if (data && data.status && !data.status.isReached) {
		unlocked = false;
		console.warn("Backend reports target not yet reached. Reverting unlock.");
		return;
	}

	const displayMessage = data && data.message ? data.message : "UNLOCKED";
	const status =
		data && data.status
			? data.status
			: backendState && backendState.status
				? backendState.status
				: {};
	const messages = status && status.messages ? status.messages : {};

	countdown.textContent = displayMessage;
	ghost.textContent = displayMessage;
	countdown.classList.add("final");

	message.textContent = messages.currentMessage || "THE SEAL HAS BEEN BROKEN";
	subtext.textContent =
		messages.currentSubtext || "SOMETHING IS COMING THROUGH";

	/* Initial darkness pulse */
	document.body.style.filter = "brightness(0.3)";

	/* Shake begins */
	setTimeout(() => {
		document.body.classList.add("screen-shake");
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
		const symbol = symbols[Math.floor(Math.random() * symbols.length)];
		symbol.classList.add("show");
		setTimeout(() => {
			symbol.classList.remove("show");
		}, 180);
		flashCount++;
		if (flashCount > 12) {
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
		document.body.classList.add("unlocked");
		document.body.style.filter = "brightness(0.42) contrast(1.2) saturate(0.7)";
	}, 6000);

	/* Stop shaking */
	setTimeout(() => {
		document.body.classList.remove("screen-shake");
	}, 8000);

	/* Final message - using backend provided string if available */
	setTimeout(() => {
		message.textContent = messages.itKnows || "IT KNOWS YOU ARE HERE";
	}, 9000);

	/* Show redirect button */
	if (data && data.redirectUrl) {
		setTimeout(() => {
			redirectButton.classList.remove("hidden");
			redirectButton.disabled = false;
			redirectButton.onclick = () => {
				window.location.href = data.redirectUrl;
			};
		}, 10000);
	}
}

/* =========================================
   UPDATE LOOP
========================================= */

async function updateCountdown() {
	const now = Date.now();
	const difference = currentTargetTimestamp - now;

	if (difference <= 0) {
		unlockDoor();
		return;
	}

	// Determine sync interval based on how close we are to the target
	// Far (> 1 hour): Sync every 15 minutes
	// Close (< 1 hour): Sync every 5 minutes
	// Imminent (< 5 minutes): Sync every 30 seconds
	// Final (< 1 minute): Sync every 10 seconds
	let syncInterval = 900000; // 15 minutes
	if (difference <= 60000) {
		syncInterval = 10000; // 10 seconds
	} else if (difference <= 300000) {
		syncInterval = 60000; // 30 seconds
	} else if (difference <= 3600000) {
		syncInterval = 300000; // 5 minutes
	}

	if (!backendState || now - lastSyncTime >= syncInterval) {
		lastSyncTime = now;
		await syncWithBackend();
	}

	// Format time (Logic is on backend, but we can mimic it for smoothness or just use backend's format if it's close enough)
	// To strictly follow "logic on backend", we should use the backend's format.
	// However, for 1s updates, we can either fetch every second (bad) or use a local implementation of the backend's logic.
	// The requirement says "refactor to have the logic sit on the backend".

	// We'll use the backend's provided format if available and difference is small,
	// but for smoothness we still need a local calculation.

	const totalSeconds = Math.floor(difference / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const formatted = `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	countdown.textContent = formatted;
	ghost.textContent = formatted;

	/* Subtle ghost movement */
	ghost.style.transform = `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)`;

	/* Rare screen pulse */
	if (Math.random() > 0.996) {
		document.body.style.filter = "brightness(1.04)";
		setTimeout(() => {
			document.body.style.filter = "brightness(1)";
		}, 120);
	}

	/* Update messages and status from backend state if available */
	if (backendState && backendState.status && backendState.status.messages) {
		const msgs = backendState.status.messages;
		if (!unlocked) {
			message.textContent = msgs.currentMessage;
			subtext.textContent = msgs.currentSubtext;
		}
	}

	/* Instability check - logic from backend */
	if (backendState && backendState.status && backendState.status.isUnstable) {
		countdown.style.animation =
			"softGlow 2s infinite, softFlicker 0.7s infinite";
	}
}

/* =========================================
   START
========================================= */

updateCountdown();
setInterval(updateCountdown, 1000);
