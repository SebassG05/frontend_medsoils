// Servicio para registro de usuario
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function registerUser({ name, email, password, confirmPassword }) {
  try {
    console.log('🔄 Enviando petición de registro a:', `${API_URL.replace(/\/$/, '')}/auth/register`);
    console.log('📦 Datos:', { name, email });
    
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    
    const data = await response.json();
    console.log('📥 Respuesta del servidor:', { status: response.status, data });
    
    if (!response.ok) {
      const errorMessage = data.message || data.errors?.[0]?.msg || 'Error al registrar usuario';
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error en registerUser:', error);
    throw error;
  }
}

export async function loginUser({ email, password }) {
  try {
    console.log('🔄 Enviando petición de login a:', `${API_URL.replace(/\/$/, '')}/auth/login`);
    console.log('📦 Datos:', { email });
    
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    console.log('📥 Respuesta del servidor:', { status: response.status, data });
    
    if (!response.ok) {
      const errorMessage = data.message || data.errors?.[0]?.msg || 'Error al iniciar sesión';
      throw new Error(errorMessage);
    }
    
    // Guardar token en localStorage
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error en loginUser:', error);
    throw error;
  }
}
