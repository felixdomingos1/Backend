import { UsuarioRepository } from "../../repository/implements/UsuarioRepository";

class GetUsuarioUseCase {
    constructor (private usuarioRepository: UsuarioRepository){}
    
    async execute(id:number | null){
        const   usuario = await this.usuarioRepository.findById(id)
        return usuario
    }
}

export {GetUsuarioUseCase}