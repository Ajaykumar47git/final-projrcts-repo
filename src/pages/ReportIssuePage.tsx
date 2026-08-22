import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  X,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reports as reportsApi, notifications as notificationsApi } from '../services/mockApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { CATEGORY_LABELS, SEVERITY_LABELS, NEIGHBORHOODS, type ReportCategory, type ReportSeverity } from '../types';

interface FormData {
  title: string;
  description: string;
  category: ReportCategory | '';
  severity: ReportSeverity | '';
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  images: File[];
}

const defaultFormData: FormData = {
  title: '',
  description: '',
  category: '',
  severity: '',
  address: '',
  neighborhood: '',
  latitude: 40.758,
  longitude: -73.9855,
  images: [],
};

export default function ReportIssuePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<null | { id: string; number: string }>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const update = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    else if (formData.title.length > 100) errs.title = 'Title must be 100 characters or less';
    if (!formData.description.trim()) errs.description = 'Description is required';
    else if (formData.description.length < 20) errs.description = 'Please provide more detail (at least 20 characters)';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.severity) errs.severity = 'Severity is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.neighborhood) errs.neighborhood = 'Neighborhood is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        showToast('error', `${f.name}: Only JPG, PNG, and WebP files are allowed`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        showToast('error', `${f.name}: File must be less than 5MB`);
        return false;
      }
      return true;
    });

    const remaining = 5 - formData.images.length;
    const toAdd = valid.slice(0, remaining);
    if (valid.length > remaining) {
      showToast('warning', `Only ${remaining} more images allowed`);
    }

    const newImages = [...formData.images, ...toAdd];
    update('images', newImages);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    const newImages = formData.images.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    update('images', newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const report = await reportsApi.create({
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as ReportCategory,
        severity: formData.severity as ReportSeverity,
        status: 'submitted',
        address: formData.address.trim(),
        neighborhood: formData.neighborhood,
        latitude: formData.latitude,
        longitude: formData.longitude,
        assigned_department_id: null,
        assigned_staff_id: null,
        rejection_reason: null,
        author_name: user.full_name,
      });

      await notificationsApi.add({
        user_id: user.id,
        report_id: report.id,
        title: 'Report Submitted',
        message: `Your report "${report.title}" has been submitted successfully.`,
        is_read: false,
      });

      setSuccess({ id: report.id, number: report.report_number });
      showToast('success', 'Report submitted successfully!');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="card">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Report Submitted!</h1>
          <p className="text-navy-500 mb-2">Thank you for helping improve your community.</p>
          <p className="text-sm text-navy-600 mb-6">
            Your report ID is <strong className="text-navy-900">{success.number}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={`/issues/${success.id}`} className="btn-primary">
              View Report Details
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Emergency Warning */}
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">Emergency situations</p>
          <p className="text-sm text-red-700">
            For immediate emergencies, please call <strong>911</strong>. CivicFix is not a replacement for emergency services.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Report an Issue</h1>
        <p className="text-navy-500">Fill in the details to submit a new report.</p>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step ? 'bg-teal-600 text-white' : 'bg-navy-100 text-navy-500'
                }`}
              >
                {s}
              </div>
              <span className={`text-sm hidden sm:inline ${s <= step ? 'text-navy-800 font-medium' : 'text-navy-400'}`}>
                {s === 1 ? 'Issue Info' : s === 2 ? 'Location' : 'Images & Review'}
              </span>
              {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-teal-600' : 'bg-navy-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Issue Information */}
      {step === 1 && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Issue Information</h2>
          <Input
            label="Issue Title"
            placeholder="Brief summary of the problem"
            value={formData.title}
            onChange={(e) => update('title', e.target.value)}
            error={errors.title}
            maxLength={100}
            required
          />
          <Textarea
            label="Description"
            placeholder="Provide details about the issue. Include what you observe, how long it has been there, and any safety concerns."
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
            error={errors.description}
            rows={5}
            required
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => update('category', e.target.value)}
            options={[
              ...Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v })),
            ]}
            placeholder="Select a category"
            error={errors.category}
            required
          />
          <Select
            label="Severity"
            value={formData.severity}
            onChange={(e) => update('severity', e.target.value)}
            options={[
              ...Object.entries(SEVERITY_LABELS).map(([k, v]) => ({ value: k, label: v })),
            ]}
            placeholder="Select severity"
            error={errors.severity}
            required
          />
          <div className="flex justify-end pt-2">
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-navy-900">Location</h2>
          <p className="text-sm text-navy-500">
            Click on the map to set the location, or use the fields below.
          </p>
          {/* Map placeholder */}
          <div className="w-full h-64 bg-navy-100 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50" />
            <div className="relative text-center">
              <MapPin className="w-10 h-10 text-teal-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-navy-700">Location Map</p>
              <p className="text-xs text-navy-500 mt-1">
                Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        update('latitude', pos.coords.latitude);
                        update('longitude', pos.coords.longitude);
                        showToast('success', 'Location updated to your current position');
                      },
                      () => {
                        showToast('warning', 'Could not get your location. Please enter it manually.');
                      }
                    );
                  }
                }}
              >
                <MapPin className="w-3 h-3" />
                Use My Location
              </Button>
            </div>
          </div>
          <Input
            label="Street Address"
            placeholder="123 Main Street"
            value={formData.address}
            onChange={(e) => update('address', e.target.value)}
            error={errors.address}
            required
          />
          <Select
            label="Neighborhood"
            value={formData.neighborhood}
            onChange={(e) => update('neighborhood', e.target.value)}
            options={NEIGHBORHOODS.map((n) => ({ value: n, label: n }))}
            placeholder="Select your neighborhood"
            error={errors.neighborhood}
            required
          />
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Images & Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-navy-900">Upload Images</h2>
            <p className="text-sm text-navy-500">
              Adding images helps authorities understand and address the issue faster. (Optional, max 5)
            </p>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy-300 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-colors">
              <Upload className="w-8 h-8 text-navy-400 mb-2" />
              <span className="text-sm text-navy-600 font-medium">Click to upload images</span>
              <span className="text-xs text-navy-400">JPG, PNG, or WebP (max 5MB each)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="sr-only"
                aria-label="Upload images"
              />
            </label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={preview}
                      alt={`Upload preview ${i + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Summary */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-navy-900">Review Your Report</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-navy-100">
                <span className="text-navy-500">Title</span>
                <span className="text-navy-800 font-medium">{formData.title}</span>
              </div>
              <div className="py-2 border-b border-navy-100">
                <span className="text-navy-500 block mb-1">Description</span>
                <p className="text-navy-800">{formData.description}</p>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-100">
                <span className="text-navy-500">Category</span>
                <span className="text-navy-800 font-medium">{CATEGORY_LABELS[formData.category as ReportCategory]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-100">
                <span className="text-navy-500">Severity</span>
                <span className="text-navy-800 font-medium">{SEVERITY_LABELS[formData.severity as ReportSeverity]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-100">
                <span className="text-navy-500">Address</span>
                <span className="text-navy-800 font-medium">{formData.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-100">
                <span className="text-navy-500">Neighborhood</span>
                <span className="text-navy-800 font-medium">{formData.neighborhood}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-navy-100">
                <span className="text-navy-500">Images</span>
                <span className="text-navy-800 font-medium">{formData.images.length} uploaded</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              <CheckCircle className="w-4 h-4" />
              Submit Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
