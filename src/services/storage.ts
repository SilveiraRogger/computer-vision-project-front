const KEYS = {
  TOKEN: "token",
  USER: "user",
} as const

export const storage = {
 
  getToken: (): string | null => localStorage.getItem(KEYS.TOKEN),
  setToken: (token: string): void => localStorage.setItem(KEYS.TOKEN, token),
  removeToken: (): void => localStorage.removeItem(KEYS.TOKEN),

 
  getUser: <T>(): T | null => {
    const data = localStorage.getItem(KEYS.USER)
    return data ? (JSON.parse(data) as T) : null
  },
  setUser: <T>(user: T): void => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  removeUser: (): void => localStorage.removeItem(KEYS.USER),


  clear: (): void => localStorage.clear(),
}
