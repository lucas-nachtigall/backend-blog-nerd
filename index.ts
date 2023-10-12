import { PrismaClient } from "./prisma/generated/client";
const prisma = new PrismaClient();

const express = require("express");
const app = express();

const cors = require("cors"); // Importe o pacote cors

const bcrypt = require('bcrypt');

app.use(express.json());

app.use(
  cors({
    origin: "*", // Permite solicitações de qualquer origem
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Permite credenciais (por exemplo, cookies)
  })
);

app.use(express.json());
app.listen(3333, () => {
  console.log("rodando");
});

async function createUser(user: string, hashedPassword: string, email: string) {
  try {

    console.log(user, hashedPassword, email);

    const Createuser = await prisma.user.create({
      data: {
        user,
        password: hashedPassword,
        email,
      },
    });

    return Createuser;

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

async function login(username: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      user: username,
    },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error('Senha incorreta');
  }

  return user;
}

app.post(
  "/users",
  async (
    req: { body: { user: string; password: string; email: string } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: {
          (arg0: {
            sucess?: string;
            error?: string;
          }): void;
          new (): any;
        };
      };
    }
  ) => {
    const { user, password, email } = req.body;

    try {


      const saltRounds = 16; 

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await createUser(user, hashedPassword, email);

      console.log("criou")
      console.log(newUser);

      res.status(201).json({ sucess: "Usuário criado com sucesso" }); 

    } catch (error) {

      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
);

app.post(
  "/comments",
  async (
    req: { body: { userId: any; comment: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: {
          (arg0: {
            id?: number;
            comment?: string;
            userId?: number;
            error?: string;
          }): void;
          new (): any;
        };
      };
    }
  ) => {
    const { userId, comment } = req.body;
    try {
      const newComment = await createComment(userId, comment);
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar comentário" });
    }
  }
);

app.post("/login", async (req: any, res: any) => {
  const { user, password } = req.body;

  try {
    console.log("chegou aqui");

    const authenticatedUser = await login(user, password);

    console.log(authenticatedUser);

    res.status(200).json({ message: "Login bem-sucedido", user: authenticatedUser });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(401).json({ error: "Erro ao fazer login" });
  }
});



