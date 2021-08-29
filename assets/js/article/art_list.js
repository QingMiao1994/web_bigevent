$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        // 页码值，默认请求第一页的数据
        pagenum: 1,
        // 每页显示几条数据，默认每页显示2条
        pagesize: 2,
        // 文章分类的 Id
        cate_id: '',
        // 文章的状态，可选值有：已发布、草稿
        state: ''
    }
    // 调用初始化文章分类方法
    initCate()
    // 调用获取文章列表数据方法
    initTable()

    // 获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        console.log(q);
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            // 指向存放分页的容器，值可以是容器ID、DOM对象。如：
            // 1. elem: 'id' 注意：这里不能加 # 号
            // 2. elem: document.getElementById('id')
            elem: 'pageBox',
            //数据总数。一般通过服务端得到
            count: total,
            // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            // 默认值:10
            limit: q.pagesize,
            // 每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框
            limits: [2, 3, 5, 10],
            // 起始页。一般用于刷新类型的跳页以及HASH跳页。
            curr: q.pagenum,
            // 当分页被切换时触发
            jump: function (obj, first) {
                console.log(obj.curr);
                //obj包含了当前分页的所有参数
                // obj.curr 得到当前页，以便向服务端请求对应页的数据。
                // obj.limit 得到每页显示的条数
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条数，赋值到q这个查询参数对象中
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    // 根据最新的q获取对应的数据列表，并渲染表格
                    initTable()
                }
            },
            layout: ['count', 'limit', 'prev', 'page', 'next', 'refresh', 'skip']
        });
    }
    // 通过代理的形式，为删除按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起根据 Id 删除文章分类的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后，
                    // 再重新调用initTable方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 调用获取文章列表数据方法
                    initTable()
                }
            })
        });
    })











})