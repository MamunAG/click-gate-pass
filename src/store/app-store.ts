import { create } from 'zustand'

type IAppStore = {
    pageName: string
    setPageName: (name: string) => void
}


export const useAppStore = create<IAppStore>((set) => ({
    pageName: '',
    setPageName: (name: string) => set({ pageName: name }),
}))

