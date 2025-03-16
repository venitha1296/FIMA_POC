import * as XLSX from "xlsx";

export const exportJSON = (data: any, fileName: string = "data") => {
    if (!data || data.length === 0) {
        console.warn("No data available to export");
        return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Function to export JSON as an Excel (.xlsx) file
export const exportExcel = (data: any, fileName: string = "data") => {
    if (!data || typeof data !== "object") {
        console.warn("Invalid data format. Expected an object.");
        return;
    }

    try {
        const workbook = XLSX.utils.book_new();

        // Create main data worksheet if extracted_data exists
        if (data.extracted_data) {
            const mainDataWs = createMainDataWorksheet(data.extracted_data);
            if (mainDataWs) {
                XLSX.utils.book_append_sheet(workbook, mainDataWs, "Company Data");
            }

            // Create financial data worksheet if Financials exists
            if (data.extracted_data.Financials) {
                const financialWs = createFinancialWorksheet(data.extracted_data.Financials);
                if (financialWs) {
                    XLSX.utils.book_append_sheet(workbook, financialWs, "Financials");
                }
            }

            // Create shareholders worksheet if Shareholders exists and is not empty
            if (Array.isArray(data.extracted_data.Shareholders) && data.extracted_data.Shareholders.length > 0) {
                const shareholdersWs = createArrayWorksheet(
                    data.extracted_data.Shareholders,
                    "Shareholders",
                    ["name", "address"]
                );
                if (shareholdersWs) {
                    XLSX.utils.book_append_sheet(workbook, shareholdersWs, "Shareholders");
                }
            }

            // Create management worksheet if Management exists and is not empty
            if (Array.isArray(data.extracted_data.Management) && data.extracted_data.Management.length > 0) {
                const managementWs = createArrayWorksheet(
                    data.extracted_data.Management,
                    "Management",
                    ["name", "appointment_date", "termination_date", "address", "country_of_citizenship"]
                );
                if (managementWs) {
                    XLSX.utils.book_append_sheet(workbook, managementWs, "Management");
                }
            }
        }

        // Create metadata worksheet if metadata exists
        if (data.metadata) {
            const metadataWs = createMetadataWorksheet(data.metadata);
            if (metadataWs) {
                XLSX.utils.book_append_sheet(workbook, metadataWs, "Metadata");
            }
        }

        // Create downloads worksheet if downloaded_files exists
        if (data.downloaded_files?.length) {
            const downloadsWs = createDownloadsWorksheet(data.downloaded_files);
            if (downloadsWs) {
                XLSX.utils.book_append_sheet(workbook, downloadsWs, "Downloads");
            }
        }

        // Only save if we have at least one worksheet
        if (workbook.SheetNames.length > 0) {
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
        } else {
            console.warn("No data available to export to Excel");
        }
    } catch (error) {
        console.error("Error exporting Excel:", error);
    }
};

function createMetadataWorksheet(metadata: any) {
    try {
        const ws_data = [
            ["metadata"],
            [
                "input_parameters",
                "",
                "source",
                "payment_details",
                "",
                "",
                "request_status",
                "",
                ""
            ],
            [
                "company_name",
                "country",
                "",
                "transaction_id",
                "amount_paid",
                "timestamp",
                "success",
                "failure_reason",
                "request_timestamp"
            ],
            [
                metadata?.input_parameters?.company_name ?? "",
                metadata?.input_parameters?.country ?? "",
                metadata?.source ?? "",
                metadata?.payment_details?.transaction_id ?? "",
                metadata?.payment_details?.amount_paid ?? "",
                metadata?.payment_details?.timestamp ?? "",
                metadata?.request_status?.success ?? "",
                metadata?.request_status?.failure_reason ?? "",
                metadata?.request_status?.request_timestamp ?? ""
            ]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        applyStyles(worksheet);
        return worksheet;
    } catch (error) {
        console.error("Error creating metadata worksheet:", error);
        return null;
    }
}

function createMainDataWorksheet(data: any) {
    try {
        const sections = [
            "Basic Profile",
            "Contact Details",
            "Business Activities",
            "Subsidiaries & Legal Entities",
            "Share Capital",
            "Authorised Capital Breakdown",
            "Other Details"
        ];

        const ws_data: any[][] = [];
        sections.forEach(section => {
            if (data?.[section]) {
                ws_data.push([section]);
                const sectionData = data[section];
                Object.entries(sectionData).forEach(([key, value]) => {
                    if (value !== null && typeof value === 'object') {
                        // Skip objects as they will be in separate sheets
                        return;
                    }
                    ws_data.push([key, value ?? ""]);
                });
                ws_data.push([]); // Empty row between sections
            }
        });

        if (ws_data.length === 0) {
            return null;
        }

        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        applyStyles(worksheet);
        return worksheet;
    } catch (error) {
        console.error("Error creating main data worksheet:", error);
        return null;
    }
}

function createFinancialWorksheet(financials: any) {
    try {
        if (!financials) return null;

        const ws_data: any[][] = [["Financials"]];
        Object.entries(financials).forEach(([key, value]) => {
            ws_data.push([key, value ?? ""]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        applyStyles(worksheet);
        return worksheet;
    } catch (error) {
        console.error("Error creating financial worksheet:", error);
        return null;
    }
}

function createArrayWorksheet(data: any[], title: string, columns: string[]) {
    try {
        if (!Array.isArray(data) || data.length === 0) return null;

        const ws_data = [
            [title],
            columns,
            ...data.map(item => columns.map(col => item?.[col] ?? ""))
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        applyStyles(worksheet);
        return worksheet;
    } catch (error) {
        console.error(`Error creating ${title} worksheet:`, error);
        return null;
    }
}

function createDownloadsWorksheet(files: string[]) {
    try {
        const ws_data = [
            ["Downloaded Files"],
            ["No.", "File Path"],
            ...files.map((file, index) => [index + 1, file])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
        
        // Apply styles
        applyStyles(worksheet);
        
        // Set specific column widths for downloads
        worksheet['!cols'] = [
            { wch: 5 },  // No. column
            { wch: 100 } // File Path column
        ];

        return worksheet;
    } catch (error) {
        console.error("Error creating downloads worksheet:", error);
        return null;
    }
}

function applyStyles(worksheet: any) {
    const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } }
    };

    // Apply header styles
    if (worksheet['A1']) {
        worksheet['A1'].s = headerStyle;
    }

    // Set column widths
    worksheet['!cols'] = Array(20).fill({ wch: 30 });
}


