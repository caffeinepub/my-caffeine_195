import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { ApplicationStatus, MembershipType } from '../backend';

// ---- Districts ----
export function useGetDistricts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['districts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDistricts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDistrict(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('जिला सफलतापूर्वक जोड़ा गया');
    },
    onError: (error: Error) => {
      toast.error('जिला जोड़ने में त्रुटि: ' + error.message);
    },
  });
}

export function useEditDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editDistrict(id, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('जिला सफलतापूर्वक अपडेट किया गया');
    },
    onError: (error: Error) => {
      toast.error('जिला अपडेट करने में त्रुटि: ' + error.message);
    },
  });
}

export function useDeleteDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDistrict(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('जिला सफलतापूर्वक हटाया गया');
    },
    onError: (error: Error) => {
      toast.error('जिला हटाने में त्रुटि: ' + error.message);
    },
  });
}

// ---- Villages ----
export function useGetVillagesByDistrict(districtId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['villages', districtId?.toString()],
    queryFn: async () => {
      if (!actor || districtId === null) return [];
      return actor.getVillagesByDistrict(districtId);
    },
    enabled: !!actor && !isFetching && districtId !== null,
  });
}

export function useAddVillage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ districtId, name }: { districtId: bigint; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVillage(districtId, name);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['villages', variables.districtId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('गाँव सफलतापूर्वक जोड़ा गया');
    },
    onError: (error: Error) => {
      toast.error('गाँव जोड़ने में त्रुटि: ' + error.message);
    },
  });
}

export function useEditVillage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, districtId }: { id: bigint; name: string; districtId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editVillage(id, name);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['villages', variables.districtId.toString()] });
      toast.success('गाँव सफलतापूर्वक अपडेट किया गया');
    },
    onError: (error: Error) => {
      toast.error('गाँव अपडेट करने में त्रुटि: ' + error.message);
    },
  });
}

export function useDeleteVillage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, districtId }: { id: bigint; districtId: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVillage(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['villages', variables.districtId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('गाँव सफलतापूर्वक हटाया गया');
    },
    onError: (error: Error) => {
      toast.error('गाँव हटाने में त्रुटि: ' + error.message);
    },
  });
}

// ---- Contact Inquiry ----
export function useAddContactInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      message,
    }: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContactInquiry(name, email, phone, message);
    },
    onSuccess: () => {
      toast.success('आपका संदेश सफलतापूर्वक भेजा गया! हम जल्द संपर्क करेंगे।');
    },
    onError: (error: Error) => {
      toast.error('संदेश भेजने में त्रुटि: ' + error.message);
    },
  });
}

// ---- Assistance Request ----
export function useAddAssistanceRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      mobile,
      address,
      requestType,
      description,
    }: {
      name: string;
      mobile: string;
      address: string;
      requestType: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAssistanceRequest(name, mobile, address, requestType, description);
    },
    onSuccess: () => {
      toast.success('आपकी सहायता अनुरोध सफलतापूर्वक भेजी गई!');
    },
    onError: (error: Error) => {
      toast.error('अनुरोध भेजने में त्रुटि: ' + error.message);
    },
  });
}

// ---- Donation Intent ----
export function useAddDonationIntent() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      amount,
      message,
    }: {
      name: string;
      email: string;
      amount: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDonationIntent(name, email, amount, message);
    },
    onSuccess: () => {
      toast.success('आपकी दान जानकारी सफलतापूर्वक दर्ज की गई! जज़ाकल्लाह खैर।');
    },
    onError: (error: Error) => {
      toast.error('दान जानकारी दर्ज करने में त्रुटि: ' + error.message);
    },
  });
}

// ---- Membership Application ----
export function useAddMembershipApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      email,
      address,
      membershipType,
      paymentConfirmed,
    }: {
      name: string;
      phone: string;
      email: string;
      address: string;
      membershipType: MembershipType;
      paymentConfirmed: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMembershipApplication(name, phone, email, address, membershipType, paymentConfirmed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipApplications'] });
      toast.success('सदस्यता आवेदन सफलतापूर्वक जमा किया गया! हम जल्द संपर्क करेंगे।');
    },
    onError: (error: Error) => {
      toast.error('आवेदन जमा करने में त्रुटि: ' + error.message);
    },
  });
}

export function useListMembershipApplications(statusFilter?: ApplicationStatus | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['membershipApplications', statusFilter ?? 'all'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listMembershipApplications(statusFilter ?? null);
      } catch (e: any) {
        if (e?.message?.includes('Unauthorized')) {
          throw new Error('Admin access required. Please ensure you are logged in as admin.');
        }
        throw e;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateMembershipStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: ApplicationStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateApplicationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipApplications'] });
      toast.success('आवेदन स्थिति सफलतापूर्वक अपडेट की गई');
    },
    onError: (error: Error) => {
      toast.error('स्थिति अपडेट करने में त्रुटि: ' + error.message);
    },
  });
}

// ---- Admin Password ----
export function useVerifyAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyAdminPassword(password);
    },
    onError: (error: Error) => {
      toast.error('पासवर्ड सत्यापन में त्रुटि: ' + error.message);
    },
  });
}

// ---- Admin: List Donation Intents ----
export function useListDonationIntents() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['donationIntents'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listDonationIntents();
      } catch (e: any) {
        if (e?.message?.includes('Unauthorized')) {
          throw new Error('Admin access required.');
        }
        throw e;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// ---- Admin: List Contact Inquiries ----
export function useListContactInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['contactInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listContactInquiries();
      } catch (e: any) {
        if (e?.message?.includes('Unauthorized')) {
          throw new Error('Admin access required.');
        }
        throw e;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// ---- Admin: List Assistance Requests ----
export function useListAssistanceRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['assistanceRequests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listAssistanceRequests();
      } catch (e: any) {
        if (e?.message?.includes('Unauthorized')) {
          throw new Error('Admin access required.');
        }
        throw e;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
