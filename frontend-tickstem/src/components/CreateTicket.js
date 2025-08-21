import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateTicket = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const ticketData = {
        titulo,
        descripcion,
        usuarioCreador: { idUsuario: user.idUsuario },
      };
      formData.append('ticket', JSON.stringify(ticketData));
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('/tickets', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newTicketId = response.data.idTicket;

      setMessage('¡Ticket creado con éxito! Redirigiendo a los detalles del ticket...');
      setTimeout(() => {
        navigate(`/dashboard/tickets/${newTicketId}`);
      }, 2000);
    } catch (error) {
      setMessage('Error al crear el ticket: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2>Crear Nuevo Ticket</h2>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ingrese el título del ticket"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa su problema en detalle"
            rows="5"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="file">Adjuntar Archivo (Opcional):</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="form-button">Crear Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;