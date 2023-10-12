import { PrismaClient } from "./prisma/generated/client";
const prisma = new PrismaClient();

const express = require("express");
const app = express();

const cors = require("cors"); // Importe o pacote cors

const bcrypt = require("bcrypt");

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

//criar pasta e colocar funtion na pasta

async function createUser(user: string, hashedPassword: string, email: string) {
  try {
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
async function createComment(id: number, title: string, content: string) {

  console.log(id, title, content);

  try {
    const newComment = await prisma.comment.create({
      data: {
        title,
        content,
        userId: id,
      },
    });
    return newComment;
  } catch (error) {
    throw error;
  }
}

async function getPosts() {
  const getPosts = await prisma.comment.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      user: {
        select:{
          id: true,
          user: true,
        }
      }
    }
  })

  return getPosts
}

async function login(username: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      user: username,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Senha incorreta");
  }

  return user;
}

async function putUsser(id: number, user: string, email: string) {
  const updateUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      user,
      email,
    },
  });

  return updateUser;
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
          (arg0: { sucess?: string; error?: string }): void;
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

      res.status(201).json({ sucess: "Usuário criado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
);

app.post("/coments",async (req: any, res: any) => {
    
  
  const { id, title, content } = req.body;

    try {
      const newComment = await createComment(id, title, content);
      res.status(201).json(newComment);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar comentário" });
    }
  }
);

app.post("/login", async (req: any, res: any) => {
  const { user, password } = req.body;

  try {
    const authenticatedUser = await login(user, password);

    res
      .status(200)
      .json({ message: "Login bem-sucedido", user: authenticatedUser });
  } catch (error) {
    res.status(401).json({ error: "Erro ao fazer login" });
  }
});

app.post("/putUsser", async (req: any, res: any) => {
  const { id, user, email } = req.body;

  try {
    const updatedUser = await putUsser(id, user, email);

    res
      .status(200)
      .json({ message: "Usuário atualizado com sucesso", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.get("/posts", async (req: any, res: any) => {

  try {
    const getPost = await getPosts();

    console.log(getPost);
    res.status(200).json(getPost);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter posts" });
  }
})


