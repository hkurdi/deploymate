import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css";
import { Sandbox } from "../components/ui/sandbox";
import { NavBar } from "../components/navbar";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";

export const LandingPage = () => {
  const [code, setCode] = useState<string>("");
  const [isCodeValid, setCodeValid] = useState<boolean>(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const deployMateHeader =
  "#######################################################################################################################################\n#                               *****      *****      *****      DEPLOYMATE      *****      *****      *****                          #\n#######################################################################################################################################\n\n # enter your code below:\n\n";


  useEffect(() => {
    if (code) {
      Prism.highlightAll();
    }
  }, [code]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSetCode = async () => {
    document.getElementById("requirements")?.scrollIntoView({ behavior: 'smooth' });
  
    if (!code.trim()) {
      setRequirements(["Please enter valid code above."]);
      setCodeValid(false);
      return;
    }
  
    let cleanedCode = code;
    if (code === deployMateHeader) {
      setRequirements(["Please enter valid code."]);
      setCodeValid(false);
      return;
    }
  
    if (!cleanedCode) {
      setRequirements(["Please enter valid code."]);
      setCodeValid(false);
      return;
    }
  
    const MAX_TOKENS = 3000; 
    if (cleanedCode.length > MAX_TOKENS) {
      cleanedCode = cleanedCode.substring(0, MAX_TOKENS);
    }
  
    try {
      const response = await fetch(`${process.env.DEPLOYMATE_API_URL}/api/generate-requirements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: cleanedCode }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setCodeValid(true);
        setRequirements(result.requirements);
      } else {
        setRequirements(["Failed to fetch server response."]);
        setCodeValid(false);
      }
    } catch (error) {
      console.error("Error: ", error);
      setRequirements(["An error occurred while processing your request."]);
      setCodeValid(false);
    }
  };
  

  const handleDownloadRequirement = async () => {
    const element = document.createElement("a");
    const file = new Blob([requirements.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "requirements.txt";
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element); 
  }

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(code + text);
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
  };

  const handleAgainButton = () => {
    window.scrollTo({ top: 0 });
    setCode(deployMateHeader);
    setCodeValid(false);
    setRequirements([]);
  };

  return (
    <div className="relative">
      <div className="bg-[#f4eaea] min-h-screen overflow-x-hidden">
        <NavBar />
        <section className="flex flex-col items-center justify-center font-mono text-black">
          <h2 className="py-10 text-2xl">insert your code here.</h2>
          <Sandbox setCode={setCode} code={code} />
          <div className="z-20 flex gap-10 mt-4">
            <Button
              variant="outline"
              onClick={handlePasteCode}
              className="w-64"
            >
              Paste Code
            </Button>
            <Button
              variant="outline"
              onClick={handleSetCode}
              className="w-64"
            >
              Generate
            </Button>
          </div>
        </section>
        <section
          id="requirements"
          className="flex flex-col items-center justify-center min-h-screen font-mono text-black"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-bold">
                {isCodeValid ? "Requirements.txt" : "Please enter valid code."}
              </CardTitle>
            </CardHeader>
            <CardContent className='flex items-center py-4'>
              <Textarea 
                value={isCodeValid ? requirements.join("\n") : ""}
                className="w-full resize-none"
                rows={10}
                readOnly
              />
            </CardContent>
            <CardFooter className="flex items-center gap-4 py-10">
              <Button
                variant="default"
                onClick={handleDownloadRequirement}
                className="flex-1"
              >
                Download Requirements.txt
              </Button>
              <Button
                variant="default"
                onClick={handleAgainButton}
                className="flex-1"
              >
                Generate Another
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
};
