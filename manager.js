//修改商品列表的显示
function managerShowproduct() {
    const getall = document.querySelector('body')
    const getpaycartbuttonP = getall.querySelectorAll('.paycartbutton')
    //将原本是购物车的位置更改为修改按钮
    getpaycartbuttonP.forEach(element => {
        //添加一个上传图片的input但是不显示出来
        const getDadbox = element.closest('.product')
        const imageUploadinput = document.createElement('input')
        imageUploadinput.type = "file"
        imageUploadinput.accept = "image/*"
        imageUploadinput.style = "display:none;"
        imageUploadinput.classList.add('imageUploadinput')
        getDadbox.appendChild(imageUploadinput)
        //添加一个上传图片的按钮，与上面那个input联动
        const imageUploadbutton = document.createElement('button')
        imageUploadbutton.textContent = '上传图片'
        imageUploadbutton.classList.add('imageUploadbutton')
        //添加编辑按钮
        const editproductbutton = document.createElement('button')
        editproductbutton.textContent = '编辑'
        editproductbutton.classList.add('editproduct')
        const deleteproductbutton = document.createElement('button')
        //添加删除按钮
        deleteproductbutton.textContent = '删除'
        deleteproductbutton.classList.add('deleteproduct')
        const buttonContainer = document.createElement('p');
        buttonContainer.classList.add('editAnddelete')
        buttonContainer.appendChild(imageUploadbutton);
        buttonContainer.appendChild(editproductbutton);
        buttonContainer.appendChild(deleteproductbutton);

        element.replaceWith(buttonContainer)
    })
    //展示用户的信息
}

//上传图片并且保存在images文件夹
function uplodeimage() {
    const getAllimageUploadbutton = document.querySelectorAll('.imageUploadbutton');

    getAllimageUploadbutton.forEach(button => {
        button.addEventListener('click', function () {
            const productDadbox = button.closest('.product');
            const imageInput = productDadbox.querySelector('.imageUploadinput');

            // 触发文件选择
            imageInput.click();

            // 监听文件选择
            imageInput.addEventListener('change', function (event) {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);

                    // 将图片通过 POST 请求发送到服务器
                    fetch('/uploadimage', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                // 更新商品图片的 src，使用服务器返回的图片路径
                                productDadbox.querySelector('.product-image').src = data.filePath;
                                productDadbox.querySelector('a').href = data.filePath
                                const proName = productDadbox.querySelector('.pname')
                                if (proName.textContent == '此处商品已下架') {
                                    proName.textContent = '请修改商品名'
                                }
                            } else {
                                alert('图片上传失败');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            }, { once: true }); // 确保事件只执行一次

        });
    });
}

//编辑当前按钮
function editproduct() {
    const getall = document.querySelector('body')
    const getAlleditproduct = getall.querySelectorAll('.editproduct')

    getAlleditproduct.forEach(button => {
        button.dataset.isEditing = 'false';
        button.addEventListener('click', function () {
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息的标签
            const productID = productDadbox.getAttribute('id')
            const proName = productDadbox.querySelector('.pname')
            const proprice = productDadbox.querySelector('.price')
            const proimageurl = productDadbox.querySelector('img')
            if (button.dataset.isEditing === 'false') {
                // 进入编辑模式
                const currentproName = proName.textContent;
                proName.innerHTML = `<input type="text" class="editnameInput" value="${currentproName}" />`;
                const currentproprice = proprice.textContent;
                proprice.innerHTML = `<input type="text" class="editpriceInput" value="${currentproprice}" />`;

                button.textContent = '完成';
                button.dataset.isEditing = 'true';
            } else {
                // 完成编辑
                const inputproName = productDadbox.querySelector('.editnameInput').value;
                const inputproprice = productDadbox.querySelector('.editpriceInput').value;
                if (inputproName.length <= 0 || inputproName.length > 8 || parseFloat(inputproprice) < 0 || parseFloat(inputproprice) >= 100000 || inputproprice.length <= 0) {
                    alert('商品名要在1-8个字符并且商品价格要在0-10000金币')
                }
                else {
                    proName.textContent = inputproName;
                    proprice.textContent = inputproprice;
                    button.textContent = '编辑';
                    button.dataset.isEditing = 'false'
                }



            }
        })
    })
}
//更新商品时检查商品是否还在编辑
function productbuttonisEditing() {
    let i = 0
    const getall = document.querySelector('body')
    //先判断所有商品是否完成编辑
    const getAlleditproduct = getall.querySelectorAll('.editproduct')

    getAlleditproduct.forEach(button => {
        if (button.dataset.isEditing === 'true') {
            i = 1
        }
    })
    if (i == 1) {
        alert('有商品未完成编辑')
        return false
    }
    else return true
}
//更新新的商品信息到数据库
function updateProductIndatabase() {

    const getall = document.querySelector('body')
    const getupdateproductbutton = getall.querySelector('.updateproduct')
    getupdateproductbutton.addEventListener('click', function () {
        if (productbuttonisEditing()) {
            let insertType = `DELETE FROM product; INSERT INTO product (id, pname, price, image_url) VALUES `
            const getallproduct = getall.querySelectorAll('.product')
            for (let i = 0; i < getallproduct.length; i++) {
                const productID = getallproduct[i].getAttribute('id')
                const pname = getallproduct[i].querySelector('.pname').textContent
                const price = parseFloat(getallproduct[i].querySelector('.price').textContent)
                const imager_url = getallproduct[i].querySelector('.product-image').src
                insertType += ` ('${productID}', '${pname}', ${price}, '${imager_url}'),`;
            }
            if (insertType.endsWith(',')) {
                insertType = insertType.slice(0, -1);
            }
            fetch('/updateProductIndatabase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    insertType: insertType,
                })
            })

                .then(response => response.json())
                .then(res => {
                    if (res.success) {
                        alert(res.message)
                    }

                    else {
                        alert(res.message)
                    }
                })
        }


    })
}

//删除商品信息
function deleteproduct() {
    const getall = document.querySelector('body')
    const getdeleteproductbutton = getall.querySelectorAll('.deleteproduct')
    getdeleteproductbutton.forEach(button => {
        button.addEventListener('click', function () {
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息
            const productID = productDadbox.getAttribute('id')
            const proName = productDadbox.querySelector('.pname')
            const proimageurl = productDadbox.querySelector('img')
            const proprice = productDadbox.querySelector('.price')

            if (proName.textContent == '此处商品已下架' && proprice.textContent == '0') {
                alert('此处无商品，删除无效')
            }
            else if (confirm('确定删除该商品？')) {
                proName.textContent = '此处商品已下架'
                proprice.textContent = '0'
                proimageurl.src = 'images/购物车.jpg'
            }

        }

        )
    })
}
//-------------------------------------------

//输出管理界面
function showmanagement() {
    const getall = document.querySelector('body')
    const management = document.createElement('div')
    management.classList.add('management')
    management.innerHTML = ` <div class="usermanagement">
            <div class="navuser">
                <span class="usertext"><b>用户管理</b></span>
                <button class="uploaduser">将用户数据上传至数据库</button>
                <button class="search"><img src="./images/查询.jpg" alt="查询"></button>
                <input type="text" id="userEmail" class="searchinput"  placeholder="请输入用户邮箱">
                <label for="userEmail" class="searchLabel"> <span class="usersearchtext">用户搜索</span></label>
               
            </div>
            <div class="headuser">
                <ul>
                    <li>用户邮箱</li>
                    <li>用户名</li>
                    <li>用户余额</li>
                    <li>修改信息</li>
                </ul>
            </div>
            
            <div class="bodyuser">
            </div>
            </div>

            <div class="productmanagement">
            <div class="navproduct">
                <span class="searchtext">请在左侧搜索用户</span>
                <label for="selectproduct">选择商品状态:</label>
                <select id="selectproduct" name="status">
                    <option value="全部">全部</option>
                    <option value="已发货">已发货</option>
                    <option value="未发货">未发货</option>
                </select>
            </div>
            <div class="headproduct"> 
                 <ul>
                    <li>商品名</li>
                    <li>商品数量</li>
                    <li>总计</li>
                    <li>商品状态</li>
                    <li><button class="sendallorder">一键发货</button></li>
                </ul>
            </div>
              <div class="bodyproduct">
              </div>
            </div> `
    getall.appendChild(management)
    //获取用户信息
    getalluserfromdatabse()
    //从本地存储读取

}
//在管理界面展示用户信息
function showUsermessage() {
    let useraccount = getuseraccount()
    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    const getbodyuser = getmanagement.querySelector('.bodyuser')
    for (let i = 0; i < useraccount.length; i++) {
        const ul = document.createElement('ul')
        ul.innerHTML = ` <li class="useremail">${useraccount[i].email}</li>
                    <li class="username">${useraccount[i].uname}</li>
                    <li class="usermoney">${useraccount[i].umoney}</li>
                    <li class="changemoney"><button>修改</button></li>`
        getbodyuser.appendChild(ul)
    }
    //可以执行修改
    editUsersMessage()
}


//读取数据库用户表存入本地存储
function getalluserfromdatabse() {

    fetch('/Searchuseraccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })

        .then(response => response.json())
        .then(res => {
            if (res.success) {
                let useraccount = res.data
                localStorage.setItem(`useraccount`, JSON.stringify(useraccount))
                showUsermessage()
            }

            else {

            }
        })

}
//从本地读取用户信息
function getuseraccount() {

    let getuseraccount = localStorage.getItem(`useraccount`)
    if (getuseraccount) {
        let useraccount = JSON.parse(getuseraccount)

        return useraccount
    }
}




//从本地读取用户历史订单
function getuserorderInlocal() {

    let getuserorder = localStorage.getItem(`managerGetuserOrder`)
    if (getuserorder) {
        let userorder = JSON.parse(getuserorder)

        return userorder
    }
    else {
        let userorder = []
        return userorder
    }
}

//修改用户的信息
function editUsersMessage() {
    let useraccount = getuseraccount()
    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    const getbodyuser = getmanagement.querySelector('.bodyuser')
    const getAllchangemoney = getbodyuser.querySelectorAll('.changemoney')
    getAllchangemoney.forEach(element => {
        const button = element.querySelector('button')
        button.dataset.isEditing = 'false'
        button.addEventListener('click', function () {
            //父元素ul
            const getdadul = element.closest('ul')
            //获得金额
            const usermoney = getdadul.querySelector('.usermoney')
            //获得邮箱
            const useremail = getdadul.querySelector('.useremail')

            if (button.dataset.isEditing === 'false') {
                // 进入编辑模式
                const currentusermoney = usermoney.textContent;
                usermoney.innerHTML = `<input type="text" class="editusermoneyInput" value="${currentusermoney}" />`;
                button.textContent = '完成';
                button.dataset.isEditing = 'true';
            } else {
                // 完成编辑
                const inputusermoney = getdadul.querySelector('.editusermoneyInput').value;
                if (parseFloat(inputusermoney) < 0 || parseFloat(inputusermoney) >= 1000000000 || inputusermoney.length <= 0) {
                    alert('修改的金额要在0-100000000金币')
                }
                else {
                    //修改本地的用户数组
                    for (let i = 0; i < useraccount.length; i++) {
                        if (useraccount[i].email == useremail.textContent) {
                            useraccount[i].umoney = inputusermoney
                            localStorage.setItem(`useraccount`, JSON.stringify(useraccount))

                            break
                        }
                    }
                    usermoney.textContent = inputusermoney;
                    button.textContent = '修改';
                    button.dataset.isEditing = 'false'
                }
            }
        })
    })
}
//更新用户时检查用户是否还编辑
function userbuttonisEditing() {
    let i = 0
    const getall = document.querySelector('body')
    //先判断所有商品是否完成编辑
    const getmanagement = getall.querySelector('.management')
    const getUsermanagement = getmanagement.querySelector('.usermanagement')
    const getAllchangemoney = getUsermanagement.querySelectorAll('.changemoney')

    getAllchangemoney.forEach(element => {
        const button = element.querySelector('button')
        if (button.dataset.isEditing === 'true') {
            i = 1
        }
    })
    if (i == 1) {
        alert('有用户未完成编辑')
        return false
    }
    else return true
}

//点击上传用户数据按钮
function uploaduser() {
    let useraccount = getuseraccount()
    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    const getUsermanagement = getmanagement.querySelector('.usermanagement')

    const getnavuser = getUsermanagement.querySelector('.navuser')
    const getuploadbutton = getnavuser.querySelector('.uploaduser')
    getuploadbutton.addEventListener('click', function () {
        let updateType = ``
        //检查编辑是否未完成
        if (userbuttonisEditing()) {
            const bodyuser = getUsermanagement.querySelector('.bodyuser')
            const getallul = bodyuser.querySelectorAll('ul')

            for (let i = 0; i < getallul.length; i++) {
                const useremail = getallul[i].querySelector('.useremail')
                const usermoney = getallul[i].querySelector('.usermoney')
                for (let j = 0; j < useraccount.length; j++) {
                    if (useraccount[j].email == useremail.textContent && usermoney.textContent != useraccount[j].umoney) {
                        updateType += `update useraccount set umoney=${parseFloat(usermoney.textContent)} where email='${useraccount[j].email}' `
                        useraccount[j].umoney = usermoney.textContent
                        localStorage.setItem(`useraccount`, JSON.stringify(useraccount))
                        break
                    }
                }
            }
            if (updateType) {
                //更改用户表
                fetch('/updateUserIndatabase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        updateType: updateType,
                    })
                })

                    .then(response => response.json())
                    .then(res => {
                        if (res.success) {
                            alert(res.message)
                        }

                        else {
                            alert(res.message)
                        }
                    })
            }
            else {
                alert('无用户修改')
            }

        }

    })
}

//管理员查询用户
function searchUser() {

    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    //商品管理
    const getproductmanagement = getmanagement.querySelector('.productmanagement')
    const getnavproduct = getproductmanagement.querySelector('.navproduct')

    //用户管理
    const getUsermanagement = getmanagement.querySelector('.usermanagement')
    const getnavuser = getUsermanagement.querySelector('.navuser')
    const getsearchinput = getnavuser.querySelector('.searchinput')
    const getsearchbutton = getnavuser.querySelector('.search')
    getsearchbutton.addEventListener('click', function () {
        //查询前先把原本存在本地的历史订单删除
        localStorage.removeItem('managerGetuserOrder');
        let useraccount = getuseraccount()
        const getinputemail = getsearchinput.value

        if (getinputemail) {
            //添加一个倒计时在5s内无法再次点击查询
            let clicktime = 5
            const button = this
            button.disabled = true
            button.innerHTML = clicktime
            let clicktimeinterval = setInterval(function () {
                clicktime--
                button.innerHTML = clicktime
                if (clicktime <= 0) {
                    clearInterval(clicktimeinterval)
                    button.disabled = false
                    button.innerHTML = `<img src="./images/查询.jpg" alt="查询">`
                }
            }, 1000)

            const getbodyproduct = getproductmanagement.querySelector('.bodyproduct')
            const getSelect = getnavproduct.querySelector('#selectproduct')
            const getbodyuser = getUsermanagement.querySelector('.bodyuser')
            getbodyuser.innerHTML = ``
            getbodyproduct.innerHTML = ``
            //重新输出搜索的用户
            for (let i = 0; i < useraccount.length; i++) {
                if (useraccount[i].email == getinputemail) {

                    getbodyuser.innerHTML = `<ul> <li class="useremail">${useraccount[i].email}</li>
                    <li class="username">${useraccount[i].uname}</li>
                    <li class="usermoney">${useraccount[i].umoney}</li>
                    <li class="changemoney"><button data-is-editing="false">修改</button></li></ul > `
                    getSelect.value = '全部'
                    //去数据库获取该用户的历史订单
                    managergetUserorder(getinputemail)
                    //重新执行一次读取所有编辑用户按钮
                    editUsersMessage()
                    break
                }
            }
        }
        else if (getinputemail == '') {
            const getbodyproduct = getproductmanagement.querySelector('.bodyproduct')
            const getSelect = getnavproduct.querySelector('#selectproduct')
            const getbodyuser = getUsermanagement.querySelector('.bodyuser')
            getbodyuser.innerHTML = ``
            getbodyproduct.innerHTML = ``
            getSelect.value = '全部'
            for (let i = 0; i < useraccount.length; i++) {
                const ul = document.createElement('ul')
                ul.innerHTML = ` <li class="useremail">${useraccount[i].email}</li>
                    <li class="username">${useraccount[i].uname}</li>
                    <li class="usermoney">${useraccount[i].umoney}</li>
                    <li class="changemoney"><button>修改</button></li>`
                getbodyuser.appendChild(ul)
            }
            //重新执行一次读取所有编辑用户按钮
            editUsersMessage()
        }

    })


}


//从数据库获取所有用户历史订单
function managergetUserorder(useremail) {
    let searchType = `select * from [Order_${useremail}]`
    //更改用户表
    fetch('/UserOrderIndatabase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            searchType: searchType,
        })
    })

        .then(response => response.json())
        .then(res => {
            if (res.success) {
                let userOrder = res.data
                localStorage.setItem(`managerGetuserOrder`, JSON.stringify(userOrder))
                //管理员查询用户后展示此用户历史订单
                showUserOrder(userOrder)
            }

            else {

            }
        })

}


//管理员查询用户后展示此用户历史订单
function showUserOrder(userOrder) {

    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    const getproductmanagement = getmanagement.querySelector('.productmanagement')
    const getbodyproduct = getproductmanagement.querySelector('.bodyproduct')
    for (let i = 0; i < userOrder.length; i++) {
        const ul = document.createElement('ul')
        ul.id = userOrder[i].OrderId
        let totalcount = parseInt(userOrder[i].count) * parseFloat(userOrder[i].price)
        if (userOrder[i].status == '未发货') {
            ul.innerHTML = ` <li>${userOrder[i].pname}</li>
                    <li>${userOrder[i].count}</li>
                    <li>${totalcount}</li>
                    <li class="status">${userOrder[i].status}</li>
                    <li class="sendorder"><button >发货</button></li>`
            getbodyproduct.appendChild(ul)
        }
        if (userOrder[i].status == '已发货') {
            ul.innerHTML = ` <li>${userOrder[i].pname}</li>
                    <li>${userOrder[i].count}</li>
                    <li>${totalcount}</li>
                    <li class="status">${userOrder[i].status}</li>
                    <li></li>`
            getbodyproduct.appendChild(ul)
        }
    }
    //启用发货功能
    managerSendProduct()
}

//管理员对商品状态选择
function managerSelectproductStatus() {
    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    const getproductmanagement = getmanagement.querySelector('.productmanagement')
    const getnavproduct = getproductmanagement.querySelector('.navproduct')
    const getbodyproduct = getproductmanagement.querySelector('.bodyproduct')
    const getSelect = getnavproduct.querySelector('#selectproduct')
    getSelect.addEventListener('change', function () {
        let userorder = getuserorderInlocal()
        let newuserorder = []
        getbodyproduct.innerHTML = ``
        const selectvalue = this.value

        if (selectvalue == '全部') {
            showUserOrder(userorder)
        }
        else {
            for (let i = 0; i < userorder.length; i++) {

                if (userorder[i].status == selectvalue) {
                    newuserorder[0] = userorder[i]
                    showUserOrder(newuserorder)
                }

            }
        }

    })

}
let sendallorderisListenerAdded = false;
let sendorderisListenerAdded = false;
//管理员发货
function managerSendProduct() {

    const getall = document.querySelector('body')
    const getmanagement = getall.querySelector('.management')
    //获取当前用户的邮箱
    const getUsermanagement = getmanagement.querySelector('.usermanagement')
    const getnavuser = getUsermanagement.querySelector('.navuser')
    const getsearchinput = getnavuser.querySelector('.searchinput')
    const getinputemail = getsearchinput.value
    //该用户的历史订单
    const getproductmanagement = getmanagement.querySelector('.productmanagement')
    const getheadproduct = getproductmanagement.querySelector('.headproduct')
    const getbodyproduct = getproductmanagement.querySelector('.bodyproduct')
    const getsendallorder = getheadproduct.querySelector('.sendallorder')

    function oneclicksendallorder() {
        if (confirm('确定订单无误，发送邮件至用户邮箱')) {
            let sendOrderEmailmessage = ``
            let userorder = getuserorderInlocal()

            //对本地存储的用户订单进行修改
            for (let i = 0; i < userorder.length; i++) {
                if (userorder[i].status == '未发货') {
                    sendOrderEmailmessage += `${userorder[i].pname}、`
                    userorder[i].status = '已发货'
                }
            }
            localStorage.setItem(`managerGetuserOrder`, JSON.stringify(userorder))



            if (sendOrderEmailmessage.endsWith('、')) {
                sendOrderEmailmessage = sendOrderEmailmessage.slice(0, -1);

            }

            if (sendOrderEmailmessage) {
                let updateType = `update [Order_${getinputemail}] set status='已发货' where status='未发货'`
                //更新用户的历史订单表
                fetch('/updateUserOrderIndatabase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        updateType: updateType,
                    })
                })

                    .then(response => response.json())
                    .then(res => {
                        if (res.success) {
                            //发送商品已发货邮件
                            sendOrderToemail(getinputemail, sendOrderEmailmessage)

                            //修改当前页面的订单状态
                            const getallstatus = getbodyproduct.querySelectorAll('.status')
                            getallstatus.forEach(element => {

                                if (element.textContent == '未发货') {
                                    element.textContent = '已发货'
                                }

                            })
                            //将发货按钮隐藏
                            const getsendorder = getbodyproduct.querySelectorAll('.sendorder')
                            getsendorder.forEach(element => {

                                element.innerHTML = ``
                            })
                            //重新执行
                            managerSelectproductStatus()
                        }

                        else {
                            alert(res.message)
                        }
                    })
            }
            else {
                alert('无订单可发货')
            }
        }

    }
    if (sendallorderisListenerAdded) {
        //移除之前的监听
        getsendallorder.removeEventListener('click', oneclicksendallorder)
    }
    else {
        //一键发货功能
        getsendallorder.addEventListener('click', oneclicksendallorder)
        sendallorderisListenerAdded = true
    }




    //单独发货功能
    const getsendorder = getbodyproduct.querySelectorAll('.sendorder')
    getsendorder.forEach(element => {
        const button = element.querySelector('button')
        // button.removeEventListener('click', oneclicksendoneorder)
        //一键发货功能
        button.addEventListener('click', oneclicksendoneorder)

        function oneclicksendoneorder() {
            if (confirm('确定订单无误，发送邮件至用户邮箱')) {
                const getdadul = element.closest('ul')
                const getOrderid = getdadul.id
                let sendOrderEmailmessage = ``
                let userorder = getuserorderInlocal()
                //对本地存储的用户订单进行修改
                for (let i = 0; i < userorder.length; i++) {
                    if (userorder[i].OrderId == getOrderid) {
                        sendOrderEmailmessage += `${userorder[i].pname}`
                        userorder[i].status = '已发货'
                        localStorage.setItem(`managerGetuserOrder`, JSON.stringify(userorder))
                        break
                    }
                }
                let updateType = `update [Order_${getinputemail}] set status='已发货' where OrderId='${getOrderid}'`
                //更新用户的历史订单表
                fetch('/updateUserOrderIndatabase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        updateType: updateType,
                    })
                })

                    .then(response => response.json())
                    .then(res => {
                        if (res.success) {
                            //发送商品已发货邮件
                            sendOrderToemail(getinputemail, sendOrderEmailmessage)
                            element.innerHTML = ``
                            //重新执行选择功能
                            managerSelectproductStatus()
                            const getstatus = getdadul.querySelector('.status')
                            getstatus.textContent = '已发货'
                        }

                        else {
                            alert(res.message)
                        }
                    })
            }
        }
    })
}


function sendOrderToemail(email, message) {

    fetch('/sendOrderToemail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, message: message })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("订单消息已发送到用户的邮箱！");
            } else {
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}