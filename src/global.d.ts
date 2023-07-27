const enum Role {
  admin = 'admin',
}

interface CustomSession {
  user: {
    role: Role;
  };
}
