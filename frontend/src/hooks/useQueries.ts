import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Activity, Donation } from '../backend';

// ─── Activities ───────────────────────────────────────────────────────────────

export function useGetActivities() {
  const { actor, isFetching } = useActor();

  return useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSeedActivities() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.seedActivities();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

// ─── Donations ────────────────────────────────────────────────────────────────

export function useGetDonations() {
  const { actor, isFetching } = useActor();

  return useQuery<Donation[]>({
    queryKey: ['donations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDonations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDonation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      donorName,
      amount,
      message,
    }: {
      donorName: string;
      amount: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDonation(donorName, amount, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    },
  });
}

// ─── Contact Inquiries ────────────────────────────────────────────────────────

export function useAddContactInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addContactInquiry(name, email, message);
    },
  });
}

// ─── Foundation Info ──────────────────────────────────────────────────────────

export function useGetFoundationInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    description: string;
    email: string;
    address: string;
    phone: string;
    socialMedia: string[];
  }>({
    queryKey: ['foundationInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFoundationInfo();
    },
    enabled: !!actor && !isFetching,
  });
}
