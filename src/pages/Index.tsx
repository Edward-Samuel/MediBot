import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Stethoscope, Video, Clock, Users } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import DoctorsList from "@/components/DoctorsList";
import AppointmentBooking from "@/components/AppointmentBooking";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showBooking, setShowBooking] = useState(false);

  const features = [
    {
      icon: MessageSquare,
      title: "AI Consultation",
      description: "Get instant medical advice from MEDIBOT",
    },
    {
      icon: Stethoscope,
      title: "Smart Doctor Matching",
      description: "Find the perfect specialist for your needs",
    },
    {
      icon: Calendar,
      title: "Easy Appointments",
      description: "Book and manage appointments seamlessly",
    },
    {
      icon: Video,
      title: "Telemedicine",
      description: "Consult doctors from anywhere",
    },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "Patients Served" },
    { icon: Stethoscope, value: "500+", label: "Expert Doctors" },
    { icon: Clock, value: "24/7", label: "Available Support" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">MEDIBOT</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Doctors</Button>
            <Button variant="ghost">Services</Button>
            <Button variant="ghost">About</Button>
          </nav>
          <Button className="gradient-primary text-white shadow-soft hover:shadow-glow transition-smooth">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                AI-Powered Healthcare
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Personal
                <span className="text-gradient block">Medical Assistant</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Connect with expert doctors, get instant AI consultations, and manage your health seamlessly with MEDIBOT.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white shadow-soft hover:shadow-glow transition-smooth"
                  onClick={() => setShowChat(true)}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with MEDIBOT
                </Button>
                <Button size="lg" variant="outline" className="border-2">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <Card className="p-8 shadow-glow border-2 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">MEDIBOT is online</p>
                      <p className="text-sm text-muted-foreground">Ready to assist you 24/7</p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm italic">"Hello! I'm MEDIBOT. How can I help you today? Tell me about your symptoms or health concerns."</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4 justify-center">
                <div className="w-14 h-14 rounded-xl gradient-secondary flex items-center justify-center shadow-soft">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How MEDIBOT Helps You</h2>
            <p className="text-lg text-muted-foreground">Advanced AI technology meeting compassionate healthcare</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-glow transition-smooth cursor-pointer border-2 hover:border-primary/50">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Expert Doctors</h2>
            <p className="text-lg text-muted-foreground">Certified specialists ready to help you</p>
          </div>
          <DoctorsList onSelectDoctor={(doctor) => {
            setSelectedDoctor(doctor);
            setShowBooking(true);
          }} />
        </div>
      </section>

      {/* Chat Interface Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl h-[80vh] animate-fade-in">
            <ChatInterface onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {showBooking && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl animate-fade-in">
            <AppointmentBooking 
              doctor={selectedDoctor} 
              onClose={() => {
                setShowBooking(false);
                setSelectedDoctor(null);
              }} 
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 MEDIBOT. Your trusted healthcare companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
