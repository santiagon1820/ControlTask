from pydantic import BaseModel
from typing import Optional, List

class Login200(BaseModel):
    message: str
    token: str
    type: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "message":"Login exitoso",
                "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsInR5cGUiOiJhZG1pbiIsInNjb3BlIjoiZnVsbCIsImV4cCI6MTc0MjQyOTc4N30.XyZ1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                "type":"1",
                "expires_at":"2025-01-01 00:00:00"
            }
        }
    }

class Login400(BaseModel):
    error: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "error":"Ya tienes una sesión activa"
            }
        }
    }

class Login401(BaseModel):
    error: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "error":"Usuario o contraseña incorrectos"
            }
        }
    }

class Logout200(BaseModel):
    message: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "message":"Sesión cerrada exitosamente"
            }
        }
    }

class isLogin200(BaseModel):
    message: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "message":"Sesión activa"
            }
        }
    }

class isLogin401(BaseModel):
    error: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "error":"Sesión inválida o expirada"
            }
        }
    }

class InternalServerError(BaseModel):
    error: str
    model_config = {
        "json_schema_extra":{
            "example":{
                "error":"Error interno del servidor"
            }
        }
    }