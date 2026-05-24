import { BaseApiService } from "./BaseApiService.js";

export class CountdownService extends BaseApiService {
  private readonly targetDate: Date;
  private readonly unlockedMessage: string = "UNLOCKED";
  private readonly redirectUrl: string | null;
  private readonly messages = {
    sealBroken: "THE SEAL HAS BEEN BROKEN",
    somethingComing: "SOMETHING IS COMING THROUGH",
    itKnows: "IT KNOWS YOU ARE HERE",
    defaultMessage: "THE DOOR WILL OPEN WHEN THE TIME IS NIL",
    defaultSubtext: "SIGNAL STABILITY : UNKNOWN"
  };

  constructor() {
    super();
    const envTarget = process.env.TARGET_DATE;
    if (envTarget) {
      this.targetDate = new Date(envTarget);
      if (isNaN(this.targetDate.getTime())) {
        console.warn("Invalid TARGET_DATE environment variable. Falling back to default.");
        this.targetDate = new Date("2026-07-01T00:00:00Z");
      }
    } else {
      console.warn("TARGET_DATE environment variable not set. Falling back to default.");
      this.targetDate = new Date("2026-05-24T09:35:00Z");
    }
    this.redirectUrl = process.env.REDIRECT_URL || null;
  }

  getTargetDate(): Date {
    return this.targetDate;
  }

  getTargetTimestamp(): number {
    return this.targetDate.getTime();
  }

  isTargetReached(): boolean {
    return Date.now() >= this.targetDate.getTime();
  }

  getUnlockedMessage(): string | null {
    if (this.isTargetReached()) {
      return this.unlockedMessage;
    }
    return null;
  }

  formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      formatted: `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    };
  }

  getCountdownStatus(now: number = Date.now()) {
    const difference = this.targetDate.getTime() - now;
    const isReached = difference <= 0;
    const isUnstable = !isReached && difference < 3600000; // Final hour instability

    return {
      difference,
      isReached,
      isUnstable,
      time: isReached ? null : this.formatTime(difference),
      messages: {
        currentMessage: isReached ? this.messages.sealBroken : this.messages.defaultMessage,
        currentSubtext: isReached ? this.messages.somethingComing : this.messages.defaultSubtext,
        itKnows: this.messages.itKnows
      }
    };
  }

  getCountDownData() {
    const now = Date.now();
    const isReached = now >= this.targetDate.getTime();
    return {
      targetDate: this.targetDate.toISOString(),
      targetTimestamp: this.targetDate.getTime(),
      message: isReached ? this.unlockedMessage : null,
      redirectUrl: isReached ? this.redirectUrl : null,
      status: this.getCountdownStatus(now)
    };
  }
}

export const countdownService = new CountdownService();
