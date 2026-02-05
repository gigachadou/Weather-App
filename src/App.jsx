import { useState } from 'react'
import './styles/App.css'
import Header from './components/Header'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './Root';
import CityInfo from './pages/CityInfo';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { path: "/cityInfo",  element: <CityInfo />}
      ]
    }
  ]);
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
