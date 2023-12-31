import  { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './style.css'
import App from './App';
import Settings, { loader as settingsLoader } from './components/settings';
import Building from './components/building';
import Translation from './components/translation';
import Database from './components/database';
import About,{loader as aboutLoader}from './components/about';


const container = document.getElementById('root')

const root = createRoot(container!)

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Building /> },
      {
        path: "building",
        element: <Building />,
      },
      {
        path: "translation",
        element: <Translation />,
      },
      {
        path: "database",
        element: <Database />,
      },
      {
        path: "settings",
        element: <Settings />,
        loader: settingsLoader,
      },
      {
        path: "about",
        element: <About />,
        loader: aboutLoader,
      },
    ],
  },
]);

root.render(
  <StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <RouterProvider router={router} />
    </FluentProvider>
  </StrictMode>
)
