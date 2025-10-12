export const translations = {
  ru: {
    selectRestaurant: 'Выберите ресторан',
    open: 'Открыт',
    closed: 'Закрыт',
    delivery: 'Доставка',
    address: 'Адрес',
    viewMenu: 'Посмотреть меню',
    loading: 'Загружаем меню...',
    preparing: 'Подготавливаем для вас лучшие блюда',
    qrMenu: 'QR Меню'
  },
  tk: {
    selectRestaurant: 'Restoran saýlaň',
    open: 'Açyk',
    closed: 'Ýapyk',
    delivery: 'Eltip berme',
    address: 'Salgy',
    viewMenu: 'Menýuny görmek',
    loading: 'Menýu ýüklenýär...',
    preparing: 'Siziň üçin iň gowy tagamlary taýýarlaýarys',
    qrMenu: 'QR Menýu'
  }
} as const

export type TranslationKey = keyof typeof translations.ru
export type Language = keyof typeof translations

export function getText(key: TranslationKey, language: Language): string {
  return translations[language]?.[key] || translations.ru[key] || key
}