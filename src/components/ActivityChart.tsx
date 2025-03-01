import React from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { getDailyActivity, getStudyStats } from '../lib/progress';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ActivityChart() {
  const [activityData, setActivityData] = React.useState<number[]>([]);
  const [stats, setStats] = React.useState<{
    totalTime: number;
    dailyAverage: number;
    weekOverWeekChange: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const activity = await getDailyActivity(7);
        const studyStats = await getStudyStats(7);
        
        // Convert study time to hours
        const hourlyData = activity.map(day => {
          const minutes = parseInt(day.studyTime.split(' ')[0]);
          return minutes / 60;
        });
        
        setActivityData(hourlyData);
        setStats(studyStats);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/70">Daily Activity</h3>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white/50">Last 7 days</span>
        </div>
      </div>
      <div className="relative h-[150px]">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/40 py-2 select-none">
          <span>4h</span>
          <span>3h</span>
          <span>2h</span>
          <span>1h</span>
        </div>
        
        {/* Chart */}
        <div className="ml-8 h-full flex items-end justify-between">
          {activityData.map((value, index) => (
            <div key={index} className="flex flex-col items-center group relative">
              <div className="relative">
                <div
                  className={`w-8 transition-all duration-500 ease-out rounded-lg ${
                    index === 3 ? 'bg-white/80 shimmer' : 'bg-white/20'
                  } group-hover:bg-white/30 hover:scale-105 transition-transform duration-300`}
                  style={{ height: `${(value / 4) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="glass px-2 py-1 rounded-full text-xs text-white whitespace-nowrap">
                      {value}h studied
                    </div>
                  </div>
                </div>
              </div>
              <span className="mt-2 text-xs text-white/50 group-hover:text-white/70 transition-colors select-none">{days[index]}</span>
            </div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 ml-8 flex flex-col justify-between pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-t border-white/5 w-full h-0" />
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/80" />
          <span className="text-xs text-white/50">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-white/20" />
          <span className="text-xs text-white/50">Previous days</span>
        </div>
      </div>
      
      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="glass rounded-lg p-3 text-center hover:bg-white/15 transition-all duration-300">
          <div className="text-lg font-semibold text-white">{(stats?.totalTime || 0).toFixed(1)}h</div>
          <div className="text-xs text-white/50">Total time</div>
        </div>
        <div className="glass rounded-lg p-3 text-center hover:bg-white/15 transition-all duration-300">
          <div className="text-lg font-semibold text-white">{(stats?.dailyAverage || 0).toFixed(1)}h</div>
          <div className="text-xs text-white/50">Daily average</div>
        </div>
        <div className="glass rounded-lg p-3 text-center hover:bg-white/15 transition-all duration-300">
          <div className="text-lg font-semibold text-white">
            {stats?.weekOverWeekChange >= 0 ? '↑' : '↓'} {Math.abs(stats?.weekOverWeekChange || 0).toFixed(0)}%
          </div>
          <div className="text-xs text-white/50">vs last week</div>
        </div>
      </div>
      
      {/* Motivation message */}
      <div className="mt-8 glass rounded-lg p-4 text-center hover:bg-white/15 transition-all duration-300">
        <div className="text-sm text-white/70">
          You're making great progress! Keep up the momentum to reach your language goals.
        </div>
      </div>
    </div>
  );
}