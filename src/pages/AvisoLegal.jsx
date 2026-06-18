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

export default function AvisoLegal() {
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
            LSSI-CE · Art. 10
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
            Legal <span className="text-orange-500">Notice</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Legal information for <strong>www.evenos-tech.com</strong> in accordance with Law 34/2002 on Information Society Services.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">

        {/* Datos identificativos */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-white font-bold text-base sm:text-lg">Website Owner Details</h2>
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

        <Section title="Introduction">
          <p>
            In compliance with Law 34/2002, of 11 July, on Information Society Services and Electronic Commerce (LSSI-CE), <strong>EVENOR TECH, S.L.U.</strong> hereby informs that it is the owner of the website <strong>www.evenos-tech.com</strong>.
          </p>
        </Section>

        <Section title="User Responsibilities">
          <p>
            Browsing, accessing or using the EVENOR TECH, S.L.U. website confers the status of <strong>user</strong>. The website provides a wide variety of information, services and data. The user assumes responsibility for its correct use, which extends to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>The truthfulness and legality of information provided in forms when accessing certain content or services.</li>
            <li>The use of information, services and data offered in a manner contrary to these conditions, the law, morals, good customs or public order, or in any way that may cause harm to third parties or to the proper functioning of the website.</li>
          </ul>
        </Section>

        <Section title="Links Policy and Disclaimer">
          <p>
            EVENOR TECH, S.L.U. is not responsible for the content of websites accessible via links on its site, as long as it has no actual knowledge that the linked activity or information is unlawful or harmful to the rights of third parties.
          </p>
          <p>
            EVENOR TECH, S.L.U. declares having adopted all necessary measures to prevent any harm to users arising from browsing its website. Consequently, it accepts no liability for any damage the user may suffer from browsing the Internet.
          </p>
        </Section>

        <Section title="Modifications">
          <p>
            EVENOR TECH, S.L.U. reserves the right to make, at any time and without prior notice, modifications and updates to the information contained on its website or its configuration and presentation. Content may be modified, corrected, deleted or added at any time.
          </p>
        </Section>

        <Section title="Pricing">
          <p>
            Where prices of products and/or services are shown, those displayed on screen will be current prices. Prices will be quoted in euros and will include Value Added Tax (VAT). Where VAT is not included, this will be expressly indicated and the user will be able to view the full final price.
          </p>
        </Section>

        <Section title="Intellectual and Industrial Property">
          <p>
            EVENOR TECH, S.L.U., by itself or as assignee, holds all intellectual and industrial property rights to its website and its contents (images, sound, audio, video, software or text; trademarks or logos, colour combinations, structure and design, etc.).
          </p>
          <p>
            <strong>All rights reserved.</strong> Under the Intellectual Property Act, reproduction, distribution and public communication of all or part of this website's content for commercial purposes, in any medium and by any technical means, without authorisation from EVENOR TECH, S.L.U. is expressly prohibited.
          </p>
          <p>
            Users may view website elements and may print, copy and store them on their computer's hard drive solely and exclusively for personal and private use.
          </p>
        </Section>

        <Section title="Legal Actions, Applicable Law and Jurisdiction">
          <p>
            Users wishing to submit a complaint should contact us at{' '}
            <a href="mailto:info@evenor-tech.com" className="text-orange-500 hover:text-orange-600 underline transition-colors">info@evenor-tech.com</a>.
            EVENOR TECH, S.L.U. also maintains official complaint forms available to consumers and users.
          </p>
          <p>
            EVENOR TECH, S.L.U. reserves the right to bring civil or criminal actions it deems appropriate for improper use of its website and content, or for breach of these conditions.
          </p>
          <p>
            The relationship between the user and the service provider shall be governed by current Spanish law. Should any dispute arise, the parties may submit their conflicts to arbitration or to the ordinary courts of justice.
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
