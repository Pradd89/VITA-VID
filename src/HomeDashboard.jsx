import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function HomeDashboard({ medico }) {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCitasHoy = async () => {
      const hoy = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('citas')
        .select('*')
        .eq('medico_id', medico.id)
        .eq('fecha', hoy)
        .order('hora', { ascending: true });

      if (!error) setCitas(data);

      setCargando(false);
    };

    if (medico) fetchCitasHoy();
  }, [medico]);

  // Cálculos de las tarjetas superiores
  const citasHoyContador = citas.length;
  const virtualesContador = citas.filter(c => c.modalidad === 'Virtual').length;

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* Header Principal */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bienvenido, {medico?.nombre_completo} <span className="text-emerald-500">✓</span></h1>
        <p className="text-slate-400 text-sm mt-1">Aquí tienes un resumen de tu actividad médica.</p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 rounded-xl text-orange-500 font-bold">📅</div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase">Citas de Hoy</p>
            <p className="text-3xl font-extrabold text-slate-800">{citasHoyContador}</p>
          </div>
        </div>
        {/* Repetir estructura para Pacientes Atendidos y Consultas Virtuales usando tus colores */}
      </div>

      {/* Tabla de Citas del Día */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">🕒 Citas del Día</h2>
        
        {cargando ? (
          <p className="text-slate-400 text-center py-6">Cargando citas...</p>
        ) : citas.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-400 font-medium">No tienes citas programadas para el día de hoy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase font-semibold border-b border-slate-100">
                  <th className="pb-3">Hora</th>
                  <th className="pb-3">Paciente</th>
                  <th className="pb-3">Tipo de Consulta</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {citas.map((cita) => (
                  <tr key={cita.id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-semibold text-sky-600 bg-sky-50/50 px-3 rounded-lg">{cita.hora.substring(0,5)} AM</td>
                    <td className="py-4">
                      <p className="font-bold text-slate-800">{cita.paciente_nombre}</p>
                      <p className="text-xs text-slate-400">{cita.paciente_edad} años • {cita.paciente_genero}</p>
                    </td>
                    <td className="py-4">
                      <p className="font-medium text-slate-700">{cita.tipo_consulta}</p>
                      <p className="text-xs text-slate-400">{cita.modalidad}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cita.estado === 'Pendiente' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {cita.estado}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      {/* Aquí pones los botones de tu mockup */}
                      <button className="p-2 hover:bg-slate-100 rounded-lg mr-2">📺</button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg">›</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}