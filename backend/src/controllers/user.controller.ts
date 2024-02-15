import { Request, Response } from 'express';
import UserRepository from '../repositories/user.repository';

class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.createUser = this.createUser.bind(this);
    this.findUserByUserName = this.findUserByUserName.bind(this);
  }

  //   POST/user - cria um usuario
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { userName, password, token } = req.body;
      const newUser = await this.userRepository.createUser(
        userName,
        password,
        token
      );
      res.status(200).json({ userName: newUser.userName, userId: newUser._id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  // GET /user/:userName - Busca um usuário pelo nome de usuário
  public async findUserByUserName(req: Request, res: Response): Promise<void> {
    try {
      const { userName } = req.params;

      const user = await this.userRepository.findUserByUserName(userName);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Responder com os dados do usuário (omitindo dados sensíveis como senha)
      res.status(200).json({
        userName: user.userName,
        userId: user._id,
        createdAt: user.createdAt,
        lastActive: user.lastActive
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

export default new UserController();
