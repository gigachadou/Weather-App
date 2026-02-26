import './styles/App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Root from './Root';
import Home from './pages/Home';
import Map from './pages/Map';

function App() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/map", element: <Map /> }
      ]
    },
    { path: "*", element: <Navigate to="/" /> },
  ]);
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
