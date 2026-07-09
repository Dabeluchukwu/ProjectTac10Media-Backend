require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/database");
connectDB();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});