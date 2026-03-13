-- 创建User表
CREATE TABLE IF NOT EXISTS `snake_game`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建MatchHistory表
CREATE TABLE IF NOT EXISTS `snake_game`.`MatchHistory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `score` INT NOT NULL,
  `survival_time` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_MatchHistory_User_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_MatchHistory_User`
    FOREIGN KEY (`user_id`)
    REFERENCES `snake_game`.`User` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 为MatchHistory表添加额外索引，优化查询性能
CREATE INDEX `idx_MatchHistory_score` ON `snake_game`.`MatchHistory` (`score` DESC);
CREATE INDEX `idx_MatchHistory_survival_time` ON `snake_game`.`MatchHistory` (`survival_time` DESC);
CREATE INDEX `idx_MatchHistory_created_at` ON `snake_game`.`MatchHistory` (`created_at` DESC);