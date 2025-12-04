
export const officialSitesData = {
    "SSC": {
        title: "SSC CHSL & CGL Resources",
        description: "The primary official portal is the centralized SSC website, which handles all national-level processes. Regional sites provide localized admit cards/results.",
        resources: [
            {
                resource: "Notifications",
                link: "https://ssc.gov.in/notifications",
                metadata: "Official recruitment notices for CHSL/CGL 2025. Includes eligibility, syllabus, exam dates. Download PDFs; bilingual (English/Hindi)."
            },
            {
                resource: "Application",
                link: "https://ssc.gov.in/apply-online",
                metadata: "Online form submission portal via One-Time Registration (OTR). Requires photo/signature upload; fee: ₹100 (general)."
            },
            {
                resource: "Admit Cards",
                link: "https://ssc.gov.in/admit-cards",
                metadata: "Download Tier 1 hall tickets using registration ID/DOB. Regional links are available on this page. Carry photo ID."
            },
            {
                resource: "Results",
                link: "https://ssc.gov.in/results",
                metadata: "Tier 1 results expected January 2026; includes cut-offs, marks. View via roll number. Bilingual PDFs."
            },
            {
                resource: "Main Portal",
                link: "https://ssc.gov.in",
                metadata: "Central hub for all SSC exams. Features exam calendar, FAQs, contact info. Old site (ssc.nic.in) redirects here."
            }
        ]
    },
    "UPSC": {
        title: "UPSC Resources",
        description: "UPSC's main site covers Civil Services (CSE) and other exams. Use upsconline.nic.in for applications and admit cards.",
        resources: [
            {
                resource: "Notifications",
                link: "https://upsc.gov.in/examinations/notifications",
                metadata: "CSE 2025 notification expected Feb 2025. Details age, attempts, and vacancies. Downloadable PDFs in English/Hindi."
            },
            {
                resource: "Application",
                link: "https://upsconline.nic.in",
                metadata: "OTR-based forms for all UPSC exams. Requires scanned documents. Fee is typically ₹100 for general category."
            },
            {
                resource: "Admit Cards",
                link: "https://upsc.gov.in/e-admit-cards",
                secondaryLink: "https://upsconline.nic.in/eadmitcard",
                metadata: "Download admit cards via RID/roll no./DOB. Includes exam center details. Printout is mandatory."
            },
            {
                resource: "Results",
                link: "https://upsc.gov.in/examinations/results",
                metadata: "View Prelims, Mains, and Final results. Includes marks and interview lists for successful candidates."
            },
            {
                resource: "Main Portal",
                link: "https://upsc.gov.in",
                metadata: "Comprehensive site with annual reports, court judgments, and 'What's New' section. Helpline: 011-23385271."
            }
        ]
    },
    "GATE": {
        title: "GATE Resources",
        description: "GATE is organized by a different IIT each year. The GOAPS portal is used for most processes.",
        resources: [
            {
                resource: "Notifications",
                link: "https://gate2025.iitr.ac.in/notifications.html",
                metadata: "GATE 2025 brochure (released Aug 2024) contains details on 30 papers, eligibility, and exam dates. Score valid for 3 years."
            },
            {
                resource: "Application",
                link: "https://goaps.iitr.ac.in",
                secondaryLink: "https://goaps.iitg.ac.in",
                metadata: "Registration via GOAPS portal of the organizing IIT (e.g., IIT Roorkee for 2025, IIT Guwahati for 2026). Fee approx. ₹1800."
            },
            {
                resource: "Admit Cards",
                link: "https://goaps.iitr.ac.in",
                metadata: "Released in early January. Download via enrollment ID/password. Includes center and shift details."
            },
            {
                resource: "Results",
                link: "https://gate2025.iitr.ac.in/results.html",
                metadata: "Results typically declared in mid-March. Scorecard available for download for a limited period."
            },
            {
                resource: "Main Portal",
                link: "https://gate2025.iitr.ac.in",
                metadata: "Official site hosted by the organizing IIT. Features mock tests, syllabus, and contact info (e.g., gate2025@iitr.ac.in)."
            }
        ]
    },
    "PSU": {
        title: "PSU & Other Government Exams",
        description: "PSUs recruit via GATE or direct exams. There is no single portal; monitor individual company websites, especially after GATE results.",
        resources: [
            {
                resource: "Notifications",
                link: "https://www.ntpc.co.in/careers",
                secondaryLink: "https://iocl.com/peoplecareers",
                metadata: "Check individual 'Careers' pages of PSUs like NTPC, IOCL, ONGC, BHEL, GAIL, PGCIL. Notifications for GATE-based recruitment appear Jan-Mar."
            },
            {
                resource: "Application",
                link: "https://et.ntpc.co.in",
                secondaryLink: "https://www.iocl.com/apply",
                metadata: "Applications are post-GATE results (March-June). Requires GATE score upload. Fees vary (₹500-1000)."
            },
            {
                resource: "Admit Cards",
                link: "https://www.ntpc.co.in/admit-card",
                metadata: "For GD/Interview stages (post-shortlist, April-May). Downloaded from the respective company's portal."
            },
            {
                resource: "Results",
                link: "https://www.ntpc.co.in/results",
                secondaryLink: "https://www.ongcindia.com/web/eng/results",
                metadata: "Shortlists and final merit lists are published on individual PSU websites."
            },
            {
                resource: "Main Portal",
                link: "https://engineering.careers360.com/articles/psu-recruitment-through-gate",
                metadata: "No central portal exists. Use aggregators like Careers360 or track the GATE site's PSU section for linked recruitments."
            }
        ]
    }
};
