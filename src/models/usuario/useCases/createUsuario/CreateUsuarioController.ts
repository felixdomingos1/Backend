import { Request, Response } from "express";
import { CreateUsuarioUseCase } from "./CreateUsuarioUseCase";
import usuarioEsquema from "../../../../schemas/createUsuario";
 
class CreteUsuarioController {
    constructor (private createUsuarioUseCase : CreateUsuarioUseCase){}
    async handle(req:Request, res:Response) : Promise<Response> {
        // const img = req.file
        const {name, email, password, role, balance } = req.body
        const validedSchima = await usuarioEsquema.isValid({name, email, password, role})

        if (!validedSchima) {
            throw new Error("Dados inválidos! Verifique os dados e envie corretamente");
        } 
        const usuario = await this.createUsuarioUseCase.execute({name, email, balance, password, role})
        return res.status(201).json(usuario)
    }
}

export {CreteUsuarioController}