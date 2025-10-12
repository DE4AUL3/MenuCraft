'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Проверяем, авторизован ли уже пользователь
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Простая проверка на клиенте (в реальном проекте должна быть серверная аутентификация)
    if (email === 'admin@restaurant.kg' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#282828] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Вход в админ-панель
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Введите данные для входа
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#212121] text-gray-900 dark:text-white"
              placeholder="admin@restaurant.kg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-[#212121] text-gray-900 dark:text-white"
                placeholder="admin123"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            Войти
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Тестовые данные:</p>
          <p>Email: admin@restaurant.kg</p>
          <p>Пароль: admin123</p>
        </div>
      </div>
    </div>
  );
}