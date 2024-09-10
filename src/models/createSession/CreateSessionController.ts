import { Request, Response } from "express";
import * as Yup from "yup";
import { CreateSessionUseCase } from "./CreateSessionUseCase";
import createUsuarioSession from "../../schemas/createSession";
import { ErrorApp } from "../../Error/ErrorApp";

class CreateSessionController{
    constructor(private createSessionUseCase:CreateSessionUseCase){}

    async handle(req:Request, res:Response) : Promise<Response>{
        const {email, password} = req.body
        const validate = await createUsuarioSession.isValid({email, password})

        if(!validate) throw new ErrorApp("Erro na validação. Verifique os dados!", 400)
        
        const   session = await this.createSessionUseCase.execute(email, password)

        return res.status(200).json(session)
    }

}

export {CreateSessionController}