export const dashboardService = {
  async getStats(role) {
    // This would typically fetch data based on the user's role
    // For now, we'll return mock data with a delay to simulate a network request
    console.log(`Fetching stats for role: ${role}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        let stats = {};
        switch (role) {
          case 'employee':
            stats = {
              pending: 5,
              approved: 20,
              rejected: 2,
              drafts: 3,
            };
            break;
          case 'manager':
            stats = {
              pendingApproval: 12,
              teamCompleted: 45,
              overdue: 4,
              totalTeam: 8,
            };
            break;
          case 'admin':
            stats = {
              totalUsers: 50,
              totalTransactions: 500,
              systemErrors: 1,
              activeSessions: 25,
            };
            break;
          default:
            stats = {};
        }
        resolve(stats);
      }, 1500); // 1.5-second delay
    });
  },

  async getChartData(role) {
    console.log(`Fetching chart data for role: ${role}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data for the chart
        const data = [
          { name: 'Jan', completed: 40, pending: 24 },
          { name: 'Feb', completed: 30, pending: 13 },
          { name: 'Mar', completed: 20, pending: 98 },
          { name: 'Apr', completed: 27, pending: 39 },
          { name: 'May', completed: 18, pending: 48 },
          { name: 'Jun', completed: 23, pending: 38 },
          { name: 'Jul', completed: 34, pending: 43 },
        ];
        resolve(data);
      }, 1200);
    });
  }
};
