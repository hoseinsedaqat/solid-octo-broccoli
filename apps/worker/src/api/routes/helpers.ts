import { sql } from '../../core/sql';
import type { Db } from '../../core/db';
import { listNations } from '../../services/warService';

/** shared query for the public country directory (war + diplomacy pickers) */
export async function loadNationsPublic(
  db: Db,
  opts: { search?: string | null; limit?: string | number | null; offset?: string | number | null } = {},
) {
  return listNations(db, {
    search: opts.search ?? null,
    limit: Math.min(50, Math.max(1, Number(opts.limit ?? 20))),
    offset: Math.max(0, Number(opts.offset ?? 0)),
  });
}

export async function nationExists(db: Db, nationId: number): Promise<boolean> {
  const row = await db.first<{ id: number }>(sql`SELECT id FROM nations WHERE id = ${nationId} AND status <> 'dissolved'`);
  return Boolean(row);
}
