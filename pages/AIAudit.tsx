import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const AIAudit: React.FC = () => {
    // We hide the global navbar and footer for this page to allow the audit to be full-screen
    useEffect(() => {
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');

        if (navbar) navbar.style.display = 'none';
        if (footer) footer.style.display = 'none';

        return () => {
            // Restore on unmount
            if (navbar) navbar.style.display = 'block';
            if (footer) footer.style.display = 'block';
        };
    }, []);

    return (
        <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-[#050614]">
            <SEO
                title="AI Audit | ClarityWorks Studio"
                description="Comprehensive AI readiness audit tool."
            />
            {/* 
        Below is the iframe pointing to your Vercel deployment of the AudcompAudit NEXT.js app.
        Replace 'https://audcompaudit.vercel.app' with the actual URL from Vercel!
      */}
            <iframe
                src="https://audcompaudit.vercel.app"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="AI Audit Application"
                allowFullScreen
            />
        </div>
    );
};

export default AIAudit;
