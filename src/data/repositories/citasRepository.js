import { supabase } from '../supabaseClient';

export const citasRepository = {
  async buscarConflictos(medicoId, fecha, hora) {
    return await supabase
      .from('citas')
      .select('id, paciente_nombre, estado')
      .eq('medico_id', medicoId)
      .eq('fecha', fecha)
      .eq('hora', hora)
      .in('estado', ['Pendiente', 'Completada']);
  },

  async insertarCita(citaData) {
    return await supabase
      .from('citas')
      .insert([citaData]);
  },

  async obtenerCitaPorId(meetingId) {
    return await supabase
      .from('citas')
      .select('meeting_id, paciente_nombre')
      .eq('id', meetingId)
      .maybeSingle();
  }
};