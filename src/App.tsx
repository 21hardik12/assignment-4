import { BluetoothPanel } from './components/BluetoothPanel'
import { CameraPanel } from './components/CameraPanel'
import { SpeechPanel } from './components/SpeechPanel'
import { useBluetooth } from './hooks/useBluetooth'
import { useCamera } from './hooks/useCamera'
import { useSpeechToText } from './hooks/useSpeechToText'
import './App.css'

function App() {
  const camera = useCamera()
  const speech = useSpeechToText()
  const bluetooth = useBluetooth()

  return (
    <div className="vault-app">
      <header className="vault-header">
        <p className="vault-header__eyebrow">ZENITHRATECH // DIGITAL VAULT INTERFACE</p>
        <h1>Hardware Access Console</h1>
        <p>
          A single operational surface for camera, speech, and Bluetooth hardware channels.
        </p>
      </header>

      <main className="vault-grid">
        <CameraPanel camera={camera} />
        <SpeechPanel speech={speech} />
        <BluetoothPanel bluetooth={bluetooth} />
      </main>

      <footer className="vault-footer">
        <p>
          Browser notes: Web Bluetooth requires a secure context and is supported in Chromium-based browsers.
        </p>
        <p>
          Permissions can be reset from browser site settings if access was denied earlier.
        </p>
      </footer>
    </div>
  )
}

export default App
