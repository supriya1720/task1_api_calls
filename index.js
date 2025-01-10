const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const userRouter = require("./routes/user");

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});