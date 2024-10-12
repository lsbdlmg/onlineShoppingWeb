function nobodynav() {
    const nav = document.querySelector('.nav')
    const navlogin = document.createElement('a');
    navlogin.classList.add('login')
    navlogin.classList.add('nobody')
    navlogin.href = 'login.html';  // 设置 href
    navlogin.innerHTML = '登录'
    const navregister = document.createElement('a');
    navregister.classList.add('reg')
    navregister.href = 'register.html';  // 设置 href
    navregister.innerHTML = '注册'
    const navpaycar = document.createElement('button');
    navpaycar.classList.add('paycart')
    navpaycar.innerHTML = '购物车(<span id="paycartcount">0</span>)'
    const navorder = document.createElement('button')
    navorder.classList.add('order')
    navorder.innerHTML = '历史订单'

    nav.appendChild(navlogin)
    nav.appendChild(navregister)
    nav.appendChild(navpaycar)
    nav.appendChild(navorder)
}
function usernav(whologin) {
    const nav = document.querySelector('.nav')
    const navUserName = document.createElement('span');
    navUserName.classList.add('username')
    navUserName.innerHTML = '欢迎回来 ' + whologin.name
    const navUserMoney = document.createElement('span')
    navUserMoney.classList.add('usermoney')
    navUserMoney.innerHTML = '剩余金币:' + whologin.money
    const navpaycar = document.createElement('button');
    navpaycar.classList.add('paycart')

    navpaycar.innerHTML = '购物车(<span id="paycartcount">0</span>)'
    const navlogout = document.createElement('button')
    navlogout.classList.add('logout')
    navlogout.innerHTML = '退出登录'
    const navorder = document.createElement('button')
    navorder.classList.add('order')
    navorder.innerHTML = '历史订单'
    nav.appendChild(navUserName)
    nav.appendChild(navUserMoney)
    nav.appendChild(navpaycar)
    nav.appendChild(navlogout)
    nav.appendChild(navorder)
}
function managernav(whologin) {
    const nav = document.querySelector('.nav')
    const navUserName = document.createElement('span');
    navUserName.classList.add('username')
    navUserName.innerHTML = '欢迎回来管理员 ' + whologin.name
    const navUserMoney = document.createElement('span')
    navUserMoney.classList.add('usermoney')
    const updateproduct = document.createElement('button')
    updateproduct.classList.add('updateproduct')
    updateproduct.innerHTML = '将商品上传至数据库'
    const navlogout = document.createElement('button')
    navlogout.classList.add('logout')
    navlogout.innerHTML = '退出登录'
    nav.appendChild(navUserName)
    nav.appendChild(updateproduct)
    nav.appendChild(navlogout)
}