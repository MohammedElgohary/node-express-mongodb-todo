const mongoose = require("mongoose");

module.exports = mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Teacher Database Connected !"))
  .catch(console.log);
