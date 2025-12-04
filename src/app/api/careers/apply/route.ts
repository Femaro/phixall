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

    // Initialize Firebase Admin SDK
    let storage, firestore;
    try {
      const admin = getFirebaseAdmin();
      storage = admin.storage;
      firestore = admin.firestore;
    } catch (adminError: any) {
      console.error('Firebase Admin initialization error:', adminError);
      return NextResponse.json(
        { 
          error: 'Server configuration error. Please contact support.',
          details: process.env.NODE_ENV === 'development' ? adminError?.message : undefined
        },
        { status: 500 }
      );
    }

    // Upload resume to Firebase Storage using Admin SDK
    let resumeUrl: string;
    let uploadedFileName: string;
    try {
      const bucket = storage.bucket();
      uploadedFileName = `careers/resumes/${Date.now()}-${resume.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const file = bucket.file(uploadedFileName);
      
      // Convert File to Buffer for upload
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());
      
      await file.save(resumeBuffer, {
        metadata: {
          contentType: resume.type || 'application/pdf',
        },
      });
      
      // Generate a signed URL that's valid for 1 year (for admin access)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: expiresAt,
      });
      resumeUrl = url;
    } catch (uploadError: any) {
      console.error('File upload error:', uploadError);
      return NextResponse.json(
        { 
          error: 'Failed to upload resume. Please try again with a different file.',
          details: process.env.NODE_ENV === 'development' ? uploadError?.message : undefined
        },
        { status: 500 }
      );
    }

    // Save application to Firestore using Admin SDK
    try {
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
    } catch (firestoreError: any) {
      console.error('Firestore write error:', firestoreError);
      // Try to delete the uploaded file if Firestore write fails
      try {
        const bucket = storage.bucket();
        await bucket.file(uploadedFileName).delete();
      } catch (deleteError) {
        console.error('Failed to delete uploaded file after Firestore error:', deleteError);
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to save application. Please try again.',
          details: process.env.NODE_ENV === 'development' ? firestoreError?.message : undefined
        },
        { status: 500 }
      );
    }

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
      name: error?.name,
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to submit application. Please try again or contact us directly.';
    let errorDetails: string | undefined;
    
    if (error?.message) {
      if (error.message.includes('FIREBASE_SERVICE_ACCOUNT_KEY') || error.message.includes('not configured')) {
        errorMessage = 'Server configuration error. Please contact support.';
        errorDetails = 'Firebase Admin SDK not configured';
      } else if (error.message.includes('permission') || error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please contact support.';
        errorDetails = error.message;
      } else if (error.message.includes('Storage') || error.code?.includes('storage')) {
        errorMessage = 'File upload failed. Please try again with a different file.';
        errorDetails = error.message;
      } else {
        errorDetails = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

