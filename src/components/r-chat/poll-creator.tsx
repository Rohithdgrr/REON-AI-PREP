
'use client';
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dispatch, SetStateAction, useState } from "react";
import { Message, PollData } from "../r-chat-page";
import { useToast } from "@/hooks/use-toast";

type PollCreatorProps = {
    setMessages: Dispatch<SetStateAction<Message[]>>;
    setIsPollModalOpen: Dispatch<SetStateAction<boolean>>;
}

export function PollCreator({ setMessages, setIsPollModalOpen }: PollCreatorProps) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const { toast } = useToast();

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 5) setOptions([...options, ""]);
    };

    const createPoll = () => {
        if (question.trim() === "" || options.some(opt => opt.trim() === "")) {
            toast({ variant: 'destructive', title: "Incomplete Poll", description: "Please fill out the question and all options." });
            return;
        }
        const pollData: PollData = {
            question,
            options: options.map(opt => ({ text: opt, votes: 0 })),
        };
        const pollMessage: Message = {
            id: Date.now(),
            sender: 'me',
            type: 'poll',
            content: `Poll: ${question}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            replyTo: null,
            pollData,
        };
        setMessages((prev) => [...prev, pollMessage]);
        setIsPollModalOpen(false);
        setQuestion("");
        setOptions(["", ""]);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create a New Poll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="poll-question">Poll Question</Label>
                    <Input id="poll-question" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What should we decide?" />
                </div>
                <div className="space-y-2">
                    <Label>Options</Label>
                    {options.map((opt, index) => (
                        <Input key={index} value={opt} onChange={(e) => updateOption(index, e.target.value)} placeholder={`Option ${index + 1}`} />
                    ))}
                </div>
                <Button variant="outline" size="sm" onClick={addOption} disabled={options.length >= 5}>
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button onClick={createPoll}>Create Poll</Button>
            </DialogFooter>
        </DialogContent>
    )
}
