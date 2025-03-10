import { useEffect } from 'react';

// Custom hook for entrance animations
export const useEntranceAnimation = (
  selector: string,
  animationClass: string = 'animate-fade-in',
  delay: number = 50,
  staggerFactor: number = 100
) => {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(animationClass);
      }, delay + (index * staggerFactor));
    });
    
    return () => {
      elements.forEach(el => {
        el.classList.remove(animationClass);
      });
    };
  }, [selector, animationClass, delay, staggerFactor]);
};

// Smoothly scroll to an element
export const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Add hover animation to elements
export const addHoverAnimation = (
  selector: string,
  enterClass: string,
  leaveClass: string
) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.classList.add(enterClass);
      el.classList.remove(leaveClass);
    });
    
    el.addEventListener('mouseleave', () => {
      el.classList.add(leaveClass);
      el.classList.remove(enterClass);
    });
  });
  
  return () => {
    elements.forEach(el => {
      el.removeEventListener('mouseenter', () => {});
      el.removeEventListener('mouseleave', () => {});
    });
  };
};

// Intersection observer for reveal animations
export const createRevealObserver = (
  selector: string,
  animationClass: string,
  threshold: number = 0.1,
  rootMargin: string = '0px'
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
        } else {
          entry.target.classList.remove(animationClass);
        }
      });
    },
    { threshold, rootMargin }
  );
  
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => observer.observe(el));
  
  return () => {
    elements.forEach(el => observer.unobserve(el));
    observer.disconnect();
  };
};

// Create ripple effect
export const createRipple = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple");
  
  const ripple = button.getElementsByClassName("ripple")[0];
  
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
  
  // Remove the ripple after animation completes
  setTimeout(() => {
    if (circle) {
      circle.remove();
    }
  }, 600);
};

// Animation definitions for the application
export {}; // This line prevents TypeScript errors for empty files

// Add to tailwind.config.ts:
// animation: {
//   'progress': 'progress 2s ease-in-out infinite',
//   'fade-in': 'fadeIn 0.5s ease-in-out',
//   'slide-up': 'slideUp 0.5s ease-in-out',
// },
// keyframes: {
//   progress: {
//     '0%': { width: '0%' },
//     '50%': { width: '100%' },
//     '100%': { width: '0%' },
//   },
//   fadeIn: {
//     '0%': { opacity: '0' },
//     '100%': { opacity: '1' },
//   },
//   slideUp: {
//     '0%': { transform: 'translateY(20px)', opacity: '0' },
//     '100%': { transform: 'translateY(0)', opacity: '1' },
//   },
// }
