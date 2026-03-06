import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useInmates() {
  return useQuery({
    queryKey: [api.inmates.list.path],
    queryFn: async () => {
      const res = await fetch(api.inmates.list.path, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch inmates");
      }
      const data = await res.json();
      return api.inmates.list.responses[200].parse(data);
    },
  });
}

export function useScrapeInmates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.inmates.scrape.path, {
        method: api.inmates.scrape.method,
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 500) {
          const error = api.inmates.scrape.responses[500].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("An unexpected error occurred while scraping");
      }
      
      const data = await res.json();
      return api.inmates.scrape.responses[200].parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.inmates.list.path] });
      toast({
        title: "Roster Updated",
        description: `Successfully scraped ${data.count} inmates.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Scrape Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
