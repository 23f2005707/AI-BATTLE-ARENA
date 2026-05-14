import { StateGraph, StateSchema, START, END, type GraphNode, type CompiledStateGraph } from "@langchain/langgraph";

import { z } from "zod";
import { geminiModel, groqModel, mistralAIModel } from "./model.ai.js";

import { HumanMessage } from "@langchain/core/messages"


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

    const [mistralResponse, groqResponse] = await Promise.all([

        mistralAIModel.invoke(state.problem),
        groqModel.invoke(state.problem),

    ])

    return {
        solution_1: mistralResponse.content as string,
        solution_2: groqResponse.content as string,
    }
}


// Create the Judge Node
const judgeNode: GraphNode<typeof state> = async (state) => {

    const { problem, solution_1, solution_2 } = state;

    // using gemini model as the judge to evaluate data format.
    const schema = z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reasoning: z.string(),
        solution_2_reasoning: z.string()
    });

    // wrap module with structured output 
    const judge = geminiModel.withStructuredOutput(schema);

    const result = await judge.invoke(`
            You are a judge tasked with evaluating two solutions.

            Problem: ${problem}

            Solution 1:
            ${solution_1}

            Solution 2:
            ${solution_2}

            Evaluate based on:
            - correctness
            - clarity
            - efficiency

            Return scores out of 10 and reasoning.

            `)
        console.log(result);

    // structured response of the data returned by the judge agent
    const {
        solution_1_score,
        solution_2_score,
        solution_1_reasoning,
        solution_2_reasoning
    } = result;

    return {
        judge: {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning
        }
    }
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