import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/loginForm';
import RegisForm from './components/regisForm';
import Dashboard from './components/Dashboard';
const App = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
        </Routes>
    </Router>
);

export default App;
