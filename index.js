import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validation.js";
import checkAuth from "./utils/checkAuth.js";
import { register, login, getMe} from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  delite,
  update
} from "./controllers/PostController.js";
import handleValidationsErrors from './utils/handleValidationsErrors.js'


mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.ffddjda.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connect..."))
  .catch((error) => console.log("Db error", error));

const app = express();
//загрузка картинок создаем storage
const storage= multer.diskStorage({
  destination:(_, __, cb)=>{
    cb(null,'uploads');
  },
  filename:(_, file, cb)=>{
    cb(null,file.originalname)
  }
})
 const uploads=multer({storage})


app.use(express.json());


app.use('/uploads',express.static('uploads'))
app.post('/upload',checkAuth ,uploads.single('image'),(req,res)=>{
  res.json({
    url:`/uploads/${req.file.originalname}`
  })
})
app.post("/auth/login",loginValidation, handleValidationsErrors, login);
app.post("/auth/register",handleValidationsErrors, registerValidation, register);
app.get("/auth/me", checkAuth, getMe);

app.get("/post", getAll);
app.get("/post/:id", getOne);
app.post("/post", checkAuth, handleValidationsErrors, postCreateValidation, create);
app.delete("/post/:id",checkAuth, delite);
app.patch("/post/:id",checkAuth,postCreateValidation,  handleValidationsErrors,update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok 1");
});
