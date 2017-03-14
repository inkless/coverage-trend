/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = () => {};

exports.up = (db, callback) => {
  db.createTable('coverage_stats', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    branch: 'string',
    base_branch: 'string',
    stats: 'text',
    category: 'string',
    created_at: {
      type: 'timestamp',
      defaultValue: new String('now()'),
    },
  }, callback);
};

exports.down = (db, callback) => {
  db.dropTable('coverage_stats', callback);
};

exports._meta = {
  version: 1
};
