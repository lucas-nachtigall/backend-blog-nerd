"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./prisma/generated/client");
const prisma = new client_1.PrismaClient();
const express = require("express");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const bcrypt = require("bcrypt");
// app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
if (!module.parent) {
    app.listen(3000);
    console.log("Express started on port 3000");
}
// app.use(express.json());
// app.listen(3333, () => {
//   console.log("rodando");
// });
function createUser(user, hashedPassword, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const Createuser = yield prisma.user.create({
                data: {
                    user,
                    password: hashedPassword,
                    email,
                },
            });
            return Createuser;
        }
        catch (error) {
            throw error;
        }
    });
}
function createComment(id, title, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUtcDateTime = new Date();
            const newComment = yield prisma.post.create({
                data: {
                    title,
                    content,
                    userId: id,
                    timestamp: currentUtcDateTime,
                },
            });
            return newComment;
        }
        catch (error) {
            throw error;
        }
    });
}
function getPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const getPosts = yield prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                timestamp: true,
                user: {
                    select: {
                        id: true,
                        user: true,
                        photo: true
                    }
                }
            }
        });
        return getPosts;
    });
}
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findFirst({
            where: {
                user: username,
            },
        });
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        const passwordMatch = yield bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Senha incorreta");
        }
        return Object.assign(Object.assign({}, user), { name: user.user });
    });
}
function putUsser(id, user, email, photo) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateUser = yield prisma.user.update({
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
    });
}
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password, email } = req.body;
    console.log(user, password, email);
    try {
        const saltRounds = 16;
        const hashedPassword = yield bcrypt.hash(password, saltRounds);
        const newUser = yield createUser(user, hashedPassword, email);
        console.log(newUser);
        res.status(201).json({ sucess: "Usuário criado com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
}));
app.post("/coments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, content } = req.body;
    try {
        const newComment = yield createComment(id, title, content);
        res.status(201).json(newComment);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar comentário" });
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password } = req.body;
    try {
        const authenticatedUser = yield login(user, password);
        res
            .status(200)
            .json({ message: "Login bem-sucedido", user: authenticatedUser });
    }
    catch (error) {
        res.status(401).json({ error: "Erro ao fazer login" });
    }
}));
app.post("/putUsser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, user, email, photo } = req.body;
    console.log(photo);
    try {
        const updatedUser = yield putUsser(id, user, email, photo);
        res
            .status(200)
            .json({ message: "Usuário atualizado com sucesso", user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
}));
app.get("/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getPost = yield getPosts();
        console.log(getPost);
        res.status(200).json(getPost);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao obter posts" });
    }
}));
module.exports.handler = serverless(app);
