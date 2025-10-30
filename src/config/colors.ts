export interface ColorTheme {
	id: string
	name: string
	primary: string
	primaryHover?: string
	primaryLight?: string
	primaryDark?: string
	secondary?: string
	accent?: string
	gradient: {
		from: string
		via: string
		to: string
	}
}

export const defaultThemes: ColorTheme[] = [
	{
		id: 'light',
		name: 'Светлая',
		primary: '#ffffff',
		primaryHover: '#f3f4f6',
		primaryLight: '#f9fafb',
		primaryDark: '#e5e7eb',
		secondary: '#f3f4f6',
		accent: '#e0e7ff',
		gradient: {
			from: '#e0e7ff',
			via: '#f3f4f6',
			to: '#ffffff'
		}
	},
	{
		id: 'dark',
		name: 'Тёмная',
		primary: '#0f172a',
		primaryHover: '#111827',
		primaryLight: '#1f2937',
		primaryDark: '#0b1220',
		secondary: '#111827',
		accent: '#1e293b',
		gradient: {
			from: '#0f172a',
			via: '#1f2937',
			to: '#0b1220'
		}
	}
]

// Apply a ColorTheme by writing CSS custom properties to :root and saving to localStorage
export const applyColorTheme = (theme: ColorTheme) => {
	if (typeof document === 'undefined') return
	const root = document.documentElement
	root.style.setProperty('--color-primary', theme.primary)
	if (theme.primaryHover) root.style.setProperty('--color-primary-hover', theme.primaryHover)
	if (theme.primaryLight) root.style.setProperty('--color-primary-light', theme.primaryLight)
	if (theme.primaryDark) root.style.setProperty('--color-primary-dark', theme.primaryDark)
	if (theme.secondary) root.style.setProperty('--color-secondary', theme.secondary)
	if (theme.accent) root.style.setProperty('--color-accent', theme.accent)
	root.style.setProperty('--gradient-from', theme.gradient.from)
	root.style.setProperty('--gradient-via', theme.gradient.via)
	root.style.setProperty('--gradient-to', theme.gradient.to)

	try {
		localStorage.setItem('selectedColorTheme', JSON.stringify(theme))
	} catch {}
}

// Return saved theme or first default theme
export const getSavedColorTheme = (): ColorTheme => {
	if (typeof window === 'undefined') return defaultThemes[0]
	try {
		const saved = localStorage.getItem('selectedColorTheme')
		if (saved) return JSON.parse(saved) as ColorTheme
	} catch {}
	return defaultThemes[0]
}

// COLORS object used in legacy places (appTheme, admin components)
export const COLORS = {
	// Светлая тема — значение по умолчанию для конверсии
	background: '#fcf9f9',
	surface: '#f3f4f6',
	border: '#e5e7eb',
	text: '#0f1724',
	textSecondary: '#334155',
	textMuted: '#6b7280',
	accent: '#22c55e',
	admin: '#2563eb',
	warning: '#f59e42',
	danger: '#ef4444',
	success: '#22c55e'
}

export default COLORS
