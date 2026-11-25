'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

const Ctx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((m: string) => {
    setMsg(m);
    setShow(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setShow(false), 1800);
  }, []);

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div
        role="status"
        className={`pointer-events-none fixed bottom-24 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 font-semibold text-paper ring-2 ring-line transition-all duration-250 ease-out-quint ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        {msg}
      </div>
    </Ctx.Provider>
  );
}
