import { UsuarioRepository } from "../../repository/implements/UsuarioRepository";
import { UpdateUsuarioUseCase } from "./UpdateUsuarioUseCase";
import { UpdateUsuarioController } from "./UpdateUsuarioController";

const usuarioRepository = new UsuarioRepository();
const updateUsuarioUseCase = new UpdateUsuarioUseCase(usuarioRepository);
const updateUsuario = new UpdateUsuarioController(updateUsuarioUseCase);

export { updateUsuario };
