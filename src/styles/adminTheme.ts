/**
 * Система тем админ-панели (мост к универсальной системе)
 * Обеспечивает обратную совместимость
 */

// Импортируем универсальную систему тем
export {
  type AppTheme as AdminTheme,
  type AppThemeClasses as ThemeClasses,
  type AppThemeColors,
  getAppThemeClasses as getThemeClasses,
  getAppThemeColors as getThemeColors,
  getAppTheme
} from './appTheme'