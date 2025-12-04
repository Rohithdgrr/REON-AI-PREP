
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
    },
    "Bank": {
        title: "Official Websites for Bank Jobs",
        description: "Bank jobs in India are primarily recruited through centralized bodies like IBPS (for public sector banks), SBI (direct for its branches), and RBI (central banking roles).",
        nested: {
            "IBPS": {
                title: "IBPS (Institute of Banking Personnel Selection)",
                description: "Handles recruitment for 20+ public sector banks (e.g., PNB, BoB, Canara Bank). Types: PO, Clerk, SO, RRB (rural banks).",
                resources: [
                    { resource: "Notifications", link: "https://www.ibps.in/crp-rrbs-xiv/", metadata: "Latest: CRP RRB XIV (2025) for 12,294 RRB posts (Clerk, PO, SO). Includes eligibility (age 18-30, grad/12th pass), syllabus, exam dates (Prelims Dec 6-14). Bilingual PDFs; filter by post type/category." },
                    { resource: "Application", link: "https://www.ibps.in/apply-online", metadata: "Online via OTR (One-Time Registration). For RRB XIV, closed Sep 28, 2025; fee ₹175 (SC/ST/PWD free). Corrections Oct 6-7. Filters: State/post preferences." },
                    { resource: "Admit Cards", link: "https://www.ibps.in/call-letters", metadata: "RRB Clerk Prelims out (Nov 30, 2025); download via reg no./DOB. Includes center/shift details. Filter by exam stage (Prelims/Mains)." },
                    { resource: "Results", link: "https://www.ibps.in/results", metadata: "Clerk Prelims out (Nov 20, 2025); scorecards with cut-offs (e.g., General 70-80). Filter by category/region." },
                    { resource: "Main Portal", link: "https://www.ibps.in", metadata: "Central hub; careers section for all CRP (Common Recruitment Process). Helpline: 022-25300046." }
                ]
            },
            "SBI": {
                title: "SBI (State Bank of India)",
                description: "Direct recruitment for SBI branches (26,000+ outlets). Types: Clerk (Junior Associate), PO, SO, Circle-Based Officer (CBO).",
                resources: [
                    { resource: "Notifications", link: "https://sbi.co.in/web/careers/current-openings", metadata: "Latest: Clerk 2025 (6589 vacancies, notification Aug 5). Eligibility: Age 20-28, grad/12th. Exam dates: Mains Nov 21. Filter by post (Clerk/PO), state." },
                    { resource: "Application", link: "https://sbi.co.in/web/careers/apply-online", metadata: "For Clerk 2025, closed Aug 26; fee ₹750 (SC/ST free). Includes photo/signature upload. Filters: State preference during apply." },
                    { resource: "Admit Cards", link: "https://sbi.co.in/web/careers/call-letters", metadata: "Clerk Mains out (Nov 14, 2025); download via reg no./DOB. Includes reporting time/center. Filter by exam phase." },
                    { resource: "Results", link: "https://sbi.co.in/web/careers/recruitment-results", metadata: "Clerk Prelims out (Nov 4, 2025); cut-offs (e.g., General 65-75). Provisional lists; filter by category/state." },
                    { resource: "Main Portal", link: "https://sbi.co.in/web/careers", metadata: "Careers page for all jobs. Helpline: 022-22820427." }
                ]
            },
            "RBI": {
                title: "RBI (Reserve Bank of India)",
                description: "Central bank roles; no zones (national). Types: Grade B (DR-General/DEPR/DSIM), Assistant.",
                resources: [
                    { resource: "Notifications", link: "https://opportunities.rbi.org.in/Scripts/Vacancies.aspx", metadata: "Grade B 2025 (120 posts, notification Sep 10). Eligibility: Age 21-30, grad (60%). Phase II Dec 6-7. Filter by cadre (General/DEPR)." },
                    { resource: "Application", link: "https://ibpsreg.ibps.in/rbioaug25/", metadata: "Closed Sep 30, 2025; fee ₹850 (SC/ST free). OTR-based. Filters: Cadre/post preferences." },
                    { resource: "Admit Cards", link: "https://opportunities.rbi.org.in/Scripts/callletter.aspx", metadata: "Phase II out (Nov 28, 2025); download via reg no./password. Includes guidelines. No regional filters." },
                    { resource: "Results", link: "https://opportunities.rbi.org.in/Scripts/results.aspx", metadata: "Phase I out (Nov 11, 2025); roll nos. in PDF. Cut-offs (General ~66). Filter by phase." },
                    { resource: "Main Portal", link: "https://www.rbi.org.in/Scripts/BS_ViewBulletin.aspx", metadata: "Opportunities@RBI section. Helpline: 022-22602200." }
                ]
            }
        }
    },
    "Railway": {
        title: "Official Websites for Railway Jobs (RRB/RRC)",
        description: "Indian Railways has 21 RRBs (for Group C: NTPC, JE, ALP, Technician) and 16 RRCs (for Group D: Trackman, Helper, Apprentice).",
        nested: {
            "Centralized": {
                title: "Centralized Portal (All RRBs/RRCs)",
                description: "For pan-India notifications/applications.",
                resources: [
                    { resource: "Notifications", link: "https://indianrailways.gov.in/railwayboard/view_section.jsp?lang=0&id=0,1,304,366,537", metadata: "CEN 06/2025 (NTPC Graduate, 3058 posts); CEN 07/2025 (NTPC UG, 5810 posts). Eligibility: Age 18-33, 12th/grad. Filter by post/level." },
                    { resource: "Application", link: "https://www.rrbapply.gov.in", metadata: "NTPC 2025 closed Nov 27; fee ₹500 (SC/ST free). Zone preferences (1st-5th). Filters: Category/post." },
                    { resource: "Admit Cards", link: "https://www.rrbapply.gov.in", secondaryLink: "regional redirect", metadata: "Group D out (Dec 3, 2025); NTPC soon. Download via reg no./DOB. Filter by CEN/exam." },
                    { resource: "Results", link: "https://indianrailways.gov.in", secondaryLink: "RRB-specific", metadata: "NTPC CBT-1 expected Jan 2026. Filter by category/zone." },
                    { resource: "Main Portal", link: "https://indianrailways.gov.in", metadata: "Ministry site; links to all RRBs/RRCs. Helpline: 139." }
                ]
            },
            "RRB Regions": {
                title: "RRB Regions (21 Boards for Group C Jobs)",
                description: "Apply via regional site after central notification. Filters: Zone-specific vacancies (e.g., South: Tamil Nadu/Kerala).",
                resources: [
                    { resource: "Ahmedabad", link: "https://www.rrbahmedabad.gov.in", metadata: "Gujarat | NTPC: 500+ posts; Group D CBT ongoing." },
                    { resource: "Ajmer", link: "https://rrbajmer.gov.in", metadata: "Rajasthan | JE 2025 notification soon; filters for desert regions." },
                    { resource: "Bengaluru", link: "https://www.rrbbnc.gov.in", metadata: "Karnataka, Kerala (part) | NTPC UG: 800 posts; admit cards for CBT-1." },
                    { resource: "Bhopal", link: "https://rrbbhopal.gov.in", metadata: "Madhya Pradesh | ALP vacancies 2025; category filters." },
                    { resource: "Bhubaneswar", link: "https://www.rrbbbs.gov.in", metadata: "Odisha | Group D results pending; eastern zone focus." },
                    { resource: "Bilaspur", link: "https://www.rrbbilaspur.gov.in", metadata: "Chhattisgarh | Technician posts; Ex-SM quotas." },
                    { resource: "Chandigarh", link: "https://www.rrbcdg.gov.in", metadata: "Punjab, Haryana, J&K, Ladakh | NTPC Graduate: 400 posts; northern filters." },
                    { resource: "Chennai", link: "https://rrbchennai.gov.in", metadata: "Tamil Nadu, Kerala (part) | Ministerial CEN 07/2025; southern vacancies." },
                    { resource: "Gorakhpur", link: "https://rrbgkp.gov.in", metadata: "UP (east), Bihar (part) | Group D admit cards out." },
                    { resource: "Guwahati", link: "https://www.rrbguwahati.gov.in", metadata: "Assam, NE states | NTPC: 300 posts; tribal area filters." },
                    { resource: "Jammu-Srinagar", link: "https://rrbjammu.nic.in", metadata: "J&K | Special PWD quotas." },
                    { resource: "Kolkata", link: "https://www.rrbkolkata.gov.in", metadata: "West Bengal | SO/JE notifications." },
                    { resource: "Malda", link: "https://rrcmalda.gov.in", metadata: "Bihar (part), Jharkhand (part) | Apprentice drives." },
                    { resource: "Mumbai", link: "https://www.rrbmumbai.gov.in", metadata: "Maharashtra, Goa | Clerk-cum-Typist posts." },
                    { resource: "Muzaffarpur", link: "https://rrcmuzaffarpur.gov.in", metadata: "Bihar (north) | Group D focus." },
                    { resource: "Patna", link: "https://www.rrbpatna.gov.in", metadata: "Bihar | NTPC CBT schedule." },
                    { resource: "Ranchi", link: "https://rrbranchi.gov.in", metadata: "Jharkhand | Provisional panels out." },
                    { resource: "Secunderabad", link: "https://rrbsecunderabad.gov.in", metadata: "Telangana, AP (part) | Paramedical CEN 03/2025." },
                    { resource: "Siliguri", link: "https://www.rrbsiliguri.gov.in", metadata: "Sikkim, WB (north) | Technician vacancies." },
                    { resource: "Thiruvananthapuram", link: "https://rrbthiruvananthapuram.gov.in", metadata: "Kerala, Lakshadweep | No Group D vacancies; NTPC UG." }
                ]
            },
            "RRC Regions": {
                title: "RRC Regions (16 Cells for Group D/Apprentice Jobs)",
                description: "For Level-1 posts (e.g., Trackman, Helper). Filters: Divisional vacancies within zones.",
                 resources: [
                    { resource: "Ahmedabad (WR)", link: "https://www.rrc-wr.com", metadata: "Western Railway | Apprentice notification soon." },
                    { resource: "Bengaluru (SWR)", link: "https://www.rrchubli.in", metadata: "South Western Railway | Group D CBT till Dec 5." },
                    { resource: "Bhopal (WCR)", link: "https://wcr.indianrailways.gov.in", metadata: "West Central Railway | 500+ helpers." },
                    { resource: "Bilaspur (SECR)", link: "https://secr.indianrailways.gov.in", metadata: "South East Central Railway | Track maintainer posts." },
                    { resource: "Chennai (SR)", link: "https://sr.indianrailways.gov.in", metadata: "Southern Railway | Apprentice 2025." },
                    { resource: "Gorakhpur (NER)", link: "https://ner.indianrailways.gov.in", metadata: "North Eastern Railway | Level-1 vacancies." },
                    { resource: "Guwahati (NFR)", link: "https://nfr.indianrailways.gov.in", metadata: "Northeast Frontier Railway | Gateman roles." },
                    { resource: "Kolkata (ER)", link: "https://er.indianrailways.gov.in", metadata: "Eastern Railway | Pointsman filters." },
                    { resource: "Mumbai (CR)", link: "https://cr.indianrailways.gov.in", metadata: "Central Railway | Group D admit cards." },
                    { resource: "Patna (ECR)", link: "https://ecr.indianrailways.gov.in", metadata: "East Central Railway | Trackman vacancies." },
                    { resource: "Ranchi (SER)", link: "https://ser.indianrailways.gov.in", metadata: "South Eastern Railway | Apprentice drives." },
                    { resource: "Secunderabad (SCR)", link: "https://scr.indianrailways.gov.in", metadata: "South Central Railway | Group D ongoing." }
                ]
            }
        }
    }
};
