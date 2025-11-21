import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import GatePassIndex from './pages/gate-pass/gate-pass-index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GatePassCRUD from './pages/gate-pass/crud/gate-pass-crud-index'
import PageTitle from './components/PageTitle'
import Home from './pages/home'
// import Layout from './layout'

const queryClient = new QueryClient()
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" >
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

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
