import emailjs from '@emailjs/browser';

// initialize EmailJS with public key from environment
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string);

export default emailjs;
