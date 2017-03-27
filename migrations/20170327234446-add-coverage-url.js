/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function() {};

exports.up = function(db, callback) {
  db.addColumn('coverage_stats', 'coverage_url', 'string', callback);
};

exports.down = function(db, callback) {
  db.removeColumn('coverage_stats', 'coverage_url', 'string', callback);
};

exports._meta = {
  version: 1,
};
