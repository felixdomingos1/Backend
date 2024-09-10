import { $Enums, User } from "@prisma/client";

interface ICreateUsuarioDTO {
  email: string;
  name: string;
  password_hash: string;
  balance: number;
  role: $Enums.Role;
}

interface ICreateUsuarioUseCaseDTO {
  email: string;
  name: string;
  password: string;
  balance: number;
  role: $Enums.Role;
}

interface IUpdateUsuarioDTO {
  id: number;             
  name: string;
  email: string;
  password_hash?: string;      
  balance: number;
  role: $Enums.Role;
}

interface IUpdateUsuarioUseCaseDTO {
  name: string;
  email: string;
  password?: string;      
  balance: number;
  role: $Enums.Role;
}

interface IUsuarioRepository {
  create({
    name,
    email,
    password_hash,
    balance,
    role
  }: ICreateUsuarioDTO): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findById(id: number | null): Promise<User | User[] | null>;

  update({            
    id,
    name,
    email,
    password_hash,
    balance,
    role
  }: IUpdateUsuarioDTO): Promise<User>;

  deleteUsuario(id:number)
}

export {
  IUsuarioRepository,
  ICreateUsuarioDTO,
  ICreateUsuarioUseCaseDTO,
  IUpdateUsuarioUseCaseDTO,
  IUpdateUsuarioDTO
};
