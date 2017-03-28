const express = require('express');
const debug = require('debug')('server');
const Stats = require('../model/stats');
const compareStats = require('../utils/compare');
const sendGithub = require('../utils/send_github');

const router = express.Router();

/* GET stats */
router.get('/:category', (req, res) => {
  const category = req.params.category;
  Stats.getAllBranches(category)
    .then(branches => {
      res.render('stats/index', {
        category: category,
        branches: branches.map(v => v.branch),
      });
    });
});

router.get('/:category/:branch', (req, res) => {
  const category = req.params.category;
  const branch = req.params.branch;

  let data;
  Stats.getByBranch(category, branch)
    .then(ret => {
      ret.sort((a, b) => {
        return new Date(a.created_at) > new Date(b.created_at);
      });
      data = ret;
      return ret;
    })
    .then(ret => {
      return Stats.getLatestByBranch(category, ret[ret.length - 1].base_branch);
    })
    .then(ret => {
      let baseBranch;
      let baseData = {};
      let coverageUrl;
      if (ret && ret.stats) {
        baseBranch = ret.branch;
        baseData = JSON.parse(ret.stats);
      }
      if (data && data.length) {
        coverageUrl = data[data.length - 1].coverage_url;
      }
      res.render('stats/branch', {
        category,
        branch,
        baseBranch,
        data,
        baseData,
        coverageUrl,
      });
    })
    .catch(err => {
      debug(err);
      res.send(500, err);
    });
});

router.post('/:category', (req, res) => {
  const category = req.params.category;
  let compareBranchStats = null;
  Stats.getLatestByBranch(category, req.body.baseBranch)
    .then(ret => {
      if (!ret) {
        return Stats.getLatestByBranch(category, req.body.branch);
      }
      return ret;
    })
    .then(ret => {
      if (ret && ret.stats) {
        compareBranchStats = JSON.parse(ret.stats);
      }
      return Stats.add(
        category,
        req.body.branch,
        req.body.baseBranch,
        req.body.stats,
        req.body.coverageUrl
      );
    })
    .then(() => {
      const result = compareStats(req.body.stats, compareBranchStats);
      res.send(result);
      sendGithub(req.body.commit, category, req.body.branch, result);
    })
    .catch((err) => {
      debug(err);
      res.send(500, err);
    });
});

module.exports = router;
