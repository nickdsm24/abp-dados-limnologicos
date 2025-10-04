import React from 'react';

const ActionButtons: React.FC = () => {
  const buttonStyle: React.CSSProperties = {
    padding: 'clamp(1rem, 4vw, 2.5rem) clamp(2rem, 6vw, 5rem)',
    fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    color: 'white',
    background: `
      repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.1),
        rgba(255,255,255,0.1) 1px,
        transparent 1px,
        transparent 4px
      ),
      linear-gradient(135deg, #1777af 0%, #1a8cd8 100%)
    `,
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    flex: '1 1 200px',
    maxWidth: '250px',
  };

  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
  };

  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        marginTop: '2rem',
      }}
    >
      <button style={buttonStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        BALCAR
      </button>
      <button style={buttonStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        FURNAS
      </button>
      <button style={buttonStyle} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        SIMAS
      </button>
    </section>
  );
};

export default ActionButtons;
