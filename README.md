# vue商城系统----vue+mondodb+express

### 安装
cnpm install

### import db数据 在mongodb文件夹中
mongoimport --host=127.0.0.1 -d db_shop -c users --file D:\VSCode\vsCodeData\shop\mongodb\users
mongoimport --host=127.0.0.1 -d db_shop -c goods --file D:\VSCode\vsCodeData\shop\mongodb\goods

### 启动后端服务
cd D:\VSCode\vsCodeData\shop\server\bin
node www

### 前端
cd D:\VSCode\vsCodeData\shop
npm run dev

