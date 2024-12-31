'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Unerwartetes Datenformat von der API');
      }
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(`Fehler beim Laden der Benutzer: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: editingUser ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser ? { ...data, id: editingUser.id } : data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      await response.json(); // Wir verarbeiten die Antwort, aber speichern sie nicht
      toast.success(editingUser ? 'Benutzer aktualisiert' : 'Benutzer erstellt');
      reset();
      setShowCreateForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowCreateForm(true);
    reset({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', // Leeres Passwort beim Bearbeiten
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Möchten Sie diesen Benutzer wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      await response.json(); // Verarbeite die Antwort
      toast.success('Benutzer gelöscht');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Fehler beim Löschen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    }
  };

  return (
    <div className="p-6 bg-[#0B1120] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaUsers className="w-6 h-6 text-[#0095FF]" />
            <h1 className="text-2xl font-bold text-white">Benutzerverwaltung</h1>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingUser(null);
              reset();
            }}
            className="flex items-center space-x-2 bg-[#0095FF] text-white px-4 py-2 rounded-md hover:bg-[#0095FF]/90 transition-colors"
          >
            <FaUserPlus className="w-4 h-4" />
            <span>Neuer Benutzer</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-[#1A2642] rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-1">
                    Benutzername
                  </label>
                  <input
                    {...register('username', { required: 'Benutzername wird benötigt' })}
                    type="text"
                    id="username"
                    className="w-full p-2 rounded-md bg-[#0B1120] border border-[#2A3B5E] text-white focus:ring-[#0095FF] focus:border-[#0095FF]"
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                    E-Mail
                  </label>
                  <input
                    {...register('email', { 
                      required: 'E-Mail wird benötigt',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Ungültige E-Mail-Adresse'
                      }
                    })}
                    type="email"
                    id="email"
                    className="w-full p-2 rounded-md bg-[#0B1120] border border-[#2A3B5E] text-white focus:ring-[#0095FF] focus:border-[#0095FF]"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                    Passwort {editingUser && '(leer lassen für keine Änderung)'}
                  </label>
                  <input
                    {...register('password', { 
                      required: !editingUser ? 'Passwort wird benötigt' : false,
                      minLength: {
                        value: 8,
                        message: 'Passwort muss mindestens 8 Zeichen lang sein'
                      }
                    })}
                    type="password"
                    id="password"
                    className="w-full p-2 rounded-md bg-[#0B1120] border border-[#2A3B5E] text-white focus:ring-[#0095FF] focus:border-[#0095FF]"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-200 mb-1">
                    Rolle
                  </label>
                  <select
                    {...register('role', { required: 'Rolle wird benötigt' })}
                    id="role"
                    className="w-full p-2 rounded-md bg-[#0B1120] border border-[#2A3B5E] text-white focus:ring-[#0095FF] focus:border-[#0095FF]"
                    disabled={isLoading}
                  >
                    <option value="USER">Benutzer</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingUser(null);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0095FF] text-white px-4 py-2 rounded-md hover:bg-[#0095FF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Speichere...' : editingUser ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#1A2642] rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#2A3B5E]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Benutzername
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    E-Mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Erstellt am
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3B5E]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#2A3B5E]/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {user.role === 'ADMIN' ? 'Administrator' : 'Benutzer'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(user.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-[#0095FF] hover:text-[#0095FF]/80 mr-3"
                        title="Bearbeiten"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Löschen"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
