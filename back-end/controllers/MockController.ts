//@ts-ignore
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { logAIResponse } from "./AgentController";

// First API: Returns success or failure message
export const getMockResponse = async (req: Request, res: Response) => {
    try {
        console.log("Received request:", req.body);
        return res.status(200).json({
            success: true,
            status: 'success',
            message: "Mock AI response success",
            data: {
                requestId: req.body.requestId || "mock-request-id",
                status: "success",
                result: "Mock AI processing completed"
            }
        });
    } catch (error) {
        console.error("Error in getMockResponse:", error);
        return res.status(500).json({
            success: false,
            status: 'error',
            message: "Internal server error"
        });
    }
};

export const getMockApiData = async (req: Request, res: Response) => {
    try {
        // Define the file path - using absolute path from project root
        const filePath = path.resolve(__dirname, "../exports/final.json");

        console.log("Resolved file path:", filePath);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error(`File not found at path: ${filePath}`);
            return res.status(404).json({
                success: false,
                status: "error",
                message: "Mock data file not found",
            });
        }

        // Read the JSON file
        const rawData = fs.readFileSync(filePath, "utf8");

        // Parse the JSON data
        const jsonData = JSON.parse(rawData);
        const requestId = '67d29a90e2f32e29a2350a98';

        // Call the logAIResponse function to store JSON in the database
        await logAIResponse({
            body: { requestId, fileOutputData: jsonData },
        } as Request, res);
    } catch (error: any) {
        console.error("Error reading final.json:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            success: false,
            status: "error",
            message: `Failed to read static JSON file: ${errorMessage}`,
        });
    }
};





