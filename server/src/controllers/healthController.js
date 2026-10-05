export const checkHealth = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server Node.js + Express đang hoạt động hoàn hảo!',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + ' giây',
    environment: process.env.NODE_ENV || 'development'
  });
};