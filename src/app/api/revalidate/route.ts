import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Маршрут для ревалидации кэша при изменениях в админ-панели
export async function POST(request: NextRequest) {
  try {
    const { type, path } = await request.json();
    
    console.log(`[REVALIDATE] Revalidating ${type} at ${path}`);
    
    switch (type) {
      case 'menu':
        // Ревалидируем все страницы меню
        revalidatePath('/menu/[id]');
        revalidateTag('menu-items');
        break;
        
      case 'categories':
        // Ревалидируем страницы категорий
        revalidatePath('/category/[id]');
        revalidateTag('categories');
        break;
        
      case 'restaurants':
        // Ревалидируем список ресторанов
        revalidatePath('/select-restaurant');
        revalidateTag('restaurants');
        break;
        
      case 'all':
        // Полная ревалидация
        revalidatePath('/');
        revalidatePath('/menu/[id]');
        revalidatePath('/category/[id]');
        revalidatePath('/select-restaurant');
        revalidateTag('menu-items');
        revalidateTag('categories');
        revalidateTag('restaurants');
        break;
        
      default:
        if (path) {
          revalidatePath(path);
        }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Revalidated ${type}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[REVALIDATE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}