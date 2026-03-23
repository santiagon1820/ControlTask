from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Ruta para obtener todos los archivos de una empresa
@app.get("/api/files/{company_id}")
async def get_files(company_id: int):
    # Aquí deberías obtener los archivos de la empresa desde la base de datos
    files = [
        {"id": 1, "name": "reporte_enero.pdf", "uploadDate": "2026-01-15", "downloadUrl": "/files/reporte_enero.pdf"},
        {"id": 2, "name": "reporte_febrero.pdf", "uploadDate": "2026-02-20", "downloadUrl": "/files/reporte_febrero.pdf"}
    ]
    return files

# Ruta para actualizar un archivo
@app.put("/api/files/{file_id}")
async def update_file(file_id: int, file: UploadFile = File(...)):
    file_location = f"files/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    return {"message": "Archivo actualizado con éxito"}

# Ruta para descargar un archivo
@app.get("/api/files/download/{file_id}")
async def download_file(file_id: int):
    file_path = f"files/reporte_enero.pdf"  # Esta ruta debería ser dinámica según el file_id
    return FileResponse(file_path)
