const { Pool } = require("pg");
const { createEmptyData, JsonDatabase } = require("./database.cjs");

const postgresCollections = [
  "users",
  "sessions",
  "memories",
  "photos",
  "likes",
  "bookmarks",
  "comments",
  "follows",
  "reports",
  "notifications",
  "moderationActions",
  "views",
];

function tableName(collection) {
  return `shanhai_${collection.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)}`;
}

function rowId(collection, item) {
  if (collection === "sessions") {
    return item.tokenHash;
  }
  return item.id;
}

class PostgresDatabase extends JsonDatabase {
  constructor({ connectionString, pool, ssl } = {}) {
    super({ dataDir: "" });
    this.pool =
      pool ||
      new Pool({
        connectionString,
        ssl,
      });
    this.schemaReady = false;
  }

  async ensureSchema() {
    if (this.schemaReady) {
      return;
    }

    await this.pool.query("create table if not exists shanhai_meta (key text primary key, value jsonb not null)");
    for (const collection of postgresCollections) {
      await this.pool.query(
        `create table if not exists ${tableName(collection)} (
          id text primary key,
          doc jsonb not null,
          updated_at timestamptz not null default now()
        )`,
      );
    }
    await this.pool.query("insert into shanhai_meta (key, value) values ('version', '1'::jsonb) on conflict (key) do nothing");
    this.schemaReady = true;
  }

  async ensureLoaded() {
    if (this.data) {
      return this.data;
    }

    await this.ensureSchema();
    const data = createEmptyData();
    const version = await this.pool.query("select value from shanhai_meta where key = 'version'");
    if (version.rows[0]) {
      data.version = Number(version.rows[0].value) || 1;
    }

    for (const collection of postgresCollections) {
      const result = await this.pool.query(`select doc from ${tableName(collection)} order by updated_at asc`);
      data[collection] = result.rows.map((row) => row.doc);
    }

    this.data = data;
    return this.data;
  }

  async save() {
    await this.ensureSchema();
    this.writeQueue = this.writeQueue.then(async () => {
      const client = await this.pool.connect();
      try {
        await client.query("begin");
        await client.query("insert into shanhai_meta (key, value) values ('version', $1::jsonb) on conflict (key) do update set value = excluded.value", [
          JSON.stringify(this.data?.version || 1),
        ]);
        for (const collection of postgresCollections) {
          await client.query(`delete from ${tableName(collection)}`);
          for (const item of this.data?.[collection] || []) {
            const id = rowId(collection, item);
            if (!id) {
              continue;
            }
            await client.query(`insert into ${tableName(collection)} (id, doc, updated_at) values ($1, $2::jsonb, now())`, [id, JSON.stringify(item)]);
          }
        }
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      } finally {
        client.release();
      }
    });
    return this.writeQueue;
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = {
  PostgresDatabase,
  postgresCollections,
};
