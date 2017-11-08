const express=require('express');
//const expressRoute=require('express-route');
// //md5加密
const common =require('../../libs/common.js');
const mysql=require('mysql');
//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3306});


module.exports=function (){
  var route=express.Router();

  //分页显示数据
  route.use('/',function(req,res){
    var limit=3;  //每一页显示3条
     //page='';   //默认显示第一页
    var page=Number(req.query.page)||1;
    console.log('page'+page);
    console.log(typeof page);
    db.query(`SELECT * FROM user LIMIT ${(page-1)*limit},${limit} `,function(err,userlist){
      if(err){
        console.log(err);
        res.status(500).send('database error userlist').end();
      }else{
        //console.log(userlist)
        db.query(`SELECT count(*) FROM user`,function(err,usercount){
          if(err){
            console.log(err);
            res.status(500).send('database error userlist').end();
          }else{
            //console.log(eval('('+usercount+')'))
            //console.log('222=='+usercount.RowDataPacket);console.log(typeof count)
            // console.log(count[0].count);console.log(typeof count[0].count)
            // console.log(count.count);console.log(typeof count.count)
            // var usercount=usercount[0].count;
            var propertys = Object.getOwnPropertyNames(usercount[0]);console.log(propertys);console.log(typeof propertys)
            //var propertys1 = Object.getOwnPropertyNames(usercount[1]);console.log(propertys1);console.log(typeof propertys1)
            console.log(usercount[0]);console.log(typeof usercount)
            //console.log(JSON.parse(usercount)) ;console.log(typeof JSON.parse(usercount))
            // console.log(  JSON.parse( JSON.stringify(usercount[0].count())  )  ) ;  console.log(typeof JSON.parse( JSON.stringify(usercount[0])  ))
            //   console.log(  JSON.parse( JSON.stringify(usercount[0].count  ))  ) ;
            //var propertys = Object.getOwnPropertyNames(results[0])
            // var temp=new String(usercount[0].count)
            // console.log(temp)
            res.render('admin/userlist.ejs',{userlist,limit,usercount,page});
          }
        })

      }
    })

  })
  return route;
}
