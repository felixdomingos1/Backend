import { UsuarioRepository } from "../usuario/repository/implements/UsuarioRepository";
import { CreateSessionController } from "./CreateSessionController";
import { CreateSessionUseCase } from "./CreateSessionUseCase";

const usuarioRepository = new UsuarioRepository()
const createSessionUseCase = new CreateSessionUseCase(usuarioRepository)
const session = new CreateSessionController(createSessionUseCase)

export {session}