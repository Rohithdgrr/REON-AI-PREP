
"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

export function SimpleCalculator() {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [history, setHistory] = useState("");
  const [isDeg, setIsDeg] = useState(true);

  const handleAppend = (val: string) => {
    if (displayValue === "Error") {
      setExpression(val);
      setDisplayValue(val);
      return;
    }
    setExpression((prev) => prev + val);
    setDisplayValue((prev) => (prev === "0" ? val : prev + val));
  };
  
  const backspace = () => {
    if (displayValue === "Error") {
       clearAll();
       return;
    }
    setExpression((prev) => prev.slice(0, -1));
    setDisplayValue((prev) => {
        const newDisplay = prev.slice(0, -1);
        return newDisplay === "" ? "0" : newDisplay;
    });
  };

  const clearAll = () => {
    setExpression("");
    setDisplayValue("0");
    setHistory("");
  };

  const toggleDeg = () => setIsDeg((prev) => !prev);
  
  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  const calculate = () => {
    if (!expression) return;
    try {
      let evalExpr = expression
        .replace(/π/g, String(Math.PI))
        .replace(/e/g, String(Math.E))
        .replace(/\^/g, "**")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sin\(/g, isDeg ? "Math.sin(Math.PI/180*" : "Math.sin(")
        .replace(/cos\(/g, isDeg ? "Math.cos(Math.PI/180*" : "Math.cos(")
        .replace(/tan\(/g, isDeg ? "Math.tan(Math.PI/180*" : "Math.tan(")
        .replace(/%/g, "/100");

      // Handle factorial
      evalExpr = evalExpr.replace(/(\d+)!/g, (_, num) => String(factorial(parseInt(num))));
      
      // eslint-disable-next-line no-eval
      let result = eval(evalExpr);

      if (!isFinite(result)) throw new Error("Result is not finite");

      result = Number(result.toFixed(10));
      
      setHistory(expression + " =");
      setDisplayValue(String(result));
      setExpression(String(result));
    } catch (e) {
      setDisplayValue("Error");
      setExpression("");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleAppend(e.key);
      if ('+-*/'.includes(e.key)) handleAppend(e.key);
      if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          calculate();
      };
      if (e.key === 'Backspace') backspace();
      if (e.key === 'Escape') clearAll();
      if (e.key === '.') handleAppend('.');
      if (e.key === '(') handleAppend('(');
      if (e.key === ')') handleAppend(')');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression, isDeg]);


  const buttons = [
    { label: "C", action: clearAll, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90" },
    { label: isDeg ? 'DEG' : 'RAD', action: toggleDeg, className: "bg-muted text-green-500 hover:bg-muted/80 text-xs" },
    { label: "(", action: () => handleAppend('('), className: "bg-secondary hover:bg-secondary/80" },
    { label: ")", action: () => handleAppend(')'), className: "bg-secondary hover:bg-secondary/80" },
    { label: "⌫", action: backspace, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90" },
    
    { label: "sin", action: () => handleAppend('sin('), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "cos", action: () => handleAppend('cos('), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "tan", action: () => handleAppend('tan('), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "π", action: () => handleAppend('π'), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "x^y", action: () => handleAppend('^'), className: "bg-secondary hover:bg-secondary/80" },

    { label: "log", action: () => handleAppend('log('), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "ln", action: () => handleAppend('ln('), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "√", action: () => handleAppend('√('), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "n!", action: () => handleAppend('!'), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "÷", action: () => handleAppend('/'), className: "bg-secondary hover:bg-secondary/80" },

    { label: "7", action: () => handleAppend('7'), className: "bg-muted hover:bg-muted/80" },
    { label: "8", action: () => handleAppend('8'), className: "bg-muted hover:bg-muted/80" },
    { label: "9", action: () => handleAppend('9'), className: "bg-muted hover:bg-muted/80" },
    { label: "e", action: () => handleAppend('e'), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "×", action: () => handleAppend('*'), className: "bg-secondary hover:bg-secondary/80" },

    { label: "4", action: () => handleAppend('4'), className: "bg-muted hover:bg-muted/80" },
    { label: "5", action: () => handleAppend('5'), className: "bg-muted hover:bg-muted/80" },
    { label: "6", action: () => handleAppend('6'), className: "bg-muted hover:bg-muted/80" },
    { label: "%", action: () => handleAppend('%'), className: "bg-primary/50 hover:bg-primary/40 text-accent-foreground" },
    { label: "-", action: () => handleAppend('-'), className: "bg-secondary hover:bg-secondary/80" },

    { label: "1", action: () => handleAppend('1'), className: "bg-muted hover:bg-muted/80" },
    { label: "2", action: () => handleAppend('2'), className: "bg-muted hover:bg-muted/80" },
    { label: "3", action: () => handleAppend('3'), className: "bg-muted hover:bg-muted/80" },
    { label: "+", action: () => handleAppend('+'), className: "bg-secondary hover:bg-secondary/80" },
    { label: "+/-", action: () => {}, className: "bg-secondary hover:bg-secondary/80", disabled: true },
    
    { label: "0", action: () => handleAppend('0'), className: "bg-muted hover:bg-muted/80 col-span-2" },
    { label: ".", action: () => handleAppend('.'), className: "bg-muted hover:bg-muted/80" },
    { label: "=", action: calculate, className: "bg-primary text-primary-foreground hover:bg-primary/90" },
  ];

  return (
    <Card className="mt-4 border-0 shadow-none bg-transparent">
      <CardContent className="p-0 space-y-4">
        <div className="h-16 text-right pr-4 text-lg text-muted-foreground overflow-y-auto break-all">{history}</div>
        <div className="h-20 bg-muted rounded-md p-4 text-right text-4xl font-mono overflow-x-auto whitespace-nowrap">
          {displayValue}
        </div>
        <div className="grid grid-cols-5 gap-3">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              onClick={btn.action}
              className={cn("h-16 rounded-lg text-xl font-medium", btn.className)}
              disabled={btn.disabled}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
