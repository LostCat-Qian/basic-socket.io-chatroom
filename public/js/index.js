/**
 * 聊天室的主要功能
 */

// 1. 连接socketIO服务
const socket = io('http://localhost:3000')

let curr_username = ''
let curr_avatar = ''

// 2. 登录功能
$('.avatars li').on('click', function () {
  $(this).addClass('active').siblings().removeClass('active')
})

$('.login-btn').on('click', function () {
  // 获取用户名
  const username = $('#username').val().trim()
  if (!username) {
    return alert('请输入用户名！')
  }

  // 获取已选择的头像
  const avatar = $('.avatars li.active img').attr('src')

  // 传递用户信息到socket.io服务器
  socket.emit('login', {
    username: username,
    avatar: avatar
  })

  curr_username = username
  curr_avatar = avatar
})

// 监听登录失败事件
socket.on('loginError', (data) => {
  alert(data.msg)
})

// 监听登陆成功事件
socket.on('loginSuccess', ({ data }) => {
  // alert(data.msg)
  $('#login-container').fadeOut()
  $('#chat-container').fadeIn()

  // 设置个人信息
  $('.self .username').text(data.username)
  $('.self .avatar-url').attr('src', data.avatar)
})

// 添加系统消息
// 监听添加用户的事件
socket.on('addUser', (data) => {
  $('.comments .main-chat').append(`
    <div class="system-info">
      ${data.username} 加入了群聊
    </div>
  `)
  scrollIntoView('.main-chat')
})

// 监听用户离开的事件
socket.on('delUser', (username) => {
  $('.comments .main-chat').append(`
    <div class="system-info">
      ${username} 离开了群聊
    </div>
  `)
  scrollIntoView('.main-chat')
})

// 监听用户列表的消息
socket.on('userList', (data) => {
  $('.other-users').html('')

  data.forEach((item) => {
    $('.other-users').append(`
      <div class="user-card">
        <img src="${item.avatar}" alt="">
        <span>${item.username}</span>
      </div>
    `)
  })

  $('.comments .title').text(`聊天室(${data.length})`)
})

// 发送消息
$('#sendMsg').on('click', () => {
  // 获取到聊天的内容
  const content = $('#content').text() || $('#content').html()
  if (!content) {
    return alert('请输入内容！')
  }

  socket.emit('sendMsg', {
    msg: content,
    username: curr_username,
    avatar: curr_avatar
  })

  $('#content').text('')
})

// 监听聊天的消息
socket.on('recieveMsg', (data) => {
  // 将接收到的消息显示到聊天窗口
  if (data.username === curr_username) {
    $('.main-chat').append(`
      <div class="self-comment">
        <span class="info">${data.msg}</span>
        <img src="${data.avatar}" alt="">
      </div>
    `)
  } else {
    $('.main-chat').append(`
      <div class="other-comment">
        <div class="box-info">
          <span class="username">${data.username}</span>
          <span class="info">${data.msg}</span>
        </div>
        <img src="${data.avatar}" alt="">
      </div>
    `)
  }

  scrollIntoView('.main-chat')
})

const scrollIntoView = (target) => {
  $(target).children(':last').get(0).scrollIntoView()
}

// 发送图片的功能
$('#file').on('change', function () {
  const file = this.files[0]

  // 将这个文件发送到服务器，借助于H5的fileReader
  const fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = function () {
    socket.emit('sendImg', {
      username: curr_username,
      avatar: curr_avatar,
      img: fr.result
    })
  }
})

// 监听图片聊天信息
socket.on('recieveImg', (data) => {
  if (data.username === curr_username) {
    $('.main-chat').append(`
      <div class="self-comment">
        <span class="info">
          <img src="${data.img}">
        </span>
        <img src="${data.avatar}" alt="">
      </div>
    `)
  } else {
    $('.main-chat').append(`
      <div class="other-comment">
        <div class="box-info">
          <span class="username">${data.username}</span>
          <span class="info">
            <img src="${data.img}">
          </span>
        </div>
        <img src="${data.avatar}" alt="">
      </div>
    `)
  }

  $('.main-chat img:last').on('load', function () {
    scrollIntoView('.main-chat')
  })
})

$('.icon-emoji-happy').on('click', function () {
  $('#content').emoji({
    button: '.icon-emoji-happy',
    showTab: false,
    animation: 'slide',
    position: 'topRight',
    icons: [
      {
        name: 'QQ表情',
        path: './jquery-emoji/dist/img/tieba/',
        maxNum: 50,
        excludeNums: [41, 45, 54],
        file: '.jpg'
      }
    ]
  })
})
