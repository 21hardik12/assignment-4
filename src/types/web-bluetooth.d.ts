interface BluetoothDevice {
  id: string
  name?: string
}

interface Bluetooth {
  requestDevice(options?: {
    acceptAllDevices?: boolean
    filters?: Array<{ name?: string; namePrefix?: string; services?: string[] }>
    optionalServices?: string[]
  }): Promise<BluetoothDevice>
}

declare global {
  interface Navigator {
    bluetooth?: Bluetooth
  }
}

export {}
