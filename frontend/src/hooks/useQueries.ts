import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

// ---- Local inline types for stubbed backend methods ----

export interface Activity {
  id: bigint;
  title: string;
  description: string;
  date: bigint;
  image: ExternalBlob;
}

export interface Donation {
  donorName: string;
  amount: bigint;
  message: string;
  timestamp: bigint;
}

export interface MembershipRequest {
  fullName: string;
  mobileNumber: string;
  email: string | null;
  city: string;
  aadhaarNumber: string;
  addressProofFile: ExternalBlob | null;
  identityProofFile: ExternalBlob | null;
  registrationTimestamp: bigint;
}

export interface AssistanceRequest {
  fullName: string;
  mobileNumber: string;
  city: string;
  assistanceType: string;
  submissionTimestamp: bigint;
}

export interface ContactInquiry {
  name: string;
  email: string;
  message: string;
  timestamp: bigint;
}

export interface FoundationInfo {
  description: string;
  email: string;
  address: string;
  phone: string;
  socialMedia: string[];
}

// ---- Stubbed hooks (backend methods removed in migration) ----

export function useGetActivities() {
  return useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => [],
  });
}

export function useSeedActivities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      // stubbed — no-op
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useGetDonations() {
  return useQuery<Donation[]>({
    queryKey: ['donations'],
    queryFn: async () => [],
  });
}

export function useAddDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: { donorName: string; amount: bigint; message: string }) => {
      // stubbed — no-op
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    },
  });
}

export function useGetMemberships() {
  return useQuery<MembershipRequest[]>({
    queryKey: ['memberships'],
    queryFn: async () => [],
  });
}

export function useAddMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: {
      fullName: string;
      mobileNumber: string;
      email: string | null;
      city: string;
      aadhaarNumber: string;
      addressProofFile: ExternalBlob | null;
      identityProofFile: ExternalBlob | null;
    }) => {
      // stubbed — no-op
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}

export function useGetAssistanceRequests() {
  return useQuery<AssistanceRequest[]>({
    queryKey: ['assistanceRequests'],
    queryFn: async () => [],
  });
}

export function useAddAssistanceRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: {
      fullName: string;
      mobileNumber: string;
      city: string;
      assistanceType: string;
    }) => {
      // stubbed — no-op
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistanceRequests'] });
    },
  });
}

export function useGetContactInquiries() {
  return useQuery<ContactInquiry[]>({
    queryKey: ['contactInquiries'],
    queryFn: async () => [],
  });
}

export function useAddContactInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_params: { name: string; email: string; message: string }) => {
      // stubbed — no-op
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInquiries'] });
    },
  });
}

export function useGetFoundationInfo() {
  return useQuery<FoundationInfo>({
    queryKey: ['foundationInfo'],
    queryFn: async () => ({
      description: '',
      email: '',
      address: '',
      phone: '',
      socialMedia: [],
    }),
  });
}

// ---- District & Village hooks (live backend) ----

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

export function useGetVillagesByDistrict(districtId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['villages', districtId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVillagesByDistrict(districtId);
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
      toast.success('जिला सफलतापूर्वक जोड़ा गया!');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unauthorized') || message.includes('admin')) {
        toast.error('अनुमति नहीं है। केवल एडमिन ही जिला जोड़ सकते हैं। कृपया लॉगिन करें।');
      } else {
        toast.error('जिला जोड़ने में समस्या हुई। कृपया पुनः प्रयास करें।');
      }
    },
  });
}

export function useAddVillage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ districtId, villageName }: { districtId: bigint; villageName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVillage(districtId, villageName);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      queryClient.invalidateQueries({ queryKey: ['villages', variables.districtId.toString()] });
      toast.success('गाँव सफलतापूर्वक जोड़ा गया!');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unauthorized') || message.includes('admin')) {
        toast.error('अनुमति नहीं है। केवल एडमिन ही गाँव जोड़ सकते हैं। कृपया लॉगिन करें।');
      } else {
        toast.error('गाँव जोड़ने में समस्या हुई। कृपया पुनः प्रयास करें।');
      }
    },
  });
}

export function useDeleteDistrict() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (districtId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDistrict(districtId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('जिला हटा दिया गया।');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unauthorized') || message.includes('admin')) {
        toast.error('अनुमति नहीं है। केवल एडमिन ही जिला हटा सकते हैं। कृपया लॉगिन करें।');
      } else {
        toast.error('जिला हटाने में समस्या हुई। कृपया पुनः प्रयास करें।');
      }
    },
  });
}

export function useDeleteVillage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (villageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVillage(villageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('गाँव हटा दिया गया।');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('Unauthorized') || message.includes('admin')) {
        toast.error('अनुमति नहीं है। केवल एडमिन ही गाँव हटा सकते हैं। कृपया लॉगिन करें।');
      } else {
        toast.error('गाँव हटाने में समस्या हुई। कृपया पुनः प्रयास करें।');
      }
    },
  });
}
