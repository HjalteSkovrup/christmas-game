import { query } from '../db/pool.js';

export async function validatePasskey(participant_id, passkey) {
  try {
    const result = await query(
      `SELECT passkey_hash FROM participants WHERE participant_id = $1`,
      [participant_id]
    );

    if (result.rows.length === 0) {
      return false;
    }

    // Simple base64 comparison (replace with bcrypt in production)
    return Buffer.from(passkey).toString('base64') === result.rows[0].passkey_hash;
  } catch (error) {
    console.error('Error validating passkey:', error);
    return false;
  }
}

export async function logAudit(participant_id, action, details) {
  try {
    await query(
      `INSERT INTO audit_log (participant_id, action, details) VALUES ($1, $2, $3)`,
      [participant_id, action, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('Error logging audit:', error);
  }
}
