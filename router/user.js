const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//console.log(pool);
//创建路由器对象
const router=express.Router();
//1.添加路由用于用户登录
router.post('/login',(req,res)=>{
	// 1.1获取post请求的数据
	let obj=req.body;
	console.log(obj);
	// 1.2验证各项数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	// 1.3执行SQL命令
	pool.query('select * from xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
		if(err) throw err;
		console.log(result);
		//如果是空数组则查询失败,登录不成功
		if(result.length===0){
			res.send({code:301,msg:'login err'});
		}else{
			res.send({code:302,msg:'login suc'});
		}
	});
	//res.send('登录成功');
});
//2.添加路由用于查询用户列表
router.get('/list',(req,res)=>{
	// 2.1获取查询字符串的数据
	let obj=req.query;
	console.log(obj);
	// 2.2验证各项的数据，如果为空，默认页码为1每页的大小为4
	if(!obj.pon){
		obj.pon=1;
	}
	if(!obj.pageSize){
		obj.pageSize=4;
	}
	// 2.3计算开始查询的值 和每页数据大小的数值型
	let start=(obj.pon-1)*obj.pageSize;
	let count=parseInt(obj.pageSize);
	// 2.4执行SQL命令
	pool.query('select * from xz_user limit ?,?',[start,count],(err,result)=>{
		if(err) throw err;
		console.log(result);
		//把执行的结果输出
		if(result.length){
			res.send(result);
		}
	});
	//res.send('查询结束');
});
//3.添加路由用于修改用户数据
router.post('/update',(req,res)=>{
	// 3.1获取post请求的数据
	let obj=req.body;
	console.log(obj);
	// 3.2验证各项数据是否为空，遍历对象的方法
	// 初始化值，用于保存状态码
	var i=400;
	for(var k in obj){
		i++;
		if(!obj[k]){
			res.send({code:i,msg:k+' required'});
			return;
		}
	}
	// 3.3执行SQL命令
	pool.query('update xz_user set ? where uid=?',[obj,obj.uid],(err,result)=>{
		if(err) throw err;
		console.log(result);
		if(result.affectedRows){
			res.send({code:200,msg:'update suc'});
		}else{
			res.send({code:401,msg:'update err'});
		}
	});
	//res.send('修改成功');
});
//4.添加路由用于删除用户
router.get('/delete',(req,res)=>{
	// 4.1获取查询字符串的数据
	let obj=req.query;
	console.log(obj);
	// 4.2验证数据是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
	}
	// 4.3执行SQL命令
	pool.query('delete from xz_user where uid=?',[obj.uid],(err,result)=>{
		if(err) throw err;
		console.log(result);
		if(result.affectedRows===0){
			res.send({code:301,msg:'delete err'});
		}else{
			res.send({code:200,msg:'delete suc'});
		}
	});
	//res.send('删除成功');
});

//导出路由器对象
module.exports=router;