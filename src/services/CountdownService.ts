import { BaseApiService } from "./BaseApiService.js";

export class CountdownService extends BaseApiService {
  private readonly targetDate: Date;
  private readonly unlockedMessage: string = "UNLOCKED";
  private readonly revealDate: Date;

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
      this.targetDate = new Date("2026-07-01T00:00:00Z");
    }
    this.revealDate = this.targetDate; // Initialize revealDate to satisfy TS
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

  getCountDownData() {
    return {
      targetDate: this.getTargetDate().toISOString(),
      targetTimestamp: this.getTargetTimestamp(),
      message: this.getUnlockedMessage()
    };
  }
}

export const countdownService = new CountdownService();
