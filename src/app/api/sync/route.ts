import { NextRequest, NextResponse } from 'next/server';
import { cms } from '@/lib/cms';

// API для синхронизации данных между админ-панелью и фронтендом
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    let data;
    
    switch (type) {
      case 'menu':
        data = cms.getMenuItems();
        break;
        
      case 'categories':
        data = cms.getCategories();
        break;
        
      case 'stats':
        // Статистика для админ-панели
        data = {
          menuItems: cms.getMenuItems().length,
          categories: cms.getCategories().filter(c => c.isActive).length,
          orders: 0, // TODO: Подключить базу заказов
          totalRevenue: 0
        };
        break;
        
      default:
        // Возвращаем все данные
        data = {
          menuItems: cms.getMenuItems(),
          categories: cms.getCategories(),
          lastUpdated: new Date().toISOString()
        };
    }
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[SYNC] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync data' },
      { status: 500 }
    );
  }
}

// POST для триггера обновления кэша
export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    
    // Автоматическая ревалидация после изменений
    await fetch(`${request.nextUrl.origin}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, path: null })
    });
    
    return NextResponse.json({
      success: true,
      message: 'Cache invalidated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('[SYNC] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to sync' },
      { status: 500 }
    );
  }
}