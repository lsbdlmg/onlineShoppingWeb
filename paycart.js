
//主页以及购物车页面移出购物车
function ReduceProduct(whologin) {
    const getall = document.querySelector('body')
    const getaddtopaycart = getall.querySelectorAll('.min-paycart')
    getaddtopaycart.forEach(button => {
        button.addEventListener('click', function () {
            //获取购物车的总数量
            const paycartcount = getall.querySelector('#paycartcount')
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息
            const productID = productDadbox.getAttribute('id')
            //获取该商品在购物车的数量
            const thisproductcount = productDadbox.querySelector('.product-count')
            //更新当前商品的加入次数
            //如果商品数量大于1才可以减少在购物车数量
            let nowcount = parseInt(thisproductcount.textContent)
            let Userpaycart = getUserpaycart(whologin)

            if (nowcount <= 0) {
                alert('移出购物车失败，该商品不在购物车')
                location.reload();
            }
            else {
                thisproductcount.textContent = nowcount - 1
                paycartcount.textContent = parseInt(paycartcount.textContent) - 1
                if (thisproductcount.textContent > 0) {

                    //遍历所有商品看
                    for (let i = 0; i < Userpaycart.ID.length; i++) {
                        //该商品修改其数量以及购物车总数
                        if (Userpaycart.ID[i] == productID) {
                            Userpaycart.count[i] = parseInt(thisproductcount.textContent)
                            Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                            // console.log(Userpaycart)
                            localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                            // sessionStorageInsertPaycart(whologin)
                            break
                        }
                    }
                }
                //当商品数量为1时并且该商品要减少在购物车的数量，则移除该商品
                else {

                    for (let i = 0; i < Userpaycart.ID.length; i++) {
                        //如果有该商品则修改其数量以及购物车总数
                        if (Userpaycart.ID[i] == productID) {
                            Userpaycart.ID.splice(i, 1)
                            Userpaycart.pname.splice(i, 1)
                            Userpaycart.image_url.splice(i, 1)
                            Userpaycart.count.splice(i, 1)
                            Userpaycart.price.splice(i, 1)
                            Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                            localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                            // sessionStorageInsertPaycart(whologin)
                            // console.log(Userpaycart)
                            break
                        }
                    }

                }
            }



        })
    })
}

//主页以及购物车页面添加购物车
function ADDProduct(whologin) {
    const getall = document.querySelector('body')
    const getaddtopaycart = getall.querySelectorAll('.add-paycart')
    getaddtopaycart.forEach(button => {
        button.addEventListener('click', function () {
            //获取购物车的总数量
            const paycartcount = getall.querySelector('#paycartcount')
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息
            const productID = productDadbox.getAttribute('id')
            const proName = productDadbox.querySelector('.pname')
            const proprice = productDadbox.querySelector('.price')
            const proimageurl = productDadbox.querySelector('img')
            //获取该商品在购物车的数量
            const thisproductcount = productDadbox.querySelector('.product-count')
            //更新当前商品的加入次数
            let nowcount = parseInt(thisproductcount.textContent)
            if (nowcount <= 10) {
                thisproductcount.textContent = nowcount + 1
                //更新购物车总数量 
                paycartcount.textContent = parseInt(paycartcount.textContent) + 1

                let Userpaycart = getUserpaycart(whologin)


                //如果购物车没有商品，则添加第一个商品
                if (!Userpaycart.ID.length) {
                    Userpaycart.Emailtext = whologin.Emailtext
                    Userpaycart.ID[0] = productID
                    Userpaycart.pname[0] = proName.textContent
                    Userpaycart.price[0] = proprice.textContent
                    Userpaycart.image_url[0] = proimageurl.src
                    Userpaycart.count[0] = parseInt(thisproductcount.textContent)
                    Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                    // console.log(Userpaycart)
                    localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                    // sessionStorageInsertPaycart(whologin)
                }
                //购物车如果有商品则遍历所有商品看是否有该商品
                else {
                    for (let i = 0; i < Userpaycart.ID.length; i++) {
                        //如果有该商品则修改其数量以及购物车总数
                        if (Userpaycart.ID[i] == productID) {
                            Userpaycart.count[i] = parseInt(thisproductcount.textContent)
                            Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                            // console.log(Userpaycart)
                            localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                            // sessionStorageInsertPaycart(whologin)
                            break
                        }
                        //如果遍历完所有商品发现没有该商品，在添加该商品到购物车
                        if (i == Userpaycart.ID.length - 1 && Userpaycart.ID[i] != productID) {

                            Userpaycart.ID[i + 1] = productID
                            Userpaycart.pname[i + 1] = proName.textContent
                            Userpaycart.price[i + 1] = proprice.textContent
                            Userpaycart.image_url[i + 1] = proimageurl.src
                            Userpaycart.count[i + 1] = parseInt(thisproductcount.textContent)
                            Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                            // console.log(Userpaycart)
                            localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                            // localStorageInsertPaycart(whologin)
                            break
                        }
                    }
                }
            }

            else {
                alert('每件商品最多加入10件加入购物车')
            }
        })
    })

}

//从本地读取用户购物车
function getUserpaycart(whologin) {

    let getUserpaycart = localStorage.getItem(`paycart_${whologin.Emailtext}`)
    // console.log(`paycart_${whologin.Emailtext}`)
    if (getUserpaycart) {
        let Userpaycart = JSON.parse(getUserpaycart)
        // console.log(Userpaycart)
        return Userpaycart
    }
    else {
        let Userpaycart = {
            Emailtext: whologin.Emailtext,
            ID: [],
            pname: [],
            price: [],
            image_url: [],
            count: [],
            paycartcount: 0
        }

        return Userpaycart
    }

}

//主页从数据库读取用户购物车然后存到本地存储
function getUserpaycartfromdatabase(whologin) {
    fetch('/paycartReadfromDatabase', {
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
                let Userpaycart = getUserpaycart(whologin)
                let UserpaycartINdatabase = res.products
                for (let i = 0; i < UserpaycartINdatabase.length; i++) {
                    Userpaycart.ID[i] = UserpaycartINdatabase[i].id
                    Userpaycart.pname[i] = UserpaycartINdatabase[i].pname
                    Userpaycart.price[i] = UserpaycartINdatabase[i].price
                    Userpaycart.image_url[i] = UserpaycartINdatabase[i].image_url
                    Userpaycart.count[i] = UserpaycartINdatabase[i].count
                    Userpaycart.paycartcount = UserpaycartINdatabase[i].paycartcount
                    localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))

                }
                getUserorderfromdatabase(whologin)
                // console.log(Userpaycart)
                updateCartDisplay(whologin)
            }

            else {
                getUserorderfromdatabase(whologin)

            }
        })

}

//主页以及购物车页面读取本地存储&且页面回来更新商品已在购物车的数量并且显示出来
function updateCartDisplay(whologin) {
    let productIsUpdate = ``
    let Userpaycart = getUserpaycart(whologin)
    // console.log(Userpaycart)
    const getall = document.querySelector('body')
    const thisproductcount = getall.querySelectorAll('.product-count')
    // console.log(thisproductcount)
    const paycartcount = getall.querySelector('#paycartcount')
    paycartcount.textContent = Userpaycart.paycartcount
    //获取购物车的总数量
    for (let i = 0; i < thisproductcount.length; i++) {
        //获取该商品的父容器
        const productDadbox = thisproductcount[i].closest('.product')
        //获取该商品的id
        const productID = productDadbox.getAttribute('id')
        const proName = productDadbox.querySelector('.pname')
        const proprice = productDadbox.querySelector('.price')
        const proimageurl = productDadbox.querySelector('img')
        //如果用户购物车没商品，则全部置0
        if (Userpaycart.ID.length == 0 && proName.textContent != '此处商品已下架') {
            //商品没有在购物车 将数量置0
            thisproductcount[i].textContent = 0
        }
        //如果用户购物车有商品，先查看商品信息是否有改变，
        //有的话则移出购物车，没有则更改页面数量为用户购物车里的数量
        for (let j = 0; j < Userpaycart.ID.length; j++) {
            if (productID == Userpaycart.ID[j]) {
                //商品信息有修改则移除购物车
                if (proName.textContent != Userpaycart.pname[j] || parseFloat(proprice.textContent) != Userpaycart.price[j] || proimageurl.src != Userpaycart.image_url[j]) {
                    thisproductcount[i].textContent = 0
                    productIsUpdate = productIsUpdate + `${Userpaycart.pname[j]}、`
                    Userpaycart.ID.splice(j, 1)
                    Userpaycart.pname.splice(j, 1)
                    Userpaycart.image_url.splice(j, 1)
                    Userpaycart.paycartcount = parseInt(paycartcount.textContent) - parseInt(Userpaycart.count[j])
                    paycartcount.textContent = Userpaycart.paycartcount
                    Userpaycart.count.splice(j, 1)
                    Userpaycart.price.splice(j, 1)
                    thisproductcount[i].textContent = ''
                    localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                    break
                }
                //商品信息无修改则修改页面的数量
                else {
                    thisproductcount[i].textContent = Userpaycart.count[j]
                    break
                }
            }
            //商品与购物车比对完成，该商品没有在购物车 将数量置0
            thisproductcount[i].textContent = 0
        }
        //当所有商品置0后检查是否有商品下架，有的话则隐藏其数量
        if (proName.textContent == '此处商品已下架') {
            thisproductcount[i].textContent = ''
            // console.log(proName.textContent)
        }
    }
    // console.log(productIsUpdate)
    if (productIsUpdate.endsWith('、')) {
        productIsUpdate = productIsUpdate.slice(0, -1);
        alert(`由于商品更新，购物车中的失效商品：${productIsUpdate}被移除`)
    }


}

//主页以及购物车页面刷新后从本地存储读取用户购物车然后插入到数据库里
function localStorageInsertPaycart(whologin) {
    let Userpaycart = getUserpaycart(whologin)
    // console.log(Userpaycart)
    let insertType = `delete from [paycart_${whologin.Emailtext}]`
    if (Userpaycart.ID.length > 0) {

        insertType = `delete from [paycart_${Userpaycart.Emailtext}]
    INSERT INTO [paycart_${Userpaycart.Emailtext}] values`
        for (let i = 0; i < Userpaycart.ID.length; i++) {
            if (i == Userpaycart.ID.length - 1) {
                insertType = insertType + ` ('${Userpaycart.ID[i]}', '${Userpaycart.pname[i]}', ${Userpaycart.price[i]}, '${Userpaycart.image_url[i]}', ${Userpaycart.count[i]}, ${Userpaycart.paycartcount})`
            }
            else {
                insertType = insertType + ` ('${Userpaycart.ID[i]}', '${Userpaycart.pname[i]}', ${Userpaycart.price[i]}, '${Userpaycart.image_url[i]}', ${Userpaycart.count[i]}, ${Userpaycart.paycartcount}),`
            }
        }
    }


    // console.log(insertType)
    fetch('/productupdatePaycart', {
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

            }

            else {
                alert(res.message)
            }
        })

}

//主页用户点击购物车链接
function UserGoPaycart(whologin) {
    const getpayartbutton = document.querySelector('.paycart')
    getpayartbutton.addEventListener('click', function () {
        const getUsermessageINlocal = localStorage.getItem(`${whologin.Emailtext}`)
        let UsermessageINlocal = JSON.parse(getUsermessageINlocal)

        let User = {
            name: UsermessageINlocal.name,
            Emailtext: UsermessageINlocal.Emailtext,

        }
        let Userpaycart = new URLSearchParams(User).toString()
        document.getElementById('loading').style.display = 'block';
        setTimeout(function () {
            document.getElementById('loading').style.display = 'none';
            window.open(`http://8.134.159.233/paycart.html?${Userpaycart}`, '_blank');
        }, 2000)
    })
}

//购物车页面用户点击返回主页
function UserGoIndex(whologin) {
    const getbacktoindexbutton = document.querySelector('.backtoindex')
    getbacktoindexbutton.addEventListener('click', function () {
        const getUsermessageINlocal = localStorage.getItem(`${whologin.Emailtext}`)
        let UsermessageINlocal = JSON.parse(getUsermessageINlocal)

        let User = {
            name: UsermessageINlocal.name,
            Emailtext: UsermessageINlocal.Emailtext,

        }
        let Userpaycart = new URLSearchParams(User).toString()
        window.location.href = `http://8.134.159.233/?${Userpaycart}`
    })
}


//------------------------------------------------
//购物车页面用户的个人购物车展示
function showUserpaycart(whologin) {
    let Userpaycart = getUserpaycart(whologin)

    const nav = document.querySelector('.nav')
    const navpaycar = document.createElement('span');
    navpaycar.classList.add('paycart')
    navpaycar.innerHTML = `购物车(<span id="paycartcount">${Userpaycart.paycartcount}</span>)`
    nav.appendChild(navpaycar)
    const havemoney = document.querySelector('.havemoney')
    havemoney.textContent = `剩余金额：${whologin.money}`

    const paycartlist = document.querySelector('.paycartlist')

    for (let i = 0; i < Userpaycart.ID.length; i++) {

        const productbody = document.createElement('div')
        productbody.classList.add('productbody')
        productbody.classList.add('product')
        //给父标签添加ID
        productbody.setAttribute('id', `${Userpaycart.ID[i]}`)
        paycartlist.appendChild(productbody)
        //创建一个ul
        const productbodyul = document.createElement('ul')
        productbody.appendChild(productbodyul)
        const countMoney = Userpaycart.price[i] * Userpaycart.count[i]
        productbodyul.innerHTML = ` 
        <li><input type="checkbox" class="select"></input></li>
                <li class="pname">${Userpaycart.pname[i]}</li>
                <li class="pro-image"><a href="${Userpaycart.image_url[i]}" target="_blank"><img src="${Userpaycart.image_url[i]}"></a></li>
                <li class="price">${Userpaycart.price[i]}</li>
                <li><span class="countdad"><button class="min-paycart button"><img src="./images/减少.jpg"></button>[<span class="product-count">${Userpaycart.count[i]}</span>]<button class="add-paycart button"><img src="./images/增加.jpg"></button></span>
                </li>
                <li class="countMoney">${countMoney}</li>
                <li class="right "><span class="delete">移出</span></li>`

    }

}

//购物车页面从url读取用户信息然后读取本地存储
function paycartgetUser() {
    let urlParams = new URLSearchParams(window.location.search)
    let User = {
        name: urlParams.get('name'),
        Emailtext: urlParams.get('Emailtext'),

    }
    const UserInlocal = JSON.parse(localStorage.getItem(`${User.Emailtext}`))

    return UserInlocal
}

//当页面切换时购物车页面计算该商品的小计
function thisproductallcountwhenback(whologin) {
    const getall = document.querySelector('body')
    const AllcountMoney = getall.querySelectorAll('.countMoney')
    AllcountMoney.forEach(element => {
        const productDadbox = element.closest('.product')
        //获取该商品的信息
        const proprice = productDadbox.querySelector('.price')
        //获取该商品在购物车的数量
        const thisproductcount = productDadbox.querySelector('.product-count')
        if (thisproductcount.textContent == '0') {
            location.reload();
        }
        element.textContent = parseInt(thisproductcount.textContent) * parseFloat(proprice.textContent)
    })
    //如果该商品是被选中的状态，则要将底下的total值修改

    const selectbutton = getall.querySelectorAll('.select')
    const getselectcount = getall.querySelector('#selectcount')
    const gettotalmoney = getall.querySelector('#totalmoney')
    let totalcount = 0
    let totalmoney = 0
    selectbutton.forEach((checkbox) => {
        if (checkbox.checked) {
            const productDadli = checkbox.closest('.product')
            const count = productDadli.querySelector('.product-count')
            // console.log(count);
            totalcount = totalcount + parseInt(count.textContent)
            const countMoney = productDadli.querySelector('.countMoney')
            // console.log(countMoney);
            totalmoney = (parseFloat(totalmoney) + parseFloat(countMoney.textContent)).toFixed(1)
            // console.log(totalmoney);
            // console.log(totalcount);
        }
    })
    getselectcount.textContent = `${totalcount}`
    gettotalmoney.textContent = `${totalmoney}`
    if (parseFloat(gettotalmoney.textContent) <= parseFloat(whologin.money)) {
        gettotalmoney.style.color = '#fff';
    }
    else {
        gettotalmoney.style.color = 'red';
    }
}

//购物车页面计算该商品的小计
function thisproductallcount(whologin) {
    let usermoney = whologin.money
    const getall = document.querySelector('body')
    const getaddtopaycart = getall.querySelectorAll('.add-paycart')
    const getreducetopaycart = getall.querySelectorAll('.min-paycart')

    //当增加商品就要重新计算小计
    getaddtopaycart.forEach(button => {
        button.addEventListener('click', function () {
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息
            const proprice = productDadbox.querySelector('.price')
            //获取该商品在购物车的数量
            const thisproductcount = productDadbox.querySelector('.product-count')
            //获取该商品的单选框
            const selectbutton = productDadbox.querySelector('.select')
            // console.log(selectbutton.checked)
            const countMoney = productDadbox.querySelector('.countMoney')
            countMoney.textContent = parseFloat(proprice.textContent) * parseInt(thisproductcount.textContent)
            // console.log(countMoney)

            //在增加购物车时先判断该商品是否已被选中，选中则还要修改底下的total值
            if (selectbutton.checked) {
                const getselectcount = getall.querySelector('#selectcount')
                const gettotalmoney = getall.querySelector('#totalmoney')
                // console.log(getselectcount)
                getselectcount.textContent = parseInt(getselectcount.textContent) + 1
                // console.log(getselectcount.textContent)
                gettotalmoney.textContent = (parseFloat(gettotalmoney.textContent) + parseFloat(proprice.textContent)).toFixed(1)
                if (parseFloat(gettotalmoney.textContent) > parseFloat(usermoney)) {
                    gettotalmoney.style.color = 'red';
                }
                else {
                    gettotalmoney.style.color = '#fff';
                }
            }
        })
    })
    //当减少商品就要重新计算小计
    getreducetopaycart.forEach(button => {
        button.addEventListener('click', function () {
            //获取该商品的父容器
            const productDadbox = button.closest('.product')
            //获取该商品的信息
            const proprice = productDadbox.querySelector('.price')
            //获取该商品在购物车的数量
            const thisproductcount = productDadbox.querySelector('.product-count')
            //获取该商品的单选框
            const selectbutton = productDadbox.querySelector('.select')
            // console.log(selectbutton.checked)
            let countMoney = productDadbox.querySelector('.countMoney')
            countMoney.textContent = parseFloat(proprice.textContent) * parseInt(thisproductcount.textContent)
            // console.log(countMoney)

            //在增加购物车时先判断该商品是否已被选中，选中则还要修改底下的total值
            if (selectbutton.checked && parseInt(thisproductcount.textContent) >= 0) {
                if (selectbutton.checked) {
                    const getselectcount = getall.querySelector('#selectcount')
                    const gettotalmoney = getall.querySelector('#totalmoney')
                    // console.log(getselectcount)
                    getselectcount.textContent = parseInt(getselectcount.textContent) - 1
                    gettotalmoney.textContent = (parseFloat(gettotalmoney.textContent) - parseFloat(proprice.textContent)).toFixed(1)
                    if (parseFloat(gettotalmoney.textContent) > parseFloat(usermoney)) {
                        gettotalmoney.style.color = 'red';
                    }
                    else {
                        gettotalmoney.style.color = '#fff';
                    }
                }
            }

        })
    })
}

//购物车页面全选单选购物车商品并且更新购买栏的总计
function selectbutton(whologin) {
    let totalmoney = 0
    let totalcount = 0
    let usermoney = whologin.money
    const getall = document.querySelector('body')
    const selectbutton = getall.querySelectorAll('.select')
    const selectallbutton = getall.querySelector('.selectAll')
    // console.log(selectallbutton)
    selectallbutton.addEventListener('click', (event) => {
        if (event.target.checked) {
            // 全选复选框被选中时，选中所有复选框
            //读取当前结算栏的总计和总选
            const getselectcount = getall.querySelector('#selectcount')
            const gettotalmoney = getall.querySelector('#totalmoney')
            //重新赋值
            totalcount = parseInt(getselectcount.textContent)
            totalmoney = parseFloat(gettotalmoney.textContent)
            selectbutton.forEach((checkbox) => {
                // console.log(checkbox.checked)
                if (!checkbox.checked) {
                    const productDadli = checkbox.closest('.product')
                    const count = productDadli.querySelector('.product-count')

                    totalcount = totalcount + parseInt(count.textContent)
                    const countMoney = productDadli.querySelector('.countMoney')
                    totalmoney = (parseFloat(totalmoney) + parseFloat(countMoney.textContent)).toFixed(1)
                    getselectcount.textContent = `${totalcount}`
                    gettotalmoney.textContent = `${totalmoney}`
                    // console.log(totalmoney);
                    // console.log(totalcount);
                }
                //全选之后如果余额不够则将总计变成红色
                if (parseFloat(gettotalmoney.textContent) > parseFloat(usermoney)) {
                    gettotalmoney.style.color = 'red';
                }
            })
            selectbutton.forEach(checkbox => checkbox.checked = true);
        } else {
            // 全选复选框取消选中时，取消选中所有复选框
            //读取当前结算栏的总计和总选
            const getselectcount = getall.querySelector('#selectcount')
            const gettotalmoney = getall.querySelector('#totalmoney')
            totalcount = parseInt(getselectcount.textContent)
            totalmoney = parseFloat(gettotalmoney.textContent)
            selectbutton.forEach((checkbox) => {
                if (checkbox.checked) {
                    const productDadli = checkbox.closest('.product')
                    const count = productDadli.querySelector('.product-count')
                    // console.log(count);
                    totalcount = totalcount - parseInt(count.textContent)
                    const countMoney = productDadli.querySelector('.countMoney')
                    // console.log(countMoney);
                    totalmoney = (totalmoney - parseFloat(countMoney.textContent)).toFixed(1)
                    getselectcount.textContent = `${totalcount}`
                    gettotalmoney.textContent = `${totalmoney}`
                    // console.log(totalmoney);
                    // console.log(totalcount);
                }
                if (parseFloat(gettotalmoney.textContent) <= parseFloat(usermoney)) {
                    gettotalmoney.style.color = '#fff';
                }
            })
            selectbutton.forEach(checkbox => checkbox.checked = false);
        }
    })

    //这里是单选
    selectbutton.forEach((checkbox) => {
        checkbox.addEventListener('click', (event) => {
            //读取当前结算栏的总计和总选
            const getselectcount = getall.querySelector('#selectcount')
            const gettotalmoney = getall.querySelector('#totalmoney')
            totalmoney = parseFloat(gettotalmoney.textContent)
            totalcount = parseInt(getselectcount.textContent)

            // 在这里处理点击事件
            const allChecked = Array.from(selectbutton).every(checkbox => checkbox.checked);
            selectallbutton.checked = allChecked; // 如果都被选中，则全选按钮选中，否则取消选中
            if (event.target.checked) {
                const productDadli = checkbox.closest('.product')
                const count = productDadli.querySelector('.product-count')

                totalcount = totalcount + parseInt(count.textContent)
                const countMoney = productDadli.querySelector('.countMoney')
                totalmoney = (totalmoney + parseFloat(countMoney.textContent)).toFixed(1)
                getselectcount.textContent = `${totalcount}`
                gettotalmoney.textContent = `${totalmoney}`
                if (parseFloat(gettotalmoney.textContent) > parseFloat(usermoney)) {
                    gettotalmoney.style.color = 'red';
                }
                // console.log(totalmoney);
                // console.log(totalcount);
            } else {

                const productDadli = checkbox.closest('.product')
                const count = productDadli.querySelector('.product-count')
                totalcount = totalcount - parseInt(count.textContent)
                const countMoney = productDadli.querySelector('.countMoney')
                totalmoney = (totalmoney - parseFloat(countMoney.textContent)).toFixed(1)
                getselectcount.textContent = `${totalcount}`
                gettotalmoney.textContent = `${totalmoney}`
                if (parseFloat(gettotalmoney.textContent) <= parseFloat(usermoney)) {
                    gettotalmoney.style.color = '#fff';
                }
                // console.log(totalmoney);
                // console.log(totalcount);
            }
        });
    });
}


//购物车页面购买已选的商品
function checkoutselcetproduct(whologin) {
    let Userpaycart = getUserpaycart(whologin)
    let Userorder = getUserorder(whologin)
    const getUsermessageINlocal = localStorage.getItem(`${whologin.Emailtext}`)
    let UsermessageINlocal = JSON.parse(getUsermessageINlocal)
    const getall = document.querySelector('body')

    let usermoney = whologin.money

    const selectbutton = getall.querySelectorAll('.select')
    const paybutton = getall.querySelector('.pay')


    paybutton.addEventListener('click', function () {
        const gettotalmoney = getall.querySelector('#totalmoney')
        const gettotalcount = getall.querySelector('#selectcount')
        // console.log(parseFloat(gettotalmoney.textContent))
        if (parseInt(gettotalcount.textContent) == 0) {
            alert('未选择需要购买的商品')
        }
        else if (parseFloat(gettotalmoney.textContent) > parseFloat(usermoney)) {
            alert('余额不足')
        }
        else {
            if (confirm('确定购买已选商品？')) {
                let insertType = `insert into [Order_${whologin.Emailtext}] values`
                const paycartcount = getall.querySelector('#paycartcount')
                selectbutton.forEach((checkbox) => {
                    // console.log(checkbox.checked)
                    //遍历所有的商品将已选上的商品挑出
                    // console.log(parseFloat(usermoney) - parseFloat(gettotalmoney.textContent))
                    if (checkbox.checked) {
                        //将购买的商品
                        //获取购物车的总数量
                        const productDadbox = checkbox.closest('.product')
                        const productID = productDadbox.getAttribute('id')
                        const proName = productDadbox.querySelector('.pname')
                        const proprice = productDadbox.querySelector('.price')
                        const proimageurl = productDadbox.querySelector('img')
                        const thisproductcount = productDadbox.querySelector('.product-count')
                        let timestamp = Date.now()
                        let randomNum = Math.floor(Math.random() * 1000)
                        let OrderId = `${timestamp}${randomNum}`
                        paycartcount.textContent = parseInt(paycartcount.textContent) - parseInt(thisproductcount.textContent)
                        //将购买的商品信息插入到历史订单表
                        insertType = insertType + `('${OrderId}','${productID}','${proName.textContent}',${parseFloat(proprice.textContent)},'${proimageurl.src}' ,${parseInt(thisproductcount.textContent)},'未发货'),`
                        //将购买的商品信息插入到本地历史订单表
                        let j = Userorder.ID.length
                        Userorder.ID[j] = productID
                        Userorder.pname[j] = proName.textContent
                        Userorder.price[j] = parseFloat(proprice.textContent)
                        Userorder.image_url[j] = proimageurl.src
                        Userorder.count[j] = parseInt(thisproductcount.textContent)
                        Userorder.status[j] = '未发货'
                        localStorage.setItem(`order_${whologin.Emailtext}`, JSON.stringify(Userorder))
                        //将商品移除购物车
                        for (let i = 0; i < Userpaycart.ID.length; i++) {
                            if (productID == Userpaycart.ID[i]) {
                                Userpaycart.ID.splice(i, 1)
                                Userpaycart.pname.splice(i, 1)
                                Userpaycart.image_url.splice(i, 1)
                                Userpaycart.count.splice(i, 1)
                                Userpaycart.price.splice(i, 1)
                                Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                                localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                                break
                            }

                        }

                        // console.log(totalmoney);
                        // console.log(totalcount);
                    }
                })
                // console.log(Userpaycart)

                if (insertType.endsWith(',')) {
                    insertType = insertType.slice(0, -1);
                }
                insertType = insertType + ` update useraccount set umoney=${(parseFloat(usermoney) - parseFloat(gettotalmoney.textContent)).toFixed(1)} where email='${UsermessageINlocal.Emailtext}'`
                //向后端插数据
                // console.log(insertType);
                fetch('/productinsertOrder', {
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
                            //修改本地用户的余额 等上面插入完成之后更新用户的余额
                            UsermessageINlocal.money = (parseFloat(usermoney) - parseFloat(gettotalmoney.textContent)).toFixed(1)
                            localStorage.setItem(`${whologin.Emailtext}`, JSON.stringify(UsermessageINlocal))
                            let User = {
                                name: UsermessageINlocal.name,
                                Emailtext: UsermessageINlocal.Emailtext,

                            }
                            let userpaycart = new URLSearchParams(User).toString()
                            //重新加载购物车页面
                            window.location.replace(`http://8.134.159.233/paycart.html?${userpaycart}`);
                        }

                        else {
                            alert(res.message)
                        }
                    })




            }
            //用户取消购买
            else { }
        }

    })
}

//购物车页面点击移除按钮
function deleteproductfrompaycart(whologin) {
    let Userpaycart = getUserpaycart(whologin)
    const getall = document.querySelector('body')
    const getdelete = getall.querySelectorAll('.delete')
    getdelete.forEach(button => {
        button.addEventListener('click', function () {
            if (confirm('确定移除该商品？')) {

                document.getElementById('loading').style.display = 'block';
                setTimeout(function () {
                    document.getElementById('loading').style.display = 'none';
                }, 2000)

                setTimeout(function () {
                    //获取购物车的总数量
                    const paycartcount = getall.querySelector('#paycartcount')
                    //获取该商品的父容器
                    const productDadbox = button.closest('.product')
                    //获取该商品的信息
                    const productID = productDadbox.getAttribute('id')
                    //获取该商品在购物车的数量
                    const thisproductcount = productDadbox.querySelector('.product-count')
                    //更新页面显示的购物车的数量
                    paycartcount.textContent = parseInt(paycartcount.textContent) - parseInt(thisproductcount.textContent)
                    //将用户的本地存储的购物车删除对应的商品
                    for (let i = 0; i <= Userpaycart.ID.length; i++) {
                        if (productID == Userpaycart.ID[i]) {
                            Userpaycart.ID.splice(i, 1)
                            Userpaycart.pname.splice(i, 1)
                            Userpaycart.image_url.splice(i, 1)
                            Userpaycart.count.splice(i, 1)
                            Userpaycart.price.splice(i, 1)
                            Userpaycart.paycartcount = parseInt(paycartcount.textContent)
                            localStorage.setItem(`paycart_${whologin.Emailtext}`, JSON.stringify(Userpaycart))
                            break
                        }
                    }
                    // console.log(Userpaycart)
                    let User = {
                        name: whologin.name,
                        Emailtext: whologin.Emailtext,

                    }
                    let userpaycart = new URLSearchParams(User).toString()
                    //删除完之后重新加载页面
                    window.location.replace(`http://8.134.159.233/paycart.html?${userpaycart}`);
                }, 2000);  // 


            }

        })
    })
}

//---------------当未登录时让所有的按钮都提示登录----------
function nobodylogin() {
    const getall = document.querySelectorAll('button')
    getall.forEach(button => {
        button.addEventListener('click', function () {
            alert('请先登录')
        })
    })
}

//不允许在3秒内重复刷新
function banrefresh() {
    const lastRefresh = sessionStorage.getItem('lastRefresh');
    const currentTime = Date.now();

    // 检查是否在3秒内刷新
    if (lastRefresh && currentTime - lastRefresh < 3000) {
        alert("3秒内无法重复此操作");
        return;
    }

    // 更新刷新时间
    sessionStorage.setItem('lastRefresh', currentTime);

}
