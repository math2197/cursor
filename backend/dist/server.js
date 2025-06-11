"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const client_routes_1 = __importDefault(require("./routes/client.routes"));
const process_routes_1 = __importDefault(require("./routes/process.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/clients', client_routes_1.default);
app.use('/api/processes', process_routes_1.default);
app.use('/api/tasks', task_routes_1.default);
app.use('/api/tags', tag_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando!' });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map