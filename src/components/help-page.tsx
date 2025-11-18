
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, Phone } from "lucide-react";

const faqs = [
    {
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click on the 'Forgot your password?' link. Follow the instructions sent to your registered email address.",
    },
    {
        question: "How is my 'Weakness Radar' calculated?",
        answer: "Your Weakness Radar is calculated by an AI algorithm that analyzes your performance in mock tests and practice sessions. It identifies subjects and topics where you score lower or take more time, helping you focus your efforts.",
    },
    {
        question: "Can I take a mock test more than once?",
        answer: "Mock tests are designed to simulate a real exam environment and are typically available only once. However, you can review the analysis and solutions multiple times from your 'Past Mock Test Results' section.",
    },
    {
        question: "How do I generate a personalized study plan?",
        answer: "The AI automatically generates a 'Today's Plan' for you on the dashboard based on your available time and weak areas. A more comprehensive roadmap is available on the 'Roadmap' page.",
    },
    {
        question: "What is 'R-Chat'?",
        answer: "R-Chat is a collaborative tool where you can join study groups, chat with fellow aspirants, and get instant doubt clarification from our LIBRA AI.",
    }
]

export function HelpPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Help & Support
        </h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions and get in touch with our support team.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>If you can't find an answer, feel free to reach out.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
                <Mail className="h-8 w-8 text-primary" />
                <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <a href="mailto:support@reon.ai" className="text-muted-foreground hover:text-primary">support@reon.ai</a>
                </div>
            </div>
             <div className="flex items-center gap-4">
                <Phone className="h-8 w-8 text-primary" />
                <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-muted-foreground">+91-80-XXXX-XXXX</p>
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
