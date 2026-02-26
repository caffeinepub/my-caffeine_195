import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { District, Village, GalleryEvent, GalleryImage } from '../backend';

// ---- Districts & Villages ----

export function useGetDistricts() {
  const { actor, isFetching } = useActor();
  return useQuery<District[]>({
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
    onError: () => {
      toast.error('जिला जोड़ने में त्रुटि हुई');
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
      toast.success('गाँव सफलतापूर्वक जोड़ा गया');
    },
    onError: () => {
      toast.error('गाँव जोड़ने में त्रुटि हुई');
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
      toast.success('जिला सफलतापूर्वक हटाया गया');
    },
    onError: () => {
      toast.error('जिला हटाने में त्रुटि हुई');
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
      toast.success('गाँव सफलतापूर्वक हटाया गया');
    },
    onError: () => {
      toast.error('गाँव हटाने में त्रुटि हुई');
    },
  });
}

export function useGetVillagesByDistrict(districtId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Village[]>({
    queryKey: ['villages', districtId?.toString()],
    queryFn: async () => {
      if (!actor || districtId === null) return [];
      return actor.getVillagesByDistrict(districtId);
    },
    enabled: !!actor && !isFetching && districtId !== null,
  });
}

// ---- Donations ----

export function useGetDonations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore
      if (typeof actor.getDonations === 'function') return actor.getDonations();
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDonation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; amount: string; message: string; upiTransactionId: string }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore
      return actor.addDonation(data.name, data.amount, data.message, data.upiTransactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      toast.success('दान की जानकारी सफलतापूर्वक दर्ज की गई');
    },
    onError: () => {
      toast.error('दान दर्ज करने में त्रुटि हुई');
    },
  });
}

// ---- Memberships ----

export function useGetMemberships() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['memberships'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore
      if (typeof actor.getMemberships === 'function') return actor.getMemberships();
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      mobile: string;
      email: string;
      city: string;
      aadhaar: string;
      addressProof: string;
      identityProof: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore
      return actor.addMembership(
        data.fullName,
        data.mobile,
        data.email,
        data.city,
        data.aadhaar,
        data.addressProof,
        data.identityProof
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      toast.success('सदस्यता आवेदन सफलतापूर्वक दर्ज किया गया');
    },
    onError: () => {
      toast.error('सदस्यता दर्ज करने में त्रुटि हुई');
    },
  });
}

// ---- Assistance Requests ----

export function useGetAssistanceRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['assistanceRequests'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore
      if (typeof actor.getAssistanceRequests === 'function') return actor.getAssistanceRequests();
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAssistanceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { fullName: string; mobile: string; city: string; assistanceType: string }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore
      return actor.addAssistanceRequest(data.fullName, data.mobile, data.city, data.assistanceType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistanceRequests'] });
      toast.success('सहायता अनुरोध सफलतापूर्वक दर्ज किया गया');
    },
    onError: () => {
      toast.error('सहायता अनुरोध दर्ज करने में त्रुटि हुई');
    },
  });
}

// ---- Contact Inquiries ----

export function useGetContactInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['contactInquiries'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore
      if (typeof actor.getContactInquiries === 'function') return actor.getContactInquiries();
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContactInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; mobile: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore
      return actor.addContactInquiry(data.name, data.email, data.mobile, data.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInquiries'] });
      toast.success('संदेश सफलतापूर्वक भेजा गया');
    },
    onError: () => {
      toast.error('संदेश भेजने में त्रुटि हुई');
    },
  });
}

// ---- Gallery ----

export function useGetGalleryEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryEvent[]>({
    queryKey: ['galleryEvents'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, subtitle }: { title: string; subtitle: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryEvent(title, subtitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryEvents'] });
      toast.success('गैलरी इवेंट सफलतापूर्वक जोड़ा गया');
    },
    onError: () => {
      toast.error('गैलरी इवेंट जोड़ने में त्रुटि हुई');
    },
  });
}

export function useDeleteGalleryEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryEvents'] });
      toast.success('गैलरी इवेंट सफलतापूर्वक हटाया गया');
    },
    onError: () => {
      toast.error('गैलरी इवेंट हटाने में त्रुटि हुई');
    },
  });
}

export function useGetGalleryImagesByEvent(eventId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryImage[]>({
    queryKey: ['galleryImages', eventId?.toString()],
    queryFn: async () => {
      if (!actor || eventId === null) return [];
      return actor.getGalleryImagesByEvent(eventId);
    },
    enabled: !!actor && !isFetching && eventId !== null,
  });
}

export function useAddGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, imageData, caption }: { eventId: bigint; imageData: string; caption: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryImage(eventId, imageData, caption);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['galleryEvents'] });
      queryClient.invalidateQueries({ queryKey: ['galleryImages', variables.eventId.toString()] });
      toast.success('फोटो सफलतापूर्वक अपलोड की गई');
    },
    onError: () => {
      toast.error('फोटो अपलोड करने में त्रुटि हुई');
    },
  });
}

export function useDeleteGalleryImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryImage(imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryEvents'] });
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast.success('फोटो सफलतापूर्वक हटाई गई');
    },
    onError: () => {
      toast.error('फोटो हटाने में त्रुटि हुई');
    },
  });
}
