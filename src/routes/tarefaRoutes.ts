// ============================================================
// 🎯 TODO 11: Rotas de tarefas (PROTEGIDAS!)
// ============================================================
import { Router, Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";

export const tarefaRoutes = Router();

// 🎯 TODO 12: GET /tarefas — Listar tarefas do usuário logado
// Se !session.userId: flash + redirect /login
// TarefaModel.listarPorUsuario(session.userId)
// Renderizar "tarefas" com { nome, tarefas, flash }
tarefaRoutes.get("/tarefas", async (req: Request, res: Response) => {
  const flash = req.session.flash
  const user = Number(req.session.userId) 
  const nome = req.session.userName
  req.session.flash = null
  if (!user || user === 0) {
    req.session.flash = "Faça login primeiro!"
    return res.redirect("/login")
  }
  req.session.flash = `Olá, ${nome}.`
  const tarefas = await TarefaModel.listarPorUsuario(user)
  // TODO: verificar login + listar tarefas
  res.render("tarefas", {nome, tarefas, flash})
});

// 🎯 TODO 13: POST /tarefas — Adicionar tarefa
// Validar texto não vazio
// TarefaModel.adicionar(session.userId, texto)
// Flash "Tarefa adicionada!"
tarefaRoutes.post("/tarefas", async (req: Request, res: Response) => {
  const texto = req.body
  const user = Number(req.session.userId)
  req.session.flash = null
  if (!texto || texto.length === 0) {
    req.session.flash = "Insira um nome!"
    return res.redirect("/tarefas")
  }

  TarefaModel.adicionar(user, texto)
  req.session.flash = "Tarefa adicionada!"
  // TODO: adicionar tarefa
  res.redirect("/tarefas");
});

// 🎯 TODO 14: POST /tarefas/:id/concluir — Toggle concluída
tarefaRoutes.post("/tarefas/:id/concluir", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const user = Number(req.session.userId)
  TarefaModel.concluir(id, user)
  // TODO: concluir/desconcluir tarefa
  res.redirect("/tarefas");
});

// 🎯 TODO 15: POST /tarefas/:id/remover — Remover tarefa
tarefaRoutes.post("/tarefas/:id/remover", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const user = Number(req.session.userId)
  TarefaModel.remover(id, user)
  // TODO: remover tarefa
  res.redirect("/tarefas");
});
