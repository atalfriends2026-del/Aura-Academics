import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles, Radio, Loader2 } from "lucide-react";

interface VoiceCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCompanionModal: React.FC<VoiceCompanionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      startLiveSession();
    } else {
      stopLiveSession();
    }

    return () => {
      stopLiveSession();
    };
  }, [isOpen]);

  const startLiveSession = async () => {
    setErrorMessage(null);
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        startAudioInput();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio) {
            handleIncomingAudio(data.audio);
          }
          if (data.interrupted) {
            audioQueueRef.current = [];
            setIsSpeaking(false);
          }
          if (data.error) {
            setErrorMessage(data.error);
          }
        } catch (e) {
          console.error("Error processing websocket message:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setErrorMessage("Voice WebSocket connection error.");
        setIsConnected(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
      };
    } catch (err: any) {
      console.error("Failed to start Live session:", err);
      setErrorMessage("Microphone or network access error.");
    }
  };

  const startAudioInput = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32Array to 16-bit PCM Base64
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        const uint8 = new Uint8Array(pcm16.buffer);
        let binary = "";
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binary);

        wsRef.current.send(JSON.stringify({ audio: base64 }));
      };

      setIsListening(true);
    } catch (e: any) {
      console.error("Microphone access failed:", e);
      setErrorMessage("Could not access microphone. Please allow mic permissions.");
    }
  };

  const handleIncomingAudio = (base64Audio: string) => {
    try {
      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / (pcm16[i] < 0 ? 32768 : 32767);
      }

      audioQueueRef.current.push(float32);
      playAudioQueue();
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const playAudioQueue = () => {
    if (!outputAudioCtxRef.current) {
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }

    const audioCtx = outputAudioCtxRef.current;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    setIsSpeaking(true);

    while (audioQueueRef.current.length > 0) {
      const chunk = audioQueueRef.current.shift()!;
      const buffer = audioCtx.createBuffer(1, chunk.length, 24000);
      buffer.getChannelData(0).set(chunk);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      const startTime = Math.max(now, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + buffer.duration;

      source.onended = () => {
        if (audioCtx.currentTime >= nextStartTimeRef.current) {
          setIsSpeaking(false);
        }
      };
    }
  };

  const stopLiveSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-500/30 overflow-hidden flex flex-col items-center p-6 text-center relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Live Title */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 text-xs font-extrabold mb-6">
          <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
          <span>Gemini 3.1 Live Voice Companion</span>
        </div>

        {/* Animated Sound Wave Visualizer Circle */}
        <div className="relative w-36 h-36 my-4 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl transition-all duration-300 ${
              isSpeaking ? "scale-125 opacity-40 animate-ping" : isListening ? "scale-105" : "scale-90"
            }`}
          />
          <div
            className={`w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex flex-col items-center justify-center shadow-xl shadow-indigo-500/30 transition-transform duration-300 ${
              isSpeaking ? "scale-110" : "scale-100"
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-10 h-10 animate-bounce text-pink-200" />
            ) : isListening ? (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Loader2 className="w-10 h-10 animate-spin text-indigo-200" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-2">
          {isSpeaking
            ? "Aura AI is Speaking..."
            : isListening
            ? "Listening to you..."
            : isConnected
            ? "Connecting audio..."
            : "Initializing Live Voice..."}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">
          Speak naturally about your coursework, ask questions, or practice oral exam preparation. Powered by <span className="font-semibold text-indigo-500">gemini-3.1-flash-live-preview</span>.
        </p>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Control Button */}
        <div className="mt-8 flex items-center space-x-3 w-full">
          <button
            onClick={isListening ? stopLiveSession : startLiveSession}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
              isListening
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Mute Voice Session</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Start Live Voice</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
