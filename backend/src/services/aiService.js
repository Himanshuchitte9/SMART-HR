// Mock AI Service until external API (OpenAI/Gemini) keys are provided
const { randomUUID } = require('crypto');

class AIService {
    constructor() {
        this.modelEndpoint = process.env.AI_MODEL_ENDPOINT || 'mock';
    }

    async screenResume(resumeText, jobDescription) {
        // Mock latency
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simple keyword matching mock
        const keywords = ['react', 'node', 'leadership', 'communication'];
        const score = Math.floor(Math.random() * 40) + 60; // 60-100 random score

        return {
            matchScore: score,
            summary: "Candidate shows strong potential based on initial screening.",
            missingSkills: ["Kubernetes", "GraphQL"],
            interviewQuestions: [
                "Explain your experience with Microservices.",
                "How do you handle conflict in a team?"
            ]
        };
    }

    async getRecommendations(candidateProfile, jobPostings) {
        // Return mock matching jobs
        return jobPostings.map(job => ({
            jobId: job._id,
            matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
            reason: "High overlap in skills."
        })).sort((a, b) => b.matchScore - a.matchScore);
    }

    async chat(message, context = {}) {
        // Context could include user role, current page, etc.
        const responses = [
            "I can help you with that HR policy.",
            "To request time off, go to the Employee Dashboard.",
            "Your current leave balance is 12 days.",
            "Please contact your manager for approval."
        ];
        return {
            reply: responses[Math.floor(Math.random() * responses.length)],
            suggestedActions: [
                { label: "View Policies", action: "/documents" },
                { label: "Contact HR", action: "/messages/hr" }
            ]
        };
    }
}

module.exports = new AIService();
