import { TrainingModule } from '@/types/onboarding';

export const trainingModules: TrainingModule[] = [
  {
    id: 'safety-training',
    title: 'Safety Training',
    description: 'Learn essential safety protocols and procedures for working on client sites',
    duration: '20 minutes',
    image: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=900&q=80',
    content: [
      '**Personal Protective Equipment (PPE)**\n\nAlways wear appropriate PPE including:\n- Safety goggles/glasses\n- Hard hats when required\n- Safety boots\n- Gloves appropriate to the task\n- High-visibility clothing when needed',
      
      '**Site Safety Assessment**\n\nBefore starting any job:\n1. Assess the work area for hazards\n2. Identify emergency exits\n3. Locate fire extinguishers\n4. Check for proper ventilation\n5. Ensure adequate lighting',
      
      '**Electrical Safety**\n\n- Always turn off power before working on electrical systems\n- Use insulated tools\n- Never work on live circuits unless absolutely necessary and properly trained\n- Test circuits with a multimeter before touching\n- Keep water away from electrical work',
      
      '**Tool Safety**\n\n- Inspect tools before use\n- Use the right tool for the job\n- Keep tools in good condition\n- Store tools properly\n- Report damaged tools immediately',
      
      '**Emergency Procedures**\n\nIn case of emergency:\n1. Stop work immediately\n2. Alert others in the area\n3. Call emergency services if needed (112)\n4. Notify the client\n5. Report the incident to Phixall support',
      
      '**Working at Heights**\n\n- Use proper ladders and scaffolding\n- Maintain three points of contact on ladders\n- Secure tools to prevent falls\n- Never overreach\n- Use fall protection when required',
      
      '**Client Site Etiquette**\n\n- Respect client property\n- Keep work area clean\n- Minimize noise and disruption\n- Protect flooring and furniture\n- Clean up thoroughly after completing work'
    ],
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'safety-q1',
          question: 'What should you do FIRST before starting electrical work?',
          options: [
            'Test the circuit with your hand',
            'Turn off power and test with a multimeter',
            'Call the client',
            'Start working immediately'
          ],
          correctAnswer: 1,
          explanation: 'Always turn off power and verify with a multimeter before working on electrical systems.'
        },
        {
          id: 'safety-q2',
          question: 'What is the minimum passing score for Phixall training assessments?',
          options: ['60%', '70%', '80%', '90%'],
          correctAnswer: 2,
          explanation: 'All Phixall training assessments require a minimum score of 80% to pass.'
        },
        {
          id: 'safety-q3',
          question: 'Which of these is NOT proper ladder safety?',
          options: [
            'Maintain three points of contact',
            'Overreach to avoid moving the ladder',
            'Inspect ladder before use',
            'Use appropriate ladder height'
          ],
          correctAnswer: 1,
          explanation: 'Never overreach on a ladder. Always move the ladder to reach the work area safely.'
        },
        {
          id: 'safety-q4',
          question: 'What should you do if you discover a safety hazard at a client site?',
          options: [
            'Ignore it and continue working',
            'Stop work and report it immediately',
            'Fix it yourself without permission',
            'Tell the client later'
          ],
          correctAnswer: 1,
          explanation: 'Always stop work and report safety hazards immediately to protect yourself and others.'
        },
        {
          id: 'safety-q5',
          question: 'Why is PPE important?',
          options: [
            'It looks professional',
            'It protects you from injuries',
            'Clients expect it',
            'It\'s just a suggestion'
          ],
          correctAnswer: 1,
          explanation: 'PPE is essential for protecting yourself from workplace injuries and hazards.'
        }
      ]
    }
  },
  
  {
    id: 'residential-training',
    title: 'Residential Service Training',
    description: 'Best practices for providing excellent service in residential properties',
    duration: '15 minutes',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    content: [
      '**Professional Appearance**\n\n- Wear clean, presentable work clothes\n- Display your Phixall ID badge visibly\n- Maintain good personal hygiene\n- Be well-groomed and professional',
      
      '**Customer Communication**\n\n- Greet homeowners politely\n- Introduce yourself and show ID\n- Explain what work you\'ll be doing\n- Ask permission before entering different areas\n- Provide time estimates\n- Update client on progress',
      
      '**Respecting the Home**\n\n- Remove shoes or use shoe covers\n- Use drop cloths to protect floors\n- Keep work area contained and clean\n- Don\'t use client\'s bathroom without asking\n- Don\'t accept food or drinks\n- Respect privacy and personal space',
      
      '**Quality Service Delivery**\n\n- Complete work thoroughly\n- Test your work before calling it complete\n- Clean up all debris and tools\n- Explain what was done\n- Provide maintenance tips\n- Ask if the client has questions',
      
      '**Handling Difficult Situations**\n\n- Stay calm and professional\n- Listen to client concerns\n- Don\'t argue or become defensive\n- Offer solutions\n- Escalate to Phixall support if needed\n- Document issues in the app',
      
      '**Privacy and Confidentiality**\n\n- Never discuss client information\n- Don\'t take photos without permission\n- Don\'t post about jobs on social media\n- Respect client privacy\n- Report any concerns to Phixall'
    ],
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'residential-q1',
          question: 'What should you do when arriving at a residential property?',
          options: [
            'Start working immediately',
            'Greet the homeowner, show ID, and explain the work',
            'Walk around the property first',
            'Call your friends'
          ],
          correctAnswer: 1,
          explanation: 'Always greet the homeowner professionally, show identification, and explain what work you\'ll be performing.'
        },
        {
          id: 'residential-q2',
          question: 'How should you protect a client\'s home during work?',
          options: [
            'Work carefully and hope for the best',
            'Use drop cloths, shoe covers, and keep area contained',
            'Ask the client to move everything',
            'It\'s not necessary'
          ],
          correctAnswer: 1,
          explanation: 'Always use protective measures like drop cloths and shoe covers to protect the client\'s property.'
        },
        {
          id: 'residential-q3',
          question: 'Can you post photos of your work at a client\'s home on social media?',
          options: [
            'Yes, always',
            'Yes, if it looks good',
            'Only with explicit client permission',
            'No, never'
          ],
          correctAnswer: 2,
          explanation: 'Always get explicit permission from the client before posting any photos or information about their property.'
        },
        {
          id: 'residential-q4',
          question: 'What should you do if a client is unhappy with your work?',
          options: [
            'Argue that they\'re wrong',
            'Leave immediately',
            'Listen calmly, offer solutions, and escalate if needed',
            'Ignore their complaints'
          ],
          correctAnswer: 2,
          explanation: 'Stay professional, listen to concerns, offer solutions, and contact Phixall support if you need help resolving the issue.'
        },
        {
          id: 'residential-q5',
          question: 'Before leaving a residential job, you should:',
          options: [
            'Just leave quickly',
            'Clean up, test work, explain what was done, and ask for questions',
            'Leave a mess for the homeowner to clean',
            'Take some tools as souvenirs'
          ],
          correctAnswer: 1,
          explanation: 'Always clean up thoroughly, verify your work, explain what was completed, and ensure the client is satisfied before leaving.'
        }
      ]
    }
  },
  
  {
    id: 'corporate-training',
    title: 'Corporate/Commercial Service Training',
    description: 'Professional standards for corporate and commercial facility maintenance',
    duration: '15 minutes',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    content: [
      '**Corporate Environment Protocols**\n\n- Sign in at reception/security\n- Wear ID badge at all times\n- Follow building access rules\n- Respect office hours\n- Minimize disruption to business operations',
      
      '**Professional Conduct**\n\n- Maintain highest level of professionalism\n- No personal phone calls during work\n- Keep conversations work-related\n- Respect confidential information\n- Represent Phixall positively',
      
      '**Working in Occupied Spaces**\n\n- Schedule disruptive work during off-hours\n- Use barriers and signage\n- Minimize noise when possible\n- Keep pathways clear\n- Communicate with facility managers',
      
      '**Commercial Equipment Standards**\n\n- Follow manufacturer guidelines\n- Document all work performed\n- Use approved parts and materials\n- Label completed work\n- Provide detailed service reports',
      
      '**Compliance and Documentation**\n\n- Follow building codes\n- Maintain service records\n- Complete work orders thoroughly\n- Document any issues found\n- Report safety concerns immediately',
      
      '**Emergency Response**\n\n- Know emergency procedures\n- Understand building systems\n- Have emergency contact numbers\n- Report incidents immediately\n- Follow building evacuation plans'
    ],
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'corporate-q1',
          question: 'When working in a corporate environment, you should:',
          options: [
            'Work whenever you want',
            'Sign in, wear ID, and follow building access rules',
            'Avoid security personnel',
            'Use the employee entrance'
          ],
          correctAnswer: 1,
          explanation: 'Always follow corporate protocols including signing in, wearing identification, and respecting access rules.'
        },
        {
          id: 'corporate-q2',
          question: 'What should you do when performing noisy work in an occupied office?',
          options: [
            'Work during business hours anyway',
            'Schedule during off-hours or coordinate with facility manager',
            'Tell employees to leave',
            'Work as fast and loud as possible'
          ],
          correctAnswer: 1,
          explanation: 'Schedule disruptive work during off-hours when possible, or coordinate with the facility manager to minimize disruption.'
        },
        {
          id: 'corporate-q3',
          question: 'How should you handle confidential information you see at a corporate site?',
          options: [
            'Share it with friends',
            'Post about it online',
            'Keep it completely confidential',
            'Discuss it with other artisans'
          ],
          correctAnswer: 2,
          explanation: 'Always maintain strict confidentiality regarding any information you see or hear at corporate sites.'
        },
        {
          id: 'corporate-q4',
          question: 'What documentation is required for commercial work?',
          options: [
            'Nothing needed',
            'Just a signature',
            'Detailed service reports and work records',
            'Only take photos'
          ],
          correctAnswer: 2,
          explanation: 'Commercial work requires thorough documentation including detailed service reports and complete work records.'
        },
        {
          id: 'corporate-q5',
          question: 'If you discover a safety issue in a commercial building, you should:',
          options: [
            'Ignore it',
            'Fix it yourself without reporting',
            'Report it immediately to building management and Phixall',
            'Tell other workers about it'
          ],
          correctAnswer: 2,
          explanation: 'Always report safety issues immediately to both building management and Phixall support.'
        }
      ]
    }
  },
  
  {
    id: 'dashboard-training',
    title: 'Phixall Dashboard Training',
    description: 'How to use the Phixall artisan platform effectively',
    duration: '20 minutes',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    content: [
      '**Dashboard Overview**\n\n- Overview: See your stats and earnings\n- Available Jobs: Browse and accept new jobs\n- My Jobs: Manage active and completed jobs\n- Wallet: Track earnings and request payouts\n- Profile: Update your information and skills',
      
      '**Finding and Accepting Jobs**\n\n1. Check "Available Jobs" regularly\n2. Review job details carefully\n3. Check location and requirements\n4. Accept jobs you can complete well\n5. Respond quickly to increase your rating',
      
      '**Managing Active Jobs**\n\n- Update job status in real-time\n- Communicate with clients through the platform\n- Upload photos of completed work\n- Request approval when work is done\n- Complete jobs within agreed timeframe',
      
      '**Job Status Workflow**\n\n1. **Pending** - Job assigned, not started\n2. **In Progress** - Actively working\n3. **Completed** - Work done, awaiting approval\n4. **Approved** - Client satisfied, payment released',
      
      '**Communication Best Practices**\n\n- Respond to messages within 1 hour\n- Be professional and courteous\n- Provide clear updates\n- Upload photos to show progress\n- Request clarification if needed',
      
      '**Wallet and Payments**\n\n- Earnings appear after job approval\n- Minimum withdrawal: ₦5,000\n- Cash-out fee: 2.5% of withdrawal\n- Funds transferred within 24-48 hours\n- Keep bank details updated',
      
      '**Building Your Rating**\n\n- Complete jobs on time\n- Provide quality work\n- Communicate professionally\n- Be reliable and responsive\n- Maintain availability status',
      
      '**Platform Rules**\n\n- Never ask clients to pay outside the platform\n- Don\'t share personal contact information\n- Report issues through proper channels\n- Follow all safety protocols\n- Maintain professional conduct'
    ],
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'dashboard-q1',
          question: 'Where do you find new jobs to accept?',
          options: [
            'My Jobs tab',
            'Available Jobs tab',
            'Wallet tab',
            'Profile tab'
          ],
          correctAnswer: 1,
          explanation: 'New jobs that you can accept are found in the "Available Jobs" tab.'
        },
        {
          id: 'dashboard-q2',
          question: 'What is the minimum withdrawal amount from your wallet?',
          options: [
            '₦1,000',
            '₦5,000',
            '₦10,000',
            '₦20,000'
          ],
          correctAnswer: 1,
          explanation: 'The minimum withdrawal amount is ₦5,000, with a 2.5% cash-out fee.'
        },
        {
          id: 'dashboard-q3',
          question: 'When should you update a job status to "Completed"?',
          options: [
            'When you start the job',
            'When you\'re halfway done',
            'When all work is finished and ready for client review',
            'Never, it happens automatically'
          ],
          correctAnswer: 2,
          explanation: 'Mark a job as "Completed" only when all work is finished and ready for the client to review and approve.'
        },
        {
          id: 'dashboard-q4',
          question: 'Can you ask clients to pay you directly in cash instead of through Phixall?',
          options: [
            'Yes, it\'s faster',
            'Yes, if the client agrees',
            'No, all payments must go through the platform',
            'Only for small jobs'
          ],
          correctAnswer: 2,
          explanation: 'All payments must go through the Phixall platform. Asking for direct payment is against platform rules and can result in account suspension.'
        },
        {
          id: 'dashboard-q5',
          question: 'How quickly should you respond to client messages?',
          options: [
            'Within 24 hours',
            'Within 1 hour',
            'Whenever you feel like it',
            'Within 1 week'
          ],
          correctAnswer: 1,
          explanation: 'You should respond to client messages within 1 hour to maintain good communication and high ratings.'
        }
      ]
    }
  }
];


