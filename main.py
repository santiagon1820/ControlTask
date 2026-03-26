from fastapi import FastAPI, Request, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse
import controllers.AuthController as AuthController
import controllers.EmpresasController as EmpresasController
import schemas.Payload as schemasPayload
import schemas.Schemas as Schemas

# Crear app
app = FastAPI(
    title="ControlTask",
    version="1.0.0",
    description="ControlTask",
)

# Definir staticos
app.mount("/js", StaticFiles(directory="frontend/js"), name="js")
app.mount("/css", StaticFiles(directory="frontend/css"), name="css")

@app.get("/", include_in_schema=False)
def read_root():
    return FileResponse("frontend/index.html")

@app.get("/login", include_in_schema=False)
def read_login():
    return FileResponse("frontend/pages/login/login.html")

@app.get("/admin", include_in_schema=False)
def read_admin():
    return FileResponse("frontend/pages/adminpanel.html")

@app.get("/user", include_in_schema=False)
def read_user():
    return FileResponse("frontend/pages/paneluser.html")

@app.get("/empresas", include_in_schema=False)
def read_empresas():
    return FileResponse("frontend/pages/empresas.html")

@app.get("/users", include_in_schema=False)
def read_users():
    return FileResponse("frontend/pages/users.html")

@app.get("/conf", include_in_schema=False)
def read_conf():
    return FileResponse("frontend/pages/conf.html")

# Endpoint Login
@app.post(
    "/api/login",
    tags=["Auth"],
    summary="Iniciar sesión",
    responses={
        200: {"model": Schemas.Login200},
        400: {"model": Schemas.Login400},
        401: {"model": Schemas.Login401},
        500: {"model": Schemas.InternalServerError}
    }
)
def login(data: schemasPayload.Login, request: Request):
    return AuthController.login(data.username, data.password, request)

@app.post(
    "/api/logout",
    tags=["Auth"],
    summary="Cerrar sesión",
    responses={
        200: {"model": Schemas.Logout200},
        500: {"model": Schemas.InternalServerError}
    }
)
def logout():
    return AuthController.logout()    

@app.get(
    "/api/isLogin", 
    tags=["Auth"], 
    summary="Obtener estado de la sesión",
    responses={
        200: {"model": Schemas.isLogin200},
        401: {"model": Schemas.isLogin401},
        500: {"model": Schemas.InternalServerError}
    }
)
def isLogin(user: dict = Depends(AuthController.verify_session_dependency)):
    return AuthController.isLogin()

from typing import Optional

@app.get(
    "/api/empresas", 
    tags=["Empresas"], 
    summary="Obtener registros de empresas filtrados por año"
)
def api_get_empresas(year: Optional[int] = None, user: dict = Depends(AuthController.verify_session_dependency)):
    return EmpresasController.get_empresas(year)
