import { useEffect, useState } from "react";

import { Button } from "../components/ui/button";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css";
import { Sandbox } from "../components/ui/sandbox";
import { NavBar } from "../components/navbar";

export const LandingPage = () => {
  const [code, setCode] = useState<string>("");
  const [isCodeValid, setCodeValid] = useState<boolean>(false);
  const [requirements, setRequirements] = useState<string[]>([]);

  useEffect(() => {
    if (code) {
      Prism.highlightAll();
    }
  }, [code]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSetCode = async () => {
    document.getElementById("requirements")?.scrollIntoView();
    const deployMateHeader =
      "#######################################################################################################################################\n#                               *****      *****      *****      DEPLOYMATE      *****      *****      *****                          #\n#######################################################################################################################################\n\n # enter your code below:\n\n";
    let cleanedCode = code;

    if (code.includes(deployMateHeader)) {
      const cleanedCode = code.replace(deployMateHeader, "");
      setCode(cleanedCode);
    }

    const MAX_TOKENS = 3000; 
    if (cleanedCode.length > MAX_TOKENS) {
      cleanedCode = cleanedCode.substring(0, MAX_TOKENS);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/generate-requirements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setCodeValid(true);
        setRequirements(result.requirements);
      } else {
        console.log("Failed to fetch server response.");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleDownloadRequirement = async () => {
    console.log("download logic");
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(code + text);
    } catch (error) {
      console.error("Failed to read clipboard contents: ", error);
    }
  };

  return (
    <div className="relative">
      <div className="bg-[#f4eaea] min-h-screen overflow-x-hidden">
        <NavBar />
        <section className="flex flex-col items-center justify-center text-black font-mono">
          <h2 className="text-2xl py-10">Step 1: Insert your code here:</h2>
          <Sandbox setCode={setCode} code={code} />
          <div className="flex flex-row gap-10 mt-4 z-20">
            <Button
              variant="outline"
              onClick={handlePasteCode}
              className="w-64 rounded-lg bg-white text-black"
            >
              Paste Code
            </Button>
            <Button
              variant="outline"
              onClick={handleSetCode}
              className="w-64 rounded-lg bg-white text-black"
            >
              Generate
            </Button>
          </div>
        </section>
        <section
          id="requirements"
          className="min-h-screen flex flex-col items-center justify-center text-black font-mono"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold">
              {isCodeValid
                ? requirements.join("\n")
                : "Please enter valid code."}
            </h1>
          </div>
          <div className="flex flex-row gap-10 mt-4 z-20 pt-20">
            <Button
              variant="outline"
              onClick={handleDownloadRequirement}
              className="w-64 rounded-lg bg-white text-black"
            >
              Download Requirements.txt
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
