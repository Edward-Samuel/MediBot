import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Award } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  avatar: string;
  availability: string;
  consultationFee: number;
}

interface DoctorsListProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorsList = ({ onSelectDoctor }: DoctorsListProps) => {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Raju",
      specialization: "Cardiologist",
      experience: 15,
      rating: 4.9,
      avatar: "🧑‍⚕️",
      availability: "Available Today",
      consultationFee: 150
    },
    {
      id: 2,
      name: "Dr. PB",
      specialization: "General Physician",
      experience: 12,
      rating: 4.8,
      avatar: "👨‍⚕️",
      availability: "Available Today",
      consultationFee: 100
    },
    {
      id: 3,
      name: "Dr. Sam",
      specialization: "Orthopedic Surgeon",
      experience: 10,
      rating: 4.7,
      avatar: "👩‍⚕️",
      availability: "Tomorrow",
      consultationFee: 120
    },
    {
      id: 4,
      name: "Dr. Sanju",
      specialization: "Dermatologist",
      experience: 18,
      rating: 5.0,
      avatar: "👨‍⚕️",
      availability: "Available Today",
      consultationFee: 130
    },
    {
      id: 5,
      name: "Dr. Meera",
      specialization: "Pediatrician",
      experience: 10,
      rating: 4.5,
      avatar: "👨‍⚕️",
      availability: "Available Today",
      consultationFee: 100
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="p-6 hover:shadow-glow transition-smooth border-2 hover:border-primary/50">
          <div className="text-center mb-4">
            <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-4xl shadow-soft mb-3">
              {doctor.avatar}
            </div>
            <h3 className="font-semibold text-lg">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Experience</span>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-secondary" />
                <span className="font-medium">{doctor.experience} years</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{doctor.rating}/5.0</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-medium">${doctor.consultationFee}</span>
            </div>
          </div>

          <Badge className="w-full mb-3 justify-center bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
            {doctor.availability}
          </Badge>

          <Button 
            className="w-full gradient-primary text-white shadow-soft hover:shadow-glow transition-smooth"
            onClick={() => onSelectDoctor(doctor)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default DoctorsList;
