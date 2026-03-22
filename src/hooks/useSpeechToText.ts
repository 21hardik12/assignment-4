import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toFeatureError } from '../lib/errors'
import type { SpeechState } from '../types/hardware'

const initialState: SpeechState = {
  permission: 'idle',
  status: 'idle',
  isListening: false,
  transcript: '',
  interimTranscript: '',
  error: null,
}

const getSpeechRecognition = (): { new (): SpeechRecognition } | null => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export const useSpeechToText = () => {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [state, setState] = useState<SpeechState>(initialState)

  const SpeechRecognitionConstructor = useMemo(() => getSpeechRecognition(), [])
  const isSupported = !!SpeechRecognitionConstructor

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const resetTranscript = useCallback(() => {
    setState((current) => ({
      ...current,
      transcript: '',
      interimTranscript: '',
      error: null,
    }))
  }, [])

  const startListening = useCallback(() => {
    if (!SpeechRecognitionConstructor) {
      setState({
        ...initialState,
        permission: 'unsupported',
        status: 'unsupported',
        error: {
          code: 'unsupported',
          message: 'Speech Recognition is not supported in this browser.',
        },
      })
      return
    }

    recognitionRef.current?.stop()

    const recognition = new SpeechRecognitionConstructor()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => {
      setState((current) => ({
        ...current,
        permission: 'granted',
        status: 'active',
        isListening: true,
        error: null,
      }))
    }

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        const text = result[0].transcript

        if (result.isFinal) {
          finalText += `${text} `
        } else {
          interimText += text
        }
      }

      setState((current) => ({
        ...current,
        transcript: `${current.transcript}${finalText}`,
        interimTranscript: interimText,
      }))
    }

    recognition.onerror = (event) => {
      const featureError = toFeatureError(new Error(event.message || event.error))
      setState((current) => ({
        ...current,
        permission: event.error === 'not-allowed' ? 'denied' : current.permission,
        status: 'error',
        isListening: false,
        error: featureError,
      }))
    }

    recognition.onend = () => {
      setState((current) => ({
        ...current,
        isListening: false,
        status: current.error ? 'error' : 'idle',
      }))
    }

    recognitionRef.current = recognition
    setState((current) => ({
      ...current,
      permission: 'pending',
      error: null,
    }))
    recognition.start()
  }, [SpeechRecognitionConstructor])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  return {
    ...state,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
