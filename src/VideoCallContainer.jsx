// src/VideoCallContainer.jsx
import React, { useState, useEffect, useRef } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

// ============================================
// COMPONENTE: Vista de un participante
// ============================================
function ParticipantView({ participantId }) {
  const { webcamOn, displayName, isLocal, webcamStream } = useParticipant(participantId);
  const videoRef = useRef(null);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current.play().catch(() => {});
    }
  }, [webcamStream]);

  return (
    <div className="h-full w-full bg-slate-950 relative overflow-hidden rounded-xl flex items-center justify-center min-h-[200px] border border-slate-800">
      {webcamOn && webcamStream ? (
        <video ref={videoRef} autoPlay playsInline muted={isLocal} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-slate-800 border-2 border-slate-700 h-20 w-20 flex items-center justify-center">
            <span className="text-3xl text-sky-400 font-black">{displayName?.charAt(0) || "U"}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">{isLocal ? "Tú" : displayName}</p>
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-full">
        <span className="text-white text-xs">{isLocal ? "Tú" : displayName}</span>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Self View
// ============================================
function SelfView({ localParticipant, micOn, camOn, onToggle }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (localParticipant && localParticipant.webcamStream && videoRef.current) {
      videoRef.current.srcObject = localParticipant.webcamStream;
      videoRef.current.play().catch(() => {});
    }
  }, [localParticipant]);

  return (
    <div
      className="absolute bottom-4 right-4 w-36 h-28 md:w-48 md:h-36 bg-slate-950 rounded-xl border-2 border-sky-500/50 shadow-2xl overflow-hidden cursor-pointer"
      onClick={onToggle}
    >
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-slate-900/80 to-transparent p-1 flex justify-between">
        <span className="text-[8px] font-bold text-sky-400 uppercase">Tú</span>
        <div className="flex gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${micOn ? "bg-emerald-500" : "bg-rose-500"}`} />
          <span className={`w-1.5 h-1.5 rounded-full ${camOn ? "bg-emerald-500" : "bg-rose-500"}`} />
        </div>
      </div>
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function VideoCallContainer({ onLeave }) {
  const [micEncendido, setMicEncendido] = useState(true);
  const [camEncendida, setCamEncendida] = useState(true);
  const [mostrarSelfView, setMostrarSelfView] = useState(true);
  const [participantesList, setParticipantesList] = useState([]);
  const [error, setError] = useState(null);

  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    participants,
    meetingId,
    localParticipant,
    enableWebcam,
    enableMic,
    disableWebcam,
    disableMic,
  } = useMeeting({
    onParticipantJoined: (participant) => {
      console.log("✅ Participante unido:", participant.id);
      setParticipantesList((prev) => [...prev, participant.id]);
    },
    onParticipantLeft: (participant) => {
      console.log("❌ Participante salió:", participant.id);
      setParticipantesList((prev) => prev.filter((id) => id !== participant.id));
    },
    onMeetingLeft: () => {
      console.log("🔴 Reunión terminada");
      onLeave();
    },
    onError: (error) => {
      console.error("❌ Error en reunión:", error);
      setError(error.message || "Error en la videollamada");
    },
  });

  // ============================================
  // INICIAR REUNIÓN - SIN start/stop
  // ============================================
  useEffect(() => {
    const iniciarReunion = async () => {
      try {
        console.log("🚀 Uniéndose a la reunión...");
        await join();

        // Intentar activar cámara
        try {
          await enableWebcam();
          setCamEncendida(true);
          console.log("📷 Cámara activada");
        } catch (e) {
          console.warn("Error al activar cámara:", e);
          setCamEncendida(false);
        }

        // Intentar activar micrófono
        try {
          await enableMic();
          setMicEncendido(true);
          console.log("🎙️ Micrófono activado");
        } catch (e) {
          console.warn("Error al activar micrófono:", e);
          setMicEncendido(false);
        }
      } catch (error) {
        console.error("❌ Error al unirse:", error);
        setError(error.message || "Error al conectar");
      }
    };

    iniciarReunion();

    return () => {
      try {
        leave();
      } catch (e) {}
    };
  }, []);

  // ============================================
  // MANEJADORES
  // ============================================
  const toggleMicHandler = async () => {
    try {
      if (micEncendido) {
        await disableMic();
      } else {
        await enableMic();
      }
      setMicEncendido(!micEncendido);
    } catch (error) {
      console.error("Error toggle mic:", error);
    }
  };

  const toggleCamHandler = async () => {
    try {
      if (camEncendida) {
        await disableWebcam();
      } else {
        await enableWebcam();
      }
      setCamEncendida(!camEncendida);
    } catch (error) {
      console.error("Error toggle cam:", error);
    }
  };

  const terminarLlamada = () => {
    try {
      leave();
      onLeave();
    } catch (error) {
      console.error("Error al terminar:", error);
      onLeave();
    }
  };

  // ============================================
  // RENDER
  // ============================================
  const participantIds = Array.from(participants.keys()).filter((id) => id !== localParticipant?.id);
  const todosLosParticipantes = participantIds.length > 0 ? participantIds : 
    (localParticipant ? [localParticipant.id] : []);

  if (error) {
    return (
      <div className="p-8 bg-slate-900 text-white rounded-2xl min-h-[400px] flex flex-col items-center justify-center m-4">
        <span className="text-4xl mb-4">🚫</span>
        <h3 className="text-lg font-bold">Error en la videollamada</h3>
        <p className="text-sm text-slate-400 mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-xl text-sm font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900 text-white rounded-2xl min-h-[500px] flex flex-col shadow-2xl border border-slate-800 m-4">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold">Consulta Médica VITA</h2>
          <p className="text-[10px] text-slate-400">Sala: {meetingId?.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2 bg-sky-500/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-bold text-sky-400">En Vivo</span>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-grow my-3 relative min-h-[350px]">
        {todosLosParticipantes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {todosLosParticipantes.map((id) => (
              <div key={id} className="min-h-[200px]">
                <ParticipantView participantId={id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-slate-700 rounded-xl">
            <div className="text-center">
              <span className="text-4xl">⏳</span>
              <p className="text-sm text-slate-400 mt-2">Conectando...</p>
            </div>
          </div>
        )}

        {/* SELF-VIEW */}
        {mostrarSelfView && localParticipant && todosLosParticipantes.length > 0 && (
          <SelfView
            localParticipant={localParticipant}
            micOn={micEncendido}
            camOn={camEncendida}
            onToggle={() => setMostrarSelfView(!mostrarSelfView)}
          />
        )}
      </div>

      {/* CONTROLES */}
      <div className="flex flex-wrap gap-2 justify-center border-t border-slate-800 pt-3">
        <button
          onClick={toggleMicHandler}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            micEncendido ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-rose-600 border-rose-500 hover:bg-rose-700"
          }`}
        >
          {micEncendido ? "🎙️ Mic" : "🔇 Silenciado"}
        </button>

        <button
          onClick={toggleCamHandler}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
            camEncendida ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-rose-600 border-rose-500 hover:bg-rose-700"
          }`}
        >
          {camEncendida ? "📷 Cámara" : "🚫 Apagada"}
        </button>

        <button
          onClick={terminarLlamada}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2 rounded-xl transition"
        >
          🔴 Terminar
        </button>
      </div>
    </div>
  );
}