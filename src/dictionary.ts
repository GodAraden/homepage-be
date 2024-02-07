export const tips = {
  httpExeceptions: {
    needLogin: '[Request Error]: User Not Login',
    loginFailed: '[Request Error]: Login Failed',
    noPermission: '[Request Error]: Permission Denied',
    validation: '[Request Error]: Validation Failed',
  },
  prismaExeceptions: {
    // 参数验证失败
    validation: '[Prisma Error]: Validation Failed',
    // 查询引擎返回与请求相关的已知错误
    P2002: '[Prisma Error]: P2002 DuplicateUniqueKey',
    P2003: '[Prisma Error]: P2003 ForeignKeyExist',
    P2025: '[Prisma Error]: P2025 RecordNotExist',
  },
};

export const getAppInfo = () => ({
  name: "GodAraden's Homepage Backend",
  version: '1.1.0',
  description: "GodAraden's Homepage URL: https://www.araden.top/",
  requestAt: new Date().toLocaleString('zh-CN'),
});
