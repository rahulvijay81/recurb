export const createFeatureFlagsTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'sqlite' ? 'AUTOINCREMENT' : 'AUTO_INCREMENT';
  const textType = dbType === 'postgres' ? 'TEXT' : 'VARCHAR(255)';
  const boolType = dbType === 'sqlite' ? 'INTEGER' : 'BOOLEAN';
  const timestampType = dbType === 'postgres' ? 'TIMESTAMP' : 'TEXT';

  return `
    CREATE TABLE IF NOT EXISTS feature_flags (
      key ${textType} PRIMARY KEY,
      enabled ${boolType} NOT NULL DEFAULT ${dbType === 'sqlite' ? '0' : 'FALSE'},
      description TEXT,
      createdAt ${timestampType} NOT NULL,
      updatedAt ${timestampType} NOT NULL
    );

    INSERT OR IGNORE INTO feature_flags (key, enabled, description, createdAt, updatedAt) VALUES
      ('csv_import', ${dbType === 'sqlite' ? '1' : 'TRUE'}, 'Enable CSV import functionality', datetime('now'), datetime('now')),
      ('pdf_upload', ${dbType === 'sqlite' ? '1' : 'TRUE'}, 'Enable PDF invoice uploads', datetime('now'), datetime('now')),
      ('team_features', ${dbType === 'sqlite' ? '1' : 'TRUE'}, 'Enable team collaboration features', datetime('now'), datetime('now')),
      ('webhooks', ${dbType === 'sqlite' ? '0' : 'FALSE'}, 'Enable webhook integrations', datetime('now'), datetime('now')),
      ('api_access', ${dbType === 'sqlite' ? '0' : 'FALSE'}, 'Enable API access', datetime('now'), datetime('now'));
  `;
};
