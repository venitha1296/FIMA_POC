import { useEffect, useState } from "react";

const CountryDropdown = () => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const token = localStorage.getItem("authToken"); // Retrieve token
                const response = await fetch("http://localhost:3001/api/agents/countries", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,  // Send token
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                console.log("data", data)
                setCountries(data);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };

        fetchCountries();
    }, []);

    return (
        <select>
            <option value="">Select Country</option>
            {countries.map((country:any) => (
                <option key={country._id} value={country._id}>
                    {country.name}
                </option>
            ))}
        </select>
    );
};

export default CountryDropdown;