import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router'
import { WelcomePage } from './pages/WelcomePage'
import { SignPage } from './pages/SignPage'
import { AuthGuard } from './components/AuthGuard'
import { AppContextProvider } from './context/AppContextProvider'

function App() {
  return (
    <>
        <AppContextProvider>
          <BrowserRouter>
            <Header />

            <main className="container p-4">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/sign" element={
                  <AuthGuard>
                    <SignPage />
                  </AuthGuard>
                } />
              </Routes>
            </main>
          </BrowserRouter>
        </AppContextProvider>
    </>
  )
}

export default App
