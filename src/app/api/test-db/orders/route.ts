import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '../../../../lib/databaseService';

export async function GET() {
  try {
    const orders = await databaseService.getOrders();
    
    return NextResponse.json({
      success: true,
      data: orders,
      message: 'Orders retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const order = await databaseService.createOrder(body);
    
    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}