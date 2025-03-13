
// AgentController.ts
//@ts-ignore
import { Request, Response } from "express";
import Country from "../models/Country";
import AgentRegistry from "../models/AgentRegistry";
import { sendSuccess, sendError } from '../utils/responseHandler';
import { constants } from "../config/config";

export interface ValidationResult {
    isValid: boolean;
    message?: string;
    status?: number;
}

export async function upsertCountries(req: Request, res: Response) {
    const countries = [
        { name: "United States", code: "US" },
        { name: "India", code: "IN" },
        { name: "Canada", code: "CA" },
        { name: "United Kingdom", code: "GB" },
        { name: "Australia", code: "AU" },
    ];
    try {
        const bulkOps = countries.map(country => ({
            updateOne: {
                filter: { code: country.code }, // Match by country code
                update: { $set: country }, // Update name if exists
                upsert: true, // Insert if not found
            },
        }));

        await Country.bulkWrite(bulkOps);
        res.status(200).json({ message: "Countries inserted/updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error inserting/updating countries", error });
    }
}

export async function fetchCountries(req: Request, res: Response) {
    try {
        const countries = await Country.find().sort({ name: 1 });
        if (!res.headersSent) {
            res.status(200).json(countries);
        }
    } catch (error: any) {
        if (!res.headersSent) {
            res.status(500).json({ error: error });
        }
    }
}

export async function insertCountry(req: Request, res: Response) {
    try {
        const { name, code } = req.body;
        if (!name || !code) {
            return res.status(400).json({ error: "Name and Code are required" });
        }
        const newCountry = new Country({ name, code });
        await newCountry.save();
        res.status(201).json(newCountry);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

/**
 * Validates the agent payload.
 * - Checks that type and company are provided.
 * - Validates that type is one of the allowed types.
 * - For Corporate Registry Agent and Web Research Media Agent, country is required.
 */
export function validateAgentPayload(payload: any): ValidationResult {
    const { type, company, country } = payload;

    if (!type || !company) {
        return {
            isValid: false,
            message: "Type and company are required",
            status: 400,
        };
    }

    const validTypes = [
        "Corporate Registry Agent",
        "Financial Data Agent",
        "Web Research Media Agent",
    ];
    if (!validTypes.includes(type)) {
        return {
            isValid: false,
            message:
                "Type must be one of: Corporate Registry Agent, Financial Data Agent, Web Research Media Agent",
            status: 400,
        };
    }

    // For Corporate Registry Agent and Web Research Media Agent, country is required.
    if (
        (type === constants.Corporate || type === constants.Web) &&
        !country
    ) {
        return {
            isValid: false,
            message: "Country is required for Corporate Registry Agent and Web Research Media Agent",
            status: 400,
        };
    }

    return { isValid: true };
}

export async function fetchAgentsWithPagination(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        // Populate the file_output_id to fetch data from the file_outputs collection
        const agents = await AgentRegistry.find()
            .skip(skip)
            .limit(limit)
            .populate("file_output_id");

        const totalRecords = await AgentRegistry.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit);

        const responseData = {
            agents,
            currentPage: page,
            totalPages,
            totalRecords,
        };

        // Use the custom success response.
        if (!res.headersSent) {
            return sendSuccess(res, responseData, 'Agents fetched successfully!');
        }
    } catch (error) {
        console.error('Error fetching agents:', error);
        if (!res.headersSent) {
            return sendError(res, error, 'Error fetching agents');
        }
    }
}

/**
 * Create a new agent request.
 * The agent is created with status "Processing".
 */
export async function createAgent(req: Request, res: Response): Promise<Response> {
    // Validate the payload using the separate function
    const validationResult = validateAgentPayload(req.body);
    if (!validationResult.isValid) {
        return sendError(
            res,
            new Error(validationResult.message),
            validationResult.message,
            validationResult.status || 400
        );
    }
    // Destructure values from the payload
    const { type, company, country, source_url } = req.body;

    try {
        // Create the new agent document with conditionally included fields
        const newAgent = new AgentRegistry({
            type,
            company,
            country: (type === constants.Corporate || type === constants.Web) ? country : undefined,
            source_url: type === constants.Web ? source_url : undefined,
            status: constants.Processing,      // Set status as "Processing"
            request_time: new Date(),  // Record the request time
            response_time: null,       // Response time is not set yet
        });

        await newAgent.save();
        return sendSuccess(res, newAgent, "Agent request created successfully", 201);
    } catch (error) {
        console.error("Error creating agent:", error);
        return sendError(res, error, "Error creating agent request");
    }
}

/**
 * Update an agent with AI output.
 * This function sets the source_doc_link (from AI output) and updates the status to "Completed",
 * while also recording the response time.
 *
 * Expected to receive agentId as a URL parameter.
 */
export async function updateAgentWithOutput(req: Request, res: Response): Promise<Response> {
    const { agentId } = req.params; // Expecting URL: /api/agents/:agentId/output
    const { source_doc_link } = req.body; // AI third-party output

    if (!source_doc_link) {
        return sendError(
            res,
            new Error("Missing third-party output"),
            "Source doc link is required",
            400
        );
    }

    try {
        // Update the agent: set the source_doc_link, change status to "Completed", and record response_time
        const updatedAgent = await AgentRegistry.findByIdAndUpdate(
            agentId,
            {
                source_doc_link,
                status: constants.Completed,
                response_time: new Date(),
            },
            { new: true }
        );

        if (!updatedAgent) {
            return sendError(
                res,
                new Error("Agent not found"),
                "No agent found with the provided id",
                404
            );
        }

        return sendSuccess(res, updatedAgent, "Agent updated with AI output successfully", 200);
    } catch (error) {
        console.error("Error updating agent:", error);
        return sendError(res, error, "Error updating agent");
    }
}