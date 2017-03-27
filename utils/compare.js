const formatStats = require('../model/stats').formatStats;
const UP = '↑';
const DOWN = '↓';

/**
 * toFloat
 * We only compare statements and branches
 *
 * @param stats
 */
function toFloat(stats) {
  if (!stats) {
    return {
      statements: 0,
      branches: 0,
    };
  }

  stats = formatStats(stats);

  return {
    statements: parseFloat(stats.statements),
    branches: parseFloat(stats.branches),
  };
}

module.exports = function compareStats(after, before) {
  after = toFloat(after);
  before = toFloat(before);

  let isCovUp = true;
  const data = {
    statements: `${after.statements}% (${after.statements - before.statements}% ${UP})`,
    branches: `${after.branches}% (${after.branches - before.branches}% ${UP})`,
  };

  if (after.statements < before.statements)  {
    isCovUp = false;
    data.statements = `${after.statements}% (${before.statements - after.statements}% ${DOWN})`;
  }

  if (after.branches < before.branches) {
    isCovUp = false;
    data.branches = `${after.branches}% (${before.branches - after.branches}% ${DOWN})`;
  }

  return {
    isCovUp,
    data,
  };

};
