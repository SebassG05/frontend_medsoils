// Servicio para registro de usuario
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1';

export async function registerUser({ name, email, password, confirmPassword }) {
  try {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Si hay errores de validación, mostrarlos todos
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        throw new Error(errorMessages);
      }
      const errorMessage = data.message || 'Failed to register user';
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || data.errors?.[0]?.msg || 'Failed to sign in';
      throw new Error(errorMessage);
    }
    
    // Guardar token en localStorage
    const token = data.data?.accessToken || data.data?.token
    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Changes the password for an authenticated user who has the mustResetPassword flag.
 * Clears the flag on success and updates localStorage.
 */
export async function forceChangePassword(newPassword) {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL.replace(/\/$/, '')}/auth/force-change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to change password')

  // Update the stored user so mustResetPassword is cleared
  if (data.data?.user) {
    localStorage.setItem('user', JSON.stringify(data.data.user))
  }

  return data
}
