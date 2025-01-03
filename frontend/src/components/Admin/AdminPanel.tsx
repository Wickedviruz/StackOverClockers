// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  const updateRole = async (userId: number, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      alert('Role updated successfully');
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-6">Adminpanel</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Användare</th>
            <th className="border px-4 py-2">Roll</th>
            <th className="border px-4 py-2">Hantera</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.role}</td>
              <td className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="user">User</option>
                  <option value="forum_admin">Forum Admin</option>
                  <option value="news_admin">News Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
