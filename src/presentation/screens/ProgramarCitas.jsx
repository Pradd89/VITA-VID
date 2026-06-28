import React, { useState } from 'react';
import { citasService } from '../../core/services/citasService';

export default function ProgramarCitas({ medico, lanzarAlerta }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('Masculino');
  const [tipoConsulta, setTipoConsulta] = useState('Consulta General');
  const [modalidad, setModalidad] = useState('Virtual');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cargando, setCargando] = useState(false);

  const guardarCita = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      await citasService.agendarCitaMedica(medico.id, {
        paciente_nombre: nombre,
        paciente_edad: edad,
        paciente_genero: genero,
        tipo_consulta: tipoConsulta,
        modalidad,
        fecha,
        hora
      });

      lanzarAlerta("¡Cita programada con éxito!", "success");
      setNombre('');
      setEdad('');
      setFecha('');
      setHora('');
    } catch (error) {
      lanzarAlerta(error.message, "warning");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={guardarCita} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-base font-black text-slate-800 tracking-tight border-b pb-2">Programar Nueva Cita</h3>
      
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre del Paciente</label>
        <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Edad</label>
          <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ej. 29" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Género</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Especialidad/Consulta</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={tipoConsulta} onChange={(e) => setTipoConsulta(e.target.value)}>
            <option value="Consulta General">Consulta General</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Cardiología">Cardiología</option>
            <option value="Ginecología">Ginecología</option>
            <option value="Dermatología">Dermatología</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Modalidad</label>
          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
            <option value="Virtual">Virtual</option>
            <option value="Presencial">Presencial</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha</label>
          <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hora</label>
          <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-sky-500" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>
      </div>

      <button type="submit" disabled={cargando} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold p-3 rounded-xl transition disabled:bg-sky-300 text-sm">
        {cargando ? 'Guardando Cita...' : 'Confirmar y Programar'}
      </button>
    </form>
  );
}