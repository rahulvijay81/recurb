export const dropAllTables = () => {
  return [
    'DROP TABLE IF EXISTS audit_logs;',
    'DROP TABLE IF EXISTS subscriptions;',
    'DROP TABLE IF EXISTS users;',
    'DROP TABLE IF EXISTS organizations;',
  ];
};
