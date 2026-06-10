import React, { useState } from 'react';
import { User, Lock, Activity } from 'lucide-react';
import { supabase } from './supabaseClient'; // <-- Asegúrate de ajustar la ruta de importación

export default function Login({ onLogin }) {
  // 1. Estados para controlar el formulario, carga y errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // --- 2. URL DE LA BROMA (Rick Astley) ---
  // Usamos este link para el "Rickroll". Se abre en una pestaña nueva.
  const rickRollUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";


  // 3. Función para manejar la autenticación con Supabase (Tu lógica original)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log('Autenticación exitosa:', data.user);
      
      // Ejecutamos la función onLogin pasándole los datos del usuario si tu App lo requiere
      if (onLogin) {
        onLogin(data.user); 
      }

    } catch (error) {
      // Manejo de errores amigable en español
      if (error.message === 'Invalid login credentials') {
        setErrorMsg('El correo electrónico o la contraseña son incorrectos.');
      } else {
        setErrorMsg(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 overflow-hidden">
      {/* Líneas de pulso de fondo decorativas */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-between items-center px-10">
        <Activity size={300} className="text-sky-600" />
        <Activity size={300} className="text-sky-600" />
      </div>

      {/* Tarjeta de Login */}
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 z-10 mx-4">
        
        {/* --- 4. NUEVO ENCABEZADO CON IMÁGENES (Basado en el mockup) --- */}
        <div className="flex justify-center items-center gap-6 mb-8 border-b border-slate-100 pb-6">
          <div className="text-center flex flex-col items-center">
            {/* Logo Hospital San Gabriel con su ícono de San Gabriel */}
            <img 
              src="/img/logo-hospital-gabriel.png" // <--- ASEGÚRATE DE COLOCAR TUS IMÁGENES EN LA CARPETA PUBLIC
              alt="San Gabriel con Cruz" 
              className="h-16 w-auto mb-2" // Alto de 64px, ancho proporcional
            />
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Hospital</p>
            <p className="text-base font-black text-sky-900 uppercase tracking-tight">San Gabriel</p>
            <p className="text-[9px] text-slate-400 italic">de la Virgen Dolorosa</p>
          </div>
          <div className="h-14 w-[1px] bg-slate-300"></div>
          <div className="flex flex-col items-center">
            {/* Logo VITA con su ícono circular de pulso y hoja */}
            <img 
              src="/img/logo-vita.png" // <--- ASEGÚRATE DE COLOCAR TUS IMÁGENES EN LA CARPETA PUBLIC
              alt="VITA Pulso Circular" 
              className="h-16 w-auto mb-2" // Alto de 64px, ancho proporcional
            />
            <div className="flex items-center gap-1 text-sky-600 font-black text-3xl tracking-wider">
              VITA
            </div>
          </div>
        </div>

        {/* Eslogan */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-sky-900 tracking-tight">VITA</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
            Tu salud, a un clic.
          </p>
        </div>

        {/* Alerta de Error en caso de fallo */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-5 h-5 text-slate-400" />
              <input
                type="email" // Cambiado a 'email' para validar el formato nativamente
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-lg text-sm shadow-md transition-all ${
              loading 
                ? 'bg-sky-400 cursor-not-allowed shadow-none' 
                : 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'
            }`}
          >
            {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Enlaces de pie de página */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer">
            
          </p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-400 font-medium items-center">
            <span className="hover:underline cursor-pointer"></span>
            <span>•</span>
            
            {/* --- 5. EL ENLACE DEL RICKROLL (Soporte técnico) --- */}
            {/* Usamos una etiqueta <a> que abre el link en una pestaña nueva */}
            <a 
              href={rickRollUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline cursor-pointer text-slate-400 hover:text-sky-600"
            >
              Soporte técnico
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}