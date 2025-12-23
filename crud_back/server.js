const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todos");

const app = express();

app.use(cors({
  origin: "*",            // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],//http methods , 
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());
app.use("/api/todos", todoRoutes);

const PORT = 5000;
app.listen(PORT, function () {
  console.log("🚀 Server running on port " + PORT);
});
