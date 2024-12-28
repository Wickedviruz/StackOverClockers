import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface Section {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const SectionList: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get('/forum/sections');
        setSections(response.data);
      } catch (error) {
        console.error(error);
        alert('Kunde inte hämta sektioner');
      }
    };

    fetchSections();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Forum Sektioner</h2>
      {sections.map((section) => (
        <div key={section.id} className="border p-4 mb-4">
          <Link to={`/forum/sections/${section.id}/subsections`} className="text-xl font-bold">
            {section.name}
          </Link>
          <p className="text-gray-600">{section.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SectionList;
