const express = require('express')
const socketIO = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const PORT = 3000

// 记录所有已登录用户，保证用户名唯一
const users = []

// 处理静态资源
app.use(express.static('public'))
app.use(express.static('node_modules'))

app.get('/', (req, res) => {
  res.redirect('/index.html')
})

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

server.listen(PORT, () => {
  console.log('Listening in port 3000...')
})

const io = socketIO(server)

io.on('connection', (socket) => {
  console.log('新用户连接了...')

  socket.on('login', (data) => {
    const user = users.find((item) => item.username === data.username)

    if (user) {
      // 表示用户存在
      // 服务器响应用户：当前用户已存在，登陆失败
      socket.emit('loginError', {
        msg: '登陆失败，用户已存在！'
      })
    } else {
      // 用户不存在
      users.push(data)
      // 响应用户，登陆成功
      socket.emit('loginSuccess', {
        data: data,
        msg: '登录成功'
      })

      // 将目前已在聊天室的所有用户返回
      io.emit('userList', users)

      // 告诉所有用户，有新用户加入聊天室，广播消息
      io.emit('addUser', data)

      // 将登录的用户名和头像存储起来
      socket.username = data.username
      socket.avatar = data.avatar
    }
  })

  // 监听用户用户断开连接
  socket.on('disconnect', () => {
    // 把当前用户的信息从users中删除，然后广播有人离开的消息
    const index = users.findIndex((item) => item.username === socket.username)
    users.splice(index, 1)

    io.emit('delUser', socket.username)
    io.emit('userList', users)
  })

  // 接收被发送的消息内容
  socket.on('sendMsg', (data) => {
    // 广播给所有用户
    io.emit('recieveMsg', data)
  })

  // 接收图片信息
  socket.on('sendImg', (data) => {
    // 广播
    io.emit('recieveImg', data)
  })
})
