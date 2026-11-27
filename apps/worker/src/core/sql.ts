/**
 * Tiny SQL builder: tagged templates always produce `?` placeholders, so user
 * input is never concatenated into SQL (injection-safe by construction).
 */
export interface Sql {
  readonly sql: string;
  readonly bindings: readonly unknown[];
}

export function sql(strings: TemplateStringsArray, ...values: unknown[]): Sql {
  let out = '';
  const bindings: unknown[] = [];
  strings.forEach((chunk, i) => {
    out += chunk;
    if (i < values.length) {
      const v = values[i];
      if (Array.isArray(v)) {
        if (v.length === 0) throw new Error('empty array binding is not allowed');
        out += v.map(() => '?').join(', ');
        bindings.push(...v.map(normalize));
      } else {
        out += '?';
        bindings.push(normalize(v));
      }
    }
  });
  return { sql: out, bindings };
}

function normalize(v: unknown): unknown {
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v === undefined) return null;
  if (v instanceof Date) return Math.floor(v.getTime() / 1000);
  if (typeof v === 'number' && !Number.isFinite(v)) throw new Error('non-finite number binding');
  return v;
}

/** raw SQL only from trusted, generated files (migrations/seeds) */
export function raw(sqlText: string): Sql {
  return { sql: sqlText, bindings: [] };
}

export function placeholders(list: readonly unknown[]): string {
  return list.map(() => '?').join(', ');
}

export function insertRow(
  table: string,
  row: Record<string, unknown>,
  opts: { or?: 'IGNORE' | 'REPLACE' | 'ROLLBACK' } = {},
): Sql {
  const keys = Object.keys(row);
  if (keys.length === 0) throw new Error(`no columns for insert into ${table}`);
  const or = opts.or ? ` OR ${opts.or}` : '';
  return {
    sql: `INSERT${or} INTO ${table} (${keys.join(', ')}) VALUES (${placeholders(keys.map((k) => row[k]!))})`,
    bindings: keys.map((k) => normalize(row[k]!)),
  };
}

export function updateRow(table: string, id: number, patch: Record<string, unknown>, idColumn = 'id'): Sql {
  const keys = Object.keys(patch);
  if (keys.length === 0) return sql`SELECT 1 WHERE 0`;
  return {
    sql: `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE ${idColumn} = ?`,
    bindings: [...keys.map((k) => normalize(patch[k]!)), id],
  };
}
