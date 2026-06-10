import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Configuracion({ medico, onProfileUpdate }) {
  const [especialidad, setEspecialidad] = useState(medico?.especialidad || '');
  const [codigoMedico, setCodigoMedico] = useState(medico?.codigo_medico || '');
  const [subiendo, setSubiendo] = useState(false);

  const guardarCambios = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('perfiles_medicos')
      .update({ especialidad, codigo_medico: codigoMedico })
      .eq('id', medico.id);

    if (!error) {
      alert("Perfil actualizado correctamente");
      onProfileUpdate(); // Callback para refrescar los datos en App.jsx
    }
  };

  // Lógica básica para subir avatar al Bucket de Supabase Storage
  const manejarSubidaFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSubiendo(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${medico.id}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('vita-assets')
      .upload(filePath, file);

    if (!uploadError) {
      const { data } = supabase.storage.from('vita-assets').getPublicUrl(filePath);
      await supabase.from('perfiles_medicos').update({ avatar_url: data.publicUrl }).eq('id', medico.id);
      onProfileUpdate();
      alert("Foto de perfil actualizada");
    }
    setSubiendo(false);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Mi Perfil Profesional</h2>
        <form onSubmit={guardarCambios} className="space-y-4">
          
          {/* Avatar editable */}
          <div className="flex items-center gap-4 mb-4">
            <img src={medico?.avatar_url || 'https://via.placeholder.com/150'} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-slate-200" />
            <div>
              <input type="file" accept="image/*" disabled={subiendo} onChange={manejarSubidaFoto} className="text-xs text-slate-500" />
              <p className="text-[10px] text-slate-400 mt-1">Formatos permitidos: JPG, PNG.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Especialidad Médica</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-xl" value={especialidad} onChange={e => setEspecialidad(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Código Médico</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-xl" value={codigoMedico} onChange={e => setCodigoMedico(e.target.value)} />
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-700 text-xs">
            ⚠️ Las credenciales de acceso (correo y contraseña) están gestionadas por el administrador de sistemas y no pueden modificarse desde este panel.
          </div>

          <button type="submit" className="w-full bg-sky-600 text-white p-3 rounded-xl font-bold hover:bg-sky-700 transition">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}