import { $Enums, User } from "@prisma/client";
import { IUsuarioRepository } from "../usuario/repository/IUsuarioRepository";
import { ErrorApp } from "../../Error/ErrorApp";
import { compare } from "bcrypt";
import { generateToken } from "../../services/payload";

interface Login {
    token: string;
    name: string;
    email: string;
    balance: number;
    role: $Enums.Role;
}

class CreateSessionUseCase{
    constructor(private usuarioRepository: IUsuarioRepository){}

    async execute(email:string, password:string) : Promise<Login>{

        const usuario = await this.usuarioRepository.findByEmail(email)

        if(!usuario) throw new ErrorApp("Email ou Palavra Passe Inválidas", 401)
        
        const passwordValid = await compare(password, usuario.password_hash)

        if(!passwordValid) throw new ErrorApp("Email ou Palavra Passe Inválidas", 401)
        
        const token = generateToken(usuario.id)

        return {
            token,
            name:usuario.name,
            balance:usuario.balance,
            email:usuario.email,
            role:usuario.role
        }
    }
}

export {CreateSessionUseCase}