import React, { useState } from "react";
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();
  const [status, setStatus] = useState("");

  const signOutRedirect = () => {
    const clientId = "67i5a8nlr96n5e6n7t3244mjmv";
    const logoutUri = "http://localhost:5173"; 
    const cognitoDomain = "https://amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // Función estrella que envía la solicitud al API Gateway
  const handleGenerarInforme = async () => {
    setStatus("Enviando solicitud al API Gateway...");
    
    // Dejamos esta URL lista para cuando creemos el API Gateway de forma manual
    const API_URL = "AQUÍ_IRÁ_TU_URL_DE_API_GATEWAY/informes"; 

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Adjunta de forma automática el token seguro provisto por Cognito
          "Authorization": `Bearer ${auth.user?.access_token}` 
        },
        body: JSON.stringify({
          tipo: "Mensual",
          fecha_solicitud: new Date().toISOString()
        })
      });

      if (response.ok) {
        setStatus("¡Éxito! Tu solicitud fue procesada por el BFF y encolada en SQS.");
      } else {
        setStatus("Error: El servidor backend devolvió un fallo de validación.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error de red al intentar conectar con el API Gateway.");
    }
  };

  if (auth.isLoading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Cargando sesión...</div>;
  }

  if (auth.error) {
    return <div style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>Error de autenticación: {auth.error.message}</div>;
  }

  // Interfaz protegida para usuarios autenticados
  if (auth.isAuthenticated) {
    return (
      <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
          <span>Sesión activa: <strong>{auth.user?.profile.email || auth.user?.profile.name}</strong></span>
          <button onClick={() => auth.removeUser()} style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
            Cerrar Sesión
          </button>
        </header>

        <h2>Panel de Control del Sistema</h2>
        <p>Presiona el botón para iniciar el pipeline asíncrono del diagrama de arquitectura.</p>
        
        {/* BOTÓN ESTRELLA DEL FRONTEND */}
        <button 
          onClick={handleGenerarInforme} 
          style={{ padding: '1rem 2rem', fontSize: '1.2rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '1rem' }}
        >
          ⭐ Generar Informe
        </button>

        <p style={{ marginTop: '1.5rem', fontWeight: 'bold', color: '#0070f3' }}>{status}</p>
      </div>
    );
  }

  // Interfaz pública antes de iniciar sesión
  return (
    <div style={{ padding: "3rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>Sistema de Gestión de Informes</h2>
      <p>Debes iniciar sesión para acceder a las funciones del pipeline de AWS.</p>
      <button 
        onClick={() => auth.signinRedirect()} 
        style={{ padding: "0.8rem 2rem", fontSize: "1rem", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Iniciar Sesión
      </button>
    </div>
  );
}

export default App;
