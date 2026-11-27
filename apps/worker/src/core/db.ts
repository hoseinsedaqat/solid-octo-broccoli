import type { Sql } from './sql';

export interface DbMetrics {
  reads: number;
  writes: number;
  rowsRead: number;
  rowsWritten: number;
  queries: number;
}

/**
 * Thin, typed D1 wrapper. Everything goes through prepared statements with
 * bound parameters; metrics are collected for the quota panel.
 */
export class Db {
  readonly metrics: DbMetrics = { reads: 0, writes: 0, rowsRead: 0, rowsWritten: 0, queries: 0 };

  constructor(private readonly d1: D1Database) {}

  private bind(statement: D1PreparedStatement, s: Sql): D1PreparedStatement {
    return s.bindings.length ? statement.bind(...(s.bindings as unknown as [unknown, ...unknown[]])) : statement;
  }

  private count(result: { meta?: { rows_read?: number; rows_written?: number; changes?: number } }, isWrite: boolean) {
    this.metrics.queries++;
    const meta = result?.meta ?? {};
    this.metrics.rowsRead += meta.rows_read ?? 0;
    this.metrics.rowsWritten += meta.rows_written ?? 0;
    if (isWrite) this.metrics.writes++;
    else this.metrics.reads++;
  }

  async all<T = Record<string, unknown>>(s: Sql): Promise<T[]> {
    const r = await this.bind(this.d1.prepare(s.sql), s).all<T>();
    this.count(r, false);
    return r.results ?? [];
  }

  async first<T = Record<string, unknown>>(s: Sql): Promise<T | null> {
    const rows = await this.all<T>(s);
    return rows[0] ?? null;
  }

  async run(s: Sql): Promise<D1Result> {
    const r = await this.bind(this.d1.prepare(s.sql), s).run();
    this.count(r, true);
    return r;
  }

  /** single implicit SQLite transaction — used for all financial mutations */
  async batch(stmts: Sql[]): Promise<D1Result[]> {
    const r = await this.d1.batch(stmts.map((s) => this.bind(this.d1.prepare(s.sql), s) as D1PreparedStatement) as [D1PreparedStatement, ...D1PreparedStatement[]]);
    for (const item of r) this.count(item as D1Result, true);
    return r as unknown as D1Result[];
  }

  async firstInBatch<T = Record<string, unknown>>(stmts: Sql[]): Promise<T | null> {
    const res = await this.batch(stmts);
    const last = res[res.length - 1] as unknown as { results?: T[] };
    return last?.results?.[0] ?? null;
  }

  async exec(sqlText: string): Promise<void> {
    await this.d1.exec(sqlText);
  }
}

export function dbFrom(d1: D1Database): Db {
  return new Db(d1);
}
