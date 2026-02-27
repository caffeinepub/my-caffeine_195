import React from 'react';
import { Heart, Mail, IndianRupee, MessageSquare, Calendar, TrendingUp, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useListDonationIntents } from '../hooks/useQueries';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DonationsTab() {
  const { data: donations, isLoading, error } = useListDonationIntents();

  const totalAmount = donations?.reduce((sum, d) => {
    const amt = parseFloat(d.amount.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0) ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-maroon-900 font-devanagari">दान रिकॉर्ड</h2>
        <p className="text-gray-500 text-sm">Donation Records</p>
      </div>

      {/* Summary Cards */}
      {!isLoading && !error && donations && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-green-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
              <p className="text-sm text-gray-500 font-devanagari">कुल दानकर्ता / Total Donors</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gold-100 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{totalAmount.toLocaleString('hi-IN')}
              </p>
              <p className="text-sm text-gray-500 font-devanagari">कुल दान राशि / Total Amount</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">Error loading donations</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && donations && (
        <>
          {donations.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-devanagari">कोई दान रिकॉर्ड नहीं</p>
              <p className="text-gray-400 text-sm">No donation records found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {[...donations]
                .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
                .map((donation) => (
                  <div key={donation.id.toString()} className="bg-white rounded-xl border border-gold-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{donation.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(donation.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-700">{donation.amount}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{donation.email || '—'}</span>
                      </div>
                      {donation.message && (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 italic">"{donation.message}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
