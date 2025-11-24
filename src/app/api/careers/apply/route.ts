import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseServer } from '@/lib/firebaseServer';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

    const { db, storage } = getFirebaseServer();

    // Upload resume to Firebase Storage
    const resumeRef = ref(storage, `careers/resumes/${Date.now()}-${resume.name}`);
    const resumeBuffer = await resume.arrayBuffer();
    await uploadBytes(resumeRef, resumeBuffer, {
      contentType: resume.type,
    });
    const resumeUrl = await getDownloadURL(resumeRef);

    // Save application to Firestore
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
      createdAt: serverTimestamp(),
      reviewed: false,
    };

    await addDoc(collection(db, 'career_applications'), applicationData);

    return NextResponse.json(
      { 
        success: true,
        message: 'Your application has been submitted successfully. We will review it and get back to you soon.' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting job application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}

