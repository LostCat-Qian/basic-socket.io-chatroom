# 基于socket.io实现的简易聊天室

## 运行项目
1. 首先运行 `npm install` 或 `yarn` 下载依赖
2. 在运行前建议安装`nodemon`
   - `npm install -g nodemon`
3. 运行项目
   - `nodemon app.js` 或者 `node app.js`
   - 默认访问端口号为3000
   - `http://localhost:3000`

## 部分说明
1. 因为jQuery-emoji的代码有些bug，其中的一个文件使用了`.load`、`.error`这类的方法，但是jQuery在1.8之后就已经不支持了。
2. 更改了部分jQuery-emoji的文件，替换了上述方法，改为`.on('load', function() {})`的格式。
3. 完成了项目局域网部署。

## 2023/12/15
- 没想到B站的朋友还有在学习socket.io的，想参考我的项目，我现在已经工作了，正巧最近在使用docker，我就对其添加一个docker支持，各位有云服务器的可以部署着玩
- dockerfile默认开的端口是8888，所以各位记得在app.js文件中开的PORT要改为8888端口，让两者保持一致就行
- 部署到云服务器后，记得要把前端部分连接socket的地址修改成云服务器地址+端口
