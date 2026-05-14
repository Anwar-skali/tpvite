import { memo } from 'react';
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import type { Project } from '../hooks/useProjects';

export interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  /** Référence stable (useCallback parent) → évite re-renders inutiles avec React.memo. */
  onRename: (project: Project, newName: string) => void;
  onDelete: (projectId: string) => void;
  onAdd: () => void;
}

/**
 * React.memo : comparaison shallow des props. Si `onRename` change à chaque render parent
 * (nouvelle fonction inline), la comparaison échoue → re-render même si projects identiques.
 */
function SidebarComponent({
  projects,
  selectedProjectId,
  onSelectProject,
  onRename,
  onDelete,
  onAdd,
}: SidebarProps) {
  // Log pédagogique : surveiller les re-renders (React DevTools Profiler complète ce diagnostic).
  console.log('[TP perf] Sidebar render');

  return (
    <Box
      sx={{
        width: 280,
        borderRight: 1,
        borderColor: 'divider',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: 'grey.50',
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        Projets
      </Typography>
      <Button variant="contained" size="small" onClick={onAdd} sx={{ alignSelf: 'stretch' }}>
        Nouveau projet
      </Button>
      <List dense sx={{ flex: 1, overflow: 'auto' }}>
        {projects.map((p) => (
          <ListItem
            key={p.id}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 0.5, pr: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    const name = window.prompt('Nouveau nom du projet', p.name);
                    if (name && name.trim()) {
                      onRename(p, name.trim());
                    }
                  }}
                >
                  Renommer
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    if (window.confirm('Supprimer ce projet ?')) {
                      onDelete(p.id);
                    }
                  }}
                >
                  ×
                </Button>
              </Box>
            }
          >
            <ListItemButton selected={p.id === selectedProjectId} onClick={() => onSelectProject(p.id)}>
              <ListItemText primary={p.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default memo(SidebarComponent);
