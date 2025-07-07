import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Redirect = () => {
  const navigate = useNavigate();

  // Function to generate random ID
  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  useEffect(() => {
    const randomId = generateRandomId();
    navigate(`/${randomId}`);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Redirecting to editor...</p>
      </div>
    </div>
  );
};

export default Redirect;