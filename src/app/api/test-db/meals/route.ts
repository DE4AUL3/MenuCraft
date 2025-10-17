import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '../../../../lib/databaseService';

export async function GET() {
  try {
    const meals = await databaseService.getMeals();
    
    return NextResponse.json({
      success: true,
      data: meals,
      message: 'Meals retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching meals:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch meals',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const meal = await databaseService.createMeal(body);
    
    return NextResponse.json({
      success: true,
      data: meal,
      message: 'Meal created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating meal:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create meal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}