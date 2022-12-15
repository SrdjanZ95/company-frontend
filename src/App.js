import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Invoices from './modules/invoices/Invoices';
import Customers from './modules/customers/Customers';
import Sellers from './modules/sellers/Sellers';
import { AuthProvider } from './shared/auth/AuthContext';

function App() {
  return (
    
        <>
        <AuthProvider>
          <div className='min-h-screen'>
            <div className='container mx-auto mt-8 '>
              <BrowserRouter>
                <Routes>
                    <Route path="/invoices" element={<Invoices/>}/>
                    <Route path="/customers" element={<Customers/>}/>
                    <Route path="/sellers" element={<Sellers/>}/>
                </Routes>
              </BrowserRouter>
            </div>
          </div>
          </AuthProvider>
        </>
  );
}

export default App;
