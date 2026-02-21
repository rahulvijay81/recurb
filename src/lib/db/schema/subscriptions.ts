export const createSubscriptionsTable = (dbType: 'sqlite' | 'postgres' | 'mysql') => {
  const autoIncrement = dbType === 'postgres' ? 'SERIAL' : dbType === 'mysql' ? 'INT AUTO_INCREMENT' : 'INTEGER';
  const primaryKey = dbType === 'postgres' ? 'PRIMARY KEY' : 'PRIMARY KEY AUTOINCREMENT';
  const timestamp = dbType === 'postgres' ? 'TIMESTAMP' : 'DATETIME';
  const decimal = dbType === 'postgres' ? 'DECIMAL(10,2)' : 'DECIMAL(10,2)';

  return `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id ${dbType === 'postgres' ? autoIncrement : autoIncrement} ${dbType === 'sqlite' ? primaryKey : 'PRIMARY KEY'},
      name VARCHAR(255) NOT NULL,
      amount ${decimal} NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'USD',
      billing_cycle VARCHAR(50) NOT NULL,
      category VARCHAR(100),
      vendor VARCHAR(255),
      tags TEXT,
      next_billing_date ${timestamp},
      auto_renew BOOLEAN DEFAULT true,
      notes TEXT,
      invoice_url VARCHAR(500),
      organization_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      updated_at ${timestamp} DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_organization ON subscriptions(organization_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON subscriptions(category);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);
  `;
};

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  category?: string;
  vendor?: string;
  tags?: string;
  next_billing_date?: Date;
  auto_renew: boolean;
  notes?: string;
  invoice_url?: string;
  organization_id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
