const express=require('express');
//const expressRoute=require('express-route');
// //md5加密
//const common =require('../../libs/common.js');
const mysql=require('mysql');
//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3306});


module.exports=function (){
  var route=express.Router();
  route.get('/',function(req,res){
    var limit=3;  //每一页显示3条
     //page='';   //默认显示第一页
    var page=Number(req.query.page)||1;
    switch(req.query.act){
      case 'mod':
      db.query(`SELECT * FROM category WHERE ID='${req.query.id}'`,function(err,moddata){
        if(err){
          console.log(err);
          res.status(500).send('database error').end();
        }else if(moddata.length==0){//成功的时候
          res.status(404).send('database bot found').end();
        }else{
          db.query(`SELECT * FROM category`,function(err,categorylist){
            if(err){
              console.log(err);
            }else{
              res.render('admin/category.ejs',{categorylist, limit,page,moddata:moddata[0]})
            }
          });
        }
      });
        break;

      case 'del':
        console.log('dianji 删除');
        db.query(`DELETE FROM category WHERE ID='${req.query.id}'`,function(err,data){
          if(err){
            console.log(err);
            res.status(500).send('database error del').end();
          }else{
            res.redirect('/admin/category');      //删除成功后重定向到category页面
          }
        })
        break;
      default:

        db.query(`SELECT * FROM category`, function( err , categorylist){
          if(err){
            console.log(err);
            res.status(500).send('database error userlist').end();
          }else{
            console.log(categorylist);
            res.render('admin/category.ejs',{categorylist,limit,page})
          }
        })
        break;
    }
  })
  route.post('/',function(req,res){   //添加数据
    //console.log(req.body)
    if(!req.body.categoryname){
      res.status(400).send('arg error').end();
    }else{
      if(req.body.mod_id){//修改 UPDATE banner SET title='5555',description='66666',href='888888' WHERE id='12'
        console.log('进来了'+req.body.categoryname)
        db.query(` UPDATE category SET categoryname='${req.body.categoryname}' WHERE id='${req.body.mod_id}' `,function(err,data){
          if(err){
            console.log(err);
          }else{
            console.log()
            res.redirect('/admin/category');
          }
        })
      }else{                      //添加
        db.query(`INSERT INTO category (id,categoryname) VALUES (0,'${req.body.categoryname}')`,function(err,data){
          if(err){
            console.log(err);
          }else{//console.log('操作成功');
            res.redirect('/admin/category');
          }
        })
      }

    }

  })


  return route;
}
