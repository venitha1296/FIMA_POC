# Offer Letter Workflow - Complete Sequence Diagrams

## Overview
This document contains the complete sequence diagrams and flowcharts for the Offer Letter processing workflow in the SAP Ambassador API system.

> **Note**: To view the diagrams properly, open this file in:
> - GitHub/GitLab (automatic Mermaid rendering)
> - VS Code with Mermaid Preview extension
> - Any markdown viewer that supports Mermaid diagrams
> - Online Mermaid editor: https://mermaid.live/

## 1. Detailed Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client Application
    participant R as Express Router
    participant A as Authentication
    participant Ctrl as SAP Controller
    participant S as SAP Service
    participant SF as SuccessFactors API
    participant Upload as File Upload API
    participant DocMS as Document MS

    C->>R: POST /sap/v1/offerletter/initiate
    Note right of C: {offerLetterId}
    
    R->>A: authenticate(token)
    A-->>R: ✓ authenticated
    
    R->>A: validateRequest(schema)
    A-->>R: ✓ validated
    
    R->>Ctrl: initiateOfferLetter(req, res)
    Ctrl->>S: initiateOfferLetter(params)
    
    S->>S: fetchOfferLetter(offerLetterId)
    
    rect rgb(240, 248, 255)
        Note over S, SF: Fetch Offer Letter Data
        S->>SF: GET JobOffer data (with retry)
        SF-->>S: JobOffer response
        
        S->>S: getPerPersonalData(signatory names)
        S->>SF: GET PerPersonal data
        SF-->>S: Signatory email data
    end
    
    rect rgb(255, 248, 240)
        Note over S, Upload: File Analysis & placeholder detection
        S->>S: analyzeFileContent(base64Content)
        S->>S: convertBase64ToBuffer()
        S->>S: getFileType(buffer)
        
        S->>S: createPlaceholderPairs(placeholders)
    end
    
    S-->>S: Return analysis to fetchOfferLetter
    S-->>S: Return complete data to initiateOfferLetter
    
    rect rgb(248, 255, 248)
        Note over S, DocMS: Document Workflow Creation
        alt Has Placeholders
            S->>S: Prepare placeholder document data
            Note right of S: flowType: 'placeholder'<br/>documentBase64: converted file<br/>approvers with placeholders
            S->>DocMS: POST create workflow
            DocMS-->>S: Document workflow created
        else No Placeholders
            S->>Upload: getFileUrl(buffer, token, offerLetterId)
            S->>Upload: callUploadFileAPI(formData)
            Upload-->>S: File upload response with viewUrl
            S->>S: Prepare standard document data
            Note right of S: documents: [viewUrl]<br/>approvers list
            S->>DocMS: POST create workflow
            DocMS-->>S: Document workflow created
        end
    end
    
    S-->>Ctrl: Return documentId
    Ctrl-->>R: Success response with documentId
    R-->>C: HTTP 200 {documentId}
    
    Note over C, DocMS: Email notifications sent to approvers with signing workflow

```

## 2. Decision Flow Diagram

```mermaid
flowchart TD
    A["Client Request<br/>POST /sap/v1/offerletter/initiate"] --> B["Authentication &<br/>Validation"]
    B --> C["fetchOfferLetter from<br/>SuccessFactors"]
    
    C --> D["Get JobOffer Data<br/>with Retry Logic"]
    D --> E["Extract Signatory<br/>Information"]
    E --> F["Get Signatory<br/>Email Addresses"]
    F --> G["analyzeFileContent<br/>File Analysis"]
    
    G --> H{File Type<br/>Detection}
    H -->|PDF| I["convertPdfToDocx<br/>using Adobe PDF Services"]
    H -->|DOCX| J["Use Original<br/>DOCX Buffer"]
    
    I --> K["Extract Text &<br/>Placeholders from DOCX"]
    J --> K
    K --> L["Convert DOCX Buffer<br/>to Base64"]
    L --> M["Clean & Deduplicate<br/>Placeholders"]
    M --> N["Create Placeholder<br/>Pairs"]
    
    N --> O{Has<br/>Placeholders?}
    
    O -->|Yes| P["Prepare Placeholder<br/>Document Data"]
    P --> Q["flowType: 'placeholder'<br/>documentBase64: converted file<br/>approvers with placeholders"]
    Q --> R["Call Placeholder<br/>Document MS API"]
    
    O -->|No| S["Upload File to<br/>File Service"]
    S --> T["Get File View URL"]
    T --> U["Prepare Standard<br/>Document Data"]
    U --> V["documents: file URLs<br/>approvers list"]
    V --> W["Call Standard<br/>Document MS API"]
    
    R --> X["Create Document<br/>Workflow"]
    W --> X
    X --> Y["Return Document ID"]
    Y --> Z["Send Email Notifications<br/>to Approvers"]
    
    style I fill:#ffeeee
    style K fill:#eeffee
    style L fill:#ffffee
    style R fill:#eeeeff
    style W fill:#eeeeff
```

## 3. Simplified Process Flow

```mermaid
graph LR
    A[Start Request] --> B[Fetch Offer Letter]
    B --> C[Analyze File Type]
    C --> D{PDF or DOCX?}
    D -->|PDF| E[Convert to DOCX]
    D -->|DOCX| F[Use Original]
    E --> G[Extract Placeholders]
    F --> G
    G --> H{Has Placeholders?}
    H -->|Yes| I[Placeholder Workflow]
    H -->|No| J[Standard Workflow]
    I --> K[Return Document ID]
    J --> K
    K --> L[Send Notifications]
    
    style E fill:#ffcccc
    style G fill:#ccffcc
    style I fill:#ccccff
    style J fill:#ffffcc
```

## 4. Workflow Phases Breakdown

### Phase 1: Authentication & Data Retrieval
1. **API Call**: Client initiates with `offerLetterId`
2. **Authentication**: Token validation and request schema validation
3. **SAP Integration**: Fetch offer letter data from SuccessFactors with retry logic
4. **Signatory Data**: Retrieve signatory email addresses

### Phase 2: File Analysis & Conversion
1. **File Type Detection**: Magic byte analysis to identify PDF/DOCX
2. **PDF Conversion**: Convert PDF to DOCX using Adobe PDF Services (if needed)
3. **Text Extraction**: Extract placeholders from DOCX using Word text extractor
4. **Base64 Conversion**: Convert processed DOCX buffer to base64 for transmission
5. **Placeholder Processing**: Clean, deduplicate, and create placeholder pairs

### Phase 3: Document Workflow Creation

#### If Placeholders Exist:
- Create placeholder-based workflow with `documentBase64` containing converted DOCX
- Assign specific placeholders to each approver
- Call Placeholder Document Management Service

#### If No Placeholders:
- Upload file to File Service and get view URL
- Create standard document workflow with file URLs
- Call Standard Document Management Service

### Phase 4: Workflow Completion
1. **Document ID**: Return unique document identifier
2. **Email Notifications**: Trigger email notifications to all approvers
3. **Signing Process**: Approvers receive signing workflow based on document type

## 5. Key Features & Technical Details

### Automatic File Conversion
- **PDF to DOCX**: Uses Adobe PDF Services for high-quality conversion with structure preservation
- **Base64 Encoding**: Converted DOCX files are encoded as base64 for API transmission
- **Format Detection**: Magic byte analysis for accurate file type identification

### Smart Placeholder Management
- **Extraction**: Automatically detects signature placeholders in documents
- **Cleaning**: Removes duplicates and empty placeholders
- **Pairing**: Creates organized placeholder pairs for better workflow management

### Robust Error Handling
- **Retry Logic**: Automatic retries for SAP API calls with exponential backoff
- **Fallback Mechanisms**: Alternative processing paths for failed conversions
- **Graceful Degradation**: System continues operation even with partial failures

### Dual Workflow Support
- **Placeholder Workflows**: For documents requiring signature placeholders
- **Standard Workflows**: For documents without placeholders using file URLs
- **Dynamic Routing**: Automatically selects appropriate workflow based on content analysis

## 6. API Endpoints

### Main Endpoint
```
POST /sap/v1/offerletter/initiate
```

### Supporting Endpoints
```
GET /sap/v1/offerletter/fetch
GET /sap/v1/peremail/retrive
GET /sap/v1/perPersonal/retrive
POST /sap/v1/offerletter/convertToBase64
POST /sap/v1/offerletter/attachFile
```

## 7. Environment Variables Required

```env
SUCCESS_FACTOR_URL=<SuccessFactors API URL>
UPLOAD_FILE_URL=<File Upload Service URL>
DOCUMENT_CREATE_URL=<Standard Document Management URL>
DOCUMENT_PLACEHOLDER_CREATE_URL=<Placeholder Document Management URL>
```

## 8. How to View Diagrams

### For GitHub/GitLab:
1. Upload this file to your repository
2. View in the web interface - diagrams will render automatically
3. Use the "Raw" view to see the Mermaid source code

### For VS Code:
1. Install the "Mermaid Preview" extension
2. Open this file in VS Code
3. Use Ctrl+Shift+P → "Mermaid: Preview Current File"

### For Online Viewing:
1. Copy the Mermaid code (between ```mermaid and ```)
2. Paste into https://mermaid.live/
3. View and export as PNG/SVG

### For Documentation Sites:
- Most modern documentation platforms (GitBook, Notion, etc.) support Mermaid
- Copy the entire markdown file for full compatibility

---

*Generated on: {current_date}*

*System: SAP Ambassador API - Offer Letter Workflow* 
