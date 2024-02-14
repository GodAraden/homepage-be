# GodAraden 的个人主页 - 后端

技术栈：NestJS + Prisma + TypeScript

已预装：权限校验，http 响应格式化，日志记录（未持久化）

已预置：Github Action Workflow

# 博客系统的账号密码

在项目根目录下新建 .env.pwd.local 文件，插入以下内容

```bash
USERINFO={"username":"xxx","password":"xxx"}
```

因为包含大括号、双引号，所以在 Github Secrets 中的变量要做转义处理：

```bash
USERINFO=\{\"username\":\"xxx\",\"password\":\"xxx\"\}
```

# 获取博客封面所需的 key

本项目中博客的封面图是通过 [The Cat API](https://thecatapi.com/) 获取到的，发送请求时需在请求头中携带密钥

在项目根目录下新建 .env.key.local 文件，插入以下内容

```bash
X_API_KEY=xxxxxxxxxxx
```
