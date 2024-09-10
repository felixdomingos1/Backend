import { UsuarioRepository } from "../../repository/implements/UsuarioRepository";
import { ErrorApp } from "../../../../Error/ErrorApp";

class DeleteUsuarioUseCase {
  constructor(private usuarioRepository: UsuarioRepository) {}
  async execute(id: number | null) {
    if (!id) {
      throw new ErrorApp('ID de usuário inválido', 400);
    }
    
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new ErrorApp('Usuário não encontrado', 404);
    }

    const deletado = await this.usuarioRepository.deleteUsuario(id);
    return deletado;
  }
}

export { DeleteUsuarioUseCase };
