import './styles/App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Root from './Root';
import CityInfo from './pages/CityInfo';
import Home from './pages/Home';

function App() {
  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/cityInfo", element: <CityInfo /> }
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
