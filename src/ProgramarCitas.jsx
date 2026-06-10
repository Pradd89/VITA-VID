import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function ProgramarCitas({ medico }) {
  const [form, setForm] = useState({ paciente_nombre: '', paciente_edad: '', paciente_genero: 'Masculino', hora: '', fecha: '', tipo_consulta: 'Consulta General', modalidad: 'Virtual' });

  const registrarCita = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('citas')
      .insert([{ ...form, medico_id: medico.id, estado: 'Pendiente' }]);

    if (!error) {
      alert("¡Cita programada con éxito!");
      setForm({ paciente_nombre: '', paciente_edad: '', paciente_genero: 'Masculino', hora: '', fecha: '', tipo_consulta: 'Consulta General', modalidad: 'Virtual' });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Programar Nueva Cita</h2>
        <form onSubmit={registrarCita} className="space-y-4">
          {/* Inputs estilizados con Tailwind simulando tu diseño (Bordes finos, fuente sans) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nombre del Paciente</label>
            <input type="text" required className="w-full p-2 border border-slate-200 rounded-xl focus:outline-sky-500" value={form.paciente_nombre} onChange={e => setForm({...form, paciente_nombre: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Edad</label>
              <input type="number" required className="w-full p-2 border border-slate-200 rounded-xl" value={form.paciente_edad} onChange={e => setForm({...form, paciente_edad: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Género</label>
              <select className="w-full p-2 border border-slate-200 rounded-xl" value={form.paciente_genero} onChange={e => setForm({...form, paciente_genero: e.target.value})}>
                <option>Masculino</option>
                <option>Femenino</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Fecha</label>
              <input type="date" required className="w-full p-2 border border-slate-200 rounded-xl" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Hora</label>
              <input type="time" required className="w-full p-2 border border-slate-200 rounded-xl" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="w-full bg-sky-600 text-white p-3 rounded-xl font-bold hover:bg-sky-700 transition">Agendar Cita</button>
        </form>
      </div>
    </div>
  );
}