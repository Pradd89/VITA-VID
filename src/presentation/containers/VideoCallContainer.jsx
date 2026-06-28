// src/presentation/containers/VideoCallContainer.jsx
import React, { useState, useEffect } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import ParticipantGrid from "./ParticipantGrid";
import WaitingToJoinScreen from "../screens/WaitingToJoin"; 

export default function VideoCallContainer({ meetingId, onLeave }) {
  const [error, setError] = useState(null);
  const [micEncendido, setMicEncendido] = useState(true);
  const [camEncendida, setCamEncendida] = useState(true);
  const [mostrarSelfView, setMostrarSelfView] = useState(true);
  const [reunionIniciada, setReunionIniciada] = useState(false);

  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    participants,
    localParticipant,
  } = useMeeting({
    onMeetingJoined: () => {
      console.log("🍏 Conexión establecida: El usuario ingresó a la sala.");
      setReunionIniciada(true);
    },
    onMeetingLeft: () => {
      console.log("🔴 Consulta VITA terminada");
      if (onLeave) onLeave();
    },
    onError: (error) => {
      console.error("❌ Error registrado en VideoSDK:", error);
      setError(error.message || "Error en la interconexión de videollamada");
    },
  });

  useEffect(() => {
    // Agregamos un pequeño delay de 500ms para evitar la condición de carrera con el Provider
    const timer = setTimeout(() => {
      if (meetingId) {
        console.log("🚀 Uniendo de forma segura a la sala:", meetingId);
        join();
      } else {
        setError("El identificador de la sala (meetingId) es inválido o no fue recibido.");
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      try {
        leave();
      } catch (e) {
        console.log("Meeting ya cerrado al desmontar.");
      }
    };
  }, [meetingId]);

  // Obtenemos los participantes activos en la llamada
  const participantIds = Array.from(participants.keys());

  if (error) {
    return (
      <div className="p-8 bg-slate-900 text-white rounded-2xl min-h-[400px] flex flex-col items-center justify-center m-4 border border-rose-500/20">
        <span className="text-4xl mb-4">🚫</span>
        <h3 className="text-lg font-bold">Error en Telemedicina</h3>
        <p className="text-sm text-slate-400 mt-2">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl text-sm font-bold transition">
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900 text-white rounded-2xl min-h-[500px] flex flex-col shadow-2xl border border-slate-800 m-4 flex-1">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-black text-white tracking-tight uppercase">Consulta Médica VITA</h2>
          <p className="text-[10px] font-mono text-slate-400">Sala ID: {meetingId || "Cargando..."}</p>
        </div>
        <div className="flex items-center gap-2 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
          <span className={`w-2 h-2 rounded-full ${reunionIniciada ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
          <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase">
            {reunionIniciada ? "En Vivo" : "Conectando"}
          </span>
        </div>
      </div>

      {/* Espacio Central */}
      <div className="flex-grow my-3 relative min-h-[350px] flex">
        {reunionIniciada && participantIds.length > 0 ? (
          <ParticipantGrid participantIds={participantIds} />
        ) : (
          /* 🍏 Reemplazado de forma limpia por tu componente de radar animado profesional */
          <WaitingToJoinScreen 
            nombreSala={meetingId} 
            onCancel={() => window.location.reload()} 
          />
        )}

        {/* Vista previa del médico/usuario local (Self View) */}
        {mostrarSelfView && localParticipant && localParticipant.webcamOn && (
          <div
            className="absolute bottom-4 right-4 w-32 h-24 md:w-40 md:h-28 bg-slate-950 rounded-xl border-2 border-sky-500/40 shadow-2xl overflow-hidden cursor-pointer group z-20 transition-all hover:border-sky-500"
            onClick={() => setMostrarSelfView(false)}
            title="Haz clic para ocultar tu vista previa"
          >
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-900/90 to-transparent p-1.5 flex justify-between items-center z-30">
              <span className="text-[8px] font-black text-sky-400 tracking-wider uppercase">Tú</span>
              <div className="flex gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${micEncendido ? "bg-emerald-500" : "bg-rose-500"}`} />
                <span className={`w-1.5 h-1.5 rounded-full ${camEncendida ? "bg-emerald-500" : "bg-rose-500"}`} />
              </div>
            </div>
            <video
              ref={(ref) => {
                if (ref && localParticipant?.webcamStream) {
                  ref.srcObject = localParticipant.webcamStream;
                  ref.play().catch((e) => console.log("Stream preview bloqueado:", e));
                }
              }}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </div>
        )}
      </div>

      {/* Controles de la llamada */}
      <div className="flex flex-wrap gap-2 justify-center border-t border-slate-800 pt-3 z-10">
        <button
          onClick={async () => { await toggleMic(); setMicEncendido(!micEncendido); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${micEncendido ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" : "bg-rose-600 border-rose-500 text-white"}`}
        >
          {micEncendido ? "🎙️ Micrófono" : "🔇 Silenciado"}
        </button>
        <button
          onClick={async () => { await toggleWebcam(); setCamEncendida(!camEncendida); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${camEncendida ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200" : "bg-rose-600 border-rose-500 text-white"}`}
        >
          {camEncendida ? "📷 Cámara" : "🚫 Video Apagado"}
        </button>
        <button
          onClick={() => { leave(); }}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-6 py-2 rounded-xl transition shadow-lg shadow-rose-900/20"
        >
          🔴 Terminar Consulta
        </button>
      </div>
    </div>
  );
}