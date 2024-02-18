import client from "./db.js";

export class Queries {
  static async createLinkTable() {
    const query = `
      CREATE TABLE 
        IF NOT EXISTS short_links (
          id SERIAL PRIMARY KEY,
          uid TEXT NOT NULL UNIQUE,
          channel INTEGER,
          magnet TEXT NOT NULL,
          clicks INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          CONSTRAINT fk_channel FOREIGN KEY (channel) REFERENCES channels (id) ON DELETE CASCADE
        );
    `;
    try {
      await client.query(query);
      console.log(`> Link Table Created`)
    } catch (error) {
      console.error("Error creating short_links table:", error);
    }
  }

  static async createChannelTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        owner INTEGER,
        CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
      );
    `;
    try {
      await client.query(query);
      console.log(`> Channel Table Created`)
    } catch (error) {
      console.error("Error creating channel table:", error);
    }
  }

  static async createUserTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
    try {
      await client.query(query);
      console.log(`> Users Table Created`)
    } catch (error) {
      console.error("Error creating Users table:", error);
    }
  }

  static async doesEmailAlreadyExists(email) {
    const existingEmail = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return existingEmail.rowCount > 0 ? true : false;
  }

  static async findUserWithEmail(email) {
    const res = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return res.rows[0];
  }

  static async addNewUserToDB(
    email,
    password
  ) {
    const user = await client.query(
      `
      INSERT INTO users (email, password) 
        VALUES ($1, $2) RETURNING *
      `,
      [email, password]
    );
    return user ? user.rows[0] : null;
  }

  static async createNewChannel(name, owner) {
    const res = await client.query(`
      INSERT INTO channels (name, owner) 
      VALUES ($1, $2) RETURNING *`,
      [name, owner]
    );
    return res.rows[0];
  };

  static async saveMagnet(uid, magnet) {
    const query = `INSERT INTO short_links (uid, magnet) VALUES($1, $2) RETURNING *`;
    try {
      const res = await client.query(query, [uid, magnet]);
      return res.rows[0];
    } catch (error) {
      console.error("Error saving magnet:", error);
    }
  }

  static async retrieveMagnetUsingShortLink(uid) {
    const query = `SELECT * FROM short_links WHERE uid=$1`;
    try {
      const res = await client.query(query, [uid]);
      if (res && res.rows.length > 0) {
        if (res.rows[0].clicks >= 0) {
          const clickResult = await client.query(
            `UPDATE short_links SET clicks=clicks+1 WHERE uid=$1 RETURNING *`,
            [res.rows[0].uid]
          );
          if (!clickResult) {
            throw new Error("Something is wrong with clicks");
          }
        }
        return res.rows[0].magnet;
      } else {
        return "";
      }
    } catch (error) {
      console.error("Error retrieving magnet:", error);
    }
  }

  static async retrieveShortStats(uid) {
    try {
      const res = await client.query(
        `SELECT clicks FROM short_links WHERE uid=$1`,
        [uid]
      );
      return res.rows[0].clicks;
    } catch (error) {
      console.error("Error retrieving short stats:", error);
    }
  }
}
