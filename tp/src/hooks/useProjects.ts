import { useCallback, useState } from 'react';
import axios from 'axios';
import api from '../api/axios';

export interface Project {
  id: string;
  name: string;
}

export interface Column {
  id: string;
  projectId: string;
  title: string;
}

/**
 * Custom hook : sépare la logique data-fetching / CRUD de la présentation (Dashboard).
 * Réutilisable, testable, aligné « clean architecture » côté front.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsRes, columnsRes] = await Promise.all([
        api.get<Project[]>('/projects'),
        api.get<Column[]>('/columns'),
      ]);
      setProjects(projectsRes.data);
      setColumns(columnsRes.data);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.message);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (name: string) => {
    setError(null);
    try {
      const { data } = await api.post<Project>('/projects', { name });
      setProjects((prev) => [...prev, data]);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.message);
      } else {
        setError('Erreur inconnue');
      }
    }
  }, []);

  const renameProject = useCallback(async (projectId: string, newName: string) => {
    setError(null);
    try {
      const { data } = await api.patch<Project>(`/projects/${projectId}`, { name: newName });
      setProjects((prev) => prev.map((p) => (p.id === projectId ? data : p)));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.message);
      } else {
        setError('Erreur inconnue');
      }
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    setError(null);
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setColumns((prev) => prev.filter((c) => c.projectId !== projectId));
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.message);
      } else {
        setError('Erreur inconnue');
      }
    }
  }, []);

  return {
    projects,
    columns,
    loading,
    error,
    fetchData,
    addProject,
    renameProject,
    deleteProject,
  };
}
