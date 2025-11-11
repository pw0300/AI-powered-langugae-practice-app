import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  {
    id: 'customer-support-1',
    title: 'Handling an Unhappy Customer',
    description: 'Practice de-escalating a conversation with a frustrated customer whose order was delayed.',
    persona: 'You are Sam, a loyal customer who is very frustrated because a package containing a birthday gift for your child was supposed to arrive three days ago and still hasn\'t. Your tone is initially impatient and annoyed. Your primary goal is to find out exactly where the package is and what compensation you will receive for the inconvenience. You might become calmer if you feel genuinely heard and helped.',
    initialTurn: "Hi, I'm calling about my order, #SLD-12345. It was supposed to be here three days ago and it's still not here! I needed it for a gift. This is unacceptable. What are you going to do about it?",
    maxTurns: 5,
    completionGoal: "To successfully de-escalate the customer's frustration, build rapport over several turns, and collaboratively find a resolution that makes the customer feel valued and their issue resolved.",
    assessmentCriteria: [
        "Empathy: Did the user acknowledge the customer's frustration throughout the conversation?",
        "Problem Solving: Did the user ask clarifying questions and offer viable solutions?",
        "Rapport Building: Did the user make an effort to connect with the customer and build trust?",
        "Professionalism: Did the user maintain a professional and helpful tone?"
    ],
    difficulty: 'easy',
    tags: ['customer service', 'conflict resolution'],
  },
  {
    id: 'job-interview-1',
    title: '"Tell Me About Yourself"',
    description: 'Practice your elevator pitch and handle follow-up questions for a common job interview opener.',
    persona: 'You are Alex, a hiring manager at a fast-growing AI startup. You are professional but friendly and encouraging. You are looking for a candidate who is not just technically skilled, but also passionate, proactive, and a great cultural fit. Your goal is to move beyond a generic, rehearsed answer to understand the candidate\'s genuine motivations and personality. You will ask short follow-up questions based on their response.',
    initialTurn: "Thanks for coming in today. To start, can you tell me a little bit about yourself and what led you to apply for this role?",
    maxTurns: 5,
    completionGoal: "To provide a comprehensive and engaging overview of their background, successfully answer follow-up questions, and clearly articulate their value and cultural fit for the company over a sustained conversation.",
    assessmentCriteria: [
        "Structure: Was the initial answer well-structured and did it flow logically into follow-ups?",
        "Relevance: Did the user consistently connect their experience to the job description?",
        "Confidence: Did the user sound confident and enthusiastic throughout the exchange?",
        "Handling Follow-ups: Did the user effectively answer unexpected follow-up questions?"
    ],
    difficulty: 'medium',
    tags: ['job interview', 'career development', 'public speaking'],
  },
  {
    id: 'negotiation-1',
    title: 'Salary Negotiation',
    description: 'Practice negotiating a higher salary for a new job offer in a multi-turn conversation.',
    persona: 'You are Jordan, a hiring manager with a firm budget. You are impressed with the candidate and want to hire them, but your absolute maximum for the base salary is $125,000. Your tone is calm, professional, and data-driven. You will not respond to emotional appeals but will consider a well-reasoned argument. If the candidate provides strong justification, you might be able to offer a small one-time signing bonus, but you will not offer this upfront.',
    initialTurn: "We're thrilled to offer you the position of Senior Software Engineer. The starting salary we have approved is $120,000 per year, along with our standard benefits package. We are very excited about the possibility of you joining our team.",
    maxTurns: 5,
    completionGoal: "To navigate a multi-turn negotiation by presenting a strong case, handling counter-offers professionally, and reaching a mutually agreeable compensation package that feels like a win-win.",
    assessmentCriteria: [
        "Assertiveness: Did the user clearly state their request without being aggressive?",
        "Justification: Did the user provide valid reasons to support their request (e.g., market rate, skills)?",
        "Collaborative Problem-Solving: Did the user explore creative solutions (e.g., signing bonus, review timeline)?",
        "Professionalism: Did the user maintain a positive and professional tone throughout the negotiation?"
    ],
    difficulty: 'hard',
    tags: ['negotiation', 'career development'],
  },
  {
    id: 'feedback-delivery-1',
    title: 'Giving Constructive Feedback',
    description: 'Practice delivering difficult feedback to a direct report who has been underperforming.',
    persona: 'You are Taylor, a dedicated and high-performing team member who is usually a star player. However, for the past month, you have been consistently missing deadlines and your quality of work has dropped. You are feeling defensive and stressed due to personal issues you do not want to disclose. Your goal is to deflect criticism and avoid being put on a performance improvement plan. You will be resistant to vague feedback but may respond to specific, non-judgmental examples.',
    initialTurn: "Hi, you wanted to see me? I've just been so swamped with the new project, what's up?",
    maxTurns: 5,
    completionGoal: "To guide a difficult conversation from delivering feedback to a collaborative agreement on next steps, ensuring the team member feels heard and motivated to improve by the end.",
    assessmentCriteria: [
        "Clarity and Specificity: Did the user provide specific, behavioral examples of the performance issues?",
        "Empathy and Support: Did the user show empathy and offer support without excusing the behavior?",
        "Action-Oriented: Did the user successfully establish a clear, co-created plan for improvement?",
        "Navigating Defensiveness: Did the user remain calm and steer the conversation productively when faced with resistance?"
    ],
    difficulty: 'super hard',
    tags: ['conflict resolution', 'career development'],
    unlockLevel: 5,
  }
];