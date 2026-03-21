const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {

  // Example calculation (you can change later)
  const reduction = 24; // example reduction percentage

  const predictedYear = Math.round(2050 - reduction * 0.4);

  res.json({
    city: "Neo Metro",
    predictedNetZeroYear: predictedYear
  });

});

module.exports = router;