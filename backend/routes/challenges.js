const express = require('express');
const { HealthChallenge, UserChallenge, User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all available challenges
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await HealthChallenge.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Get user's challenges (active and completed)
router.get('/my-challenges', auth, async (req, res) => {
  try {
    const userChallenges = await UserChallenge.findAll({
      where: { userId: req.user.id },
      include: [{
        model: HealthChallenge,
        as: 'challenge'
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(userChallenges);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Failed to fetch user challenges' });
  }
});

// Join a challenge
router.post('/:id/join', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if challenge exists
    const challenge = await HealthChallenge.findByPk(id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    // Check if user already joined this challenge
    const existingParticipation = await UserChallenge.findOne({
      where: { userId, challengeId: id }
    });
    
    if (existingParticipation) {
      return res.status(400).json({ error: 'You have already joined this challenge' });
    }
    
    // Create user challenge participation
    const userChallenge = await UserChallenge.create({
      userId,
      challengeId: id,
      status: 'active',
      startDate: new Date(),
      progress: 0
    });
    
    // Include challenge details in response
    const result = await UserChallenge.findByPk(userChallenge.id, {
      include: [{
        model: HealthChallenge,
        as: 'challenge'
      }]
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error joining challenge:', error);
    res.status(500).json({ error: 'Failed to join challenge' });
  }
});

// Update challenge progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, notes } = req.body;
    const userId = req.user.id;
    
    const userChallenge = await UserChallenge.findOne({
      where: { userId, challengeId: id },
      include: [{
        model: HealthChallenge,
        as: 'challenge'
      }]
    });
    
    if (!userChallenge) {
      return res.status(404).json({ error: 'Challenge participation not found' });
    }
    
    // Validate progress
    const maxProgress = userChallenge.challenge.targetValue || 100;
    const newProgress = Math.min(Math.max(progress, 0), maxProgress);
    
    const updates = { progress: newProgress };
    
    // Update status based on progress
    if (newProgress >= maxProgress && userChallenge.status !== 'completed') {
      updates.status = 'completed';
      updates.completedAt = new Date();
    }
    
    if (notes) {
      updates.notes = notes;
    }
    
    await userChallenge.update(updates);
    
    // Fetch updated challenge with relations
    const updatedChallenge = await UserChallenge.findByPk(userChallenge.id, {
      include: [{
        model: HealthChallenge,
        as: 'challenge'
      }]
    });
    
    res.json(updatedChallenge);
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ error: 'Failed to update challenge progress' });
  }
});

// Leave a challenge
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const userChallenge = await UserChallenge.findOne({
      where: { userId, challengeId: id }
    });
    
    if (!userChallenge) {
      return res.status(404).json({ error: 'Challenge participation not found' });
    }
    
    await userChallenge.destroy();
    res.json({ message: 'Successfully left the challenge' });
  } catch (error) {
    console.error('Error leaving challenge:', error);
    res.status(500).json({ error: 'Failed to leave challenge' });
  }
});

// Get challenge leaderboard
router.get('/:id/leaderboard', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 10 } = req.query;
    
    const leaderboard = await UserChallenge.findAll({
      where: { challengeId: id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'firstName', 'lastName']
      }],
      order: [['progress', 'DESC'], ['updatedAt', 'ASC']],
      limit: parseInt(limit)
    });
    
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get completed challenges
    const completedChallenges = await UserChallenge.findAll({
      where: { userId, status: 'completed' },
      include: [{
        model: HealthChallenge,
        as: 'challenge'
      }],
      order: [['completedAt', 'DESC']]
    });
    
    // Calculate achievement stats
    const stats = {
      totalChallenges: await UserChallenge.count({ where: { userId } }),
      completedChallenges: completedChallenges.length,
      activeChallenges: await UserChallenge.count({ where: { userId, status: 'active' } }),
      totalPoints: completedChallenges.reduce((sum, challenge) => sum + (challenge.challenge.points || 0), 0),
      streak: 0 // Could be calculated based on consecutive completed challenges
    };
    
    // Generate achievement badges
    const achievements = [
      {
        id: 'first-challenge',
        title: 'First Steps',
        description: 'Complete your first health challenge',
        icon: '🏃‍♂️',
        unlocked: stats.completedChallenges > 0,
        unlockedAt: stats.completedChallenges > 0 ? completedChallenges[0]?.completedAt : null
      },
      {
        id: 'challenge-master',
        title: 'Challenge Master',
        description: 'Complete 10 health challenges',
        icon: '🏆',
        unlocked: stats.completedChallenges >= 10,
        unlockedAt: stats.completedChallenges >= 10 ? completedChallenges[9]?.completedAt : null
      },
      {
        id: 'consistency-champion',
        title: 'Consistency Champion',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: stats.streak >= 7,
        unlockedAt: null
      },
      {
        id: 'point-collector',
        title: 'Point Collector',
        description: 'Earn 1000 points from challenges',
        icon: '💎',
        unlocked: stats.totalPoints >= 1000,
        unlockedAt: null
      }
    ];
    
    res.json({
      stats,
      achievements,
      completedChallenges
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Create a new challenge (admin only - for now, any authenticated user)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      targetValue,
      unit,
      duration,
      points,
      requirements,
      tips
    } = req.body;
    
    const challenge = await HealthChallenge.create({
      title,
      description,
      category,
      targetValue,
      unit,
      duration,
      points: points || 100,
      requirements: requirements || [],
      tips: tips || [],
      createdBy: req.user.id,
      isActive: true
    });
    
    res.status(201).json(challenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

// Get challenge categories
router.get('/categories', auth, (req, res) => {
  const categories = [
    { id: 'fitness', name: 'Fitness', icon: '🏃‍♂️', color: '#10b981' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗', color: '#f59e0b' },
    { id: 'sleep', name: 'Sleep', icon: '😴', color: '#8b5cf6' },
    { id: 'mental-health', name: 'Mental Health', icon: '🧘‍♀️', color: '#06b6d4' },
    { id: 'hydration', name: 'Hydration', icon: '💧', color: '#3b82f6' },
    { id: 'meditation', name: 'Meditation', icon: '🕉️', color: '#84cc16' },
    { id: 'stress-management', name: 'Stress Management', icon: '🌿', color: '#22c55e' },
    { id: 'social', name: 'Social', icon: '👥', color: '#f97316' }
  ];
  
  res.json(categories);
});

// Get user's challenge statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [
      totalChallenges,
      activeChallenges,
      completedChallenges,
      totalPoints,
      averageProgress
    ] = await Promise.all([
      UserChallenge.count({ where: { userId } }),
      UserChallenge.count({ where: { userId, status: 'active' } }),
      UserChallenge.count({ where: { userId, status: 'completed' } }),
      UserChallenge.sum('progress', { 
        where: { userId, status: 'completed' },
        include: [{
          model: HealthChallenge,
          as: 'challenge'
        }]
      }),
      UserChallenge.findAll({
        where: { userId },
        include: [{
          model: HealthChallenge,
          as: 'challenge'
        }]
      }).then(challenges => {
        if (challenges.length === 0) return 0;
        const totalProgress = challenges.reduce((sum, challenge) => sum + challenge.progress, 0);
        const maxProgress = challenges.reduce((sum, challenge) => sum + (challenge.challenge.targetValue || 100), 0);
        return maxProgress > 0 ? Math.round((totalProgress / maxProgress) * 100) : 0;
      })
    ]);
    
    const stats = {
      totalChallenges,
      activeChallenges,
      completedChallenges,
      totalPoints: totalPoints || 0,
      averageProgress,
      completionRate: totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching challenge stats:', error);
    res.status(500).json({ error: 'Failed to fetch challenge statistics' });
  }
});

module.exports = router;

