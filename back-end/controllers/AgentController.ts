// AgentController.ts
//@ts-ignore
import { Request, Response } from "express";
import Country from "../models/Country";
import AgentRegistry from "../models/AgentRegistry";
import { sendSuccess, sendError, constantMessage } from '../utils/responseHandler';
import { constants } from "../config/config";
import axios from "axios";
import FileOutput from "../models/FileOutput";

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
            message: "Country is required",
            status: 400,
        };
    }

    return { isValid: true };
}

export async function fetchAgentsWithPagination(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const { country, search, type } = req.query; // Extract country, search query, and type from request
    let query: any = {
        is_failed: 0,      // Always include is_failed = 0
        is_deleted: false   // Always include is_delete = false
    };

    // Filter by type if provided
    if (type) {
        query.type = type;
    }

    // Filter by country if provided
    if (country) {
        query.country = country;
    }

    // Perform a partial search across multiple fields
    if (search) {
        query.$or = [
            { country: { $regex: search, $options: "i" } },
            { source_url: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } }
        ];
    }

    try {
        // Fetch agents with filtering, pagination, and populate file_output
        const agents = await AgentRegistry.find(query)
            .skip(skip)
            .limit(limit)
            .populate("file_output");

        const totalRecords = await AgentRegistry.countDocuments(query);
        const totalPages = Math.ceil(totalRecords / limit);

        const responseData = {
            agents,
            currentPage: page,
            totalPages,
            totalRecords,
        };

        // Use the custom success response.
        if (!res.headersSent) {
            return sendSuccess(res, responseData, constantMessage.AgentsFetchSuccess);
        }
    } catch (error: any) {
        console.error("Error fetching agents:", error);
        if (!res.headersSent) {
            return sendError(res, error.message, "Error fetching agents");
        }
    }
}


/**
 * Create a new agent request.
 * The agent is created with status "Processing".
 */
export async function sendAgentRequest(req: Request, res: Response) {
    // Validate the payload using the separate function
    const validationResult = validateAgentPayload(req.body);
    if (!validationResult.isValid) {
        return sendError(
            res,
            new Error(validationResult.message),
            validationResult.message,
            validationResult.status ?? 400
        );
    }
    // Destructure values from the payload
    const { type, company, country, source_url, researchFocus, keyword } = req.body;
    let requestId; // Declare requestId before try block

    try {
        // Create the new agent document with conditionally included fields
        const newAgent = new AgentRegistry({
            type,
            company,
            country: (type === constants.Corporate || type === constants.Web) ? country : undefined,
            source_url: source_url ?? null,
            status: constants.Processing,      // Set status as "Processing"
            request_time: new Date(),  // Record the request time
            response_time: null,       // Response time is not set yet
            is_failed: 0,
        });

        const savedAgent = await newAgent.save(); // MongoDB Save
        requestId = savedAgent._id; // Get the generated request ID
        console.log("requestId", requestId)
        const AI_WEBADDRESS = process.env.AI_WEBADDRESS as string;
        let URL = `${AI_WEBADDRESS}/api/thirdparty/mock-ai-status`;

        // Step 2: Send saved request ID to third-party API
        const thirdPartyResponse = await axios.post(URL, {
            requestId,  // Send requestId to third party
            company,
            country,
            keyword
        }
        );
        console.log("thirdPartyResponse", thirdPartyResponse.data)

        // Step 3: If third-party confirms success, return success response
        if (thirdPartyResponse.data.status === "success") {
            if (!res.headersSent) {
                return sendSuccess(res, { requestId }, constantMessage.RequestInitiateSuccess, 201);
            }
        } else {
            // Step 4: If third-party fails, update `is_failed = 1` and set status = "Failed"
            await AgentRegistry.findByIdAndUpdate(requestId, {
                status: "Failed",
                is_failed: 1
            });

            if (!res.headersSent) {
                return sendError(res, "", "Request failed", 400);
            }
        }
    } catch (error: any) {
        console.error("Error processing agent:", error.message);
        // If an error occurs, mark it as failed
        await AgentRegistry.findByIdAndUpdate(requestId, {
            status: "Failed",
            is_failed: 1
        });
        if (!res.headersSent) {
            return sendError(res, error.message, "Error processing agent");
        }
    }
}

/**
 * Validates the OTP request payload
 */
function validateOTPPayload(payload: any): ValidationResult {
    const { requestId, otp } = payload;

    if (!requestId) {
        return {
            isValid: false,
            message: "Request ID is required",
            status: 400
        };
    }

    if (!otp) {
        return {
            isValid: false,
            message: "OTP is required",
            status: 400
        };
    }

    // Validate requestId format (MongoDB ObjectId is 24 characters hexadecimal)
    if (!/^[0-9a-fA-F]{24}$/.test(requestId)) {
        return {
            isValid: false,
            message: "Invalid Request ID format",
            status: 400
        };
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
        return {
            isValid: false,
            message: "OTP must be 6 digits",
            status: 400
        };
    }

    return { isValid: true };
}

export async function receiveOTP(req: Request, res: Response) {
    try {
        // Validate input
        const validationResult = validateOTPPayload(req.body);
        if (!validationResult.isValid) {
            return sendError(
                res,
                new Error(validationResult.message),
                validationResult.message,
                validationResult.status ?? 400
            );
        }

        const { requestId, otp } = req.body;

        // Step 1: Find request
        const agent = await AgentRegistry.findById(requestId);
        if (!agent) {
            return sendError(res, "", "Agent not found", 404);
        }

        // Step 2: Update OTP
        agent.otp = otp;
        await agent.save();

        if (!res.headersSent) {
            return sendSuccess(res, { requestId, otp }, constantMessage.OTPSuccess);
        }
    } catch (error: any) {
        console.error("Error storing OTP:", error);
        if (!res.headersSent) {
            return sendError(res, error.message, "Error storing OTP", 500);
        }
    }
}

/** 3. Third API - Receive Final Output and Mark as Completed */
export async function logAIResponse(req: Request, res: Response) {
    try {
        const {requestId} = req.params;
        console.log("requestId", requestId)
        const { fileOutputData } = req.body;

        if (!requestId) {
            sendError(res, "", "Agent not found", 404);
        }

        // Step 1: Find request
        const agent = await AgentRegistry.findById(requestId);
        if (!agent) {
            return sendError(res, "", "Agent not found", 404);
        }

        // Step 2: Save the received JSON content as a new FileOutput document
        const fileOutput = new FileOutput({
            data: fileOutputData,  // Store received JSON content
        });

        const savedFileOutput = await fileOutput.save();

        // Step 3: Update the agent record with file_output ID and mark as completed
        agent.file_output = savedFileOutput._id;
        console.log(fileOutputData.metadata.source)
        if (fileOutputData?.metadata?.source) {
            agent.source_url = fileOutputData.metadata.source;
        }
        agent.status = "Completed";
        agent.response_time = new Date();

        await agent.save();

        if (!res.headersSent) {
            return sendSuccess(res, { requestId, fileOutputId: savedFileOutput._id }, "Request processed successfully");
        }
    } catch (error: any) {
        console.error("Error processing final output:", error);
        if (!res.headersSent) {
            return sendError(res, error.message, "Error processing final output");
        }
    }
}

/**
 * Create a new agent request.
 * The agent is created with status "Processing".
 */
export async function deleteAgent(req: Request, res: Response): Promise<Response> {
    try {
        const agent = await AgentRegistry.findByIdAndUpdate(
            req.params.id,
            { is_deleted: true },
            { new: true }
        );

        if (!agent) {
            return sendError(res, new Error("Agent not found"), "No agent found with the provided ID", 404);
        }

        return sendSuccess(res, agent, constantMessage.RequestDeleteSuccess, 200);
    } catch (err: any) {
        return sendError(res, err.message, "Error marking agent as deleted");
    }
}

export const checkAgentStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    // Find the agent request by requestId
    const agentRequest = await AgentRegistry.findByIdAndUpdate(requestId);

    if (!agentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Agent request not found'
      });
    }

    // Return the current status and data
    return res.status(200).json({
      success: true,
      data: {
        status: agentRequest.status,
      }
    });

  } catch (error) {
    console.error('Error checking agent status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while checking agent status'
    });
  }
};

export const getAgentOutputById = async (req: Request, res: Response) => {
    try {
      const { requestId } = req.params;
  
      // Find the agent request by requestId
      const agentRequest = await AgentRegistry.findByIdAndUpdate(requestId).populate("file_output");
  
      if (!agentRequest) {
        return res.status(404).json({
          success: false,
          message: 'Agent request not found'
        });
      }
  
      // Return the current status and data
      return res.status(200).json({
        success: true,
        data: {
          status: agentRequest.status,
          agentOutput: agentRequest
        }
      });
  
    } catch (error) {
      console.error('Error checking agent status:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while checking agent status'
      });
    }
  };