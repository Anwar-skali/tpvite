import { memo } from 'react';
import { Alert, Box, Chip, CircularProgress, Typography } from '@mui/material';
import type { Column, Project } from '../hooks/useProjects';

export interface MainContentProps {
  loading: boolean;
  error: string | null;
  project: Project | null;
  columns: Column[];
  /** Exemple pédagogique XSS — texte brut échappé par React. */
  dangerousNameDemo: string;
}

/**
 * Zone principale mémoïsée : ne re-render que si props changent (shallow).
 * Coupler avec des callbacks stables (useCallback) côté parent pour maximiser l’effet.
 */
function MainContentComponent({
  loading,
  error,
  project,
  columns,
  dangerousNameDemo,
}: MainContentProps) {
  console.log('[TP perf] MainContent render');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const projectColumns = project ? columns.filter((c) => c.projectId === project.id) : [];

  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {project ? project.name : 'Sélectionnez un projet'}
      </Typography>

      {/* ----- Partie 1 TP : XSS & échappement React ----- */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, textAlign: 'left' }}>
        <Typography variant="subtitle2" gutterBottom>
          Démonstration XSS (texte sûr)
        </Typography>
        {/*
          React échappe les enfants texte/chaînes : la balise <img> n’est pas interprétée
          comme du HTML, elle apparaît littéralement → pas d’exécution de onerror.
          C’est la protection XSS « par défaut » du modèle JSX.
        */}
        <Typography component="div" variant="body2" sx={{ fontFamily: 'monospace' }}>
          {/* Exigence TP : affichage JSX sûr — équivalent pédagogique de <p>{dangerousName}</p> */}
          <p>{dangerousNameDemo}</p>
        </Typography>

        {/*
          EXEMPLE VOLONTAIREMENT COMMENTÉ — NE PAS ACTIVER AVEC DES DONNÉES UTILISATEUR :

          <div
            dangerouslySetInnerHTML={{ __html: dangerousNameDemo }}
          />

          Pourquoi c’est dangereux ?
          - React n’échappe plus : le HTML est injecté dans le DOM.
          - Un attaquant peut exécuter du JS (onerror, <script>, etc.) → XSS stockée ou réfléchie.
          - Règle : réservé à du HTML statique, contrôlé, sanitisé (DOMPurify…) — jamais directement
            une entrée utilisateur ou une API non fiable.
        */}
      </Box>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Colonnes (json-server)
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {projectColumns.length === 0 && project && (
          <Typography variant="body2">Aucune colonne pour ce projet.</Typography>
        )}
        {projectColumns.map((c) => (
          <Chip key={c.id} label={c.title} variant="outlined" />
        ))}
      </Box>

      {/*
        React Profiler (DevTools) : envelopper une sous-arbre avec <Profiler id="Dashboard">…
        pour mesurer commit time / renders. Ici on a préparé memo + useCallback pour réduire
        les phases de rendu inutiles détectables dans la colonne « ranked » des composants.
      */}
    </Box>
  );
}

export default memo(MainContentComponent);
