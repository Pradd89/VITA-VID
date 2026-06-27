import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MeetingProvider } from "@videosdk.live/react-sdk";
import VideoCallContainer from './VideoCallContainer';
import { getToken } from './api';
import { supabase } from './supabaseClient';

export default function UnirseSala() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [meetingIdReal, setMeetingIdReal] = useState(null);

  useEffect(() => {
    const validarYConectar = async () => {
      try {
        console.log("🔍 Buscando cita con ID:", meetingId);
        
        // Buscar la cita en Supabase
        const { data: cita, error: citaError } = await supabase
          .from('citas')
          .select('meeting_id, paciente_nombre')
          .eq('id', meetingId)
          .maybeSingle();

        let meetingIdFinal = meetingId;
        
        // Si encontramos la cita y tiene meeting_id, usamos ese
        if (cita && cita.meeting_id) {
          meetingIdFinal = cita.meeting_id;
          console.log("✅ Cita encontrada, meeting_id:", meetingIdFinal);
        } else if (cita) {
          console.log("⚠️ Cita encontrada pero sin meeting_id (el doctor aún no inició la llamada)");
          setError('El doctor aún no ha iniciado la consulta. Por favor, espera un momento.');
          setCargando(false);
          return;
        } else {
          console.log("⚠️ No se encontró la cita, intentando conectar directamente a VideoSDK");
        }

        // Obtener token de VideoSDK
        const videoToken = await getToken();
        setToken(videoToken);

        // Solicitar nombre del paciente
        const nombre = prompt('Por favor, ingresa tu nombre completo para la consulta:');
        if (!nombre) {
          navigate('/');
          return;
        }
        setNombrePaciente(nombre);
        setMeetingIdReal(meetingIdFinal);
        setCargando(false);
        
      } catch (err) {
        console.error("❌ Error en validación:", err);
        setError('Error al conectar con la sala: ' + err.message);
        setCargando(false);
      }
    };

    validarYConectar();
  }, [meetingId, navigate]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-400">Conectando con la sala de consulta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md p-6">
          <span className="text-4xl mb-4 block">🚫</span>
          <h2 className="text-xl font-bold mb-2">Error de conexión</h2>
          <p className="text-sm text-slate-400">{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2 rounded-xl transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <MeetingProvider
      config={{
        meetingId: meetingIdReal,
        micEnabled: true,
        webcamEnabled: true,
        name: nombrePaciente || 'Paciente',
      }}
      token={token}
    >
      <VideoCallContainer onLeave={() => navigate('/')} />
    </MeetingProvider>
  );
}