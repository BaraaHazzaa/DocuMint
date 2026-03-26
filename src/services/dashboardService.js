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
};
