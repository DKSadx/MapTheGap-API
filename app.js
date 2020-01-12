require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const formData = require("express-form-data");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//
process.on("exit", code => {
  console.log("API is shutting down");

  require("./db/client").disconnect();
});

//Database
require("./db/init_db")();

//Cloudinary config for image cloud
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});
//Pasrser for images
app.use(formData.parse());


//Import routes
const user_routes = require("./routes/user");
const issue_routes = require("./routes/issue");
const feed_routes = require("./routes/feed");
const user_type_routes = require("./routes/user_type");
const image_upload_routes = require("./routes/upload-image");
const category_routes = require("./routes/category");
const area_routes = require("./routes/area");
const notification_type_routes = require("./routes/notification_type")
const notification_router = require("./routes/notifications")

//Routes
app.use("/user", user_routes);
app.use("/issue", issue_routes);
app.use("/feed", feed_routes);
app.use("/user_type", user_type_routes);
app.use("/image-upload", image_upload_routes);
app.use("/category", category_routes);
app.use("/area", area_routes);
app.use("/notification_type", notification_type_routes);
app.use("/notifications", notification_router);

//Listen port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
