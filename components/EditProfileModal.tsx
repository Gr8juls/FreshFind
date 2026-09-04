'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  Shield, 
  Lock, 
  Camera, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Wallet, 
  Award,
  Image as ImageIcon
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Curated high-res avatar presets suitable for Kigali eco-food community members
const AVATAR_PRESETS = [
  {
    id: 'avatar-1',
    label: 'Jean-Luc (Default)',
    url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=250',
  },
  {
    id: 'avatar-2',
    label: 'Artisan Baker',
    url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=250',
  },
  {
    id: 'avatar-3',
    label: 'Eco Advocate',
    url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=250',
  },
  {
    id: 'avatar-4',
    label: 'Cafe Explorer',
    url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=250',
  },
  {
    id: 'avatar-5',
    label: 'Community Chef',
    url: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=250',
  },
  {
    id: 'avatar-6',
    label: 'Waste Warrior',
    url: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=250',
  },
];

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateUserProfile } = useApp();

  const [fullName, setFullName] = useState(user.fullName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state when modal opens or user updates
  useEffect(() => {
    if (isOpen) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      setErrorMessage('Full name must be at least 2 characters long.');
      return;
    }
    if (trimmedName.length > 60) {
      setErrorMessage('Full name cannot exceed 60 characters.');
      return;
    }

    const trimmedPhone = phone.trim();
    if (trimmedPhone && trimmedPhone.length > 25) {
      setErrorMessage('Phone number is too long.');
      return;
    }

    setIsLoading(true);
    const result = await updateUserProfile({
      fullName: trimmedName,
      phone: trimmedPhone,
      avatarUrl: avatarUrl.trim() || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } else {
      setErrorMessage(result.error || 'Failed to update profile. Please try again.');
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim().startsWith('http://') || customUrlInput.trim().startsWith('https://')) {
      setAvatarUrl(customUrlInput.trim());
      setShowCustomUrlInput(false);
      setCustomUrlInput('');
      setErrorMessage(null);
    } else {
      setErrorMessage('Please provide a valid image URL starting with http:// or https://');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 transition-all">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Edit Consumer Profile</h3>
              <p className="text-xs text-emerald-100/90 font-medium">Limited Access Account Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security / Limited Access Banner */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-start space-x-2.5 text-xs text-amber-800 dark:text-amber-300">
          <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Limited Access Policy:</strong> You have permission to update your public photo, display name, and SMS/MoMo phone number. System credentials, Eco-Wallet funds, and rescue milestones are cryptographically protected.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Section 1: Profile Picture Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Profile Picture</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Live Preview</span>
            </label>

            {/* Current Selected Avatar Preview */}
            <div className="flex items-center space-x-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="relative">
                <img
                  src={avatarUrl || AVATAR_PRESETS[0].url}
                  alt="Selected avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md bg-slate-200 dark:bg-slate-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                  }}
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black">
                  ✓
                </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">Active Avatar</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Visible to Kigali bakery & cafe merchants during QR bag pickup
                </p>
                <button
                  type="button"
                  onClick={() => setShowCustomUrlInput(prev => !prev)}
                  className="mt-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>{showCustomUrlInput ? 'Hide Custom Image URL' : 'Use Custom Photo URL...'}</span>
                </button>
              </div>
            </div>

            {/* Custom URL Input Accordion */}
            {showCustomUrlInput && (
              <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Paste Direct Image Link (JPEG, PNG, WebP)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://images.pexels.com/..."
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Curated Preset Avatars */}
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Or pick from community presets:
              </p>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(preset.url);
                        setShowCustomUrlInput(false);
                      }}
                      className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105 shadow-md' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white font-black drop-shadow" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Editable Identity Fields */}
          <div className="space-y-4 pt-2">
            
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 mb-1.5">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                <span>Full Name <span className="text-emerald-500">*</span></span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jean-Luc Rutagangwa"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Printed on merchant pickup manifests and digital rescue certificates
              </p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Contact Phone (MTN MoMo / Airtel)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 788 333 444"
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Used for instant SMS drop notifications and mobile money checkout authentication
              </p>
            </div>

          </div>

          {/* Section 3: Protected / Read-Only Fields (The "Limited Access" Enforcement) */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Protected System Fields (Read-Only)</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                Audited
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Locked Field: System Role */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between opacity-80">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Role</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{user.role}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5" title="Managed by Admin">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>

              {/* Locked Field: Registered Email */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between opacity-80">
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary Email</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate mt-0.5">{user.email}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5" title="Primary Credential">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>

              {/* Locked Field: Eco-Wallet Balance */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between opacity-80">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Eco-Wallet Balance</p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {user.walletBalance.toLocaleString()} RWF
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5" title="Top-up via MoMo only">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>

              {/* Locked Field: Verified Impact */}
              <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between opacity-80">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verified Milestones</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                    {user.mealsRescued} Rescued • {user.badgeTier}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5" title="Generated from QR scans">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </div>

            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
