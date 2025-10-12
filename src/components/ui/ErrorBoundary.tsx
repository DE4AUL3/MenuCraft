"use client";

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Можно логировать ошибку в сервис
    console.error('Ошибка в приложении:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#212121] text-gray-900 dark:text-white z-50">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-2xl font-bold mb-2">Что-то пошло не так</h2>
          <p className="mb-4 text-base text-gray-500 dark:text-gray-400">{this.state.error?.message}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => window.location.reload()}
          >
            Перезагрузить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
