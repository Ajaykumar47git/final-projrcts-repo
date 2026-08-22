import { Link } from 'react-router-dom';
import { Shield, Users, Eye, Heart, ArrowRight } from 'lucide-react';

const principles = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'We protect your personal information. Only necessary data is shared with authorities, and sensitive details are never displayed publicly.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Community Driven',
    description: 'CivicFix empowers residents to take an active role in improving their neighborhoods through transparent reporting and tracking.',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Transparency',
    description: 'Every report is tracked from submission to resolution. Residents can see the progress and know their voice matters.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Accountability',
    description: 'Authorities are held accountable through visible progress tracking and public status updates that show commitment to resolution.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">About CivicFix</h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto">
            A civic technology platform built to bridge the gap between residents and local authorities,
            making communities safer, cleaner, and better places to live.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Our Mission</h2>
              <p className="text-navy-600 leading-relaxed mb-4">
                CivicFix was created with a simple belief: when residents and local authorities communicate effectively,
                communities thrive. Too often, neighborhood problems go unreported or get lost in bureaucratic channels.
              </p>
              <p className="text-navy-600 leading-relaxed mb-4">
                Our platform provides a straightforward way for residents to document and report issues,
                while giving administrators the tools they need to prioritize, assign, and resolve problems efficiently.
              </p>
              <p className="text-navy-600 leading-relaxed">
                By making the process transparent and trackable, we build trust between community members and their local government,
                creating a positive feedback loop of engagement and improvement.
              </p>
            </div>
            <div className="card bg-navy-50 p-8">
              <h3 className="text-xl font-bold text-navy-900 mb-6">How Reports Are Handled</h3>
              <ol className="space-y-4">
                {[
                  'A resident submits a report with details and location.',
                  'Administrators review the report and verify its details.',
                  'The report is assigned to the appropriate department.',
                  'Progress updates are posted as work is carried out.',
                  'The issue is resolved and the reporter is notified.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-7 h-7 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-navy-700 text-sm">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">Our Principles</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="card">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{p.title}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Get Involved</h2>
          <p className="text-navy-500 mb-8 max-w-xl mx-auto">
            Whether you're a concerned resident or a local official, CivicFix gives you the tools to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/report" className="btn-primary">
              Report an Issue
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/signup" className="btn-secondary">
              Create an Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
