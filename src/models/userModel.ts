// ============================================================
// 🎯 TODO 4: Model de Usuários com bcrypt
// ============================================================
// import { readFile, writeFile } from "fs/promises";
// import bcrypt from "bcrypt";
//
// interface User { id: number; nome: string; email: string; senha: string; }
// const ARQUIVO = "dados/usuarios.json";
// const SALT_ROUNDS = 10;
//
// Funções para criar:
//   carregar(): Promise<User[]>
//   salvar(users: User[]): Promise<void>
//   buscarPorEmail(email: string): Promise<User | undefined>
//   buscarPorId(id: number): Promise<User | undefined>
//   registrar(nome, email, senhaTexto): Promise<User>
//     → verificar email duplicado
//     → bcrypt.hash(senhaTexto, SALT_ROUNDS)
//     → salvar com hash
//   login(email, senhaTexto): Promise<User | null>
//     → buscar por email
//     → bcrypt.compare(senhaTexto, user.senha)
//     → retornar user se correto, null se errado
// ============================================================

import { readFile, writeFile } from "fs/promises"
import bcrypt from "bcrypt"

export interface User {
    id: number
    nome: string
    email: string
    senha: string
}

const ARQUIVO = "dados/usuarios.json"
const SALT_ROUNDS = 10

async function carregar(): Promise<User[]> {
    try {
        const usuarios = await readFile(ARQUIVO, "utf-8")
        const usuariosParse = JSON.parse(usuarios)
        return usuariosParse
    } catch {
        await writeFile(ARQUIVO, [])
        return []
    }
}

async function salvar(dados: User[]): Promise<void> {
    const stringified = JSON.stringify(dados, null, 2)
    await writeFile(ARQUIVO, stringified)
}

export async function buscarPorEmail(email: string): Promise<User | undefined> {
    const Users = await carregar()
    const foundUser = await Users.find(a => a.email === email)
    if (!foundUser) {
        return undefined
    }
    return foundUser
}

export async function buscarPorId(id: number): Promise<User | undefined> {
    const Users = await carregar()
    const foundUser = await Users.find(a => a.id === id)
    if (!foundUser) {
        return undefined
    }
    return foundUser
}

export async function registrar(nome: string, email: string, senha: string): Promise<User | null> {
    const Users = await carregar()
    if (Users.find(a => a.email === email)) {
        return null
    }

    const senhaEncriptada = String(bcrypt.hash(senha, SALT_ROUNDS))
    const novo = {id: (Users.at(-1)?.id ?? 0)+1, nome, email, senha: senhaEncriptada}
    Users.push(novo)
    await salvar(Users)
    return novo
}

export async function login(email: string, senha: string): Promise<User | null> {
    const Users = await carregar()
    const user = Users.find(a => a.email === email)
    if (!user) {
        throw new Error("Email inexistente")
    }

    const comparacao = await bcrypt.compare(senha, user.senha)
    if(!comparacao) {
        return null
    }
    return user
}