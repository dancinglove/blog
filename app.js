const express=require('express');
//const expressStatic=require('express-static');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const consolidate=require('consolidate');
const mysql=require('mysql');
const expressRoute=require('express-route');
//const path=require('path')

var server=express();
server.listen(8086);
//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'blog',port:3308});
//1.解析cookie
server.use(cookieParser('sdfasl43kjoifguokn4lkhoifo4k3'));
//2.使用session
var keysarr=[];
for(var i=0;i<100000;i++){
  keysarr.push('keys_'+Math.random());
}
server.use(cookieSession({name: 'sess_id', keys: keysarr, maxAge: 15*60*1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));   //post数据
server.use(multer({dest: './static/upload'}).any());    //post文件

//4.static数据
//server.use(expressStatic('www')); //文件处理进入www文件夹下
// server.use(express.static('./static'));
server.use(express.static('./public'));
//server.use('/static',express.static(__dirname+'/static'));

//4.配置模板引擎
  //哪种模板引擎
  server.engine('html', consolidate.ejs);
  //输出什么东西
  server.set('view engine', 'html');
  //模板文件放在哪儿
  server.set('views', __dirname + '/views');
//接收用户请求B
//route的配置
  //管理员界面部分
  server.use('/admin',require('./routers/admin/admin.router.js')())       //凡是访问article的都找route1去

  //访问api接口的
  server.use('/api',require('./routers/api/api.router.js')())       //访问api接口的都找route2去
  //访问根目录的时候
  //server.use('/',require('./routers/web/web.router.js')())
