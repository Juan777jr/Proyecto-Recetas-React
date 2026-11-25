import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MainLayout;