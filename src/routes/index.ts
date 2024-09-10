import { Router } from "express";
import { usuarioRouter } from "./usuarioRoutes";

const routes = Router();


routes.get("/", (req, res) => {
    res.json({ message: "TUDO FUNCIONANDO . . .  OK!", status:200 });
});

routes.use("/api/usuario", usuarioRouter);

export { routes }