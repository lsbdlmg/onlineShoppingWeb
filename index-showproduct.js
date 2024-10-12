

//画左盒子
function displayleft(product) {
    const shopbox = document.querySelector('.shopbox')

    const leftbox = document.createElement('div');
    leftbox.classList.add('leftbox')
    leftbox.classList.add('product')

    const idName = `${product.id}`
    leftbox.setAttribute('id', idName)
    if (product.pname == '此处商品已下架') {
        leftbox.innerHTML = `
  <a href="${product.image_url}" target="_blank"><img src="${product.image_url}" alt="${product.pname}" class="product-image"></a>
            <p><span class="pname">${product.pname}</span><b>|</b><span class="price">${product.price}</span>金币</p>
            <p class="paycartbutton">
             <span class="product-count"></span>
            </p>
          `;
    }
    else {
        leftbox.innerHTML = `
            <a href="${product.image_url}" target="_blank"><img src="${product.image_url}" alt="${product.pname}" class="product-image"></a>
            <p><span class="pname">${product.pname}</span><b>|</b><span class="price">${product.price}</span>金币</p>
            <p class="paycartbutton">
            <button class="add-paycart">加入</button>
            <button class="min-paycart">移除</button>
            已加入购物车(<span class="product-count">0</span>)
            </p>
          `;
    }

    shopbox.appendChild(leftbox);
    ;
}
// 画右盒子
function displayrightbox() {
    const shopbox = document.querySelector('.shopbox')

    const rightbox = document.createElement('div');

    rightbox.classList.add('rightbox')
    shopbox.appendChild(rightbox)

    const rightboxTable = document.createElement('table')
    rightbox.appendChild(rightboxTable)
    const rightboxTableul = document.createElement('ul')
    rightboxTable.appendChild(rightboxTableul)
    return rightboxTableul
}
//右盒子放数据
function displayright(product, rightboxTableul) {

    const rightboxTableulli = document.createElement('li')
    rightboxTableulli.classList.add('product')

    const idName = `${product.id}`
    if (idName == "pro-004") {
        rightboxTableulli.classList.add("box-right")
    }
    if (idName == "pro-005" || idName == "pro-006" || idName == "pro-007") {
        rightboxTableulli.classList.add("box-down")
    }
    if (idName == "pro-008") {
        rightboxTableulli.classList.add("box-right-down")
    }
    rightboxTableulli.setAttribute('id', idName)

    if (product.pname == '此处商品已下架') {
        rightboxTableulli.innerHTML = `
             <a href="${product.image_url}" target="_blank"><img src="${product.image_url}" alt="${product.pname}" class="product-image"></a>
            <p><span class="pname">${product.pname}</span><b>|</b><span class="price">${product.price}</span>金币</p>
            <p class="paycartbutton">
             <span class="product-count"></span>
            </p>
          `;
    }
    else {
        rightboxTableulli.innerHTML = `
            <a href="${product.image_url}" target="_blank"><img src="${product.image_url}" alt="${product.pname}" class="product-image"></a>
            <p><span class="pname">${product.pname}</span><b>|</b><span class="price">${product.price}</span>金币</p>
            <p class="paycartbutton">
            <button class="add-paycart">加入</button>
            <button class="min-paycart">移除</button>
            已加入购物车(<span class="product-count">0</span>)
            </p>
          `;
    }
    rightboxTableul.appendChild(rightboxTableulli);
}

async function showProduct() {
    let productsArr = [];

    try {
        // 使用 await 等待 fetch 请求完成
        const response = await fetch('/products');
        const data = await response.json();
        productsArr = data;

        // 显示左边第一个产品
        displayleft(productsArr[0]);

        // 获取右边 box 并显示其他产品
        let rightboxTableul = displayrightbox();
        for (let i = 1; i <= 8; i++) {
            displayright(productsArr[i], rightboxTableul);
        }

    } catch (error) {
        console.error('获取产品数据失败:', error);
    }
}


function allfunction() {
    document.addEventListener('DOMContentLoaded', () => {
        showProduct().then(() => {
            let whologin = checkWhologin()
            // console.log(whologin)
            if (whologin.who == 'nobody') {
                nobodynav()
                nobodylogin()
            }

            if (whologin.who == 'user') {
                banrefresh()
                usernav(whologin)
                //退出登录
                const getlogout = document.querySelector('.logout')
                getlogout.addEventListener('click', function () {
                    const lastRefresh = sessionStorage.getItem('lastRefresh');
                    const currentTime = Date.now();
                    // 检查是否在5秒内刷新
                    if (lastRefresh && currentTime - lastRefresh < 5000) {
                        alert("5秒内无法退出登录！");
                    }
                    else if (confirm("您确定退出登录吗")) { logout() }

                })
                //用户点击购物车页面
                UserGoPaycart(whologin)
                //用户点击历史订单页面
                UserGoOrder(whologin)

                //添加购物车和移出购物车功能
                // localStorage.removeItem('whologin')
                localStorage.removeItem(`paycart_${whologin.Emailtext}`)
                localStorage.removeItem(`order_${whologin.Emailtext}`)
                getUserpaycartfromdatabase(whologin)
                ReduceProduct(whologin)
                ADDProduct(whologin)
                //切去其他页面是将本地购物车的内容插入到数据库里
                document.addEventListener('visibilitychange', function () {
                    if (document.visibilityState === 'hidden') {
                        // localStorageInsertPaycart(whologin)
                    }
                    //切回来时如果购买了东西就要修改余额的显示数目
                    else {
                        //要重新读取用户信息
                        let whologin = checkWhologin()
                        const getusermoney = document.querySelector('.usermoney')
                        getusermoney.textContent = `剩余金币:${whologin.money}`
                        updateCartDisplay(whologin)
                        // console.log(whologin.money)

                    }
                });

                //页面关闭时将本地购物车的内容插入到数据库里
                window.addEventListener('beforeunload', function (event) {
                    localStorageInsertPaycart(whologin)

                });


            }


            if (whologin.who == 'manager') {
                localStorage.removeItem('managerGetuserOrder');
                managernav(whologin)

                showmanagement()

                //管理员点击退出登录
                const getlogout = document.querySelector('.logout')
                getlogout.addEventListener('click', function () {
                    const lastRefresh = sessionStorage.getItem('lastRefresh');
                    const currentTime = Date.now();
                    // 检查是否在5秒内刷新
                    if (lastRefresh && currentTime - lastRefresh < 5000) {
                        alert("5秒内无法退出登录！");
                    }
                    else if (confirm("您确定退出登录吗")) { logout() }

                })
                //更新页面的商品框的内容
                managerShowproduct()
                uplodeimage()
                editproduct()
                updateProductIndatabase()
                deleteproduct()
                //上传用户信息
                uploaduser()
                //搜索用户
                searchUser()
                //修改用户信息

                managerSelectproductStatus()



            }


        })

    });

}