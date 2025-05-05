//imports
const express = require("express");
const cors = require("cors");
const router = require("./routes/students");
const authRouter = require("./routes/auth");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/students", router);
app.use("/auth/login", authRouter);

app.listen(5000, () => {
  console.log("The server is listening on port 5000...");
});
