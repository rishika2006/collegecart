import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
 <Route path="/" element={<Login />} />         {/* Default route */}
        <Route path="/login" element={<Login />} />    {/* Login route */}
        <Route path="/register" element={<Register />} /> {/* Register route */}
      </Routes>
    </Router>
  );
}

export default App;
