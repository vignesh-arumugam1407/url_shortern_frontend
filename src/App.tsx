import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PublicLayout } from './layouts/PublicLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Links from './pages/Links';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* App Routes with Dashboard Layout */}
        <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/links" element={<Links />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Public Routes with Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
