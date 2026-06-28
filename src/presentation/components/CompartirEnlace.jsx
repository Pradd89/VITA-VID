import React, { useState } from 'react';
import { Copy, Check, Share2, Users } from 'lucide-react';

export default function CompartirEnlace({ meetingId, pacienteNombre, onClose }) {
  const [copiado, setCopiado] = useState(false);

  // Construir el enlace completo usando el ID de la cita (no el meeting_id de VideoSDK)
  const enlaceCompleto = `${window.location.origin}/unirse/${meetingId}`;

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(enlaceCompleto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = enlaceCompleto;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  const compartirVia = (medio) => {
    const texto = `🔗 ${pacienteNombre || 'Paciente'}, aquí tienes el enlace para tu consulta médica VITA:\n\n${enlaceCompleto}\n\n👨‍⚕️ Tu médico te espera en la sala virtual.`;

    if (medio === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
    } else if (medio === 'email') {
      window.open(`mailto:?subject=Consulta Médica VITA&body=${encodeURIComponent(texto)}`, '_blank');
    } else if (medio === 'sms') {
      window.open(`sms:?body=${encodeURIComponent(texto)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl max-w-md w-full space-y-4 mx-4 animate-slide-up">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800">Invitar Paciente</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">×</button>
        </div>

        <div className="bg-sky-50 p-3 rounded-xl border border-sky-100">
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Sala de Consulta</p>
          <p className="text-xs text-slate-600 font-mono mt-0.5">{meetingId}</p>
          {pacienteNombre && (
            <p className="text-xs text-slate-500 mt-1">
              Paciente: <span className="font-semibold text-slate-700">{pacienteNombre}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enlace de acceso</p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={enlaceCompleto} 
              readOnly 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 font-mono focus:outline-none select-all"
              onClick={(e) => e.target.select()}
            />
            <button 
              onClick={copiarEnlace} 
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1 ${
                copiado 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Copiar enlace"
            >
              {copiado ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copiado && (
            <p className="text-[10px] text-emerald-600 font-bold animate-pulse">✅ Enlace copiado al portapapeles</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compartir con el paciente</p>
          <div className="flex gap-2">
            <button 
              onClick={() => compartirVia('whatsapp')} 
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>💬</span> WhatsApp
            </button>
            <button 
              onClick={() => compartirVia('email')} 
              className="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>✉️</span> Correo
            </button>
            <button 
              onClick={() => compartirVia('sms')} 
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span>📱</span> SMS
            </button>
          </div>
        </div>

        <button 
          onClick={() => window.open(enlaceCompleto, '_blank')} 
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4" /> Abrir enlace en nueva pestaña
        </button>

        <p className="text-[9px] text-slate-400 text-center border-t border-slate-100 pt-3">
          El paciente podrá unirse desde cualquier dispositivo con navegador web.
          <br />
          <span className="text-[8px] text-slate-300">El doctor debe iniciar la consulta primero</span>
        </p>
      </div>
    </div>
  );
}