# JWTnodejs_reactjsApp
## 1. Download file
### Clone file từ github :[JWT SEVER API](https://github.com/khavy1203/Booking_Care_BE)
### Clone file từ github :[JWT CLIENT API](https://github.com/khavy1203/Booking_Care_FE)

## 2. Cài đặt môi trường Nodejs lên windown : [Document enviroment Nodejs](https://enews.agu.edu.vn/index.php?option=com_content&view=article&id=21117&Itemid=128/)
## 3. Cài đặt phần mềm quản lý Nodejs : [Manager Version Node NVM](https://stackjava.com/nodejs/nvm-la-gi-cai-dat-nvm-tren-windows-node-js.html/)

`nvm install <version> [arch]:` cài đặt Node.js

`nvm use [version] [arch]:` chỉ định bản Node.js được sử dụng

`nvm list:` liệt kê các bản Node.js đã được cài và bản Node.js đang được sử dụng
 
 `Cài đặt và chọn Node version 14.19.x`
 ## 4. Cài đặt warmp sever : [Tutorial install WampServer](https://quantrimang.com/cai-dat-va-cau-hinh-wamp-server-173986/)
 ### Cấu hình sever :
 `Apache Version:` 2.4.46  - Documentation Apache
 
`Server Software:` Apache/2.4.46 (Win64) PHP/7.4.9 - Port defined for Apache: 80

`PHP Version:` 7.4.9  - Documentation PHP

`PhpMyAdmin:` 5.1.1
## 5. Cài đặt Visual Code : [Tutorial install VisulCode](https://quantrimang.com/cai-visual-studio-code-tren-windows-10-172172/)
### Mở file trên trình duyệt Visual Code :
Run cmd (dowload package): `npm i`
Mapping database : `yarn sequelize-cli db:migrate`
Database please Contact me :[Khavy1203](hhttps://www.facebook.com/nhoke.bola/)
## 6. Setting .ENV
### URL FrontEnd sẽ gọi API (tránh C0RS) 
`REACT_URL` = "http://localhost:3000"

## 7. Call API từ phía FrontEnd
***
```Javascript
routes.all("*", checkUserJwt, checkUserPermission,);//mặc định các 
//router sẽ chạy qua 2 cái check quyền này trước rồi mới thực hiện tiếp các tác vụ bên dưới

    routes.post("/register", apiController.handleRegister);
    routes.post("/login", apiController.handleLogin);
    routes.post("/logout", apiController.handleLogout);

    //user router
    routes.get("/user/read", userController.readFunc);
    routes.post("/user/create", userController.createFunc);
    routes.put("/user/update", userController.updateFunc);
    routes.delete("/user/delete", userController.deleteFunc);
    routes.get("/account", userController.getUserAccount);

    //role router
    routes.post("/role/create", roleController.createFunc);
    routes.get("/role/read", roleController.readFunc);
    routes.delete("/role/delete", roleController.deleteFunc);
    routes.get("/role/by-group/:groupId", roleController.getRoleByGroup);
    routes.post("/role/assign-to-group", roleController.assignRoleToGroup);

    routes.get("/group/read", groupController.readFunc);
    
    return app.use("/api/v1/", routes);
```
---
#### Tắt phân quyền để gọi API trong postmain :
* Mở file `src\middleware\JWTaction.js`
* Kéo xuống vào function `checkUserPermission`
* Sửa check quyền : 
```Javascript
 let canAccess = roles.some(item => item.url === currentUrl || currentUrl.includes(item.url));//duyệt hết phần tử trả ra trạng thái true or false
``` 
thành
`let canAccess = true`
## 8 Call API từ Postmain

Chọn method POST `Domain+/api/v1/login`

Chọn `x-www-form-urlencode`

`account:khavy114@gmail.com`

`password:123456789`

`Send` : Api sẽ trả về mọi trạng thái thông tin