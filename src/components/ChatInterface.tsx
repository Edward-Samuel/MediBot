import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Bot, Mic, Square, Loader2 } from "lucide-react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";
import { toast } from "@/components/ui/use-toast";

interface ChatInterfaceProps {
  onClose: () => void;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatAppRef = useRef<{ unmount: () => void } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Function to send transcribed message to n8n chat
  const sendTranscribedMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Find the n8n chat input field
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    // Try multiple selectors for n8n chat input
    const inputSelectors = [
      'textarea[placeholder*="question"]',
      'textarea[placeholder*="Type"]',
      'textarea.n8n-chat__input',
      'textarea',
      'input[type="text"]',
    ];

    let inputElement: HTMLTextAreaElement | HTMLInputElement | null = null;

    for (const selector of inputSelectors) {
      inputElement = chatContainer.querySelector(selector);
      if (inputElement) break;
    }

    if (inputElement) {
      // Set the value using both value property and setter
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement?.prototype || window.HTMLInputElement?.prototype,
        'value'
      )?.set;
      
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(inputElement, text);
      } else {
        inputElement.value = text;
      }
      
      // Trigger multiple events to ensure Vue reactivity
      const events = ['input', 'change', 'keyup'];
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        inputElement.dispatchEvent(event);
      });

      // Find and click the send button or trigger Enter key
      setTimeout(() => {
        // Try multiple selectors for send button
        const sendButtonSelectors = [
          'button[type="submit"]',
          'button[aria-label*="send" i]',
          'button[title*="send" i]',
          '.n8n-chat__send-button',
          'button:has(svg)',
          'button:last-child',
        ];
        
        let sendButton: HTMLButtonElement | null = null;
        for (const selector of sendButtonSelectors) {
          const btn = chatContainer.querySelector(selector);
          if (btn && btn instanceof HTMLButtonElement) {
            sendButton = btn;
            break;
          }
        }
        
        if (sendButton && !sendButton.disabled) {
          sendButton.click();
        } else {
          // Fallback: simulate Enter key press
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          inputElement.dispatchEvent(enterEvent);
          
          // Also try keypress
          const keypressEvent = new KeyboardEvent('keypress', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          });
          inputElement.dispatchEvent(keypressEvent);
        }
      }, 150);
    } else {
      // Fallback: directly call the webhook if we can't find the input
      toast({
        title: "Voice Input",
        description: `Transcribed: "${text}" - Please send manually`,
      });
    }
  }, []);

  // Check microphone permissions and HTTPS requirement
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check if we're on HTTPS or localhost (required for getUserMedia)
        const isSecureContext = window.isSecureContext || 
                                window.location.protocol === 'https:' || 
                                window.location.hostname === 'localhost' ||
                                window.location.hostname === '127.0.0.1';

        if (!isSecureContext) {
          console.warn('Microphone access requires HTTPS or localhost');
          setHasPermission(false);
          toast({
            title: "HTTPS Required",
            description: "Voice input requires a secure connection (HTTPS) or localhost.",
            variant: "destructive",
          });
          return;
        }

        // Check if navigator.mediaDevices is available
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasPermission(true);
            // Stop the stream immediately, we just needed to check permission
            stream.getTracks().forEach(track => track.stop());
          } catch (err: any) {
            console.error('Microphone permission error:', err);
            setHasPermission(false);
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
              toast({
                title: "Microphone Permission Required",
                description: "Please allow microphone access to use voice input.",
                variant: "destructive",
              });
            } else if (err.name === 'NotFoundError') {
              toast({
                title: "No Microphone Found",
                description: "No microphone device detected. Please connect a microphone.",
                variant: "destructive",
              });
            }
          }
        } else {
          setHasPermission(false);
          console.warn('getUserMedia is not supported');
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasPermission(false);
      }
    };

    checkPermissions();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const initializeRecognition = () => {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true; // Enable interim results for better UX
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log('Speech recognition started');
          setIsRecording(true);
          setIsTranscribing(false);
        };

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Only process final results
          if (finalTranscript.trim()) {
            console.log('Final transcript:', finalTranscript);
            setIsTranscribing(true);
            sendTranscribedMessage(finalTranscript.trim());
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsTranscribing(false);
          
          let errorMessage = "Speech recognition error occurred";
          let shouldRetry = false;

          switch (event.error) {
            case 'no-speech':
              errorMessage = "No speech detected. Please try again.";
              shouldRetry = false;
              break;
            case 'audio-capture':
              errorMessage = "Microphone not found or not accessible. Please check your microphone settings.";
              setHasPermission(false);
              break;
            case 'not-allowed':
              errorMessage = "Microphone permission denied. Please allow microphone access in your browser settings.";
              setHasPermission(false);
              break;
            case 'aborted':
              errorMessage = "Speech recognition was aborted.";
              break;
            case 'network':
              errorMessage = "Network error. Please check your connection.";
              break;
            case 'service-not-allowed':
              errorMessage = "Speech recognition service is not allowed.";
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }
          
          toast({
            title: "Voice Input Error",
            description: errorMessage,
            variant: "destructive",
          });

          // Reinitialize recognition on certain errors
          if (shouldRetry && event.error !== 'aborted') {
            setTimeout(() => {
              initializeRecognition();
            }, 1000);
          }
        };

        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording((prev) => {
            // Don't auto-restart - let user control it
            return false;
          });
          setIsTranscribing(false);
        };

        recognition.onnomatch = () => {
          console.log('No speech match found');
          toast({
            title: "No Match",
            description: "Could not understand the speech. Please try again.",
            variant: "destructive",
          });
        };

        recognitionRef.current = recognition;
      } catch (error) {
        console.error('Error initializing speech recognition:', error);
        setIsSupported(false);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize speech recognition.",
          variant: "destructive",
        });
      }
    };

    initializeRecognition();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
        recognitionRef.current = null;
      }
    };
  }, [sendTranscribedMessage, isRecording]);

  // Handle voice recording toggle
  const toggleRecording = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Speech Recognition is not supported in this browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    // Check permissions first
    if (hasPermission === false) {
      toast({
        title: "Permission Required",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
      
      // Try to request permission again
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err: any) {
        console.error('Permission request failed:', err);
        return;
      }
    }

    if (!recognitionRef.current) {
      toast({
        title: "Not Initialized",
        description: "Speech recognition is not initialized. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    } else {
      try {
        // Check if already started
        if (recognitionRef.current) {
          recognitionRef.current.start();
          toast({
            title: "Recording Started",
            description: "Speak now...",
          });
        }
      } catch (error: any) {
        console.error('Error starting recognition:', error);
        
        // Handle specific errors
        if (error.name === 'InvalidStateError' || error.message?.includes('already started')) {
          // Recognition is already running, just update state
          setIsRecording(true);
        } else {
          toast({
            title: "Recording Error",
            description: error.message || "Could not start voice recording. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  // Initialize n8n chat
  useEffect(() => {
    if (!chatContainerRef.current) return;

    // Get webhook URL from environment or use default
    const webhookUrl = import.meta.env.DEV
      ? `/n8n/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat`
      : `http://localhost:5678/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat`;

    // Create a unique ID for this chat instance
    const chatId = `n8n-chat-${Date.now()}`;
    chatContainerRef.current.id = chatId;

    // Initialize n8n chat
    const chatApp = createChat({
      webhookUrl: webhookUrl,
      target: `#${chatId}`,
      mode: "fullscreen",
      initialMessages: [
        "Hello! I'm MEDIBOT, your AI medical assistant. I can help you with symptoms analysis, doctor recommendations, appointment booking, and general health questions. How can I help you today?"
      ],
      showWelcomeScreen: false,
      loadPreviousSession: true,
      enableStreaming: false,
    });

    chatAppRef.current = chatApp;

    // Cleanup function
    return () => {
      if (chatAppRef.current && typeof chatAppRef.current.unmount === 'function') {
        // Unmount the Vue app
        chatAppRef.current.unmount();
        chatAppRef.current = null;
      }
      // Stop recognition if active
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <Card className="h-full flex flex-col shadow-glow border-2 border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b gradient-primary z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">MEDIBOT</h3>
            <p className="text-xs text-white/80">AI Medical Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Voice Input Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            disabled={isTranscribing || !isSupported || hasPermission === false}
            className={`text-white hover:bg-white/20 ${
              isRecording ? "bg-red-500/30 animate-pulse" : ""
            } ${!isSupported || hasPermission === false ? "opacity-50 cursor-not-allowed" : ""}`}
            title={
              !isSupported 
                ? "Voice input not supported in this browser" 
                : hasPermission === false
                ? "Microphone permission required"
                : isRecording 
                ? "Stop recording" 
                : "Start voice input"
            }
          >
            {isTranscribing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRecording ? (
              <Square className="w-5 h-5 fill-white" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* n8n Chat Container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 w-full h-full overflow-hidden"
        style={{ minHeight: 0 }}
      />
    </Card>
  );
};

export default ChatInterface;
