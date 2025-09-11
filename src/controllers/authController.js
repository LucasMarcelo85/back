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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.getProfile = exports.updateProfile = exports.verifyToken = exports.register = exports.login = void 0;
var bcrypt_1 = require("bcrypt");
var dotenv_1 = require("dotenv");
var jsonwebtoken_1 = require("jsonwebtoken");
var prisma_js_1 = require("../utils/prisma.js");
dotenv_1.default.config();
// Login de usuário
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, secretKey, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                console.log("Tentativa de login para o e-mail: ".concat(email));
                if (!email || !password) {
                    console.log("Login falhou: Email ou senha ausentes");
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Email e senha são obrigatórios" })];
                }
                return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    console.log("Login falhou: Usu\u00E1rio com email ".concat(email, " n\u00E3o encontrado"));
                    return [2 /*return*/, res.status(401).json({ message: "Email ou senha incorretos" })];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    console.log("Login falhou: Senha incorreta para o email ".concat(email));
                    return [2 /*return*/, res.status(401).json({ message: "Email ou senha incorretos" })];
                }
                secretKey = process.env.JWT_SECRET;
                if (!secretKey) {
                    console.error("JWT_SECRET não está definido no arquivo .env");
                    return [2 /*return*/, res
                            .status(500)
                            .json({ message: "Erro de configuração no servidor" })];
                }
                token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }, secretKey, {
                    expiresIn: "1d", // Token expira em 1 dia
                });
                // Retorna o token e dados básicos do usuário
                res.json({
                    token: token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error("Erro ao fazer login:", error_1);
                // Log detalhado do erro para melhor depuração
                if (error_1 instanceof Error) {
                    console.error("Detalhes do erro: ".concat(error_1.message));
                    console.error("Stack trace: ".concat(error_1.stack));
                }
                res.status(500).json({ message: "Erro interno no servidor" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
// Registrar um novo usuário
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, phone, role, existingUser, saltRounds, hashedPassword, newUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log("Tentativa de registro recebida: ".concat(JSON.stringify(req.body, null, 2)));
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password, phone = _a.phone, role = _a.role;
                return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    console.log("Registro falhou: Email ".concat(email, " j\u00E1 est\u00E1 em uso"));
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Este email já está sendo utilizado" })];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcrypt_1.default.hash(password, saltRounds)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, prisma_js_1.default.user.create({
                        data: {
                            name: name_1,
                            email: email,
                            phone: phone,
                            password: hashedPassword,
                            role: role || "USER",
                        },
                    })];
            case 3:
                newUser = _b.sent();
                console.log("Usu\u00E1rio criado com sucesso: ".concat(newUser.id, ", ").concat(newUser.name, ", ").concat(newUser.email));
                res.status(201).json({
                    message: "Usuário criado com sucesso",
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        phone: newUser.phone,
                        role: newUser.role,
                    },
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Erro ao registrar usuário:", error_2);
                // Log detalhado do erro para melhor depuração
                if (error_2 instanceof Error) {
                    console.error("Detalhes do erro de registro: ".concat(error_2.message));
                    console.error("Stack trace: ".concat(error_2.stack));
                }
                res.status(500).json({ message: "Erro interno no servidor" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
// Verificar token atual
var verifyToken = function (req, res) {
    // Se chegou aqui, o middleware de autenticação já validou o token
    res.json({
        valid: true,
        user: req.user,
    });
};
exports.verifyToken = verifyToken;
// Atualizar perfil do usuário
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_2, email, currentPassword, newPassword, currentUser, updateData, emailExists, isPasswordValid, saltRounds, hashedPassword, updatedUser, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                // Garantir que o usuário está autenticado
                if (!req.user || !req.user.id) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                userId = req.user.id;
                _a = req.body, name_2 = _a.name, email = _a.email, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                        where: { id: userId },
                    })];
            case 1:
                currentUser = _b.sent();
                if (!currentUser) {
                    return [2 /*return*/, res.status(404).json({ message: "Usuário não encontrado" })];
                }
                updateData = {};
                // Atualizar nome se fornecido
                if (name_2) {
                    updateData.name = name_2;
                }
                if (!(email && email !== currentUser.email)) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                        where: { email: email },
                    })];
            case 2:
                emailExists = _b.sent();
                if (emailExists) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Este email já está sendo utilizado" })];
                }
                updateData.email = email;
                _b.label = 3;
            case 3:
                if (!(currentPassword && newPassword)) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, currentUser.password)];
            case 4:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(400).json({ message: "Senha atual incorreta" })];
                }
                saltRounds = 10;
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, saltRounds)];
            case 5:
                hashedPassword = _b.sent();
                updateData.password = hashedPassword;
                _b.label = 6;
            case 6:
                // Se não há dados para atualizar
                if (Object.keys(updateData).length === 0) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Nenhum dado fornecido para atualização" })];
                }
                return [4 /*yield*/, prisma_js_1.default.user.update({
                        where: { id: userId },
                        data: updateData,
                    })];
            case 7:
                updatedUser = _b.sent();
                // Retornar dados atualizados (sem a senha)
                res.json({
                    message: "Perfil atualizado com sucesso",
                    user: {
                        id: updatedUser.id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role,
                        createdAt: updatedUser.createdAt,
                    },
                });
                return [3 /*break*/, 9];
            case 8:
                error_3 = _b.sent();
                console.error("Erro ao atualizar perfil:", error_3);
                res.status(500).json({ message: "Erro interno no servidor" });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
// Obter perfil do usuário atual
var getProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Garantir que o usuário está autenticado
                if (!req.user || !req.user.id) {
                    return [2 /*return*/, res.status(401).json({ message: "Usuário não autenticado" })];
                }
                userId = req.user.id;
                return [4 /*yield*/, prisma_js_1.default.user.findUnique({
                        where: { id: userId },
                    })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: "Usuário não encontrado" })];
                }
                // Retornar dados do usuário (sem a senha)
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error("Erro ao obter perfil:", error_4);
                res.status(500).json({ message: "Erro interno no servidor" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProfile = getProfile;
