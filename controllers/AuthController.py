import os
import bcrypt
import jwt
import models.db as DB
from fastapi import Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Cargar el .env
load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_EXPIRES_IN = os.getenv("JWT_EXPIRES_IN")

def login(user, password, request: Request):
    # Verificamos primero si ya tiene una sesión activa
    token_actual = request.cookies.get("token")
    if token_actual:
        try:
            jwt.decode(token_actual, str(JWT_SECRET), algorithms=["HS256"])
            # Si se llega aquí, el token existe y es válido
            return JSONResponse(status_code=400, content={"error": "Ya tienes una sesión activa"})
        except Exception:
            # Si el token no es válido o está expirado, ignoramos y procedemos con el login
            pass

    try:
        respuesta = DB.GETDB("SELECT id_user, user, password, type FROM users WHERE user = %s", (user,))
        if respuesta:
            respuesta_user = respuesta[0]
            respuesta_password =  respuesta_user["password"]
            
            # Comprobar que las contraseñas coincidan
            if bcrypt.checkpw(password.encode(), respuesta_password.encode()): 
                # Generar el Payload para el JWT 
                payload = {
                    "user_id": respuesta_user["id_user"],
                    "username": respuesta_user["user"],
                    "type": respuesta_user["type"],
                    "exp": datetime.utcnow() + timedelta(seconds=int(JWT_EXPIRES_IN))
                }
                # Generar el token con el payload  
                token = jwt.encode(payload, str(JWT_SECRET), algorithm="HS256") 

                # Generar fecha de expiracion
                expires_at = (datetime.now() + timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S") 
                # Generar la respuesta
                response = JSONResponse(
                    status_code=200,
                    content={
                        "message": "Login exitoso",
                        "token": token,
                        "type": respuesta_user["type"],
                        "expires_at": expires_at
                    }
                )            
                # Configurar la cookie
                response.set_cookie(
                    key="token",
                    value=token,
                    max_age=int(JWT_EXPIRES_IN),  # Tiempo en segundos
                    expires=int(JWT_EXPIRES_IN),
                    path="/",
                    domain=None,
                    secure=False,  # Cambiar a True en producción con HTTPS
                    httponly=True,  # Importante para seguridad (no accesible desde JavaScript)
                    samesite="lax"
                )
                # Configuración para producción (cuando uses HTTPS)
                # response.set_cookie(
                #     key="token",
                #     value=token,
                #     max_age=int(JWT_EXPIRES_IN),
                #     expires=int(JWT_EXPIRES_IN),
                #     path="/",
                #     domain="tudominio.com",  # Tu dominio específico
                #     secure=True,  # Solo se envía sobre HTTPS
                #     httponly=True,  # No accesible desde JavaScript
                #     samesite="strict"  # Protección contra CSRF
                # )
                return response 
            else:
                return JSONResponse(status_code=401, content={"error": "Usuario o contraseña incorrectos"})
        else:
            return JSONResponse(status_code=401, content={"error": "Usuario o contraseña incorrectos"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

def logout():
    try:
        response = JSONResponse(status_code=200, content={"message": "Sesión cerrada exitosamente"})
        response.delete_cookie("token")
        return response
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

def isLogin():
    return {"message": "Sesión activa"}

# Funcion auxiliar para hasear la contraseña
def hash_password(password):
    ROUNDS = int(os.getenv("ROUNDS"))
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(ROUNDS))

# Dependencia para proteger endpoints (Se usa con user: dict = Depends(AuthController.verify_session_dependency))
def verify_session_dependency(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")
    try:
        payload = jwt.decode(token, str(JWT_SECRET), algorithms=["HS256"])
        return payload  # Retornamos el payload (y sus datos de usuario) para que el endpoint lo pueda utilizar
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Sesión inválida o corrupta")
