// SuperMemo 2 Algorithm Implementation
interface ReviewData {
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
}

export function calculateNextReview(
  score: number, // 1-5 score from user
  previousData?: ReviewData
): ReviewData {
  // Initial values for new cards
  let easeFactor = 2.5;
  let interval = 1;
  let repetitions = 0;

  if (previousData) {
    easeFactor = previousData.easeFactor;
    interval = previousData.interval;
    repetitions = previousData.repetitions;
  }

  // Convert 1-5 score to 0-1 quality
  const quality = (score - 1) / 4;

  // Calculate new ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02)
  );

  // Calculate new interval based on quality
  if (score < 3) {
    // If score is too low, reset
    interval = 1;
    repetitions = 0;
  } else {
    repetitions++;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    dueDate
  };
}