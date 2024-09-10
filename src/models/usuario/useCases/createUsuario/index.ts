import { UsuarioRepository } from "../../repository/implements/UsuarioRepository";
import { CreteUsuarioController } from "./CreateUsuarioController";
import { CreateUsuarioUseCase } from "./CreateUsuarioUseCase";

const usuarioRepository= new UsuarioRepository()
const createUsuarioUseCase = new CreateUsuarioUseCase(usuarioRepository)
const createUsuario = new CreteUsuarioController(createUsuarioUseCase)

export {createUsuario}