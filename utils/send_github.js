const request = require('request');

/**
 * Result:
 * {
 *   "isCovUp": true,
 *   "data": {
 *     "statements": "30.12% (0% ↑)",
 *     "branches": "20.01% (0% ↑)"
 *   }
 * }
 */
module.exports = function send(commit, category, branch, result) {

  const body = {
    state: result.isCovUp ? 'success' : 'failure',
    target_url: `https://coverage-trend.herokuapp.com/stats/${category}/${encodeURIComponent(branch)}`,
    description: `Statements: ${result.data.statements}, Branches: ${result.data.branches}`,
    context: `Cov Diff - ${category}`,
  };

  request({
    url: `https://api.github.com/repos/ProsperWorks/ALI/statuses/${commit}`,
    method: 'POST',
    auth: {
      user: process.env.GITHUB_USER,
      pass: process.env.GITHUB_TOKEN,
    },
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'request',
    },
    body: JSON.stringify(body),
  }, function (error, resp) {
    console.log(error, resp);
  });

};
