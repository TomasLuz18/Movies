// Section.tsx

import React from "react";
import Display from "./Display";
import "../styles/FilterBar.css"; // Importa o CSS

interface SectionProps {
    heading: string;
    apiEndpoint?: string; // pode ser undefined
    moviesOn?: boolean;
    tvShowOn?: boolean;
    numberOfMedia?: number;
    filters?: {
        genre: number | null;
        certification: string | null;
        year: number | null;
    };
}

const Section: React.FC<SectionProps> = ({
    heading,
    apiEndpoint,
    moviesOn = true,
    tvShowOn = false,
    numberOfMedia = 10,
    filters,
}) => {
    return (
        <div className="section-container">
            <Display
                apiEndPoint={apiEndpoint ?? ""}
                itemHeading={heading}
                showButtons={true}
                moviesOn={moviesOn}
                tvShowOn={tvShowOn}
                numberOfMedia={numberOfMedia}
                filters={filters}
            />
        </div>
    );
};

export default Section;