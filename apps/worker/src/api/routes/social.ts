import { Hono } from 'hono';
import { RANKING_METRICS } from '@ww/shared';
import { requireUser, settingsFor } from '../middleware';
import { listRankings } from '../../services/newsService';
import { listNations } from '../../services/warService';
import { listAlliances, myAlliance } from '../../services/diplomacyService';
import type { HonoEnv } from '../../types';

export const socialRoutes = new Hono<HonoEnv>();
socialRoutes.use(requireUser);

/** leaderboard; ?metric= switches the sorted column, weights come from settings */
socialRoutes.get('/rankings', async (c) => {
  const db = c.get('db');
  const settings = await settingsFor(c);
  const metric = c.req.query('metric') ?? 'total';
  const safeMetric = (RANKING_METRICS as readonly string[]).includes(metric) || metric === 'total' || metric === 'development' ? metric : 'total';
  return c.json({
    metric: safeMetric,
    weights: settings.rankingWeights,
    available: ['total', ...RANKING_METRICS, 'development'],
    rows: await listRankings(db, settings, { metric: safeMetric === 'total' ? undefined : safeMetric, limit: Number(c.req.query('limit') ?? 20) }),
  });
});

/** world map: every country with only the public aggregate fields */
socialRoutes.get('/nations', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  return c.json({
    nations: await listNations(db, {
      search: c.req.query('q') ?? null,
      limit: c.req.query('limit') ?? 20,
      offset: c.req.query('offset') ?? 0,
      excludeNationId: user.activeNationId ?? null,
    }),
  });
});

socialRoutes.get('/nations/:id', async (c) => {
  const db = c.get('db');
  const id = Number(c.req.param('id'));
  const all = await listNations(db, { limit: 50, offset: 0 });
  const nation = all.find((n) => n.id === id);
  if (!nation) return c.json({ error: { code: 'not_found', message: 'کشور یافت نشد.' } }, 404);
  const alliance = await myAlliance(db, id);
  return c.json({ nation, allianceName: alliance?.name ?? null });
});

socialRoutes.get('/alliances', async (c) => {
  return c.json({ alliances: await listAlliances(c.get('db'), Number(c.req.query('limit') ?? 30)) });
});

export function mountSocial(app: Hono<HonoEnv>) {
  // NOTE: mounted on its own prefix — a sub-app's bare `.use()` becomes
  // "<prefix>/*", so mounting at "/api" would leak requireUser onto /api/auth/*.
  app.route('/api/social', socialRoutes);
}
