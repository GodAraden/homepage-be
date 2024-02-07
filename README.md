# GodAraden 的个人主页 - 后端

技术栈：NestJS + Prisma + TypeScript

已预装：权限校验，http 响应格式化，日志记录（未持久化）

已预置：Github Action Workflow

# 博客系统的账号密码

在项目根目录下新建 .env.local 文件，插入以下内容

```bash
USERINFO={"username":"xxx","password":"xxx"}
```

因为包含大括号、双引号，所以在 Github Secrets 中的变量要做转义处理：

```bash
USERINFO=\{\"username\":\"xxx\",\"password\":\"xxx\"\}
```
