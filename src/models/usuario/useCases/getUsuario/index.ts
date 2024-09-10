import { UsuarioRepository } from "../../repository/implements/UsuarioRepository";
import { GetUsuarioController } from "./GetUsuarioController";
import { GetUsuarioUseCase } from "./GetUsuarioUseCase";

const usuarioRepository = new UsuarioRepository()
const getUsuarioUseCase = new GetUsuarioUseCase(usuarioRepository)
const getUsurario = new GetUsuarioController(getUsuarioUseCase)

export {getUsurario}