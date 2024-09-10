import { Router } from "express";
import { createUsuario } from "../models/usuario/useCases/createUsuario";
import { getUsurario } from "../models/usuario/useCases/getUsuario";
import { updateUsuario } from "../models/usuario/useCases/updateUsuario";
import { deleteUsuario } from "../models/usuario/useCases/deleteUsuario";
import { session } from "../models/createSession";
import { authUser } from "../middlewares/authUser";

const usuarioRouter = Router()

usuarioRouter.post(
    "/register", 
    (req, res)=>{
        return createUsuario.handle(req,res)
    }
)
usuarioRouter.post(
    "/auth", 
    (req, res)=>{
        return session.handle(req,res)
    }
)

usuarioRouter.get(
    "/get/:id", 
    (req, res)=>{
        return getUsurario.handle(req,res)
    }
)

usuarioRouter.put(
    "/update/:id", 
    (req, res)=>{
        return updateUsuario.handle(req,res)
    }
)

usuarioRouter.delete(
    "/delete/:id", 
    authUser,
    (req, res)=>{
        return deleteUsuario.handle(req,res)
    }
)

export { usuarioRouter };
