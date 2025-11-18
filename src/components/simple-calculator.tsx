
"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { ChevronsRightLeft } from "lucide-react";

export function SimpleCalculator() {
  const [expression, setExpression] = useState("");
  const [displayValue, setDisplayValue] = useState("0");
  const [history, setHistory] = useState("");
  const [isDeg, setIsDeg] = useState(true);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleAppend = (val: string) => {
    if (displayValue === "Error") {
      setExpression(val);
      setDisplayValue(val);
      return;
    }
    setExpression((prev) => prev + val);
    setDisplayValue((prev) => (prev === "0" && val !== "." ? val : prev + val));
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
    if (n < 0 || n !== Math.floor(n)) return NaN; // Factorial is for non-negative integers
    if (n > 170) return Infinity; // Prevent performance issues
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  const calculate = () => {
    if (!expression) return;
    try {
      let evalExpr = expression
        .replace(/π/g, `(${String(Math.PI)})`)
        .replace(/e/g, `(${String(Math.E)})`)
        .replace(/\^/g, "**")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/sin\(/g, isDeg ? `Math.sin(Math.PI/180*` : "Math.sin(")
        .replace(/cos\(/g, isDeg ? `Math.cos(Math.PI/180*` : "Math.cos(")
        .replace(/tan\(/g, isDeg ? `Math.tan(Math.PI/180*` : "Math.tan(")
        .replace(/%/g, "/100");

      // Handle factorial with regex, ensuring it's not part of a number
      evalExpr = evalExpr.replace(/(\d+)!/g, (_, num) => String(factorial(parseInt(num))));
      
      // eslint-disable-next-line no-eval
      let result = eval(evalExpr);

      if (!isFinite(result)) throw new Error("Result is not finite");

      result = Number(result.toPrecision(15));
      
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

  const buttonStyle = "h-14 rounded-lg text-xl font-medium";

  const numBtn = cn(buttonStyle, "bg-muted hover:bg-muted/80 text-foreground");
  const opBtn = cn(buttonStyle, "bg-secondary hover:bg-secondary/80 text-foreground");
  const funcBtn = cn(buttonStyle, "bg-primary/10 hover:bg-primary/20 text-primary");
  const specialBtn = cn(buttonStyle, "bg-primary/20 hover:bg-primary/30 text-primary");


  return (
    <Card className="mt-4 border-0 shadow-none bg-transparent">
      <CardContent className="p-0 space-y-4">
        <div className="h-16 text-right pr-4 text-xl text-muted-foreground overflow-y-auto break-words">{history}</div>
        <div className="h-20 bg-muted rounded-md p-4 text-right text-5xl font-mono overflow-x-auto whitespace-nowrap">
          {displayValue}
        </div>
        <div className={cn("grid gap-3", isAdvanced ? "grid-cols-5" : "grid-cols-4")}>
          {isAdvanced && (
            <>
              <Button onClick={() => handleAppend('sin(')} className={funcBtn}>sin</Button>
              <Button onClick={() => handleAppend('cos(')} className={funcBtn}>cos</Button>
              <Button onClick={() => handleAppend('tan(')} className={funcBtn}>tan</Button>
              <Button onClick={() => handleAppend('log(')} className={funcBtn}>log</Button>
              <Button onClick={() => handleAppend('ln(')} className={funcBtn}>ln</Button>
              <Button onClick={() => handleAppend('^')} className={funcBtn}>xʸ</Button>
              <Button onClick={() => handleAppend('√(')} className={funcBtn}>√</Button>
              <Button onClick={() => handleAppend('!')} className={funcBtn}>n!</Button>
              <Button onClick={() => handleAppend('π')} className={funcBtn}>π</Button>
              <Button onClick={() => handleAppend('e')} className={funcBtn}>e</Button>
              <Button onClick={toggleDeg} className={cn(funcBtn, "text-xs")}>{isDeg ? 'DEG' : 'RAD'}</Button>
              <Button onClick={() => handleAppend('%')} className={funcBtn}>%</Button>
              <Button onClick={() => handleAppend('(')} className={specialBtn}>(</Button>
              <Button onClick={() => handleAppend(')')} className={specialBtn}>)</Button>
            </>
          )}
          
          <Button onClick={clearAll} className={cn(buttonStyle, "bg-destructive/80 text-destructive-foreground hover:bg-destructive/90")}>C</Button>
          <Button onClick={backspace} className={cn(buttonStyle, "bg-destructive/80 text-destructive-foreground hover:bg-destructive/90")}>⌫</Button>
          <Button onClick={() => setIsAdvanced(!isAdvanced)} className={opBtn}><ChevronsRightLeft className={cn("transition-transform", isAdvanced && "rotate-180")} /></Button>
          <Button onClick={() => handleAppend('/')} className={opBtn}>÷</Button>
          
          <Button onClick={() => handleAppend('7')} className={numBtn}>7</Button>
          <Button onClick={() => handleAppend('8')} className={numBtn}>8</Button>
          <Button onClick={() => handleAppend('9')} className={numBtn}>9</Button>
          <Button onClick={() => handleAppend('*')} className={opBtn}>×</Button>
          
          <Button onClick={() => handleAppend('4')} className={numBtn}>4</Button>
          <Button onClick={() => handleAppend('5')} className={numBtn}>5</Button>
          <Button onClick={() => handleAppend('6')} className={numBtn}>6</Button>
          <Button onClick={() => handleAppend('-')} className={opBtn}>-</Button>
          
          <Button onClick={() => handleAppend('1')} className={numBtn}>1</Button>
          <Button onClick={() => handleAppend('2')} className={numBtn}>2</Button>
          <Button onClick={() => handleAppend('3')} className={numBtn}>3</Button>
          <Button onClick={() => handleAppend('+')} className={opBtn}>+</Button>
          
          <Button onClick={() => handleAppend('0')} className={cn(numBtn, "col-span-2")}>0</Button>
          <Button onClick={() => handleAppend('.')} className={numBtn}>.</Button>
          <Button onClick={calculate} className={cn(buttonStyle, "bg-primary text-primary-foreground hover:bg-primary/90")}>=</Button>
        </div>
      </CardContent>
    </Card>
  );
}
