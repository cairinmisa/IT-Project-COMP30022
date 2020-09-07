require('dotenv').config();
var mongoose = require('mongoose');

const uri = "mongodb+srv://database:<password>@cluster0.unxpn.mongodb.net/dbDEV?retryWrites=true&w=majority";
var MONGO_URL = uri.replace("<password>",process.env.DATABASE_PASS);

mongoose.connect(MONGO_URL, {useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "dbDEV"
});

const db = mongoose.connection;
db.on("error", err=> {
  console.error(err);
  process.exit(1);
})

db.once("open", async () => {
  console.log("Mongo connection started on" + db.host + ":" + db.port);
});

// Require other DBs here.
// Example: require("./users"); for a Users DB
