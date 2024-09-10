import { $Enums } from '@prisma/client';
import { ICreateUsuarioUseCaseDTO, IUsuarioRepository } from '../../repository/IUsuarioRepository';
import { hash } from "bcrypt";
import { ErrorApp } from '../../../../Error/ErrorApp';
import { generateToken } from '../../../../services/payload';

interface ICreateUsuarioResponse {
    token: string;
    name: string;
    email: string;
    balance: number;
    role: $Enums.Role;
}
  
class   CreateUsuarioUseCase {
    constructor (private usuarioRepository : IUsuarioRepository){}

    async execute ({
        name,
        email,
        password,
        balance,
        role,
    }:ICreateUsuarioUseCaseDTO) : Promise<ICreateUsuarioResponse> {
        const isUsuarioEmailExiste = await this.usuarioRepository.findByEmail(email)
        if (isUsuarioEmailExiste) {
            throw new ErrorApp('Email já foi cadastrado', 400)
        }

        const   passwordHash = await hash(password, 8)
        const usuario = await this.usuarioRepository.create({
            name,
            email,
            balance,
            password_hash:passwordHash,
            role
        })

        const token = generateToken(usuario.id)

        return {
            token,
            name:usuario.name,
            email:usuario.email,
            balance:usuario.balance,
            role:usuario.role,
        }
    }
}
export {CreateUsuarioUseCase}