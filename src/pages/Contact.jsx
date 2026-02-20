import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Mail, MessageSquare, MapPin, Phone, Clock, CheckCircle, Globe, Tag, FileText } from 'lucide-react'
import Select from 'react-select'
import Footer from '../components/layout/Footer'
import { submitContactForm } from '../services/contactService'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const contactInfo = [
  {
    icon: MapPin,
    label: 'Location',
    value: 'Europe',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'Email',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 123-456-7890 / +1 123-456-7891'
  },
  {
    icon: Clock,
    label: 'Work hours ',
    value: 'Mon-Thu: 9:00-4:00 Fri-Sat: 9:00-3:00 Sun: Closed',
  },
]

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
  'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
  'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)',
  'Costa Rica','Croatia','Cuba','Cyprus','Czechia','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador',
  'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France',
  'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau',
  'Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland',
  'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar',
  'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
  'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal',
  'Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan',
  'Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
  'Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
  'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden',
  'Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States',
  'Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
].map(c => ({ value: c, label: c }))

const ENQUIRY_TYPES = [
  { value: 'General enquiry', label: 'General enquiry' },
  { value: 'Application / Admission', label: 'Application / Admission' },
  { value: 'Scholarships', label: 'Scholarships' },
  { value: 'Academic partnership', label: 'Academic partnership' },
  { value: 'Media / Press', label: 'Media / Press' },
  { value: 'Other', label: 'Other' },
]

const selectStyles = (hasError) => ({
  control: (base, state) => ({
    ...base,
    minHeight: '46px',
    borderRadius: '12px',
    backgroundColor: hasError ? '#fef2f2' : state.isFocused ? '#ffffff' : '#f9fafb',
    borderColor: hasError ? '#f87171' : state.isFocused ? 'transparent' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px #fb923c' : 'none',
    '&:hover': { borderColor: hasError ? '#f87171' : '#fdba74' },
    transition: 'all 0.2s',
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: '14px' }),
  singleValue: (base) => ({ ...base, color: '#111827', fontSize: '14px' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#f97316' : state.isFocused ? '#fff7ed' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    fontSize: '14px',
    cursor: 'pointer',
  }),
  menu: (base) => ({ ...base, borderRadius: '12px', overflow: 'hidden', zIndex: 50 }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: '#9ca3af' }),
})

const InputField = ({ id, label, icon: Icon, type = 'text', placeholder, value, onChange, error }) => (
  <motion.div variants={itemVariants} className="relative">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all duration-200
          focus:bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-300'}`}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1 text-xs text-red-500"
      >
        {error}
      </motion.p>
    )}
  </motion.div>
)

const Contact = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', country: null, enquiryType: state?.enquiryType ?? null, enquiryOther: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required.'
    if (!form.email.trim()) newErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email.'
    if (!form.country) newErrors.country = 'Please select your country.'
    if (!form.enquiryType) newErrors.enquiryType = 'Please select a type of enquiry.'
    if (form.enquiryType?.value === 'Other' && !form.enquiryOther.trim()) newErrors.enquiryOther = 'Please specify your enquiry type.'
    if (!form.message.trim()) newErrors.message = 'Message cannot be empty.'
    return newErrors
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setServerError('')
    try {
      await submitContactForm(form)
      setSubmitted(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ name: '', email: '', subject: '', message: '', country: null, enquiryType: null, enquiryOther: '' })
    setErrors({})
    setSubmitted(false)
    setServerError('')
  }

  return (
    <>
    <div className="min-h-screen bg-white py-20 px-4 relative overflow-hidden">
      {/* Blob background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Cyan blob 1 — back: large triangular/shield shape */}
        <svg
          className="absolute -top-16 -right-16 w-[820px] h-[820px] opacity-[0.22]"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#7dd3d8"
            d="M680,60
               C740,110 770,210 760,330
               C750,450 690,560 590,630
               C490,700 360,720 250,680
               C140,640 70,540 50,410
               C30,280 90,150 200,90
               C280,50 370,30 470,40
               C570,50 640,30 680,60Z"
          />
        </svg>
        {/* Cyan blob 2 — front: rounder, tighter, slightly more opaque */}
        <svg
          className="absolute -top-24 right-0 w-[600px] h-[600px] opacity-[0.30]"
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#a5f3fc"
            d="M570,90
               C615,155 620,270 585,375
               C550,480 470,560 370,588
               C270,615 160,580 100,500
               C40,420 45,300 80,200
               C115,100 210,38 330,28
               C450,18 530,30 570,90Z"
          />
        </svg>
        {/* Cyan blob 3 — bottom-left accent */}
        <svg
          className="absolute -bottom-24 -left-24 w-[480px] h-[480px] opacity-[0.14]"
          viewBox="0 0 480 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#67e8f9"
            d="M420,80
               C460,140 460,240 420,320
               C380,400 290,450 200,440
               C110,430 40,360 20,270
               C0,180 50,80 140,40
               C200,15 280,10 350,30
               C400,45 400,50 420,80Z"
          />
        </svg>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold tracking-wide mb-4">
            GET IN TOUCH
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Contact{' '}
            <span className="text-orange-500">
              Us
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Have questions about MedSoils? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4 relative flex flex-col">
            {/* Background glow behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-200 via-teal-100 to-sky-200 rounded-3xl opacity-60 blur-2xl -z-10" />
            <div className="absolute -inset-2 bg-gradient-to-tr from-teal-200 to-cyan-300 rounded-3xl opacity-25 blur-xl -z-10" />
            <div className="bg-white rounded-2xl p-7 shadow-xl shadow-orange-100/60 border border-orange-200 ring-1 ring-orange-100 relative overflow-hidden">
              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-red-400 to-orange-300 rounded-l-2xl" />
              <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Contact Information</h2>
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-orange-100 to-red-100 border border-orange-200 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-orange-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                      <p className="text-gray-700 font-semibold text-sm mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map box — grows to fill remaining height */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-orange-200 shadow-xl shadow-orange-100/60 min-h-[200px]">
              <iframe
                title="MedSoils Europe Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d22697671.38!2d15.0!3d50.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ses!4v1708000000000!5m2!1sen!2ses"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '200px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl shadow-orange-200/70 border border-orange-200 ring-1 ring-orange-100 p-8 flex-1" style={{ boxShadow: '0 0 40px 8px rgba(251,146,60,0.18), 0 8px 32px 0 rgba(251,146,60,0.10)' }}>
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-200"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 max-w-xs">
                      Your message was sent successfully. Redirecting you back to home…
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <InputField
                        id="name"
                        label="Full Name"
                        icon={User}
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={handleChange('name')}
                        error={errors.name}
                      />
                      <InputField
                        id="email"
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={handleChange('email')}
                        error={errors.email}
                      />  
                    </div>

                    {/* Country */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        <span className="inline-flex items-center gap-1.5"><Globe className="w-4 h-4 text-gray-400" />Address / Country</span>
                      </label>
                      <Select
                        inputId="country"
                        options={COUNTRIES}
                        value={form.country}
                        onChange={(opt) => {
                          setForm(prev => ({ ...prev, country: opt }))
                          if (errors.country) setErrors(prev => ({ ...prev, country: '' }))
                        }}
                        placeholder="Search your country…"
                        styles={selectStyles(!!errors.country)}
                        isSearchable
                      />
                      {errors.country && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-red-500">{errors.country}</motion.p>
                      )}
                    </motion.div>

                    {/* Type of Enquiry */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        <span className="inline-flex items-center gap-1.5"><Tag className="w-4 h-4 text-gray-400" />Type of Enquiry</span>
                      </label>
                      <Select
                        inputId="enquiryType"
                        options={ENQUIRY_TYPES}
                        value={form.enquiryType}
                        onChange={(opt) => {
                          setForm(prev => ({ ...prev, enquiryType: opt, enquiryOther: '' }))
                          if (errors.enquiryType) setErrors(prev => ({ ...prev, enquiryType: '', enquiryOther: '' }))
                        }}
                        placeholder="Select enquiry type…"
                        styles={selectStyles(!!errors.enquiryType)}
                        isSearchable={false}
                      />
                      {errors.enquiryType && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-xs text-red-500">{errors.enquiryType}</motion.p>
                      )}
                    </motion.div>

                    {/* Other enquiry — conditional */}
                    <AnimatePresence>
                      {form.enquiryType?.value === 'Other' && (
                        <motion.div
                          key="enquiry-other"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            <span className="inline-flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-gray-400" />
                              Please specify your enquiry
                            </span>
                          </label>
                          <div className="relative group">
                            <input
                              id="enquiryOther"
                              type="text"
                              value={form.enquiryOther}
                              onChange={handleChange('enquiryOther')}
                              placeholder="Describe your enquiry type…"
                              className={`w-full pl-4 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all duration-200
                                focus:bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent
                                ${errors.enquiryOther ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-300'}`}
                            />
                          </div>
                          {errors.enquiryOther && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-red-500"
                            >
                              {errors.enquiryOther}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <InputField
                      id="subject"
                      label="Subject (optional)"
                      icon={MessageSquare}
                      placeholder="What's this about?"
                      value={form.subject}
                      onChange={handleChange('subject')}
                      error={errors.subject}
                    />

                    <motion.div variants={itemVariants} className="relative">
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange('message')}
                        placeholder="Tell us about your project or inquiry..."
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none resize-none transition-all duration-200
                          focus:bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent
                          ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-300'}`}
                      />
                      {errors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-xs text-red-500"
                        >
                          {errors.message}
                        </motion.p>
                      )}
                      <span className="absolute bottom-3 right-3 text-xs text-gray-300 select-none">
                        {form.message.length} chars
                      </span>
                    </motion.div>

                    {serverError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 text-center bg-red-50 border border-red-200 rounded-xl py-2 px-4"
                      >
                        {serverError}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full relative flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                    >
                      {loading && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-50"
                          animate={{ x: ['0%', '100%'] }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
    <Footer />
    </>
  )
}

export default Contact
