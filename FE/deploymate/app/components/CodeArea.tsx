"use client";

import React, { useState, ChangeEvent } from "react";

export const CodeArea = () => {
    const [code, setCode] = useState("");
    const [isCodeValid, setCodeValid] = useState(false);
    const [requirements, setRequirements] = useState("");

    const handleCodeInput = async (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);

        try {
            const response = await fetch("/api/SaveCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: e.target.value }),
            });

            if (!response.ok) {
                console.error("Failed to save code");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSetCode = async () => {
        if (code !== "") {
            try {
                const response = await fetch('/api/RunGoServer', {
                    method: 'POST',
                });

                if (response.ok) {
                    const result = await response.json();
                    setRequirements(result.message);
                    setCodeValid(true);
                } else {
                    console.error('Failed to run Go server');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setCodeValid(false);
        }
    };

    return (
        <div className="relative min-h-screen items-center justify-center flex flex-col">
            <div className="gap-y-7 w-64">
                <textarea
                    id="code"
                    placeholder="Enter your code here.."
                    onChange={handleCodeInput}
                    className="w-full h-full flex flex-1 text-black"
                    required
                />
            </div>
            <button onClick={handleSetCode} className="w-24 mt-4 text-black rounded-lg bg-white">Test</button>
            <br />
            <h1>{isCodeValid ? requirements : "Please enter valid code."}</h1>
        </div>
    );
};
