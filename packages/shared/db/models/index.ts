import type { Sequelize } from "sequelize";
import { User } from "./User";
import { Restaurant } from "./Restaurant";
import { Branch } from "./Branch";
import { Review } from "./Review";
import { Session } from "./Session";
import { RefreshToken } from "./RefreshToken";
import { EmailVerificationToken } from "./EmailVerificationToken";
import { PasswordResetToken } from "./PasswordResetToken";
import { AdminLog } from "./AdminLog";
import { Favorite } from "./Favorite";
import { RestaurantClaim } from "./RestaurantClaim";
import { Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
export { User, Restaurant, Branch, Review, Session, RefreshToken, EmailVerificationToken, PasswordResetToken, AdminLog, Favorite, RestaurantClaim, Menu, MenuItem };

export function initModels(sequelize: Sequelize): void {
  User.initModel(sequelize);
  Restaurant.initModel(sequelize);
  Branch.initModel(sequelize);
  Review.initModel(sequelize);
  Session.initModel(sequelize);
  RefreshToken.initModel(sequelize);
  EmailVerificationToken.initModel(sequelize);
  PasswordResetToken.initModel(sequelize);
  AdminLog.initModel(sequelize);
  Favorite.initModel(sequelize);
  RestaurantClaim.initModel(sequelize);
  Menu.initModel(sequelize);
  MenuItem.initModel(sequelize);
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
  User.hasMany(Favorite, {
    foreignKey: "userId",
    as: "favorites",
  });

  Favorite.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Restaurant.hasMany(Favorite, {
    foreignKey: "restaurantId",
    as: "favorites",
  });

  Favorite.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    as: "restaurant",
  });

  User.hasMany(RestaurantClaim, {
    foreignKey: "userId",
    as: "restaurantClaims",
  });
  RestaurantClaim.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Restaurant.hasMany(RestaurantClaim, {
    foreignKey: "restaurantId",
    as: "restaurantClaims",
  });

  RestaurantClaim.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    as: "restaurant",
  });
  Restaurant.hasMany(Branch, {
    foreignKey: "restaurantId",
    as: "branches",
  });

  Branch.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
    as: "restaurant",
  });

  Menu.belongsTo(Restaurant, {
    foreignKey: "restaurantId",
  });

  Restaurant.hasMany(Menu, {
    foreignKey: "restaurantId",
  });


  MenuItem.belongsTo(Menu, {
    foreignKey: "menuId",
  });

  Menu.hasMany(MenuItem, {
    foreignKey: "menuId",
  });

  User.hasMany(Review, {
    foreignKey: "userId",
    as: "reviews",
  });

  Review.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Branch.hasMany(Review, {
    foreignKey: "branchId",
    as: "reviews",
  });

  Review.belongsTo(Branch, {
    foreignKey: "branchId",
    as: "branch",
  });
}
