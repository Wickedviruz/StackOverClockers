import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

interface SubSection {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const SubSectionList: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [subsections, setSubsections] = useState<SubSection[]>([]);

  useEffect(() => {
    const fetchSubsections = async () => {
      try {
        const response = await api.get(`/forum/sections/${sectionId}/subsections`);
        setSubsections(response.data);
      } catch (error) {
        console.error(error);
        alert('Kunde inte hämta undersektioner');
      }
    };

    fetchSubsections();
  }, [sectionId]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl mb-6">Undersektioner</h2>
      {subsections.map((subsection) => (
        <div key={subsection.id} className="border p-4 mb-4">
          <Link to={`/forum/sections/${sectionId}/subsections/${subsection.id}/threads`} className="text-xl font-bold">
            {subsection.name}
          </Link>
          <p className="text-gray-600">{subsection.description}</p>
        </div>
      ))}
    </div>
  );
};

export default SubSectionList;
