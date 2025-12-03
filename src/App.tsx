import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './pages/home'
import Layout from './layout'
import { ThemeProvider } from './components/theme-provider'
import LoginPage from './pages/auth/login/login-index'
import SignupPage from './pages/auth/signup/signup-index'
// import Layout from './layout'
import AuthProvider from './lib/auth-provider'
import { AppMenu } from './pages/app-menu'
import { INavMenu } from './components/nav-main'
import PrivateRoute from './components/PrivateRoute'

const queryClient = new QueryClient()
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/">
                <Route index element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<Home />} />
                    {AppMenu.map(item => GetRoute(item))}
                  </Route>
                  <Route path="/win">
                    <Route index element={<Home />} />
                    {AppMenu.map(item => GetRoute(item))}
                  </Route>
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>

  )
}

function GetRoute(item: INavMenu): React.ReactNode {
  // If item has children
  if (item.items && item.items.length > 0) {
    return item.items.map(child => GetRoute(child));
  }

  // If no children → this is a real route
  return (
    <Route
      key={item.url}
      path={item.url}
      element={item.element}
    />
  );
}


export default App
