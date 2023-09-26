import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from './pages/error';
import HomePage from './pages/home';
import StripePayment from './pages/stripe';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/stripe" element={<StripePayment />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
