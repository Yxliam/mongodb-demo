//使用koa2
const Koa = require('koa');
//路径处理
var path = require('path');
//接收post请求的数据处理
const bodyParser = require('koa-bodyparser');
//路由处理
const Router = require('koa-router');
//加载模板
var views = require('koa-views')

//使用之后就可以直接使用了
const app = new Koa();
const router = new Router();

//配置mongodb数据库相关的内容
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo');

//创建模型
var User = mongoose.model('User',{username:String,password:String});



// 配置服务端模板渲染引擎中间件 使用ejs模板
app.use(views(path.join(__dirname, './views'), {
   map: { html:'ejs' }
}))

//数据处理模块
app.use(bodyParser())

//首页
router.get('/',async (ctx,next)=>{
	ctx.body = 'hello'
})
// '/login' get请求去到login页面
router.get('/login',async (ctx,next)=>{
    await ctx.render('login')
})
//注册页
router.get('/register',async (ctx,next)=>{
	await ctx.render('register')
})

//注册传过来的数据
router.post('/register',async (ctx,next)=>{
		const{username,password} = ctx.request.body
		//添加数据
		if(!username || password){
			  ctx.body = {
		    	code:1,
		    	msg:'用户名或者密码不能为空'
		    }
		}
		var user = new User({ username: username, password:password });
		await user.save(function(err, res) {
		    // 如果错误，打印错误信息
		    if (err){
		    	ctx.body = {
		    		code:1,
		    		msg:'err'
		    	}
		    }
		    
		    ctx.body = {
		    	code:2,
		    	msg:'ok'
		    }
		    
		})
})
//数据查询
router.post('/login',async (ctx,next)=>{
	const{username,password} = ctx.request.body
	User.
		  find({ username: username }).
		  where('password').equals(password).
		  exec((err,res)=>{
		  	if(err){
		  		console.log(err);
		  	}else{
		  		if(res){
		  			ctx.body = {
		  				code:2,
		  				data:{
		  					username:res[0].username
		  				},
		  				msg:'ok'
		  			}
		  		}else{
		  			ctx.body = {
		  				code:1,
		  				msg:'err'
		  			}
		  		}
		  	}
		  });    

})

//要使用router.routes()路由才其效果
app.use(router.routes())
app.listen(3000)