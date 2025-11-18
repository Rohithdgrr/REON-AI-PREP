"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function SimpleCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleButtonClick = (value: string) => {
    if (result !== null) {
      if (['+', '-', '*', '/'].includes(value)) {
        setInput(result + value);
        setResult(null);
      } else {
        setInput(value);
        setResult(null);
      }
      return;
    }
    setInput((prev) => prev + value);
  };

  const calculateResult = () => {
    try {
      // Using a safer evaluation method
      const calculatedResult = new Function('return ' + input)();
      if (isNaN(calculatedResult) || !isFinite(calculatedResult)) {
        setResult("Error");
      } else {
        setResult(String(calculatedResult));
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const clearInput = () => {
    setInput("");
    setResult(null);
  };

  const backspace = () => {
    if (result !== null) {
      clearInput();
      return;
    }
    setInput((prev) => prev.slice(0, -1));
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="p-4 space-y-4">
        <div className="h-20 bg-muted rounded-md p-4 text-right text-3xl font-mono overflow-x-auto">
          {result !== null ? result : input || "0"}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="destructive" className="col-span-2" onClick={clearInput}>Clear</Button>
          <Button variant="outline" onClick={backspace}>⌫</Button>
          {buttons.map((btn) => (
            btn === '=' ?
              <Button key={btn} onClick={calculateResult}>{btn}</Button> :
              <Button key={btn} variant={['/', '*', '-', '+'].includes(btn) ? "secondary" : "outline"} onClick={() => handleButtonClick(btn)}>{btn}</Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}