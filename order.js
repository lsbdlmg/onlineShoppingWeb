//主页用户点击去历史订单页面
function UserGoOrder(whologin) {
    const getpayartbutton = document.querySelector('.order')
    getpayartbutton.addEventListener('click', function () {
        const getUsermessageINlocal = localStorage.getItem(`${whologin.Emailtext}`)
        let UsermessageINlocal = JSON.parse(getUsermessageINlocal)

        let User = {
            name: UsermessageINlocal.name,
            Emailtext: UsermessageINlocal.Emailtext,

        }
        let Userpaycart = new URLSearchParams(User).toString()
        window.open(`http://8.134.159.233/order.html?${Userpaycart}`, '_blank');
    })
}
//历史订单页面从url读取用户信息然后读取本地存储
function ordergetUser() {
    let urlParams = new URLSearchParams(window.location.search)
    let User = {
        name: urlParams.get('name'),
        Emailtext: urlParams.get('Emailtext'),

    }
    const UserInlocal = JSON.parse(localStorage.getItem(`${User.Emailtext}`))

    return UserInlocal
}

//从本地读取用户历史订单
function getUserorder(whologin) {

    let getUserorder = localStorage.getItem(`order_${whologin.Emailtext}`)
    // console.log(`paycart_${whologin.Emailtext}`)
    if (getUserorder) {
        let Userorder = JSON.parse(getUserorder)
        // console.log(Userpaycart)
        return Userorder
    }
    else {
        let Userorder = {
            Emailtext: whologin.Emailtext,
            OrderId: [],
            ID: [],
            pname: [],
            price: [],
            image_url: [],
            count: [],
            status: []
        }

        return Userorder
    }

}

//主页从数据库读取用户历史订单然后存到本地存储
function getUserorderfromdatabase(whologin) {
    fetch('/orderReadfromDatabase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userEmail: whologin.Emailtext
        })
    })

        .then(response => response.json())
        .then(res => {
            if (res.success) {
                let Userorder = getUserorder(whologin)
                let UserorderINdatabase = res.products
                for (let i = 0; i < UserorderINdatabase.length; i++) {
                    Userorder.OrderId[i] = UserorderINdatabase[i].OrderId
                    Userorder.ID[i] = UserorderINdatabase[i].id
                    Userorder.pname[i] = UserorderINdatabase[i].pname
                    Userorder.price[i] = UserorderINdatabase[i].price
                    Userorder.image_url[i] = UserorderINdatabase[i].image_url
                    Userorder.count[i] = UserorderINdatabase[i].count
                    Userorder.status[i] = UserorderINdatabase[i].status
                    localStorage.setItem(`order_${whologin.Emailtext}`, JSON.stringify(Userorder))

                }
                // console.log(Userorder)
                // updateCartDisplay(whologin)
            }

            else {

            }
        })

}

//历史订单页面用户的个人历史订单展示
function showUserorder(whologin) {
    let Userorder = getUserorder(whologin)
    const orderlist = document.querySelector('.orderlist')
    for (let i = 0; i < Userorder.ID.length; i++) {

        const productbody = document.createElement('div')
        productbody.classList.add('productbody')
        productbody.classList.add('product')
        //给父标签添加ID
        productbody.setAttribute('id', `${Userorder.ID[i]}`)
        orderlist.appendChild(productbody)
        //创建一个ul
        const productbodyul = document.createElement('ul')
        productbody.appendChild(productbodyul)
        const countMoney = Userorder.price[i] * Userorder.count[i]
        productbodyul.innerHTML = ` 
                <li class="pname">${Userorder.pname[i]}</li>
                <li class="pro-image"><a href="${Userorder.image_url[i]}" target="_blank"><img src="${Userorder.image_url[i]}"></a></li>
                <li class="price">${Userorder.price[i]}</li>
                <li><span class="countdad">[<span class="product-count">${Userorder.count[i]}</span>]</span>
                </li>
                <li class="countMoney">${countMoney}</li>
                <li class="status">${Userorder.status[i]}</li>
                <li class="right "><span class="delete">删除</span></li>`
    }

}

//历史订单页面点击删除按钮
function deleteproductfromorder(whologin) {
    let Userorder = getUserorder(whologin)
    const getall = document.querySelector('body')
    const getdelete = getall.querySelectorAll('.delete')
    getdelete.forEach(button => {
        button.addEventListener('click', function () {
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息
            const productID = productDadbox.getAttribute('id')
            //获取该商品的状态
            const productStatus = productDadbox.querySelector('.status')
            if (productStatus.textContent == '未发货') {
                alert('该商品未发货，无法删除')
            }
            if (productStatus.textContent == '已发货') {
                if (confirm('确定移除该商品？')) {


                    //将用户的本地存储的购物车删除对应的商品
                    for (let i = 0; i <= Userorder.ID.length; i++) {
                        if (productID == Userorder.ID[i]) {
                            Userorder.OrderId.splice(i, 1)
                            Userorder.ID.splice(i, 1)
                            Userorder.pname.splice(i, 1)
                            Userorder.image_url.splice(i, 1)
                            Userorder.count.splice(i, 1)
                            Userorder.price.splice(i, 1)
                            Userorder.status.splice(i, 1)
                            localStorage.setItem(`order_${whologin.Emailtext}`, JSON.stringify(Userorder))
                            break
                        }
                    }
                    // console.log(Userorder)

                    //删除完之后重新加载页面
                    localStorageInsertOrder(whologin)

                }
            }


        })
    })
}

//历史订单页面刷新后从本地存储读取用户历史订单然后插入到数据库里
function localStorageInsertOrder(whologin) {
    let Userorder = getUserorder(whologin)
    // console.log(Userorder)
    insertType = `delete from [Order_${whologin.Emailtext}]`
    if (Userorder.ID.length != 0) {

        insertType = `delete from [Order_${Userorder.Emailtext}]
    INSERT INTO [Order_${Userorder.Emailtext}] values`
        for (let i = 0; i < Userorder.ID.length; i++) {
            if (i == Userorder.ID.length - 1) {
                insertType = insertType + `('${Userorder.OrderId[i]}','${Userorder.ID[i]}','${Userorder.pname[i]}'
        ,${Userorder.price[i]},'${Userorder.image_url[i]}'
        ,${Userorder.count[i]},'${Userorder.status[i]}')`
            }
            else {
                insertType = insertType + `('${Userorder.OrderId[i]}','${Userorder.ID[i]}','${Userorder.pname[i]}'
        ,${Userorder.price[i]},'${Userorder.image_url[i]}'
        ,${Userorder.count[i]},'${Userorder.status[i]}'),`

            }
        }
    }


    // console.log(insertType)
    fetch('/productupdateOrder', {
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
                let User = {
                    name: whologin.name,
                    Emailtext: whologin.Emailtext,

                }
                let userorder = new URLSearchParams(User).toString()
                window.location.replace(`http://8.134.159.233/order.html?${userorder}`);
            }

            else {
                alert(res.message)
            }
        })

}