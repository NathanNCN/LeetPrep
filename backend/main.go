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

type results struct {
	Questions []string `json:"questions"`
	Answers   []string `json:"answers"`
}

// callGemini connects to the Gemini API and generates content based on the prompt.
func callGemini(prompt string) (string, error) {
	ctx := context.Background()
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GEMINI_API_KEY environment variable not set error")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		return "", fmt.Errorf("failed to create client: %w", err)
	}
	// The new SDK doesn't require an explicit Close() on the top-level client.

	resp, err := client.Models.GenerateContent(ctx, "gemini-2.5-pro", genai.Text(prompt), nil)
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

	// Debug logging
	fmt.Printf("Received params: Length=%s, Level=%s, Language=%v\n", params.Length, params.Level, params.Language)

	// Use backticks for multi-line string
	langs := strings.Join(params.Language, ",")
	prompt := fmt.Sprintf(`
	Generate EXACTLY %s interview questions in %s for a %s level candidate. 
	Include a mix of behavioral and technical questions. 
	The technical questions can be LeetCode-style or commonly asked in interviews in these languages: %s.
	In each coding question, refer to varaibles names like (e.g arr, num, graph, etc)
	Include any relevant constraints in the question.
	Avoid repetitive questions.

	You MUST return the questions as a JSON array of pairs. 
	Each pair must be in the form: ["code" or "notcode", "question string"].

	Only use "code" for questions that require actual coding or problem solving. 
	Use "notcode" for all other questions (e.g. behavioral, theory, comparison, etc.).

	You MUST return only the JSON array. 
	DO NOT wrap the output in markdown or code blocks. 
	DO NOT include explanations, titles, or categories.

	The output MUST start with [ and end with ] — no other text.
	REMEMBER: DO NOT generate more or fewer than %s questions.
	`, params.Length, langs, params.Level, langs, params.Length)

	results, err := callGemini(prompt)
	if err != nil {
		log.Printf("Gemini API error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to call Gemini API: " + err.Error()})
		return
	}

	fmt.Println("Successfully generated content from Gemini.")
	c.JSON(http.StatusOK, gin.H{"results": results})
}

func getInterviewResults(c *gin.Context) {
	var response results

	// Debug: Log the raw request body without consuming it
	//fmt.Printf("Content-Type: %s\n", c.GetHeader("Content-Type"))
	fmt.Printf("Content-Length: %s\n", c.GetHeader("Content-Length"))

	if err := c.ShouldBindJSON(&response); err != nil {
		fmt.Printf("JSON binding error: %v\n", err)
		fmt.Printf("Response struct: %+v\n", response)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	fmt.Printf("Parsed response: Questions=%v, Answers=%v\n", response.Questions, response.Answers)

	// Use backticks for multi-line string
	prompt := fmt.Sprintf(`
		You are given two arrays:

		- questions: %v  
		- answers: %v  

		Each index in answers corresponds to the same index in questions.

		Return a JSON array where each element is a list in the following format:
		["question", "user answer", "feedback", rating (1–10), "link to a helpful resource"]

		At the very end of the array, include one final element in this format:
		[overall rating (1–10), technical rating (1–10), behavioral rating (1–10)]

		Rules:
		- Ratings must be integers from 1 to 10.
		- Feedback should be specific, constructive, and directly evaluate the given answer.
		- Use high-quality public resources (official docs, guides, tutorials).
		- Judge technical answers more rigorously than behavioral ones.

		You MUST return only the JSON array.
		DO NOT include any explanations, formatting, markdown, or extra output.
		The response MUST start with [ and end with ] — no other text.
		`, response.Questions, response.Answers)

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
	router.POST("{backend}/getInterview", getInterviewQuestions)
	router.POST("/getResults", getInterviewResults)

	log.Println("Server starting on port 8081...")
	router.Run(":8081")
}
