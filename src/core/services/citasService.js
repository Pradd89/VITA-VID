import { citasRepository } from '../../data/repositories/citasRepository';

export const citasService = {
  async agendarCitaMedica(medicoId, datosCita) {
    if (!datosCita.paciente_nombre || !datosCita.paciente_edad || !datosCita.fecha || !datosCita.hora) {
      throw new Error("Por favor, completa todos los campos requeridos.");
    }

    const edadNumero = parseInt(datosCita.paciente_edad);
    if (isNaN(edadNumero) || edadNumero < 0 || edadNumero > 120) {
      throw new Error("Por favor, ingresa una edad válida entre 0 y 120 años.");
    }

    const fechaSeleccionada = new Date(datosCita.fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
      throw new Error("No puedes agendar citas en fechas pasadas.");
    }

    const horaFormateada = datosCita.hora + ":00";
    const { data: conflicto, error: errorConflicto } = await citasRepository.buscarConflictos(medicoId, datosCita.fecha, horaFormateada);
    
    if (errorConflicto) throw errorConflicto;
    if (conflicto && conflicto.length > 0) {
      const citaExistente = conflicto[0];
      throw new Error(`Horario no disponible. Ya hay una cita ${citaExistente.estado === 'Pendiente' ? 'pendiente' : 'completada'} con ${citaExistente.paciente_nombre}.`);
    }

    const { error } = await citasRepository.insertarCita({
      medico_id: medicoId,
      paciente_nombre: datosCita.paciente_nombre,
      paciente_edad: edadNumero,
      paciente_genero: datosCita.paciente_genero,
      tipo_consulta: datosCita.tipo_consulta,
      modalidad: datosCita.modalidad,
      fecha: datosCita.fecha,
      hora: horaFormateada,
      estado: 'Pendiente'
    });

    if (error) throw error;
    return true;
  },

  async validarAccesoASala(meetingId) {
    const { data: cita, error } = await citasRepository.obtenerCitaPorId(meetingId);
    if (error) throw error;
    return cita;
  }
};