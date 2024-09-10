import { IUsuarioRepository, IUpdateUsuarioUseCaseDTO } from '../../repository/IUsuarioRepository';
import { hash } from 'bcrypt';
import { ErrorApp } from '../../../../Error/ErrorApp';
import { User } from '@prisma/client';

class UpdateUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute({
    name,
    email,
    password,
    balance,
    role,
  }: IUpdateUsuarioUseCaseDTO, id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new ErrorApp('Usuário não encontrado', 404);
    }

    const emailAlreadyInUse = await this.usuarioRepository.findByEmail(email);
    if (emailAlreadyInUse && emailAlreadyInUse.id !== id) {
      throw new ErrorApp('Não podes atualizar este usuário', 400);
    }
    if (!usuario || Array.isArray(usuario)) {
        throw new ErrorApp('Usuário não encontrado', 404);
    }

    let passwordHash = usuario.password_hash;
    if (password) {
      passwordHash = await hash(password, 8);
    }

    await this.usuarioRepository.update({
      id,
      name,
      email,
      password_hash: passwordHash,
      balance,
      role,
    });
  }
}

export { UpdateUsuarioUseCase };
