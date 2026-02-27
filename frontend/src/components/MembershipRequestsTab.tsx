import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Phone, Mail, MapPin, CreditCard, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useListMembershipApplications, useUpdateMembershipStatus } from '../hooks/useQueries';
import { ApplicationStatus, MembershipApplication, MembershipType } from '../backend';

type FilterStatus = 'all' | ApplicationStatus;

function getMembershipTypeLabel(type: MembershipType): string {
  switch (type) {
    case MembershipType.Lifetime: return 'Lifetime / आजीवन';
    case MembershipType.Yearly: return 'Yearly / वार्षिक';
    case MembershipType.Monthly: return 'Monthly / मासिक';
    default: return String(type);
  }
}

function getMembershipTypeBadgeClass(type: MembershipType): string {
  switch (type) {
    case MembershipType.Lifetime: return 'bg-purple-100 text-purple-800 border-purple-200';
    case MembershipType.Yearly: return 'bg-blue-100 text-blue-800 border-blue-200';
    case MembershipType.Monthly: return 'bg-teal-100 text-teal-800 border-teal-200';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ApplicationCard({ app }: { app: MembershipApplication }) {
  const updateStatus = useUpdateMembershipStatus();

  const handleApprove = () => {
    updateStatus.mutate({ id: app.id, status: ApplicationStatus.approved });
  };

  const handleReject = () => {
    updateStatus.mutate({ id: app.id, status: ApplicationStatus.rejected });
  };

  const isPending = app.status === ApplicationStatus.pending;
  const isApproved = app.status === ApplicationStatus.approved;
  const isRejected = app.status === ApplicationStatus.rejected;

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
      isPending ? 'border-yellow-200' : isApproved ? 'border-green-200' : 'border-red-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-maroon-100 flex items-center justify-center">
            <User className="w-5 h-5 text-maroon-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{app.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(app.submittedAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isPending && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          )}
          {isApproved && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <CheckCircle className="w-3 h-3" />
              Approved
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              <XCircle className="w-3 h-3" />
              Rejected
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getMembershipTypeBadgeClass(app.membershipType)}`}>
            {getMembershipTypeLabel(app.membershipType)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{app.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="truncate">{app.email || '—'}</span>
        </div>
        <div className="flex items-start gap-2 text-gray-600 sm:col-span-2">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <span>{app.address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className={app.paymentConfirmed ? 'text-green-600 font-medium' : 'text-red-500'}>
            {app.paymentConfirmed ? '✓ Payment Confirmed' : '✗ Payment Not Confirmed'}
          </span>
        </div>
      </div>

      {/* Actions */}
      {isPending && (
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={handleApprove}
            disabled={updateStatus.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {updateStatus.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Approve / स्वीकृत
          </button>
          <button
            onClick={handleReject}
            disabled={updateStatus.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {updateStatus.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Reject / अस्वीकृत
          </button>
        </div>
      )}
    </div>
  );
}

export default function MembershipRequestsTab() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { data: applications, isLoading, error } = useListMembershipApplications(
    filter === 'all' ? null : filter
  );

  const filterOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All / सभी' },
    { value: ApplicationStatus.pending, label: 'Pending / लंबित' },
    { value: ApplicationStatus.approved, label: 'Approved / स्वीकृत' },
    { value: ApplicationStatus.rejected, label: 'Rejected / अस्वीकृत' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-maroon-900 font-devanagari">सदस्यता आवेदन</h2>
          <p className="text-gray-500 text-sm">Membership Applications</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === opt.value
                  ? 'bg-maroon-800 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-maroon-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">Error loading applications</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
          <p className="text-red-400 text-xs mt-2 font-devanagari">
            नोट: Admin access के लिए proper authentication आवश्यक है
          </p>
        </div>
      )}

      {!isLoading && !error && applications && (
        <>
          {applications.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-devanagari">कोई आवेदन नहीं मिला</p>
              <p className="text-gray-400 text-sm">No applications found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {[...applications]
                .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
                .map((app) => (
                  <ApplicationCard key={app.id.toString()} app={app} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
