"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("../../prisma/generated/client");
var prisma = new client_1.PrismaClient();
var express = require("express");
var app = express();
var cors = require("cors");
//aqui terá o banco na nuvem
var bcrypt = require("bcrypt");
app.use(express.json());
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));
app.use(express.json());
app.listen(3333, function () {
    console.log("rodando");
});
function createUser(user, hashedPassword, email) {
    return __awaiter(this, void 0, void 0, function () {
        var Createuser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                user: user,
                                password: hashedPassword,
                                email: email,
                            },
                        })];
                case 1:
                    Createuser = _a.sent();
                    return [2 /*return*/, Createuser];
                case 2:
                    error_1 = _a.sent();
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createComment(id, title, content) {
    return __awaiter(this, void 0, void 0, function () {
        var currentUtcDateTime, newComment, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    currentUtcDateTime = new Date();
                    return [4 /*yield*/, prisma.post.create({
                            data: {
                                title: title,
                                content: content,
                                userId: id,
                                timestamp: currentUtcDateTime,
                            },
                        })];
                case 1:
                    newComment = _a.sent();
                    return [2 /*return*/, newComment];
                case 2:
                    error_2 = _a.sent();
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getPosts() {
    return __awaiter(this, void 0, void 0, function () {
        var getPosts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.post.findMany({
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
                    })];
                case 1:
                    getPosts = _a.sent();
                    return [2 /*return*/, getPosts];
            }
        });
    });
}
function login(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, passwordMatch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            user: username,
                        },
                    })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("Usuário não encontrado");
                    }
                    return [4 /*yield*/, bcrypt.compare(password, user.password)];
                case 2:
                    passwordMatch = _a.sent();
                    if (!passwordMatch) {
                        throw new Error("Senha incorreta");
                    }
                    return [2 /*return*/, __assign(__assign({}, user), { name: user.user })];
            }
        });
    });
}
function putUsser(id, user, email, photo) {
    return __awaiter(this, void 0, void 0, function () {
        var updateUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: id,
                        },
                        data: {
                            user: user,
                            email: email,
                            photo: photo,
                        },
                    })];
                case 1:
                    updateUser = _a.sent();
                    return [2 /*return*/, updateUser];
            }
        });
    });
}
app.post("/users", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, password, email, saltRounds, hashedPassword, newUser, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, password = _a.password, email = _a.email;
                console.log(user, password, email);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                saltRounds = 16;
                return [4 /*yield*/, bcrypt.hash(password, saltRounds)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, createUser(user, hashedPassword, email)];
            case 3:
                newUser = _b.sent();
                console.log(newUser);
                res.status(201).json({ sucess: "Usuário criado com sucesso" });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                res.status(500).json({ error: "Erro ao criar usuário" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/coments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, title, content, newComment, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, title = _a.title, content = _a.content;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, createComment(id, title, content)];
            case 2:
                newComment = _b.sent();
                res.status(201).json(newComment);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                res.status(500).json({ error: "Erro ao criar comentário" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, password, authenticatedUser, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, login(user, password)];
            case 2:
                authenticatedUser = _b.sent();
                res
                    .status(200)
                    .json({ message: "Login bem-sucedido", user: authenticatedUser });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                res.status(401).json({ error: "Erro ao fazer login" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/putUsser", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, user, email, photo, updatedUser, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, user = _a.user, email = _a.email, photo = _a.photo;
                console.log(photo);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, putUsser(id, user, email, photo)];
            case 2:
                updatedUser = _b.sent();
                res
                    .status(200)
                    .json({ message: "Usuário atualizado com sucesso", user: updatedUser });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                res.status(500).json({ error: "Erro ao atualizar usuário" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/posts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var getPost, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getPosts()];
            case 1:
                getPost = _a.sent();
                console.log(getPost);
                res.status(200).json(getPost);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(500).json({ error: "Erro ao obter posts" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
