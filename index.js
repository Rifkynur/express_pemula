const express = require("express");
const app = express();
const categoriesRouter = require("./routes/categories");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const profileRouter = require("./routes/profileRouter");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan("dev"));
app.use(cors());
app.use("/public/uploads", express.static(path.join(__dirname, "/public/uploads")));

app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/profile", profileRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("server sudah berjalan diport", port);
});
