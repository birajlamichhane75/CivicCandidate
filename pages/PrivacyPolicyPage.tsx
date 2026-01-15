
import React, { useEffect } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8 md:p-12">
        <div className="mb-8 border-b border-slate-100 pb-6">
           <h1 className="text-3xl font-bold text-slate-900 flex items-center mb-2">
             <FaShieldAlt className="mr-3 text-[#0094da]" />
             Privacy Policy & Terms of Use
           </h1>
           <p className="text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-slate max-w-none font-english text-sm md:text-base leading-relaxed">
          <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3">Civic Candidate</h2>
          <p>
            Civic Candidate is committed to protecting the privacy of citizens, candidates, and public participants who use our platform. This Privacy Policy explains how Civic Candidate collects, uses, stores, and safeguards your personal information when you use our web application.
          </p>
          <p>By using Civic Candidate, you agree to the practices described in this Privacy Policy.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Legal Basis and Privacy Principles</h3>
          <p>
            Civic Candidate follows privacy principles aligned with Nepal’s Individual Privacy Act, 2018 (“Privacy Act”), which governs how personal information should be handled responsibly.
          </p>
          <p>
            These principles guide how we collect, use, disclose, secure, and dispose of personal information in a lawful, fair, and transparent manner.
          </p>
          <p>
            A copy of the Privacy Act can be obtained from the Nepal Law Commission website: <a href="http://www.lawcommission.gov.np" target="_blank" rel="noopener noreferrer" className="text-[#0094da] hover:underline">http://www.lawcommission.gov.np</a>
          </p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. What is Personal Information and Why We Collect It</h3>
          <p>Personal Information is information or an opinion that identifies an individual.</p>
          <p>While using Civic Candidate, we may collect limited personal information including, but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Full name</li>
            <li>Mobile number</li>
            <li>Address or constituency information</li>
            <li>Age confirmation for voter eligibility</li>
            <li>Government-issued identification (for verification purposes only, where required)</li>
          </ul>
          <p>We collect this information solely for the purpose of:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Verifying that a user is a real, eligible citizen of a specific constituency</li>
            <li>Ensuring “one person = one civic identity” on the platform</li>
            <li>Enabling citizens to view, support, and engage with candidates from their own area</li>
            <li>Allowing candidates to present their vision, background, and commitments transparently</li>
          </ul>
          <p>Civic Candidate does not create or generate official government records. It acts only as a civic participation platform that enables structured communication between citizens and candidates.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">3. Information Collection and Use</h3>
          <p>For a better and more trustworthy experience, Civic Candidate may require users to provide certain personally identifiable information.</p>
          <p>Information provided by citizens is used to confirm constituency eligibility and prevent misuse of the platform.</p>
          <p>Information provided by candidates is used to display their public profile, vision, and commitments to citizens.</p>
          <p>Any verification information collected is used only for verification purposes and not for profiling, marketing, or commercial use.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">4. Verification Data Handling</h3>
          <p>Certain verification documents or details may be requested to confirm:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Citizenship eligibility</li>
            <li>Age eligibility to vote</li>
            <li>Constituency correctness</li>
          </ul>
          <p>These details are:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Used only to verify eligibility</li>
            <li>Accessed only by authorized administrators</li>
            <li>Not shared with third parties</li>
            <li>Removed or restricted once verification is complete, where technically feasible</li>
          </ul>
          <p>Civic Candidate does not use verification data for any purpose other than maintaining platform integrity.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">5. Sensitive Information</h3>
          <p>Sensitive information includes data such as political opinions, religious beliefs, ethnic origin, health information, or criminal records.</p>
          <p>Civic Candidate does not request or collect sensitive personal information unless explicitly required for lawful verification purposes.</p>
          <p>We do not sell, rent, or share any personal or sensitive information with third parties, whether public or private.</p>
          <p>Sensitive information, if ever collected, will be used only:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>For the primary purpose for which it was provided</li>
            <li>With user consent, or</li>
            <li>When required by law</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">6. Security of Personal Information</h3>
          <p>Civic Candidate takes reasonable technical and organizational measures to protect personal information from:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Unauthorized access</li>
            <li>Misuse or loss</li>
            <li>Alteration or disclosure</li>
          </ul>
          <p>Personal information is stored securely and access is limited to authorized personnel only.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">7. Access to and Correction of Personal Information</h3>
          <p>Users may request access to the personal information we hold about them and may request corrections if the information is inaccurate or outdated.</p>
          <p>To protect user privacy, we may require identity confirmation before responding to such requests.</p>
          <p>Civic Candidate does not charge any fee for accessing personal information, except for any internet or service costs incurred by the user.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">8. Maintaining Information Accuracy</h3>
          <p>Civic Candidate aims to keep personal information accurate, complete, and up to date.</p>
          <p>If you believe that any information we hold is incorrect or outdated, please notify us so it can be corrected.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">9. Links to Other Websites</h3>
          <p>Civic Candidate may contain links to third-party websites or services for reference or convenience.</p>
          <p>We do not control and are not responsible for the privacy practices, content, or reliability of those external sites. Users are encouraged to review the privacy policies of any third-party websites they visit.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">10. Log Data</h3>
          <p>In case of system errors or technical issues, Civic Candidate may collect log data through standard analytics or monitoring tools.</p>
          <p>This log data may include:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Device IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Time and date of access</li>
            <li>Pages visited</li>
          </ul>
          <p>This data is used only for system security, debugging, and performance improvement.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">11. Cookies</h3>
          <p>Civic Candidate may use cookies or similar technologies to improve user experience and maintain session security.</p>
          <p>Users may choose to disable cookies in their browser settings, but doing so may limit some features of the platform.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">12. Service Providers</h3>
          <p>Civic Candidate may use trusted third-party service providers (such as hosting or analytics services) to support platform operations.</p>
          <p>These providers:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Have access only to information necessary to perform their services</li>
            <li>Are contractually obligated to protect user data</li>
            <li>Are not permitted to use data for any other purpose</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">13. Children’s Privacy</h3>
          <p>Civic Candidate does not knowingly collect personal information from individuals under the age of 13.</p>
          <p>If we discover that a child under 13 has provided personal information, we will take immediate steps to delete such data.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">14. User Responsibilities and Consent</h3>
          <p>By using Civic Candidate, you consent to this Privacy Policy.</p>
          <p>Users are responsible for:</p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Providing accurate information</li>
            <li>Using their own mobile number and identity</li>
            <li>Not impersonating others</li>
            <li>Not submitting false or misleading information</li>
          </ul>
          <p>Civic Candidate reserves the right to remove users who violate platform rules or provide false information.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">15. Policy Updates</h3>
          <p>This Privacy Policy may be updated from time to time to reflect legal, technical, or operational changes.</p>
          <p>Any updates will be posted on this page. Users are encouraged to review this policy periodically.</p>

          <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">16. Contact Information</h3>
          <p>If you have any questions or concerns regarding this Privacy Policy, please contact us at:</p>
          <p className="mt-2 font-bold">Civic Candidate Platform</p>
          <p>Email: <a href="mailto:civiccandidate@gmail.com" className="text-[#0094da] hover:underline">civiccandidate@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
