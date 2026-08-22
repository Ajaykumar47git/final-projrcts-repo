import { Link } from 'react-router-dom';
import ParticleField from '../components/ui/ParticleField';
import ScrollReveal from '../components/ui/ScrollReveal';
import { StaggerGroup } from '../components/ui/StaggerGroup';
import {
  ArrowRight,
  CircleDashed,
  Lightbulb,
  Trash2,
  Droplets,
  Footprints,
  TrafficCone,
  Shield,
  HelpCircle,
  CheckCircle,
  Search,
  TrendingUp,
  MapPin,
  Clock,
  Users,
  Star,
  Mail,
  Phone,
  ExternalLink,
  Zap,
  BarChart3,
  Globe,
} from 'lucide-react';

const categories = [
  { icon: <CircleDashed className="w-7 h-7" />, name: 'Potholes', color: 'from-orange-400 to-red-500', shadow: 'shadow-orange-200' },
  { icon: <Lightbulb className="w-7 h-7" />, name: 'Streetlights', color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-200' },
  { icon: <Trash2 className="w-7 h-7" />, name: 'Garbage', color: 'from-red-400 to-rose-500', shadow: 'shadow-red-200' },
  { icon: <Droplets className="w-7 h-7" />, name: 'Water Leaks', color: 'from-blue-400 to-cyan-500', shadow: 'shadow-blue-200' },
  { icon: <Footprints className="w-7 h-7" />, name: 'Sidewalks', color: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-200' },
  { icon: <TrafficCone className="w-7 h-7" />, name: 'Traffic Signals', color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200' },
  { icon: <Shield className="w-7 h-7" />, name: 'Public Safety', color: 'from-rose-400 to-red-600', shadow: 'shadow-rose-200' },
  { icon: <HelpCircle className="w-7 h-7" />, name: 'Other', color: 'from-slate-400 to-slate-600', shadow: 'shadow-slate-200' },
];

const steps = [
  {
    number: '1',
    title: 'Report the Problem',
    description: 'Snap a photo, add a description, and pin the location. It takes less than 2 minutes.',
    icon: <MapPin className="w-7 h-7" />,
    gradient: 'from-teal-500 to-emerald-600',
  },
  {
    number: '2',
    title: 'Authorities Review',
    description: 'Local officials review and assign the issue to the responsible department.',
    icon: <Users className="w-7 h-7" />,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    number: '3',
    title: 'Track the Resolution',
    description: 'Follow real-time updates as the issue moves from review to resolution.',
    icon: <CheckCircle className="w-7 h-7" />,
    gradient: 'from-violet-500 to-purple-600',
  },
];

const stats = [
  { value: '2,847', label: 'Issues Reported', icon: <TrendingUp className="w-6 h-6" />, color: 'from-teal-500 to-emerald-600' },
  { value: '2,103', label: 'Issues Resolved', icon: <CheckCircle className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
  { value: '48', label: 'Neighborhoods', icon: <Globe className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
  { value: '3.2d', label: 'Avg Response', icon: <Clock className="w-6 h-6" />, color: 'from-violet-500 to-purple-600' },
];

const testimonials = [
  {
    name: 'Emily Rodriguez',
    neighborhood: 'Riverside',
    text: 'CivicFix made it so easy to report a broken streetlight on my commute. I got updates until it was fixed!',
    rating: 5,
    avatar: 'E',
    color: 'from-teal-400 to-emerald-500',
  },
  {
    name: 'David Park',
    neighborhood: 'Green Valley',
    text: 'I reported a water leak and it was assigned to the right team within hours. Transparency like this builds trust.',
    rating: 5,
    avatar: 'D',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Aisha Williams',
    neighborhood: 'Central District',
    text: 'The map view lets me see what issues exist in my neighborhood before I even submit a report. Great tool.',
    rating: 5,
    avatar: 'A',
    color: 'from-violet-400 to-purple-500',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 gradient-hero" />
        <ParticleField count={45} />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        {/* Floating orbs for depth */}
        <div className="orb orb-teal w-96 h-96 -top-20 -right-20 float-slow" />
        <div className="orb orb-blue w-72 h-72 bottom-20 -left-10 float-effect" style={{ animationDelay: '2s' }} />
        <div className="orb orb-purple w-64 h-64 top-1/3 right-1/4 float-slow" style={{ animationDelay: '4s' }} />

        {/* Decorative geometric shapes */}
        <div className="absolute top-20 right-10 w-32 h-32 border border-teal-400/20 rounded-2xl rotate-12 float-slow hidden lg:block" />
        <div className="absolute bottom-32 left-16 w-24 h-24 border border-blue-400/20 rounded-full float-effect hidden lg:block" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-8 w-16 h-16 border border-purple-400/15 rounded-lg -rotate-12 float-slow hidden lg:block" style={{ animationDelay: '3s' }} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
                <Zap className="w-4 h-4 text-teal-300" />
                <span className="text-sm text-white/80 font-medium">Civic Technology Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6">
                <span className="text-white">Report local problems.</span>
                <br />
                <span className="gradient-text">Improve your community.</span>
              </h1>

              <p className="text-lg sm:text-xl text-navy-200 mb-10 max-w-xl leading-relaxed">
                CivicFix connects residents with local authorities to solve neighborhood issues faster.
                Report potholes, broken lights, water leaks, and more — then track the resolution in real time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/report"
                  className="btn-primary text-base px-8 py-4 inline-flex items-center justify-center gap-3 shimmer glow-teal-hover rounded-xl"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/explore"
                  className="glass text-white border border-white/20 px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-3 text-base"
                >
                  <Search className="w-5 h-5" />
                  Explore Issues
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Private & secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  <span>Real-time tracking</span>
                </div>
              </div>
            </div>

            {/* Right: 3D Visual Preview */}
            <div className="hidden lg:block animate-scale-in stagger-3">
              <div className="perspective-2000">
                {/* Main 3D card stack */}
                <div className="relative">
                  {/* Background card */}
                  <div className="absolute -top-4 -right-4 w-full h-full glass-dark rounded-3xl rotate-3 opacity-40" />

                  {/* Main preview card */}
                  <div className="relative glass rounded-3xl p-6 shimmer">
                    {/* Mini dashboard preview */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-2 text-xs text-white/40">CivicFix Dashboard</span>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Reports', value: '12', color: 'bg-teal-500/20 text-teal-300' },
                        { label: 'Active', value: '5', color: 'bg-amber-500/20 text-amber-300' },
                        { label: 'Resolved', value: '7', color: 'bg-green-500/20 text-green-300' },
                      ].map((s) => (
                        <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
                          <p className="text-2xl font-bold">{s.value}</p>
                          <p className="text-xs opacity-70">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Mini map */}
                    <div className="rounded-xl overflow-hidden mb-4 map-3d">
                      <div className="h-40 bg-gradient-to-br from-navy-800 to-navy-700 relative">
                        <div className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `
                              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px'
                          }}
                        />
                        {/* Map markers */}
                        <div className="absolute top-8 left-12 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg pulse-ring">!</div>
                        <div className="absolute top-16 left-24 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg">✓</div>
                        <div className="absolute top-12 right-16 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg float-slow">●</div>
                        <div className="absolute bottom-8 left-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg">●</div>
                        <div className="absolute bottom-12 right-12 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-lg float-effect">●</div>
                        {/* Map label */}
                        <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-1.5">
                          <p className="text-xs text-white/80 font-medium">Interactive Map Preview</p>
                        </div>
                      </div>
                    </div>

                    {/* Mini report cards */}
                    <div className="space-y-2">
                      {[
                        { title: 'Pothole on Main St', status: 'In Progress', color: 'bg-amber-500' },
                        { title: 'Broken streetlight', status: 'Resolved', color: 'bg-green-500' },
                      ].map((r) => (
                        <div key={r.title} className="flex items-center gap-3 glass rounded-xl px-3 py-2">
                          <div className={`w-2 h-2 rounded-full ${r.color}`} />
                          <span className="text-xs text-white/70 flex-1">{r.title}</span>
                          <span className="text-[10px] text-white/40">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 108C120 96 240 72 360 66C480 60 600 72 720 78C840 84 960 84 1080 78C1200 72 1320 60 1380 54L1440 48V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-20">
              <span className="inline-block text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">How It Works</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-5">Three simple steps</h2>
              <p className="text-lg text-navy-500 max-w-2xl mx-auto">
                Make your neighborhood better in minutes.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-teal-200 via-blue-200 to-violet-200" />

            <StaggerGroup animation="fade-up" staggerDelay={150} className="contents">
            {steps.map((step, i) => (
              <div key={step.number} className="text-center relative">
                <div className="relative inline-block mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg float-slow`}
                    style={{ animationDelay: `${i * 0.5}s` }}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-navy-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{step.title}</h3>
                <p className="text-navy-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* ============================================
          CATEGORIES
          ============================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-50 to-white" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-violet-500" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Categories</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-5">What Can You Report?</h2>
              <p className="text-lg text-navy-500 max-w-2xl mx-auto">
                From potholes to public safety concerns, CivicFix covers a wide range of neighborhood issues.
              </p>
            </div>
          </ScrollReveal>

          <StaggerGroup animation="scale-up" staggerDelay={80} className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 perspective-1500">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/report"
                className="card-3d group cursor-pointer text-center"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold text-navy-800 group-hover:text-teal-700 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ============================================
          STATS
          ============================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animated" />
        <div className="absolute inset-0 dot-pattern opacity-20" />

        {/* Decorative orbs */}
        <div className="orb orb-teal w-80 h-80 -top-10 -left-20 opacity-20" />
        <div className="orb orb-blue w-60 h-60 -bottom-10 -right-10 opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-bold text-teal-300 uppercase tracking-wider mb-3">Impact</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">Making a Real Difference</h2>
              <p className="text-lg text-navy-200">Numbers that reflect our community's commitment.</p>
            </div>
          </ScrollReveal>

          <StaggerGroup animation="scale-up" staggerDelay={100} className="grid grid-cols-2 lg:grid-cols-4 gap-6 perspective-1500">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-6 text-center card-3d">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>


      {/* ============================================
          TESTIMONIALS
          ============================================ */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <span className="inline-block text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Testimonials</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-navy-900 mb-5">Community Voices</h2>
              <p className="text-lg text-navy-500">Hear from residents who are making a difference.</p>
            </div>
          </ScrollReveal>

          <StaggerGroup animation="fade-up" staggerDelay={120} className="grid md:grid-cols-3 gap-6 lg:gap-8 perspective-1500">
            {testimonials.map((t) => (
              <div key={t.name} className="card-3d relative overflow-hidden">
                {/* Decorative gradient corner */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${t.color} opacity-10 rounded-bl-[60px]`} />

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-navy-600 mb-6 leading-relaxed text-sm">"{t.text}"</p>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 text-sm">{t.name}</p>
                    <p className="text-xs text-navy-500">{t.neighborhood}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ============================================
          FEATURE HIGHLIGHTS
          ============================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-navy-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual */}
            <ScrollReveal animation="fade-right" className="perspective-2000">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                <div className="relative glass-dark rounded-3xl p-8 shimmer">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-teal-400" />
                    <span className="text-sm text-white/60 font-medium">Analytics Dashboard</span>
                  </div>

                  {/* Mini chart bars */}
                  <div className="flex items-end gap-2 h-32 mb-6">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(to top, rgba(25, 148, 115, 0.3), rgba(25, 148, 115, 0.8))`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Mini pie chart representation */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-teal-400 border-r-blue-400 border-b-violet-400 border-l-amber-400 float-slow" />
                    <div className="flex-1 space-y-2">
                      {[
                        { label: 'Resolved', pct: '74%', color: 'bg-green-400' },
                        { label: 'In Progress', pct: '18%', color: 'bg-amber-400' },
                        { label: 'New', pct: '8%', color: 'bg-blue-400' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          <span className="text-xs text-white/50 flex-1">{item.label}</span>
                          <span className="text-xs text-white/70 font-medium">{item.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Text */}
            <ScrollReveal animation="fade-left" delay={200}>
              <span className="inline-block text-sm font-bold text-teal-600 uppercase tracking-wider mb-3">Powerful Dashboard</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-6">
                Professional tools for<br />
                <span className="gradient-text">effective governance</span>
              </h2>
              <p className="text-navy-500 leading-relaxed mb-8">
                Administrators get a comprehensive dashboard with real-time analytics, report management,
                and department assignment tools. Track resolution times, identify trends, and make
                data-driven decisions for your community.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time analytics and reporting',
                  'Department assignment and tracking',
                  'Public and internal comment system',
                  'Status timeline and notifications',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-navy-700 font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA
          ============================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animated" />
        <ParticleField count={30} />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="orb orb-teal w-96 h-96 -top-20 left-1/4 opacity-20" />
        <div className="orb orb-purple w-72 h-72 -bottom-20 right-1/4 opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <ScrollReveal animation="scale-up">
          <div className="glass rounded-3xl p-12 sm:p-16 shimmer">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to improve your neighborhood?
            </h2>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Join thousands of residents who are already using CivicFix to report problems and make their communities better places to live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/report"
                className="bg-white text-navy-900 px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all duration-300 inline-flex items-center justify-center gap-3 text-base shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Report an Issue
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/signup"
                className="glass text-white border border-white/20 px-8 py-4 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-3 text-base"
              >
                Create an Account
              </Link>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-navy-950 text-navy-300 relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  CF
                </div>
                <span className="text-white font-bold text-lg">CivicFix</span>
              </div>
              <p className="text-sm text-navy-400 leading-relaxed">
                A civic technology platform connecting residents with local authorities to solve neighborhood problems.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
                <li><Link to="/explore" className="hover:text-teal-400 transition-colors">Explore Issues</Link></li>
                <li><Link to="/report" className="hover:text-teal-400 transition-colors">Report an Issue</Link></li>
                <li><Link to="/about" className="hover:text-teal-400 transition-colors">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/how-it-works" className="hover:text-teal-400 transition-colors">How It Works</Link></li>
                <li><Link to="/signup" className="hover:text-teal-400 transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-teal-400 transition-colors">Log In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-teal-400" />
                  support@civicfix.gov
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-teal-400" />
                  (555) 100-2000
                </li>
              </ul>
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded-xl">
                <p className="text-xs text-red-300">
                  <strong>Emergency?</strong> For immediate emergencies, call 911. CivicFix is not a replacement for emergency services.
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-navy-500">
            <p>&copy; 2024 CivicFix. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-teal-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-teal-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-teal-400 cursor-pointer transition-colors flex items-center gap-1">
                Accessibility <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
