import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root, { loader as rootLoader, action as rootAction } from './routes/root'
import ErrorPage from './error_page'
import Contact, { loader as contactLoader, action as contactAction } from './routes/contact'
import EditContact, { action as editAction } from "./routes/edit"
import { action as destroyAction } from "./routes/destroy"
import Index from "./routes/index"

// Routes and children go here:
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    // child routes will display INSIDE the root element, instead of on their own page
    children: [
      {
        errorElement: <ErrorPage />, 
        // ^^^PATHLESS ROUTE; essentially adds <ErrorPage/> to all child routes
        // When any errors are thrown in the child routes, 
        // our new pathless route will catch it and render, 
        // which preserves the root route's UI!
        children: [
          { index: true, element: <Index /> },
          // {index:true} tells the router to match and render this route 
          // when the user is at the parent route's exact path, 
          // so there are no other child routes to render in the <Outlet>
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>AWW SHIT 💩</div>
          },
        ],
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>,
)


// AS AN ALTERNATIVE, WE CAN MAKE THE SAME ROUTES USING JSX AND IMPORTING createRoutesFromElements FROM react-router-dom;
// import {
//   createRoutesFromElements,
//   createBrowserRouter,
// } from "react-router-dom";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route
//       path="/"
//       element={<Root />}
//       loader={rootLoader}
//       action={rootAction}
//       errorElement={<ErrorPage />}
//     >
//       <Route errorElement={<ErrorPage />}>
//         <Route index element={<Index />} />
//         <Route
//           path="contacts/:contactId"
//           element={<Contact />}
//           loader={contactLoader}
//           action={contactAction}
//         />
//         <Route
//           path="contacts/:contactId/edit"
//           element={<EditContact />}
//           loader={contactLoader}
//           action={editAction}
//         />
//         <Route
//           path="contacts/:contactId/destroy"
//           action={destroyAction}
//         />
//       </Route>
//     </Route>
//   )
// );