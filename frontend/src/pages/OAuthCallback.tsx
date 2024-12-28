import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const OAuthCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const query = new URLSearchParams(location.search);
      const code = query.get('code');
      const provider = query.get('provider');

      if (code && provider) {
        try {
          const response = await api.post(`/oauth/callback/${provider}`, { code });
          const token = response.data.access_token;
          localStorage.setItem('access_token', token);
          navigate('/');
        } catch (error) {
          console.error(error);
          alert('OAuth inloggning misslyckades');
        }
      } else {
        alert('OAuth misslyckades');
      }
    };

    fetchToken();
  }, [location, navigate]);

  return <div>Loggar in...</div>;
};

export default OAuthCallback;
