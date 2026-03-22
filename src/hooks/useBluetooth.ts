import { useCallback, useMemo, useState } from 'react'
import { toFeatureError } from '../lib/errors'
import type { BluetoothState } from '../types/hardware'

const initialState: BluetoothState = {
  permission: 'idle',
  status: 'idle',
  deviceName: null,
  deviceId: null,
  error: null,
}

export const useBluetooth = () => {
  const [state, setState] = useState<BluetoothState>(initialState)

  const isSupported = useMemo(
    () => typeof navigator !== 'undefined' && !!navigator.bluetooth?.requestDevice,
    [],
  )

  const requestDevice = useCallback(async () => {
    const bluetooth = navigator.bluetooth

    if (!isSupported || !bluetooth) {
      setState({
        ...initialState,
        permission: 'unsupported',
        status: 'unsupported',
        error: {
          code: 'unsupported',
          message: 'Web Bluetooth is not supported in this browser.',
        },
      })
      return
    }

    setState((current) => ({
      ...current,
      permission: 'pending',
      error: null,
    }))

    try {
      const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information'],
      })

      setState({
        permission: 'granted',
        status: 'active',
        deviceName: device.name ?? 'Unnamed Device',
        deviceId: device.id,
        error: null,
      })
    } catch (error) {
      const featureError = toFeatureError(error)
      const isUserCancel = featureError.message.toLowerCase().includes('cancel')

      setState({
        ...initialState,
        permission: isUserCancel ? 'idle' : featureError.code === 'permission_denied' ? 'denied' : 'error',
        status: isUserCancel ? 'idle' : 'error',
        error: isUserCancel
          ? null
          : {
              ...featureError,
              message:
                featureError.code === 'permission_denied'
                  ? 'Bluetooth permission denied. Allow access and try again.'
                  : featureError.message,
            },
      })
    }
  }, [isSupported])

  return {
    ...state,
    isSupported,
    requestDevice,
  }
}
