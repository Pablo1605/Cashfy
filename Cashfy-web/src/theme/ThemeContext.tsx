import { createContext, useState, useContext, useEffect } from "react"
import type { ReactNode } from "react"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    return savedTheme || "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme]) 

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children} 
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}