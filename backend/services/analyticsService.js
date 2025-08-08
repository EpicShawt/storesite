const Analytics = require('../models/Analytics');

class AnalyticsService {
  // Track page view
  async trackPageView(page) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let analytics = await Analytics.findOne({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!analytics) {
        analytics = new Analytics({ date: today });
      }

      // Increment page view
      if (analytics.pageViews[page]) {
        analytics.pageViews[page]++;
      }

      await analytics.save();
      return true;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return false;
    }
  }

  // Track user action
  async trackUserAction(action) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let analytics = await Analytics.findOne({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!analytics) {
        analytics = new Analytics({ date: today });
      }

      // Increment user action
      if (analytics.userActions[action]) {
        analytics.userActions[action]++;
      }

      await analytics.save();
      return true;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      return false;
    }
  }

  // Track performance metrics
  async trackPerformance(metrics) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let analytics = await Analytics.findOne({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!analytics) {
        analytics = new Analytics({ date: today });
      }

      // Update performance metrics
      if (metrics.loadTime) {
        analytics.performance.averageLoadTime = 
          (analytics.performance.averageLoadTime + metrics.loadTime) / 2;
      }

      if (metrics.totalRequests) {
        analytics.performance.totalRequests += metrics.totalRequests;
      }

      if (metrics.errorRate !== undefined) {
        analytics.performance.errorRate = metrics.errorRate;
      }

      if (metrics.uptime !== undefined) {
        analytics.performance.uptime = metrics.uptime;
      }

      await analytics.save();
      return true;
    } catch (error) {
      console.error('Performance tracking error:', error);
      return false;
    }
  }

  // Track revenue
  async trackRevenue(amount) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let analytics = await Analytics.findOne({
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (!analytics) {
        analytics = new Analytics({ date: today });
      }

      // Update revenue metrics
      analytics.revenue.totalSales += amount;
      analytics.revenue.totalOrders++;
      analytics.revenue.averageOrderValue = 
        analytics.revenue.totalSales / analytics.revenue.totalOrders;

      await analytics.save();
      return true;
    } catch (error) {
      console.error('Revenue tracking error:', error);
      return false;
    }
  }

  // Get analytics for dashboard
  async getDashboardAnalytics(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const analytics = await Analytics.find({
        date: { $gte: startDate }
      }).sort({ date: -1 });

      // Calculate totals
      const totals = {
        pageViews: {
          home: 0,
          products: 0,
          productDetail: 0,
          cart: 0,
          admin: 0
        },
        userActions: {
          productViews: 0,
          addToCart: 0,
          purchases: 0,
          imageUploads: 0,
          adminLogins: 0
        },
        performance: {
          averageLoadTime: 0,
          totalRequests: 0,
          errorRate: 0,
          uptime: 100
        },
        revenue: {
          totalSales: 0,
          totalOrders: 0,
          averageOrderValue: 0
        }
      };

      analytics.forEach(day => {
        // Sum page views
        Object.keys(day.pageViews).forEach(page => {
          totals.pageViews[page] += day.pageViews[page] || 0;
        });

        // Sum user actions
        Object.keys(day.userActions).forEach(action => {
          totals.userActions[action] += day.userActions[action] || 0;
        });

        // Sum revenue
        totals.revenue.totalSales += day.revenue.totalSales || 0;
        totals.revenue.totalOrders += day.revenue.totalOrders || 0;
      });

      // Calculate averages
      if (analytics.length > 0) {
        totals.performance.averageLoadTime = 
          analytics.reduce((sum, day) => sum + day.performance.averageLoadTime, 0) / analytics.length;
        totals.performance.totalRequests = 
          analytics.reduce((sum, day) => sum + day.performance.totalRequests, 0);
        totals.performance.errorRate = 
          analytics.reduce((sum, day) => sum + day.performance.errorRate, 0) / analytics.length;
        totals.performance.uptime = 
          analytics.reduce((sum, day) => sum + day.performance.uptime, 0) / analytics.length;
      }

      if (totals.revenue.totalOrders > 0) {
        totals.revenue.averageOrderValue = totals.revenue.totalSales / totals.revenue.totalOrders;
      }

      return {
        totals,
        dailyData: analytics,
        period: `${days} days`
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      return null;
    }
  }
}

module.exports = new AnalyticsService(); 