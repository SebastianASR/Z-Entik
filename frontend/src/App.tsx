import { useEffect, useState } from 'react';
import './App.css';

type ApiStatus = {
  status: string;
  service: string;
  timestamp: string;
};

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((response) => response.json())
      .then((data) => setApiStatus(data))
      .catch((error) => {
        console.error('Error conectando con la API:', error);
      });
  }, []);

  return (
    <main className="app">
      <section className="hero">
        <div className="brand-badge">Z Labs</div>

        <h1>Z-Entik</h1>

        <p>
          Sistema HelpDesk TI para la gestión de tickets, soporte técnico,
          usuarios, roles y seguimiento de incidencias.
        </p>

        <div className="status-card">
          <h2>Estado de la API</h2>

          {apiStatus ? (
            <>
              <p>
                <strong>Servicio:</strong> {apiStatus.service}
              </p>
              <p>
                <strong>Estado:</strong> {apiStatus.status}
              </p>
              <p>
                <strong>Última respuesta:</strong> {apiStatus.timestamp}
              </p>
            </>
          ) : (
            <p>Conectando con backend...</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
