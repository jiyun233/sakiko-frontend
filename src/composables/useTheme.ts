import { ref, watchEffect } from "vue"

type Theme = "light" | "dark"

const STORAGE_KEY = "sakiko-theme"

function detectSystem(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
const initial: Theme = stored ?? detectSystem()

const theme = ref<Theme>(initial)

watchEffect(() => {
  document.documentElement.classList.toggle("dark", theme.value === "dark")
})

export function useTheme() {
  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
  }

  function toggle() {
    setTheme(theme.value === "dark" ? "light" : "dark")
  }

  return { theme, setTheme, toggle }
}
