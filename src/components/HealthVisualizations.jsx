import { useState, useEffect } from 'react';

export default function HealthVisualizations({ data, type = 'line' }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      processDataForVisualization();
    }
  }, [data, type]);

  function processDataForVisualization() {
    setLoading(true);
    
    // Process different types of health data
    switch (type) {
      case 'mood-trend':
        setChartData(processMoodTrend(data));
        break;
      case 'sleep-pattern':
        setChartData(processSleepPattern(data));
        break;
      case 'exercise-progress':
        setChartData(processExerciseProgress(data));
        break;
      case 'symptom-frequency':
        setChartData(processSymptomFrequency(data));
        break;
      case 'goal-completion':
        setChartData(processGoalCompletion(data));
        break;
      case 'hydration-tracking':
        setChartData(processHydrationTracking(data));
        break;
      case 'stress-levels':
        setChartData(processStressLevels(data));
        break;
      case 'energy-levels':
        setChartData(processEnergyLevels(data));
        break;
      default:
        setChartData(null);
    }
    
    setLoading(false);
  }

  function processMoodTrend(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return null;
    
    const moodData = journalEntries
      .filter(entry => entry.mood !== null && entry.mood !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy || 0,
        stress: entry.stress || 0
      }));

    const avgMood = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
    const trend = calculateTrend(moodData.map(d => d.mood));
    
    return {
      type: 'mood-trend',
      data: moodData,
      average: avgMood,
      trend: trend,
      title: 'Mood Trend',
      description: `Average mood: ${avgMood.toFixed(1)}/10`,
      color: getMoodColor(avgMood)
    };
  }

  function processSleepPattern(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return null;
    
    const sleepData = journalEntries
      .filter(entry => entry.sleep !== null && entry.sleep !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        sleep: entry.sleep,
        sleepQuality: entry.sleepQuality || 0
      }));

    const avgSleep = sleepData.reduce((sum, entry) => sum + entry.sleep, 0) / sleepData.length;
    const trend = calculateTrend(sleepData.map(d => d.sleep));
    
    return {
      type: 'sleep-pattern',
      data: sleepData,
      average: avgSleep,
      trend: trend,
      title: 'Sleep Pattern',
      description: `Average sleep: ${avgSleep.toFixed(1)} hours`,
      color: getSleepColor(avgSleep)
    };
  }

  function processExerciseProgress(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return null;
    
    const exerciseData = journalEntries
      .filter(entry => entry.exercise !== null && entry.exercise !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        exercise: entry.exercise,
        energy: entry.energy || 0
      }));

    const totalExercise = exerciseData.reduce((sum, entry) => sum + entry.exercise, 0);
    const avgExercise = totalExercise / exerciseData.length;
    const trend = calculateTrend(exerciseData.map(d => d.exercise));
    
    return {
      type: 'exercise-progress',
      data: exerciseData,
      total: totalExercise,
      average: avgExercise,
      trend: trend,
      title: 'Exercise Progress',
      description: `Total: ${totalExercise} minutes`,
      color: getExerciseColor(avgExercise)
    };
  }

  function processSymptomFrequency(symptoms) {
    if (!symptoms || symptoms.length === 0) return null;
    
    const symptomCounts = symptoms.reduce((acc, symptom) => {
      const category = symptom.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.keys(symptomCounts);
    const counts = Object.values(symptomCounts);
    const total = counts.reduce((sum, count) => sum + count, 0);
    
    return {
      type: 'symptom-frequency',
      data: categories.map((category, index) => ({
        category,
        count: counts[index],
        percentage: Math.round((counts[index] / total) * 100)
      })),
      total,
      title: 'Symptom Frequency',
      description: `${total} symptoms logged`,
      colors: ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']
    };
  }

  function processGoalCompletion(goals) {
    if (!goals || goals.length === 0) return null;
    
    const completedGoals = goals.filter(goal => goal.progress >= 100);
    const inProgressGoals = goals.filter(goal => goal.progress > 0 && goal.progress < 100);
    const notStartedGoals = goals.filter(goal => goal.progress === 0);
    
    const completionRate = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;
    
    return {
      type: 'goal-completion',
      data: [
        { status: 'Completed', count: completedGoals.length, color: '#10b981' },
        { status: 'In Progress', count: inProgressGoals.length, color: '#f59e0b' },
        { status: 'Not Started', count: notStartedGoals.length, color: '#ef4444' }
      ],
      completionRate,
      title: 'Goal Completion',
      description: `${completionRate.toFixed(1)}% completion rate`,
      total: goals.length
    };
  }

  function processHydrationTracking(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return null;
    
    const hydrationData = journalEntries
      .filter(entry => entry.water !== null && entry.water !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        water: entry.water
      }));

    const avgHydration = hydrationData.reduce((sum, entry) => sum + entry.water, 0) / hydrationData.length;
    const trend = calculateTrend(hydrationData.map(d => d.water));
    const daysAboveTarget = hydrationData.filter(entry => entry.water >= 8).length;
    
    return {
      type: 'hydration-tracking',
      data: hydrationData,
      average: avgHydration,
      trend: trend,
      daysAboveTarget,
      title: 'Hydration Tracking',
      description: `Average: ${avgHydration.toFixed(1)} glasses/day`,
      color: getHydrationColor(avgHydration)
    };
  }

  function processStressLevels(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return null;
    
    const stressData = journalEntries
      .filter(entry => entry.stress !== null && entry.stress !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        stress: entry.stress,
        mood: entry.mood || 0
      }));

    const avgStress = stressData.reduce((sum, entry) => sum + entry.stress, 0) / stressData.length;
    const trend = calculateTrend(stressData.map(d => d.stress));
    
    return {
      type: 'stress-levels',
      data: stressData,
      average: avgStress,
      trend: trend,
      title: 'Stress Levels',
      description: `Average stress: ${avgStress.toFixed(1)}/10`,
      color: getStressColor(avgStress)
    };
  }

  function processEnergyLevels(journalEntries) {
    if (!journalEntries || journalEntries.length === 0) return null;
    
    const energyData = journalEntries
      .filter(entry => entry.energy !== null && entry.energy !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(entry => ({
        date: entry.date,
        energy: entry.energy,
        sleep: entry.sleep || 0,
        exercise: entry.exercise || 0
      }));

    const avgEnergy = energyData.reduce((sum, entry) => sum + entry.energy, 0) / energyData.length;
    const trend = calculateTrend(energyData.map(d => d.energy));
    
    return {
      type: 'energy-levels',
      data: energyData,
      average: avgEnergy,
      trend: trend,
      title: 'Energy Levels',
      description: `Average energy: ${avgEnergy.toFixed(1)}/10`,
      color: getEnergyColor(avgEnergy)
    };
  }

  // Helper functions
  function calculateTrend(values) {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    const threshold = 0.1; // 10% change threshold
    
    if (Math.abs(difference) < threshold) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  }

  function getMoodColor(mood) {
    if (mood >= 8) return '#10b981';
    if (mood >= 6) return '#f59e0b';
    return '#ef4444';
  }

  function getSleepColor(sleep) {
    if (sleep >= 7) return '#10b981';
    if (sleep >= 6) return '#f59e0b';
    return '#ef4444';
  }

  function getExerciseColor(exercise) {
    if (exercise >= 30) return '#10b981';
    if (exercise >= 15) return '#f59e0b';
    return '#ef4444';
  }

  function getHydrationColor(hydration) {
    if (hydration >= 8) return '#10b981';
    if (hydration >= 6) return '#f59e0b';
    return '#ef4444';
  }

  function getStressColor(stress) {
    if (stress <= 3) return '#10b981';
    if (stress <= 6) return '#f59e0b';
    return '#ef4444';
  }

  function getEnergyColor(energy) {
    if (energy >= 8) return '#10b981';
    if (energy >= 6) return '#f59e0b';
    return '#ef4444';
  }

  function renderVisualization() {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="loading-large"></div>
        </div>
      );
    }

    if (!chartData) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No data available</div>
          <div className="empty-state-description">Start logging your health data to see visualizations</div>
        </div>
      );
    }

    switch (chartData.type) {
      case 'mood-trend':
      case 'sleep-pattern':
      case 'exercise-progress':
      case 'hydration-tracking':
      case 'stress-levels':
      case 'energy-levels':
        return renderLineChart(chartData);
      case 'symptom-frequency':
        return renderPieChart(chartData);
      case 'goal-completion':
        return renderBarChart(chartData);
      default:
        return null;
    }
  }

  function renderLineChart(data) {
    const maxValue = Math.max(...data.data.map(d => d[Object.keys(d)[1]]));
    const minValue = Math.min(...data.data.map(d => d[Object.keys(d)[1]]));
    const range = maxValue - minValue || 1;
    
    return (
      <div className="visualization-container">
        <div className="visualization-header">
          <h3 className="visualization-title">{data.title}</h3>
          <div className="visualization-summary">
            <span className="visualization-description">{data.description}</span>
            <span className={`visualization-trend ${data.trend}`}>
              {data.trend === 'improving' ? '📈' : data.trend === 'declining' ? '📉' : '➡️'} {data.trend}
            </span>
          </div>
        </div>
        
        <div className="line-chart-container">
          <div className="line-chart">
            {data.data.map((point, index) => {
              const value = point[Object.keys(point)[1]];
              const percentage = ((value - minValue) / range) * 100;
              const nextPoint = data.data[index + 1];
              
              return (
                <div key={index} className="line-chart-point">
                  <div 
                    className="line-chart-dot"
                    style={{ 
                      bottom: `${percentage}%`,
                      backgroundColor: data.color
                    }}
                    title={`${new Date(point.date).toLocaleDateString()}: ${value}`}
                  />
                  {nextPoint && (
                    <div 
                      className="line-chart-line"
                      style={{
                        height: `${Math.abs(((nextPoint[Object.keys(nextPoint)[1]] - minValue) / range) * 100 - percentage)}%`,
                        backgroundColor: data.color,
                        opacity: 0.6
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="line-chart-axis">
            <div className="axis-label axis-min">{minValue.toFixed(1)}</div>
            <div className="axis-label axis-max">{maxValue.toFixed(1)}</div>
          </div>
        </div>
      </div>
    );
  }

  function renderPieChart(data) {
    return (
      <div className="visualization-container">
        <div className="visualization-header">
          <h3 className="visualization-title">{data.title}</h3>
          <div className="visualization-summary">
            <span className="visualization-description">{data.description}</span>
          </div>
        </div>
        
        <div className="pie-chart-container">
          <div className="pie-chart">
            {data.data.map((segment, index) => {
              const angle = (segment.percentage / 100) * 360;
              return (
                <div key={index} className="pie-segment">
                  <div 
                    className="pie-segment-fill"
                    style={{
                      backgroundColor: data.colors[index % data.colors.length],
                      transform: `rotate(${angle}deg)`
                    }}
                  />
                  <div className="pie-segment-label">
                    {segment.category}: {segment.percentage}%
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pie-chart-legend">
            {data.data.map((segment, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color"
                  style={{ backgroundColor: data.colors[index % data.colors.length] }}
                />
                <span className="legend-label">
                  {segment.category} ({segment.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderBarChart(data) {
    const maxCount = Math.max(...data.data.map(d => d.count));
    
    return (
      <div className="visualization-container">
        <div className="visualization-header">
          <h3 className="visualization-title">{data.title}</h3>
          <div className="visualization-summary">
            <span className="visualization-description">{data.description}</span>
          </div>
        </div>
        
        <div className="bar-chart-container">
          {data.data.map((bar, index) => {
            const percentage = maxCount > 0 ? (bar.count / maxCount) * 100 : 0;
            
            return (
              <div key={index} className="bar-chart-item">
                <div className="bar-chart-label">{bar.status}</div>
                <div className="bar-chart-bar">
                  <div 
                    className="bar-chart-fill"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: bar.color
                    }}
                  />
                  <span className="bar-chart-value">{bar.count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="health-visualization">
      {renderVisualization()}
    </div>
  );
}




