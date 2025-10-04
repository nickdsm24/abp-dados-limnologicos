import React from 'react';
import Header from '../components/Presentation/Header';
import WelcomePanel from '../components/Presentation/WelcomePanel';
import ActionButtons from '../components/Presentation/ActionButtons';

const Presentation: React.FC = () => {
  return (
    <div
      style={{
        textAlign: 'center', // Centraliza todo o conteúdo
        fontFamily: 'Arial, sans-serif', // Fonte global
        backgroundColor: '#f5f6f8', // Fundo suave da página
        minHeight: '100vh', // Ocupa toda a altura da tela
      }}
    >
      <Header />
      <main
        style={{
          maxWidth: '1100px', // Limita largura do conteúdo
          margin: '30px auto 50px auto', // Margem superior e inferior, centralizado horizontalmente
          padding: '0 20px', // Padding horizontal para pequenas telas
          position: 'relative', // Para controlar z-index se necessário
          zIndex: 0,
        }}
      >
        <WelcomePanel />
        <ActionButtons />
      </main>
    </div>
  );
};

export default Presentation;