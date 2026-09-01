import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/mongodb';
import VerificationCode from '@/lib/models/VerificationCode';
import { sendOtpEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, type = 'EMAIL' } = body;

    if (!identifier || typeof identifier !== 'string') {
      return NextResponse.json({ error: 'Email or phone number is required' }, { status: 400 });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Basic validation
    if (type === 'EMAIL') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanIdentifier)) {
        return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
      }
    } else if (type === 'PHONE') {
      // Basic phone check (allow digits, +, space, -)
      const phoneClean = cleanIdentifier.replace(/[\s-]/g, '');
      if (phoneClean.length < 8) {
        return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
      }
    }

    await connectToDatabase();

    // Check rate limit: 1 code per 45 seconds per identifier
    const recentCode = await VerificationCode.findOne({
      identifier: cleanIdentifier,
      createdAt: { $gt: new Date(Date.now() - 45 * 1000) },
    });

    if (recentCode) {
      return NextResponse.json(
        { error: 'Please wait 45 seconds before requesting another code' },
        { status: 429 }
      );
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 8);

    // Delete any old pending codes for this identifier to keep it clean
    await VerificationCode.deleteMany({ identifier: cleanIdentifier });

    // Store new code with 10-minute expiry
    await VerificationCode.create({
      identifier: cleanIdentifier,
      codeHash,
      type,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send code via appropriate provider
    if (type === 'EMAIL') {
      const emailResult = await sendOtpEmail(cleanIdentifier, code);
      if (!emailResult.success) {
        console.warn('Email sending notice:', emailResult.error);
      }
    } else {
      // Phone / SMS fallback or Twilio if configured
      console.log(`\n========================================`);
      console.log(`[FreshFind Auth SMS] OTP for ${cleanIdentifier}: ${code}`);
      console.log(`========================================\n`);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Verification code sent to ${cleanIdentifier}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('send-otp route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
