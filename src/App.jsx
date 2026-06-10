import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { supabase } from './supabaseClient'; // Tu configuración de Supabase

export default function App() {
  const [session, setSession] = useState(null);
  const [medicoDatos, setMedicoDatos] = useState(null);

  useEffect(() => {
    // Escuchar cambios de sesión en Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchMedicoDatos(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchMedicoDatos(session.user.id);
      } else {
        setMedicoDatos(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMedicoDatos = async (userId) => {
    const { data, error } = await supabase
      .from('perfiles_medicos')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error) setMedicoDatos(data);
  };

  const VIDEO_SDK_TOKEN = "tu_token_aqui";

  if (!session) {
    return <Login />;
  }

  return (
    <MeetingProvider
      config={{
        meetingId: "consulta-vitas-sala",
        micEnabled: true,
        webcamEnabled: true,
        name: medicoDatos?.nombre_completo || "Médico",
      }}
      token={VIDEO_SDK_TOKEN}
    >
      <Dashboard medico={medicoDatos} onLogout={() => supabase.auth.signOut()} />
    </MeetingProvider>
  );
}