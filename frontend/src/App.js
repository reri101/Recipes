import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom"
import Categories from "./components/categories/Categories"
import Category from "./components/categories/Category"
import Header from "./components/header/Header"
import AppTemplate from "./components/template/AppTemplate"
import Tag from "./components/tags/Tag"
import Tags from "./components/tags/Tags"
import Ingredient from "./components/ingredients/Ingredient"
import Ingredients from "./components/ingredients/Ingredients"
import Recipe from "./components/recipes/Recipe"
import Recipes from "./components/recipes/Recipes"
import Login from "./components/login/Login"
import User from "./components/users/User"
import Users from "./components/users/Users"

function ProtectedRoute({ children, role, redirectPath }) {
  const token = localStorage.getItem("authToken")
  const userRole = localStorage.getItem("userRole")

  if (!token || !userRole) {
    return <Navigate to="/login" />
  }

  if (role && userRole !== role) {
    return <Navigate to={redirectPath} />
  }

  return children
}

const routes = [
  { path: "/", element: <Recipes />, role: "user", redirectPath: "/users" },
  {
    path: "/category",
    element: <Category />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/category/:categoryId",
    element: <Category />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/categories",
    element: <Categories />,
    role: "user",
    redirectPath: "/users",
  },
  { path: "/tag", element: <Tag />, role: "user", redirectPath: "/users" },
  {
    path: "/tag/:tagId",
    element: <Tag />,
    role: "user",
    redirectPath: "/users",
  },
  { path: "/tags", element: <Tags />, role: "user", redirectPath: "/users" },
  {
    path: "/ingredient",
    element: <Ingredient />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/ingredient/:ingredientId",
    element: <Ingredient />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/ingredients",
    element: <Ingredients />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/recipe",
    element: <Recipe />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/recipe/:recipeId",
    element: <Recipe />,
    role: "user",
    redirectPath: "/users",
  },
  {
    path: "/recipes",
    element: <Recipes />,
    role: "user",
    redirectPath: "/users",
  },
  { path: "/user", element: <User />, role: "admin", redirectPath: "/recipes" },
  {
    path: "/user/:userId",
    element: <User />,
    role: "admin",
    redirectPath: "/recipes",
  },
  {
    path: "/users",
    element: <Users />,
    role: "admin",
    redirectPath: "/recipes",
  },
]

function AppContent() {
  const location = useLocation()

  const isLoginPage = location.pathname === "/login"

  return (
    <div>
      {!isLoginPage && <Header />}
      {!isLoginPage ? (
        <AppTemplate>
          <Routes>
            {routes.map(({ path, element, role, redirectPath }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute role={role} redirectPath={redirectPath}>
                    {element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Routes>
        </AppTemplate>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
