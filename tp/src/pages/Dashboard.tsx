import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import type { RootState } from '../store';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import { useProjects, type Project } from '../hooks/useProjects';

/**
 * Chaîne malveillante typique : en HTML brut, <img onerror> pourrait exécuter du JS.
 * En JSX, React sérialise en texte → pas d’interprétation HTML → pas d’XSS ici.
 */
const dangerousName = '<img src=x onerror=alert("HACK")>';

export default function Dashboard() {
  const [useMui, setUseMui] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const token = useSelector((s: RootState) => s.auth.token);
  const { projects, columns, loading, error, fetchData, addProject, renameProject, deleteProject } =
    useProjects();

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (projects.length && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  /**
   * useCallback vs fonction inline :
   * - `onRename={(p, n) => renameProject(p.id, n)}` recrée une fonction à chaque render
   *   → nouvelle référence → Sidebar (memo) se re-render quand même.
   * - useCallback fixe la référence tant que `renameProject` (stable depuis le hook) ne change pas.
   *
   * useMemo vs useCallback :
   * - useMemo(fn) : mémorise une *valeur* (résultat de fn).
   * - useCallback(fn) : mémorise la *fonction* elle-même (équivaut à useMemo(() => fn, deps)).
   */
  const handleRename = useCallback(
    (project: Project, newName: string) => {
      void renameProject(project.id, newName);
    },
    [renameProject]
  );

  const handleDelete = useCallback(
    (projectId: string) => {
      void deleteProject(projectId);
      setSelectedProjectId((cur) => (cur === projectId ? null : cur));
    },
    [deleteProject]
  );

  const handleAdd = useCallback(() => {
    const name = window.prompt('Nom du projet ?');
    if (name?.trim()) {
      void addProject(name.trim());
    }
  }, [addProject]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        useMui={useMui}
        onToggleFramework={() => setUseMui((v) => !v)}
        titleMui="TaskFlow (MUI)"
        titleBs="TaskFlow (Bootstrap)"
      />

      {token && (
        <Typography variant="caption" sx={{ px: 2, py: 0.5, bgcolor: 'grey.200', display: 'block' }}>
          TP JWT : en-tête <code>Authorization: Bearer …</code> synchronisé depuis Redux (mémoire). Aperçu
          base64 : {token.slice(0, 32)}…
        </Typography>
      )}

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/*
          PIÈGE PÉDAGOGIQUE (évité ici) : passer `onRename={(p, n) => renameProject(p.id, n)}` recrée
          une fonction à chaque render → nouvelle référence de prop → `memo(Sidebar)` ne peut pas sauter le render.
          Solution : `const handleRename = useCallback(...)` ci-dessus.
        */}
        <Sidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onRename={handleRename}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
        <MainContent
          loading={loading}
          error={error}
          project={selectedProject}
          columns={columns}
          dangerousNameDemo={dangerousName}
        />
      </Box>
    </Box>
  );
}
