import { supabase } from './supabase';

interface UserProgress {
  totalWordsLearned: number;
  studyStreak: number;
  reviewAccuracy: number;
  totalStudyTime: string;
  lastStudyDate: Date | null;
}

interface DailyActivity {
  studyDate: Date;
  studyTime: string;
  wordsReviewed: number;
  wordsLearned: number;
  correctReviews: number;
  totalReviews: number;
}

// Get user's progress
export async function getUserProgress(): Promise<UserProgress> {
  const { data, error } = await supabase
    .rpc('get_user_progress_with_activity', {
      user_uuid: (await supabase.auth.getUser()).data.user?.id
    })
    .single();

  if (error) throw error;

  return {
    totalWordsLearned: data?.total_words_learned || 0,
    studyStreak: data?.study_streak || 0,
    reviewAccuracy: data?.review_accuracy || 0,
    totalStudyTime: data?.total_study_time || '0',
    lastStudyDate: data?.last_study_date ? new Date(data.last_study_date) : null
  };
}

// Get daily activity for the last n days
export async function getDailyActivity(days: number = 7): Promise<DailyActivity[]> {
  const { data, error } = await supabase
    .from('daily_activity')
    .select('*')
    .gte('study_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('study_date', { ascending: true });

  if (error) throw error;

  return data.map(activity => ({
    studyDate: new Date(activity.study_date),
    studyTime: activity.study_time,
    wordsReviewed: activity.words_reviewed,
    wordsLearned: activity.words_learned,
    correctReviews: activity.correct_reviews,
    totalReviews: activity.total_reviews
  }));
}

// Record study session
export async function recordStudySession(
  studyTime: number, // in minutes
  wordsReviewed: number,
  wordsLearned: number,
  correctReviews: number
) {
  const today = new Date().toISOString().split('T')[0];
  
  // First, try to update existing record for today
  const { data: existing } = await supabase
    .from('daily_activity')
    .select('*')
    .eq('study_date', today)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('daily_activity')
      .update({
        study_time: `${studyTime} minutes`,
        words_reviewed: existing.words_reviewed + wordsReviewed,
        words_learned: existing.words_learned + wordsLearned,
        correct_reviews: existing.correct_reviews + correctReviews,
        total_reviews: existing.total_reviews + wordsReviewed
      })
      .eq('study_date', today);

    if (error) throw error;
  } else {
    // Create new record for today
    const { error } = await supabase
      .from('daily_activity')
      .insert({
        study_date: today,
        study_time: `${studyTime} minutes`,
        words_reviewed: wordsReviewed,
        words_learned: wordsLearned,
        correct_reviews: correctReviews,
        total_reviews: wordsReviewed
      });

    if (error) throw error;
  }
}

// Calculate study statistics
export async function getStudyStats(days: number = 7) {
  const activity = await getDailyActivity(days);
  
  const totalTime = activity.reduce((sum, day) => {
    const minutes = parseInt(day.studyTime.split(' ')[0]);
    return sum + minutes;
  }, 0);

  const dailyAverage = totalTime / days;
  
  // Calculate week-over-week change
  const previousWeek = await getDailyActivity(14);
  const previousTotal = previousWeek
    .slice(0, 7)
    .reduce((sum, day) => {
      const minutes = parseInt(day.studyTime.split(' ')[0]);
      return sum + minutes;
    }, 0);

  const weekOverWeekChange = previousTotal > 0 
    ? ((totalTime - previousTotal) / previousTotal) * 100 
    : 0;

  return {
    totalTime,
    dailyAverage,
    weekOverWeekChange
  };
}