const mongoose = require("mongoose");
require("dotenv").config();

const dbConnection = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        "MONGO_URI no está definida. Revisa tu archivo .env (en la raíz) y que tenga MONGO_URI=..."
      );
    }

    await mongoose.connect(uri);
    console.log("✅ Base de datos conectada con éxito");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = { dbConnection };
