import { Request, Response } from "express";
import { DeleteUsuarioUseCase } from "./DeleteUsuarioUseCase";
import { ErrorApp } from "../../../../Error/ErrorApp";

class DeleteUsuarioController {
  constructor(private deleteUsuarioUseCase: DeleteUsuarioUseCase) {}

  async handle(req, res: Response): Promise<Response> {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      throw new ErrorApp('ID inválido', 400);
    }
    
    if(req.user.id !== Number(id)) throw new ErrorApp("Usuario não autozidado a eliminar", 401)
    
    try {
      const usuario = await this.deleteUsuarioUseCase.execute(Number(id));
      return res.status(200).json({ message: "Usuário deletado com sucesso!", usuario });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export { DeleteUsuarioController };
