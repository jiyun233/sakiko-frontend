import { ref } from "vue"

const STORAGE_KEY = "sakiko-client-id"

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

const clientId = ref("")

function init() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    clientId.value = stored
  } else {
    clientId.value = generateUUID()
    localStorage.setItem(STORAGE_KEY, clientId.value)
  }
}

init()

export function useClientId() {
  return { clientId }
}
