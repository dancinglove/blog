const express=require('express');
//const expressRoute=require('express-route');
// //md5加密
const common =require('../../libs/common.js');
const mysql=require('mysql');
//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3306});


module.exports=function (){
  var route=express.Router();


  route.get('/',function(req,res){      //显示下面的content内容部分
    db.query(`SELECT * FROM category`,function(err,category){
      if(err){
        console.log(err);
        res.status(500).send('database error').end();
      }else{
        db.query(`SELECT * FROM content`,function(err,content){
          if(err){
            console.log(err);
            res.status(500).send('database error').end();
          }else{
            res.render('admin/content.ejs',{category,content})
          }
        })

      }
    })

  });
  route.post('/',function(req,res){
    //添加
    console.log(typeof req.body.content)//`INSERT INTO category (id,categoryname) VALUES (0,'${req.body.categoryname}')`
    var content=req.body.content
    var contents=content.replace(/"/g, "&quot;")
    var contentss=contents.replace(/'/g," &#39;")
    var contentsss=contentss.replace(/\n|\r\n/g,"<br>");
    db.query(`INSERT INTO content (id,title,description,content,type) VALUES (0,'${req.body.title}','${req.body.description}','${contentsss}','${req.body.type}')`,function(err,data){
      if(err){
        console.log(err);
        res.status(500).send('database error').end();
      }else{
        console.log('data='+data)
        // db.query(`SELECT * FROM content`,function(err,content){
        //   if(err){
        //     console.log(err);
        //     res.status(500).send('database error').end();
        //   }else{
        //     res.render('admin/content.ejs',{content})
        //   }
        // })
        res.redirect('/admin/content');
      }
    })
  })


  return route;
}
