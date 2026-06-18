import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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

const cookieTypes = [
  {
    category: 'By managing entity',
    items: [
      { name: 'Own Cookies', desc: 'Cookies sent to the user\'s terminal from a device or domain managed by the publisher itself, from which the requested service is provided.' },
      { name: 'Third-Party Cookies', desc: 'Cookies sent to the user\'s terminal from a device or domain not managed by the publisher, but by another entity that processes the data obtained through cookies.' },
    ],
  },
  {
    category: 'By duration',
    items: [
      { name: 'Session Cookies', desc: 'Designed to collect and store data while the user accesses a web page. They disappear when the session ends.' },
      { name: 'Persistent Cookies', desc: 'Cookies where data remains stored on the terminal and can be accessed for a period defined by the cookie controller, ranging from a few minutes to several years.' },
    ],
  },
  {
    category: 'By purpose',
    items: [
      { name: 'Technical Cookies', desc: 'Allow the user to navigate a web page and use the various features or services available on it.' },
      { name: 'Personalisation Cookies', desc: 'Allow the application of specific features to enhance the user\'s browsing experience (e.g. language preferences).' },
      { name: 'Analytics Cookies', desc: 'Allow tracking and analysis of user behaviour on the websites to which they are linked, in order to make improvements based on usage data.' },
      { name: 'Advertising Cookies', desc: 'Allow the publisher to include advertising spaces on the web page, based on the content of the site.' },
      { name: 'Behavioural Advertising Cookies', desc: 'Store information about user behaviour gathered through continuous observation of browsing habits, enabling the development of a specific profile to display targeted advertising.' },
    ],
  },
]

const browsers = [
  { name: 'Firefox', url: 'https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en' },
  { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647?hl=es' },
  { name: 'Internet Explorer', url: 'https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies' },
  { name: 'Microsoft Edge', url: 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
  { name: 'Safari', url: 'https://support.apple.com/kb/ph17191?locale=es_ES' },
  { name: 'Opera', url: 'https://help.opera.com/en/latest/web-preferences/#cookies' },
]

export default function PoliticaCookies() {
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
            LSSI-CE · Art. 22.2
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
            Cookie <span className="text-orange-500">Policy</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Full information about the cookies used on <strong>www.evenos-tech.com</strong> and how to manage them.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">

        <Section title="What are cookies?">
          <p>
            In accordance with Article 22.2 of Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSI-CE), <strong>EVENOR TECH, S.L.U.</strong> provides information about the cookies it uses and their purposes.
          </p>
          <p>
            This website uses cookies and/or similar technologies that store and retrieve information when you browse. Cookies allow, among other things, the storage and retrieval of information about a user's browsing habits or device, and may be used to recognise the user and improve their experience.
          </p>
          <p>
            Cookies are essential to the functioning of the Internet, providing countless advantages in the provision of interactive services and improving the navigation and usability of our website.
          </p>
          <p className="text-xs text-gray-500 bg-orange-50 rounded-xl p-3 border border-orange-100">
            <strong>Custom settings:</strong> You can update your cookie preferences at any time via the cookie management button in the footer.
          </p>
        </Section>

        {/* Tipos de cookies */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gray-800 px-6 py-4">
            <h2 className="text-white font-bold text-base sm:text-lg">Cookie Types</h2>
          </div>
          <div className="p-6 space-y-6">
            {cookieTypes.map(({ category, items }) => (
              <div key={category}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">{category}</h3>
                <div className="space-y-3">
                  {items.map(({ name, desc }) => (
                    <div key={name} className="flex gap-3">
                      <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-orange-400" />
                      <p className="text-sm text-gray-600">
                        <strong className="text-gray-800">{name}:</strong> {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabla cookies propias */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-white font-bold text-base sm:text-lg">Own Cookies</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Owner</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Cookie</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Purpose</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Retention</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: 'Technical', titular: 'EVENOR TECH, S.L.U.', cookie: 'cookieConsent', finalidad: 'Stores the user\'s cookie consent preferences.', conservacion: '1 year' },
                  { tipo: 'Technical', titular: 'EVENOR TECH, S.L.U.', cookie: 'session', finalidad: 'Keeps the logged-in user\'s session active.', conservacion: 'Session' },
                  { tipo: 'Analytics', titular: 'Google Analytics', cookie: '_ga, _gid', finalidad: 'Collects statistical data on website usage for analysis and continuous improvement.', conservacion: '2 years / 24h' },
                  { tipo: 'Behavioural advertising', titular: 'Google', cookie: '_gcl_au', finalidad: 'Measures advertising conversions and browsing behaviour for personalisation.', conservacion: '3 months' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3 font-semibold text-orange-600 whitespace-nowrap">{row.tipo}</td>
                    <td className="px-4 py-3 text-gray-700">{row.titular}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 text-xs">{row.cookie}</td>
                    <td className="px-4 py-3 text-gray-600">{row.finalidad}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.conservacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-6 py-3 text-xs text-gray-400 italic border-t border-gray-100">
            This table will be updated periodically as cookie usage on the website is reviewed.
          </p>
        </motion.div>

        {/* Tabla cookies de terceros */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gray-700 px-6 py-4">
            <h2 className="text-white font-bold text-base sm:text-lg">Third-Party Cookies</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Type</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Owner</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Cookie</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Purpose</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Retention</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tipo: 'Analytics', titular: 'Google Analytics', cookie: '_ga_*', finalidad: 'Statistical analysis of user behaviour to improve site performance.', conservacion: '2 years' },
                  { tipo: 'Behavioural advertising', titular: 'Google Ads', cookie: 'NID, 1P_JAR', finalidad: 'Ad personalisation and conversion tracking based on browsing habits.', conservacion: '6 months' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-3 font-semibold text-orange-600 whitespace-nowrap">{row.tipo}</td>
                    <td className="px-4 py-3 text-gray-700">{row.titular}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 text-xs">{row.cookie}</td>
                    <td className="px-4 py-3 text-gray-600">{row.finalidad}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{row.conservacion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-6 py-3 text-xs text-gray-400 italic border-t border-gray-100">
            You can find information about any international transfers made by the third parties identified in this policy in their respective privacy policies.
          </p>
        </motion.div>

        <Section title="Accepting, Rejecting and Revoking Consent">
          <p>
            On your first visit to the website, an information notice will appear where you can:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Accept all</strong> cookies by clicking the corresponding button.</li>
            <li><strong>Reject all</strong> non-technical cookies by clicking the reject button.</li>
            <li><strong>Configure</strong> your preferences on a granular, category-by-category basis.</li>
          </ul>
          <p>
            You can also revoke your consent at any time and manage your cookie settings via the settings icon permanently available in the footer.
          </p>
          <p>
            If you accept third-party cookies, you will need to delete them through your browser settings or via the mechanism provided by the third party itself.
          </p>
        </Section>

        <Section title="Managing Cookies via Your Browser">
          <p>
            You can change your browser's cookie settings using the following links:
          </p>
          <ul className="space-y-2">
            {browsers.map(({ name, url }) => (
              <li key={name}>
                <strong className="text-gray-700">{name}:</strong>{' '}
                <a href={url} target="_blank" rel="noopener noreferrer"
                  className="text-orange-500 underline hover:text-orange-600 transition-colors break-all text-xs">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Further Information">
          <p>
            For more information about how we process personal data, please visit our{' '}
            <Link to="/politica-privacidad" className="text-orange-500 underline hover:text-orange-600 transition-colors font-semibold">
              Privacy Policy
            </Link>.
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
