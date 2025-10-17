const getThemeClasses = (theme: string) => {
  return {
    accent: theme === 'dark' ? 'bg-blue-700' : 'bg-blue-400',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  };
};

export default getThemeClasses;
