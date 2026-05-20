export function LoadingOverlay({ loading, message = 'Aguardando resposta do servidor...' }) {
  if (!loading) return null;

  return (
    <div className = "container"  aria-live="polite"
    >
      <div className="content"
      >
        <svg width="56" height="56" viewBox="0 0 50 50" aria-hidden="true">
          <circle cx="25" cy="25" r="20" stroke="#e6e6e6" strokeWidth="5" fill="none" />
          <path fill="#1d4ed8" d="M25 5 A20 20 0 0 1 45 25 L40 25 A15 15 0 0 0 25 10z">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </path>
        </svg>
        <div className="message">{message}</div>
      </div>
    </div>
  );
}
