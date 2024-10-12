// 验证邮箱格式
function validateEmailInput() {
    const email = document.getElementById("inputEmail").value;
    const emailError = document.getElementById("emailError");
    const emailRegex = /^[1-9][0-9]{4,10}@qq\.com$/;

    if (!emailRegex.test(email)) {
        emailError.textContent = "请输入有效的邮箱地址";
    } else {
        emailError.textContent = ""; // 消除错误信息
    }
}
// 验证密码长度
function validatePasswordInput() {

    const password = document.getElementById("inputpwd-1").value;
    const passwordError = document.getElementById("passwordError");
    validateConfirmPasswordInput()
    if (password.length < 6 || password.length > 18) {
        passwordError.textContent = "密码必须为6-18位";
    } else {
        passwordError.textContent = ""; // 消除错误信息
    }
}

// 验证确认密码是否一致
function validateConfirmPasswordInput() {
    const password = document.getElementById("inputpwd-1").value;
    const confirmPassword = document.getElementById("inputpwd-2").value;
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    if (confirmPassword !== password) {
        confirmPasswordError.textContent = "两次输入的密码不一致";
    } else {
        confirmPasswordError.textContent = ""; // 消除错误信息
    }
}

// 验证昵称非空
function validateNicknameInput() {

    const nickname = document.getElementById("inputName").value;
    const nicknameError = document.getElementById("nicknameError");

    if (nickname.trim() === "") {
        nicknameError.textContent = "昵称不能为空";
    } else {
        nicknameError.textContent = ""; // 消除错误信息
    }
}

//验证码是否正确
let randomCode = 0
function validateCodeInput(verificationCode) {
    const code = document.getElementById("inputcode").value;
    const codeError = document.getElementById("codeError");

    if (code != verificationCode || !code) {
        codeError.textContent = "验证码错误";
        return true
    } else {
        codeError.textContent = ""; // 消除错误信息
    }
}

// 验证邮箱是否合理
function validateEmail(email) {
    const emailRegex = /^[1-9][0-9]{4,10}@qq\.com$/;

    if (!emailRegex.test(email)) {
        return false
    }
    else { return true }
}
//-------------------------------------------------------------


//点击发送验证码
function sendVerificationCode(button) {
    //发送验证码前先验证是否输入正确

    validateEmailInput();
    isEmailUsed().then(EmailUsed => {
        if (EmailUsed) {
            const emailError = document.getElementById("emailError")
            emailError.textContent = "该邮箱已被使用"
        }
        else {
            validatePasswordInput();
            validateConfirmPasswordInput();
            validateNicknameInput();
            const emailError = document.getElementById("emailError").textContent;
            const passwordError = document.getElementById("passwordError").textContent;
            const confirmPasswordError = document.getElementById("confirmPasswordError").textContent;
            const nicknameError = document.getElementById("nicknameError").textContent;
            // 如果没有错误，允许提交表单
            if (!emailError && !passwordError && !confirmPasswordError && !nicknameError) {
                const email = document.getElementById("inputEmail").value;
                // console.log(email)
                //添加一个倒计时在5s内无法再次点击查询
                let clicktime = 30
                button.disabled = true
                button.innerHTML = `${clicktime}后可再次发送验证码`
                let clicktimeinterval = setInterval(function () {
                    clicktime--
                    button.innerHTML = `${clicktime}s后可再次<br>发送验证码`
                    if (clicktime <= 0) {
                        clearInterval(clicktimeinterval)
                        button.disabled = false
                        button.innerHTML = `发送验证码`
                    }
                }, 1000)
                fetch('/send-verification-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            randomCode = data.verificationCode
                            alert("验证码已发送到您的邮箱！");
                            // console.log(randomCode)
                        } else {
                            alert("发送验证码失败，请稍后再试！");
                        }
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert("发送验证码失败，请稍后再试！");
                    });
            } else {

            }

        }
    })


}

//点击发送验证码时验证邮箱是否已被使用
async function isEmailUsed() {
    const email = document.getElementById("inputEmail").value;

    try {
        const response = await fetch('/isEmailUsed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Emailtext: email,
            })
        });

        const res = await response.json();
        // console.log(res.message)
        // 根据服务器返回结果返回相应值
        if (res.success) {
            // 该邮箱已被使用

            return true;
        } else {
            // 该邮箱未被使用
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false; // 处理错误时返回 false
    }
}

//提交表单后信息无误后将该用户信息插入到数据库
function insertUseraccountToDataBase() {
    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputpwd-1").value;
    const nickname = document.getElementById("inputName").value;
    fetch('/Userregister', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Emailtext: email,
            Password: password,
            Uname: nickname
        })
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // 登录成功，跳转到登录页
                alert("注册成功！返回登录页面");
                createUserPaycart()
            }
            else {
                // 登录失败，显示错误信息
                alert("注册失败！")
            }
        })
}

//提交表单后根据邮箱创建一个该用户的购物车表
function createUserPaycart() {
    const email = document.getElementById("inputEmail").value;
    fetch('/createUserPaycart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Emailtext: email,
        })
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // 登录成功，跳转到登录页
                createUserOrder()
            }
            else {
                // 登录失败，显示错误信息
                alert(res.message)
            }
        })
}

//提交表单后根据邮箱创建一个该用户的历史订单表
function createUserOrder() {

    const email = document.getElementById("inputEmail").value;
    fetch('/createUserOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Emailtext: email,
        })
    })
        .then(response => response.json())
        .then(res => {
            if (res.success) {
                // 成功，跳转到登录页
                window.location.replace('http://8.134.159.233/login.html');
            }
            else {

                alert(res.message)
            }
        })
}

// 提交表单并且再次验证所有字段
function submitForm(event) {

    event.preventDefault();
    validateEmailInput();
    validatePasswordInput();
    validateConfirmPasswordInput();
    validateNicknameInput();
    validateCodeInput(randomCode);
    const emailError = document.getElementById("emailError").textContent;
    const passwordError = document.getElementById("passwordError").textContent;
    const confirmPasswordError = document.getElementById("confirmPasswordError").textContent;
    const nicknameError = document.getElementById("nicknameError").textContent;
    const codeError = document.getElementById("codeError").textContent;

    // 如果没有错误，允许提交表单
    if (!emailError && !passwordError && !confirmPasswordError && !nicknameError && !codeError) {
        //
        isEmailUsed().then(EmailUsed => {
            if (EmailUsed) {
                const emailError = document.getElementById("emailError")
                emailError.textContent = "该邮箱已被使用"
            }
            else {
                insertUseraccountToDataBase()
            }
        }

        )


    } else {

    }
}



