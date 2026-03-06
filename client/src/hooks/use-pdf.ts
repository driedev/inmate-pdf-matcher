import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useUploadPdf() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.pdf.upload.path, {
        method: api.pdf.upload.method,
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 400) {
          const parsed = api.pdf.upload.responses[400].parse(errorData);
          throw new Error(parsed.message);
        }
        if (res.status === 500) {
          const parsed = api.pdf.upload.responses[500].parse(errorData);
          throw new Error(parsed.message);
        }
        throw new Error("Failed to process PDF document");
      }

      const data = await res.json();
      return api.pdf.upload.responses[200].parse(data);
    },
    onError: (error) => {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
