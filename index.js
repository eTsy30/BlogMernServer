import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserModel from './models/User.js';

mongoose.set('strictQuery', true);
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.ffddjda.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connect..."))
  .catch((error) => console.log("Db error", error));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello wodld");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body, "**************************");
  //отправка и шифровка jwt на основе данных
  const token = jwt.sign(
    {
      email: req.body.email,
    },
    "secfret"
  );
  //ответ для клиента
  res.json({
    success: true,
    token,
  });
});
 
app.post("/auth/register", registerValidation, async (req, res) => {
   try {
    const error= validationResult(req)
   console.log(error);
  if(!error.isEmpty()){
    return res.status(400).json(error.array())
  }
 
  //шифруем пароль с помощью соли
  const password= req.body.password
  const salt= await bcrypt.genSalt(10)
  const passwordHash= await bcrypt.hash(password,salt)


  //создание пользователя с помощю mongoDB
  const doc= new UserModel({
    email:req.body.email,
    password:passwordHash,
    fullName:req.body.fullName,
    avatarUrl:req.body.avatarUrl
  })
  // сохраням нащ doc  документ в базе данных

  const user= await doc.save()
  console.log(doc,'doc');
  res.json({
    success:true,user
  })
   } catch (error) {
    res.status(500).json({
      messege: 'не удалось зарегестрировать пользователя' 
    })
   }
})

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Ok 1");
});
