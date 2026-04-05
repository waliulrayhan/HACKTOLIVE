import {
  FiActivity,
  FiAlertTriangle,
  FiBookOpen,
  FiCpu,
  FiDatabase,
  FiFlag,
  FiGlobe,
  FiLock,
  FiMonitor,
  FiRadio,
  FiSearch,
  FiServer,
  FiShield,
  FiTarget,
  FiUsers,
  FiWifi,
  FiZap,
} from 'react-icons/fi'
import { IconType } from 'react-icons'

export type ServiceCategoryId =
  | 'penetration-testing'
  | 'assessments-audits'
  | 'soc-forensics'
  | 'training-academy'

export interface ServiceCategory {
  id: ServiceCategoryId
  label: string
  heading: string
  description: string
}

export interface ServiceMethodologyStep {
  title: string
  description: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

export interface ServiceKpi {
  value: string
  label: string
  source: string
}

export type ServiceBadgeTone =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'neutral'

export interface Service {
  id: string
  slug: string
  title: string
  icon: IconType
  categoryId: ServiceCategoryId
  badge?: string
  badgeTone?: ServiceBadgeTone
  imageUrl: string
  shortDescription: string
  overview: string
  challenge: string
  timeline: string
  engagementModel: string
  approach: string[]
  outcomes: string[]
  deliverables: string[]
  idealFor: string[]
  methodology: ServiceMethodologyStep[]
  kpis: ServiceKpi[]
  faqs: ServiceFaq[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'penetration-testing',
    label: 'Penetration Testing',
    heading: 'Offensive Security Assessments',
    description:
      'Adversary-style testing across web, network, mobile, and human attack surfaces to uncover exploitable paths before threat actors do.',
  },
  {
    id: 'assessments-audits',
    label: 'Assessments & Audits',
    heading: 'Governance, Risk, and Assurance',
    description:
      'Evidence-driven risk, policy, and control assessments that support leadership decisions, compliance readiness, and measurable improvement.',
  },
  {
    id: 'soc-forensics',
    label: 'SOC & Forensics',
    heading: 'Detection, Response, and Investigation',
    description:
      'Round-the-clock monitoring and deep investigation support to reduce attacker dwell time and improve response confidence.',
  },
  {
    id: 'training-academy',
    label: 'Training & Academy',
    heading: 'Hands-On Capability Building',
    description:
      'Practical, role-based cybersecurity learning experiences built for teams, future practitioners, and security leaders.',
  },
]

export const serviceHighlights = [
  { value: '300+', label: 'Security Engagements' },
  { value: '50K+', label: 'Learners Trained' },
  { value: '95%', label: 'Client Renewal Rate' },
  { value: '24/7', label: 'Incident Coverage' },
]

export const serviceTrustPillars = [
  {
    title: 'Practitioner Led Delivery',
    description: 'Every engagement is led by active security practitioners with real incident and offensive testing experience.',
  },
  {
    title: 'Global Standards',
    description: 'Threat modeling and testing aligned to Bangladesh realities while mapped to NIST, OWASP, and ISO best practices.',
  },
  {
    title: 'Actionable Reporting',
    description: 'Findings are prioritized by exploitability and business impact, with clear guidance for engineering teams.',
  },
  {
    title: 'End-to-End Support',
    description: 'From validation to retest, we stay engaged until risks are reduced and controls are proven.',
  },
]

export const services: Service[] = [
  {
    id: 'external-penetration-testing',
    slug: 'external-penetration-testing',
    title: 'External Penetration Testing',
    icon: FiGlobe,
    categoryId: 'penetration-testing',
    badge: 'Offensive',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/external-penetration-testing-cyber/1600/900',
    shortDescription:
      'Simulate internet-facing attacks against your perimeter to validate how exposed assets can be discovered and compromised.',
    overview:
      'Our external penetration tests emulate motivated attackers targeting your public-facing systems, APIs, VPN gateways, mail servers, and cloud edges. We move beyond scanner output by chaining weaknesses into realistic attack paths and documenting business impact clearly.',
    challenge:
      'Internet-facing systems are continuously probed by bots and human adversaries. A single misconfiguration or weak workflow can become an entry point to your internal environment.',
    timeline: '2 to 4 weeks depending on scope size',
    engagementModel: 'Black-box, gray-box, or targeted attack simulation',
    approach: [
      'Asset discovery and external attack surface mapping',
      'Manual validation of exploitability and privilege boundaries',
      'Business logic and authentication abuse testing',
      'Executive and technical reporting with remediation priorities',
    ],
    outcomes: [
      'Validate whether perimeter controls resist modern attack techniques',
      'Identify exposed assets and weak entry points before attackers',
      'Reduce breach likelihood through prioritized remediation',
    ],
    deliverables: [
      'Executive summary with risk heatmap',
      'Technical findings with proof-of-impact evidence',
      'Prioritized remediation roadmap',
      'Retest support to verify closure of critical risks',
    ],
    idealFor: [
      'Organizations with internet-facing platforms or APIs',
      'Enterprises preparing for audits or board reviews',
      'Teams launching new products or major releases',
    ],
    methodology: [
      { title: 'Recon', description: 'Map domains, services, and exposed technology stack with passive and active recon.' },
      { title: 'Attack Simulation', description: 'Attempt exploitation chains across auth, configuration, and known CVE pathways.' },
      { title: 'Impact Validation', description: 'Demonstrate realistic business impact with controlled proof scenarios.' },
      { title: 'Report & Retest', description: 'Deliver prioritized findings and validate remediation effectiveness.' },
    ],
    kpis: [
      { value: '81%', label: 'Breaches involve external actors', source: 'Verizon DBIR 2025' },
      { value: '89%', label: 'Financially motivated attacks', source: 'Verizon DBIR 2025' },
      { value: '16%', label: 'Initial access via phishing', source: 'IBM Cost of a Data Breach 2025' },
      { value: '97%', label: 'Identity attacks involve password abuse', source: 'Microsoft Digital Defense Report 2025' },
    ],
    faqs: [
      {
        question: 'Will this test disrupt production systems?',
        answer:
          'Testing is executed in a controlled manner with approved rules of engagement, clear escalation contacts, and low-risk validation steps for sensitive systems.',
      },
      {
        question: 'How often should external testing be performed?',
        answer:
          'At minimum annually, and always after major infrastructure changes, cloud migrations, or significant feature launches.',
      },
    ],
  },
  {
    id: 'internal-penetration-testing',
    slug: 'internal-penetration-testing',
    title: 'Internal Penetration Testing',
    icon: FiServer,
    categoryId: 'penetration-testing',
    badge: 'Offensive',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/internal-penetration-testing-cyber/1600/900',
    shortDescription:
      'Assess lateral movement, privilege escalation, and segmentation weaknesses from an assumed internal foothold.',
    overview:
      'Internal tests simulate post-compromise scenarios where an attacker already has limited network access. We evaluate Active Directory security, endpoint hardening, segmentation, and paths to crown-jewel systems.',
    challenge:
      'Many organizations invest heavily in perimeter security but under-prioritize internal controls. Once inside, attackers often move quickly through weak privilege and trust relationships.',
    timeline: '2 to 5 weeks depending on network size',
    engagementModel: 'Compromised workstation simulation or authenticated internal test',
    approach: [
      'Map trust relationships and privilege boundaries',
      'Assess AD misconfigurations and identity weaknesses',
      'Validate segmentation and east-west movement resistance',
      'Document remediation actions that reduce blast radius',
    ],
    outcomes: [
      'Improve resilience against insider and post-breach threats',
      'Reduce lateral movement opportunities',
      'Strengthen identity and endpoint security controls',
    ],
    deliverables: [
      'Attack path narrative from foothold to critical assets',
      'Technical evidence of exploitable control gaps',
      'Hardening checklist for identity and segmentation',
      'Optional remediation workshop with IT and security teams',
    ],
    idealFor: [
      'Enterprises with hybrid networks and AD environments',
      'Organizations preparing for cyber insurance renewals',
      'Teams with privileged access complexity',
    ],
    methodology: [
      { title: 'Network Discovery', description: 'Enumerate hosts, trusts, and critical service dependencies.' },
      { title: 'Privilege Testing', description: 'Test privilege escalation routes and credential abuse scenarios.' },
      { title: 'Lateral Movement', description: 'Validate segmentation through controlled movement simulation.' },
      { title: 'Control Hardening', description: 'Provide actionable controls to limit spread and persistence.' },
    ],
    kpis: [
      { value: '48%', label: 'Incidents involve credential theft', source: 'Mandiant M-Trends 2025' },
      { value: '10 days', label: 'Median breakout time in fast intrusions', source: 'CrowdStrike Global Threat Report 2025' },
      { value: '70%', label: 'Ransomware operations use lateral movement', source: 'Sophos Active Adversary Report 2025' },
      { value: '3x', label: 'Higher impact when segmentation is weak', source: 'Ponemon security benchmark' },
    ],
    faqs: [
      {
        question: 'Do we need domain admin credentials for this test?',
        answer:
          'Not necessarily. Most engagements begin with low-privilege access to accurately measure how quickly privilege escalation is possible.',
      },
    ],
  },
  {
    id: 'web-application-penetration-testing',
    slug: 'web-application-penetration-testing',
    title: 'Web Application Penetration Testing',
    icon: FiMonitor,
    categoryId: 'penetration-testing',
    badge: 'Offensive',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/web-application-penetration-testing-cyber/1600/900',
    shortDescription:
      'Deep manual testing of business logic, authentication, authorization, and API security beyond automated scanner coverage.',
    overview:
      'Our web application assessments combine OWASP testing standards with business workflow abuse scenarios. We validate how attackers can bypass controls, access unauthorized data, or manipulate critical transactions.',
    challenge:
      'Modern applications fail in complex ways: broken access controls, insecure APIs, and workflow flaws that scanners often miss.',
    timeline: '1 to 3 weeks per application depending on complexity',
    engagementModel: 'Gray-box with test accounts and architecture context',
    approach: [
      'Map user roles, trust boundaries, and critical flows',
      'Test auth/session management and privilege checks',
      'Assess API endpoints, data exposure, and logic abuse',
      'Validate exploit paths with safe impact demonstrations',
    ],
    outcomes: [
      'Prevent high-impact web and API breach scenarios',
      'Improve secure development priorities for engineering teams',
      'Increase release confidence for customer-facing platforms',
    ],
    deliverables: [
      'OWASP-mapped findings with risk ratings',
      'Endpoint-level evidence and reproduction steps',
      'Fix guidance aligned to your stack and architecture',
      'Developer debrief session for rapid remediation',
    ],
    idealFor: [
      'SaaS platforms and customer portals',
      'Financial, e-commerce, and healthcare applications',
      'Teams preparing for production launch',
    ],
    methodology: [
      { title: 'Threat Modeling', description: 'Identify critical workflows and abuse opportunities from attacker perspective.' },
      { title: 'Manual Testing', description: 'Validate OWASP Top 10 and business logic vulnerabilities.' },
      { title: 'API Security', description: 'Test authorization, rate limits, and data exposure in API calls.' },
      { title: 'Remediation Guidance', description: 'Provide code-level and architectural recommendations.' },
    ],
    kpis: [
      { value: '94%', label: 'Apps tested include at least one medium/high flaw', source: 'OWASP community data' },
      { value: 'A01', label: 'Broken access control stays top OWASP risk', source: 'OWASP Top 10' },
      { value: '2.7x', label: 'Higher breach cost when customer data is exposed', source: 'IBM Cost of a Data Breach 2025' },
      { value: '60%', label: 'Incidents involve web-facing vectors', source: 'Public incident trend analysis' },
    ],
    faqs: [
      {
        question: 'Do you test both frontend and backend APIs?',
        answer:
          'Yes. We test the full request lifecycle including client-side logic, server-side validation, and API authorization controls.',
      },
    ],
  },
  {
    id: 'mobile-application-testing',
    slug: 'mobile-application-testing',
    title: 'Mobile Application Testing',
    icon: FiCpu,
    categoryId: 'penetration-testing',
    badge: 'Offensive',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/mobile-application-testing-cyber/1600/900',
    shortDescription:
      'Security testing for Android and iOS apps, covering local storage, runtime controls, and backend API interactions.',
    overview:
      'We perform end-to-end mobile testing using static and dynamic techniques to uncover weak cryptography, insecure storage, improper certificate handling, and business logic flaws in app-to-API interactions.',
    challenge:
      'Mobile apps are frequently reverse engineered and tampered with. Weak client controls can expose sensitive user and business data.',
    timeline: '2 to 4 weeks for app and API combined scope',
    engagementModel: 'Black-box and gray-box hybrid mobile assessment',
    approach: [
      'Reverse engineering and binary analysis',
      'Runtime tampering and bypass testing',
      'Insecure storage and transport validation',
      'API and session abuse scenario testing',
    ],
    outcomes: [
      'Protect user data from device-level compromise',
      'Strengthen trust in mobile payment and identity flows',
      'Reduce app store and reputational risk exposure',
    ],
    deliverables: [
      'Mobile test report mapped to OWASP MASVS',
      'High-risk exploit narratives with proof snippets',
      'Remediation and secure coding recommendations',
      'Optional retest before release window',
    ],
    idealFor: [
      'Fintech and payment applications',
      'Apps handling identity or personal data',
      'Teams launching feature-heavy mobile releases',
    ],
    methodology: [
      { title: 'App Recon', description: 'Analyze binaries, permissions, and attack surface.' },
      { title: 'Runtime Testing', description: 'Simulate tampering, hooking, and root/jailbreak scenarios.' },
      { title: 'API Validation', description: 'Test app-backend trust assumptions and auth controls.' },
      { title: 'Hardening Plan', description: 'Prioritize fixes for client and backend controls.' },
    ],
    kpis: [
      { value: '60%+', label: 'Apps expose sensitive data in logs/storage', source: 'Mobile app assessment benchmarks' },
      { value: '4x', label: 'Higher fraud risk with weak mobile controls', source: 'Industry fraud studies' },
      { value: '70%', label: 'Mobile traffic now dominates many user journeys', source: 'Global digital usage reports' },
      { value: 'Top 3', label: 'Insecure auth remains a major mobile flaw', source: 'OWASP MASVS trends' },
    ],
    faqs: [
      {
        question: 'Can you test pre-release builds?',
        answer:
          'Yes. We regularly test staging and release candidate builds to support secure launch cycles and minimize production risk.',
      },
    ],
  },
  {
    id: 'wireless-penetration-testing',
    slug: 'wireless-penetration-testing',
    title: 'Wireless Penetration Testing',
    icon: FiWifi,
    categoryId: 'penetration-testing',
    badge: 'Offensive',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/wireless-penetration-testing-cyber/1600/900',
    shortDescription:
      'Assess Wi-Fi infrastructure for weak encryption, rogue access points, and protocol-level attacks affecting enterprise environments.',
    overview:
      'Wireless assessments validate whether your Wi-Fi architecture can resist modern attack techniques, from rogue AP attacks to insecure segmentation between guest, BYOD, and corporate networks.',
    challenge:
      'Wireless is often treated as a convenience layer, but weak Wi-Fi controls can become a direct bridge into sensitive internal systems.',
    timeline: '1 to 2 weeks including on-site validation',
    engagementModel: 'On-site wireless and adjacent network attack simulation',
    approach: [
      'Map AP inventory and encryption posture',
      'Assess guest-to-corporate segmentation controls',
      'Test rogue AP and evil twin attack resistance',
      'Validate monitoring and detection capability',
    ],
    outcomes: [
      'Reduce unauthorized wireless access risk',
      'Improve policy enforcement for BYOD and guest access',
      'Strengthen monitoring against rogue wireless activity',
    ],
    deliverables: [
      'Wireless security posture report',
      'Rogue AP and segmentation findings',
      'Network architecture hardening actions',
      'Policy recommendations for secure wireless operations',
    ],
    idealFor: [
      'Corporate campuses and branch offices',
      'Retail and hospitality environments',
      'Organizations with dense BYOD usage',
    ],
    methodology: [
      { title: 'Wireless Recon', description: 'Enumerate SSIDs, protocols, and encryption standards in use.' },
      { title: 'Attack Validation', description: 'Test capture, impersonation, and segmentation bypass scenarios.' },
      { title: 'Control Review', description: 'Assess NAC, monitoring, and alerting effectiveness.' },
      { title: 'Hardening Playbook', description: 'Deliver practical control improvements for resilience.' },
    ],
    kpis: [
      { value: '49%', label: 'Organizations report rogue AP incidents', source: 'Enterprise wireless security survey' },
      { value: 'WPA3', label: 'Adoption still uneven in mixed environments', source: 'Wi-Fi alliance ecosystem data' },
      { value: '2x', label: 'Risk increase when guest segmentation is weak', source: 'Internal red-team observations' },
      { value: 'Minutes', label: 'Time to abuse poorly isolated guest Wi-Fi', source: 'Field testing metrics' },
    ],
    faqs: [
      {
        question: 'Do wireless tests require on-site access?',
        answer:
          'Yes. Most meaningful wireless testing is performed on-site to validate radio coverage, segmentation behavior, and physical exposure.',
      },
    ],
  },
  {
    id: 'social-engineering',
    slug: 'social-engineering',
    title: 'Social Engineering',
    icon: FiUsers,
    categoryId: 'penetration-testing',
    badge: 'Human Risk',
    badgeTone: 'danger',
    imageUrl: 'https://picsum.photos/seed/social-engineering-cyber/1600/900',
    shortDescription:
      'Test your human layer with targeted phishing simulations, vishing campaigns, and pretexting scenarios to measure employee security awareness and reduce the risk of credential compromise.',
    overview:
      'Our social engineering engagements simulate realistic attacker behavior against employees, vendors, and support workflows. We test email phishing, voice-based deception, and pretext scenarios to identify where process and awareness controls break down under pressure.',
    challenge:
      'Even with strong technical controls, attackers often bypass systems by exploiting trust, urgency, and human behavior. Without controlled simulations, organizations cannot accurately measure real-world human-layer risk.',
    timeline: '2 to 4 weeks including campaign design and reporting',
    engagementModel: 'Controlled phishing, vishing, and pretexting simulations',
    approach: [
      'Define approved scenarios, targets, and escalation safeguards',
      'Execute phishing, vishing, and pretexting campaigns in waves',
      'Measure click, credential submission, and reporting behavior',
      'Deliver awareness, process, and technical hardening recommendations',
    ],
    outcomes: [
      'Measure true employee susceptibility to social manipulation',
      'Improve incident reporting speed and quality from staff',
      'Reduce credential theft and business email compromise exposure',
    ],
    deliverables: [
      'Campaign performance dashboard by department and role',
      'Human risk findings with evidence and scenario analysis',
      'Role-specific awareness improvement recommendations',
      'Follow-up simulation plan to validate improvement over time',
    ],
    idealFor: [
      'Organizations with large email-reliant teams',
      'Enterprises concerned about business email compromise',
      'Security programs prioritizing human-risk reduction',
    ],
    methodology: [
      { title: 'Scenario Design', description: 'Build realistic, business-contextual deception scenarios with clear guardrails.' },
      { title: 'Simulation Execution', description: 'Run controlled phishing, vishing, and pretext campaigns.' },
      { title: 'Behavior Analysis', description: 'Assess interaction patterns, reporting behavior, and control gaps.' },
      { title: 'Awareness Uplift', description: 'Provide targeted training and process improvements by risk profile.' },
    ],
    kpis: [
      { value: '74%', label: 'Breaches include a human element', source: 'Verizon DBIR 2025' },
      { value: '31%', label: 'Users interact with phishing in initial waves', source: 'Awareness benchmark studies' },
      { value: '2x', label: 'Reduction in repeat-click users after targeted training', source: 'Program maturity data' },
      { value: 'Minutes', label: 'Critical response window for suspicious email reporting', source: 'SOC response observations' },
    ],
    faqs: [
      {
        question: 'Will employees be publicly named in reports?',
        answer:
          'No. Reports are role and team-focused unless your governance model explicitly requires individual-level tracking.',
      },
      {
        question: 'Can this be aligned with awareness training?',
        answer:
          'Yes. We pair simulation outcomes with practical training paths and follow-up campaigns to validate improvement.',
      },
    ],
  },
  {
    id: 'vulnerability-assessment',
    slug: 'vulnerability-assessment',
    title: 'Vulnerability Assessment',
    icon: FiSearch,
    categoryId: 'assessments-audits',
    badge: 'Risk Reduction',
    badgeTone: 'warning',
    imageUrl: 'https://picsum.photos/seed/vulnerability-assessment-cyber/1600/900',
    shortDescription:
      'Risk-prioritized scanning and manual validation to surface known weaknesses across infrastructure, applications, and cloud assets.',
    overview:
      'Our vulnerability assessment service provides broad visibility into known weaknesses while filtering noise through analyst validation. You receive a prioritized action list tied to exploitability and business impact.',
    challenge:
      'Security teams are overloaded with scanner alerts, but not every finding is urgent. Without prioritization, critical fixes get delayed and risk accumulates.',
    timeline: '1 to 3 weeks based on asset scope',
    engagementModel: 'Snapshot assessment or recurring monthly program',
    approach: [
      'Comprehensive asset and service scanning',
      'Analyst-led false-positive reduction',
      'Exploitability and exposure prioritization',
      'Remediation tracking support and validation',
    ],
    outcomes: [
      'Gain a clear remediation backlog with urgency tiers',
      'Improve patch and configuration management efficiency',
      'Reduce exploitable attack surface quickly',
    ],
    deliverables: [
      'Validated vulnerability register',
      'Executive risk summary with trends',
      'Asset-level remediation matrix',
      'Retest report for fixed high-priority issues',
    ],
    idealFor: [
      'Teams scaling security programs from reactive to proactive',
      'Organizations with expanding cloud and on-prem assets',
      'Compliance-oriented industries requiring periodic assessment',
    ],
    methodology: [
      { title: 'Scope Setup', description: 'Align asset inventory and criticality before scanning.' },
      { title: 'Assessment', description: 'Run authenticated and external scans with tuned profiles.' },
      { title: 'Validation', description: 'Manually validate high-value findings and remove noise.' },
      { title: 'Prioritization', description: 'Rank remediation by risk, exploitability, and business impact.' },
    ],
    kpis: [
      { value: '30%', label: 'Critical vulns remain open >90 days in many orgs', source: 'Industry patch benchmark' },
      { value: '3x', label: 'Breach probability increase with unpatched edge assets', source: 'Public incident pattern study' },
      { value: '72%', label: 'Teams report scanner fatigue', source: 'Enterprise SOC survey' },
      { value: 'Weeks', label: 'Average delay without remediation prioritization', source: 'Program maturity assessments' },
    ],
    faqs: [
      {
        question: 'How is this different from penetration testing?',
        answer:
          'Vulnerability assessments focus on breadth and prioritization of known weaknesses, while penetration tests focus on depth and exploit chaining.',
      },
    ],
  },
  {
    id: 'cloud-security-assessment',
    slug: 'cloud-security-assessment',
    title: 'Cloud Security Assessment',
    icon: FiDatabase,
    categoryId: 'assessments-audits',
    badge: 'Cloud',
    badgeTone: 'info',
    imageUrl: 'https://picsum.photos/seed/cloud-security-assessment-cyber/1600/900',
    shortDescription:
      'Assess AWS, Azure, and GCP environments for identity risk, exposed data paths, and control misconfigurations.',
    overview:
      'We review cloud identity, storage, network, and logging architecture to identify exploitable misconfigurations and governance gaps. Findings are aligned to your platform architecture and operational model.',
    challenge:
      'Cloud speed often outpaces cloud governance. Identity and misconfiguration mistakes can expose sensitive data in minutes.',
    timeline: '2 to 4 weeks for single cloud tenant; longer for multi-cloud',
    engagementModel: 'Read-only review plus targeted validation testing',
    approach: [
      'Assess IAM roles, trust policies, and privileged access design',
      'Review storage and data exposure pathways',
      'Validate network boundaries and service access controls',
      'Audit logging and detection coverage for critical events',
    ],
    outcomes: [
      'Reduce cloud misconfiguration and identity takeover risk',
      'Improve visibility across cloud attack paths',
      'Accelerate governance maturity for cloud operations',
    ],
    deliverables: [
      'Cloud posture findings by account/project',
      'Identity and data protection risk map',
      'Prioritized hardening checklist',
      'Architecture recommendations for secure scale',
    ],
    idealFor: [
      'Organizations migrating or scaling in cloud',
      'SaaS providers handling customer-sensitive data',
      'Teams adopting multi-cloud infrastructure',
    ],
    methodology: [
      { title: 'Architecture Discovery', description: 'Understand account structure, workloads, and trust boundaries.' },
      { title: 'Control Assessment', description: 'Evaluate IAM, storage, networking, and logging posture.' },
      { title: 'Attack Path Mapping', description: 'Model realistic cloud compromise scenarios.' },
      { title: 'Remediation Blueprint', description: 'Provide prioritized hardening actions for platform and teams.' },
    ],
    kpis: [
      { value: '23%', label: 'Breaches involve cloud misconfiguration', source: 'Cloud security incident studies' },
      { value: 'Top 1', label: 'Identity remains primary cloud attack vector', source: 'CISA and cloud provider advisories' },
      { value: '10 min', label: 'Potential exploitation window for exposed keys', source: 'Cloud red-team reports' },
      { value: '85%', label: 'Organizations run multi-cloud workloads', source: 'Flexera 2025 State of Cloud' },
    ],
    faqs: [
      {
        question: 'Will you need production access?',
        answer:
          'Most engagements use least-privilege read access. Limited write access is requested only when explicitly approved for validation.',
      },
    ],
  },
  {
    id: 'security-risk-assessment',
    slug: 'security-risk-assessment',
    title: 'Security Risk Assessment',
    icon: FiAlertTriangle,
    categoryId: 'assessments-audits',
    badge: 'Compliance',
    badgeTone: 'warning',
    imageUrl: 'https://picsum.photos/seed/security-risk-assessment-cyber/1600/900',
    shortDescription:
      'Structured risk evaluation that translates technical exposures into business-impact priorities for leadership action.',
    overview:
      'This service identifies and scores cyber risks based on likelihood, impact, and control maturity. We connect technical findings to business operations so leadership can decide where to invest first.',
    challenge:
      'Security spending often lacks clear risk prioritization. Teams fix what is loudest, not what is most likely to cause major business disruption.',
    timeline: '3 to 6 weeks including stakeholder workshops',
    engagementModel: 'Framework-aligned risk workshops plus evidence review',
    approach: [
      'Identify critical assets and business dependencies',
      'Model threat scenarios and control effectiveness',
      'Score risk based on realistic exploitability and impact',
      'Align mitigation plan to budget and operating goals',
    ],
    outcomes: [
      'Improve board-level visibility into cyber risk',
      'Prioritize investment with measurable rationale',
      'Reduce strategic blind spots in resilience planning',
    ],
    deliverables: [
      'Risk register with scoring methodology',
      'Executive risk dashboard and heat map',
      'Treatment roadmap with owners and timelines',
      'Quarterly reassessment framework',
    ],
    idealFor: [
      'Organizations preparing annual planning cycles',
      'Enterprises requiring board-level reporting',
      'Teams balancing compliance and real-world risk',
    ],
    methodology: [
      { title: 'Context Framing', description: 'Define business-critical systems, dependencies, and risk appetite.' },
      { title: 'Threat Analysis', description: 'Evaluate probable attack scenarios and control gaps.' },
      { title: 'Risk Quantification', description: 'Score and rank risks by likelihood and impact.' },
      { title: 'Action Planning', description: 'Develop practical mitigation roadmap with measurable outcomes.' },
    ],
    kpis: [
      { value: '53%', label: 'Organizations lack formal cyber risk quantification', source: 'Board governance survey' },
      { value: '2x', label: 'Faster response in organizations with risk playbooks', source: 'Incident readiness studies' },
      { value: '68%', label: 'Boards demand measurable cyber reporting', source: 'PwC global board survey' },
      { value: '40%', label: 'Budget waste reduced with prioritized controls', source: 'Program optimization assessments' },
    ],
    faqs: [
      {
        question: 'Can this map to ISO 27001 or NIST?',
        answer:
          'Yes. We can align assessment outputs to ISO 27001 controls, NIST CSF functions, or your internal governance framework.',
      },
    ],
  },
  {
    id: 'security-policy-assessment',
    slug: 'security-policy-assessment',
    title: 'Security Policy Assessment',
    icon: FiBookOpen,
    categoryId: 'assessments-audits',
    badge: 'Human Risk',
    badgeTone: 'danger',
    imageUrl: 'https://picsum.photos/seed/security-policy-assessment-cyber/1600/900',
    shortDescription:
      'Evaluate and modernize policy frameworks to close governance gaps and align controls with real operational workflows.',
    overview:
      'We review policy design, applicability, and enforcement maturity across your organization. The focus is practical governance that engineering, HR, legal, and operations can execute consistently.',
    challenge:
      'Policies often exist as static documents but fail to guide day-to-day decisions. This creates hidden compliance and operational risk.',
    timeline: '2 to 4 weeks depending on policy maturity',
    engagementModel: 'Document review, stakeholder interviews, and maturity scoring',
    approach: [
      'Assess policy completeness against regulatory obligations',
      'Map policy intent to operational ownership',
      'Identify control gaps and contradictory requirements',
      'Draft practical updates with implementation guidance',
    ],
    outcomes: [
      'Strengthen governance clarity across teams',
      'Reduce policy-to-practice drift',
      'Improve audit readiness and control consistency',
    ],
    deliverables: [
      'Policy maturity and gap analysis report',
      'Updated policy templates and role mappings',
      'Control ownership matrix',
      '90-day implementation action plan',
    ],
    idealFor: [
      'Organizations preparing for compliance audits',
      'Companies scaling beyond startup operations',
      'Enterprises with fragmented policy ownership',
    ],
    methodology: [
      { title: 'Baseline Review', description: 'Collect and evaluate existing policy artifacts and standards.' },
      { title: 'Control Mapping', description: 'Map policies to required controls and operational practices.' },
      { title: 'Gap Prioritization', description: 'Rank deficiencies by compliance and operational risk.' },
      { title: 'Policy Redesign', description: 'Deliver concise, enforceable, and role-aware policy updates.' },
    ],
    kpis: [
      { value: '60%', label: 'Audit findings tied to policy/process gaps', source: 'Compliance trend reports' },
      { value: '3x', label: 'Higher enforcement consistency with clear ownership', source: 'Governance maturity studies' },
      { value: '45%', label: 'Organizations cite outdated policies as risk driver', source: 'Internal audit surveys' },
      { value: '90 days', label: 'Typical policy modernization cycle', source: 'Program benchmark data' },
    ],
    faqs: [
      {
        question: 'Do you provide policy templates?',
        answer:
          'Yes. We provide editable templates and ownership guidance tailored to your industry and operating model.',
      },
    ],
  },
  {
    id: 'osint-investigations',
    slug: 'osint-investigations',
    title: 'OSINT Investigations',
    icon: FiSearch,
    categoryId: 'assessments-audits',
    badge: 'Intelligence',
    badgeTone: 'info',
    imageUrl: 'https://picsum.photos/seed/osint-investigations-cyber/1600/900',
    shortDescription:
      'Uncover what attackers can learn about your organization from open sources - leaked credentials, exposed infrastructure, employee data, and digital footprint analysis.',
    overview:
      'Our OSINT investigations map your external digital footprint from an attacker perspective. We identify exposed credentials, shadow assets, public metadata leakage, and risky employee information patterns that can be weaponized for intrusion or fraud.',
    challenge:
      'Attackers gather intelligence before they attack. Most organizations underestimate the volume of actionable exposure available in public repositories, breach datasets, search indexes, and social platforms.',
    timeline: '1 to 3 weeks depending on organization footprint',
    engagementModel: 'External intelligence gathering and exposure analysis',
    approach: [
      'Map domains, subdomains, employee footprint, and public tech stack',
      'Analyze leaked credential and breach data exposure',
      'Identify exposed services, misconfigured assets, and sensitive metadata',
      'Prioritize findings by attacker utility and business impact',
    ],
    outcomes: [
      'Reduce external reconnaissance advantages available to attackers',
      'Improve asset inventory and shadow IT visibility',
      'Strengthen preventive controls before active exploitation occurs',
    ],
    deliverables: [
      'OSINT exposure report with risk-ranked findings',
      'Credential and digital footprint risk summary',
      'External attack-surface cleanup action plan',
      'Monitoring recommendations for ongoing exposure detection',
    ],
    idealFor: [
      'Organizations with growing external digital presence',
      'Enterprises preparing for threat-led security reviews',
      'Teams seeking proactive intelligence-led hardening',
    ],
    methodology: [
      { title: 'Footprint Mapping', description: 'Discover publicly exposed assets, identities, and service metadata.' },
      { title: 'Exposure Analysis', description: 'Correlate leaked data and public intelligence signals.' },
      { title: 'Risk Prioritization', description: 'Rank findings by exploitability and potential impact.' },
      { title: 'Remediation Strategy', description: 'Provide targeted cleanup and monitoring roadmap.' },
    ],
    kpis: [
      { value: '80%+', label: 'Campaigns begin with external recon', source: 'Threat actor behavior reports' },
      { value: '41%', label: 'Organizations discover unmanaged internet assets', source: 'Attack surface management studies' },
      { value: 'Top 3', label: 'Credential abuse remains a leading intrusion vector', source: 'Global incident trends' },
      { value: 'Days', label: 'Typical delay before exposure is noticed without active monitoring', source: 'Operational benchmarks' },
    ],
    faqs: [
      {
        question: 'Do OSINT investigations require internal access?',
        answer:
          'No. This service focuses on externally accessible data and intelligence sources to simulate attacker reconnaissance.',
      },
      {
        question: 'Can this feed into penetration testing scope?',
        answer:
          'Yes. OSINT findings are often used to prioritize realistic penetration testing scenarios and target selection.',
      },
    ],
  },
  {
    id: 'tailored-security-consulting',
    slug: 'tailored-security-consulting',
    title: 'Tailored Security Consulting',
    icon: FiShield,
    categoryId: 'assessments-audits',
    badge: 'Custom',
    badgeTone: 'info',
    imageUrl: 'https://picsum.photos/seed/tailored-security-consulting-cyber/1600/900',
    shortDescription:
      'Not every challenge fits a standard package. We design bespoke security programs aligned to your industry, risk appetite, budget, and specific compliance obligations.',
    overview:
      'Our tailored consulting service builds custom cybersecurity programs for organizations with unique operating models, regulatory pressure, or strategic transformation needs. Engagements are shaped around your constraints, priorities, and business outcomes.',
    challenge:
      'Predefined service packages can miss organization-specific priorities. Teams often need flexible support that combines governance, technical assurance, and execution planning in one integrated roadmap.',
    timeline: 'Engagement-based; typically 4 to 12 weeks',
    engagementModel: 'Advisory sprints, program design, and embedded consulting',
    approach: [
      'Assess business context, risk appetite, and control maturity',
      'Design a custom security roadmap with phased priorities',
      'Align technical and governance controls to obligations',
      'Support execution planning with measurable checkpoints',
    ],
    outcomes: [
      'Create a right-sized security strategy built for your business',
      'Optimize security investment against real risk drivers',
      'Accelerate governance and technical maturity with clear ownership',
    ],
    deliverables: [
      'Custom cybersecurity strategy and roadmap',
      'Priority matrix aligned to budget and risk tolerance',
      'Execution plan with milestones, owners, and KPIs',
      'Leadership briefing pack for decision support',
    ],
    idealFor: [
      'Organizations undergoing rapid growth or transformation',
      'Enterprises with complex compliance obligations',
      'Leadership teams needing bespoke security planning support',
    ],
    methodology: [
      { title: 'Discovery', description: 'Understand business constraints, obligations, and current maturity.' },
      { title: 'Program Design', description: 'Build tailored control and capability roadmap.' },
      { title: 'Prioritization', description: 'Sequence initiatives by risk, cost, and execution feasibility.' },
      { title: 'Enablement', description: 'Support implementation planning and measurement.' },
    ],
    kpis: [
      { value: '35%+', label: 'Efficiency gains from prioritized security spend', source: 'Program transformation studies' },
      { value: '2x', label: 'Faster progress with owner-defined security roadmaps', source: 'Delivery benchmark data' },
      { value: 'High', label: 'Board confidence with measurable planning artifacts', source: 'Governance advisory reports' },
      { value: 'Quarterly', label: 'Recommended roadmap review cadence', source: 'Security program best practices' },
    ],
    faqs: [
      {
        question: 'Can this combine multiple service areas?',
        answer:
          'Yes. We can combine testing, assessments, SOC strategy, and training into a single custom engagement plan.',
      },
      {
        question: 'Is this suitable for smaller teams?',
        answer:
          'Absolutely. Tailored consulting is useful for both lean teams and large enterprises when standard scopes do not fit.',
      },
    ],
  },
  {
    id: 'soc-as-a-service',
    slug: 'soc-as-a-service',
    title: 'SOC-as-a-Service',
    icon: FiActivity,
    categoryId: 'soc-forensics',
    badge: '24/7',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/soc-as-a-service-cyber/1600/900',
    shortDescription:
      'Managed detection and response support with continuous monitoring, triage, and escalation for high-confidence incidents.',
    overview:
      'Our SOC-as-a-Service model combines monitoring technology, analyst expertise, and incident playbooks to give your team enterprise-grade detection and response without building a full in-house SOC from scratch.',
    challenge:
      'Most teams lack 24/7 analyst coverage and threat hunting depth. Delayed detection increases impact, downtime, and recovery cost.',
    timeline: '2 to 6 weeks onboarding, continuous operations after launch',
    engagementModel: 'Managed detection and response with agreed SLAs',
    approach: [
      'Integrate SIEM/EDR and critical telemetry sources',
      'Build use-case detections tied to your risk profile',
      'Provide around-the-clock triage and escalation',
      'Continuously tune detections to reduce noise and misses',
    ],
    outcomes: [
      'Reduce attacker dwell time through faster detection',
      'Improve alert quality and response coordination',
      'Increase resilience with continuous monitoring coverage',
    ],
    deliverables: [
      'SOC onboarding and telemetry integration plan',
      'Use-case library and tuning cadence',
      'Incident response runbooks and escalation matrix',
      'Monthly operational and threat trend reports',
    ],
    idealFor: [
      'Organizations lacking 24/7 internal SOC coverage',
      'Teams scaling detection capabilities quickly',
      'Businesses with regulatory monitoring expectations',
    ],
    methodology: [
      { title: 'Onboard', description: 'Integrate logs, endpoints, cloud, and identity telemetry.' },
      { title: 'Detect', description: 'Implement and tune high-value detections mapped to threat scenarios.' },
      { title: 'Respond', description: 'Triage, investigate, and escalate incidents with clear severity logic.' },
      { title: 'Improve', description: 'Run recurring detection quality reviews and reporting.' },
    ],
    kpis: [
      { value: '24/7', label: 'Continuous analyst coverage', source: 'Managed SOC delivery model' },
      { value: '50%+', label: 'Typical reduction in MTTD after tuning', source: 'Program onboarding benchmarks' },
      { value: '30%+', label: 'Noise reduction through detection tuning', source: 'SOC optimization metrics' },
      { value: '<60 min', label: 'Target triage window for high severity alerts', source: 'SOC SLA design' },
    ],
    faqs: [
      {
        question: 'Do we need to replace our current SIEM tools?',
        answer:
          'Usually no. We can work with your existing SIEM and EDR stack and recommend only targeted improvements where needed.',
      },
    ],
  },
  {
    id: 'digital-forensics',
    slug: 'digital-forensics',
    title: 'Digital Forensics',
    icon: FiLock,
    categoryId: 'soc-forensics',
    badge: 'Incident Response',
    badgeTone: 'danger',
    imageUrl: 'https://picsum.photos/seed/digital-forensics-cyber/1600/900',
    shortDescription:
      'Forensic investigation services for endpoint, server, and cloud incidents with evidence integrity and timeline reconstruction.',
    overview:
      'We preserve and analyze digital evidence to establish what happened, how compromise occurred, what data was impacted, and what actions are required for containment and recovery.',
    challenge:
      'Without disciplined forensic process, critical evidence can be lost, root cause remains uncertain, and legal or regulatory reporting becomes risky.',
    timeline: 'Immediate mobilization; investigation length based on complexity',
    engagementModel: 'Incident-triggered response or retained forensic support',
    approach: [
      'Preserve volatile and non-volatile evidence safely',
      'Reconstruct attacker timeline and actions',
      'Identify root cause and persistence mechanisms',
      'Support legal, leadership, and regulatory communications',
    ],
    outcomes: [
      'Establish defensible incident facts quickly',
      'Improve post-incident remediation quality',
      'Support legal and compliance reporting requirements',
    ],
    deliverables: [
      'Forensic timeline and root-cause report',
      'Evidence catalog and chain-of-custody documentation',
      'Containment and eradication recommendations',
      'Post-incident control hardening plan',
    ],
    idealFor: [
      'Organizations experiencing suspected compromise',
      'Teams requiring legal defensibility of findings',
      'Businesses with strict reporting obligations',
    ],
    methodology: [
      { title: 'Preserve', description: 'Secure evidence with chain-of-custody discipline.' },
      { title: 'Investigate', description: 'Analyze hosts, logs, memory, and cloud artifacts.' },
      { title: 'Reconstruct', description: 'Build timeline of attacker behavior and impact.' },
      { title: 'Advise', description: 'Deliver recovery and hardening recommendations.' },
    ],
    kpis: [
      { value: '92%', label: 'Incidents require multi-source evidence correlation', source: 'DFIR field operations data' },
      { value: 'Hours', label: 'Critical window for volatile evidence capture', source: 'Forensic best practices' },
      { value: '2x', label: 'Recovery delays when root cause is unresolved', source: 'Incident postmortem studies' },
      { value: 'High', label: 'Regulatory scrutiny for undocumented investigations', source: 'Compliance enforcement trends' },
    ],
    faqs: [
      {
        question: 'Can you support legal counsel during investigations?',
        answer:
          'Yes. We frequently coordinate with legal and compliance stakeholders to provide evidence handling and reporting support.',
      },
    ],
  },
  {
    id: 'threat-intelligence',
    slug: 'threat-intelligence',
    title: 'Threat Intelligence',
    icon: FiTarget,
    categoryId: 'soc-forensics',
    badge: 'Intelligence',
    badgeTone: 'info',
    imageUrl: 'https://picsum.photos/seed/threat-intelligence-cyber/1600/900',
    shortDescription:
      'Contextual intelligence on adversary activity, leaked credentials, and sector-specific threat trends to improve defense decisions.',
    overview:
      'We turn raw threat signals into actionable intelligence mapped to your industry, technology stack, and business exposure. Intelligence outputs feed detection engineering, hardening priorities, and leadership awareness.',
    challenge:
      'Generic threat feeds are noisy and often disconnected from your actual risk profile. Teams need targeted intelligence, not endless indicators.',
    timeline: 'Ongoing subscription or campaign-based intelligence support',
    engagementModel: 'Monthly reporting plus rapid advisory alerts',
    approach: [
      'Monitor actor activity relevant to your sector',
      'Track credential leaks and exposed infrastructure',
      'Map threat trends to your controls and attack surface',
      'Deliver prioritized defensive recommendations',
    ],
    outcomes: [
      'Focus defenses on realistic adversary behavior',
      'Improve detection use-case relevance',
      'Strengthen strategic readiness against emerging threats',
    ],
    deliverables: [
      'Threat landscape briefings',
      'Executive advisory summaries',
      'Indicators and detection suggestions',
      'Sector-specific threat watch alerts',
    ],
    idealFor: [
      'SOC and threat hunting teams',
      'Security leaders planning annual programs',
      'Regulated industries with elevated threat exposure',
    ],
    methodology: [
      { title: 'Collection', description: 'Gather intelligence from curated technical and strategic sources.' },
      { title: 'Correlation', description: 'Map threat indicators to internal telemetry and exposure points.' },
      { title: 'Assessment', description: 'Determine likelihood and potential impact for your environment.' },
      { title: 'Action', description: 'Translate intelligence into detection and prevention priorities.' },
    ],
    kpis: [
      { value: '35%', label: 'Fewer false-priority alerts with contextual intel', source: 'SOC program benchmarks' },
      { value: 'Top 5', label: 'Actors drive majority of sector-specific incidents', source: 'Threat intelligence yearly reviews' },
      { value: 'Weeks', label: 'Lead time gained through proactive threat watch', source: 'Campaign tracking analyses' },
      { value: '60%+', label: 'Organizations expanding cyber intel investment', source: 'Gartner security trends' },
    ],
    faqs: [
      {
        question: 'Is threat intelligence only for large enterprises?',
        answer:
          'No. Mid-size organizations benefit significantly when intelligence is tailored to their business context and attack surface.',
      },
    ],
  },
  {
    id: 'incident-response-retainer',
    slug: 'incident-response-retainer',
    title: 'Incident Response Retainer',
    icon: FiZap,
    categoryId: 'soc-forensics',
    badge: 'Incident Response',
    badgeTone: 'danger',
    imageUrl: 'https://picsum.photos/seed/incident-response-retainer-cyber/1600/900',
    shortDescription:
      'Pre-negotiated rapid response coverage with playbooks, readiness drills, and expert support when incidents occur.',
    overview:
      'An IR retainer ensures your team can activate experienced responders immediately during high-stress incidents. We pair readiness planning with on-demand support to reduce decision latency and containment delays.',
    challenge:
      'During active incidents, time lost on vendor onboarding and unclear workflows can amplify business damage significantly.',
    timeline: 'Retainer setup in 1 to 2 weeks; response available per SLA',
    engagementModel: 'Annual retainer with response hour pool and readiness services',
    approach: [
      'Define incident severity model and activation paths',
      'Build communication and escalation playbooks',
      'Run tabletop or simulation exercises',
      'Provide rapid response support during incidents',
    ],
    outcomes: [
      'Faster containment and recovery decisions',
      'Higher confidence during crisis execution',
      'Reduced operational and reputational impact',
    ],
    deliverables: [
      'Incident response playbook and contact matrix',
      'Readiness assessment and improvement plan',
      'Tabletop exercise facilitation and report',
      'On-demand DFIR escalation support',
    ],
    idealFor: [
      'Organizations with limited internal IR capacity',
      'High-availability businesses where downtime is costly',
      'Teams seeking board-level incident readiness assurance',
    ],
    methodology: [
      { title: 'Prepare', description: 'Define response process, roles, and governance.' },
      { title: 'Exercise', description: 'Validate readiness with practical simulations.' },
      { title: 'Respond', description: 'Activate experts quickly during incidents.' },
      { title: 'Recover', description: 'Capture lessons and improve resilience post-incident.' },
    ],
    kpis: [
      { value: '40%+', label: 'Containment speed improvement with retainers', source: 'IR program maturity studies' },
      { value: '<4h', label: 'Target response mobilization window', source: 'Retainer SLA baseline' },
      { value: '2x', label: 'Decision delays without rehearsed playbooks', source: 'Crisis management analyses' },
      { value: 'High', label: 'Cost of unplanned incident handling', source: 'Breach impact reports' },
    ],
    faqs: [
      {
        question: 'Can you integrate with our legal and communications team?',
        answer:
          'Yes. Retainer workflows can include legal, HR, PR, and executive stakeholders to ensure coordinated response execution.',
      },
    ],
  },
  {
    id: 'live-instructor-led-batches',
    slug: 'live-instructor-led-batches',
    title: 'Live Instructor-Led Batches',
    icon: FiUsers,
    categoryId: 'training-academy',
    badge: 'Bengali + English',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/live-instructor-led-batches-cyber/1600/900',
    shortDescription:
      'Small-cohort practical cybersecurity training delivered by active practitioners with real lab environments.',
    overview:
      'Our live programs combine guided theory with hands-on labs and mentor feedback. Learners practice offensive and defensive workflows in realistic scenarios, not just slides and quizzes.',
    challenge:
      'Most training programs teach concepts without practical transfer. Teams need skill-building that maps directly to workplace incidents and operations.',
    timeline: '4 to 12 week cohorts depending on track',
    engagementModel: 'Scheduled cohorts for individuals and corporate teams',
    approach: [
      'Role-based curriculum design by skill level',
      'Lab-first learning with guided instructor support',
      'Weekly challenge tasks and debrief sessions',
      'Progress tracking for learners and sponsors',
    ],
    outcomes: [
      'Increase job-ready security capabilities',
      'Improve incident handling and analyst confidence',
      'Build repeatable internal security knowledge pipelines',
    ],
    deliverables: [
      'Live class access and recordings',
      'Hands-on lab exercises and challenge sets',
      'Mentor office hours and feedback reports',
      'Completion certificate and skill rubric',
    ],
    idealFor: [
      'Students entering cybersecurity careers',
      'IT teams transitioning into security roles',
      'Organizations upskilling internal teams',
    ],
    methodology: [
      { title: 'Assess', description: 'Benchmark learner baseline and target role.' },
      { title: 'Train', description: 'Deliver live sessions with practical demonstrations.' },
      { title: 'Practice', description: 'Apply concepts in supervised labs and scenarios.' },
      { title: 'Validate', description: 'Evaluate applied capability through assessments.' },
    ],
    kpis: [
      { value: '50K+', label: 'Learners trained across programs', source: 'HackToLive academy records' },
      { value: '4.8/5', label: 'Average learner satisfaction', source: 'Program feedback data' },
      { value: '70%+', label: 'Learners report practical skill gains', source: 'Post-cohort surveys' },
      { value: 'Weeks', label: 'Time to visible capability uplift', source: 'Corporate training observations' },
    ],
    faqs: [
      {
        question: 'Do you provide corporate team batches?',
        answer:
          'Yes. We offer private cohorts customized by role, team maturity, and organizational objectives.',
      },
    ],
  },
  {
    id: 'on-demand-academy',
    slug: 'on-demand-academy',
    title: 'On-Demand Academy',
    icon: FiRadio,
    categoryId: 'training-academy',
    badge: '50+ Courses',
    badgeTone: 'success',
    imageUrl: 'https://picsum.photos/seed/on-demand-academy-cyber/1600/900',
    shortDescription:
      'Self-paced cybersecurity tracks with labs, guided projects, and progress milestones for flexible learning schedules.',
    overview:
      'Our on-demand academy provides structured pathways for learners who need flexibility without sacrificing depth. Courses include guided labs and practical projects built around real-world scenarios.',
    challenge:
      'Many self-paced courses are fragmented and theory-heavy. Learners need coherent pathways that build practical competence.',
    timeline: 'Self-paced, typically 8 to 16 weeks per pathway',
    engagementModel: 'Subscription-based digital learning with lab access',
    approach: [
      'Structured roadmap across beginner to advanced paths',
      'Hands-on labs and practical project milestones',
      'Periodic assessments and progress tracking',
      'Optional mentor support for complex topics',
    ],
    outcomes: [
      'Enable continuous skill development at scale',
      'Support learners balancing work and education',
      'Create measurable progression for long-term growth',
    ],
    deliverables: [
      'Access to course library and labs',
      'Track-based assessments and checkpoints',
      'Certificate pathways for completion milestones',
      'Learning analytics for individuals and teams',
    ],
    idealFor: [
      'Working professionals with time constraints',
      'Distributed teams needing flexible upskilling',
      'Learners building long-term cyber career paths',
    ],
    methodology: [
      { title: 'Plan', description: 'Select role-based track and level goals.' },
      { title: 'Learn', description: 'Progress through sequenced content and guided labs.' },
      { title: 'Apply', description: 'Complete practical exercises and mini-projects.' },
      { title: 'Measure', description: 'Track progress and skill achievement over time.' },
    ],
    kpis: [
      { value: '50+', label: 'Expert-led courses available', source: 'HackToLive academy catalog' },
      { value: '24/7', label: 'Learning access availability', source: 'Platform model' },
      { value: '80%+', label: 'Learners complete at least one lab track', source: 'Course analytics benchmarks' },
      { value: '3x', label: 'Retention gain with hands-on labs', source: 'Learning outcome studies' },
    ],
    faqs: [
      {
        question: 'Are labs included in on-demand programs?',
        answer:
          'Yes. Practical labs are a core part of each pathway, with exercises designed to reinforce real operational skills.',
      },
    ],
  },
  {
    id: 'practical-certifications',
    slug: 'practical-certifications',
    title: 'Practical Certifications',
    icon: FiShield,
    categoryId: 'training-academy',
    badge: '3K+ Issued',
    badgeTone: 'info',
    imageUrl: 'https://picsum.photos/seed/practical-certifications-cyber/1600/900',
    shortDescription:
      'Scenario-based certification tracks that validate applied cybersecurity skills through practical exams.',
    overview:
      'Our certifications emphasize real capability over memorization. Learners complete practical challenges that mirror real security operations and offensive workflows.',
    challenge:
      'Credential inflation makes it hard to identify real practitioners. Employers need proof of hands-on competence, not only theoretical exams.',
    timeline: '4 to 10 week prep plus practical certification assessment',
    engagementModel: 'Training plus practical exam-based certification',
    approach: [
      'Map certification outcomes to job roles',
      'Provide guided prep labs and mock assessments',
      'Run practical exam scenarios with clear scoring',
      'Deliver competency report with certification result',
    ],
    outcomes: [
      'Validate practitioner-ready technical capability',
      'Improve employability and hiring confidence',
      'Create objective skill benchmarks for teams',
    ],
    deliverables: [
      'Practical exam access and scoring rubric',
      'Skill-gap report and improvement plan',
      'Certification credential and verification artifact',
      'Optional retake guidance for unsuccessful candidates',
    ],
    idealFor: [
      'Learners targeting security operations roles',
      'Teams standardizing internal skill baselines',
      'Employers validating candidate capability',
    ],
    methodology: [
      { title: 'Benchmark', description: 'Assess baseline readiness against certification objectives.' },
      { title: 'Prepare', description: 'Complete scenario-based labs and guided practice.' },
      { title: 'Examine', description: 'Demonstrate applied capability under practical conditions.' },
      { title: 'Validate', description: 'Issue credential with measurable competency evidence.' },
    ],
    kpis: [
      { value: '3K+', label: 'Certificates issued', source: 'HackToLive certification records' },
      { value: 'Hands-on', label: 'Exam format based on practical labs', source: 'Certification design model' },
      { value: 'High', label: 'Hiring confidence in practical credentials', source: 'Employer feedback summaries' },
      { value: 'Role-ready', label: 'Focus on real-world security workflows', source: 'Program outcomes' },
    ],
    faqs: [
      {
        question: 'Are these certifications theory-only?',
        answer:
          'No. Certification decisions are based on practical tasks and applied problem-solving in realistic environments.',
      },
    ],
  },
  {
    id: 'ctf-challenges-community',
    slug: 'ctf-challenges-community',
    title: 'CTF Challenges & Community',
    icon: FiFlag,
    categoryId: 'training-academy',
    badge: 'Community',
    badgeTone: 'danger',
    imageUrl: 'https://picsum.photos/seed/ctf-challenges-community-cyber/1600/900',
    shortDescription:
      'Continuous challenge ecosystem for offensive and defensive skill practice with an active cybersecurity community.',
    overview:
      'Our CTF and community platform helps learners sharpen skills through regular challenge drops, team competitions, and peer collaboration. It creates a sustained practice loop beyond one-off courses.',
    challenge:
      'Security skills degrade without regular practice. Teams and learners need continuous, engaging environments to maintain readiness.',
    timeline: 'Ongoing participation with weekly and monthly challenge cycles',
    engagementModel: 'Community membership with challenge and leaderboard access',
    approach: [
      'Release tiered technical challenges regularly',
      'Encourage team-based problem solving and debriefs',
      'Track progress through leaderboards and streaks',
      'Connect learners with mentor and peer network',
    ],
    outcomes: [
      'Build continuous offensive and defensive fluency',
      'Increase confidence in live problem-solving',
      'Create a stronger pipeline of practical cyber talent',
    ],
    deliverables: [
      'CTF platform access and challenge library',
      'Leaderboard and progress analytics',
      'Community events and challenge walkthroughs',
      'Mentor-led strategy sessions',
    ],
    idealFor: [
      'Students and early-career practitioners',
      'Security teams wanting regular simulation practice',
      'Communities building local cyber capability',
    ],
    methodology: [
      { title: 'Challenge', description: 'Engage in role-relevant technical scenarios.' },
      { title: 'Collaborate', description: 'Learn through peer and mentor interaction.' },
      { title: 'Compete', description: 'Measure performance through ranked events.' },
      { title: 'Advance', description: 'Progress into higher-complexity security tracks.' },
    ],
    kpis: [
      { value: '50K+', label: 'Community members and learners reached', source: 'HackToLive ecosystem metrics' },
      { value: 'Weekly', label: 'Challenge release cadence', source: 'Program operations' },
      { value: 'High', label: 'Engagement through gamified learning', source: 'Community participation trends' },
      { value: 'Practical', label: 'Skill growth through repetitive application', source: 'Learning science best practices' },
    ],
    faqs: [
      {
        question: 'Is this beginner-friendly?',
        answer:
          'Yes. Challenges are tiered from beginner to advanced, with guided hints and community support available.',
      },
    ],
  },
]

export const serviceCategoryMap = Object.fromEntries(
  serviceCategories.map((category) => [category.id, category])
) as Record<ServiceCategoryId, ServiceCategory>

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug)
}

export function getServicesByCategory(categoryId: ServiceCategoryId) {
  return services.filter((service) => service.categoryId === categoryId)
}
