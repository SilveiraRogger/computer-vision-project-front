import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@pages/login"
import Register from "@pages/register"
import Home from '@pages/home'
import { Toaster } from "react-hot-toast"

export default function App() {
  return (
    <>
    <Toaster position="top-right" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route element={<MainLayout />}> */}
          <Route path="/home" element={<Home />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
    </>
  )
}