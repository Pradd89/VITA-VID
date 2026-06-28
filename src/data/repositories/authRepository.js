import { supabase } from '../supabaseClient';

export const authRepository = {
  async iniciarSesion(email, password) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }
};