import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MeetingProvider } from "@videosdk.live/react-sdk";
import VideoCallContainer from '../containers/VideoCallContainer';
import { getToken } from '../../data/api';
import { citasService } from '../../core/services/citasService';

export default function UnirseSala() {
  // react-router-dom mapea el parámetro exacto según tu App.jsx (:meetingId)
  const { meetingId } = useParams();
  const navigate = useNavigate();
  
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [meetingIdReal, setMeetingIdReal] = useState(null);
  
  // Estados para el Lobby adaptado a móviles
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [confirmarIngreso, setConfirmarIngreso] = useState(false);
  const [requiereNombreManual, setRequiereNombreManual] = useState(false);

useEffect(() => {
    const validarYConectar = async () => {
      try {
        console.log("🔍 [VITA] Evaluando parámetro recibido de URL:", meetingId);
        
        if (!meetingId) {
          throw new Error("No se detectó ningún identificador de sala en el enlace de acceso.");
        }

        let meetingIdFinal = null;

        // 💡 EL FIX: Verificar si el parámetro de la URL es puramente numérico (ej: "83")
        const esNumeroCita = /^\d+$/.test(meetingId);

        if (esNumeroCita) {
          // Caso A: Viene el ID numérico de la cita de Supabase (ej: 83)
          console.log("🔢 Es un ID de cita numérico. Consultando en base de datos...");
          const cita = await citasService.validarAccesoASala(meetingId);
          console.log("📊 Respuesta de Supabase:", cita);

          if (cita && cita.meeting_id) {
            meetingIdFinal = cita.meeting_id;
            if (cita.paciente_nombre) {
              setNombrePaciente(cita.paciente_nombre);
              setRequiereNombreManual(false);
            } else {
              setRequiereNombreManual(true);
            }
          } else {
            throw new Error("El médico aún no ha iniciado esta videollamada desde su panel.");
          }
        } else {
          // Caso B: Viene el código con guiones directo de VideoSDK (ej: tfuy-v1v1-z7hlp)
          // Evitamos consultar a Supabase por la columna ID numérica para que no explote Postgres
          console.log("🔤 Es un código de sala directo de VideoSDK con guiones.");
          meetingIdFinal = meetingId;
          setRequiereNombreManual(true); // Le pedimos que escriba su nombre en el lobby
        }

        console.log("🔑 ID de sala final asignado al SDK:", meetingIdFinal);

        const tokenVideo = await getToken();
        setToken(tokenVideo);
        setMeetingIdReal(meetingIdFinal);

      } catch (err) {
        console.error("❌ Error al enlazar sala:", err);
        setError(err.message || "No se pudo conectar de manera segura con el canal de telemedicina.");
      } finally {
        setCargando(false);
      }
    };

    validarYConectar();
  }, [meetingId]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xs font-mono text-slate-400">Verificando credenciales de acceso VITA...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center text-white max-w-md p-6">
          <span className="text-4xl mb-4 block">🚫</span>
          <h2 className="text-xl font-bold mb-2">Error de conexión</h2>
          <p className="text-sm text-slate-400">{error}</p>
          <button onClick={() => navigate('/')} className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2 rounded-xl text-xs transition">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // 🚪 LOBBY INTERMEDIO: Captura la interacción obligatoria del usuario móvil
  if (!confirmarIngreso) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl text-center">
          <span className="text-4xl">🏥</span>
          <h2 className="text-lg font-black mt-3 text-sky-400 tracking-tight">TELEMEDICINA VITA</h2>
          <p className="text-xs text-slate-400 mt-1">Hospital San Gabriel</p>
          
          <div className="mt-6 text-left">
            {requiereNombreManual ? (
              <>
                <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase block mb-2">
                  Ingresa tu nombre completo
                </label>
                <input
                  type="text"
                  value={nombrePaciente}
                  onChange={(e) => setNombrePaciente(e.target.value)}
                  placeholder="Ej. María Pérez"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-sky-500 text-slate-200 transition"
                />
              </>
            ) : (
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 text-center">
                <p className="text-xs text-slate-400">Ingresando como:</p>
                <p className="text-base font-bold text-slate-200 mt-1">{nombrePaciente}</p>
              </div>
            )}
          </div>

          <button
            disabled={!nombrePaciente.trim()}
            onClick={() => setConfirmarIngreso(true)}
            className="w-full mt-6 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg shadow-sky-500/10"
          >
            Unirse a la consulta médica
          </button>
        </div>
      </div>
    );
  }

  // 🎥 CONEXIÓN EN VIVO MULTIMEDIA
  return (
    <MeetingProvider
      config={{
        meetingId: meetingIdReal,
        micEnabled: true,
        webcamEnabled: true,
        name: nombrePaciente,
      }}
      token={token}
    >
      <VideoCallContainer meetingId={meetingIdReal} />
    </MeetingProvider>
  );
}