# 基于socket.io实现的简易聊天室

## 运行项目
1. 首先在运行前建议安装`nodemon`
   - `npm install -g nodemon`
2. 运行项目
   - `nodemon app.js` 或者 `node app.js`
   - 默认访问端口号为3000
   - `http://localhost:3000`

## 部分说明
1. 因为jQuery-emoji的代码有些bug，其中的一个文件使用了`.load`、`.error`这类的方法，但是jQuery在1.8之后就已经不支持了。
2. 更改了部分jQuery-emoji的文件，替换了上述方法，改为`.on('load', function() {})`的格式。