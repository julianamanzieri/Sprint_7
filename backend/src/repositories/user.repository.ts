import User from '../model/user.model';

class UserRepository {
  // Criar um novo usuário
  async createUser(userName: string, password: string, token: string) {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ userName: userName });
    if (existingUser) {
      throw new Error(`User ${userName} already exists`);
    }

    // Criar o usuário se ele não existir
    const newUser = new User({
      userName: userName,
      password: password,
      token: token,
      createdAt: new Date(),
      lastActive: new Date()
    });

    await newUser.save();

    if (!newUser) {
      throw new Error('Unable to create user');
    }

    return newUser;
  }

  // Buscar usuário pelo userName
  async findUserByUserName(userName: string) {
    const user = await User.findOne({ userName: userName });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export default UserRepository;
