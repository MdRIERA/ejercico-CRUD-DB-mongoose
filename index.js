const express = require("express");
const app = express();

const { dbConnection } = require("./config/config");
const tasksRoutes = require("./routes/tasks");

const PORT = process.env.PORT || 8080;

app.use(express.json());

// rutas
app.use("/", tasksRoutes);

// conexión DB
dbConnection();

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
