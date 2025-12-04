import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { sendTemplateEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const experience = formData.get('experience') as string;
    const education = formData.get('education') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const position = formData.get('position') as string;
    const resume = formData.get('resume') as File;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !experience || !education || !coverLetter || !resume) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Resume file size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resume.type)) {
      return NextResponse.json(
        { error: 'Resume must be a PDF, DOC, or DOCX file' },
        { status: 400 }
      );
    }

    const { storage, firestore } = getFirebaseAdmin();

    // Upload resume to Firebase Storage using Admin SDK
    const bucket = storage.bucket();
    const fileName = `careers/resumes/${Date.now()}-${resume.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const file = bucket.file(fileName);
    
    // Convert File to Buffer for upload
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    
    await file.save(resumeBuffer, {
      metadata: {
        contentType: resume.type || 'application/pdf',
      },
    });
    
    // Make file publicly readable (or use signed URL)
    await file.makePublic();
    const resumeUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Save application to Firestore using Admin SDK
    const applicationData = {
      firstName,
      lastName,
      email,
      phone,
      experience,
      education,
      coverLetter,
      position,
      resumeUrl,
      resumeFileName: resume.name,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      reviewed: false,
    };

    await firestore.collection('career_applications').add(applicationData);

    // Send confirmation email to applicant
    try {
      await sendTemplateEmail('application-received', email, {
        firstName,
        lastName,
        position: position || 'Administrative Staff (Full-Time)',
        appliedDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Your application has been submitted successfully. We will review it and get back to you soon.' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting job application:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    return NextResponse.json(
      { 
        error: 'Failed to submit application. Please try again or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

