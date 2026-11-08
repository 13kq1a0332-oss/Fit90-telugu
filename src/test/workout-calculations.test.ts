import { describe, it, expect } from "vitest";
import {
  WALKING_13_WEEK_PLAN,
  EXERCISE_LIBRARY,
  getExerciseById,
  DEFAULT_BEGINNER_ROUTINE_IDS,
} from "@/lib/data/workout-catalog";
import {
  calculateWorkoutStreak,
  getWeeklyWorkoutMetrics,
  DEFAULT_SCHEDULE_CONFIG,
  WorkoutSession,
} from "@/lib/workout-store";
import { playRestCompleteChime } from "@/lib/audio-timer";

describe("Phase 4: Workouts, 13-Week Progression & Knee Safety Tests", () => {
  it("verifies the 13-week low-impact walking progression starts safely and progresses gradually", () => {
    expect(WALKING_13_WEEK_PLAN).toHaveLength(13);

    // Week 1: Safe gentle start for high-BMI sedentary profile
    const week1 = WALKING_13_WEEK_PLAN[0];
    expect(week1.weekNumber).toBe(1);
    expect(week1.targetMinutesDaily).toBe(20);
    expect(week1.targetStepsDaily).toBe(4500);
    expect(week1.daysPerWeek).toBe(4);
    expect(week1.instructionsEn).toContain("conversational pace");
    expect(week1.instructionsTe).toContain("చదునైన ఉపరితలంపై");
    expect(week1.clinicalNoteEn).toContain("synovial fluid");

    // Week 4: 30-minute visceral fat oxidation threshold
    const week4 = WALKING_13_WEEK_PLAN[3];
    expect(week4.targetMinutesDaily).toBe(30);
    expect(week4.targetStepsDaily).toBe(6000);

    // Week 8: 8,000 steps cardiovascular mortality risk reduction threshold
    const week8 = WALKING_13_WEEK_PLAN[7];
    expect(week8.targetMinutesDaily).toBe(40);
    expect(week8.targetStepsDaily).toBe(8000);

    // Week 12 & 13: 10,000 steps long-term sustainability
    const week12 = WALKING_13_WEEK_PLAN[11];
    expect(week12.targetStepsDaily).toBe(10000);
    expect(week12.daysPerWeek).toBe(6);
  });

  it("verifies knee-safe exercise alternatives for joint protection", () => {
    expect(EXERCISE_LIBRARY.length).toBeGreaterThanOrEqual(7);

    // Chair squats must link to floor glute bridges as knee-safe alternative
    const chairSquat = getExerciseById("chair-squats");
    expect(chairSquat).toBeDefined();
    expect(chairSquat?.kneeAlternativeId).toBe("glute-bridges");

    const gluteBridge = getExerciseById("glute-bridges");
    expect(gluteBridge).toBeDefined();
    expect(gluteBridge?.isKneeSafe).toBe(true);

    // Seated knee extensions for VMO patellar stabilization
    const kneeExt = getExerciseById("seated-knee-extension");
    expect(kneeExt).toBeDefined();
    expect(kneeExt?.isKneeSafe).toBe(true);
    expect(kneeExt?.instructionsTe.length).toBeGreaterThan(0);
  });

  it("verifies default beginner routine contains balanced low-impact compound movements", () => {
    expect(DEFAULT_BEGINNER_ROUTINE_IDS).toHaveLength(4);
    for (const id of DEFAULT_BEGINNER_ROUTINE_IDS) {
      const ex = getExerciseById(id);
      expect(ex).toBeDefined();
      expect(ex?.nameEn).toBeTruthy();
      expect(ex?.nameTe).toBeTruthy();
      expect(ex?.defaultSets).toBeGreaterThanOrEqual(3);
      expect(ex?.defaultReps).toBeGreaterThanOrEqual(8);
      expect(ex?.defaultRestSeconds).toBeGreaterThanOrEqual(30);
    }
  });

  it("calculates workout consistency streaks accurately", () => {
    // Empty sessions
    expect(calculateWorkoutStreak([])).toBe(0);

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);

    const activeSessions: WorkoutSession[] = [
      {
        id: "s1",
        date: today,
        type: "walking",
        durationMinutes: 25,
        rpeScore: 5,
        kneePainReported: false,
        exerciseLogs: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "s2",
        date: yesterday,
        type: "strength",
        durationMinutes: 20,
        rpeScore: 6,
        kneePainReported: false,
        exerciseLogs: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "s3",
        date: twoDaysAgo,
        type: "walking",
        durationMinutes: 25,
        rpeScore: 5,
        kneePainReported: false,
        exerciseLogs: [],
        createdAt: new Date().toISOString(),
      },
    ];

    expect(calculateWorkoutStreak(activeSessions)).toBe(3);

    // If latest session was 3 days ago, streak is 0
    const brokenStreakSessions: WorkoutSession[] = [
      {
        id: "s-old",
        date: threeDaysAgo,
        type: "walking",
        durationMinutes: 25,
        rpeScore: 5,
        kneePainReported: false,
        exerciseLogs: [],
        createdAt: new Date().toISOString(),
      },
    ];
    expect(calculateWorkoutStreak(brokenStreakSessions)).toBe(0);
  });

  it("aggregates weekly metrics and flags knee discomfort reports", () => {
    const today = new Date().toISOString().slice(0, 10);

    const mockSessions: WorkoutSession[] = [
      {
        id: "ws-1",
        date: today,
        type: "walking",
        durationMinutes: 30,
        walkingSteps: 5500,
        rpeScore: 5,
        kneePainReported: false,
        exerciseLogs: [],
        createdAt: new Date().toISOString(),
      },
      {
        id: "ws-2",
        date: today,
        type: "strength",
        durationMinutes: 20,
        rpeScore: 6,
        kneePainReported: true,
        kneePainNotes: "Slight right knee twinge",
        exerciseLogs: [],
        createdAt: new Date().toISOString(),
      },
    ];

    const metrics = getWeeklyWorkoutMetrics(mockSessions);
    expect(metrics.sessionsCompleted).toBe(2);
    expect(metrics.totalMinutes).toBe(50);
    expect(metrics.totalWalkingSteps).toBe(5500);
    expect(metrics.kneePainCount).toBe(1);
  });

  it("safely handles Web Audio API timer chime in Node environment without crashing", () => {
    // In Node / SSR, window is undefined or lacks AudioContext
    expect(() => playRestCompleteChime()).not.toThrow();
  });
});

