// Analytics wrapper for tracking events

export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

class Analytics {
  private enabled: boolean;

  constructor() {
    this.enabled = process.env.NODE_ENV === "production";
  }

  // Track page view
  pageView(url: string) {
    if (!this.enabled) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  }

  // Track custom event
  track(event: AnalyticsEvent) {
    if (!this.enabled) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", event.name, event.properties);
    }

    // Console log in development
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Analytics Event:", event);
    }
  }

  // Track tool usage
  trackToolUsage(toolName: string, properties?: Record<string, any>) {
    this.track({
      name: "tool_used",
      properties: {
        tool_name: toolName,
        ...properties,
      },
    });
  }

  // Track analysis completion
  trackAnalysisComplete(toolName: string, score?: number, duration?: number) {
    this.track({
      name: "analysis_complete",
      properties: {
        tool_name: toolName,
        score,
        duration_ms: duration,
      },
    });
  }

  // Track user signup
  trackSignup(method: string = "email") {
    this.track({
      name: "sign_up",
      properties: {
        method,
      },
    });
  }

  // Track plan upgrade
  trackUpgrade(plan: string) {
    this.track({
      name: "plan_upgrade",
      properties: {
        plan,
      },
    });
  }

  // Track error
  trackError(error: Error, context?: Record<string, any>) {
    this.track({
      name: "error",
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        ...context,
      },
    });
  }
}

export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return analytics;
}
