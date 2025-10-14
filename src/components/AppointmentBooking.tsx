import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  consultationFee: number;
}

interface AppointmentBookingProps {
  doctor: Doctor;
  onClose: () => void;
}

const AppointmentBooking = ({ doctor, onClose }: AppointmentBookingProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    symptoms: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate booking
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} has been confirmed.`,
      });
    }, 500);
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 text-center shadow-glow border-2 border-primary/20 animate-fade-in">
        <div className="w-20 h-20 rounded-full gradient-secondary mx-auto flex items-center justify-center mb-6 shadow-glow">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Appointment Confirmed!</h2>
        <p className="text-muted-foreground mb-6">
          Your appointment with {doctor.name} has been successfully booked.
        </p>
        <div className="bg-muted rounded-lg p-4 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-medium">{formData.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium">{formData.time}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          A confirmation email has been sent to {formData.email}
        </p>
        <Button 
          onClick={onClose}
          className="gradient-primary text-white shadow-soft hover:shadow-glow transition-smooth"
        >
          Close
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-glow border-2 border-primary/20 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Book Appointment</h2>
          <p className="text-sm text-muted-foreground">
            {doctor.name} - {doctor.specialization}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name</Label>
          <Input
            id="patientName"
            required
            value={formData.patientName}
            onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date</Label>
          <Input
            id="date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label>Preferred Time</Label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant={formData.time === slot ? "default" : "outline"}
                className={formData.time === slot ? "gradient-primary text-white" : ""}
                onClick={() => setFormData({ ...formData, time: slot })}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
          <Textarea
            id="symptoms"
            required
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            placeholder="Please describe your symptoms or reason for consultation..."
            rows={4}
          />
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Consultation Fee</span>
            <span className="text-xl font-bold">${doctor.consultationFee}</span>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full gradient-primary text-white shadow-soft hover:shadow-glow transition-smooth"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Confirm Appointment
        </Button>
      </form>
    </Card>
  );
};

export default AppointmentBooking;
