import { Request, Response } from "express";
import { UpdateUsuarioUseCase } from "./UpdateUsuarioUseCase";

class UpdateUsuarioController {
  constructor(private updateUsuarioUseCase: UpdateUsuarioUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // Pega o ID do usuário pela URL
    const { name, email, password, balance, role } = req.body;
    await this.updateUsuarioUseCase.execute(
      { name, email, password, balance, role},
      Number(id)
    );

    return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  }
}

export { UpdateUsuarioController };
