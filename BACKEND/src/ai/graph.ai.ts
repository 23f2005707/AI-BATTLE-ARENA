import { StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph } from "@langchain/langgraph";

import { z } from "zod";
import { cohereModel, groqJudgeModel, groqModel, mistralAIModel } from "./model.ai.js";

const getTextContent = (content: unknown): string => {
    if (typeof content === "string") {
        return content;
    }

    if (Array.isArray(content)) {
        return content
            .map((block) => {
                if (typeof block === "string") return block;
                if (block && typeof block === "object" && "text" in block) {
                    return String(block.text);
                }
                return "";
            })
            .join("")
            .trim();
    }

    return String(content ?? "");
};


// Create the State Schema
const state = new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    })
});


// Create the Solution Node 
const solutionNode: GraphNode<typeof state> = async (state) => {

    const [mistralResult, cohereResult] = await Promise.allSettled([
        mistralAIModel.invoke(`Answer this user question clearly and directly. Include useful code examples when appropriate.\n\nQuestion: ${state.problem}`),
        cohereModel.invoke(`Answer this user question clearly and directly. Include useful code examples when appropriate.\n\nQuestion: ${state.problem}`),
    ]);

    const solution1 = mistralResult.status === "fulfilled"
        ? getTextContent(mistralResult.value.content)
        : "Solution 1 is temporarily unavailable.";

    let solution2 = cohereResult.status === "fulfilled"
        ? getTextContent(cohereResult.value.content)
        : "";

    if (!solution2) {
        if (cohereResult.status === "rejected") {
            console.error("Cohere solution failed:", cohereResult.reason);
        }

        try {
            const fallbackResponse = await groqModel.invoke(
                `Answer this user question clearly and directly. Include useful code examples when appropriate.\n\nQuestion: ${state.problem}`
            );
            solution2 = getTextContent(fallbackResponse.content);
        } catch (error) {
            console.error("Fallback solution failed:", error);
            solution2 = "Solution 2 is temporarily unavailable.";
        }
    }

    return {
        solution_1: solution1,
        solution_2: solution2,
    }
}


// Create the Judge Node
const judgeNode: GraphNode<typeof state> = async (state) => {

    const { problem, solution_1, solution_2 } = state;

    const evaluateSolution = async (solution: string, solutionNumber: number) => {
        try {
            const response = await groqJudgeModel.invoke(`
                Evaluate solution ${solutionNumber} for the problem below.
                Score correctness, clarity, and efficiency from 0 to 10.
                Return valid JSON only with exactly these fields: score and reasoning.
                Example: {"score": 8, "reasoning": "Correct and clearly explained."}
                Reasoning must be one short sentence of no more than 15 words.

                Problem: ${problem}
                Solution ${solutionNumber}: ${solution}
            `);

            const text = getTextContent(response.content)
                .replace(/^```json\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();
            const result = JSON.parse(text) as { score?: unknown; reasoning?: unknown };
            const score = Number(result.score);

            if (!Number.isFinite(score) || score < 0 || score > 10 || typeof result.reasoning !== 'string') {
                throw new Error('Judge returned an invalid score payload');
            }

            return {
                score,
                reasoning: result.reasoning
            };
        } catch (error) {
            console.error(`Judge failed for solution ${solutionNumber}:`, error);
            return {
                score: 0,
                reasoning: 'Judge unavailable for this solution.'
            };
        }
    };

    const [solution1Judge, solution2Judge] = await Promise.all([
        evaluateSolution(solution_1, 1),
        evaluateSolution(solution_2, 2)
    ]);

    return {
        judge: {
            solution_1_score: solution1Judge.score,
            solution_2_score: solution2Judge.score,
            solution_1_reasoning: solution1Judge.reasoning,
            solution_2_reasoning: solution2Judge.reasoning
        }
    };
}


// Create the Graph 
const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile()


export default async function (problem: string) {

    const result = await graph.invoke({
        problem: problem
    })

    return result;
}