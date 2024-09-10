import { Request, Response } from "express";
import { GetUsuarioUseCase } from "./GetUsuarioUseCase";

class GetUsuarioController {
    constructor(private getUsuarioUseCase : GetUsuarioUseCase){}
    async handle(req:Request, res:Response) : Promise<Response>{
        const {id} = req.params

        const usuario = await this.getUsuarioUseCase.execute(Number(id))
        
        return res.status(200).json(usuario)
    }
}

export {GetUsuarioController}