import React, { StrictMode, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#090d16',
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#131b2e',
            border: '1px solid #1e293b',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚡</div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#fbbf24' }}>
              Memuat Ulang AI Navigator
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px' }}>
              Terjadi penyesuaian cache sesi belajar pada browser Anda. Silakan klik tombol di bawah untuk melanjutkan.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  fontWeight: '700',
                  fontSize: '13px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                🔄 Muat Ulang Halaman
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('ai_navigator_user_progress_v1');
                  } catch (_) {}
                  window.location.reload();
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  fontWeight: '600',
                  fontSize: '12px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  cursor: 'pointer'
                }}
              >
                🧹 Bersihkan Cache Sesi & Masuk
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
