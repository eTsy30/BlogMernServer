import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt'
import UserModel from "../models/User.js";

export const register=async (req, res) => {
    try {
     
  
      //шифруем пароль с помощью соли
      const passwordHash = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const pas = await bcrypt.hash(passwordHash, salt);
  
      // создание пользователя с помощю mongoDB
      const doc = new UserModel({
        email: req.body.email,
        password: pas,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
      });
  
      // сохраням нащ doc  документ в базе данных
      const user = await doc.save();
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret",
        {
          expiresIn: "30d",
        }
      );
      // через деструктаризацию достаеь pass и убираем его
      const { password, ...userData } = user._doc;
  
      res.json({
        success: true,
        ...userData,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        messege: "не удалось зарегестрировать пользователя",
      });
    }
  }
export const login=async (req, res) => {
    try {
      //поиск пользователя в базе данных
      const user = await UserModel.findOne({
        email: req.body.email,
      });
      console.log(user);
      if (!user) {
        return res.status(404).json({ messege: "пользователь не найден" });
      }
  
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user._doc.password
      );
      console.log(isValidPass, "isValidPass");
      if (!isValidPass) {
        return res.status(400).json({ messege: "password не верный" });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret",
        {
          expiresIn: "30d",
        }
      );
      const { password, ...userData } = user._doc;
      res.json({
        ...userData,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        messege: "не удалось авторизироваться",
      });
    }
  }
  export const getMe=async (req, res) => {
    try {
      const user= await UserModel.findById(req.userId)
      if(!user){
        return res.status(404).json({
          message:'пользователь не найден'
        })
      }
      const { password, ...userData } = user._doc;
      res.json({
        success: true,
        ...userData,
      });
    } catch (error) {
      console.log('error');
      res.json({
        messege: "Нет доступа"
      });
    }
  }