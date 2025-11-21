import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import GatePassIndex from './pages/gate-pass/gate-pass-index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GatePassCRUD from './pages/gate-pass/crud/gate-pass-crud-index'
import PageTitle from './components/PageTitle'
import Home from './pages/home'
import Layout from './layout'
import { ThemeProvider } from './components/theme-provider'
import LoginPage from './pages/login/page'
import SignupPage from './pages/signup/page'
// import Layout from './layout'

const queryClient = new QueryClient()
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="gate-pass">
                  <Route index element={
                    <>
                      <PageTitle title="Gate-pass" />
                      <GatePassIndex />
                    </>
                  }
                  />
                  <Route
                    path=":pageAction/:id"
                    element={
                      <>
                        <PageTitle title="Gate-pass Crud" />
                        <GatePassCRUD />
                      </>
                    }
                  />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>

  )
}

export default App
