require('dotenv').config();
var mongoose = require('mongoose');

const uri = "mongodb+srv://database:<password>@cluster0.unxpn.mongodb.net/dbDEV?retryWrites=true&w=majority";
var MONGO_URL = uri.replace("<password>",process.env.DATABASE_PASS);


// Connects to the mongoose server, given information in the .env file
mongoose.connect(MONGO_URL, {useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "dbDEV"
});

// If there is an error, then disconnect and log an error
const db = mongoose.connection;
db.on("error", err=> {
  console.error(err);
  process.exit(1);
})

// Responds to event only once
db.once("open", async () => {
  console.log("Mongo connection started on" + db.host + ":" + db.port);
});

// Other required DB's
require("./dbschema/eportfolio");
require("./dbschema/user");
require("./dbschema/templates");