import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import IndexPage from './pages/IndexPage';
import Authentication from './components/Authentication';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/chats" element={<IndexPage />} />
          <Route exact path="/" element={<Authentication />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
