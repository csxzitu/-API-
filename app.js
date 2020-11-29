const express=require('express');
//引入body-parser中间件，用于解析post请求的数据
const bodyParser=require('body-parser');
//引入路由器模块
const router=require('./router/user.js');
//创建web服务器
const app=express();
//设置端口
app.listen(8080);
//托管静态资源到public目录
app.use(express.static('./public'));
//使用body-parser中间件，将post请求的数据解析为对象
app.use(bodyParser.urlencoded({
	extended:false//是否使用拓展的qs模块
}));
//挂载路由器到web服务器
app.use('/user',router);
