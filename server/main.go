package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/sashabaranov/go-openai"
)

type RequestBody struct {
	Code string `json:"code"`
}

type ResponseBody struct {
	Requirements []string `json:"requirements"`
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func main() {
	apiKey := os.Getenv("API_KEY")

	if apiKey == "" {
		panic("FAILURE: API KEY IS MISSING")
	}

	client := openai.NewClient(apiKey)

	http.HandleFunc("/api/generate-requirements", func(w http.ResponseWriter, r *http.Request) {
		enableCors(w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		var reqBody RequestBody
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusInternalServerError)
			return
		}

		err = json.Unmarshal(body, &reqBody)
		if err != nil {
			http.Error(w, "Failed to parse request body", http.StatusBadRequest)
			return
		}

		ctx := context.Background()

		msgPrefix := "List all the libraries needed to run the following Python code, formatted for a requirements.txt file. Return only the contents of the requirements.txt file:\n\n```python\n"
		msgSuffix := "\n```\n"
		msg := msgPrefix + reqBody.Code + msgSuffix

		outputBuilder := strings.Builder{}
		stream, err := client.CreateCompletionStream(ctx, openai.CompletionRequest{
			Model:       openai.GPT3Dot5TurboInstruct,
			Prompt:      msg,
			MaxTokens:   3000,
			Temperature: 0,
		})
		if err != nil {
			log.Fatalln(err)
		}
		defer stream.Close()

		for {
			response, err := stream.Recv()
			if err != nil {
				break
			}
			outputBuilder.WriteString(response.Choices[0].Text)
		}

		output := strings.TrimSpace(outputBuilder.String())

		requirements := strings.Split(output, "\n")
		for i := range requirements {
			requirements[i] = strings.TrimSpace(requirements[i])
		}

		respBody := ResponseBody{Requirements: requirements}
		respJSON, err := json.Marshal(respBody)
		if err != nil {
			http.Error(w, "Failed to create response", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		log.Println("Response:", string(respJSON))
		w.Write(respJSON)
	})

	fs := http.FileServer(http.Dir("../client/dist"))
	http.Handle("/", fs)

	log.Println("Server started on port: 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
