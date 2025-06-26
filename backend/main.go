package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	genai "google.golang.org/genai"
)

type InterviewParams struct {
	Length   string   `json:"length"`
	Level    string   `json:"level"`
	Language []string `json:"language"`
}

// callGemini connects to the Gemini API and generates content based on the prompt.
func callGemini(prompt string) (string, error) {
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY environment variable not set")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		return "", fmt.Errorf("failed to create client: %w", err)
	}
	// The new SDK doesn't require an explicit Close() on the top-level client.

	resp, err := client.Models.GenerateContent(ctx, "gemini-1.5-flash", genai.Text(prompt), nil)
	if err != nil {
		return "", fmt.Errorf("failed to generate content: %w", err)
	}

	return resp.Text(), nil
}

func getInterviewQuestions(c *gin.Context) {
	var params InterviewParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	langs := strings.Join(params.Language, ",")
	// Use backticks for multi-line string
	prompt := fmt.Sprintf(`
	Generate exactly %d interview questions in %s for a %s level candidate. 
	Include a mix of behavioral and technical questions. 
	The technical questions can be LeetCode-style or commonly asked in interviews in these languages: %s.
	
	You MUST return the questions as a JSON array of strings. 
	DO NOT wrap your response in markdown or code blocks (e.g., no \\json, no random \, just a simple questions)
	Each string should be a standalone interview question.
	DO NOT include explanations, titles, categories, or extra formatting.
	Each item in the array must be a standalone interview question.
	The output MUST start with [ and end with ] — no other text.
	
	DO NOT include explanations, categories, markdown formatting, or extra text — only return the raw JSON array.
	DO NOT generate more or fewer than %d questions.
	`, params.Length, langs, params.Level, langs, params.Length)

	results, err := callGemini(prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call Gemini API: " + err.Error()})
		return
	}

	fmt.Println("Successfully generated content from Gemini.")
	c.JSON(http.StatusOK, gin.H{"results": results})
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	router := gin.Default()
	router.Use(cors.Default()) // Use default CORS for simplicity for now
	router.POST("/getInterview", getInterviewQuestions)

	log.Println("Server starting on port 8080...")
	router.Run(":8080")
}
