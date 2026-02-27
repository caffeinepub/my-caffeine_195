import React, { useState } from 'react';
import { Search, UserCheck, Phone, Mail, MapPin, Calendar, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useListMembershipApplications } from '../hooks/useQueries';
import { ApplicationStatus, MembershipType } from '../backend';

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

export default function MembersListTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: members, isLoading, error } = useListMembershipApplications(ApplicationStatus.approved);

  const filteredMembers = members?.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.email.toLowerCase().includes(q);
  }) ?? [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-maroon-900 font-devanagari">सदस्य सूची</h2>
          <p className="text-gray-500 text-sm">
            Approved Members
            {members && <span className="ml-2 text-maroon-700 font-medium">({members.length} total)</span>}
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400"
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-medium">Error loading members</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
              <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              {searchQuery ? (
                <>
                  <p className="text-gray-500">No members match your search</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-maroon-600 hover:text-maroon-800 text-sm underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-500 font-devanagari">कोई स्वीकृत सदस्य नहीं</p>
                  <p className="text-gray-400 text-sm">No approved members yet</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredMembers
                .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
                .map((member) => (
                  <div key={member.id.toString()} className="bg-white rounded-xl border border-green-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(member.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getMembershipTypeBadgeClass(member.membershipType)}`}>
                        {getMembershipTypeLabel(member.membershipType)}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span>{member.address}</span>
                      </div>
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
