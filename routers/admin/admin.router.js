const express=require('express');
//const expressRoute=require('express-route');
// //md5加密
const common =require('../../libs/common.js');
//const mysql=require('mysql');
//连接池
//const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3306});


module.exports=function (){
  var route=express.Router();
  //检查一下登录的状态（登录之后给你一个sess_id）
  route.use(function(req,res,next){
    if(!req.session['admin_id'] && req.url!='/login'){  //检查有没有登陆过，并且有没有访问/login
      res.redirect('/admin/login');                      //重定向到登录页面
    }else{
      next();
    }
  });

  route.get('/',function(req,res){      //登陆成功后，render出去index.ejs页面
    //res.send('登陆成功').end();
    res.render('admin/index.ejs');
  })

  //访问login根目录
  route.use('/login',require('./login')());

  //退出登录
  route.use('/logout',function(req,res){
    //console.log(req.session)
    delete req.session.admin_id
    res.redirect('/admin/login');
  })

  route.use('/userlist',require('./userlist.js')())

  route.use('/category',require('./category.js')());

  route.use('/content',require('./content.js')());

  return route;
}
