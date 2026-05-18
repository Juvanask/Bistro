import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

const SR =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// Real browser speech recognition is available on the web target.
export const speechSupported = Platform.OS === 'web' && !!SR;

export function useSpeechRecognition() {
  const [status, setStatus] = useState('idle'); // idle | listening | error
  const [transcript, setTranscript] = useState('');
  const [partial, setPartial] = useState('');
  const recRef = useRef(null);

  const stop = useCallback(() => {
    if (recRef.current) {
      try { recRef.current.stop(); } catch {}
      recRef.current = null;
    }
    setStatus((s) => (s === 'listening' ? 'idle' : s));
  }, []);

  const start = useCallback(() => {
    if (!speechSupported) { setStatus('error'); return; }
    setTranscript('');
    setPartial('');
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => setStatus('listening');
    rec.onresult = (e) => {
      let fin = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      if (fin) setTranscript((p) => (p + ' ' + fin).trim());
      setPartial(interim);
    };
    rec.onerror = () => setStatus('error');
    rec.onend = () => setStatus((s) => (s === 'listening' ? 'idle' : s));
    recRef.current = rec;
    try { rec.start(); } catch { setStatus('error'); }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const reset = useCallback(() => { setTranscript(''); setPartial(''); setStatus('idle'); }, []);

  return { supported: speechSupported, status, transcript, partial, start, stop, reset };
}
