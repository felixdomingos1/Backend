import { UsuarioRepository } from "../../repository/implements/UsuarioRepository";
import { DeleteUsuarioController } from "./DeleteUsuarioController";
import { DeleteUsuarioUseCase } from "./DeleteUsuarioUseCase";

const usuarioRepository = new UsuarioRepository()
const deleteUsuarioUseCase = new DeleteUsuarioUseCase(usuarioRepository)
const deleteUsuario = new DeleteUsuarioController(deleteUsuarioUseCase)

export {deleteUsuario}