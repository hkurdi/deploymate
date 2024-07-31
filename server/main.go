package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/sashabaranov/go-openai"
)

type RequestBody struct {
	Code string `json:"code"`
}

type ResponseBody struct {
	Requirements []string `json:"requirements"`
}

func enableCors(c *fiber.Ctx) error {
	c.Set("Access-Control-Allow-Origin", os.Getenv("DEPLOYMATE_FE_DOMAIN"))
	c.Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	c.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if c.Method() == fiber.MethodOptions {
		return c.SendStatus(fiber.StatusOK)
	}
	return c.Next()
}

func main() {
	apiKey := os.Getenv("API_KEY")

	if apiKey == "" {
		panic("FAILURE: API KEY IS MISSING")
	}

	client := openai.NewClient(apiKey)

	app := fiber.New()

	app.Use(enableCors)

	app.Post("/api/generate-requirements", func(c *fiber.Ctx) error {
		var reqBody RequestBody
		if err := c.BodyParser(&reqBody); err != nil {
			return c.Status(fiber.StatusBadRequest).SendString("Failed to parse request body")
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
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to create response")
		}

		log.Println("Response:", string(respJSON))
		return c.JSON(respBody)
	})

	app.Static("/", "../client/dist")

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server started on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
