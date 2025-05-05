const express = require("express");
const authRouter = express.Router();
const { authenticateUser } = require("../controllers/authUser");

authRouter.post("/", authenticateUser);

module.exports = authRouter;