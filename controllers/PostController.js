import PostModel from "../models/Post.js";
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imgUrl: req.body.imgUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Пост не создался",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // берем с бвзы данных данные.  '.populate('user').exec()'--этой командой связываемся с бд userov
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.json({
      message: "Посты не найдены",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: "after" },

      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось вернуть post",
          });
        }
        if(!doc){
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }
        res.json(doc)
      }
    
    );
   
  } catch (error) {
    console.log(error);
    res.json({
      message: "Пост не создался",
    });
  }
};


export const delite = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findByIdAndDelete({
      _id: postId
    }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить post",
        });
        }
        if(!doc){
          return res.status(404).json({
            message: 'Статья не найдена'
          })
        }
        res.json({success:true})
      }
    )
  } catch (error) {
    console.log(error);
    res.json({
      message: "Удалить не удалось",
    });
  }
};
export const update= async(req,res)=>{
  try {
    const postId = req.params.id
  await  PostModel.updateOne({
      _id:postId
    },{
      title: req.body.title,
      text: req.body.text,
      imgUrl: req.body.imgUrl,
      tags: req.body.tags,
      user: req.userId,
    }
    )
    res.json({
      success:true
    })
  } catch (error) {
    console.log(error);
    res.json({
      message: "Обновить  не удалось",
    });
  }
}