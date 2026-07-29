import type { Sequelize } from "sequelize";
import { User } from "./User";
import { Restaurant } from "./Restaurant";
import { Session } from "./Session";
import { RefreshToken } from "./RefreshToken";
import { EmailVerificationToken } from "./EmailVerificationToken";
import { PasswordResetToken } from "./PasswordResetToken";
import { AdminLog } from "./AdminLog";
import { RestaurantClaim } from "./RestaurantClaim";
export { User, Restaurant, Session, RefreshToken, EmailVerificationToken, PasswordResetToken, AdminLog, RestaurantClaim };

export function initModels(sequelize: Sequelize): void {
  User.initModel(sequelize);
  Restaurant.initModel(sequelize);
  Session.initModel(sequelize);
  RefreshToken.initModel(sequelize);
  EmailVerificationToken.initModel(sequelize);
  PasswordResetToken.initModel(sequelize);
  AdminLog.initModel(sequelize);
  RestaurantClaim.initModel(sequelize);
  // Associations
  User.hasMany(Session, { foreignKey: "userId", as: "sessions" });
  Session.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

  Session.hasMany(RefreshToken, {
    foreignKey: "sessionId",
    as: "refreshTokens",
  });
  RefreshToken.belongsTo(Session, { foreignKey: "sessionId", as: "session" });

  User.hasMany(EmailVerificationToken, {
    foreignKey: "userId",
    as: "emailVerificationTokens",
  });
  EmailVerificationToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(PasswordResetToken, {
    foreignKey: "userId",
    as: "passwordResetTokens",
  });

  PasswordResetToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(AdminLog, {
    foreignKey: "userId",
    as: "adminLogs",
  });

  AdminLog.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(RestaurantClaim, {
    foreignKey: "user_id",
    as: "restaurantClaims",
  });
  RestaurantClaim.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  Restaurant.hasMany(RestaurantClaim, {
    foreignKey: "restaurant_id",
    as: "restaurantClaims",
  });

  RestaurantClaim.belongsTo(Restaurant, {
    foreignKey: "restaurant_id",
    as: "restaurant",
  });
}
