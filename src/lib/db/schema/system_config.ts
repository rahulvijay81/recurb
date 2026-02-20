export const createSystemConfigTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const timestamp = dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';

  return `
    CREATE TABLE IF NOT EXISTS system_config (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT,
      updated_at ${timestamp} DEFAULT CURRENT_TIMESTAMP
    );
  `;
};
