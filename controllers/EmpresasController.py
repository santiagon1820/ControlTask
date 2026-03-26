import models.db as DB
from fastapi.responses import JSONResponse

def get_empresas(year):
    try:
        # Obtenemos todos los años únicos ordenados del más reciente al más antiguo
        years_query = DB.GETDB("SELECT DISTINCT year FROM data ORDER BY year DESC")
        available_years = [r["year"] for r in years_query] if years_query else []
        total_pages = len(available_years)

        # Si no se proporciona el año, buscamos el más reciente en la lista
        if not year:
            if available_years:
                year = available_years[0]
            else:
                # Si la tabla está vacía, no hay nada que mostrar
                return JSONResponse(status_code=200, content={"Totalpages": 0, "ActualPage": 1, "AvailableYears": [], "empresas": []})
        else:
            year = int(year)

        # Determinar 'current_page' (la página 1 es el año más reciente)
        current_page = available_years.index(year) + 1 if year in available_years else 1

        # Obtenemos los registros y hacemos un JOIN con la tabla clients para obtener el nombre
        query = """
            SELECT 
                c.name as empresa_name,
                d.month, 
                d.year, 
                d.DYP_Status, 
                d.DYP_File, 
                d.DIOT_Status, 
                d.DIOT_File, 
                d.CE_Status, 
                d.CE_FILE 
            FROM data d
            JOIN clients c ON d.id_data = c.id_client
            WHERE d.year = %s
            ORDER BY c.name ASC, 
                     FIELD(d.month, 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre')
        """
        
        registros = DB.GETDB(query, (year,))
        
        # Estructuramos la respuesta agrupando los datos por cada empresa
        empresas_agrupadas = {}
        if registros:
            for row in registros:
                nombre = row["empresa_name"]
                
                # Inicializar la empresa si no existe aún en nuestro diccionario
                if nombre not in empresas_agrupadas:
                    empresas_agrupadas[nombre] = {
                        "name": nombre,
                        "data": []
                    }
                
                # Guardar el registro limpiando 'empresa_name' para que no sea redundante en los hijos
                dato_mes = {k: v for k, v in row.items() if k != "empresa_name"}
                empresas_agrupadas[nombre]["data"].append(dato_mes)

        return JSONResponse(status_code=200, content={
            "Totalpages": total_pages,
            "ActualPage": current_page,
            "AvailableYears": available_years,
            "empresas": list(empresas_agrupadas.values())
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
