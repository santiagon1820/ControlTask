import os
import bcrypt
import jwt
import models.db as DB
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Cargar el .env
load_dotenv()

def login(user, password):
    try:
        respuesta = DB.GETDB("SELECT id, user, password, type FROM users WHERE user = %s", (user,))
        if respuesta:
            respuesta_user = respuesta[0]
            respuesta_password =  respuesta_user["password"]
            
            # Comprobar que las contraseñas coincidan
            if bcrypt.checkpw(password.encode("utf-8"), respuesta_password.encode("utf-8")): 
                # Generar el Payload para el JWT 
                payload = {
                    "user_id": user["id"],
                    "email": user["email"],
                    "username": user["username"],
                    "type": user["type"],
                    "scope": "full",
                    "exp": datetime.utcnow() + timedelta(seconds=int(JWT_EXPIRES_IN))
                }
                # Generar el token con el payload  
                token = jwt.encode(payload, JWT_SECRET, algorithm="HS256") 

                # Generar fecha de expiracion
                expires_at = datetime.now() + timedelta(hours=24) 
                # Generar la respuesta
                response = JSONResponse(
                    status_code=200,
                    content={
                        "message": "Login exitoso",
                        "token": token,
                        "type": user["type"]
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

# Funcion auxiliar para hasear la contraseña
def hash_password(password):
    ROUNDS = int(os.getenv("ROUNDS"))
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(ROUNDS))

hashed = hash_password("admin")
print(hashed.decode())
