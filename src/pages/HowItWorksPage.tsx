import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  Eye,
  UserCheck,
  Wrench,
  CheckCircle,
  Shield,
} from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: <FileText className="w-8 h-8" />,
    title: 'Submit a Report',
    description: 'Describe the problem, select a category and severity level, and provide a location. The whole process takes less than 2 minutes.',
    details: [
      'Choose from 8 issue categories including potholes, streetlights, and public safety.',
      'Set a severity level from low to emergency.',
      'Pin the exact location on a map or enter the address manually.',
      'Upload up to 5 photos to help authorities understand the issue.',
    ],
  },
  {
    number: '2',
    icon: <Eye className="w-8 h-8" />,
    title: 'Authority Reviews',
    description: 'Local administrators review your report, verify the information, and determine the appropriate department to handle it.',
    details: [
      'Reports are reviewed by trained administrators.',
      'Each report is verified for accuracy and completeness.',
      'The report is categorized and prioritized based on severity.',
    ],
  },
  {
    number: '3',
    icon: <UserCheck className="w-8 h-8" />,
    title: 'Issue is Assigned',
    description: 'The report is assigned to the responsible department — Public Works, Sanitation, Transportation, or others — for action.',
    details: [
      'Reports are routed to the most appropriate department.',
      'Departments include Public Works, Parks & Recreation, Sanitation, Transportation, and Public Safety.',
      'You can see which department is handling your report.',
    ],
  },
  {
    number: '4',
    icon: <Wrench className="w-8 h-8" />,
    title: 'Progress Updates',
    description: 'As work progresses, administrators post status updates that you can track in real time through the platform.',
    details: [
      'Status changes are tracked and displayed on a visual timeline.',
      'You receive in-app and email notifications for every update.',
      'You can add additional information or images at any time.',
    ],
  },
  {
    number: '5',
    icon: <CheckCircle className="w-8 h-8" />,
    title: 'Issue Resolved',
    description: 'Once the issue is fixed, the report is marked as resolved and you receive a confirmation. Your contribution made a difference.',
    details: [
      'Resolution is confirmed by the assigned department.',
      'You receive a final notification confirming the resolution.',
      'Your report history is preserved for transparency.',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto">
            From report to resolution, here's how CivicFix connects you with local authorities
            to solve neighborhood problems.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <div className="w-0.5 h-full bg-navy-100 mt-4" />
                  </div>
                  <div className="pb-8">
                    <span className="text-sm font-bold text-teal-600">Step {step.number}</span>
                    <h2 className="text-2xl font-bold text-navy-900 mt-1 mb-3">{step.title}</h2>
                    <p className="text-navy-600 leading-relaxed mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-navy-600">
                          <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-16 bg-red-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-red-600 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Safety First</h3>
              <p className="text-navy-600 leading-relaxed mb-2">
                CivicFix is designed for non-emergency situations. For immediate emergencies such as fires,
                medical emergencies, or crimes in progress, please call <strong>911</strong> immediately.
              </p>
              <p className="text-navy-600 leading-relaxed">
                High-severity reports on CivicFix are flagged for priority review, but they are not a
                substitute for emergency services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Ready to make a difference?</h2>
          <p className="text-navy-500 mb-8">
            Your first report takes less than 2 minutes. Start improving your community today.
          </p>
          <Link to="/report" className="btn-primary text-lg px-8 py-3.5 inline-flex items-center gap-2">
            Report an Issue
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
