$(function () {
    // 从layui中获取form对象
    var form = layui.form
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
        samePwd: function (vaule) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var oldPwd = $('[name=oldPwd]').val()
            if (oldPwd === vaule) {
                return '新旧密码不能相同'
            }
        },
        // 校验两次密码是否一致
        repwd: function (vaule) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var newPwd = $('[name=newPwd]').val()
            if (newPwd !== vaule) {
                return '两次密码不一致'
            }
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})