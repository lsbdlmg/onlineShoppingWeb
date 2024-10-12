
const express = require('express');
const sql = require('mssql');
const app = express();
const nodemailer = require('nodemailer');
const config = require('./dbConfig');
const multer = require('multer');
const path = require('path');
// 解析 JSON 请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//--------------- 尝试连接数据库---------------------
sql.connect(config).then(pool => {
    console.log('数据库连接池已建立');
}).catch(err => {
    console.error('数据库连接失败:', err);
});


// (async () => {
//     try {
//         // 创建连接池
//         const pool = await sql.connect(config);
//         console.log('Connected to SQL Server');

//         // 关闭连接池
//         await pool.close();
//         console.log('Connection pool cleared');
//     } catch (err) {
//         console.error('Failed to clear connection pool:', err);
//     }
// })();
async function testConnection() {
    try {

        await sql.connect(config);
        console.log('连接成功！');
    } catch (err) {
        console.error('连接失败:', err);
    }
}
testConnection();
// 使用 Express 提供前端静态文件
app.use(express.static('public'));
//--------------------------------------------------------
// 提供静态文件夹用于访问上传的图片
app.use('/images', express.static('public/images/'));
// 设置存储位置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); // 图片保存到 images 文件夹
    },
    filename: function (req, file, cb) {
        // 使用原始文件名保存
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// 处理图片上传
app.post('/uploadimage', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({
            success: true,
            filePath: `/images/${req.file.filename}` // 返回文件的路径
        });
    } else {
        res.json({
            success: false,
            message: '图片上传失败'
        });
    }
});



// ------------------导入商品信息或者用户信息---------------------
app.get('/products', async (req, res) => {
    try {
        // 连接到 SQL Server
        await sql.connect(config);

        // 查询 product 表
        const resultproducts = await sql.query('SELECT id, pname, price,image_url FROM product');

        // 将查询结果发送到前端
        res.json(resultproducts.recordset);
    } catch (err) {
        console.error('查询错误:', err);
        res.status(500).send('数据库查询失败');
    }
});

//-------------------------------------------------------



//---------------用户注册时-----------------------------------
//用户注册插入
app.post('/Userregister', (req, res) => {
    const { Emailtext, Password, Uname } = req.body;
    const insertRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = `INSERT INTO useraccount (email, pwd, umoney, uname) VALUES (@email, @pwd, @umoney, @uname)`;

        insertRequest.input('email', sql.VarChar, Emailtext);
        insertRequest.input('pwd', sql.VarChar, Password);
        insertRequest.input('umoney', sql.Int, 10000); // 假设初始余额为 10000
        insertRequest.input('uname', sql.VarChar, Uname);

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('插入数据失败:', err);
                return res.status(500).json({ success: false, message: '插入数据失败' });
            }

            // 检查是否插入成功
            if (result.rowsAffected[0] > 0) {
                return res.json({
                    success: true,
                    message: '注册成功'
                });
            } else {
                return res.json({ success: false, message: '注册失败' });
            }
        });
    });
});

//用户注册后创建一个该用户的购物车表
app.post('/createUserPaycart', (req, res) => {
    const { Emailtext } = req.body;
    const createTablerequest = new sql.Request();

    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        // 创建一个新的表格，表名为用户邮箱加上 "paycart"
        const tableName = `[paycart_${Emailtext}]`; // 使用方括号来处理动态表名，避免 SQL 注入风险
        const createTableQuery = ` CREATE TABLE ${tableName} (
                    id VARCHAR(50) PRIMARY KEY,
                    pname VARCHAR(100) not null,
                    price FLOAT not null,
                    image_url VARCHAR(255) not null,
                    count int not null,
                    paycartcount int not null
                )`

        // 执行创建表格的查询 
        createTablerequest.query(createTableQuery, (err) => {
            if (err) {
                console.error('创建该用户购物车表失败:', err);
                return res.json({ success: false, message: '创建该用户购物车表失败' });
            }

            return res.json({
                success: true,
                message: '购物车表创建成功'
            })


        });
    });

});
//用户注册后创建一个该用户的历史订单表
app.post('/createUserOrder', (req, res) => {
    const { Emailtext } = req.body;
    const createTablerequest = new sql.Request();

    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        // 创建一个新的表格，表名为用户邮箱加上 "Order"
        const tableName = `[Order_${Emailtext}]`; // 使用方括号来处理动态表名，避免 SQL 注入风险
        const createTableQuery = ` CREATE TABLE ${tableName} (
                    OrderId VARCHAR(255) NOT NULL PRIMARY KEY,
                    id VARCHAR(50),
                    pname VARCHAR(100),
                    price FLOAT,
                    image_url VARCHAR(255),
                    count int,
                    status VARCHAR(50)
                )`

        // 执行创建表格的查询 
        createTablerequest.query(createTableQuery, (err) => {
            if (err) {
                console.error('创建该用户历史订单表失败:', err);
                return res.status(500).json({ success: false, message: '创建该用户历史订单表失败' });
            }
            return res.json({
                success: true,
                message: '历史订单表创建成功'
            })
        });
    });

});
//------------------------------------------------------------



//---------------用户or管理员登陆检测--------------------------------
app.post('/Userlogin', (req, res) => {
    const { Emailtext, Password } = req.body;

    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        const query = `SELECT * FROM useraccount WHERE email = @email AND pwd = @pwd`;
        const request = new sql.Request();
        request.input('email', sql.VarChar, Emailtext);
        request.input('pwd', sql.VarChar, Password);

        request.query(query, (err, result) => {
            if (err) {
                console.error('查询失败:', err);
                return res.status(500).json({ success: false, message: '查询失败' });
            }
            //数据库返回来的符合条件的条数大于0的话就说明成功
            if (result.recordset.length > 0) {
                // 匹配到的用户数据
                const userData = result.recordset[0];

                // 返回成功信息和匹配到的用户数据
                return res.json({
                    success: true,
                    message: '登录成功',
                    data: userData
                });
            } else {
                // 用户名或密码不匹配
                return res.json({ success: false, message: '邮箱或密码错误' });
            }
        });
    });
});
app.post('/Managerlogin', (req, res) => {
    const { Emailtext, Password } = req.body;

    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        const query = `SELECT * FROM manageraccount WHERE email = @email AND pwd = @pwd`;
        const request = new sql.Request();
        request.input('email', sql.VarChar, Emailtext);
        request.input('pwd', sql.VarChar, Password);

        request.query(query, (err, result) => {
            if (err) {
                console.error('查询失败:', err);
                return res.status(500).json({ success: false, message: '查询失败' });
            }
            //数据库返回来的符合条件的条数大于0的话就说明成功
            if (result.recordset.length > 0) {
                // 匹配到的用户数据
                const userData = result.recordset[0];

                // 返回成功信息和匹配到的用户数据
                return res.json({
                    success: true,
                    message: '登录成功',
                    data: userData
                });
            } else {
                // 用户名或密码不匹配
                return res.json({ success: false, message: '邮箱或密码错误' });
            }
        });
    });
});
//----------------------------------------------------------





//---------------以下是给注册邮箱发送验证码----------------------------
app.post('/isEmailUsed', (req, res) => {
    const { Emailtext } = req.body;

    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        const query = `SELECT * FROM useraccount WHERE email = @email `;
        const request = new sql.Request();
        request.input('email', sql.VarChar, Emailtext);

        request.query(query, (err, result) => {
            if (err) {
                console.error('查询失败:', err);
                return res.status(500).json({ success: false, message: '查询失败' });
            }
            //数据库返回来的符合条件的条数大于0的话就说明成功
            if (result.recordset.length > 0) {
                // 匹配到的用户数据

                // 返回成功信息和匹配到的用户数据
                return res.json({
                    success: true,
                    message: '邮箱已被使用',

                });
            } else {
                // 用户名或密码不匹配
                return res.json({ success: false, message: '未使用该邮箱' });
            }
        });
    });
});

// 创建邮件发送者
let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',  // QQ 邮箱的 SMTP 地址
    port: 465,            // QQ 邮箱的 SMTP 端口（SSL 端口）
    secure: true,         // 使用 SSL
    auth: {
        user: '2501995333@qq.com',   // 你的 QQ 邮箱地址
        pass: 'zvjkwsloxgtwdige',  // QQ 邮箱的授权码
    }
});

// 生成6位随机验证码
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 生成6位数字验证码
}

// 发送验证码邮件的函数
function sendVerificationEmail(recipientEmail, code) {
    let mailOptions = {
        from: '2501995333@qq.com',  // 发送者邮箱
        to: recipientEmail,         // 接收者邮箱
        subject: '注册验证码',        // 邮件标题
        text: `您的验证码是: ${code}`, // 邮件内容
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('邮件发送失败：', error);
        }
        console.log('验证码邮件已发送: ' + `${recipientEmail}` + info.response);
    });
}
//-----------------------------------------------------------------


app.post('/send-verification-code', (req, res) => {
    const userEmail = req.body.email;
    const verificationCode = generateVerificationCode();  // 生成验证码

    // 发送验证码到用户邮箱
    sendVerificationEmail(userEmail, verificationCode);

    // 返回响应
    res.json({ success: true, verificationCode: verificationCode });
});
//----------------------------------------------------------------------




//用户登录之后查询购物车信息
app.post('/paycartReadfromDatabase', (req, res) => {
    const { userEmail } = req.body;
    const insertRequest = new sql.Request()
    const tablename = `[paycart_${userEmail}]`
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = `SELECT *FROM ${tablename} `;

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('查询购物车表数据失败:', err);
                return res.status(500).json({ success: false, message: '查询购物车表数据失败' });
            }

            // 检查是否插入成功
            if (result.recordset.length > 0) {
                return res.json({
                    success: true,
                    products: result.recordset
                });
            } else {
                return res.json({ success: false, message: '购物车空空如也' });
            }
        });
    });
});


//用户点击刷新页面后更新购物车
app.post('/productupdatePaycart', (req, res) => {
    const { insertType } = req.body;
    const insertRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = insertType

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('更新购物车数据失败:', err);
                return res.status(500).json({ success: false, message: '更新购物车数据失败' });
            }

            // 检查是否插入成功
            if (result.rowsAffected[0] >= 0) {
                return res.json({
                    success: true,
                    message: '更新购物车成功'
                });
            } else {
                return res.json({ success: false, message: '更新购物车失败' });
            }
        });
    });
});
//用户点击购买后插入历史订单表并且修改用户的余额
app.post('/productinsertOrder', (req, res) => {
    const { insertType } = req.body;
    const insertRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = insertType

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('插入历史订单表失败:', err);
                return res.status(500).json({ success: false, message: '插入历史订单表失败' });
            }

            // 检查是否插入成功
            if (result.rowsAffected[0] >= 0) {
                return res.json({
                    success: true,
                    message: '购买成功'
                });
            } else {
                return res.json({ success: false, message: '购买失败' });
            }
        });
    });
});


//用户登录后查询历史订单信息
app.post('/orderReadfromDatabase', (req, res) => {
    const { userEmail } = req.body;
    const insertRequest = new sql.Request()
    const tablename = `[order_${userEmail}]`
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = `SELECT *FROM ${tablename} `;

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('查询历史订单表数据失败:', err);
                return res.status(500).json({ success: false, message: '查询历史订单表数据失败' });
            }

            // 检查是否读取成功
            if (result.recordset.length > 0) {
                return res.json({
                    success: true,
                    products: result.recordset
                });
            } else {
                return res.json({ success: false, message: '历史订单空空如也' });
            }
        });
    });
});

//用户点击刷新页面后更新历史订单
app.post('/productupdateOrder', (req, res) => {
    const { insertType } = req.body;
    const insertRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = insertType

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('更新历史订单数据失败:', err);
                return res.status(500).json({ success: false, message: '更新历史订单数据失败' });
            }

            // 检查是否插入成功
            if (result.rowsAffected[0] >= 0) {
                return res.json({
                    success: true,
                    message: '更新历史订单成功'
                });
            } else {
                return res.json({ success: false, message: '更新历史订单失败' });
            }
        });
    });
});


//-----------------------------------------------
//管理员点击更新商品信息
app.post('/updateProductIndatabase', (req, res) => {
    const { insertType } = req.body;
    const insertRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }
        // 正确的 INSERT INTO 查询，列出表中的字段名称
        const insertquery = insertType

        insertRequest.query(insertquery, (err, result) => {
            if (err) {
                console.error('更新商品数据失败:', err);
                return res.status(500).json({ success: false, message: '更新商品数据失败' });
            }

            // 检查是否插入成功
            if (result.rowsAffected[0] > 0) {
                return res.json({
                    success: true,
                    message: '更新商品成功'
                });
            } else {
                return res.json({ success: false, message: '更新商品失败' });
            }
        });
    });
});

//管理员点击更新用户信息
app.post('/updateUserIndatabase', (req, res) => {
    const { updateType } = req.body;
    const updateRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        updateRequest.query(updateType, (err, result) => {
            if (err) {
                console.error('更新用户数据失败:', err);
                return res.status(500).json({ success: false, message: '更新用户数据失败' });
            }

            // 检查是否成功
            if (result.rowsAffected[0] > 0) {
                return res.json({
                    success: true,
                    message: '更新用户成功'
                });
            } else {
                return res.json({ success: false, message: '更新用户失败' });
            }
        });
    });
});

//管理员查询用户
app.post('/Searchuseraccount', (req, res) => {
    let selectquery = 'select email,uname,umoney from useraccount'
    const selectRequest = new sql.Request()
    selectRequest.query(selectquery, (err, result) => {
        if (err) {
            console.error('查询数据失败:', err);
            return res.status(500).json({ success: false, message: '查询数据失败' });
        }
        if (result.recordset.length > 0) {
            // 匹配到的用户数据
            const userData = result.recordset;

            // 返回成功信息和匹配到的用户数据
            return res.json({
                success: true,
                message: '查询成功',
                data: userData
            });
        } else {
            return res.json({ success: false, message: '查询失败' });
        }
    });
})
//管理员点击查询用户历史订单
app.post('/UserOrderIndatabase', (req, res) => {
    const { searchType } = req.body;
    const searchRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        searchRequest.query(searchType, (err, result) => {
            if (err) {
                console.error('管理员用户历史订单数据失败:', err);
                return res.status(500).json({ success: false, message: '管理员用户历史订单数据失败' });
            }

            // 检查是否成功
            if (result.recordset.length > 0) {
                const userOrder = result.recordset;
                return res.json({
                    success: true,
                    data: userOrder,
                    message: '管理员用户历史订单数据成功'
                });
            } else {
                return res.json({ success: false, message: '无历史订单' });
            }
        });
    });
});
//管理员点击发货
app.post('/updateUserOrderIndatabase', (req, res) => {
    const { updateType } = req.body;
    const updateRequest = new sql.Request()
    // 使用 MSSQL 连接数据库并查询用户
    sql.connect(config, err => {
        if (err) {
            console.error('数据库连接失败:', err);
            return res.status(500).json({ success: false, message: '数据库连接失败' });
        }

        updateRequest.query(updateType, (err, result) => {
            if (err) {
                console.error('更新用户历史订单数据失败:', err);
                return res.status(500).json({ success: false, message: '更新用户历史订单数据失败' });
            }

            // 检查是否成功
            if (result.rowsAffected[0] >= 0) {
                return res.json({
                    success: true,
                    message: '更新用户历史订单成功'
                });
            } else {
                return res.json({ success: false, message: '更新用户历史订单失败' });
            }
        });
    });
});

// 发送订单邮件的函数
function sendOrderEmail(recipientEmail, message) {
    let mailOptions = {
        from: '2501995333@qq.com',  // 发送者邮箱
        to: recipientEmail,         // 接收者邮箱
        subject: '订单消息',        // 邮件标题
        text: `您的${message}已发货 `, // 邮件内容
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('订单消息邮件发送失败：', error);
        }
        console.log('订单消息邮件已发送: ' + `${recipientEmail}` + info.response);
    });
}
//-----------------------------------------------------------------

//管理员发货发送邮件
app.post('/sendOrderToemail', (req, res) => {
    const userEmail = req.body.email;
    const message = req.body.message;
    // 发送邮件到用户邮箱
    sendOrderEmail(userEmail, message);

    // 返回响应
    res.json({ success: true });
});




// 服务器监听端口
app.listen(80, () => {
    console.log('服务器正在运行，访问 http://8.134.159.233');
});


