import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";

interface SandboxProps {
  code: string;
  setCode: (value: string) => void;
}

export const Sandbox: React.FC<SandboxProps> = ({ code, setCode }) => {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [editorHeight, setEditorHeight] = useState<string | number>("50vh");
  const [editorWidth, setEditorWidth] = useState<string | number>("90vw");

  useEffect(() => {
    setCode(
      "#######################################################################################################################################\n#                               *****      *****      *****      DEPLOYMATE      *****      *****      *****                          #\n#######################################################################################################################################\n\n # enter your code below:\n\n"
    );
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
      setEditorHeight(calculateHeight(window.innerHeight));
      setEditorWidth(calculateWidth(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    setEditorHeight(calculateHeight(screenHeight));
    setEditorWidth(calculateWidth(screenWidth));

    return () => window.removeEventListener("resize", handleResize);
  }, [screenHeight, screenWidth]);

  const calculateHeight = (height: number) => {
    if (height < 600) return "40vh";
    if (height < 800) return "50vh";
    return "60vh";
  };

  const calculateWidth = (width: number) => {
    if (width < 600) return "90vw";
    if (width < 1024) return "80vw";
    return "70vw";
  };

  return (
    <div className="flex justify-center items-center drop-shadow-xl">
      <div className="absolute inset-0 w-full h-screen bg-[#0095ff5c] rounded-full blur-3xl opacity-5 z-0" />
      <div className="relative z-10 gap-y-0 w-full flex justify-center items-center drop-shadow-2xl">
        <Box>
          <Editor
            height={editorHeight}
            width={editorWidth}
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              readOnly: false,
            }}
          />
        </Box>
      </div>
    </div>
  );
};
