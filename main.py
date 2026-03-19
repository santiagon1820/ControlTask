from fastapi import FastAPI

import controllers.AuthController as AuthController
import schemas.Payload as schemasPayload
import schemas.Schemas as Schemas

# Crear app
app = FastAPI(
    title="ControlTask",
    version="1.0.0",
    description="ControlTask",
)

# Endpoint Login
@app.post(
    "/api/login",
    tags=["Auth"],
    summary="Iniciar sesión",
    responses={
        200: {"model": Schemas.Login200},
        400: {"model": Schemas.Login400},
        500: {"model": Schemas.InternalServerError}
    }
)
def login(data: schemasPayload.Login):
    return AuthController.login(data.username, data.password)