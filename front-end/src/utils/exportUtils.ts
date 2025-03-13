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
    if (!data || data.length === 0) {
        console.warn("No data available to export");
        return;
    }

    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save the file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
