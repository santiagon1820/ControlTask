import { showNotification } from '/js/noti.js';
const API = {
    // ==========================================
    // UTILIDADES
    // ==========================================
    handleError: function(error) {
        console.error('Error en la API:', error);
        alert(`Ocurrió un error: ${error.message}`); 
    },

    // ==========================================
    // AUTENTICACIÓN
    // ==========================================
    login: async function(username, password) {
        let errorMessage = null;
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            errorMessage = await response.json();
            if (!response.ok){
                showNotification(errorMessage.error, 'error');
                return response.status;
            }
            showNotification(errorMessage.message, 'success');
            return response.status;
        } catch (error) {
            showNotification(errorMessage.error, 'error');
            throw error; 
        }
    },

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
            if (!response.ok) throw new Error('Error al cambiar la contraseña');
            return await response.json(); 
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            throw error; 
        }
    },

    // ==========================================
    // USUARIOS
    // ==========================================
    getUsers: async function() {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Error al obtener usuarios');
            return await response.json();
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            throw error;
        }
    },

    updateUserRole: async function(userId, newRole) {
        try {
            const response = await fetch(`/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            if (!response.ok) throw new Error('Error al asignar rol');
            return await response.json();
        } catch (error) {
            console.error('Error al asignar rol:', error);
            throw error;
        }
    },

    deleteUser: async function(userId) {
        try {
            const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar usuario');
            return await response.json();
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw error;
        }
    },

    resetPassword: async function(userId) {
        try {
            const response = await fetch(`/api/users/${userId}/reset-password`, { method: 'POST' });
            if (!response.ok) throw new Error('Error al restaurar contraseña');
            return await response.json();
        } catch (error) {
            console.error('Error al restaurar contraseña:', error);
            throw error;
        }
    },

    // ==========================================
    // EMPRESAS
    // ==========================================
    getCompanies: async function() {
        try {
            const response = await fetch('/api/companies');
            if (!response.ok) throw new Error('Error al obtener las empresas');
            return await response.json(); 
        } catch (error) {
            console.error('Error al obtener empresas:', error);
            throw error;
        }
    },

    addCompany: async function(name, email, phone) {
        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });
            if (!response.ok) throw new Error('Error al agregar la empresa');
            return await response.json(); 
        } catch (error) {
            console.error('Error al agregar empresa:', error);
            throw error;
        }
    },

    editCompany: async function(companyId, name, email, phone) {
        try {
            const response = await fetch(`/api/companies/${companyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone })
            });
            if (!response.ok) throw new Error('Error al editar la empresa');
            return await response.json(); 
        } catch (error) {
            console.error('Error al editar empresa:', error);
            throw error;
        }
    },

    deleteCompany: async function(companyId) {
        try {
            const response = await fetch(`/api/companies/${companyId}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar la empresa');
            return await response.json(); 
        } catch (error) {
            console.error('Error al eliminar empresa:', error);
            throw error;
        }
    },

    // ==========================================
    // ARCHIVOS
    // ==========================================
    uploadFile: async function(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Error al subir el archivo');
            return await response.json(); 
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            throw error; 
        }
    },

    getFiles: async function(companyId) {
        try {
            const response = await fetch(`/api/files/${companyId}`);
            if (!response.ok) throw new Error('Error al obtener los archivos');
            return await response.json(); 
        } catch (error) {
            console.error('Error al obtener archivos:', error);
            throw error;
        }
    },

    updateFile: async function(fileId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`/api/files/${fileId}`, {
                method: 'PUT',
                body: formData
            });
            if (!response.ok) throw new Error('Error al actualizar el archivo');
            return await response.json(); 
        } catch (error) {
            console.error('Error al actualizar archivo:', error);
            throw error;
        }
    },

    downloadFile: async function(fileId) {
        try {
            const response = await fetch(`/api/files/download/${fileId}`);
            if (!response.ok) throw new Error('Error al descargar el archivo');
            return await response.blob(); 
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            throw error;
        }
    }
};

// Exportamos el objeto UNA SOLA VEZ
export default API;