const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {

  const { evAdoption, treesPlanted, trafficReduction, carbonCapture } = req.body;

  const reduction =
    evAdoption * 0.25 +
    treesPlanted * 0.2 +
    trafficReduction * 0.25 +
    carbonCapture * 0.3;

  const neutralYear = Math.round(2050 - reduction * 0.4);

  res.json({
    reduction: reduction.toFixed(2),
    predictedNetZeroYear: neutralYear
  });

});

module.exports = router;