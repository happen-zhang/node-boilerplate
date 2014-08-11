# Example #

简单的例子，包含CURD操作。

## 需要替换或增加的文件 ##

把以下文件替换到对应的目录下即可：

```
// 修改数据库配置
/config/config.js

// 导出Post模型
/models/index.js

// Post模型
/models/post.js

// api
/api/index.js

// 导出Post的api
/api/posts.js

// 数据库表结构
/data/schema.js
​
// 数据库预留数据
/data/fixtures/fixtures.json

// 字段验证器
/data/validation/validator.js

// 字段值填充器
/data/autocompletion/autocompleter.js

// 前端控制器
/controllers/frontend.js

// 路由定义
/routes/frontend.js
```

## 运行 ##

文件替换完成之后，可以使用cli操作数据库了，它读取schema中的结构来建表：

```
// 初始化数据库
node database.js --install

// 重置数据库
node database.js --reset

// 删除数据库
node database.js --uninstall
```

然后运行服务器：

```
node index.js
```

## 访问URL ##

```
localhost:3000/findAll

localhost:3000/findById

localhost:3000/add

localhost:3000/edit

localhost:3000/destroy
```
