import { useToast } from "./use-toast";

export const useComingSoonToast = () => {
  const { toast } = useToast();
  const comingSoonToast = () => {
    toast({
      title: "Coming soon!!",
      description: "This feature is not available yet",
      duration: 3000,
    });
  };
  return { comingSoonToast };
};
