const express = require("express");
const cors = require("cors");

const emissionsRoute = require("./routes/emissions");
const simulationRoute = require("./routes/simulation");
const aiRoute = require("./routes/ai");
const netzeroRoute = require("./routes/netzero");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/emissions", emissionsRoute);
app.use("/api/simulation", simulationRoute);
app.use("/api/ai", aiRoute);
app.use("/api/netzero", netzeroRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});