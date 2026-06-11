// ============================================================
// 🎯 TODO 5: Rotas de autenticação
// ============================================================

import * as UserModel from "../models/userModel"

import { Router, Request, Response } from "express";
// 🎯 TODO: import * as UserModel from "../models/userModel";

export const authRoutes = Router();

authRoutes.get("/", (req: Request, res: Response) => {
  res.redirect("/registro")
})

// 🎯 TODO 6: GET /login — renderizar "login" com flash
authRoutes.get("/login", (req: Request, res: Response) => {
  const flash = req.session.flash
  req.session.flash = null
  res.render("login", { flash });
});

// 🎯 TODO 7: GET /registro — renderizar "registro" com flash
authRoutes.get("/registro", (req: Request, res: Response) => {
  const flash = req.session.flash
  req.session.flash = null
  res.render("registro", { flash });
});

// 🎯 TODO 8: POST /registro
// Validar nome/email/senha (min 6 chars)
// UserModel.registrar(nome, email, senha)
// Se erro (email duplicado): flash + redirect /registro
// Se ok: flash "Conta criada!" + redirect /login
authRoutes.post("/registro", async (req: Request, res: Response) => {
  const {nome, email, senha} = req.body
  const flash = req.session.flash
  req.session.flash = null

  if (!nome || nome.trim() === "") {
    req.session.flash = "Insira um nome de usuário."
    return res.redirect("/registro");
  }
  if (!email || !email.includes("@")) {
    req.session.flash = "Insira um email válido."
    return res.redirect("/registro");
  }
  if (!senha || senha.length < 6) {
    req.session.flash = "Senha deve conter ao menos 6 caracteres.";
  }

  // Email duplicado?
  const registrar = await UserModel.registrar(nome, email, senha)
  if (registrar === null) {
    req.session.flash = "Usuário já existe!"
    return res.redirect("/registro");
  }

  req.session.flash = "Conta criada!"
  // TODO: implementar registro
  res.redirect("/login")
});

// 🎯 TODO 9: POST /login
// UserModel.login(email, senha)
// Se null: flash "Email ou senha incorretos" + redirect /login
// Se ok: session.userId, session.userName, redirect /tarefas
authRoutes.post("/login", async (req: Request, res: Response) => {
  const {email, senha} = req.body
  const login = await UserModel.login(email, senha)
  if (login === null) {
    req.session.flash = "Email ou senha incorretos"
    return res.redirect("/login")
  } else {
    req.session.userId = login.id
    req.session.userName = login.email
    res.redirect("/tarefas")
  }
});

// 🎯 TODO 10: GET /logout — req.session.destroy
authRoutes.get("/logout", (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect("/login"))
  // TODO: destruir session
});
