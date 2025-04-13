"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInputSchema = exports.createPostInputSchema = exports.signinInputSchema = exports.signupInputSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInputSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(20),
});
exports.signinInputSchema = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(20),
});
exports.createPostInputSchema = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    published: zod_1.default.boolean()
});
exports.updatePostInputSchema = zod_1.default.object({
    id: zod_1.default.string(),
    title: zod_1.default.string().optional(),
    content: zod_1.default.string().optional(),
    published: zod_1.default.boolean().optional()
});
