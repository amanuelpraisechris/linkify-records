
import { toast } from '@/hooks/use-toast';

// Helper to prevent duplicate toasts
let activeToasts = new Set();

// Custom toast function that prevents duplicates
export const showToast = (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
  const key = `${props.title}-${props.description}`;
  if (activeToasts.has(key)) return;
  
  activeToasts.add(key);
  const id = toast({
    ...props,
  });

  // Clean up the toast ID from tracking after it's dismissed
  setTimeout(() => {
    activeToasts.delete(key);
  }, 5000); // Assuming 5 seconds duration for toast
};
