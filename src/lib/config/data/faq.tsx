import * as React from 'react'

const faq = {
  title: 'Frequently asked questions',
  // description: '',
  items: [
    {
      q: 'What services does HackToLive offer?',
      a: (
        <>
          HackToLive provides comprehensive cybersecurity services including penetration testing, 
          vulnerability assessments, digital forensics, SOC services, OSINT investigations, and 
          security consulting. We also run HackToLive Academy offering ethical hacking courses 
          in Bengali.
        </>
      ),
    },
    {
      q: 'Are the academy courses available in Bengali?',
      a: "Yes, all HackToLive Academy courses are taught in Bengali (Bangla) to make cybersecurity education more accessible to local learners. We offer both fundamental paths for beginners and premium batches for intensive training.",
    },
    {
      q: 'Do you offer hands-on training and practical labs?',
      a: 'Absolutely! We emphasize practical, hands-on learning with real-world scenarios, lab exercises, and CTF (Capture-The-Flag) challenges. Our H4K2LIV3_Academy team actively participates in competitive cybersecurity events.',
    },
    {
      q: 'What topics are covered in the courses?',
      a: 'Our courses cover network fundamentals, enumeration, tools like Nmap, Metasploit, BurpSuite, Google Dorking, web application security, mobile penetration testing, Linux security, and much more. Both theoretical knowledge and practical skills are emphasized.',
    },
    {
      q: 'How can I enroll in HackToLive Academy?',
      a: 'You can enroll by visiting academy.hacktolive.net or contacting us at +880 1521-416287 or +880 1601-020699. We offer different course packages including free fundamental paths and premium training batches.',
    },
    {
      q: 'Do you provide cybersecurity services for businesses?',
      a: 'Yes, we provide professional cybersecurity services to businesses of all sizes. Our expert team can conduct penetration testing, vulnerability assessments, security audits, and provide ongoing SOC support. Contact us through our website or phone for a consultation.',
    },
  ],
}

export default faq
