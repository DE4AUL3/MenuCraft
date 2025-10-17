import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '../../../../lib/databaseService';

export async function GET() {
  try {
    const categories = await databaseService.getCategoriesLocalized('ru');
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const category = await databaseService.createCategory(body);
    
    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}