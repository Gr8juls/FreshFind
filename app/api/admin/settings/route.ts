import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { INITIAL_SYSTEM_SETTINGS } from '@/lib/mockData';

// In-memory persistent cache for runtime settings
let currentSettings = { ...INITIAL_SYSTEM_SETTINGS };

export async function GET() {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    return NextResponse.json({ settings: currentSettings });
  } catch (err: any) {
    console.error('Get system settings error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { error, payload } = await requireAdmin();
    if (error) return error;

    const body = await request.json();
    currentSettings = {
      ...currentSettings,
      ...body,
    };

    return NextResponse.json({
      message: 'System settings updated successfully',
      settings: currentSettings,
      updatedBy: payload?.email,
    });
  } catch (err: any) {
    console.error('Update system settings error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
