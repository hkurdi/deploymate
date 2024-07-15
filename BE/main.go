package main

import (
	"bufio"
	"context"
	"log"
	"os"
	"strings"

	"github.com/sashabaranov/go-openai"
	"github.com/spf13/viper"
)

func main() {
	viper.SetConfigFile(".env")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Error reading .env file: %v", err)
	}
	apiKey := viper.GetString("API_KEY")

	if apiKey == "" {
		panic("FAILURE: API KEY IS MISSING")
	}

	ctx := context.Background()
	client := openai.NewClient(apiKey)

	const inputFile = "./input_with_code.txt"
	file, err := os.Open(inputFile)
	if err != nil {
		log.Fatalf("Failed to open file: %v", err)
	}
	defer file.Close()

	fileBytes := new(strings.Builder)
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		fileBytes.WriteString(scanner.Text() + "\n")
	}
	if err := scanner.Err(); err != nil {
		log.Fatalf("Failed to read file: %v", err)
	}

	msgPrefix := "List all the libraries needed to run the following Python code, formatted for a requirements.txt file. Return only the contents of the requirements.txt file:\n\n```python\n"
	msgSuffix := "\n```\n"
	msg := msgPrefix + fileBytes.String() + msgSuffix

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
	const outputFile = "./requirements.txt"
	err = os.WriteFile(outputFile, []byte(output), os.ModePerm)
	if err != nil {
		log.Fatalf("Error: Failed to write file: %v", err)
	}
}
