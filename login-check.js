


function checkWhologin() {
    let getwhologinsessionStorage = sessionStorage.getItem('whologin')
    if (getwhologinsessionStorage) {
        let whologinsessionStorage = JSON.parse(getwhologinsessionStorage)
        if (whologinsessionStorage.who == 'nobody') {
            let whologin = {
                who: 'nobody',
                name: '',
                money: 0,
                Emailtext: ''
            }
            return whologin
        }
        else if (whologinsessionStorage.who == 'user') {
            let getwhologinlocalStorage = localStorage.getItem(`${whologinsessionStorage.Emailtext}`)
            let whologinlocalStorage = JSON.parse(getwhologinlocalStorage)
            return whologinlocalStorage
        }
        else if (whologinsessionStorage.who == 'manager') {
            let getwhologinlocalStorage = localStorage.getItem(`manager_${whologinsessionStorage.Emailtext}`)
            let whologinlocalStorage = JSON.parse(getwhologinlocalStorage)
            return whologinlocalStorage
        }
    }
    else {
        let whologin = {
            who: 'nobody',
            name: '',
            money: 0,
            Emailtext: ''
        }
        return whologin
    }
}
function userlogin() {
    {

        const Emailtext = document.querySelector('.inputEmail').value

        // console.log(Emailtext)
        const pwdtext = document.querySelector('.inputpwd').value

        // 使用 fetch API 向后端发送登录请求
        fetch('/Userlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Emailtext: Emailtext,
                Password: pwdtext
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    // 登录成功，跳转到主页
                    let whologin =
                    {
                        who: 'nobody',
                        name: '',
                        money: 0,
                        Emailtext: ''
                    }
                    whologin.who = 'user'
                    whologin.name = res.data.uname
                    whologin.money = res.data.umoney
                    whologin.Emailtext = res.data.email
                    sessionStorage.setItem('whologin', JSON.stringify(whologin))
                    localStorage.setItem(`${whologin.Emailtext}`, JSON.stringify(whologin))
                    // console.log(whologin)
                    let User = {
                        name: whologin.name,
                        Emailtext: whologin.Emailtext

                    }
                    let Userpaycart = new URLSearchParams(User).toString()
                    document.getElementById('loading').style.display = 'block';
                    setTimeout(function () {
                        document.getElementById('loading').style.display = 'none';
                        window.location.replace(`http://8.134.159.233?${Userpaycart}`);
                    }, 2000)
                    // console.log('登陆成功')

                } else {
                    // 登录失败，显示错误信息
                    document.querySelector('.message').innerText = '登录失败，邮箱或密码错误';
                }
            })
            .catch(error => {
                console.error('登录请求失败:', error);
                document.querySelector('.message').innerText = '登录失败，请稍后再试';
            });

    }
}



function managerlogin() {
    {

        const Emailtext = document.querySelector('.inputEmail').value

        // console.log(Emailtext)
        const pwdtext = document.querySelector('.inputpwd').value

        // 使用 fetch API 向后端发送登录请求
        fetch('/Managerlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Emailtext: Emailtext,
                Password: pwdtext
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    // 登录成功，跳转到主页
                    let whologin =
                    {
                        who: 'nobody',
                        name: '',
                        money: 0,
                        Emailtext: ''
                    }
                    whologin.who = 'manager'
                    whologin.name = res.data.mname

                    whologin.Emailtext = res.data.email
                    sessionStorage.setItem('whologin', JSON.stringify(whologin))
                    localStorage.setItem(`manager_${whologin.Emailtext}`, JSON.stringify(whologin))
                    // console.log(whologin)
                    let User = {
                        who: whologin.who,
                        name: whologin.name,
                        Emailtext: whologin.Emailtext

                    }
                    let Userpaycart = new URLSearchParams(User).toString()
                    document.getElementById('loading').style.display = 'block';
                    setTimeout(function () {
                        document.getElementById('loading').style.display = 'none';
                        window.location.replace(`http://8.134.159.233?${Userpaycart}`);
                    }, 2000)
                    // console.log('登陆成功')

                } else {
                    // 登录失败，显示错误信息
                    document.querySelector('.message').innerText = '登录失败，邮箱或密码错误';
                }
            })
            .catch(error => {
                console.error('登录请求失败:', error);
                document.querySelector('.message').innerText = '登录失败，请稍后再试';
            });

    }
}



function logout() {
    let whologin = sessionStorage.getItem('whologin')
    let getwhologin = JSON.parse(whologin)
    getwhologin.who = 'nobody'
    getwhologin.name = ''
    getwhologin.money = 0
    getwhologin.Emailtext = ''
    // console.log(getwhologin)
    sessionStorage.setItem('whologin', JSON.stringify(getwhologin))
    window.location.replace('http://8.134.159.233')
}


