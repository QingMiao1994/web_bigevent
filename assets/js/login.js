$(function () {
    // 单击"去注册账号"的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 单击"去登陆"的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 从layui中获取form对象
    var form = layui.form
    // 从layui中获取layer对象
    var layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        pwd: [
            // 数组[0]: 要匹配的正则表达式
            // 数组[1]: 匹配失败时，提示信息

            //^:字符串的开始位置
            //\S:非空白符  \s 空白符
            //[]{ 6, 12}6~12~个字符
            //$: 字符串的结束为止
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function (vaule) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== vaule) {
                return '两次密码不一致'
            }
        }
    })
    //监听登陆表单的提交事件
    $('#form_login').submit(function (e) {
        // 1.阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单内容 序列化表单值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败!');
                }
                // console.log(res);
                layer.msg('登陆成功!');
                // 把token保存到本地
                //token：用于有权限接口的身份认证
                localStorage.setItem('token', res.token)
                //Location 对象是 window 对象的一部分，可通过 window.Location 属性对其进行访问。
                //对象属性 href:返回完整的URL

                location.href = '/index.html'

            }
        })
    })
    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1.阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功，请登录！");
            // 模拟一个点击行为
            $('#link_login').click()
        })
    })

})
