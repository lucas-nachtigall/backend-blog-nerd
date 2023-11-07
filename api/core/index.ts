import { PrismaClient } from "./prisma/generated/client";
const prisma = new PrismaClient();

const express = require("express");
const app = express();
const serverless = require("serverless-http");

const cors = require("cors");


const bcrypt = require("bcrypt");

// app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

if (!module.parent) {
  app.listen(3000);
  console.log("Express started on port 3000");
}
// app.use(express.json());
// app.listen(3333, () => {
//   console.log("rodando");
// });


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


async function createComment(id: number, title: string, content: string) {
  try {
    const currentUtcDateTime = new Date();

    const newComment = await prisma.post.create({
      data: {
        title,
        content,
        userId: id,
        timestamp: currentUtcDateTime,
      },
    });

    return newComment;
  } catch (error) {
    throw error;
  }
}

async function getPosts() {
  const getPosts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      timestamp: true,
      user: {
        select:{
          id: true,
          user: true,
          photo: true
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

  return {
    ...user, name: user.user
  };
}

async function putUsser(id: number, user: string, email: string, photo: string) {
  const updateUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      user,
      email,
      photo,
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

    console.log(user, password, email);

    try {
      const saltRounds = 16;

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await createUser(user, hashedPassword, email);

      console.log(newUser);

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
  const { id, user, email, photo } = req.body;

  console.log(photo);

  try {
    const updatedUser = await putUsser(id, user, email, photo);

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

module.exports.handler = serverless(app);

