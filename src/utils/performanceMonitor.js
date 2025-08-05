/**
 * Performance monitoring utilities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  // Start timing
  startTimer(name) {
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  // End timing
  endTimer(name) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      // Log if duration is high
      if (metric.duration > 1000) {
        console.warn(`⚠️ Slow operation: ${name} took ${metric.duration.toFixed(2)}ms`);
      }
      
      this.notifyObservers(name, metric);
    }
  }

  // Get metric
  getMetric(name) {
    return this.metrics.get(name);
  }

  // Add observer
  addObserver(callback) {
    this.observers.push(callback);
  }

  // Notify observers
  notifyObservers(name, metric) {
    this.observers.forEach(callback => callback(name, metric));
  }

  // Monitor API call
  async monitorApiCall(name, apiCall) {
    this.startTimer(name);
    try {
      const result = await apiCall();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  // Monitor component render
  monitorComponentRender(componentName, renderFunction) {
    this.startTimer(`${componentName}_render`);
    const result = renderFunction();
    this.endTimer(`${componentName}_render`);
    return result;
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for monitoring
export function usePerformanceMonitor(componentName) {
  const startRender = () => performanceMonitor.startTimer(`${componentName}_render`);
  const endRender = () => performanceMonitor.endTimer(`${componentName}_render`);
  
  return { startRender, endRender };
}

// Monitor API calls
export function withPerformanceMonitoring(apiFunction, name) {
  return async (...args) => {
    return performanceMonitor.monitorApiCall(name, () => apiFunction(...args));
  };
} 