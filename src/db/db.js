const mongoose = require("mongoose");

module.exports = (() => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  mongoose.connection.once("connected", () => console.log("DB Connected"));
})();