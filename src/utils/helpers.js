"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = createSlug;
exports.formatCurrency = formatCurrency;
exports.generateRandomCode = generateRandomCode;
exports.safeJsonParse = safeJsonParse;
/**
 * Cria um slug a partir de um string
 * @param text O texto para converter em slug
 * @returns O slug formatado
 */
function createSlug(text) {
    return text
        .toString()
        .normalize("NFD") // normaliza caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // substitui espaços por hífens
        .replace(/[^\w-]+/g, "") // remove todos os caracteres não-palavra
        .replace(/--+/g, "-") // substitui múltiplos hífens por um único
        .replace(/^-+/, "") // remove hífens do início
        .replace(/-+$/, ""); // remove hífens do final
}
/**
 * Formata um valor para formato de moeda brasileira
 * @param value O valor a ser formatado
 * @returns O valor formatado em BRL
 */
function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}
/**
 * Gera um código aleatório para uso em pedidos, SKUs, etc.
 * @param length Comprimento do código
 * @param prefix Prefixo opcional
 * @returns Código aleatório
 */
function generateRandomCode(length, prefix) {
    if (length === void 0) { length = 8; }
    if (prefix === void 0) { prefix = ""; }
    var characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removidos caracteres confusos como O, 0, I, 1
    var result = prefix;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
/**
 * Analisa uma string JSON de forma segura, retornando a string original em caso de erro
 * @param str String para analisar como JSON
 * @returns Objeto analisado ou string original em caso de erro
 */
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (_e) {
        // Se não for JSON válido, retorna a string original
        return str;
    }
}
