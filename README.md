功能：共享图书馆  
为读书爱好者们提供简易借书平台，每位用户拥有自己的个人主页，用于展示拥有的所有图书，图书可通过用户自助上传并修改图书状态（已借出/可借）。用户有借书需求可在首页查看共享图书馆的图书库藏及其简略信息，也可点击进入详情页查看图书具体信息，进入图书拥有者主页也可以查看，小程序首页或个人主页的图书均可跳转详情
技术选型：
	小程序前端流行框架Taro（类似react的语法），可将一份代码转换为其他端
	云开发：小程序提供API可在页面操作数据库
实现：
    通过云函数实现豆瓣图书爬虫，由图书isbn号获取图书相关信息
    通过云函数修改数据库中他人创建的信息，用于显示图书浏览次数
	app.js:
		config配置tabBar；index，me
    index.js:首页
		轮播图：Swiper SwiperItem
			按浏览次数由高到低排列轮播图
		图书列表：Atcard+跳转详情页
		分页功能：
	me.js:
        未登录界面：
            头像替代图标
            联系方式输入框
            登陆按钮
                登陆：button getUserInfo+云函数获取openid
                    本地缓存userInfo（setStorageSync）
        已登录界面：
            头像，微信名
            扫码添加图书：
                button+onClick绑定函数采用wx.scanCode返回res.result为图书的isbn码；
                云函数爬虫返回相应图书的信息
                信息中添加userInfo再存入云数据库（包含openid及电话👌
            个人图书库：
            客服：button opentype='contact'
	
	detail.js：图书详情页
		图片、图书所属类型、评论
		去持有者首页
	home.js：持有人首页
		顶部：持有人信息
		所有图书，且带有详情跳转功能
        功能不同处：
            书籍持有人：可修改否借阅
            借阅人：只可查看能否借阅
