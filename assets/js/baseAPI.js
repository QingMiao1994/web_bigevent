//注意：每次调用$.get()或者$.post或者$.ajax()的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统一为有权限的接口，设置headers请求头
    // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
    // 注释：indexOf() 方法对大小写敏感！
    // 注释：如果要检索的字符串值没有出现，则该方法返回 -1。
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载 complete 回调函数
    // 无论成功还是失败，最终都会调用 complete 回调函数
    options.complete = function (res) {
        console.log("执行了 complete 回调函数");
        // 在 complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token')
            // 2.强制跳转到登陆页面
            location.href = '/login.html'
        }
    }
})