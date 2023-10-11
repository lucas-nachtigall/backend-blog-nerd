import { PrismaClient } from './prisma/generated/client'
const prisma = new PrismaClient()

const express = require('express');
const app = express();

app.use(express.json());
app.listen(3333, () =>{
    console.log("rodando")
});



async function createUser(name: string, senha: number, email: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        senha,
        email,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
}

// Função para criar um comentário associado a um usuário
async function createComment(userId: number, comment: string) {
  try {
    const newComment = await prisma.comment.create({
      data: {
        comment,
        userId,
      },
    });
    return newComment;
  } catch (error) {
    throw error;
  }
}


app.post('/users', async (req: { body: { name: any; senha: any; email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id?: number; name?: string; senha?: number; email?: string; error?: string; }): void; new(): any; }; }; }) => {
    const { name, senha, email } = req.body;
    try {
      const newUser = await createUser(name, senha, email);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });
  
  app.post('/comments', async (req: { body: { userId: any; comment: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id?: number; comment?: string; userId?: number; error?: string; }): void; new(): any; }; }; }) => {
    const { userId, comment } = req.body;
    try {
      const newComment = await createComment(userId, comment);
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar comentário' });
    }
  });
  