import { Panel } from './Panel'
import { StatusPill } from './StatusPill'
import type { useSpeechToText } from '../hooks/useSpeechToText'

interface SpeechPanelProps {
  speech: ReturnType<typeof useSpeechToText>
}

export const SpeechPanel = ({ speech }: SpeechPanelProps) => {
  return (
    <Panel
      title="Voice Intelligence"
      subtitle="Real-time transcription via Web Speech API"
      actions={
        <>
          <button
            onClick={speech.startListening}
            disabled={!speech.isSupported || speech.permission === 'pending' || speech.isListening}
          >
            Start Listening
          </button>
          <button onClick={speech.stopListening} disabled={!speech.isListening} className="btn-ghost">
            Stop
          </button>
          <button
            onClick={speech.resetTranscript}
            disabled={!speech.transcript && !speech.interimTranscript}
            className="btn-ghost"
          >
            Reset
          </button>
        </>
      }
      footer={
        <div className="panel__meta">
          <StatusPill label="Microphone Permission" state={speech.permission} />
          {speech.error ? <p className="error-text">{speech.error.message}</p> : null}
        </div>
      }
    >
      <div className="transcript-shell" aria-live="polite">
        {speech.transcript || speech.interimTranscript ? (
          <>
            <p>{speech.transcript}</p>
            {speech.interimTranscript ? <p className="transcript-interim">{speech.interimTranscript}</p> : null}
          </>
        ) : (
          <div className="empty-state">
            <p>Transcript not started.</p>
            <small>Grant microphone permission to begin voice capture.</small>
          </div>
        )}
      </div>
    </Panel>
  )
}
