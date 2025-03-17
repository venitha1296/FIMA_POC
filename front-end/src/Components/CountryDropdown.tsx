import { useState, useRef, useEffect } from "react";
import Select from "react-select";

interface CountryOption {
    value: string;
    label: string;
    code: string;
}

interface CountryDropdownProps {
    countries: CountryOption[];
    onSelectCountry: (country: CountryOption | null) => void;
}

const CountryDropdown = ({ countries, onSelectCountry }: CountryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (selectedOption: CountryOption | null) => {
        setSelectedCountry(selectedOption);
        onSelectCountry(selectedOption);
        setIsOpen(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    console.log("selectedCountry1", selectedCountry)

    return (
        <div className="position-relative" ref={dropdownRef}>
            {/* Button to open dropdown */}
            <button
                className="btn btn-outline-primary d-flex align-items-center"
                onClick={toggleDropdown}
            >
                <i className="bi bi-filter"></i> {selectedCountry ? selectedCountry.label : "Filter by Country"}
            </button>

            {/* Custom Dropdown */}
            {isOpen && (
                <div className="dropdown-menu show p-2" style={{ width: "250px" }}>
                    <Select
                        options={countries}
                        value={selectedCountry} // Ensure this is correctly maintained
                        onChange={handleSelect}
                        placeholder="Search Country"
                        isSearchable
                        isClearable
                        autoFocus
                        menuIsOpen={isOpen} // Bind this to state instead of forcing true
                        onMenuClose={() => setIsOpen(false)} // Ensure this does not reset selection
                    />

                </div>
            )}
        </div>
    );
};

export default CountryDropdown;
