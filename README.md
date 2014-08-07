# node-boilerplate #

Node.js Web开发基础框架模板。

## 部署 ##

### 克隆模板到本地 ###

```
git clone https://github.com/happen-zhang/node-boilerplate.git myapp
```

### 安装 ###

```
cd myapp

npm install
```

### 修改配置 ###

`/config/config.js`文件进行配置

### 运行 ###

```
// 开发环境
NODE_ENV=development node index.js

// 生产环境
NODE_ENV=production node index.js
```

## ORM操作 ##

我们的模板使用的ORM是基于[bookshelf](http://bookshelfjs.org/)。ORM系统的核心文件为`/models/base.js`，它封装了最基本的ORM操作（CURD），还设置了模型对象在数据库存取过程中的hook（creating、saving和saved等），方便我们做一些数据验证操作。同时，它内部还保存了几个与数据安全相关的方法，如`permittedAttributes`，保证我们的数据库操作的正确性。接下来我们来看看如何配置一个简单易用强大的ORM系统吧。

### 1. 配置schema ###

每个模型都需要配置一个对应的`schema`，它需要和数据库表的字段名称相同，至于类型和其他属性可以不同。`schema`用于检验模型的字段值是否正确和创建数据表。我们可以在`/data/schema.js`文件下配置我们模型对应的`schema`。下面来配置一个简单的`schema`：

```Javascript
// /data/schema.js

var db = {
    // 需要和模型中的tableName属性的值相同
    user: {
        id: {
            type: 'integer',
            nullable: false
        },
        name: {
            type: 'string',
            maxlenth: 32,
            validators: {
                'isEmpty': {
                    condition: false,
                    errorInfo: 'Name must be not empty.'
                },

                'validName': {
                    condition: true,
                    errorInfo: 'Invalid name.'
                }
            }
        },
        age: {
            type: 'integer',
            nullable: false
        },
        gender: {
            type: 'string',
            maxlength: 20,
            validators: {
                'isIn': {
                    condition: ['male', 'famale'],
                    errorInfo: 'Invalid gender.',
                    validateOn: 'update'
                }
            }
        },
        created_at: {
            type: 'integer',
            autocompleteOn: {
                'timestamp': {
                    autocompleteOn: 'add'
                }
            }
        },
        updated_at: {
            type: 'integer',
            autocompleteOn: {
                'timestamp': { }
            }
        },
    }
};

module.exports.tables = db;
```

在上面的例子中，我们配置了一个`schema`，分别指定了它的`id`，`name`，`age`和`gender`属性。这些属性都拥有`type`属性，我们还为`name`，`gender`属性配置了`validators`。

在schema属性中可以进行配置的键值：

```
type: 字段的类型，可取值有`integer`，`string`，`double`，`bool`，`text`和`dateTime`；

unsigned：无符整型；

primary：true或者false，主键；

maxlength：字符的最大长度；

fieldtype：域类型，如`medium`；

nullable：true或者false，当为false时，保存到数据库时，会检验该字段对应的值是否为空；

unique：true或者false，唯一性；

defaultTo: 值可以为`integer`，`string`，`double`，`bool`和`text`；

references：外键关联，如`user.id`，则可以关联到`user`的`id`字段；

validators: {
    condition：// 验证预期出现的结果，可以为任何值，方便自定义validator
    errorInfo：// 验证失败后的提示信息
    validateOn：// 验证属性值的时机，分为add和update
}

autocompletions: {
    arguments：// 填充完成属性值所需要的参数
    autocompleteOn：// 填充属性值的时机，分为add或update
}
```

关于`validator`的自定义，后面有说明。

### 2. 配置model ###

我们的model文件都放在`/models`目录下。现在我们来实现一个简单的model：

```Javascript
var baseBookshelf = require('./base');

var User = null;
var Users = null;

User = baseBookshelf.Model.extend({
    tableName: 'user',
}, {
    findAll: function(options) {
        return baseBookshelf.Model.findAll.call(this, options);
    },

    findOne: function(data, options) {
        return baseBookshelf.Model.findOne.call(this, data, options);
    },

    add: function(data, options) {
        var self = this;

        return baseBookshelf.Model.add.call(this, data, options).then(function (post) {
            return self.findOne({id: post.id}, options);
        });
    },

    edit: function(data, options) {
        return baseBookshelf.Model.edit.call(this, data, options);
    },

    destroy: function(options) {
        return baseBookshelf.Model.destroy.call(this, options);
    }
});

Users = baseBookshelf.Collection.extend({
    model: User
});

module.exports = {
    User: baseBookshelf.model('User', User),
    Users: baseBookshelf.collection('Users', Users)
};
```

可以看到，我们定义了一个`user`模型，它继承了`base`模型，这样就可以简单地实现CURD操作了。

### 3. 使用model ###

Ok，完成了`schema`和`model`的配置后，我们就可以使用`user`模型进行开发了：

```Javascript
var User = require('../models').User;

// findAll
User.findAll().then(function(users) {
    // to do sth...
});

// add
User.add({name: 'test', age: 18, gender: 'man'}).then(function(user) {
    // to do sth...
}).otherwise(function(errors) {
    // to do ths...
});
```

## ORM「自动验证」和「自动完成」 ##

我们可以在`schema`中为某个模型设置`validations`和`autocompletions`属性。

### 自动验证 ###

`schema`中属性的`validations`属性中可以设置的验证函数默认只有[validator](https://github.com/chriso/validator.js)提供的验证函数，我们也可以自定义一些函数，这些函数定义在`/data/validation/validator.js`文件中，而且函数必须返回`true`或者`false`。

```Javascript
// /data/validation/validator.js

var validator = require('validator');
var _ = require('lodash');

validator.extend('notContains', function (str, badString) {
    return !_.contains(str, badString);
});

module.exports = validator;
```

定义完成后就可以在`schema`中进行设置该验证器了。

> 在scheme中的validations里，condition属性是必须的。如果condition设成true或者false时，则系统会将其作为验证通过的条件。如果condition设置成不是boolean值，则会把其值作为参数传递给验证函数。

### 自动完成 ###

`schema`中属性的`autocompletions`属性中可以设置的填充函数需要定义在`/data/autocompletion/autocompleter.js`文件中，需要确保函数要有一个字符串类型的返回值。

```Javascript
// /data/autocompletion/autocompleter.js

var autocompleter = null;

autocompleter = {

    timestamp: function(value) {
        return new Date().getTime() / 1000;
    },

    concat: function(value, subfix) {
        return value + subfix;
    }
};

module.exports = autocompleter;
```

> 在scheme中的autocompletions里，arguments提供的值将作为参数传递给填充函数，arguments属性不是必须设置，只需确保函数要有一个字符串类型的返回值即可。

## 第三方库 ##

* express：3.x版本；

* knex、bookshelf：ORM工具；

* when：promise支持；

* handlerbars：视图模板支持；

* mocha：测试框架；

* gulp：自动任务构建工具；

* lodash：js扩展；

## TODO ##

* [x] 自动完成

* [x] 补全关于model validator的文档

* [ ] schema生成数据表，提供cli

* [ ] 做成lib，简化操作

## License ##

(The MIT License)

Copyright (c) 2014 happen-zhang <zhanghaipeng404@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
