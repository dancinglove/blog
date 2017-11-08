const express=require('express');
// //md5加密
const common =require('../../libs/common.js');
const mysql=require('mysql');
//   var str=common.md5('123123'+'baksghahsdasdasgjkdasjkhjk')
//   console.log('server='+str)
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3306});
module.exports=function (){
  var route=express.Router();
  route.get('/',function(req,res){     //get是看页面的
    res.render('admin/login.ejs')
  });

  route.post('/',function(req,res){    //这个post是处理数据的
    var user=req.body.user;
    var pass=common.md5(req.body.pass+common.MD5_SUFFIX);console.log()
    //console.log(user,pass,req.body);
    //校验密码用户名对不对
    if(user!=''&&pass!=''){
      db.query(`SELECT * FROM admin WHERE user='${user}'`, function(err,data){
        if(err){
          console.log(err);
          res.status(500).send('database error').end()
        }else{//console.log(JSON.stringify(data))
          if(data.length==0){
            res.status(400).send('not a admin').end()
          }else{
            if(data[0].pass==pass){ //密码校验成功
              //console.log(JSON.stringify(data[0]))
              //加一个admin_id
              req.session['admin_id']=data[0].id;
              res.redirect('/admin');
              //res.send('恭喜你登陆成功')
            }else{
              res.send('密码或者用户名错误');
            }
          }
        }
      })
    }
  });
  return route;
}
