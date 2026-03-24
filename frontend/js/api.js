const API = {
    // Función para hacer login
    login: async function(username, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas o error del servidor');
            }

            const data = await response.json();
            return data; // Retorna los datos (mensaje, token, etc.)

        } catch (error) {
            console.error('Error de login:', error);
            throw error; // Lanza el error para ser manejado en el frontend
        }
    },

    // Función para subir un archivo
    uploadFile: async function(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }

            const data = await response.json();
            return data; // Retorna los datos de la respuesta (por ejemplo, el nombre del archivo subido)

        } catch (error) {
            console.error('Error al subir el archivo:', error);
            throw error; // Lanza el error para manejarlo en el frontend
        }
    },

    // Función genérica para manejar errores
    handleError: function(error) {
        console.error('Error en la API:', error);
        alert(`Ocurrió un error: ${error.message}`); // Muestra un mensaje en pantalla
    }
};

// Exportamos el objeto API para usarlo en otros archivos JS
export default API;


// api.js

const API = {
    // Función para obtener todos los usuarios
    getUsers: async function() {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    // Función para actualizar el rol de un usuario
    updateUserRole: async function(userId, newRole) {
        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (!response.ok) {
                throw new Error('Error al asignar rol');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al asignar rol:', error);
            throw error;
        }
    },

    // Función para eliminar un usuario
    deleteUser: async function(userId) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    },

    // Función para restaurar la contraseña de un usuario
    resetPassword: async function(userId) {
        try {
            const response = await fetch(`/api/users/${userId}/reset-password`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Error al restaurar contraseña');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al restaurar contraseña:', error);
            throw error;
        }
    }
};

export default API;

// api.js

const API = {
    // Función para obtener todas las empresas
    getCompanies: async function() {
        try {
            const response = await fetch('/api/companies');
            if (!response.ok) {
                throw new Error('Error al obtener las empresas');
            }
            const data = await response.json();
            return data; // Retorna la lista de empresas
        } catch (error) {
            console.error('Error al obtener empresas:', error);
            throw error;
        }
    },

    // Función para agregar una empresa
    addCompany: async function(name, email, phone) {
        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });
            if (!response.ok) {
                throw new Error('Error al agregar la empresa');
            }
            return await response.json(); // Retorna los datos de la empresa agregada
        } catch (error) {
            console.error('Error al agregar empresa:', error);
            throw error;
        }
    },

    // Función para eliminar una empresa
    deleteCompany: async function(companyId) {
        try {
            const response = await fetch(`/api/companies/${companyId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la empresa');
            }
            return await response.json(); // Retorna la confirmación de la eliminación
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
            throw error;
        }
    },

    // Función para editar una empresa
    editCompany: async function(companyId, name, email, phone) {
        try {
            const response = await fetch(`/api/companies/${companyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });
            if (!response.ok) {
                throw new Error('Error al editar la empresa');
            }
            return await response.json(); // Retorna los datos de la empresa editada
        } catch (error) {
            console.error('Error al editar empresa:', error);
            throw error;
        }
    }
};

export default API;

// api.js

const API = {
    // Función para cambiar la contraseña del administrador
    changePassword: async function(currentPassword, newPassword) {
        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Error al cambiar la contraseña');
            }

            const data = await response.json();
            return data; // Retorna el mensaje de éxito o error
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            throw error; // Lanza el error para ser manejado en el frontend
        }
    }
};

export default API;

// api.js

const API = {
    // Función para obtener todos los archivos de una empresa
    getFiles: async function(companyId) {
        try {
            const response = await fetch(`/api/files/${companyId}`);
            if (!response.ok) {
                throw new Error('Error al obtener los archivos');
            }
            const data = await response.json();
            return data; // Retorna los archivos de la empresa
        } catch (error) {
            console.error('Error al obtener archivos:', error);
            throw error;
        }
    },

    // Función para actualizar un archivo
    updateFile: async function(fileId, file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el archivo');
            }

            return await response.json(); // Retorna los datos del archivo actualizado
        } catch (error) {
            console.error('Error al actualizar archivo:', error);
            throw error;
        }
    },

    // Función para descargar un archivo
    downloadFile: async function(fileId) {
        try {
            const response = await fetch(`/api/files/download/${fileId}`);
            if (!response.ok) {
                throw new Error('Error al descargar el archivo');
            }
            return await response.blob(); // Retorna el archivo como blob
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            throw error;
        }
    }
};

export default API;

[
    {
      "id": 1,
      "name": "reporte_enero.pdf",
      "uploadDate": "2026-03-20",
      "downloadUrl": "/files/reporte_enero.pdf"
    },
    {
      "id": 2,
      "name": "reporte_febrero.pdf",
      "uploadDate": "2026-03-21",
      "downloadUrl": "/files/reporte_febrero.pdf"
    }
  ]