import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const ChatInterface = ({ onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm MEDIBOT, your AI medical assistant. I can help you with symptoms analysis, doctor recommendations, appointment booking, and general health questions. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (will be replaced with actual AI call)
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes("headache") || lowerMsg.includes("fever") || lowerMsg.includes("cold")) {
      return "I understand you're experiencing symptoms. Based on what you've described, I would recommend consulting with a General Physician or an Internal Medicine specialist. Would you like me to show you available doctors and help you book an appointment?";
    }
    
    if (lowerMsg.includes("heart") || lowerMsg.includes("chest pain")) {
      return "For heart-related concerns, I recommend consulting a Cardiologist. We have experienced cardiologists available. Would you like to see their profiles and schedule an appointment?";
    }
    
    if (lowerMsg.includes("skin") || lowerMsg.includes("rash") || lowerMsg.includes("acne")) {
      return "For skin conditions, a Dermatologist would be the best specialist to consult. I can help you find and book an appointment with our dermatologists. Shall I proceed?";
    }
    
    if (lowerMsg.includes("appointment") || lowerMsg.includes("book")) {
      return "I'd be happy to help you book an appointment! Could you please tell me about your symptoms or the type of specialist you'd like to see?";
    }
    
    return "Thank you for sharing that information. To better assist you, could you provide more details about your symptoms or health concerns? This will help me recommend the most suitable specialist for you.";
  };

  return (
    <Card className="h-full flex flex-col shadow-glow border-2 border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b gradient-primary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">MEDIBOT</h3>
            <p className="text-xs text-white/80">AI Medical Assistant</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "gradient-primary text-white"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe your symptoms..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="gradient-primary text-white shadow-soft"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
