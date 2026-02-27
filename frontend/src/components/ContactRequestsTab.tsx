import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, MapPin, Calendar, HelpCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useListContactInquiries, useListAssistanceRequests } from '../hooks/useQueries';

type SubTab = 'contact' | 'assistance';

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

export default function ContactRequestsTab() {
  const [subTab, setSubTab] = useState<SubTab>('contact');
  const { data: contacts, isLoading: contactsLoading, error: contactsError } = useListContactInquiries();
  const { data: assistance, isLoading: assistanceLoading, error: assistanceError } = useListAssistanceRequests();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-maroon-900 font-devanagari">संपर्क / सहायता अनुरोध</h2>
        <p className="text-gray-500 text-sm">Contact & Assistance Requests</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab('contact')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'contact'
              ? 'bg-maroon-800 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-maroon-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Inquiries</span>
          {contacts && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
              subTab === 'contact' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {contacts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setSubTab('assistance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            subTab === 'assistance'
              ? 'bg-maroon-800 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-maroon-300'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Assistance Requests</span>
          {assistance && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
              subTab === 'assistance' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {assistance.length}
            </span>
          )}
        </button>
      </div>

      {/* Contact Inquiries */}
      {subTab === 'contact' && (
        <>
          {contactsLoading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border p-5">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          )}
          {contactsError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-700 font-medium">Error loading contact inquiries</p>
              <p className="text-red-500 text-sm mt-1">{contactsError.message}</p>
            </div>
          )}
          {!contactsLoading && !contactsError && contacts && (
            <>
              {contacts.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-devanagari">कोई संपर्क अनुरोध नहीं</p>
                  <p className="text-gray-400 text-sm">No contact inquiries found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {[...contacts]
                    .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
                    .map((inquiry) => (
                      <div key={inquiry.id.toString()} className="bg-white rounded-xl border border-blue-100 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {formatDate(inquiry.submittedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{inquiry.email || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{inquiry.phone || '—'}</span>
                          </div>
                        </div>
                        {inquiry.message && (
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100">
                            <p className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                              {inquiry.message}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Assistance Requests */}
      {subTab === 'assistance' && (
        <>
          {assistanceLoading && (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border p-5">
                  <Skeleton className="h-4 w-32 mb-3" />
                  <Skeleton className="h-3 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          )}
          {assistanceError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-700 font-medium">Error loading assistance requests</p>
              <p className="text-red-500 text-sm mt-1">{assistanceError.message}</p>
            </div>
          )}
          {!assistanceLoading && !assistanceError && assistance && (
            <>
              {assistance.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-devanagari">कोई सहायता अनुरोध नहीं</p>
                  <p className="text-gray-400 text-sm">No assistance requests found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {[...assistance]
                    .sort((a, b) => Number(b.submittedAt) - Number(a.submittedAt))
                    .map((req) => (
                      <div key={req.id.toString()} className="bg-white rounded-xl border border-orange-100 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{req.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {formatDate(req.submittedAt)}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded-lg text-xs font-medium">
                            {req.requestType}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{req.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{req.address}</span>
                          </div>
                        </div>
                        {req.description && (
                          <div className="bg-orange-50 rounded-lg p-3 text-sm text-gray-700 border border-orange-100">
                            <p>{req.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
