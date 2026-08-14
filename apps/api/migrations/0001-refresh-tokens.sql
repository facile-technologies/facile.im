-- 0001-refresh-tokens.sql
-- Row 10 (session security): persist refresh tokens server-side, hashed.
-- Each row is one issued refresh token. Tokens are opaque 256-bit random
-- strings; only their SHA-256 hash is stored (raw token lives only in the
-- client's httpOnly cookie). `family_id` groups a rotation lineage so that
-- reuse of an already-rotated token can revoke the whole family.
--
-- Idempotent so re-running the migration set is safe.

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `token_hash` char(64) NOT NULL,
  `family_id` char(36) NOT NULL,
  `expires_at` datetime NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_token_hash` (`token_hash`),
  KEY `refresh_tokens_user_id` (`user_id`),
  KEY `refresh_tokens_family_id` (`family_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
