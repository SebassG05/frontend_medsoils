import { motion } from 'framer-motion'
import Footer from '../components/layout/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: d } }),
}

const Section = ({ title, children }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-3"
  >
    <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">
      {title}
    </h2>
    <div className="text-sm sm:text-base text-gray-600 leading-relaxed space-y-3 pl-1">
      {children}
    </div>
  </motion.div>
)

const RightItem = ({ title, children }) => (
  <li className="flex gap-3">
    <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
      <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </span>
    <div>
      <strong className="text-gray-800">{title}:</strong>{' '}
      <span className="text-gray-600">{children}</span>
    </div>
  </li>
)

export default function PoliticaPrivacidad() {
  return (
    <>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-50 via-white to-gray-50 py-16 sm:py-20 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-200 rounded-full blur-2xl opacity-25" />
        </div>
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="relative max-w-3xl mx-auto text-center"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-widest uppercase mb-4">
            GDPR · Data Protection
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
            Privacy <span className="text-orange-500">Policy</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Information on how we process personal data on <strong>www.evenos-tech.com</strong> and on our social media channels.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">

        {/* Datos del responsable */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-white font-bold text-base sm:text-lg">Data Controller</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              ['Company Name', 'EVENOR TECH, S.L.U.'],
              ['Tax ID (NIF)', 'B91790527'],
              ['Domain', 'www.evenos-tech.com'],
              ['Postal Address', 'Avda. República Argentina, 27 B · 41011 Sevilla (Spain)'],
              ['Email', 'info@evenor-tech.com'],
              ['Phone', '651 549 721'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row sm:items-center px-6 py-3 gap-1 sm:gap-0">
                <span className="sm:w-44 text-xs font-bold uppercase tracking-wide text-gray-400 shrink-0">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <Section title="General Information">
          <p>
            In accordance with current data protection regulations, we inform you that your data will be incorporated into the processing system owned by <strong>EVENOR TECH, S.L.U.</strong>, Tax ID B91790527, registered at Avda. República Argentina, 27 B, 41011 Sevilla, Spain.
          </p>
        </Section>

        {/* Tratamientos realizados */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-white font-bold text-base sm:text-lg">Processing Activities</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              {
                label: 'Commercial actions · web form',
                finalidad: 'Collection, registration and processing of data to handle your queries and/or requests, as well as for advertising and commercial prospecting.',
                plazo: 'For as long as consent is maintained, unless a legal obligation requires otherwise.',
                base: 'Consent of the data subject.',
                datos: 'Full name, Email address.',
              },
              {
                label: 'User account management',
                finalidad: 'Collection, registration and processing of user data.',
                plazo: 'For as long as consent is maintained, unless a legal obligation requires otherwise.',
                base: 'Consent of the data subject.',
                datos: 'Full name, Email address.',
              },
              {
                label: 'Newsletter',
                finalidad: 'Management of newsletter subscriptions and sending of relevant communications.',
                plazo: 'For as long as consent is maintained.',
                base: 'Consent of the data subject.',
                datos: 'Full name, Email address.',
              },
              {
                label: 'Cookie installation',
                finalidad: 'Management and installation of cookies.',
                plazo: 'For as long as consent is maintained.',
                base: 'Consent of the data subject.',
                datos: 'Email address, IP address.',
              },
              {
                label: 'Contact form management',
                finalidad: 'Handling your queries and/or requests.',
                plazo: 'For as long as consent is maintained.',
                base: 'Consent of the data subject.',
                datos: 'Full name, Email address, IP address.',
              },
            ].map(({ label, finalidad, plazo, base, datos }) => (
              <div key={label} className="p-5 sm:p-6 space-y-2">
                <h3 className="text-sm font-bold text-gray-800">{label}</h3>
                <p className="text-xs text-gray-600"><span className="font-semibold text-gray-700">Purpose:</span> {finalidad}</p>
                <p className="text-xs text-gray-600"><span className="font-semibold text-gray-700">Retention period:</span> {plazo}</p>
                <p className="text-xs text-gray-600"><span className="font-semibold text-gray-700">Legal basis:</span> {base}</p>
                <p className="text-xs text-gray-600"><span className="font-semibold text-gray-700">Data categories:</span> {datos}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data subject rights */}
        <Section title="Your Rights">
          <p>
            EVENOR TECH, S.L.U. informs users that they may exercise the following rights against the Data Controller:
          </p>
          <ul className="space-y-3 mt-2">
            <RightItem title="Right of Access">
              Obtain confirmation of whether your personal data is being processed and, if so, access the specific data and legal information about the processing.
            </RightItem>
            <RightItem title="Right of Rectification">
              Request the correction of data that is inaccurate or incomplete.
            </RightItem>
            <RightItem title="Right to Restriction of Processing">
              Restrict the purposes of processing originally intended by the controller in certain circumstances.
            </RightItem>
            <RightItem title="Right to Erasure">
              Request deletion of your personal data, except where retention is required under the GDPR.
            </RightItem>
            <RightItem title="Right to Data Portability">
              Receive your personal data in a structured, commonly used and machine-readable format, and transmit it to another controller.
            </RightItem>
            <RightItem title="Right to Object">
              Object to the processing of your data where it is based on legitimate interest or direct marketing purposes.
            </RightItem>
            <RightItem title="Right not to be subject to automated decisions">
              Including profiling, where the processing is not necessary for the performance of a contract.
            </RightItem>
            <RightItem title="Right to withdraw consent">
              For any processing based on your consent, you may withdraw it at any time, free of charge.
            </RightItem>
          </ul>
        </Section>

        <Section title="How to Exercise Your Rights">
          <p>
            To exercise any of the rights described above, you may:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Send a written request to: <strong>Avda. República Argentina, 27 B · 41011 Sevilla, Spain</strong>, for the attention of EVENOR TECH, S.L.U.
            </li>
            <li>
              Or send an email to:{' '}
              <a href="mailto:info@evenor-tech.com" className="text-orange-500 underline hover:text-orange-600 transition-colors">
                info@evenor-tech.com
              </a>
            </li>
          </ul>
          <p>
            Requests must include verifiable identification, the specific right you wish to exercise and a postal or email address for notifications.
          </p>
          <p>
            You also have the right to lodge a <strong>complaint with the Spanish Data Protection Agency (AEPD)</strong> if you consider that a breach of data protection regulations has occurred.
          </p>
        </Section>

        {/* Social Media */}
        <Section title="Social Media Privacy Policy">
          <p>
            In accordance with current regulations, EVENOR TECH, S.L.U. informs users that it has created profiles on <strong>Facebook, X (Twitter), Instagram and LinkedIn</strong>, with the primary purpose of promoting its products and services.
          </p>
          <p>
            By joining our page on any of these social networks, the user grants consent for the processing of personal data published on their public profile. EVENOR TECH, S.L.U. only accesses and processes the user's public information (contact name), which is used solely within the social network itself and is not incorporated into any other processing system.
          </p>
          <p>EVENOR TECH, S.L.U. may carry out the following actions on social media:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Access to the user's public profile information.</li>
            <li>Publishing on the user's profile information already published on our page.</li>
            <li>Sending personal messages through social network channels.</li>
            <li>Page status updates published on the user's profile.</li>
          </ul>
          <p>Any publication on our page that is contrary to morals, ethics, good taste or decorum, or that infringes intellectual or industrial property rights, is expressly prohibited.</p>
          <p className="font-medium text-gray-700">Social network privacy policies:</p>
          <ul className="space-y-1.5">
            {[
              ['Facebook', 'https://es-es.facebook.com/privacy/explanation'],
              ['X (Twitter)', 'https://x.com/es/privacy'],
              ['Instagram', 'https://instagram.com/about/legal/privacy/'],
              ['LinkedIn', 'https://es.linkedin.com/legal/privacy-policy'],
            ].map(([name, url]) => (
              <li key={name}>
                <span className="font-semibold text-gray-700">{name}:</span>{' '}
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-orange-500 underline hover:text-orange-600 transition-colors break-all text-xs">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Security Measures">
          <p>
            EVENOR TECH, S.L.U. undertakes to adopt the necessary technical and organisational measures, appropriate to the risk level of the processing activities, to guarantee their <strong>integrity, confidentiality and availability</strong>.
          </p>
        </Section>

        {/* Last updated */}
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center text-xs text-gray-400"
        >
          <strong>Last updated:</strong> 4 May 2026
        </motion.p>
      </div>

      <Footer />
    </>
  )
}
