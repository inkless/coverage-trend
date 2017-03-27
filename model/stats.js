const db = require('../db');

exports.getByBranch = function getByBranch(category, branch) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM coverage_stats WHERE category = $1 AND branch = $2 ORDER BY created_at DESC LIMIT 20',
      [category, branch], (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result.rows);
      });
  });
};

exports.getLatestByBranch = function getLatestByBranch(category, branch) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM coverage_stats WHERE category = $1 AND branch = $2 ORDER BY created_at DESC LIMIT 1',
      [category, branch], (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result.rows[0]);
      });
  });
};

exports.add = function add(category, branch, baseBranch, stats, coverageUrl = '') {
  if (!category || !branch || !baseBranch || !stats || typeof stats !== 'object') {
    return Promise.reject('invalid data');
  }

  stats = formatStats(stats);
  if (!isStatsValid(stats)) {
    return Promise.reject('invalid stats');
  }

  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO coverage_stats (
        branch, base_branch, stats, category, coverage_url
      ) VALUES ($1, $2, $3, $4, $5)`,
      [ branch, baseBranch, stats, category, coverageUrl ],
      (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      }
    );
  });
};

exports.getAllCategories = function getAllCategories() {
  return new Promise((resolve, reject) => {
    db.query('SELECT DISTINCT category FROM coverage_stats', (err, result) => {
      if (err) {
        return reject(err);
      }

      resolve(result.rows);
    });
  });
};

exports.getAllBranches = function getAllBranches(category) {
  return new Promise((resolve, reject) => {
    db.query('SELECT DISTINCT branch FROM coverage_stats WHERE category = $1',
      [category], (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result.rows);
      });
  });
};

exports.formatStats = formatStats;

function isStatsValid(stats) {
  if (stats.statements && stats.branches && stats.functions && stats.lines) {
    return true;
  }

  return false;
}

function formatStats(stats) {
  for (let i in stats) {
    stats[i.toLowerCase()] = stats[i];
    if (i !== i.toLowerCase()) {
      delete stats[i];
    }
  }

  return stats;
}
