const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {

  const { question } = req.body;

  const response = {
    answer:
      "Industrial emissions contribute the largest share of CO2. Increasing EV adoption and carbon capture can significantly reduce emissions."
  };

  res.json(response);

});

module.exports = router;