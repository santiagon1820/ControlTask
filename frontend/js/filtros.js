document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('input[placeholder="Buscar empresa o palabra..."]');
    const calendarBtn = document.querySelector('button[title="Filtrar por fecha"]');

    if (!searchInput) return;

    // 1. LÓGICA DEL BUSCADOR EN TIEMPO REAL
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        filtrarTablas(termino);
    });

    // 2. LÓGICA DEL CALENDARIO (Como buscador de fechas)
    if (calendarBtn) {
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.classList.add('hidden');
        calendarBtn.appendChild(dateInput);

        calendarBtn.addEventListener('click', () => {
            if (typeof dateInput.showPicker === 'function') {
                dateInput.showPicker();
            } else {
                dateInput.focus();
            }
        });

        dateInput.addEventListener('change', (e) => {
            if (!e.target.value) return;
            
            // Extraemos la fecha en un formato que el usuario entienda (Ej: 2026-03-15)
            const fechaSeleccionada = e.target.value;
            
            // Ponemos la fecha en el buscador visualmente
            searchInput.value = fechaSeleccionada;
            
            // Disparamos el filtro
            filtrarTablas(fechaSeleccionada.toLowerCase());
        });
    }

    // 3. FUNCIÓN MAESTRA DE FILTRADO
    function filtrarTablas(termino) {
        // Obtenemos todos los contenedores de las tablas por año (Ej: div con 2026, 2025...)
        const seccionesAnuales = document.querySelectorAll('h3, h2'); // Los títulos que dicen "Estado de Reportes 2026"

        seccionesAnuales.forEach(titulo => {
            // Buscamos si el título es el de un año
            if (titulo.innerText.toLowerCase().includes("estado de reportes")) {
                const contenedorTabla = titulo.parentElement.nextElementSibling;
                if (!contenedorTabla || !contenedorTabla.classList.contains('table-container')) return;

                const tituloTexto = titulo.innerText.toLowerCase();
                const filas = contenedorTabla.querySelectorAll('tbody tr');
                let hayFilasVisibles = false;

                filas.forEach(fila => {
                    // Texto de toda la fila (Empresa + Estados "Terminado", "En proceso")
                    const textoFila = fila.innerText.toLowerCase();
                    
                    // Si el término está en el título (ej. buscó "2026") o en la fila (ej. "Empresa A" o "Terminado")
                    if (termino === "" || tituloTexto.includes(termino) || textoFila.includes(termino)) {
                        fila.style.display = ''; // Mostrar
                        hayFilasVisibles = true;
                    } else {
                        fila.style.display = 'none'; // Ocultar
                    }
                });

                // Si ninguna fila coincidió y tampoco coincidió el año, ocultamos toda la tabla
                if (!hayFilasVisibles && !tituloTexto.includes(termino)) {
                    titulo.parentElement.style.display = 'none';
                    contenedorTabla.style.display = 'none';
                } else {
                    titulo.parentElement.style.display = 'flex';
                    contenedorTabla.style.display = 'block';
                }
            }
        });
    }
});