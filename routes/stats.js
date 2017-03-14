const express = require('express');
const Stats = require('../model/stats');
const debug = require('debug')('server');

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
      res.render('stats/branch', {
        category,
        branch,
        baseBranch: ret.branch,
        data,
        baseData: JSON.parse(ret.stats),
      });
    })
    .catch(err => {
      debug(err);
      res.send(500, err);
    });
});

router.post('/:category', (req, res) => {
  Stats.add(
    req.params.category,
    req.body.branch,
    req.body.baseBranch,
    req.body.stats).then((ret) => {
      res.send(ret);
    }).catch((err) => {
      debug(err);
      res.send(500, err);
    });
});

module.exports = router;
