// Analytics Event Tracking for Game Zone Monad
// 50 Golden Events for user behavior, conversions, and retention

export type AnalyticsEvent =
  // Page Views
  | 'landing_page_viewed'
  | 'play_as_guest_clicked'
  
  // Wallet & Authentication (1-5)
  | 'wallet_connected'
  | 'wallet_disconnected'
  | 'wallet_changed'
  | 'wallet_connect_failed'
  | 'wallet_connect_initiated'
  
  // Tournament Events (6-15)
  | 'tournament_viewed'
  | 'tournament_entered'
  | 'tournament_entry_failed'
  | 'tournament_completed'
  | 'tournament_score_submitted'
  | 'tournament_prize_claimed'
  | 'tournament_leaderboard_viewed'
  | 'tournament_shared'
  | 'tournament_filter_changed'
  | 'tournament_search'
  
  // Game Events (16-25)
  | 'game_started'
  | 'game_completed'
  | 'game_won'
  | 'game_lost'
  | 'game_abandoned'
  | 'bet_placed'
  | 'bet_changed'
  | 'cashout_triggered'
  | 'game_switched'
  | 'game_tutorial_viewed'
  
  // Social Events (26-32)
  | 'referral_link_generated'
  | 'referral_link_shared'
  | 'friend_invited'
  | 'social_share'
  | 'leaderboard_viewed'
  | 'profile_viewed'
  | 'friend_challenged'
  
  // Monetization Events (33-40)
  | 'deposit_initiated'
  | 'deposit_completed'
  | 'deposit_failed'
  | 'withdrawal_initiated'
  | 'withdrawal_completed'
  | 'nft_purchased'
  | 'subscription_purchased'
  | 'virtual_goods_purchased'
  
  // Engagement Events (41-45)
  | 'daily_login'
  | 'streak_milestone'
  | 'achievement_unlocked'
  | 'level_up'
  | 'reward_claimed'
  
  // Guardrail Events (46-50)
  | 'spend_limit_reached'
  | 'cooloff_triggered'
  | 'self_exclusion_enabled'
  | 'time_limit_warning'
  | 'responsible_gaming_viewed';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsManager {
  private events: Array<{ event: AnalyticsEvent; properties: EventProperties; timestamp: number }> = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserId() {
    this.userId = localStorage.getItem('analytics_user_id') || undefined;
  }

  setUserId(userId: string) {
    this.userId = userId;
    localStorage.setItem('analytics_user_id', userId);
  }

  track(event: AnalyticsEvent, properties: EventProperties = {}) {
    const eventData = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      timestamp: Date.now(),
    };

    this.events.push(eventData);
    console.log('[Analytics]', event, eventData.properties);

    // Send to analytics backend (implement your backend)
    this.sendToBackend(eventData);

    // Store locally for backup
    this.storeLocally(eventData);
  }

  private async sendToBackend(eventData: any) {
    // TODO: Implement backend analytics API
    // Example:
    // try {
    //   await fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(eventData),
    //   });
    // } catch (error) {
    //   console.error('Analytics error:', error);
    // }
  }

  private storeLocally(eventData: any) {
    try {
      const stored = localStorage.getItem('analytics_events');
      const events = stored ? JSON.parse(stored) : [];
      events.push(eventData);
      
      // Keep only last 1000 events
      if (events.length > 1000) {
        events.shift();
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to store analytics locally:', error);
    }
  }

  getEvents() {
    return this.events;
  }

  getSessionId() {
    return this.sessionId;
  }

  getUserId() {
    return this.userId;
  }

  // Helper methods for common events
  trackWalletConnect(address: string) {
    this.setUserId(address);
    this.track('wallet_connected', { address });
  }

  trackGameStart(gameType: string, betAmount: number) {
    this.track('game_started', { gameType, betAmount });
  }

  trackGameComplete(gameType: string, result: 'won' | 'lost', winAmount?: number) {
    this.track('game_completed', { gameType, result, winAmount });
    this.track(result === 'won' ? 'game_won' : 'game_lost', { gameType, winAmount });
  }

  trackTournamentEnter(tournamentId: string, entryFee: number) {
    this.track('tournament_entered', { tournamentId, entryFee });
  }

  trackDeposit(amount: number, currency: string, status: 'initiated' | 'completed' | 'failed') {
    const event = status === 'initiated' ? 'deposit_initiated' 
                : status === 'completed' ? 'deposit_completed' 
                : 'deposit_failed';
    this.track(event, { amount, currency });
  }
}

export const analytics = new AnalyticsManager();
