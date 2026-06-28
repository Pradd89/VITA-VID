import { authRepository } from '../../data/repositories/authRepository';

export const authService = {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("El correo y la contraseña son obligatorios.");
    }
    
    const { data, error } = await authRepository.iniciarSesion(email, password);
    if (error) throw error;
    
    return data.user;
  }
};