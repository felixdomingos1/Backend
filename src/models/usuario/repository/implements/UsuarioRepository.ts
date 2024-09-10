import { User } from "@prisma/client";
import { ICreateUsuarioDTO, IUpdateUsuarioDTO, IUpdateUsuarioUseCaseDTO, IUsuarioRepository } from "../IUsuarioRepository";
import prisma from "../../../../prismaConf/prismaConfig";

class UsuarioRepository implements IUsuarioRepository{
    async create({ name, email, password_hash, balance, role }: ICreateUsuarioDTO): Promise<User> {
        const Usuario = await prisma.user.create({
            data:{name, email, password_hash, balance, role }
        })
        return Usuario
    }
    async findByEmail(email: string): Promise<User | null> {
        const Usuario = await prisma.user.findUnique({
            where:{email},
            include:{
                contacts:true,
                entities:true,
                groups:true,
                packages:true,
                transfersReceived:true,
                transfersSent:true,
                _count:true
            }
        })
        if (!Usuario) {
            return null;
        }
        return Usuario
    }
    
    async findById(id: number | null): Promise<User | User[] | null>  {
        if (!id) {
            return await prisma.user.findMany({
            include:{
                contacts:true,
                entities:true,
                groups:true,
                packages:true,
                transfersReceived:true,
                transfersSent:true,
                _count:true
            }
            })
        }
        const Usuario = await prisma.user.findFirst({
            where:{id},
            include:{
                contacts:true,
                entities:true,
                groups:true,
                packages:true,
                transfersReceived:true,
                transfersSent:true,
                _count:true
            }
        })
        if (!Usuario) {
            return null;
        }
        return Usuario
    }

    async update({ id, name, email, password_hash, balance, role }: IUpdateUsuarioDTO): Promise<User> {
     
        const updatedUsuario = await prisma.user.update({
          where: { id },
          data: {
            name,
            email,
            password_hash, // Atualize o hash da senha se uma nova senha foi enviada
            balance,
            role,
          }
        });
        return updatedUsuario;
    }
    async deleteUsuario(id: number): Promise<User> {
        const deletado = await prisma.user.delete({
          where: { id },
        });
        return deletado;
    }
}

export { UsuarioRepository }