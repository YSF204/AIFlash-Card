import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toasts } = useAuth();
  if (!toasts.length) return null;

  const styles = {
    success: { bg: '#16A34A', color: '#fff' },
    error:   { bg: '#FF2D2D', color: '#fff' },
    info:    { bg: '#FFEB3B', color: '#000' },
  };
  const icons = { success: '✓', error: '✕', info: '◆' };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map(t => {
        const s = styles[t.type] || styles.info;
        return (
          <div
            key={t.id}
            className="animate-slide-in-right flex items-center gap-3 px-4 py-3"
            style={{ background: s.bg, color: s.color, border: '3px solid #000', boxShadow: '4px 4px 0 #000' }}
          >
            <span className="font-[family-name:var(--font-display)] text-sm">{icons[t.type]}</span>
            <span className="font-[family-name:var(--font-body)] text-sm">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
