const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const {readdirSync} = require("fs");
require("dotenv").config();
const router = express.Router();

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser:true,
  useFindAndModify:false,
  useCreateIndex: true,
  useUnifiedTopology:true})
  .then(()=> console.log("DB CONNECTED"))
  .catch(error => console.log(`DB ERROR ${error}`));

//app middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({limit: '1024kb'}));

router.get('/', (req, res) => {
	res.send("Hello world from server");
});

//route middlewares
readdirSync("./routes").map(r=> app.use("/api", require("./routes/"+r)));

if(process.env.NODE_ENV === 'production') {
	app.use(express.static("client/build"));
}


const port = process.env.PORT || 8000;
app.listen(port, ()=> {
  console.log(`Server running at port ${port}`);
})