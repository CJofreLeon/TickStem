import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';


const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Added state for file
  const [analysts, setAnalysts] = useState([]);
  const [selectedAnalyst, setSelectedAnalyst] = useState('');

  const hasAuthority = (roles) => {
    if (!user || !user.rol) return false;
    return roles.includes(user.rol);
  };

  const canUpdateStatus = hasAuthority([ROLES.SUPER_ADMIN, ROLES.JEFATURA, ROLES.ANALISTA]);
  const canUpdatePriority = hasAuthority([ROLES.SUPER_ADMIN, ROLES.JEFATURA]);
  const canAssignAnalyst = hasAuthority([ROLES.SUPER_ADMIN, ROLES.JEFATURA]);
  const canAddResponse = hasAuthority([ROLES.SUPER_ADMIN, ROLES.JEFATURA, ROLES.ANALISTA]);

  useEffect(() => {
    const fetchTicket = async () => {
      if (!token) {
        setError('Token de autenticación no encontrado.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`/tickets/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setTicket(response.data);
        setSelectedAnalyst(response.data.usuarioAnalista?.idUsuario || '');
      } catch (err) {
        setError('Error al cargar los detalles del ticket: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalysts = async () => {
      if (canAssignAnalyst) {
        try {
          const response = await axios.get('/usuarios/rol/ANALISTA', { headers: { Authorization: `Bearer ${token}` } });
          setAnalysts(response.data);
        } catch (err) {
          console.error('Error al cargar los analistas:', err);
        }
      }
    };

    fetchTicket();
    fetchAnalysts();
  }, [id, token, canAssignAnalyst]);

  const showMessage = (msg, isErr = false) => {
    setResponseMessage(msg);
    setIsError(isErr);
    setTimeout(() => setResponseMessage(''), 5000);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.put(`/tickets/${id}/estado/${newStatus}`, null, { headers: { Authorization: `Bearer ${token}` } });
      setTicket(response.data);
      showMessage('¡El estado del ticket se ha actualizado con éxito!');
    } catch (err) {
      showMessage('Error al actualizar el estado: ' + (err.response?.data || err.message), true);
    }
  };

  const handleUpdatePriority = async (newPriority) => {
    try {
      const response = await axios.put(`/tickets/${id}/prioridad/${newPriority}`, null, { headers: { Authorization: `Bearer ${token}` } });
      setTicket(response.data);
      showMessage('¡La prioridad del ticket se ha actualizado con éxito!');
    } catch (err) {
      showMessage('Error al actualizar la prioridad: ' + (err.response?.data || err.message), true);
    }
  };

  const handleAssignAnalyst = async () => {
    if (!selectedAnalyst) {
      showMessage('Por favor, seleccione un analista.', true);
      return;
    }
    try {
      const response = await axios.put(`/tickets/${id}/asignar/${selectedAnalyst}`, null, { headers: { Authorization: `Bearer ${token}` } });
      setTicket(response.data);
      showMessage('¡Analista asignado con éxito!');
    } catch (err) {
      showMessage('Error al asignar el analista: ' + (err.response?.data || err.message), true);
    }
  };

  const handleAddResponse = async () => {
    if (!newResponse.trim()) {
      showMessage('La respuesta no puede estar vacía.', true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('respuesta', JSON.stringify({ respuesta: newResponse })); // Stringify the response object
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await axios.put(`/tickets/${id}/responder`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      setTicket(response.data);
      setNewResponse('');
      setSelectedFile(null); // Clear selected file after upload
      showMessage('¡Respuesta añadida con éxito!');
    } catch (err) {
      showMessage('Error al añadir la respuesta: ' + (err.response?.data || err.message), true);
    }
  };

  const handleAppeal = async () => {
    try {
      const response = await axios.put(`/tickets/${id}/apelar`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(response.data);
      showMessage('¡Ticket apelado y reabierto con éxito!');
    } catch (err) {
      showMessage('Error al apelar el ticket: ' + (err.response?.data || err.message), true);
    }
  };

  if (loading) return <div className="container">Cargando detalles del ticket...</div>;
  if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;
  if (!ticket) return <div className="container">Ticket no encontrado.</div>;

  return (
    <div className="ticket-detail-container">
      {responseMessage && (
        <div className={`response-message ${isError ? 'error' : 'success'}`}>
          {responseMessage}
        </div>
      )}
      <div className="ticket-detail-grid">
        <div className="ticket-info">
          <h2>{ticket.titulo}</h2>
          <p><strong>Descripción:</strong> {ticket.descripcion}</p>
          <p><strong>Estado:</strong> {ticket.estado}</p>
          <p><strong>Prioridad:</strong> {ticket.prioridad}</p>
          <p><strong>Creado por:</strong> {ticket.usuarioCreador?.nombre || 'N/A'}</p>
          <p><strong>Analista Asignado:</strong> {ticket.usuarioAnalista?.nombre || 'N/A'}</p>
          <p><strong>Creado en:</strong> {new Date(ticket.fechaCreacion).toLocaleString()}</p>
          {ticket.fechaActualizacion && <p><strong>Última Actualización:</strong> {new Date(ticket.fechaActualizacion).toLocaleString()}</p>}
          {ticket.rutaArchivo && (
            <p><strong>Adjunto:</strong> <a href={`/tickets/download/${ticket.rutaArchivo}`} target="_blank" rel="noopener noreferrer">Descargar Archivo</a></p>
          )}
          {ticket.historial && (
            <div>
              <h3>Historial:</h3>
              <div className="ticket-history">
                {ticket.historial.split('--- Respuesta (').slice(1).map((entry, index) => {
                  const parts = entry.split(') ---');
                  const date = parts[0];
                  const content = parts.slice(1).join(') ---').trim();
                  const fileMatch = content.match(/Archivo adjunto: (.+)/);
                  const fileLink = fileMatch ? fileMatch[1] : null;
                  const textContent = fileMatch ? content.replace(fileMatch[0], '').trim() : content;

                  return (
                    <div key={index} className="history-entry">
                      <p className="history-date"><strong>Respuesta en:</strong> {date}</p>
                      <p className="history-content">{textContent}</p>
                      {fileLink && (
                        <p className="history-attachment">
                          <strong>Adjunto:</strong>{' '}
                          <a href={`/tickets/download/${fileLink}`} target="_blank" rel="noopener noreferrer">
                            {fileLink}
                          </a>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {user.rol !== ROLES.CLIENTE && (
          <div className="ticket-actions">
            <h3>Acciones</h3>
            {canAssignAnalyst && (
              <div className="action-group">
                <label htmlFor="assign">Asignar Analista:</label>
                <select id="assign" onChange={(e) => setSelectedAnalyst(e.target.value)} value={selectedAnalyst}>
                  <option value="">Seleccione un Analista</option>
                  {analysts.map(analyst => (
                    <option key={analyst.idUsuario} value={analyst.idUsuario}>{analyst.nombre}</option>
                  ))}
                </select>
                <button onClick={handleAssignAnalyst}>Asignar</button>
              </div>
            )}

            {canUpdateStatus && (
              <div className="action-group">
                <label htmlFor="status">Actualizar Estado:</label>
                <select id="status" onChange={(e) => handleUpdateStatus(e.target.value)} value={ticket.estado}>
                  <option value="CREADO">Creado</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="RESUELTO">Resuelto</option>
                  <option value="CERRADO">Cerrado</option>
                  <option value="REABIERTO">Reabierto</option>
                </select>
              </div>
            )}

            {canUpdatePriority && (
              <div className="action-group">
                <label htmlFor="priority">Actualizar Prioridad:</label>
                <select id="priority" onChange={(e) => handleUpdatePriority(e.target.value)} value={ticket.prioridad}>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>
            )}

            {canAddResponse && (
              <div className="action-group">
                <label htmlFor="response">Añadir Respuesta:</label>
                <textarea id="response" value={newResponse} onChange={(e) => setNewResponse(e.target.value)} placeholder="Escriba su respuesta aquí..." rows="4"></textarea>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} /> {/* Added file input */}
                <button onClick={handleAddResponse}>Añadir Respuesta</button>
              </div>
            )}
          </div>
        )}
      </div>
      {user.rol === ROLES.CLIENTE && ticket.estado === 'CERRADO' && (
        <button onClick={handleAppeal} className="appeal-button">Apelar Ticket</button>
      )}
      <button onClick={() => navigate('/dashboard/tickets')} className="back-button">Volver a la Lista de Tickets</button>
    </div>
  );
};

export default TicketDetail;