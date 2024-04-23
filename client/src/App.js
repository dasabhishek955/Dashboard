import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadDataForm from './Cointainers/UploadDataForm';
import Dashboard from './Cointainers/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<UploadDataForm />} />
        <Route exact path="/uploadDataForm" element={<UploadDataForm />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
