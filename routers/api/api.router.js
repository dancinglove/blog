const express=require('express');
//const expressRoute=require('express-route');
const mysql=require('mysql');
//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3306});


module.exports=function (){
  var route=express.Router();
  //检查一下登录的状态（登录之后给你一个sess_id）
  route.post('/login',function(req,res,next){
    db.query(`SELECT * FROM user WHERE user='${req.body.username}'`,function(err,data){ //先查询一下有没有这个用户名
      if(err){
        console.log(err);
      }else{
        if(data.length==0){
            res.status(400).send({ok:false,msg:'用户名或密码错误'}).end()
          }else{
            if(data[0].pass==req.body.password){ //密码校验成功
              //加一个admin_id
              req.session['user_id']=data[0].id;
              res.send({ok:true,msg:'恭喜你登陆成功',user_id:req.session['user_id']})
            }else{
              res.send({ok:false,msg:'密码或者用户名错误'});
            }
          }
      }
    })
  })

  //1、用户名密码不能为空，两次输入的密码必须一致，2、数据库检查用户名是否已经被注册
  route.post('/reg',function(req,res,next){
    //console.log(req.body);console.log(req.body.username);
    if(!req.body.username||!req.body.password){
      res.send({ok:false,msg:'用户名和密码不能为空'})
    }else{
      //检查用户名是否已经被注册
      db.query(`SELECT * FROM user WHERE user='${req.body.username}'`,function(err,data){
        if(err){
          console.log(err)
          console.log("error")
        }else{
          console.log(data.length);
          if(data.length==0){
            db.query(`INSERT INTO user VALUES (0,'${req.body.username}','${req.body.password}')`,function(err,data){
              if(err){
                console.log(err);console.log('error');
              }else{
                //resp.send({ok:true,msg:'注册成功'})
                res.send({ok:true,msg:'恭喜你注册成功'});
                //console.log(data);console.log('data')
              }
            })
          }else{
            res.send({ok:false,msg:'该用户名已经被注册'})
          }
        }
      })
    }

  })

  //
  route.use('/logout',function(req,res){
    delete req.session.user_id;
    if(!req.session.user_id){
      res.send({ok:true})
    }
  })

  route.post('/getSessionId',function(req,res){
    //console.log(req.session['user_id']);
    if(req.session['user_id']){
      res.send({user_id:true})
    }else{
      res.send({user_id:false})
    }
  })

  route.use('/getCategoryname',function(req,res){
    //console.log(req.query)
    db.query(`SELECT * FROM category`,function(err,data){
      if(err){
        console.log(err);
        res.status(500).send('database error').end();
      }else{
        res.send({ok:true,msg:data})
      }
    })
  })
//这是index.html请求题目描述的
  route.use('/article',function(req,res){
    db.query(`SELECT * FROM content`,function(err,data){
      if(err){
        console.log(err);
        res.status(500).send('database error').end();
      }else{
        res.send({ok:true,msg:data})
      }
    })
  })

//阅读文章
  route.use('/getArticleContent',function(req,res){
    console.log(req.body)
    db.query(`SELECT * FROM content WHERE id='${req.body.articleid}'`,function(err,data){
      if(err){
        console.log(err);
        res.status(500).send('database error').end();
      }else{
        res.send({ok:true,msg:data})
        // db.query(`SELECT * FROM custom WHERE articleid='${req.body.article}'`,function(err,updatedata){      //更新
        //   if(err){
        //     console.log(err);
        //     res.status(500).send('database error').end();//console.log(pushedData)
        //   }else{
        //     res.send({ok:true,msg:updatedata})
        //   }
        // })
      }
    })
  })
  //添加评论模块
  route.use("/custom",function(req,res){  //每一篇文章都有一个数组，所有需要传入文章的id、user、时间
    console.log(req.body)
    db.query(`INSERT INTO custom VALUES (0,'${req.body.articleid}','${req.body.custom}','${req.body.user}','${req.body.time}')`,function(err,data){  //添加
      if(err){
        console.log(err);
        res.status(500).send('database error').end();
      }else{
        db.query(`SELECT * FROM custom WHERE articleid='${req.body.article}'`,function(err,updatedata){      //更新
          if(err){
            console.log(err);
            res.status(500).send('database error').end();//console.log(pushedData)
          }else{
            res.send({ok:true,msg:updatedata})
          }
        })
      }
    })
  })

  //获得评论
  route.use("/getcustom",function(req,res){
    console.log(req.body)
    db.query(`SELECT * FROM custom WHERE articleid='${req.body.articleid}'`,function(err,updatedata){      //更新
      if(err){
        console.log(err);
        res.status(500).send('database error').end();//console.log(pushedData)
      }else{
        res.send({ok:true,msg:updatedata});     console.log(updatedata)
      }
    })
  })
  return route;
}
